// src/components/ProductMap.jsx
import React from 'react';

const ProductMap = ({ location }) => {
    // Dummy map — replace with real map API (Google Maps, Leaflet, etc.)
    return (
        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Location</div>
                <div className="text-xs">{location?.place || "Kerala, India"}</div>
            </div>
        </div>
    );
};

export default ProductMap;
