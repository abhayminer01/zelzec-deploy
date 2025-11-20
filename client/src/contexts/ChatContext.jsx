// src/contexts/ChatContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [chatState, setChatState] = useState({
        isOpen: false,
        isMinimized: false,
        chatId: null,
        user: null,
        product: null,
        currentUserId: null,
        messages: [],
        text: '',
    });

    const openChat = (data) => {
        setChatState(prev => ({
            ...prev,
            isOpen: true,
            isMinimized: false,
            chatId: data.chatId,
            user: data.user,
            product: data.product,
            currentUserId: data.currentUserId,
        }));
    };

    const closeChat = () => {
        setChatState(prev => ({
            ...prev,
            isOpen: false,
            chatId: null,
            user: null,
            product: null,
            currentUserId: null,
            messages: [],
            text: '',
        }));
    };

    const toggleMinimize = () => {
        setChatState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
    };

    const updateMessages = (newMessages) => {
        setChatState(prev => ({ ...prev, messages: newMessages }));
    };

    const updateText = (text) => {
        setChatState(prev => ({ ...prev, text }));
    };

    return (
        <ChatContext.Provider value={{
            chatState,
            openChat,
            closeChat,
            toggleMinimize,
            updateMessages,
            updateText,
        }}>
            {children}
        </ChatContext.Provider>
    );
};