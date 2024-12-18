import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
    {
      question: "React คืออะไร?",
      options: ["framework", "react", "library", "component"],
      correctAnswer: "react",
    },
    {
      question: "JavaScript ใช้ทำอะไร?",
      options: ["cooking", "programming", "gardening", "painting"],
      correctAnswer: "programming",
    },
    {
      question: "HTML ใช้ทำอะไร?",
      options: ["structure", "design", "animation", "database"],
      correctAnswer: "structure",
    },
    {
      question: "CSS ใช้ทำอะไร?",
      options: ["style", "programming", "database", "logic"],
      correctAnswer: "style",
    },
    {
      question: "Tailwind CSS เป็นอะไร?",
      options: ["framework", "library", "utility-first framework", "animation"],
      correctAnswer: "utility-first framework",
    },
    {
      question: "State ใน React คืออะไร?",
      options: ["data", "UI", "logic", "function"],
      correctAnswer: "data",
    },
    {
      question: "Component ใน React คืออะไร?",
      options: ["UI unit", "API", "database", "backend"],
      correctAnswer: "UI unit",
    },
    {
      question: "useEffect ใช้ทำอะไร?",
      options: [
        "side effects",
        "handle state",
        "render UI",
        "routing",
      ],
      correctAnswer: "side effects",
    },
    {
      question: "Redux ใช้ทำอะไร?",
      options: ["state management", "routing", "styling", "testing"],
      correctAnswer: "state management",
    },
    {
      question: "Prop ใน React คืออะไร?",
      options: ["data", "function", "logic", "state"],
      correctAnswer: "data",
    },
    {
      question: "React Router ใช้ทำอะไร?",
      options: ["navigation", "styling", "logic", "API"],
      correctAnswer: "navigation",
    },
    {
      question: "JavaScript type ใดที่ใช้เก็บข้อมูลหลายตัว?",
      options: ["object", "array", "string", "boolean"],
      correctAnswer: "array",
    },
    {
      question: "Promise ใน JavaScript ใช้ทำอะไร?",
      options: ["handle async", "design UI", "store data", "render"],
      correctAnswer: "handle async",
    },
    {
      question: "Node.js ใช้สำหรับ?",
      options: ["backend", "frontend", "database", "styling"],
      correctAnswer: "backend",
    },
    {
      question: "function declaration แตกต่างจาก function expression ยังไง?",
      options: ["hoisting", "syntax", "speed", "usage"],
      correctAnswer: "hoisting",
    },
    {
      question: "Class component ใน React คืออะไร?",
      options: ["component with state", "stateless", "backend", "CSS"],
      correctAnswer: "component with state",
    },
    {
      question: "Virtual DOM คืออะไร?",
      options: ["optimized DOM", "HTML", "CSS", "Browser API"],
      correctAnswer: "optimized DOM",
    },
    {
      question: "API ย่อมาจากอะไร?",
      options: [
        "Application Programming Interface",
        "Automated Process Integration",
        "Advanced Programming Interface",
        "Application Processing Info",
      ],
      correctAnswer: "Application Programming Interface",
    },
    {
      question: "React render ใหม่เมื่อ?",
      options: ["state/props change", "CSS added", "API called", "page loaded"],
      correctAnswer: "state/props change",
    },
    {
      question: "useState ใช้ทำอะไร?",
      options: [
        "manage state",
        "handle API",
        "update DOM",
        "optimize performance",
      ],
      correctAnswer: "manage state",
    },
  ];

const Practice = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
  }, []);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === shuffledQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    setSelectedAnswer(null);

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        {!showResult ? (
          <>
            <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
              แบบทดสอบความรู้
            </h1>
            <div className="text-center mb-6">
              <p className="text-lg font-semibold text-gray-600">
                ข้อที่ {currentQuestionIndex + 1} / {shuffledQuestions.length}
              </p>
              <p className="text-xl font-medium text-gray-800 mt-2">
                {shuffledQuestions[currentQuestionIndex]?.question}
              </p>
            </div>
            <div className="space-y-4">
              {shuffledQuestions[currentQuestionIndex]?.options.map(
                (option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelection(option)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold shadow-md transition-all ${
                      selectedAnswer === option
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                )
              )}
            </div>
            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className={`mt-6 w-full py-3 font-bold text-white rounded-xl shadow-md transition-all ${
                !selectedAnswer
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {currentQuestionIndex < shuffledQuestions.length - 1
                ? "ถัดไป"
                : "ดูผลลัพธ์"}
            </button>
            {/* ปุ่มกลับหน้า Home */}
            <button
              onClick={goToHome}
              className="mt-4 w-full py-3 font-bold bg-gray-500 text-white rounded-xl shadow-md hover:bg-gray-600 transition-all"
            >
              กลับไปหน้าแรก
            </button>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">
              🎉 ผลลัพธ์ของคุณ!
            </h1>
            <p className="text-2xl font-semibold text-gray-700">
              คุณทำได้ {score} / {shuffledQuestions.length} คะแนน
            </p>
            <div className="mt-8 space-y-4">
              <button
                onClick={handleRetry}
                className="w-full py-3 font-bold bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition-all"
              >
                ลองใหม่อีกครั้ง
              </button>
              <button
                onClick={goToHome}
                className="w-full py-3 font-bold bg-gray-500 text-white rounded-xl shadow-md hover:bg-gray-600 transition-all"
              >
                กลับไปหน้าแรก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;