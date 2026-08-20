
"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function AIChatbot({ currentProducts = [], categoryName = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "สวัสดีครับ! ผมคือ AI ผู้ช่วยจาก 7Pro Deals มีอะไรให้ผมช่วยแนะนำสินค้าไหมครับ?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Prepare system prompt with current products context
    const productsContext = currentProducts.slice(0, 20).map(p => 
      `- ${p.product_name} (ราคา ${p.sale_price} บาท)`
    ).join("\n");

    const systemPrompt = {
      role: "system",
      content: `คุณคือผู้ช่วย AI ประจำเว็บไซต์ "7Pro Deals" (เว็บรวมสินค้าราคาประหยัดจาก Makro)
ตอบคำถามด้วยความสุภาพ เป็นกันเอง และสั้นกระชับ
นี่คือรายการสินค้าบางส่วนที่ลูกค้ากำลังดูอยู่ในหมวด "${categoryName}":
${productsContext}
คุณสามารถแนะนำสินค้าเหล่านี้ให้ลูกค้าได้ หากลูกค้าถามถึง`
    };

    const apiMessages = [systemPrompt, ...messages, userMessage];

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setMessages(prev => [...prev, data.choices[0].message]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "ขออภัยครับ ระบบประมวลผลมีปัญหาชั่วคราว" }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "เกิดข้อผิดพลาดในการเชื่อมต่อครับ" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Chat"
      >
        {isOpen ? "✕" : "💬 AI"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>🤖 7Pro AI Assistant</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                {msg.role === "assistant" ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            ))}
            {isLoading && (
              <div className="chat-message assistant typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="พิมพ์ถามเรื่องสินค้า..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading}>ส่ง</button>
          </form>
        </div>
      )}
    </>
  );
}

