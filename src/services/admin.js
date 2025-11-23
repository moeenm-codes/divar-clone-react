import api from "configs/api";
import axios from "axios";

const addCategory = (data) => api.post("category", data);
const getCategory = () => api.get("category");
const deleteCategory = (id) => api.delete(`category/${id}`);
const deletePost = (id) => api.delete(`post/delete/${id}`);

const createPost = ({ formData, token }) => {
  return axios.post(`${import.meta.env.VITE_BASE_URL}post/create`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { addCategory, getCategory, deleteCategory, createPost, deletePost };
