import api from "configs/api";
import axios from "axios";
import { getCookie } from "utils/cookie";

const getProfile = () => api.get("user/whoami").then((res) => res || false);
const getPosts = () => api.get("post/my");
const getPost = (id) => api.get(`post/${id}`);
const getAllPosts = () => api.get("");
const deleteMyPost = (id) => api.delete(`post/delete/${id}`);

// ⭐ فیکس شده: مثل createPost باید مستقیم با axios کار کنیم
const updateMyPost = (id, formData) => {
  const token = getCookie("accessToken");

  return axios.patch(
    `${import.meta.env.VITE_BASE_URL}post/update/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // Content-Type رو نمی‌ذاریم تا axios خودش multipart/form-data تنظیم کنه
      },
    }
  );
};

export {
  getProfile,
  getAllPosts,
  getPosts,
  getPost,
  deleteMyPost,
  updateMyPost,
};
