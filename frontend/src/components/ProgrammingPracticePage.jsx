import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProgrammingPracticePage = () => {
    const [userCode, setUserCode] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [usedQuestions, setUsedQuestions] = useState([]);

    const navigate = useNavigate();

    const questions = [
        {
            id: 1,
            question: "เขียนฟังก์ชันที่คูณตัวเลข 2 ตัว",
            description: "ฟังก์ชันต้องรับพารามิเตอร์เป็นตัวเลข 2 ตัว แล้วคืนค่าผลคูณของทั้งสองตัว",
            solution: `function multiply(a, b) { return a * b; }`,
        },
        {
            id: 2,
            question: "เขียนฟังก์ชันที่หาค่า Factorial ของตัวเลข",
            description: "ฟังก์ชันต้องรับพารามิเตอร์เป็นตัวเลขและคืนค่าผล Factorial ของตัวเลขนั้น",
            solution: `function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }`,
        },
        {
            id: 3,
            question: "เขียนฟังก์ชันที่ตรวจสอบว่าตัวเลขเป็นเลขคู่หรือเลขคี่",
            description: "ฟังก์ชันต้องคืนค่า true ถ้าตัวเลขเป็นเลขคู่ และ false ถ้าเป็นเลขคี่",
            solution: `function isEven(num) { return num % 2 === 0; }`,
        },
    ];

    const getRandomQuestion = () => {
        if (questions.length === usedQuestions.length) {
            setUsedQuestions([]);
        }

        let newQuestion;
        do {
            newQuestion = questions[Math.floor(Math.random() * questions.length)];
        } while (usedQuestions.includes(newQuestion.id));

        setUsedQuestions((prev) => [...prev, newQuestion.id]);
        setCurrentQuestion(newQuestion);
    };

    const runCodeWithAI = async (code) => {
        if (!code.trim()) {
            setError("กรุณาเขียนโค้ดก่อนส่งตรวจสอบ");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(
                "https://api.openai.com/v1/completions",
                {
                    prompt: `โจทย์: ${currentQuestion.description}\nตรวจสอบโค้ดต่อไปนี้ว่าถูกต้องหรือไม่:\n${code}`,
                    max_tokens: 100,
                    model: "text-davinci-003",
                },
                {
                    headers: {
                        "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const aiResponse = response.data.choices[0].text.trim();
            setResult(aiResponse || "ไม่มีผลลัพธ์จาก AI");
        } catch (err) {
            setError("ไม่สามารถตรวจสอบโค้ดได้ในตอนนี้ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getRandomQuestion();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
                <h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-8">
                    ฝึกเขียนโปรแกรมแบบสร้างสรรค์
                </h1>

                {currentQuestion && (
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            {currentQuestion.question}
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                            {currentQuestion.description}
                        </p>

                        <textarea
                            className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg mb-6 focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all"
                            placeholder="ใส่โค้ดของคุณที่นี่..."
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                        />

                        <button
                            onClick={() => runCodeWithAI(userCode)}
                            className={`w-full p-3 text-white rounded-lg font-semibold ${
                                isLoading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? "กำลังรันโค้ด..." : "รันโค้ด"}
                        </button>

                        {result && (
                            <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
                                <h3 className="text-xl font-bold text-green-700">✅ ผลลัพธ์จาก AI:</h3>
                                <pre className="mt-2 text-green-800">{result}</pre>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                                <h3 className="text-xl font-bold text-red-700">❌ ข้อผิดพลาด:</h3>
                                <pre className="mt-2 text-red-800">{error}</pre>
                            </div>
                        )}

                        <button
                            onClick={() => setShowSolution(!showSolution)}
                            className="mt-6 w-full p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold"
                        >
                            {showSolution ? "ซ่อนเฉลย" : "แสดงเฉลย"}
                        </button>

                        {showSolution && (
                            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                                <h3 className="text-xl font-bold text-blue-700">🔧 เฉลย:</h3>
                                <pre className="mt-2 text-blue-800 whitespace-pre-wrap">{currentQuestion.solution}</pre>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-6 flex gap-4">
                    <button
                        onClick={getRandomQuestion}
                        className="flex-1 p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold"
                    >
                        สุ่มคำถามใหม่
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="flex-1 p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold"
                    >
                        กลับไปหน้า Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgrammingPracticePage;