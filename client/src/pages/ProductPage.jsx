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

// Components
import ProductImageCarousel from '../components/ProductImageCarousel';
import ProductOverview from '../components/ProductOverview';
import ProductMap from '../components/ProductMap';
import PreviousSearches from '../components/PreviousSearches';
import ProductInfoCard from '../components/ProductInfoCard';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

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

        if (!product || !product._id || !product.user) {
            toast.error('Product data is incomplete. Please refresh.');
            return;
        }

        try {
            const response = await startChat(product._id);
            if (!response?.data?._id) {
                throw new Error('Chat creation failed: Missing chat ID');
            }

            openChat({
                chatId: response.data._id,
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
                <MobileBottomNav />
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
                <MobileBottomNav />
                <p className="text-lg text-red-500">Product not found.</p>
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <NavBar />
            <MobileBottomNav />

            {isLoginOpen && <LoginComponent />}

            {/* Breadcrumb */}
            <div className="px-4 md:px-10 py-2 text-sm text-gray-500">
                <span>Kerala</span> {' > '}
                {/* <span>Motors</span> {' > '}
                <span>Used Cars</span> {' > '}
                <span>Ford</span> {' > '} */}
                <span>{product.title}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-10 pb-10">

                {/* Left: Image Carousel */}
                <div className="lg:w-2/3">
                    <ProductImageCarousel images={product.images} />
                </div>

               
                <div className="lg:w-1/3">
                    <ProductInfoCard
                        product={product}
                        onChatClick={handleContact}
                        isOwner={isOwner}
                        currentUserId={userId}
                    />
                </div>

            </div>

            {/* Product Overview + Map */}
            <div className="bg-white p-6 md:p-10">
                <div className="flex flex-col md:flex-row justify-between px-50 gap-20">
                    <div className="md:w-2/3">
                        <h1 className="text-2xl font-bold">{product.title}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>📅 {new Date(product.createdAt).getFullYear()}</span>
                            <span>📏 {product.form_data?.mileage || 'N/A'} km</span>
                            <span>🚗 {product.form_data?.transmission || 'N/A'}</span>
                        </div>
                        <hr className="my-4" />
                        <ProductOverview product={product} />
                    </div>
                    <div className="md:w-1/3">
                        <ProductMap location={product.location} />
                    </div>
                </div>
            </div>

            

            <div className='flex flex-col justify-between px-50 py-8 gap-2 bg-gray-100 '>
                <p>Previous Searches</p>
                <PreviousSearches />
            </div>

            {/* Footer */}
            <div className="mt-20">
                <Footer/>
            </div>
            
        </div>
    );
}