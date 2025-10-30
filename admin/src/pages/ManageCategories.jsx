import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { getAllCategories, createCategory, updateCategory, deleteCategory, togglePrimary } from "../services/category-api";
import { Pencil, Trash2, Plus, X, Star, Menu } from "lucide-react";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", icon: "", form_data: [] });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAll = async () => {
    const res = await getAllCategories();
    if (res?.success) setCategories(res.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setEditForm({ ...cat });
    setIsEditing(false);
  };

  const handleNewCategory = () => {
    const newCat = { _id: "new", title: "", description: "", icon: "", form_data: [] };
    setSelectedCategory(newCat);
    setEditForm(newCat);
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldChange = (index, fieldKey, value) => {
    setEditForm((prev) => {
      const updated = [...(prev.form_data || [])];
      updated[index] = { ...updated[index], [fieldKey]: value };
      if (fieldKey === "type" && value !== "select") {
        updated[index].options = [];
      }
      return { ...prev, form_data: updated };
    });
  };

  const addFormField = () => {
    setEditForm((prev) => ({
      ...prev,
      form_data: [...(prev.form_data || []), { title: "", label: "", type: "text", options: [] }],
    }));
  };

  const removeFormField = (index) => {
    setEditForm((prev) => {
      const updated = [...(prev.form_data || [])].filter((_, i) => i !== index);
      return { ...prev, form_data: updated };
    });
  };

  const handleSave = async () => {
    try {
      if (selectedCategory._id === "new") {
        // Create new
        const res = await createCategory(editForm);
        if (res.success) {
          toast.success("Category created successfully");
          fetchAll();
          setSelectedCategory(res.data);
          setEditForm(res.data);
          setIsEditing(false);
        } else {
          toast.error("Failed to create category");
        }
      } else {
        // Update existing
        const res = await updateCategory(selectedCategory._id, editForm);
        if (res.success) {
          toast.success("Category updated successfully");
          fetchAll();
          setSelectedCategory(res.data);
          setEditForm(res.data);
          setIsEditing(false);
        } else {
          toast.error("Failed to update category");
        }
      }
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleCancel = () => {
    if (selectedCategory._id === "new") {
      setSelectedCategory(null);
    } else {
      setEditForm({ ...selectedCategory });
      setIsEditing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const res = await deleteCategory(id);
      if (res.success) {
        toast.success("Category deleted");
        fetchAll();
        if (selectedCategory?._id === id) {
          setSelectedCategory(null);
        }
      } else {
        toast.error("Failed to delete");
      }
    }
  };

  const handlePrimary = async (id) => {
    const res = await togglePrimary(id);
    if (res.success) {
      toast.success("Marked as primary");
      fetchAll();
    } else {
      toast.error("Something went wrong");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-indigo-50 p-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Categories</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <span>Home</span>
              <span>•</span>
              <span>Categories</span>
            </div>
          </div>
          <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center">
            <Star size={32} className="text-white" fill="#ffffff" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search Categories"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <h2 className="font-semibold text-gray-800 mb-4">All Categories</h2>

            {/* Add New Button at Top */}
            <button
              onClick={handleNewCategory}
              className="w-full flex items-center justify-center gap-2 py-3 mb-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-indigo-600 font-medium transition"
            >
              <Plus size={18} />
              New Category
            </button>

            {filteredCategories.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-auto pr-2">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat._id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedCategory?._id === cat._id
                        ? "bg-indigo-50 border-2 border-indigo-300"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => handleSelectCategory(cat)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 truncate">{cat.title || "Untitled"}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {cat.description || "No description"}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrimary(cat._id);
                          }}
                          className={`p-1 rounded-full ${
                            cat.primary ? "bg-yellow-100 text-yellow-600" : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <Star size={14} fill={cat.primary ? "#facc15" : "none"} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(cat._id);
                          }}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-6">
                {searchTerm ? "No matches found." : "No categories yet."}
              </p>
            )}
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {selectedCategory ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Menu size={20} className="text-gray-500" />
                      <h2 className="text-xl font-semibold text-gray-800">
                        {selectedCategory._id === "new" ? "New Category" : selectedCategory.title}
                      </h2>
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                    )}
                  </div>

                  {/* Editable Form */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-lg">{editForm.title || "—"} </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        {isEditing ? (
                          <textarea
                            name="description"
                            value={editForm.description || ""}
                            onChange={handleEditChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-lg min-h-[60px]">
                            {editForm.description || "—"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="icon"
                            value={editForm.icon || ""}
                            onChange={handleEditChange}
                            placeholder="e.g., 📦 or icon name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-lg">{editForm.icon || "—"}</p>
                        )}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-800">Form Fields</h3>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={addFormField}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            + Add Field
                          </button>
                        )}
                      </div>

                      {editForm.form_data && editForm.form_data.length > 0 ? (
                        <div className="space-y-3">
                          {editForm.form_data.map((field, index) => (
                            <div
                              key={index}
                              className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative"
                            >
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => removeFormField(index)}
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                  <X size={16} />
                                </button>
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                                <div>
                                  <label className="text-xs text-gray-600">Field Key</label>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={field.title}
                                      onChange={(e) => handleFieldChange(index, "title", e.target.value)}
                                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                  ) : (
                                    <p className="mt-1 text-sm">{field.title || "—"}</p>
                                  )}
                                </div>
                                <div>
                                  <label className="text-xs text-gray-600">Label</label>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={field.label}
                                      onChange={(e) => handleFieldChange(index, "label", e.target.value)}
                                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                  ) : (
                                    <p className="mt-1 text-sm">{field.label || "—"}</p>
                                  )}
                                </div>
                                <div>
                                  <label className="text-xs text-gray-600">Type</label>
                                  {isEditing ? (
                                    <select
                                      value={field.type}
                                      onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                    >
                                      <option value="text">Text</option>
                                      <option value="number">Number</option>
                                      <option value="select">Select</option>
                                    </select>
                                  ) : (
                                    <p className="mt-1 text-sm capitalize">{field.type || "text"}</p>
                                  )}
                                </div>
                              </div>

                              {field.type === "select" && (
                                <div>
                                  <label className="text-xs text-gray-600">Options (comma-separated)</label>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={field.options?.join(", ") || ""}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          index,
                                          "options",
                                          e.target.value.split(",").map((opt) => opt.trim())
                                        )
                                      }
                                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                  ) : (
                                    <div className="mt-1 flex flex-wrap gap-1">
                                      {field.options?.map((opt, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-1 bg-white text-xs rounded border"
                                        >
                                          {opt}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm py-2">
                          {isEditing ? "Click 'Add Field' to define dynamic form inputs." : "No form fields defined."}
                        </p>
                      )}
                    </div>

                    {/* Delete Button (only for existing) */}
                    {selectedCategory._id !== "new" && !isEditing && (
                      <div className="pt-4">
                        <button
                          onClick={() => handleDelete(selectedCategory._id)}
                          className="w-full py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                        >
                          Delete Category
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus size={24} className="text-gray-400" />
                  </div>
                  <p>Select a category or create a new one to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}