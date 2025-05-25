import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import "./App.css"; 
import Logo from "./assets/logo.png";
import LogoBtn from "./assets/logo-btn.svg"; 

// Constants
const WEBHOOK_URL =
  "https://n8n.srv819221.hstgr.cloud/webhook/7ada3e17-dd16-4a9d-8ec4-27c126e4558f";
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTk2M2UzMy1kNGQ0LTQ5NjgtYjBkNi0wODQ3YjZiZGNmYTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ4MDY3ODE3LCJleHAiOjE3NTA2Mjk2MDB9.GV_y7e_g8k6oqfXZO-Sjm7RA7_Gz25TsJW8lxhZob5M";

function App() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(generateSessionId());
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  function generateSessionId() {
    return uuidv4(); 
  }

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

  const handleSubmit = async () => {
    if (prompt.trim() === '') return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: prompt },
    ]);
    setPrompt('');
    setLoading(true);

    const llmResponse = await sendMessageToLLM(sessionId, prompt);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'assistant', content: llmResponse },
    ]);
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen max-w-screen-xl mx-auto py-4">
      <header className="text-center p-6">
        <div className="flex justify-center items-center mb-6">
          <img src={Logo} alt="logo" className="max-w-xs" />
        </div>

        <h1 className="text-xl font-bold mb-4">Xin Chào, mình là Thu Nhi, Trợ Lý Ảo Của Anh Lập Trình</h1>

        <div>
          <div className="messages mb-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={message.role === 'user' ? 'text-right ' : ' text-left'} dangerouslySetInnerHTML={{ __html: message.content }} style={{ whiteSpace: 'pre-wrap' }}>
                
              </div>
            ))}
            {loading && (
              <div className="flex justify-left items-center mt-4 gap-x-[15px]">
                <span>AI đang phản hồi</span>
                <div className="animate-spin w-4 h-4 border-4 border-t-4 border-blue-600 rounded-full border-t-transparent"></div>
              </div>
            )}
          </div>

          <div className="flex items-center w-full p-4 rounded-lg shadow-lg fixed bottom-0 left-0 mb-[20px] px-[100px]">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Nhập nội dung cần trao đổi ở đây nhé?"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
              className="p-2 rounded-md w-full bg-gray-700 text-white relative"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gray-700 text-white px-4 py-2 rounded-md disabled:opacity-50 absolute right-[7%]"
            >
              <img className="svg-logo" src={LogoBtn} alt="logo-btn" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
