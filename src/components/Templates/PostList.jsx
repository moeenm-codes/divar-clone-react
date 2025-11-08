import { useQuery } from "@tanstack/react-query";
import Loader from "components/modules/Loader";
import { getPosts } from "services/user";
import { sp } from "utils/numbers";

import styles from "./PostList.module.css";

function PostList() {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const { data, isLoading } = useQuery({
    queryKey: ["my-post-list"],
    queryFn: getPosts,
  });
  console.log(data);
  return (
    <div className={styles.list}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h3>آگهی های من</h3>
          {data.data.posts.map((post) => (
            <div key={post._id} className={styles.post}>
              <img
                src={
                  post.images?.[0]
                    ? `${baseURL}${post.images[0].replace(/\\/g, "/")}`
                    : "/no-image.png"
                }
                alt={post.options?.title}
              />{" "}
              <div>
                <p>{post.options?.title}</p>
                <span>{post.options.content}</span>
              </div>
              <div className={styles.price}>
                <p>{new Date(post.createdAt).toLocaleDateString("fa-IR")}</p>
                <span>{sp(post.amount)}تومان</span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default PostList;
