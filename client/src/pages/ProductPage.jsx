import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/product-api';
import { useModal } from '../contexts/ModalContext';
import { useAuth } from '../contexts/AuthContext';
import LoginComponent from '../components/LoginComponent';
import { toast, Toaster } from 'sonner';
import NavBar from '../components/NavBar';
import { startChat, sendMessage } from '../services/chat-api';
import axios from 'axios';
import { getUser } from '../services/auth';

export default function ProductPage() {

    const { id } = useParams();

    const [product, setProduct] = useState({});
    const [chatOpen, setChatOpen] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const [userId, setuserId] = useState(null);

    const { isLoginOpen, openLogin } = useModal();
    const { isAuthenticated } = useAuth();



    // Load product
    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await getProduct(id);
                setProduct(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchProduct();
    }, [id]);

    // Check owner only after product is loaded
    useEffect(() => {
        async function checkOwner() {
            if (!product?.user) return;

            const user = await getUser();
            if (!user) return;

            setuserId(user._id);   // always store user id

            if (user._id === product.user) {
                setIsOwner(true);
            }
        }
        checkOwner();
    }, [product]);


    const handleContact = async () => {
        if (!isAuthenticated) {
            toast.info("You need to be logged in", {
                description: "to contact sellers",
            });
            openLogin();
            return;
        }

        const res = await startChat(product.user, product._id);

        setChatId(res.chat._id);
        openChat({
            chatId : res.chat._id,
            user : product.user,
            product : product,
            currentUserId : userId
        });

        // Load messages
        const msgRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/${res.chat._id}`,
            { withCredentials: true }
        );

        setMessages(msgRes.data.messages);
    };

    const handleSend = async () => {
        if (!text.trim()) return;

        const msg = await sendMessage(chatId, text);

        setMessages(prev => [...prev, msg]);
        setText("");
    };

    return (
        <div>
            <Toaster position="top-right" />
            <NavBar />

            {isLoginOpen && <LoginComponent />}

            {isOwner ? (
                // ⭐ PRODUCT OWNER CONTROLS
                <div className="mt-10 border w-90 px-10 py-10">
                    <h1 className="text-xl font-semibold">Your Product</h1>

                    <img src={`http://localhost:5000${product.images?.[0]?.url}`} alt="" />

                    <h2 className="text-lg mt-2">Title: {product.title}</h2>
                    <p className="text-gray-600">{product.description}</p>

                    <div className="flex gap-3 mt-4">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                            Edit Product
                        </button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                            Delete Product
                        </button>
                    </div>
                </div>
            ) : (
                // ⭐ NORMAL VISITOR UI (show contact button)
                <div className="mt-10 border w-90 px-10 py-10">
                    <img src={`http://localhost:5000${product.images?.[0]?.url}`} alt="" />
                    <h1 className="text-xl font-semibold">Title: {product.title}</h1>

                    <button
                        onClick={handleContact}
                        className="bg-primary px-15 py-2 rounded-lg text-white mt-5 hover:bg-primary/80"
                    >
                        Contact
                    </button>
                </div>
            )}

            {/* <div className="mt-10 border w-90 px-10 py-10">
                <img src={`http://localhost:5000${product.images?.[0]?.url}`} alt="" />
                <h1>Title: {product.title}</h1>

                <button
                    onClick={handleContact}
                    disabled={isOwner}
                    className={
                        isOwner
                            ? "bg-red-500/50 px-15 py-2 rounded-lg text-white mt-5 cursor-not-allowed"
                            : "bg-primary px-15 py-2 rounded-lg text-white mt-5 hover:bg-primary/80"
                    }
                >
                </button>
            </div> */}
        </div>
    );
}
