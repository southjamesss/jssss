import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckIn from './CheckIn';
import Practice from './Practice';
import ProgrammingPracticePage from './ProgrammingPracticePage';
import Notes from './Notes'; // Import Notes component
import Chat from './Chat'; // Import Chat component

const Home = ({ handleLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false); // State for Chat visibility
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [isCheckInVisible, setIsCheckInVisible] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'th');
    const [selectedCategory, setSelectedCategory] = useState('All'); // State สำหรับหมวดหมู่
    const [videoProgress, setVideoProgress] = useState({}); // State สำหรับเก็บความคืบหน้าการรับชมวิดีโอ
    const navigate = useNavigate();

    const videoData = {
        KvNfS86KEA4: {
            title: { en: 'React Basics', th: 'พื้นฐาน React' },
            category: 'Frontend',
        },
        '8ey9-wWUJEE': {
            title: { en: 'TailwindCSS Basics', th: 'พื้นฐาน TailwindCSS' },
            category: 'Frontend',
        },
        'Kd8H1TQ8rKY': {
            title: { en: 'Prisma Basics', th: 'พื้นฐาน Prisma' },
            category: 'Database',
        },
        'Y3nMB6SxljA': {
            title: { en: 'MySQL Workbench Basics', th: 'พื้นฐาน MySQL Workbench' },
            category: 'Database',
        },
        'X3bQzBhRMKQ': {
            title: { en: 'Git & GitHub Basics', th: 'เรียนรู้การใช้งาน Git & GitHub' },
            category: 'Tools',
        },
        'pWF801h0bxA': {
            title: { en: 'Introduction to Docker', th: 'รู้จักกับ Docker' },
            category: 'DevOps',
        },
        'mDezAkh5gcE': {
            title: { en: 'Web Development with Node.js', th: 'พัฒนาเว็บด้วย Node.js' },
            category: 'Backend',
        },
    };

    const filteredVideos = Object.keys(videoData).filter((videoId) => {
        if (selectedCategory === 'All') return true;
        return videoData[videoId].category === selectedCategory;
    });

    useEffect(() => {
        const name = localStorage.getItem('userName');
        if (name) {
            setUserName(name);
        }
        setLoading(false);

        // Apply theme from localStorage
        document.documentElement.classList.toggle('dark', isDarkMode);

        // Set language from localStorage
        document.documentElement.lang = language === 'th' ? 'th' : 'en';
    }, [isDarkMode, language]);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const newTheme = !prev;
            localStorage.setItem('theme', newTheme ? 'dark' : 'light');
            return newTheme;
        });
    };

    const handleCheckInClick = () => {
        setIsCheckInVisible(true);
    };

    const toggleLanguage = () => {
        const newLanguage = language === 'th' ? 'en' : 'th';
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    const toggleChat = () => {
        setIsChatOpen((prev) => !prev);
    };

    const handleVideoProgress = (videoId, currentTime, duration) => {
        const progress = (currentTime / duration) * 100;
        setVideoProgress((prev) => ({
            ...prev,
            [videoId]: progress,
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`flex min-h-screen font-sans ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Sidebar */}
            <aside
                className={`w-64 bg-gradient-to-br from-gray-900 to-gray-800 text-white dark:text-gray-300 flex flex-col p-6 shadow-lg transition-transform duration-300 ease-in-out fixed top-0 left-0 h-full ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <h2 className="text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-lg tracking-wide font-serif dark:text-white">
                    🌀 M E N U
                </h2>
                <nav className="flex flex-col space-y-6">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center space-x-3 p-3 rounded-lg transition duration-200 hover:bg-blue-600 group"
                    >
                        <span className="text-lg font-medium group-hover:text-white dark:text-gray-300">🏠 {language === 'th' ? 'หน้าแรก' : 'Home'}</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 p-3 rounded-lg transition duration-200 hover:bg-red-600 group"
                    >
                        <span className="text-lg font-medium group-hover:text-white dark:text-gray-300">🔑 {language === 'th' ? 'ออกจากระบบ' : 'Logout'}</span>
                    </button>
                    <button
                        onClick={handleCheckInClick}
                        className="flex items-center space-x-3 p-3 rounded-lg transition duration-200 hover:bg-green-600 group"
                    >
                        <span className="text-lg font-medium group-hover:text-white dark:text-gray-300">📋 {language === 'th' ? 'เช็คชื่อ' : 'Check In'}</span>
                    </button>
                    <button
                        onClick={() => navigate('/practice')}
                        className="flex items-center space-x-3 p-3 rounded-lg transition duration-200 hover:bg-blue-600 group"
                    >
                        <span className="text-lg font-medium group-hover:text-white dark:text-gray-300">📝 {language === 'th' ? 'แบบฝึกหัด' : 'Exercises'}</span>
                    </button>
                    <button
                        onClick={() => navigate('/programming-practice')}
                        className="flex items-center space-x-3 p-3 rounded-lg transition duration-200 hover:bg-indigo-600 group"
                    >
                        <span className="text-lg font-medium group-hover:text-white dark:text-gray-300">🖥️ {language === 'th' ? 'ฝึกเขียนโปรแกรม' : 'Programming Practice'}</span>
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="flex items-center space-x-3 p-3 rounded-lg transition duration-200 hover:bg-yellow-600 group"
                    >
                        <span className="text-lg font-medium group-hover:text-white dark:text-gray-300">
                            {isDarkMode ? (language === 'th' ? '☀️ โหมดสว่าง' : '☀️ Light Mode') : (language === 'th' ? '🌙 โหมดมืด' : '🌙 Dark Mode')}
                        </span>
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center space-x-3 p-3 rounded-lg transition duration-200 hover:bg-purple-600 group"
                    >
                        <span className="text-lg font-medium group-hover:text-white dark:text-gray-300">
                            {language === 'th' ? '🌐 English' : '🌐 ภาษาไทย'}
                        </span>
                    </button>
                </nav>
                <div className="mt-auto text-center">
                    <p className="text-gray-400 text-sm dark:text-gray-400">© {new Date().getFullYear()} south.com</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 p-6 ml-64 ${isSidebarOpen ? '' : 'ml-0'}`}>
                <button
                    onClick={toggleSidebar}
                    className="mb-4 p-2 bg-indigo-500 text-white rounded-md lg:hidden"
                >
                    {isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
                </button>

                <h1 className="text-4xl font-bold mb-6 dark:text-white bg-white p-6 rounded-lg shadow-lg">
                    🎓 {language === 'th' ? 'ยินดีต้อนรับ' : 'Welcome'} {userName || (language === 'th' ? 'ผู้ใช้' : 'User')}
                </h1>

                {/* Search Bar */}
                <div className="absolute top-11 right-10">
                    <input
                        type="text"
                        placeholder={language === 'th' ? 'ค้นหา...' : 'Search...'}
                        className="p-3 w-64 bg-white border-2 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-300 dark:focus:border-indigo-300 transition duration-300 ease-in-out transform hover:scale-105"
                        onChange={(e) => handleSearch(e.target.value)} // ตัวจัดการค้นหา
                    />
                </div>

                {isCheckInVisible && <CheckIn />}

                {/* Dropdown for Category */}
                <div className="mb-4">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                    >
                        <option value="All">{language === 'th' ? 'ทั้งหมด' : 'All'}</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Database">Database</option>
                        <option value="Tools">Tools</option>
                        <option value="DevOps">DevOps</option>
                    </select>
                </div>

                {/* Video Content */}
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredVideos.map((videoId, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                            <div className="relative pb-[56.25%]">
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                                    title={videoData[videoId].title[language]}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    onLoad={(e) => {
                                        const player = new YT.Player(e.target, {
                                            events: {
                                                onStateChange: (event) => {
                                                    if (event.data === YT.PlayerState.PLAYING) {
                                                        event.target.addEventListener('onStateChange', () => handleVideoProgress(videoId, event.target.getCurrentTime(), event.target.getDuration()));
                                                    }
                                                }
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold dark:text-gray-300">
                                    {videoData[videoId].title[language]}
                                </h3>
                                <div className="mt-2">
                                    <span className="text-sm dark:text-gray-400">
                                        {Math.round(videoProgress[videoId] || 0)}% {language === 'th' ? 'ดูแล้ว' : 'Watched'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
            {/* Floating Notes Button */}
            <button
                onClick={() => setIsNotesOpen(true)}
                className="fixed bottom-5 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg focus:outline-none transition-all transform hover:scale-110"
                title={language === "th" ? "สมุดโน้ต" : "Notes"}
            >
                {/* 📒 Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 2v20m10-20v20m-7-18h6m-6 4h6m-6 4h6m-6 4h6" />
                </svg>
            </button>


            {/* Floating Chat Button */}
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-20 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg focus:outline-none transition-all transform hover:scale-110"
                title={language === "th" ? "แชท" : "Chat"}
            >
                {/* 💬 Chat Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h7m4 0h7m-9 5h5m-5-10h.01M3 5h7m-7 5h.01m11 0h.01" />
                </svg>
            </button>

            {/* Conditionally Render Chat Component */}
            {isChatOpen && <Chat setIsChatOpen={setIsChatOpen} />}

            {/* Conditionally render Notes component if isNotesOpen is true */}
            {isNotesOpen && <Notes setIsNotesOpen={setIsNotesOpen} />}
        </div>
    );
};

export default Home;