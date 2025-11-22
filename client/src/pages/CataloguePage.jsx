import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goToFirst = () => onPageChange(1);
  const goToPrev = () => currentPage > 1 && onPageChange(currentPage - 1);
  const goToNext = () =>
    currentPage < totalPages && onPageChange(currentPage + 1);
  const goToLast = () => onPageChange(totalPages);

  return (
    <div className="flex items-center gap-2 py-4 select-none">
      {/* First Page */}
      <button
        onClick={goToFirst}
        className="w-8 h-8 flex items-center justify-center border border-purple-300 rounded-lg text-purple-500 hover:bg-purple-50"
      >
        «
      </button>

      {/* Previous Page */}
      <button
        onClick={goToPrev}
        className="w-8 h-8 flex items-center justify-center border border-purple-300 rounded-lg text-purple-500 hover:bg-purple-50"
      >
        ‹
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {pages.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border 
            ${
              currentPage === num
                ? "bg-[#8069AE] text-white border-purple-500"
                : "border-purple-300 text-purple-500 hover:bg-purple-50"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Next Page */}
      <button
        onClick={goToNext}
        className="w-8 h-8 flex items-center justify-center border border-purple-300 rounded-lg text-purple-500 hover:bg-purple-50"
      >
        ›
      </button>

      {/* Last Page */}
      <button
        onClick={goToLast}
        className="w-8 h-8 flex items-center justify-center border border-purple-300 rounded-lg text-purple-500 hover:bg-purple-50"
      >
        »
      </button>
    </div>
  );
};

