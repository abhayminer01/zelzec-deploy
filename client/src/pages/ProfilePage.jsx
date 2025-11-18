import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { getProductForProfile } from '../services/product-api';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fn = async () => {
            const res = await getProductForProfile();
            setProducts(res.data);
        }
        fn();
    }, []);
  return (
    <div>
        <NavBar />
        <button onClick={() => navigate('/inbox')} className='bg-primary px-10 py-2 m-5 rounded-lg text-white hover:bg-primary/90'>Inbox</button>
        <h1 className='text-primary font-bold text-2xl'>My Products</h1>
        <div className="grid grid-cols-4 gap-4">
            {products.map((p) => (
                <div 
                    key={p._id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-3 flex flex-col cursor-pointer min-w-[280px]"
                >
                    <div className="w-full h-36 overflow-hidden rounded-md mb-2">
                        <img 
                            className="w-full h-full object-cover" 
                            src={`http://localhost:5000${p.images?.[0]?.url}`} 
                            alt="images" 
                        />
                    </div>

                    <h1 className="font-semibold text-lg">{p.title}</h1>
                    <p className="text-sm text-gray-600">{p.description}</p>
                </div>
            ))}
        </div>
    </div>
  )
}
