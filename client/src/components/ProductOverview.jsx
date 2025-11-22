// src/components/ProductOverview.jsx
import React from 'react';

const ProductOverview = ({ product }) => {
    const form_data = product.form_data || {};

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Car Overview</h2>
            <div className="grid grid-cols-2 gap-30 mb-4">
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Trim</span>
                        <span>{form_data.trim || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Exterior Color</span>
                        <span>{form_data.color || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Doors</span>
                        <span>{form_data.doors || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Seating Capacity</span>
                        <span>{form_data.seats || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Transmission Type</span>
                        <span>{form_data.transmission || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Seller type</span>
                        <span>{form_data.seller_type || 'N/A'}</span>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Interior Color</span>
                        <span>{form_data.interior_color || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Horsepower</span>
                        <span>{form_data.horsepower || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Body Type</span>
                        <span>{form_data.body_type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">No. of Cylinders</span>
                        <span>{form_data.cylinders || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Engine Capacity (cc)</span>
                        <span>{form_data.engine_capacity || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Warranty</span>
                        <span>{form_data.warranty ? 'Yes' : 'No'}</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 text-sm">
                {product.description || "No description available."}
            </div>
        </div>
    );
};

export default ProductOverview;