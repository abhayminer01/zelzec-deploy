// src/pages/MobileChatPage.jsx
import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../contexts/ChatContext';
import { ArrowLeft } from 'lucide-react';

export default function MobileChatPage() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const { chatState, loadChatMessages, sendMessage, updateText } = useChat();
    const { messages, text, currentUserId } = chatState;
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (chatId) {
            loadChatMessages(chatId);
        }
    }, [chatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (chatId) {
            sendMessage(chatId, text);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Get seller name (you can improve this later)
    const sellerName = "Seller";

    return (
        <div className="fixed inset-0 flex flex-col bg-white">
            {/* Header */}
            <div className="bg-[#8069AE] text-white p-4 flex items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-3 hover:bg-purple-700 p-1.5 rounded"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm">
                        S
                    </div>
                    <span className="font-medium">{sellerName}</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-purple-50">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">No messages yet.</p>
                ) : (
                    messages.map((msg) => {
                        if (!msg || typeof msg.text !== 'string' || !msg.sender) return null;
                        const isOwn = String(msg.sender) === String(currentUserId);
                        return (
                            <div
                                key={msg._id || msg.createdAt}
                                className={`mb-3 max-w-[80%] p-3 rounded-lg break-words ${
                                    isOwn ? 'ml-auto bg-[#8069AE] text-white' : 'mr-auto bg-white text-gray-800'
                                }`}
                            >
                                {msg.text}
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 flex">
                <input
                    type="text"
                    value={text || ''}
                    onChange={(e) => updateText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l focus:outline-none text-sm"
                />
                <button
                    onClick={handleSend}
                    disabled={!text?.trim()}
                    className="bg-[#8069AE] text-white px-6 rounded-r hover:bg-purple-700 disabled:opacity-50"
                >
                    Send
                </button>
            </div>
        </div>
    );
}