const CataloguePage = () => {
  const [expandedSections, setExpandedSections] = useState({
    locations: true,
    brand: true,
    budget: true,
    year: true,
    owners: true,
    kmDriven: true,
    fuel: true,
    transmission: true
  });

  const [page, setPage] = useState(1);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Sample car data matching the image exactly
  const cars = Array(12).fill(null).map((_, index) => ({
    id: index + 1,
    name: 'FORD RAPTOR PERFORMANCE 2026 IN PERFECT CONDITION NEWF...',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop',
    price: '41,68,500',
    type: 'Ford',
    series: 'F-Series Pickup',
    register: 'Raptor',
    year: '2020',
    km: '137,960 km',
    location: 'Kochi, Kerala',
    featured: true
  }));

  return (
    <div className="bg-white">
      <NavBar />
      <MobileBottomNav />
      
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-600 mb-4">
          Home / Vehicles / Used Cars / <span className="text-gray-900 font-medium">Cars</span>
        </div>

        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Used Ford Cars for Sale in Kerala • <span className="text-gray-600 font-normal">1,000 Ads</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort:</span>
            <select className="px-3 py-1.5 border border-gray-300 rounded bg-white text-sm text-gray-700 focus:outline-none focus:border-gray-400">
              <option>Default</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Year: New to Old</option>
            </select>
          </div>
        </div>

        <div className="flex gap-5">
          {/* Left Sidebar - Filters */}
          <div className="w-[270px] flex-shrink-0">
            <div className="bg-white rounded-md">
              {/* CATEGORIES */}
              <div className="border-b border-gray-200 p-4">
                <h3 className="text-[11px] font-bold text-gray-900 mb-3 tracking-wide">CATEGORIES</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center text-sm text-gray-700">
                    <span className="mr-2">−</span> All Categories
                  </button>
                  <button className="w-full text-left pl-5 text-sm text-[#6366F1] font-medium">
                    Cars
                  </button>
                </div>
              </div>

              {/* LOCATIONS */}
              <div className="border-b border-gray-200 p-4">
                <button 
                  onClick={() => toggleSection('locations')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h3 className="text-[11px] font-bold text-gray-900 tracking-wide">LOCATIONS</h3>
                  {expandedSections.locations ? <ChevronUp className="w-3.5 h-3.5 text-gray-600" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-600" />}
                </button>
                {expandedSections.locations && (
                  <div className="space-y-2">
                    <button className="w-full flex items-center text-sm text-gray-700">
                      <span className="mr-2">−</span> India
                    </button>
                    <button className="w-full text-left pl-5 text-sm text-gray-700">
                      Kerala
                    </button>
                    <button className="mt-3 text-sm text-gray-400">
                      Filters
                    </button>
                  </div>
                )}
              </div>

              {/* BRAND AND MODEL */}
              <div className="border-b border-gray-200 p-4">
                <button 
                  onClick={() => toggleSection('brand')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h3 className="text-[11px] font-bold text-gray-900 tracking-wide">BRAND AND MODEL</h3>
                  {expandedSections.brand ? <ChevronUp className="w-3.5 h-3.5 text-gray-600" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-600" />}
                </button>
                {expandedSections.brand && (
                  <div>
                    <div className="relative mb-3">
                      <input
                        type="text"
                        placeholder="Search brands or model"
                        className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                      />
                      <Search className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                    <div className="mb-4">
                      <h4 className="text-[11px] font-bold text-gray-900 mb-2.5 tracking-wide">ALL BRANDS</h4>
                      <div className="space-y-2">
                        {['Maruti Suzuki', 'Hyundai', 'Mahindra', 'Toyota', 'Honda', 'Tata'].map((brand) => (
                          <label key={brand} className="flex items-center cursor-pointer group">
                            <input type="checkbox" className="w-3.5 h-3.5 border-2 border-gray-300 rounded-sm text-[#6366F1] focus:ring-0 focus:ring-offset-0" />
                            <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-gray-900 mb-2.5 tracking-wide">ALL MODELS</h4>
                      <div className="space-y-2">
                        {['Maruti Suzuki Swift', 'Maruti Suzuki Wagon R', 'Hyundai Creta', 'Honda City', 'Hyundai i20', 'Maruti Suzuki Dzire'].map((model) => (
                          <label key={model} className="flex items-center cursor-pointer group">
                            <input type="checkbox" className="w-3.5 h-3.5 border-2 border-gray-300 rounded-sm text-[#6366F1] focus:ring-0 focus:ring-offset-0" />
                            <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{model}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BUDGET */}
              <div className="border-b border-gray-200 p-4">
                <button 
                  onClick={() => toggleSection('budget')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h3 className="text-[11px] font-bold text-gray-900 tracking-wide">BUDGET</h3>
                  {expandedSections.budget ? <ChevronUp className="w-3.5 h-3.5 text-gray-600" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-600" />}
                </button>
                {expandedSections.budget && (
                  <div className="text-xs text-gray-500 mb-2">
                    <p className="mb-2">Choose from options below</p>
                    <div className="space-y-1.5">
                      {['Below 1 Lac', '1 Lac - 3 Lac', '3 Lac - 5 Lac', '5 Lac - 10 Lac', '10 Lac - 15 Lac', '15 Lac and Above'].map((range) => (
                        <button key={range} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded">
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* YEAR */}
              <div className="border-b border-gray-200 p-4">
                <button 
                  onClick={() => toggleSection('year')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h3 className="text-[11px] font-bold text-gray-900 tracking-wide">YEAR</h3>
                  {expandedSections.year ? <ChevronUp className="w-3.5 h-3.5 text-gray-600" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-600" />}
                </button>
                {expandedSections.year && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Choose from options below</p>
                    <div className="space-y-1.5 mb-3">
                      {['Under 3 Years', '3 Years - 5 Years', '5 Years - 7 Years', '7 Years and Above'].map((range) => (
                        <button key={range} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded">
                          {range}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Choose a year below</p>
                    <div className="flex items-center gap-2">
                      <input type="text" placeholder="2006" className="flex-1 w-3 px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-700 focus:outline-none focus:border-gray-400" />
                      <span className="text-xs text-gray-500">to</span>
                      <input type="text" placeholder="2025" className="flex-1 w-3 px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-700 focus:outline-none focus:border-gray-400" />
                      <button className="px-3 py-1.5 bg-[#F6F1FF] text-black text-xs rounded hover:bg-white">
                        apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* NO. OF OWNERS */}
              <div className="border-b border-gray-200 p-4">
                <button 
                  onClick={() => toggleSection('owners')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h3 className="text-[11px] font-bold text-gray-900 tracking-wide">NO. OF OWNERS</h3>
                  {expandedSections.owners ? <ChevronUp className="w-3.5 h-3.5 text-gray-600" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-600" />}
                </button>
                {expandedSections.owners && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Choose from below options</p>
                    <div className="space-y-2">
                      {['First', 'Second', 'Third', 'Fourth', 'More than Four'].map((owner) => (
                        <label key={owner} className="flex items-center cursor-pointer group">
                          <input type="checkbox" className="w-3.5 h-3.5 border-2 border-gray-300 rounded-sm text-[#6366F1] focus:ring-0 focus:ring-offset-0" />
                          <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{owner}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* KM DRIVEN */}
              <div className="border-b border-gray-200 p-4">
                <button 
                  onClick={() => toggleSection('kmDriven')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h3 className="text-[11px] font-bold text-gray-900 tracking-wide">KM DRIVEN</h3>
                  {expandedSections.kmDriven ? <ChevronUp className="w-3.5 h-3.5 text-gray-600" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-600" />}
                </button>
                {expandedSections.kmDriven && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Choose from options [KM]</p>
                    <div className="space-y-1.5">
                      {['Below 25000 km', '25000 km - 50000 km', '50000 km - 75000 km', '75000 km - 100000 km', '100000 km and Above'].map((range) => (
                        <button key={range} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded">
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* FUEL */}
              <div className="border-b border-gray-200 p-4">
                <button 
                  onClick={() => toggleSection('fuel')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h3 className="text-[11px] font-bold text-gray-900 tracking-wide">FUEL</h3>
                  {expandedSections.fuel ? <ChevronUp className="w-3.5 h-3.5 text-gray-600" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-600" />}
                </button>
                {expandedSections.fuel && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Choose from below options</p>
                    <div className="space-y-2">
                      {['Petrol', 'Diesel', 'LPG', 'CNG & Hybrids', 'Electric'].map((fuel) => (
                        <label key={fuel} className="flex items-center cursor-pointer group">
                          <input type="checkbox" className="w-3.5 h-3.5 border-2 border-gray-300 rounded-sm text-[#6366F1] focus:ring-0 focus:ring-offset-0" />
                          <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{fuel}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* TRANSMISSION */}
              <div className="p-4">
                <button 
                  onClick={() => toggleSection('transmission')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h3 className="text-[11px] font-bold text-gray-900 tracking-wide">TRANSMISSION</h3>
                  {expandedSections.transmission ? <ChevronUp className="w-3.5 h-3.5 text-gray-600" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-600" />}
                </button>
                {expandedSections.transmission && (
                  <div className="space-y-1.5">
                    {['Automatic', 'Manual'].map((trans) => (
                      <button key={trans} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded">
                        {trans}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Car Listings */}
          <div className="flex-1">
            <div className="space-y-4">
              {cars.map((car) => (
                <div key={car.id} className="bg-white rounded-md hover:shadow-md transition-shadow overflow-hidden">
                  <div className="flex">
                    {/* Car Image */}
                    <div className="w-[280px] h-[185px] flex-shrink-0">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Car Details */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-1.5">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">₹ {car.price}</h3>
                          </div>
                          <button className="w-9 h-9 flex items-center text-white justify-center bg-[#8069AE] rounded-lg hover:shadow-2xl transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-forward-icon lucide-forward"><path d="m15 17 5-5-5-5"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/></svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {car.type} • {car.series} • {car.register}
                        </p>
                        <p className="text-sm text-gray-800 mb-2.5 leading-relaxed">
                          {car.name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {car.year}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {car.km}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {car.location}
                          </span>
                        </div>
                      </div>
                      {car.featured && (
                        <div className="flex justify-end mt-3">
                          <span className="inline-block bg-[#FCD34D] text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wide">
                            FEATURED
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center p-10">
              <Pagination
                currentPage={page}
                totalPages={10}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CataloguePage;