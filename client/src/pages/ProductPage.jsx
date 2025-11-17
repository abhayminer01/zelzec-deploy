import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/product-api';
import { useModal } from '../contexts/ModalContext';
import { useAuth } from '../contexts/AuthContext';
import LoginComponent from '../components/LoginComponent';
import { toast, Toaster } from 'sonner';
import NavBar from '../components/NavBar';

export default function ProductPage() {
    const id = useParams().id;
    const [product, setProduct] = useState({});
    const [chatOpen, setChatOpen] = useState(false);
    const { isLoginOpen, isRegisterOpen, openLogin, closeLogin } = useModal();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        async function fn() {
            try {
                const res = await getProduct(id);
                setProduct(res.data)
            } catch (error) {
                console.log(error);
            }
        }
        fn();
    }, []);

    const handleContact = () => {
        if(isAuthenticated) {
            setChatOpen(true)
        } else {
            toast.info('You need to be logged in', {
                description : "to contact sellers"
            })
            openLogin();
        }
    }

    return (
    <div>
        <Toaster position='top-right' />
        <NavBar />
        {isLoginOpen && <LoginComponent />}
        <h1>Product Display Page</h1>
        <div className='mt-10 border w-90 px-10 py-10'>
            <img src={`http://localhost:5000${product.images?.[0]?.url}`} alt="image" />
            <h1>Title : {product.title}</h1>
            <button onClick={handleContact} className='bg-primary px-15 py-2 rounded-lg text-white'>Contact</button>
        </div>

        {/* Chat Modal */}
        {chatOpen && <>
            <div className='absolute border w-100 h-100 right-0 bottom-0'>
                <div className='flex absolute bottom-0'>
                    <input type="text" placeholder='chat with owner' className='border w-85.5' />
                    <button className='bg-primary px-2 text-white'>Send</button>
                </div>
            </div>
        </>}
    </div>
  )
}