import React from 'react'
import NavBar from '../components/NavBar'
import * as Icons from "lucide-react"
import LoginComponent from '../components/LoginComponent'
import { useModal } from '../contexts/ModalContext'
import RegisterComponent from '../components/RegisterComponent';
import { Toaster, toast } from 'sonner'
import { useSell } from '../contexts/SellContext';
import SelectCategory from '../components/sell/SelectCategory';
import AddDetails from '../components/sell/AddDetails';
import UploadImage from '../components/sell/UploadImage';
import SelectLocation from '../components/sell/SelectLocation';
import SetPrice from '../components/sell/SetPrice';
import FinalStep from '../components/sell/FinalStep';
import { getPrimaryCategories } from '../services/category-api';
import { useState } from 'react';
import { useEffect } from 'react';
import MobileBottomNav from '../components/MobileBottomNav';
import { getProductsForHome } from '../services/product-api'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { visitorCount } from '../services/auth'
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const { isLoginOpen, isRegisterOpen, openLogin, closeLogin } = useModal();
  const { step, nextStep, clearStep } = useSell();
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate()

  useEffect(() => {
    fetchPrimaryCategories();
    fetchProducts();
    incrementVisitor();
  }, []);

  const incrementVisitor = async() => {
    try {
      const res = await visitorCount();
    } catch (error) {
      console.log(error)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await getProductsForHome();
      if(res.success) {
        setProducts(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchPrimaryCategories = async () => {
    try {
      const res = await getPrimaryCategories();
      if(res.success) {
        setCategory(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handlePostAdButton = () => {
    if(!isAuthenticated) {
      openLogin();
    } else {
      if(step === 0) {
        nextStep();
      } else {
        clearStep();
      }
    }
  }

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  }

  const handleCategoryClick = (id) => {
    navigate(`/category/${id}`)
  }

  return (
    <div className='pb-20 md:pb-0'>
        <Toaster position='top-right'/>
        <NavBar />
        <MobileBottomNav />
        { isLoginOpen && <LoginComponent /> }
        { isRegisterOpen && <RegisterComponent /> }
        { step === 1 && <SelectCategory /> }
        { step === 2 && <AddDetails /> }
        { step === 3 && <UploadImage /> }
        { step === 4 && <SelectLocation /> }
        { step === 5 && <SetPrice /> }
        { step === 6 && <FinalStep /> }
        <div>
          <img src="images/image.png" className='w-screen md:h-100 h-30' />
        </div>
        <div className='px-4 md:px-50 mt-6 md:mt-10'>
          <h1 className='text-[18px] md:text-[20px] font-semibold'>Browse Categories</h1>
          <div className='grid grid-cols-3 md:flex md:justify-center gap-3 md:gap-6 mt-5'>
            {category.map((item, index) => {
              const Icon = Icons[item.icon];
              return(
                <div onClick={() => handleCategoryClick(item._id)} key={index} className='border px-4 py-4 md:px-8 md:py-4 w-full md:w-[250px] flex flex-col justify-center align-middle items-center border-border rounded-lg hover:text-primary transition hover:border-primary' >
                  {Icon && <Icon className="size-7 md:size-7 text-primary mb-1" />}
                  <span className="text-xs md:text-sm font-medium text-center">{item.title}</span>
                </div>
              )
            })}
          </div>
        </div>
    <div className="px-4 md:px-10 mt-10 md:mt-14 mb-20">
      <div className="bg-border/40 w-full rounded-lg px-4 md:px-10 py-6 md:py-10">
        <h1 className="text-[18px] md:text-[20px] font-semibold mb-6">
          Featured Listings
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products found</p>
        ) : (
          <>
            <div className="md:hidden flex gap-5 overflow-x-auto pb-4 -mx-4 px-4">
              {products.map((p) => {
                const Icon = Icons[p.category?.icon] || Package;

                return (
                  <div
                    key={p._id}
                    className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition  flex flex-col cursor-pointer min-w-[280px] flex-shrink-0"
                  >
                    <div className="w-full h-36 overflow-hidden rounded-md">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${p.images?.[0]?.filename}`}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="mt-3 p-3 flex flex-col flex-grow justify-between">
                      <h2 className="text-sm font-semibold line-clamp-1">
                        {p.title}
                      </h2>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{p.description}</p>

                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                        {Icon && <Icon className="w-4 h-4 text-primary" />}
                        <span>{p.category?.title}</span>
                      </div>

                      <p className="text-primary font-bold mt-1">
                        ₹{p.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {products.map((p) => {
                const Icon = Icons[p.category?.icon] || Package;

                return (
                  <div
                    onClick={() => handleCardClick(p._id)}
                    key={p._id}
                    className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition flex flex-col cursor-pointer"
                  >
                    <div className="w-full h-36 md:h-65 overflow-hidden rounded-md">
                      <img
                        src={`http://localhost:5000${p.images?.[0]?.url}`}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="mt-3 p-3 flex flex-col flex-grow justify-between">
                      <h2 className="text-2xl md:text-base font-extrabold line-clamp-1">
                        {p.title}
                      </h2>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{p.description}</p>

                      <div className="flex items-center gap-1 justify-between mt-1 text-gray-500 text-xs md:text-sm">
                        <div className='flex items-center gap-1'>
                          {Icon && <Icon className="size-4 text-primary" />}
                          <span>{p.category?.title}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Icons.MapPin className="size-4 text-primary" />
                          <span>location : {p.location.place || "nill"}</span>
                        </div>
                      </div>

                      <p className="text-primary font-bold text-[20px] mt-1">
                        ₹{p.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  

        <div className='flex flex-col bg-primary w-screen h-70 gap-4 justify-center items-center'>
            <h1 className='text-white text-3xl'>Ready to Sell?</h1>
            <p className='text-gray-400'>Post your ad and reach thousand of buyers</p>
            <button onClick={handlePostAdButton} className='border bg-white rounded-lg px-6 py-3 shadow-xl'>Post Your Ad Now</button>
        </div>

        <Footer/>

    </div>
  )
}