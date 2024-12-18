import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import CheckIn from './components/CheckIn';
import Practice from './components/Practice';
import ProgrammingPracticePage from './components/ProgrammingPracticePage';
import RegisterForm from './components/RegisterForm';
import Chat from './components/Chat'; // นำเข้า Chat component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUserName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');
    setIsLoggedIn(!!token);
    setUserName(storedUserName || '');
    setUserId(storedUserId || null);

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log('API Key:', apiKey); // แสดง API Key ใน console
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName('');
    setUserId(null);
  };

  return (
    <Router>
      <Routes>
        {/* เส้นทาง Login */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <LoginForm setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} setUserId={setUserId} />
            )
          }
        />
        {/* เส้นทาง Home */}
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home userName={userName} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* เส้นทาง Check-in */}
        <Route
          path="/check-in"
          element={isLoggedIn ? <CheckIn userId={userId} /> : <Navigate to="/login" />}
        />
        {/* เส้นทาง Practice */}
        <Route
          path="/practice"
          element={isLoggedIn ? <Practice /> : <Navigate to="/login" />}
        />
        {/* เส้นทาง Programming Practice */}
        <Route
          path="/programming-practice"
          element={isLoggedIn ? <ProgrammingPracticePage /> : <Navigate to="/login" />}
        />
        {/* เส้นทาง Register */}
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/home" /> : <RegisterForm />}
        />
        {/* เส้นทาง Chat */}
        <Route
          path="/chat"
          element={isLoggedIn ? <Chat setIsChatOpen={setIsLoggedIn} /> : <Navigate to="/login" />}
        />
        {/* เส้นทางเริ่มต้น */}
        <Route path="/" element={<Navigate to={isLoggedIn ? '/home' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;