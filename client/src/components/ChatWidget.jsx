// src/components/ChatWidget.jsx
import React, { useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { getHistory, sendMessage } from '../services/chat-api';
import { toast } from 'sonner';

const ChatWidget = () => {
    const { chatState, closeChat, toggleMinimize, updateMessages, updateText } = useChat();
    const { isOpen, isMinimized, chatId, messages, text } = chatState;
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!activeChatId) {
            updateMessages([]);
            updateText("");
            return;
        }

        const loadMessages = async () => {
            try {
                const data = await getHistory(activeChatId);
                updateMessages(Array.isArray(data.messages) ? data.messages : []);
            } catch (err) {
                console.error("Failed to load messages", err);
                toast.error("Failed to load chat history");
                updateMessages([]);
            }
        };

        loadMessages();
    }, [activeChatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!activeChatId) return null;

    const handleSend = async () => {
        if (!text?.trim()) return;

        try {
            const response = await sendMessage(chatId, text);
            const newMessage = response.data; // ✅ FIX: extract .data
            updateMessages(prev => [...prev, newMessage]);
            updateText("");
        } catch (err) {
            console.error("Send failed", err);
            toast.error("Message failed to send");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const sellerName = "Seller";

    return (
        <div className={`fixed bottom-5 right-5 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-[99] transition-all duration-300 ${isMinimized ? 'h-10' : 'h-96'}`}>
            <div className="bg-[#8069AE] text-white p-2 py-3.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-xs">S</div>
                    <span className="font-medium">{sellerName}</span>
                </div>
                <div className="flex gap-1">
                    {/* Minimize/Restore Button */}
                    <button
                        onClick={toggleMinimize}
                        className="text-white hover:bg-purple-700 p-1 rounded"
                        title={isMinimized ? "Restore" : "Minimize"}
                    >
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
                    {/* Close Button */}
                    <button
                        onClick={closeChat}
                        className="text-white hover:bg-purple-700 p-1 rounded"
                        title="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    <div className="p-3 h-64 overflow-y-auto bg-purple-50">
                        {messages.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-4">No messages yet.</p>
                        ) : (
                            messages.map((msg) => {
                                if (!msg || typeof msg.text !== 'string' || !msg.sender) return null;
                                const isOwn = String(msg.sender) === String(currentUserId);
                                return (
                                    <div
                                        key={msg._id || msg.createdAt}
                                        className={`mb-2 max-w-[80%] p-2 rounded-lg break-words ${
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

                    <div className="p-2 border-t border-gray-200 flex">
                        <input
                            type="text"
                            value={text || ''}
                            onChange={(e) => updateText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type a message..."
                            className="flex-1 px-2 py-1 border border-gray-300 rounded-l focus:outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!text?.trim()}
                            className="bg-[#8069AE] text-white px-3 rounded-r hover:bg-purple-700 disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-horizontal-icon lucide-send-horizontal"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatWidget;