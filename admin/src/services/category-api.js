import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/category",
  withCredentials: true,
});

// Create
export const createCategory = async (payload) => {
  const res = await api.post("/", payload);
  return res.data;
};

// Get All
export const getAllCategories = async () => {
  const res = await api.get("/");
  return res.data;
};

// Update
export const updateCategory = async (id, payload) => {
  const res = await api.put(`/${id}`, payload);
  return res.data;
};

// Delete
export const deleteCategory = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};


export const togglePrimary = async (id) => {
  try {
    const res = await api.patch(`/${id}/toggle-primary`);
    return res.data;
  } catch (err) {
    return { success: false, err: err.message };
  }
};