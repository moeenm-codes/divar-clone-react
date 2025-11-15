// src/pages/PostPage.jsx
import { useQuery } from "@tanstack/react-query";
import { getPost } from "services/user";
import { getCategory } from "services/admin";
import Loader from "components/modules/Loader";
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
import styles from "./PostPage.module.css";

const baseURL = import.meta.env.VITE_BASE_URL;

function PostPage() {
  const { id } = useParams();

  // همه Hookها اینجا، قبل از هر شرط
  const [searchParams] = useSearchParams();
  const currentCity = searchParams.get("city");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { data: postData, isLoading: postLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  // شبیه‌سازی بازدید
  useEffect(() => {
    if (postData) {
      console.log("بازدید از آگهی افزایش یافت");
    }
  }, [postData]);

  // حالا شرط‌ها
  if (postLoading) return <Loader />;

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

  // استفاده از فیلدهای اصلی بک‌اند
  const title = post.title || "بدون عنوان";
  const content = post.content || "";
  const city = post.city || post.options?.city || "نامشخص";
  const images = post.images || [];

  // شبیه‌سازی اطلاعات فروشنده
  const sellerInfo = {
    name: post.user?.name || "کاربر دیوار",
    joinDate: new Date(post.user?.createdAt || post.createdAt),
    rating: 4.7,
    reviews: 23,
  };

  const handleShowPhone = () => {
    setShowPhone(true);
  };

  return (
    <div className={styles.container}>
      {/* هدر آگهی */}
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>
            دیوار
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link
            to={`/?category=${post.category}${
              currentCity ? `&city=${currentCity}` : ""
            }`}
            className={styles.breadcrumbLink}
            onClick={() => window.scrollTo(0, 0)}
          >
            {category?.name || "دسته‌بندی"}
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{title}</span>
        </div>

        <div className={styles.headerActions}>
          <button
            className={`${styles.actionButton} ${isLiked ? styles.liked : ""}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <FaHeart className={styles.actionIcon} />
            ذخیره
          </button>
          <button className={styles.actionButton}>
            <FaShare className={styles.actionIcon} />
            اشتراک‌گذاری
          </button>
          <button className={styles.reportButton}>
            <FaExclamationCircle className={styles.actionIcon} />
            گزارش
          </button>
        </div>
      </div>

      {/* بقیه JSX بدون تغییر */}
      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.gallery}>
            <div className={styles.mainImageContainer}>
              {images[0] ? (
                <>
                  <img
                    src={`${baseURL}${images[currentImageIndex]}`}
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
                        Less than
                      </button>
                      <button
                        className={`${styles.navButton} ${styles.nextButton}`}
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1
                          )
                        }
                      >
                        Greater than
                      </button>
                      <div className={styles.imageCounter}>
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className={styles.noImage}>
                  <div className={styles.noImageIcon}>Camera</div>
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
                      src={`${baseURL}${image}`}
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
        </div>
      </div>
    </div>
  );
}

export default PostPage;
