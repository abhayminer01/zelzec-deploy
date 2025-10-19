import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { getAllCategories, createCategory, updateCategory, deleteCategory, togglePrimary } from "../services/category-api";
import { Pencil, Trash2, Plus, X, Star } from "lucide-react";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", icon: "" });

  const fetchAll = async () => {
    const res = await getAllCategories();
    if (res?.success) setCategories(res.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const res = await updateCategory(currentId, form);
        if (res.success) toast.success("Category updated successfully");
      } else {
        const res = await createCategory(form);
        if (res.success) toast.success("Category created successfully");
      }
      setShowModal(false);
      setForm({ title: "", description: "", icon: "" });
      setEditMode(false);
      fetchAll();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (cat) => {
    setForm(cat);
    setCurrentId(cat._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const res = await deleteCategory(id);
      if (res.success) {
        toast.success("Category deleted");
        fetchAll();
      } else toast.error("Failed to delete");
    }
  };

  const handlePrimary = async (id) => {
    const res = await togglePrimary(id);
    if(res.success) {
        toast.success('Marked as primary');
        window.location.reload();
    } else {
        toast('Something went wrong');
    }
  }

  return (
    <div className="p-6 relative">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Categories</h1>
        <button
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-500/90 text-white px-4 py-2 rounded-lg transition"
          onClick={() => {
            setEditMode(false);
            setForm({ title: "", description: "", icon: "" });
            setShowModal(true);
          }}
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
            >
              <div>
                <h1 className="font-medium text-gray-800">{cat.title}</h1>
                <p className="text-sm text-gray-500">{cat.description}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handlePrimary(cat._id)}>
                    <Star size={18} fill={cat.primary ? "#facc15" : "none"} />
                </button>
                <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:text-blue-800 transition">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:text-red-800 transition">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center py-10">No categories found.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-[350px] p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>

            <h1 className="text-2xl font-bold mb-1">{editMode ? "Edit Category" : "Create Category"}</h1>
            <p className="text-gray-500 text-sm mb-6">
              {editMode ? "Modify details below" : "Add a new category to the system"}
            </p>

            {/* Form */}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title"
                className="border border-gray-300 rounded-lg h-10 px-3"
            />
            <input
                type="text"
                name="icon"
                value={form.icon}
                onChange={handleChange}
                placeholder="Icon (optional)"
                className="border border-gray-300 rounded-lg h-10 px-3"
            />
            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="border border-gray-300 rounded-lg px-3 py-2 h-20"
            />

            {/* 🔧 Dynamic Form Builder */}
            <div className="border-t border-gray-200 pt-3">
                <h2 className="font-semibold text-gray-700 mb-2">Form Fields</h2>
                {form.form_data?.map((field, index) => (
                <div key={index} className="flex flex-col border p-3 rounded-lg mb-2">
                    <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Title (key)"
                        value={field.title}
                        onChange={(e) => {
                        const updated = [...form.form_data];
                        updated[index].title = e.target.value;
                        setForm((prev) => ({ ...prev, form_data: updated }));
                        }}
                        className="border border-gray-300 rounded-lg px-2 py-1 w-1/3"
                    />
                    <input
                        type="text"
                        placeholder="Label"
                        value={field.label}
                        onChange={(e) => {
                        const updated = [...form.form_data];
                        updated[index].label = e.target.value;
                        setForm((prev) => ({ ...prev, form_data: updated }));
                        }}
                        className="border border-gray-300 rounded-lg px-2 py-1 w-1/3"
                    />
                    <select
                        value={field.type}
                        onChange={(e) => {
                        const updated = [...form.form_data];
                        updated[index].type = e.target.value;
                        if (e.target.value !== "select") updated[index].options = [];
                        setForm((prev) => ({ ...prev, form_data: updated }));
                        }}
                        className="border border-gray-300 rounded-lg px-2 py-1 w-1/3"
                    >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="select">Select</option>
                    </select>
                    </div>

                    {/* If Select, show options */}
                    {field.type === "select" && (
                    <div className="mt-2">
                        <input
                        type="text"
                        placeholder="Add comma separated options"
                        value={field.options?.join(", ") || ""}
                        onChange={(e) => {
                            const updated = [...form.form_data];
                            updated[index].options = e.target.value.split(",").map((opt) => opt.trim());
                            setForm((prev) => ({ ...prev, form_data: updated }));
                        }}
                        className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                        />
                    </div>
                    )}

                    <button
                    type="button"
                    onClick={() => {
                        const updated = form.form_data.filter((_, i) => i !== index);
                        setForm((prev) => ({ ...prev, form_data: updated }));
                    }}
                    className="text-red-600 text-sm mt-2 self-end"
                    >
                    Remove Field
                    </button>
                </div>
                ))}

                <button
                type="button"
                onClick={() =>
                    setForm((prev) => ({
                    ...prev,
                    form_data: [...(prev.form_data || []), { title: "", label: "", type: "text", options: [] }],
                    }))
                }
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-lg"
                >
                + Add Field
                </button>
            </div>

            <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-500/90 text-white rounded-lg h-10 mt-4 font-medium transition"
            >
                {editMode ? "Update Category" : "Create Category"}
            </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
