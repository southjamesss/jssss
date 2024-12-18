import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000';

const CheckIn = ({ userId }) => {
  const [checkInHistory, setCheckInHistory] = useState([]); // ประวัติการเช็คชื่อ
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [error, setError] = useState(null); // ข้อผิดพลาด
  const [checkingIn, setCheckingIn] = useState(false); // สถานะการเช็คชื่อ
  const [notification, setNotification] = useState(''); // การแจ้งเตือน
  const [checkInStatus, setCheckInStatus] = useState(false); // สถานะการเช็คชื่อ

  // เรียกใช้เมื่อ userId มีค่า
  useEffect(() => {
    if (userId) {
      fetchCheckInHistory(); // ดึงข้อมูลประวัติการเช็คชื่อ
    } else {
      setLoading(false); // หากไม่มี userId หยุดการโหลด
    }
  }, [userId]);

  // ฟังก์ชันสำหรับรีเฟรช Token
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken'); // ดึง refreshToken
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken); // อัปเดต accessToken
        return data.accessToken;
      } else {
        throw new Error('ไม่สามารถรีเฟรช Token ได้');
      }
    } catch (error) {
      setError('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลประวัติการเช็คชื่อ
  const fetchCheckInHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('กรุณาเข้าสู่ระบบก่อน');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/checkInHistory/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        const newToken = await refreshToken(); // รีเฟรช Token
        return fetchCheckInHistory(newToken);
      }

      if (!response.ok) {
        throw new Error('ไม่สามารถโหลดประวัติการเช็คชื่อได้');
      }

      const data = await response.json();
      setCheckInHistory(data.history || []); // เก็บข้อมูลประวัติการเช็คชื่อ
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับเช็คชื่อ
  const handleCheckIn = async () => {
    setCheckingIn(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('กรุณาเข้าสู่ระบบก่อน');
        setCheckingIn(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.status === 401) {
        const newToken = await refreshToken(); // รีเฟรช Token
        return handleCheckIn(newToken);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'เช็คชื่อไม่สำเร็จ');
      }

      setNotification('เช็คชื่อสำเร็จ!');
      setCheckInStatus(true); // ตั้งสถานะการเช็คชื่อว่าเสร็จแล้ว
      fetchCheckInHistory(); // อัปเดตประวัติการเช็คชื่อ
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📅 เช็คชื่อ</h2>

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <button
            onClick={handleCheckIn}
            disabled={checkingIn || checkInStatus}
            className={`p-3 rounded-lg ${checkingIn ? 'bg-gray-400' : checkInStatus ? 'bg-green-500' : 'bg-green-600 hover:bg-green-500 text-white'}`}
          >
            {checkingIn ? 'กำลังเช็คชื่อ...' : checkInStatus ? 'เช็คชื่อแล้ว' : 'เช็คชื่อทันที'}
          </button>

          {notification && <p className="text-green-600 mt-4">{notification}</p>}

          {checkInStatus && (
            <section className="mt-6">
              <h3 className="text-xl font-semibold">ประวัติการเช็คชื่อ</h3>
              <ul className="list-disc pl-5">
                {checkInHistory.length > 0 ? (
                  checkInHistory.map((record, index) => (
                    <li key={index} className="mb-2">
                      <div>
                        <strong>วันที่: </strong>
                        {new Date(record.checkInDate).toLocaleDateString()} {/* แสดงวันที่ */}
                      </div>
                      <div>
                        <strong>สถานะ: </strong>
                        {record.isCheckedIn ? 'เช็คชื่อแล้ว' : 'ยังไม่ได้เช็คชื่อ'}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">ไม่พบประวัติการเช็คชื่อ</li>
                )}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default CheckIn;