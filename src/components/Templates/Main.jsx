import React from "react";
import { sp } from "utils/numbers";
import { Link } from "react-router-dom";
import { useFavorites } from "components/context/FavoritesContext";
import styles from "./Main.module.css";

function Main({ posts }) {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const { toggleFavorite, isFavorite } = useFavorites();

  if (!posts?.data?.posts?.length) {
    return (
      <div className={styles.empty}>
        <img src="/404.png" alt="آگهی یافت نشد" className={styles.emptyImg} />
        <p>آگهی یافت نشد.</p>
      </div>
    );
  }

  const handleLikeClick = (e, post) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(post);
  };

  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        {posts.data.posts.map((post, index) => {
          if (!post || !post._id) return null;
          const liked = isFavorite(post._id);

          return (
            <div
              key={post._id}
              className={styles.card}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* تصویر قابل کلیک */}
              <Link to={`/post/${post._id}`} className={styles.imageLink}>
                <div className={styles.imageWrapper}>
                  <img
                    src={`${baseURL}${post.images?.[0]}`}
                    alt={post.options?.title || "آگهی"}
                    className={styles.image}
                  />
                  <div className={styles.overlay}></div>

                  {/* قلب - فقط روی هاور */}
                  <button
                    className={`${styles["con-like"]} ${
                      liked ? styles.liked : ""
                    }`}
                    onClick={(e) => handleLikeClick(e, post)}
                    aria-label={
                      liked ? "حذف از علاقه‌مندی‌ها" : "اضافه به علاقه‌مندی‌ها"
                    }
                    type="button"
                  >
                    <div className={styles.checkmark}>
                      {/* قلب خالی */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.outline}
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                      </svg>

                      {/* قلب پر */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.filled}
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                      </svg>

                      {/* انیمیشن جشن */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.celebrate}
                        height="100"
                        width="100"
                      >
                        <polygon
                          className={styles.poly}
                          points="10,10 20,20"
                        ></polygon>
                        <polygon
                          className={styles.poly}
                          points="10,50 20,50"
                        ></polygon>
                        <polygon
                          className={styles.poly}
                          points="20,80 30,70"
                        ></polygon>
                        <polygon
                          className={styles.poly}
                          points="90,10 80,20"
                        ></polygon>
                        <polygon
                          className={styles.poly}
                          points="90,50 80,50"
                        ></polygon>
                        <polygon
                          className={styles.poly}
                          points="80,80 70,70"
                        ></polygon>
                      </svg>
                    </div>
                  </button>
                </div>
              </Link>

              {/* محتوا قابل کلیک */}
              <Link to={`/post/${post._id}`} className={styles.contentLink}>
                <div className={styles.content}>
                  <h3 className={styles.title}>{post.title || "بدون عنوان"}</h3>
                  <div className={styles.footer}>
                    <p className={styles.price}>{sp(post.amount)} تومان</p>
                    <span className={styles.city}>
                      {post.options?.city || "نامشخص"}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Main;
