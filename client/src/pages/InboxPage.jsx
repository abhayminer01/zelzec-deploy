import React, { useEffect, useState } from "react";
import { getInbox } from "../services/chat-api";
import { Link } from "react-router-dom";

export default function InboxPage() {

    const [chats, setChats] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        async function loadChats() {
            const data = await getInbox();
            setChats(data.chats);
            setCurrentUserId(data.currentUserId);
        }
        loadChats();
    }, []);


    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-5">Inbox</h1>

            {chats.length === 0 && (
                <p className="text-gray-500">No chats found</p>
            )}

            <div className="space-y-4">
                {chats.map((chat) => {

                    console.log(chat.participants[1].full_name)
                    // Detect the OTHER participant
                    const otherUser = chat.participants.find(
                      (u) => String(u._id) !== String(currentUserId)
                    );

                    const product = chat.product;

                    return (
                        <Link 
                            to={`/chat/${chat._id}`} 
                            key={chat._id}
                            className="border rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition"
                        >
                            <img
                                src={`http://localhost:5000${product?.images?.[0]?.url}`}
                                className="w-16 h-16 object-cover rounded-md"
                                alt="Product"
                            />

                            <div className="flex-1">
                                <p className="font-semibold">
                                    Chat with: {otherUser?.full_name}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Product: {product?.title}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
