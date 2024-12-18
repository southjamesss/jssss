import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // Correct token name here
    if (token) {
      navigate('/home'); // If token exists, redirect to home page
    }
  }, [navigate]);

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);  // Clear previous errors
    setLoading(true); // Start loading

    try {
      const response = await axios.post('http://localhost:3000/login', { email, password });

      // Check if response is successful
      if (response.status === 200 && response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken); // Save accessToken
        localStorage.setItem('refreshToken', response.data.refreshToken); // Save refreshToken
        localStorage.setItem('userName', response.data.name || 'User'); // Save user name
        localStorage.setItem('userId', response.data.userId || ''); // Save user ID
        navigate('/home'); // Redirect to home page
      } else {
        throw new Error('Server did not send the correct data');
      }
    } catch (err) {
      // Display error messages
      const errorMessage =
        err.response?.data?.error || 'Unable to connect to the server. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Navigate to register page
  const handleRegister = () => navigate('/register');

  return (
    <div
      className="flex items-center justify-center h-screen w-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('/1.jpg')`, // Background image (ensure the file is in public folder)
      }}
    >
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 bg-white/30 backdrop-blur-md shadow-xl rounded-lg space-y-6"
      >
        {error && (
          <div className="text-red-500 text-center text-lg font-semibold">
            {error}
          </div>
        )}

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

        <button
          type="submit"
          className={`w-full py-3 bg-indigo-600 text-white rounded-md ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700 active:bg-indigo-800'
          } focus:outline-none`}
          disabled={loading}
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>

        <button
          type="button"
          onClick={handleRegister}
          className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
        >
          สมัครสมาชิก
        </button>
      </form>
    </div>
  );
};

export default LoginForm;