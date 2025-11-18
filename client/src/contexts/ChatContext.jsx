import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {

  const [openChats, setOpenChats] = useState([]);

  const openChat = (chatData) => {
    // prevent duplicate chat windows
    setOpenChats(prev => {
      if (prev.some(c => c.chatId === chatData.chatId)) return prev;
      return [...prev, chatData];
    });
  };

  const closeChat = (chatId) => {
    setOpenChats(prev => prev.filter(c => c.chatId !== chatId));
  };

  return (
    <ChatContext.Provider value={{ openChats, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
