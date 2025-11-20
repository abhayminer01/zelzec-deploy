// src/components/ChatWidget.jsx
import React, { useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { sendMessage } from '../services/chat-api';
import axios from 'axios';

const ChatWidget = () => {
    const { chatState, closeChat, toggleMinimize, updateMessages, updateText } = useChat();
    const { isOpen, isMinimized, chatId, messages, text } = chatState;
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && chatId) {
            const loadMessages = async () => {
                try {
                    const res = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/${chatId}`,
                        { withCredentials: true }
                    );
                    updateMessages(res.data.messages);
                } catch (err) {
                    console.error("Failed to load messages", err);
                }
            };
            loadMessages();
        }
    }, [isOpen, chatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!text.trim()) return;

        try {
            const response = await sendMessage(chatId, text);
            const newMessage = response.data; // ✅ FIX: extract .data
            updateMessages(prev => [...prev, newMessage]);
            updateText("");
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ✅ Fixed avatar (no network error)
    const avatarUrl = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjODA2OUFFIi8+PHRleHQgeD0iMTUiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkE8L3RleHQ+PC9zdmc+";

    return (
        <div className={`fixed bottom-5 right-5 w-80 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ${isMinimized ? 'h-10' : 'h-96'}`}>
            <div className="bg-[#8069AE] text-white p-2 py-3.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <img src={avatarUrl} alt="User" className="w-6 h-6 rounded-full" />
                    <span className="font-medium">Seller</span>
                </div>
                <div className="flex gap-1">
                    <button onClick={toggleMinimize} className="text-white hover:bg-purple-700 p-1 rounded">
                        {isMinimized ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        )}
                    </button>
                    <button onClick={closeChat} className="text-white hover:bg-purple-700 p-1 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <div className="p-3 h-64 overflow-y-auto bg-purple-50">
                    {messages.map((msg, idx) => {
                        // ✅ Safety check to prevent white screen
                        if (!msg || typeof msg.text !== 'string') return null;

                        return (
                            <div
                                key={msg._id || idx}
                                className={`mb-2 max-w-[80%] p-2 rounded-lg ${
                                    msg.sender === chatState.currentUserId
                                        ? 'ml-auto bg-[#8069AE] text-white'
                                        : 'mr-auto bg-white border border-gray-200'
                                }`}
                            >
                                {msg.text}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            )}

            {!isMinimized && (
                <div className="p-2  border-t border-gray-200 flex">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => updateText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message here"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded-l focus:outline-none"
                    />
                    <button onClick={handleSend} className="bg-[#8069AE] text-white px-3 rounded-r hover:bg-purple-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal">
                            <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/>
                            <path d="M6 12h16"/>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;