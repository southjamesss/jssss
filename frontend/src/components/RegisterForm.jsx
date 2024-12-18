import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // สถานะการโหลด
  const navigate = useNavigate();

  // ฟังก์ชันสมัครสมาชิก
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ส่งข้อมูลไปยัง backend
      const response = await axios.post('http://localhost:3000/register', { name, email, password });

      console.log('Response:', response);

      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันไปที่หน้า Login
  const handleLogin = () => navigate('/login');

  return (
    <div
      className="flex items-center justify-center h-screen w-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('/1.jpg')`, // ใช้ path รูปภาพใน public folder
      }}
    >
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md p-8 bg-white/30 backdrop-blur-md shadow-xl rounded-lg space-y-6"
      >
        {/* ข้อความข้อผิดพลาด */}
        {error && <div className="text-red-500 text-center text-lg">{error}</div>}

        {/* อินพุตชื่อ */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">ชื่อ</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)} // เก็บค่าชื่อ
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="กรุณากรอกชื่อ"
            required
          />
        </div>

        {/* อินพุตอีเมล */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">อีเมล</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="กรุณากรอกอีเมล"
            required
          />
        </div>

        {/* อินพุตรหัสผ่าน */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">รหัสผ่าน</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="กรุณากรอกรหัสผ่าน"
            required
          />
        </div>

        {/* ปุ่มสมัครสมาชิก */}
        <button
          type="submit"
          className={`w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          disabled={loading}
        >
          {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
        </button>

        {/* ลิงค์ไปยังหน้า Login */}
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">มีบัญชีอยู่แล้ว? </span>
          <button
            type="button"
            onClick={handleLogin} // เมื่อกดปุ่มจะนำทางไปหน้า Login
            className="text-sm text-indigo-600 hover:underline"
          >
            เข้าสู่ระบบที่นี่
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;