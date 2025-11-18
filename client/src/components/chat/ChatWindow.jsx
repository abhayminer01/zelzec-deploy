import { useChat } from "../../contexts/ChatContext";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { sendMessage } from "../../services/chat-api";

export default function ChatWindow({ chat }) {
    const { closeChat } = useChat();

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const bottomRef = useRef();

    // LOAD MESSAGES WHEN CHAT OPENED
    useEffect(() => {
        async function loadMessages() {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/${chat.chatId}`,
                    { withCredentials: true }
                );
                setMessages(res.data.messages);

                // scroll bottom
                setTimeout(() => bottomRef.current?.scrollIntoView(), 50);

            } catch (err) {
                console.log("Message load error:", err);
            }
        }
        loadMessages();
    }, [chat.chatId]);

    // SEND MESSAGE
    const handleSend = async () => {
        if (!text.trim()) return;

        try {
            const msg = await sendMessage(chat.chatId, text);

            setMessages(prev => [...prev, msg]);
            setText("");

            setTimeout(() => bottomRef.current?.scrollIntoView(), 50);

        } catch (err) {
            console.log("Message send error:", err);
        }
    };

    return (
      <div className="w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col">

        {/* HEADER */}
        <div className="bg-primary text-white flex justify-between p-2 rounded-t-lg">
          <div className="flex items-center gap-2">
            <img src={chat.user.avatar} className="w-6 h-6 rounded-full" />
            {chat.user.full_name}
          </div>
          <button onClick={() => closeChat(chat.chatId)}>✕</button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg) => (
                <div
                    key={msg._id}
                    className={`p-2 max-w-[75%] rounded-xl ${
                        msg.sender === chat.currentUserId
                            ? "bg-primary ml-auto text-white"
                            : "bg-gray-200"
                    }`}
                >
                    {msg.text}
                </div>
            ))}

            <div ref={bottomRef}></div>
        </div>

        {/* INPUT */}
        <div className="border-t p-2 flex">
          <input
            className="flex-1 border p-2 rounded"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="ml-2 bg-primary text-white px-4 rounded"
            onClick={handleSend}
          >
            ➤
          </button>
        </div>
      </div>
    );
}
