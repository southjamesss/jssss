import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { startOfDay, endOfDay } from 'date-fns';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
  throw new Error('Environment variables JWT_SECRET and DATABASE_URL are required');
}

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;

// Helper Functions
const generateRefreshToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' }); // 30 days
const generateAccessToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' }); // 24 hours

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Database Connection
async function connectDB() {
  let retries = 5;
  while (retries) {
    try {
      await prisma.$connect();
      console.log('Connected to the database');
      break;
    } catch (error) {
      console.error('Database connection failed:', error.message || error);
      retries -= 1;
      if (retries === 0) {
        console.error('Could not connect to the database after multiple retries');
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds
    }
  }
}
connectDB();

// Routes
// Register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const refreshToken = generateRefreshToken(email);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        refreshToken,
      },
    });

    const accessToken = generateAccessToken(newUser.id);

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      name: newUser.name,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { email },
      data: { refreshToken },
    });

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      name: user.name,
    });
  } catch (error) {
    console.error('Login error:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
app.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    await prisma.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: null },
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check-in
app.post('/checkin', authenticateToken, async (req, res) => {
  try {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const existingCheckIn = await prisma.checkIn.findFirst({
      where: {
        userId: req.userId,
        checkInDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (existingCheckIn) {
      return res.status(400).json({ error: 'You have already checked in today' });
    }

    const newCheckIn = await prisma.checkIn.create({
      data: {
        userId: req.userId,
        checkInDate: new Date(),
      },
    });

    res.status(200).json({ message: 'Check-in successful!', checkIn: newCheckIn });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } 
});

// Refresh Token
app.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token is missing' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user.id);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh token error:', error.message || error);
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
});

// Check-in History
app.get('/checkInHistory/:userId', async (req, res) => {
  const { userId } = req.params; // รับค่า userId จาก params
  const { page = 1, limit = 10 } = req.query; // รับค่า page และ limit จาก query string

  // ตรวจสอบว่า userId เป็นตัวเลขหรือไม่
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const skip = (page - 1) * limit; // คำนวณจำนวนข้อมูลที่ข้ามไป
    const history = await prisma.checkIn.findMany({
      where: {
        userId: parseInt(userId), // แปลง userId เป็นตัวเลข (Int)
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { checkInDate: 'desc' },
    });

    const totalCount = await prisma.checkIn.count({
      where: { userId: parseInt(userId) },
    });

    res.status(200).json({
      history,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Check-in history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API สำหรับแชท
app.post('/chat', async (req, res) => {
  const { message, sender } = req.body; // ข้อความจากผู้ใช้และ sender (เช่น user)

  if (!message || !sender) {
    return res.status(400).json({ error: 'Message and sender are required' });
  }

  try {
    // ส่งข้อความไปยัง Rasa bot
    const response = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
      sender: sender,  // ใช้ sender จาก request (เช่น user)
      message: message, // ข้อความจากผู้ใช้
    });

    if (response.data && Array.isArray(response.data)) {
      // ส่งข้อความจาก Rasa Bot กลับ
      res.status(200).json({
        botResponse: response.data.map((msg) => msg.text).join(' '), // รวมข้อความตอบกลับจาก Rasa
      });
    } else {
      res.status(400).json({ error: 'No response from the bot' });
    }
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});