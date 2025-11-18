import React, { useEffect, useState } from 'react';
import { Search, UserCircleIcon } from "lucide-react";
import { checkAuth } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';
import { useSell } from '../contexts/SellContext';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
    const { isLoginOpen, openLogin, closeLogin, openRegister } = useModal();
    const { step, nextStep } = useSell();

  useEffect(() => {
    fetchSessionData();
  }, []);
  
  const fetchSessionData = async () => {
    try {
      const res = await checkAuth();
      if (res?.success) {
        login();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='w-screen h-16 md:h-20 flex justify-center align-middle gap-10 items-center px-4 md:px-10 border-b border-border'>
      <div className='md:hidden w-full flex justify-center'>
        <img src="/images/logo.png" alt="Logo" className="h-8" />
      </div>

      <img src="/images/logo.png" alt="Logo" className="h-10 hidden md:block" />

      <div className='relative w-[750px] hidden md:block'>
          <input 
            type="text" 
            placeholder='Search'
            className='w-full bg-white h-10 rounded-lg pl-4 pr-10 border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all'
          />
          <Search className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500' size={18} />
        </div>

      <div className='items-center gap-5 hidden md:flex'>
          {isAuthenticated ? (
            <>
              <UserCircleIcon onClick={() => navigate('/profile')} className='text-primary size-9 cursor-pointer' />
              <button className='primarybutton' onClick={() => nextStep()}>Sell</button>
            </>
          ) : (
            <>
              <button className='secondarybutton' onClick={() => openLogin()}>Sign-In</button>
              <button className='primarybutton' onClick={() => openRegister()}>Register</button>
            </>
          )}
        </div>
          </div>
  );
}