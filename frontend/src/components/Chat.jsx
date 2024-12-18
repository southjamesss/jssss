import React, { useState } from "react";

const Chat = ({ setIsChatOpen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ตัวอย่างฐานข้อมูลคำถามและคำตอบ (Q&A)
  const questionAnswerDB = [
    { question: "What is React?", answer: "React is a JavaScript library for building user interfaces." },
    { question: "What is JavaScript?", answer: "JavaScript is a programming language used for creating dynamic content on websites." },
    { question: "What is Tailwind CSS?", answer: "Tailwind CSS is a utility-first CSS framework for creating custom designs." },
    // เพิ่มคำถาม-คำตอบที่ต้องการ
  ];

  // ฟังก์ชั่นสำหรับหาคำตอบจากฐานข้อมูล
  const getAnswer = (question) => {
    // ทำให้คำถามเป็นคำเล็กทั้งหมดเพื่อการเปรียบเทียบที่แม่นยำ
    const lowerCaseQuestion = question.toLowerCase();

    // หาคำตอบจากฐานข้อมูลโดยการจับคู่คำถาม
    const found = questionAnswerDB.find((qa) =>
      lowerCaseQuestion.includes(qa.question.toLowerCase())
    );
    return found ? found.answer : "Sorry, I don't understand that question.";
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");

    try {
      // เพิ่มข้อความของผู้ใช้ในแชท
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: input },
      ]);

      // หาคำตอบจากฐานข้อมูล
      const answer = getAnswer(input);

      // เพิ่มข้อความกำลังตอบของระบบ (Chatbot is typing)
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Chatbot is typing..." },
      ]);

      // รอเพื่อให้ผู้ใช้เห็นข้อความ "Chatbot is typing..."
      setTimeout(() => {
        // ลบข้อความ "Chatbot is typing..." ออก และเพิ่มคำตอบของระบบ
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),  // ลบข้อความ "Chatbot is typing..."
          { sender: "bot", text: answer },
        ]);
        setInput("");
        setLoading(false);
      }, 1000); // ใช้เวลา 1 วินาทีในการตอบกลับ
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-12 right-6 w-80 bg-white border rounded-lg shadow-lg">
      <div className="flex justify-between items-center p-4 bg-purple-600 text-white">
        <h2 className="text-lg font-bold">Chatbot</h2>
        <button onClick={() => setIsChatOpen(false)} className="text-xl">×</button>
      </div>
      <div className="p-4 h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}
          >
            {msg.text}
          </div>
        ))}
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </div>
      <div className="flex p-2 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Ask me something..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-purple-600 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;