import api from "configs/api";

const getProfile = () => {
  return api.get("user/whoami").then((res) => res || false);
};

const getPosts = () => api.get("post/my");
const getAllPosts = () => api.get("");

const getPost = (id) => api.get(`post/${id}`);

export { getProfile, getPosts, getAllPosts, getPost };
