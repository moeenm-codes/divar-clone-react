// src/components/Templates/PostList.jsx

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, deleteMyPost } from "services/user";
import { getCategory } from "services/admin";
import { useToast } from "components/hooks/useToast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "components/modules/Loader";
import DeleteButton from "components/modules/DeleteButton";
import DeleteModal from "components/modules/DeleteModal";
import { useState, useMemo } from "react";
import { TbFilter, TbCategory, TbMoodEmpty, TbCalendar } from "react-icons/tb";
import { BiSortAlt2 } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import MyPostsSkeleton from "components/modules/Skeletons/MyPostsSkeleton";
import styles from "./PostList.module.css";

function PostList() {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["my-post-list"],
    queryFn: getPosts,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  const posts = postsData?.data?.posts || [];
  const categories = categoriesData?.data || [];

  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat._id] = cat.name;
    });
    return map;
  }, [categories]);

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [posts, selectedCategory, sortOrder]);

  const deleteMutation = useMutation({
    mutationFn: deleteMyPost,
    onSuccess: () => {
      toast.success("آگهی با موفقیت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["my-post-list"] });
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

  if (postsLoading || categoriesLoading) return <MyPostsSkeleton />;

  const selectedCategoryName =
    selectedCategory === "all"
      ? "همه دسته‌بندی‌ها"
      : categories.find((cat) => cat._id === selectedCategory)?.name;

  const sortOrderName = sortOrder === "newest" ? "جدیدترین" : "قدیمی‌ترین";

  return (
    <div className={styles.list}>
      {/* هدر صفحه */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>آگهی‌های من</h1>
          <p>مدیریت و ویرایش آگهی‌های شما</p>
        </div>
      </div>

      {/* کنترل‌های فیلتر */}
      <div className={styles.controls}>
        {/* دراپ‌داون دسته‌بندی */}
        <div className={styles.dropdownWrapper}>
          <button
            className={`${styles.dropdownBtn} ${
              categoryOpen ? styles.active : ""
            }`}
            onClick={() => {
              setCategoryOpen(!categoryOpen);
              setSortOpen(false);
            }}
          >
            <TbCategory className={styles.icon} />
            <span className={styles.text}>{selectedCategoryName}</span>
            <IoIosArrowDown
              className={`${styles.arrow} ${categoryOpen ? styles.open : ""}`}
            />
          </button>

          {categoryOpen && (
            <div className={styles.dropdown}>
              <button
                className={`${styles.dropdownItem} ${
                  selectedCategory === "all" ? styles.selectedItem : ""
                }`}
                onClick={() => {
                  setSelectedCategory("all");
                  setCategoryOpen(false);
                }}
              >
                <span className={styles.cityName}>همه دسته‌بندی‌ها</span>
                {selectedCategory === "all" && (
                  <span className={styles.check}>✓</span>
                )}
              </button>

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`${styles.dropdownItem} ${
                    selectedCategory === cat._id ? styles.selectedItem : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat._id);
                    setCategoryOpen(false);
                  }}
                >
                  <span className={styles.cityName}>{cat.name}</span>
                  {selectedCategory === cat._id && (
                    <span className={styles.check}>✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* دراپ‌داون مرتب‌سازی */}
        <div className={styles.dropdownWrapper}>
          <button
            className={`${styles.dropdownBtn} ${sortOpen ? styles.active : ""}`}
            onClick={() => {
              setSortOpen(!sortOpen);
              setCategoryOpen(false);
            }}
          >
            <BiSortAlt2 className={styles.icon} />
            <span className={styles.text}>{sortOrderName}</span>
            <IoIosArrowDown
              className={`${styles.arrow} ${sortOpen ? styles.open : ""}`}
            />
          </button>

          {sortOpen && (
            <div className={styles.dropdown}>
              <button
                className={`${styles.dropdownItem} ${
                  sortOrder === "newest" ? styles.selectedItem : ""
                }`}
                onClick={() => {
                  setSortOrder("newest");
                  setSortOpen(false);
                }}
              >
                <span className={styles.cityName}>جدیدترین</span>
                {sortOrder === "newest" && (
                  <span className={styles.check}>✓</span>
                )}
              </button>

              <button
                className={`${styles.dropdownItem} ${
                  sortOrder === "oldest" ? styles.selectedItem : ""
                }`}
                onClick={() => {
                  setSortOrder("oldest");
                  setSortOpen(false);
                }}
              >
                <span className={styles.cityName}>قدیمی‌ترین</span>
                {sortOrder === "oldest" && (
                  <span className={styles.check}>✓</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* اطلاعات وضعیت */}
      <div className={styles.stats}>
        <span className={styles.postsCount}>
          {filteredAndSortedPosts.length} آگهی
        </span>
        {selectedCategory !== "all" && (
          <span className={styles.categoryBadge}>
            در {selectedCategoryName}
          </span>
        )}
      </div>

      {/* لیست آگهی‌ها */}
      <div className={styles.postsGrid}>
        {filteredAndSortedPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <TbMoodEmpty className={styles.emptyIcon} />
            <h3>آگهی‌ای یافت نشد</h3>
            <p>
              {selectedCategory === "all"
                ? "هنوز هیچ آگهی ثبت نکرده‌اید."
                : "در این دسته‌بندی آگهی ندارید."}
            </p>
            <button
              className={styles.primaryButton}
              onClick={() => {
                if (selectedCategory !== "all") {
                  setSelectedCategory("all");
                } else {
                  navigate("/addpost");
                }
              }}
            >
              {selectedCategory === "all"
                ? "ایجاد اولین آگهی"
                : "مشاهده همه آگهی‌ها"}
            </button>
          </div>
        ) : (
          filteredAndSortedPosts.map((post, index) => (
            <div
              key={post._id}
              className={styles.postCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.cardImage}>
                <img
                  src={
                    post.images?.[0]
                      ? `${baseURL}${post.images[0].replace(/\\/g, "/")}`
                      : "/no-image.png"
                  }
                  alt={post.title}
                />
                <div className={styles.cardOverlay}>
                  <button
                    onClick={(e) => {
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
                      e.stopPropagation();
                      handleDelete(post);
                    }}
                  />
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.postTitle}>
                    {post.title || "بدون عنوان"}
                  </h3>
                  <span className={styles.postDate}>
                    <TbCalendar />
                    {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>

                <p className={styles.postDescription}>
                  {post.content?.length > 100
                    ? post.content.slice(0, 100) + "..."
                    : post.content || "بدون توضیحات"}
                </p>

                <div className={styles.cardFooter}>
                  <span className={styles.categoryTag}>
                    {categoryMap[post.category] || "دسته‌بندی حذف شده"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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
