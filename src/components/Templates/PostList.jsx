// src/components/Templates/PostList.jsx

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, deleteMyPost } from "services/user";
import { useToast } from "components/hooks/useToast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "components/modules/Loader";
import DeleteButton from "components/modules/DeleteButton";
import DeleteModal from "components/modules/DeleteModal";
import { useState } from "react";
import styles from "./PostList.module.css";

function PostList() {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-post-list"],
    queryFn: getPosts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMyPost,
    onSuccess: () => {
      toast.success("آگهی با موفقیت حذف شد");

      queryClient.removeQueries({ queryKey: ["my-post-list"] });
      queryClient.removeQueries({ queryKey: ["post-list"] });
      queryClient.removeQueries({ queryKey: ["post"] });

      setDeleteModalOpen(false);
    },
    onError: () => toast.error("خطا در حذف آگهی"),
  });

  const handleDelete = (post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete?._id) {
      deleteMutation.mutate(postToDelete._id);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className={styles.list}>
      <h3>آگهی‌های من</h3>

      {data?.data?.posts?.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888", margin: "60px 0" }}>
          هنوز آگهی ثبت نکرده‌اید.
        </p>
      ) : (
        data.data.posts.map((post, index) => (
          <div
            key={post._id}
            className={styles.post}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Link to={`/post/${post._id}`} className={styles.postLink}>
              <img
                src={
                  post.images?.[0]
                    ? `${baseURL}${post.images[0].replace(/\\/g, "/")}`
                    : "/no-image.png"
                }
                alt={post.title}
              />
              <div className={styles.content}>
                <p>{post.title || "بدون عنوان"}</p>
                <span>
                  {post.content?.length > 70
                    ? post.content.slice(0, 70) + "..."
                    : post.content || "بدون توضیحات"}
                </span>
              </div>
            </Link>

            <div className={styles.actions}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.scrollTo(0, 0);
                  navigate(`/editpost/${post._id}`);
                }}
                className={styles.editBtn}
              >
                ویرایش
              </button>

              <DeleteButton
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(post);
                }}
              />
            </div>
          </div>
        ))
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        categoryName={postToDelete?.title || "آگهی"}
      />
    </div>
  );
}

export default PostList;
