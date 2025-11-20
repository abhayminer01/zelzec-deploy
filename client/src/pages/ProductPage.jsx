// src/pages/ProductPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/product-api';
import { useModal } from '../contexts/ModalContext';
import { useAuth } from '../contexts/AuthContext';
import LoginComponent from '../components/LoginComponent';
import { toast, Toaster } from 'sonner';
import NavBar from '../components/NavBar';
import { startChat } from '../services/chat-api';
import { getUser } from '../services/auth';
import { useChat } from '../contexts/ChatContext';

export default function ProductPage() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [userId, setUserId] = useState(null);

    const { isLoginOpen, openLogin } = useModal();
    const { isAuthenticated } = useAuth();
    const { openChat } = useChat();

    // Load product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await getProduct(id);
                setProduct(res.data);
            } catch (error) {
                console.error('Failed to load product:', error);
                toast.error('Could not load product details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    // Check owner
    useEffect(() => {
        const checkOwner = async () => {
            if (!product || !product.user) return;

            try {
                const user = await getUser();
                if (!user) return;

                setUserId(user._id);
                setIsOwner(user._id === product.user);
            } catch (err) {
                console.error('Failed to check ownership:', err);
            }
        };

        checkOwner();
    }, [product]);

    const handleContact = async () => {
        if (!isAuthenticated) {
            toast.info('You need to be logged in', {
                description: 'to contact sellers',
            });
            openLogin();
            return;
        }

        // 🔒 Block if product isn't ready
        if (!product || !product._id || !product.user) {
            toast.error('Product data is incomplete. Please refresh.');
            return;
        }

        try {
            // ✅ Only pass productId (backend expects this)
            const response = await startChat(product._id);

            // 🔒 Validate response shape
            if (!response || typeof response !== 'object') {
                throw new Error('Invalid response format from chat service');
            }

            if (!response.chat || !response.chat._id) {
                throw new Error('Chat creation failed: Missing chat ID');
            }

            openChat({
                chatId: response.chat._id,
                user: product.user,
                product: product,
                currentUserId: userId,
            });

        } catch (err) {
            console.error('Chat initiation failed:', err);
            toast.error('Unable to start chat. Please try again later.');
        }
    };

    // 🟡 Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Toaster position="top-right" />
                <NavBar />
                <p className="text-lg">Loading product...</p>
            </div>
        );
    }

    // 🔴 Product not found
    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Toaster position="top-right" />
                <NavBar />
                <p className="text-lg text-red-500">Product not found.</p>
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <NavBar />
            {isLoginOpen && <LoginComponent />}

            {isOwner ? (
                <div className="mt-10 border w-90 px-10 py-10">
                    <h1 className="text-xl font-semibold">Your Product</h1>
                    <img
                        src={`http://localhost:5000${product.images?.[0]?.url}`}
                        alt={product.title}
                        className="max-w-full h-auto"
                    />
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
                <div className="mt-10 border w-90 px-10 py-10">
                    <img
                        src={`http://localhost:5000${product.images?.[0]?.url}`}
                        alt={product.title}
                        className="max-w-full h-auto"
                    />
                    <h1 className="text-xl font-semibold">Title: {product.title}</h1>
                    <button
                        onClick={handleContact}
                        className="bg-primary px-15 py-2 rounded-lg text-white mt-5 hover:bg-primary/80"
                    >
                        Contact
                    </button>
                </div>
            )}
        </div>
    );
}