import React from "react";
import { sp } from "utils/numbers";
import { Link } from "react-router-dom";
import styles from "./Main.module.css";

function Main({ posts }) {
  const baseURL = import.meta.env.VITE_BASE_URL;

  if (!posts?.data?.posts?.length) {
    return (
      <div className={styles.empty}>
        <img src="/404.png" alt="آگهی یافت نشد" className={styles.emptyImg} />
        <p>آگهی یافت نشد.</p>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        {posts.data.posts.map((post, index) => (
          <Link
            to={`/post/${post._id}`}
            key={post._id}
            className={styles.card}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={styles.imageWrapper}>
              <img
                src={`${baseURL}${post.images[0]}`}
                alt={post.options.title}
                className={styles.image}
              />
              <div className={styles.overlay}></div>
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>{post.options.title}</h3>
              <div className={styles.footer}>
                <p className={styles.price}>{sp(post.amount)} تومان</p>
                <span className={styles.city}>{post.options.city}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default Main;
