// src/pages/MobileChatListPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../contexts/ChatContext';
import { Search } from 'lucide-react';

export default function MobileChatListPage() {
    const navigate = useNavigate();
    const { chatState, loadChats } = useChat();
    const { chats, currentUserId } = chatState;

    useEffect(() => {
        loadChats();
    }, []);

    const handleChatClick = (chat) => {
        navigate(`/mobile/chat/${chat._id}`);
    };

    return (
        <div className="fixed inset-0 bg-[#F3F0FA] flex flex-col">
            {/* Header */}
            <div className="bg-white p-4 border-b border-[#E6E0F5]">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-xl font-semibold text-[#7C5CB9]">Chats</h1>
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full bg-white h-12 rounded-lg pl-4 pr-10 border border-[#E6E0F5] focus:outline-none focus:ring-1 focus:ring-[#C8B6E2]"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89BC8]" size={20} />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chats.length === 0 ? (
                    <div className="text-center text-[#A89BC8] mt-20">
                        <p>No chats yet.</p>
                        <p className="text-sm mt-2">Start a conversation from a product page!</p>
                    </div>
                ) : (
                    chats.map(chat => {
                        const seller = chat.product?.user;
                        const sellerName = seller?.full_name?.trim() || 'Seller';
                        const preview = chat.latestMessage || 'No messages yet';
                        const time = new Date(chat.lastMessageAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        });

                        return (
                            <div
                                key={chat._id}
                                onClick={() => handleChatClick(chat)}
                                className="flex items-center p-4 bg-white rounded-lg cursor-pointer hover:bg-[#EFEAF9] transition-colors"
                            >
                                <img
                                    src={seller?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=8069AE&color=fff`}
                                    alt={sellerName}
                                    className="w-12 h-12 rounded-full mr-4 object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-[#7C5CB9] truncate">{sellerName}</h3>
                                            <p className="text-sm text-[#A89BC8] truncate">{preview}</p>
                                        </div>
                                        <span className="text-xs text-[#A89BC8] ml-2 whitespace-nowrap">{time}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}