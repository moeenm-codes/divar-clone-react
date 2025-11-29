import api from "configs/api";

const getProfile = () => api.get("user/whoami").then((res) => res || false);
const getPosts = () => api.get("post/my");
const getPost = (id) => api.get(`post/${id}`);
const getAllPosts = () => api.get("");
const deleteMyPost = (id) => api.delete(`post/delete/${id}`);
const updateMyPost = (id, formData) => api.patch(`post/update/${id}`, formData);

export {
  getProfile,
  getAllPosts,
  getPosts,
  getPost,
  deleteMyPost,
  updateMyPost,
};
