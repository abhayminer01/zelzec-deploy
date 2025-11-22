// src/contexts/ChatContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getMyChats } from '../services/chat-api';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [chatState, setChatState] = useState({
        isSidebarOpen: false,
        isMinimized: false, // ✅ ADD THIS
        chats: [],
        activeChatId: null,
        currentUserId: null,
        messages: [],
        text: '',
    });

    const loadChats = async () => {
        try {
            const data = await getMyChats();
            setChatState(prev => ({
                ...prev,
                chats: data.chats || [],
                currentUserId: data.currentUserId
            }));
        } catch (err) {
            console.error("Failed to load chats", err);
        }
    };

    const openChat = (data) => {
        setChatState(prev => ({
            ...prev,
            activeChatId: data.chatId,
            isMinimized: false, // ✅ Auto-restore when opening a chat
        }));
    };

    const closeChat = () => {
      setChatState(prev => ({
        ...prev,
        isSidebarOpen: false,
        activeChatId: null,
        messages: [],
        text: '',
      }));
    };

    const toggleSidebar = async () => {
        setChatState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }));
        if (!chatState.isSidebarOpen) {
            await loadChats();
        }
    };

    const appendMessage = (message) => {
        setChatState(prev => ({
            ...prev,
            messages: [...prev.messages, message]
        }));
    };


    const toggleMinimize = () => {
        setChatState(prev => ({
            ...prev,
            isMinimized: !prev.isMinimized
        }));
    };

    const setActiveChat = (chat) => {
        openChat({
            chatId: chat._id,
            user: chat.product.user._id,
            product: chat.product,
            currentUserId: chatState.currentUserId,
        });
    };

    const updateMessages = (newMessages) => {
        setChatState(prev => ({ ...prev, messages: newMessages || [] }));
    };

    const updateText = (text) => {
        setChatState(prev => ({ ...prev, text }));
    };

    return (
        <ChatContext.Provider value={{
            chatState,
            openChat,
            closeChat,
            toggleSidebar,
            toggleMinimize, // ✅ Export it
            setActiveChat,
            updateMessages,
            updateText,
            appendMessage
        }}>
            {children}
        </ChatContext.Provider>
    );
};