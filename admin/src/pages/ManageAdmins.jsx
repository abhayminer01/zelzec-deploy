import React, { useEffect, useState } from "react";
import { getAllAdmins, registerAdmin, updateAdmin, deleteAdmin } from "../services/auth";
import { toast, Toaster } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const fetchAllAdmins = async () => {
    const res = await getAllAdmins();
    if (res?.success) setAdmins(res.data);
  };

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        const res = await updateAdmin(editingAdmin._id, form);
        if (res?.success) toast.success("Admin updated successfully");
      } else {
        const res = await registerAdmin(form);
        if (res?.success) toast.success("Admin created successfully");
      }
      setForm({ name: "", email: "", password: "" });
      setShowModal(false);
      setEditingAdmin(null);
      fetchAllAdmins();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    const res = await deleteAdmin(id);
    if (res?.success) {
      toast.success("Admin deleted successfully");
      fetchAllAdmins();
    }
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setForm({ name: admin.name, email: admin.email, password: "" });
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Admins</h1>
        <button
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Create Admin
        </button>
      </div>

      {/* Admin list */}
      <div className="space-y-3">
        {admins.length > 0 ? (
          admins.map((a) => (
            <div
              key={a._id}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
            >
              <div>
                <h1 className="font-medium text-gray-800">Name: {a.name}</h1>
                <p className="text-sm text-gray-600">Email: {a.email}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(a)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">No admins found</p>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setShowModal(false);
            setEditingAdmin(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-[350px] p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowModal(false);
                setEditingAdmin(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h1 className="text-2xl font-bold mb-1">
              {editingAdmin ? "Edit Admin" : "Create Admin"}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {editingAdmin ? "Update admin details" : "Add a new admin"}
            </p>

            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                name="password"
                type="password"
                placeholder={editingAdmin ? "New password (optional)" : "Password"}
                value={form.password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
              >
                {editingAdmin ? "Update Admin" : "Create Admin"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
