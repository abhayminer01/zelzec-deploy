import React, { useRef, useState, useEffect } from "react";
import { Plus, X, ArrowLeft } from "lucide-react";
import { useSell } from "../../contexts/SellContext";

export default function UploadImage({ onNext }) {
  const { data, handleImageChange, nextStep, prevStep } = useSell();
  const [images, setImages] = useState(data.images || []);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (data.images) setImages(data.images);
  }, [data.images]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    const updated = [...images, ...previews];
    setImages(updated);
    handleImageChange(updated);
  };
  const handleDelete = (url) => {
    const updated = images.filter((img) => img.url !== url);
    setImages(updated);
    handleImageChange(updated);
  };
  const handleNext = () => {
    handleImageChange(images);
    nextStep();
  };

  return (
    <div className="fixed inset-0 bg-black/50 md:bg-black/50 bg-white md:flex md:items-center md:justify-center z-50">
      <div className="bg-white rounded-none md:rounded-2xl shadow-xl w-full h-full md:w-[450px] md:max-h-[90vh] p-6 md:p-8 flex flex-col relative overflow-y-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={prevStep}
            className="md:hidden mr-3"
            type="button"
          >
            <ArrowLeft className="size-6 text-gray-700" />
          </button>
          <h2 className="text-xl md:text-lg font-semibold text-left md:text-center flex-1 md:flex-none">
            Add Photos
          </h2>
        </div>
        <div className="flex justify-center">
          <div
            onClick={() => fileInputRef.current.click()}
            className="border-2 border-primary/40 rounded-3xl w-full md:w-60 aspect-square md:h-60 flex items-center justify-center cursor-pointer hover:border-primary transition"
          >
            <div className="bg-primary/20 rounded-2xl p-6 md:p-4">
              <Plus className="text-white size-12 md:size-16" strokeWidth={3} />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        {images.length > 0 && (
          <div className="mt-6 w-full grid grid-cols-3 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img.url}
                  alt={`preview-${index}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleDelete(img.url)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  type="button"
                >
                  <X className="size-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex-1 md:flex-none"></div>
        <button
          onClick={handleNext}
          type="button"
          className="mt-8 md:mt-8 mb-20 md:mb-0 bg-primary text-white font-medium w-full py-3 rounded-xl hover:bg-primary/90 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}