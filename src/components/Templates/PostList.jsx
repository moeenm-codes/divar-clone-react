// src/components/Templates/PostList.jsx

import { useQuery } from "@tanstack/react-query";
import Loader from "components/modules/Loader";
import { getPosts } from "services/user";
import { sp } from "utils/numbers";
import { Link } from "react-router-dom";
import truncateText from "utils/truncateText";

import styles from "./PostList.module.css";

function PostList() {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const { data, isLoading } = useQuery({
    queryKey: ["my-post-list"],
    queryFn: getPosts,
  });

  return (
    <div className={styles.list}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h3>آگهی‌های من</h3>
          {data?.data?.posts?.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888", margin: "40px 0" }}>
              هنوز آگهی ثبت نکرده‌اید.
            </p>
          ) : (
            data.data.posts.map((post, index) => (
              <Link
                key={post._id}
                to={`/post/${post._id}`}
                className={styles.postLink}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.post}>
                  <img
                    src={
                      post.images?.[0]
                        ? `${baseURL}${post.images[0].replace(/\\/g, "/")}`
                        : "/no-image.png"
                    }
                    alt={post.title}
                  />
                  <div>
                    <p>{post.title || "بدون عنوان"}</p>
                    <span>
                      {truncateText(post.content, 20) || "بدون توضیحات"}
                    </span>
                  </div>
                  <div className={styles.price}>
                    <p>
                      {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                    <span>{sp(post.amount)} تومان</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default PostList;
