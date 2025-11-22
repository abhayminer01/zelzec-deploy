// src/components/ProductInfoCard.jsx
import React from 'react';

const ProductInfoCard = ({ product, onChatClick, isOwner, currentUserId }) => {
    const seller = product.user || {};
    const price = product.price;

    return (
        <div className="bg-[#F0E9FF] flex flex-col  items-center p-6 rounded-lg shadow-md space-y-5">
            {/* Price Section */}
            <div>
                <div className="text-7xl font-extrabold text-[#7C5CB9]">₹{price?.toLocaleString() || 'N/A'}</div>
                <button className="w-full mt-4 bg-[#8069AE] text-white py-3  rounded-lg hover:bg-[#6e579b] transition-colors">
                    Make offer
                </button>
                <div className="flex justify-center text-xs text-gray-600 mt-2">
                    Posted on: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                </div>
            </div>

            <hr className="border-gray-300" />

            {/* Seller or Owner Section */}
            {isOwner ? (
                <div>
                    <h3 className="font-semibold text-[#7C5CB9] mb-3">Your Product</h3>
                    <div className="flex gap-3">
                        <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                            Edit Product
                        </button>
                        <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                            Delete Product
                        </button>
                    </div>
                </div>
            ) : (
                <div className='border-transparent py-2 px-8 shadow-xl rounded-xl'>
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={
                                seller.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.full_name || 'Seller')}&background=8069AE&color=fff`
                            }
                            alt={seller.full_name || 'Seller'}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <h4 className="font-semibold text-[#7C5CB9]">{seller.full_name || 'Seller'}</h4>
                            <div className="text-xs text-gray-600">Individual • Kerala</div>
                        </div>
                    </div>
                    <button
                        onClick={onChatClick}
                        className="w-full bg-[#8069AE] text-white py-3 px-8 rounded-lg hover:bg-[#6e579b] transition-colors"
                    >
                        Chat with seller
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductInfoCard;