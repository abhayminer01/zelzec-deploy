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


export default function HomePage() {
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const { isLoginOpen, isRegisterOpen, openLogin, closeLogin } = useModal();
  const { step } = useSell();

  useEffect(() => {
    fetchPrimaryCategories();
    fetchProducts();
  }, []);

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
          <img src="images/image.png" className='w-screen h-100' />
        </div>
        <div className='px-4 md:px-50 mt-6 md:mt-10'>
          <h1 className='text-[18px] md:text-[20px] font-semibold'>Browse Categories</h1>
          <div className='grid grid-cols-3 md:flex md:justify-center gap-3 md:gap-6 mt-5'>
            {category.map((item, index) => {
              const Icon = Icons[item.icon];
              return(
                <div key={index} className='border px-4 py-4 md:px-8 md:py-4 w-full flex flex-col justify-center align-middle items-center border-border rounded-lg hover:text-primary transition hover:border-primary' >
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {products.map((p) => {
                  const Icon = Icons[p.category?.icon] || Icons.Package;

                  return (
                    <div
                      key={p._id}
                      className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-3 flex flex-col cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="w-full h-36 md:h-40 overflow-hidden rounded-md">
                        <img
                          src={`http://localhost:5000${p.images?.[0]?.url}`}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="mt-3 flex flex-col flex-grow justify-between">
                        <h2 className="text-sm md:text-base font-semibold line-clamp-1">
                          {p.title}
                        </h2>
                        <p>{p.description}</p>

                        <div className="flex items-center gap-1 text-gray-500 text-xs md:text-sm">
                          {Icon && <Icon className="size-4 text-primary" />}
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
            )}
          </div>
        </div>

        <div className='bg-primary w-screen h-70'>

        </div>

    </div>
  )
}