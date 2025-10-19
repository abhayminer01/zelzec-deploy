import React from 'react';
import { Home, Search, Plus, MessageCircle, Menu } from 'lucide-react';
import { useSell } from '../contexts/SellContext';

export default function MobileBottomNav() {
  const { nextStep } = useSell();

  return (
    <div className='fixed bottom-0 left-0 w-full h-16 bg-white border-t border-border flex justify-around items-center md:hidden z-50'>
      <button className='flex flex-col items-center justify-center flex-1'>
        <Home className='text-primary size-6' />
      </button>
      
      <button className='flex flex-col items-center justify-center flex-1'>
        <Search className='text-gray-600 size-6' />
      </button>
      
      <button 
        onClick={() => nextStep()}
        className='flex flex-col items-center justify-center flex-1'
      >
        <div className='bg-black rounded-lg p-2'>
          <Plus className='text-white size-6' />
        </div>
      </button>
      
      <button className='flex flex-col items-center justify-center flex-1'>
        <MessageCircle className='text-gray-600 size-6' />
      </button>
      
      <button className='flex flex-col items-center justify-center flex-1'>
        <Menu className='text-gray-600 size-6' />
      </button>
    </div>
  );
}