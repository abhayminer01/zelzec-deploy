import React, { useEffect, useState } from "react";
import { useSell } from "../../contexts/SellContext";
import { getCategoryForm } from "../../services/category-api";
import * as Icons from "lucide-react";

export default function AddDetails() {
  const [form, setForm] = useState([]);
  const { data, handleFormDataChange, handleChange, nextStep, prevStep } = useSell();

  useEffect(() => {
    fetchCategoryForm();
  }, []);

  const fetchCategoryForm = async () => {
    try {
      const category = localStorage.getItem("category");
      const req = await getCategoryForm(category);
      if (req.success) {
        setForm(req.data.form_data);
      }
    } catch (err) {
      console.error("Error fetching category form:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 md:bg-black/50 bg-white md:flex md:items-center md:justify-center z-50"
    >
      <div 
        className="bg-white rounded-none md:rounded-2xl shadow-xl w-full h-full md:w-[450px] md:h-auto p-6 md:p-8 flex flex-col relative overflow-y-auto"
      >
        <div className="flex items-center mb-6 md:mb-4">
          <button 
            onClick={prevStep}
            className="md:hidden mr-3"
          >
            <Icons.ArrowLeft className="size-6 text-gray-700" />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-left md:text-center flex-1 md:flex-none">
            Add Details
          </h1>
        </div>

        <form className="w-full flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="font-medium mb-2 text-sm">Title</label>
            <input 
              type="text" 
              placeholder="Ad Title"
              name="title" 
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-2 text-sm">Description</label>
            <input 
              type="text" 
              placeholder="description"
              name="description" 
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
          {form.map((field) => (
            <div key={field._id} className="flex flex-col">
              <label className="font-medium mb-2 text-sm">{field.title}</label>

              {field.type === "select" ? (
                <select
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  onChange={handleFormDataChange}
                  name={field.label}
                >
                  <option value="">Select {field.title}</option>
                  {field.options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.label}
                  placeholder={field.title}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  onChange={handleFormDataChange}
                />
              )}
            </div>
          ))}
          <button 
            type="button"
            className="bg-primary w-full py-3 text-white rounded-lg justify-end  hover:bg-primary/90 font-medium" 
            onClick={() => nextStep()}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}