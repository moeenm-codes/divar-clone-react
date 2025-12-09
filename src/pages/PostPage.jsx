// src/pages/PostPage.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPost } from "services/user";
import { getCategory, deletePost } from "services/admin";
import Loader from "components/modules/Loader";
import PostPageSkeleton from "components/modules/Skeletons/PostPageSkeleton";
import { sp } from "utils/numbers";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEye,
  FaPhone,
  FaShare,
  FaHeart,
  FaExclamationCircle,
} from "react-icons/fa";
import { useFavorites } from "components/context/FavoritesContext";
import DeleteButton from "../components/modules/DeleteButton";
import DeleteModal from "../components/modules/DeleteModal";
import ToastNotification from "../components/modules/ToastNotification";
import styles from "./PostPage.module.css";

const baseURL = import.meta.env.VITE_BASE_URL;

function PostPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();
  const currentCity = searchParams.get("city");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const { toggleFavorite, isFavorite } = useFavorites();

  const { data: postData, isLoading: postLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => import("services/user").then((m) => m.getProfile()),
  });

  const isAdmin = profileData?.data?.role === "ADMIN";

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      setToast({ text: "آگهی با موفقیت حذف شد", type: "success" });
      queryClient.invalidateQueries(["post", id]);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    },
    onError: (error) => {
      setToast({
        text: error.response?.data?.message || "خطا در حذف آگهی",
        type: "error",
      });
    },
  });

  const openDeleteModal = () => setDeleteModal(true);
  const closeDeleteModal = () => setDeleteModal(false);
  const confirmDelete = () => {
    deleteMutation.mutate(id);
    closeDeleteModal();
  };

  useEffect(() => {
    if (postData) {
      console.log("بازدید از آگهی افزایش یافت");
    }
  }, [postData]);

  if (postLoading) return <PostPageSkeleton />;

  const post = postData?.data?.post;
  if (!post) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorAnimation}>
          <FaExclamationCircle className={styles.errorIcon} />
        </div>
        <h2 className={styles.errorTitle}>آگهی مورد نظر یافت نشد</h2>
        <p className={styles.errorText}>
          ممکن است آگهی حذف شده باشد یا آدرس آن تغییر کرده باشد.
        </p>
        <Link to="/" className={styles.errorButton}>
          بازگشت به صفحه اصلی
        </Link>
      </div>
    );
  }

  const category = categoriesData?.data?.find(
    (cat) => cat._id === post.category
  );
  const title = post.options?.title || post.title || "بدون عنوان";
  const content = post.options?.content || post.content || "";
  const city = post.city || post.options?.city || "نامشخص";
  const images = post.images || [];

  const sellerInfo = {
    name: post.user?.name || "کاربر دیوار",
    joinDate: new Date(post.user?.createdAt || post.createdAt),
    rating: 4.7,
    reviews: 23,
  };

  const handleShowPhone = () => setShowPhone(true);

  const favoriteKey = `${post._id}-${isFavorite(post._id)}`; // برای ریست انیمیشن

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toast && (
        <div className={styles.toastWrapper}>
          <ToastNotification
            message={toast.text}
            type={toast.type}
            onClose={() => setToast(null)}
            duration={3000}
          />
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>
            دیوار
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link
            to={`/?category=${post.category}`}
            className={styles.breadcrumbLink}
            onClick={() => window.scrollTo(0, 0)}
          >
            {category?.name || "دسته‌بندی"}
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{title}</span>
        </div>

        {/* دکمه‌های عملیاتی */}
        <div className={styles.headerActions}>
          {/* دکمه ذخیره با انیمیشن حرفه‌ای */}
          <button
            key={favoriteKey}
            className={`${styles.actionButton} ${
              isFavorite(post._id) ? styles.liked : ""
            }`}
            onClick={() => toggleFavorite(post)}
          >
            <FaHeart className={styles.actionIcon} />
            <span className={styles.favoriteText}>
              {isFavorite(post._id) ? "حذف از ذخیره" : "ذخیره"}
            </span>
          </button>

          <button className={styles.actionButton} disabled>
            <FaShare className={styles.actionIcon} />
            اشتراک‌گذاری
          </button>

          <Link to="/my-divar/support" className={styles.actionButton}>
            <FaExclamationCircle className={styles.actionIcon} />
            گزارش
          </Link>
        </div>
      </div>

      {/* بقیه محتوا بدون تغییر... */}
      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.gallery}>
            <div className={styles.mainImageContainer}>
              {images.length > 0 ? (
                <>
                  <img
                    src={`${baseURL}${images[currentImageIndex]?.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={title}
                    className={styles.mainImage}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        className={`${styles.navButton} ${styles.prevButton}`}
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1
                          )
                        }
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M15 18l-6-6 6-6"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <button
                        className={`${styles.navButton} ${styles.nextButton}`}
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1
                          )
                        }
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M9 18l6-6-6-6"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <div className={styles.imageCounter}>
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className={styles.noImage}>
                  <span>تصویری برای این آگهی ثبت نشده است</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`${styles.thumbnail} ${
                      index === currentImageIndex ? styles.thumbnailActive : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={`${baseURL}${image.replace(/\\/g, "/")}`}
                      alt={`${title} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.postInfo}>
            <div className={styles.postHeader}>
              <h1 className={styles.title}>{title}</h1>
              <div className={styles.price}>
                {post.amount ? `${sp(post.amount)} تومان` : "قیمت توافقی"}
              </div>
            </div>

            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <FaMapMarkerAlt className={styles.metaIcon} />
                <span>{city}</span>
              </div>
              <div className={styles.metaItem}>
                <FaCalendarAlt className={styles.metaIcon} />
                <span>
                  {new Date(post.createdAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className={styles.metaItem}>
                <FaEye className={styles.metaIcon} />
                <span>{(Math.random() * 100 + 50).toFixed(0)} بازدید</span>
              </div>
            </div>

            {content && (
              <div className={styles.description}>
                <h3 className={styles.descriptionTitle}>توضیحات</h3>
                <div className={styles.descriptionContent}>{content}</div>
              </div>
            )}
            <div className={styles.categoryInfo}>
              <span className={styles.categoryLabel}>دسته‌بندی:</span>
              <span className={styles.categoryName}>
                {category?.name || "نامشخص"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.sellerCard}>
            <div className={styles.sellerHeader}>
              <div className={styles.sellerAvatar}>
                {sellerInfo.name.charAt(0)}
              </div>
              <div className={styles.sellerInfo}>
                <div className={styles.sellerName}>{sellerInfo.name}</div>
                <div className={styles.sellerStats}>
                  <span className={styles.sellerRating}>
                    Star {sellerInfo.rating}
                  </span>
                  <span className={styles.sellerReviews}>
                    ({sellerInfo.reviews} نظر)
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.sellerMeta}>
              <div className={styles.sellerJoinDate}>
                عضویت در{" "}
                {sellerInfo.joinDate.toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                })}
              </div>
            </div>

            <div className={styles.contactSection}>
              {showPhone ? (
                <div className={styles.phoneRevealed}>
                  <div className={styles.phoneNumber}>۰۹۱۲ ۱۲۳ ۴۵۶۷</div>
                  <div className={styles.phoneNote}>شماره تماس فروشنده</div>
                </div>
              ) : (
                <button
                  className={styles.contactButton}
                  onClick={handleShowPhone}
                >
                  <FaPhone className={styles.contactIcon} />
                  نمایش شماره تماس
                </button>
              )}
            </div>

            <button className={styles.chatButton} disabled>
              چت در دیوار
              <span className={styles.comingSoon}>به زودی</span>
            </button>
          </div>

          <div className={styles.securityTips}>
            <h4 className={styles.securityTitle}>نکات امنیتی دیوار</h4>
            <ul className={styles.securityList}>
              <li>• بدون پیش‌پرداخت معامله کنید</li>
              <li>• از جابجایی در مکان‌های عمومی خودداری کنید</li>
              <li>• کالا را قبل از خرید به دقت بررسی کنید</li>
            </ul>
          </div>

          {isAdmin && (
            <div className={styles.adminDeleteContainer}>
              <button
                className={styles.adminDeleteButton}
                onClick={openDeleteModal}
              >
                <DeleteButton />
                <span>حذف آگهی</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModal}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
        categoryName={title}
        title="حذف آگهی"
        message={`آیا از حذف آگهی <strong>«${title}»</strong> مطمئن هستید؟`}
      />
    </div>
  );
}

export default PostPage;
