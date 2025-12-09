import React from "react";
import Skeleton from "react-loading-skeleton";
import SkeletonWrapper from "./SkeletonWrapper";
import styles from "./Skeletons.module.css";
import listStyles from "../../Templates/PostList.module.css";

const MyPostsSkeleton = () => {
  return (
    <SkeletonWrapper>
      <div className={listStyles.list}>
        {/* Header Skeleton */}
        <div
          style={{
            marginBottom: 30,
            paddingBottom: 20,
            borderBottom: "1px solid #eee",
          }}
        >
          <Skeleton width={200} height={30} style={{ marginBottom: 10 }} />
          <Skeleton width={300} height={15} />
        </div>

        {/* Filters Skeleton */}
        <div style={{ display: "flex", gap: 15, marginBottom: 25 }}>
          <Skeleton width={160} height={45} borderRadius={12} />
          <Skeleton width={160} height={45} borderRadius={12} />
        </div>

        {/* Grid Skeleton */}
        <div className={listStyles.postsGrid}>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Skeleton height={200} />
                </div>
                <div className={styles.content} style={{ padding: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <Skeleton width={120} height={20} />
                    <Skeleton width={80} height={15} />
                  </div>
                  <Skeleton count={2} style={{ marginBottom: 5 }} />
                  <div className={styles.row}>
                    <Skeleton width={60} height={20} borderRadius={6} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </SkeletonWrapper>
  );
};

export default MyPostsSkeleton;
