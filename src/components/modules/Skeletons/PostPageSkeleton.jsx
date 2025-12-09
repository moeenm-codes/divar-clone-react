import React from "react";
import Skeleton from "react-loading-skeleton";
import SkeletonWrapper from "./SkeletonWrapper";
import styles from "./Skeletons.module.css";

const PostPageSkeleton = () => {
  return (
    <SkeletonWrapper>
      <div className={styles.postPageContainer}>
        {/* ستون اصلی (راست) */}
        <div>
          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <Skeleton width={60} />
            <Skeleton width={80} />
            <Skeleton width={100} />
          </div>

          {/* Gallery */}
          <Skeleton className={styles.gallery} />
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <Skeleton width={80} height={80} borderRadius={8} />
            <Skeleton width={80} height={80} borderRadius={8} />
            <Skeleton width={80} height={80} borderRadius={8} />
          </div>

          {/* Info */}
          <div className={styles.postInfo}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Skeleton width={200} height={30} />
              <Skeleton width={120} height={30} />
            </div>
            <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
              <Skeleton width={100} />
              <Skeleton width={100} />
              <Skeleton width={100} />
            </div>
            <Skeleton width={100} height={20} style={{ marginBottom: 10 }} />
            <Skeleton count={4} />
          </div>
        </div>

        {/* سایدبار (چپ) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Seller Info */}
          <div className={styles.sidebar}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <Skeleton circle width={50} height={50} />
              <div style={{ flex: 1 }}>
                <Skeleton width={120} height={20} />
                <Skeleton width={80} height={15} />
              </div>
            </div>
            <Skeleton
              height={45}
              borderRadius={10}
              style={{ marginBottom: 10 }}
            />
            <Skeleton height={45} borderRadius={10} />
          </div>

          {/* Safety Tips */}
          <div className={styles.sidebar}>
            <Skeleton width={150} height={20} style={{ marginBottom: 15 }} />
            <Skeleton count={3} style={{ marginBottom: 5 }} />
          </div>
        </div>
      </div>
    </SkeletonWrapper>
  );
};

export default PostPageSkeleton;
