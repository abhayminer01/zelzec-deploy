import React, { useEffect, useState, useRef } from "react";
import { getInbox } from "../../services/chat-api";
import { useChat } from "../../contexts/ChatContext";

export default function ChatDropdown({ close }) {

  const { openChat } = useChat();
  const [chats, setChats] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const containerRef = useRef();

  useEffect(() => {
    async function load() {
      const data = await getInbox();
      setChats(data.chats || []);
      setCurrentUserId(data.currentUserId || null);
    }
    console.log("ChatDropdown mounted");

    load();
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-14 right-0 w-80 bg-white shadow-xl rounded-lg p-3 z-50"
    >
      <h2 className="text-lg font-semibold px-2">Chats</h2>

      <input
        type="text"
        placeholder="Search Message..."
        className="w-full mt-2 mb-3 bg-gray-100 h-9 rounded-lg pl-3 border focus:outline-none"
      />

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {chats.map((chat) => {
          
          const otherUser = chat.participants.find(
            (u) => String(u._id) !== String(currentUserId)
          );

          const product = chat.product;

          return (
            <div
              key={chat._id}
              onClick={() => {
                openChat({
                  chatId: chat._id,
                  user: otherUser,
                  product: product,
                  currentUserId,
                });
                close();
              }}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer transition"
            >
              <img
                src={otherUser?.avatar || "/default-avatar.png"}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="flex-1">
                <p className="font-medium">{otherUser?.full_name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {chat.lastMessage?.text || "Say hi…"}
                </p>
              </div>

              <p className="text-xs text-gray-400">8:00 AM</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
