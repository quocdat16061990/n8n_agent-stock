import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import "./App.css"; // Include Tailwind classes here
import Logo from "./assets/logo.png"; // Import your logo if needed
// Constants
const WEBHOOK_URL =
  "https://n8n.srv819221.hstgr.cloud/webhook/7ada3e17-dd16-4a9d-8ec4-27c126e4558f";
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTk2M2UzMy1kNGQ0LTQ5NjgtYjBkNi0wODQ3YjZiZGNmYTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ4MDY3ODE3LCJleHAiOjE3NTA2Mjk2MDB9.GV_y7e_g8k6oqfXZO-Sjm7RA7_Gz25TsJW8lxhZob5M";

function App() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(generateSessionId());
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false); // Trạng thái loading

  function generateSessionId() {
    return uuidv4(); // Tạo sessionId mới mỗi lần
  }

  // Gửi tin nhắn tới LLM API và nhận phản hồi
  const sendMessageToLLM = async (sessionId, message) => {
    const headers = {
      Authorization: `Bearer ${BEARER_TOKEN}`,
      'Content-Type': 'application/json',
    };

    const payload = {
      sessionId,
      chatInput: message,
    };

    try {
      const response = await axios.post(WEBHOOK_URL, payload, { headers });
      console.log('Response from LLM:', response?.data[0]?.output || 'No output received');
      return response?.data[0]?.output || 'No output received';
    } catch (error) {
      console.error('Error: Failed to connect to the LLM', error);
      return `Error: Failed to connect to the LLM - ${error.message}`;
    }
  };

  // Xử lý khi người dùng gửi tin nhắn
  const handleSubmit = async () => {
    if (prompt.trim() === '') return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: prompt },
    ]);
    setPrompt('');
    setLoading(true); // Bắt đầu loading khi gửi tin nhắn

    // Gửi tin nhắn và nhận phản hồi từ LLM
    const llmResponse = await sendMessageToLLM(sessionId, prompt);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'assistant', content: llmResponse },
    ]);
    setLoading(false); // Kết thúc loading sau khi nhận phản hồi
  };

  return (
    <div className="App bg-gray-900 text-white min-h-screen">
  <header className="App-header text-center p-6">
    <div className="flex justify-center items-center mb-6">
      <img src={Logo} alt="logo" className="max-w-xs" />
    </div>

    <h1 className="text-3xl font-bold mb-4">Xin Chào, mình là thu nhi, trợ lý ảo của Anh Lập Trình</h1>

    <div className="chat-container max-w-4xl mx-auto p-6 mt-6 bg-gray-800 rounded-lg shadow-lg">
      {/* Render chat messages */}
      <div className="messages mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.role === 'assistant'
                ? 'bg-gray-100 text-gray-800 w-full' // Full width for assistant messages
                : 'bg-blue-500 text-white w-full' // Full width for user messages
            } p-4 rounded-lg shadow-md break-words`}
          >
            {message.content}
          </div>
        ))}
        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full border-t-4 border-blue-500 w-8 h-8 mb-2"></div>
          </div>
        )}
      </div>

      {/* Chat input */}
      <div className="input-container flex justify-between gap-4 mt-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Nhập nội dung cần trao đổi ở đây nhé?"
          className="flex-grow p-3 rounded-lg border border-gray-300 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-3 rounded-lg disabled:opacity-50"
          disabled={loading} // Disable button while loading
        >
          Gửi
        </button>
      </div>
    </div>
  </header>
</div>


  );
  
}

export default App;