import React from "react";
import Skeleton from "react-loading-skeleton";
import SkeletonWrapper from "./SkeletonWrapper";
import styles from "./Skeletons.module.css";
// ایمپورت استایل گرید از ماژول اصلی برای هماهنگی کامل ریسپانسیو
import mainStyles from "../../Templates/Main.module.css";

const MainSkeleton = () => {
  return (
    <SkeletonWrapper>
      {/* استفاده از کلاس .grid فایل اصلی برای حفظ گرید ریسپانسیو */}
      <div className={mainStyles.grid}>
        {Array(10) // رندر ۸ کارت پیش‌فرض
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={styles.card}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* بخش تصویر (بالا) */}
              <div className={styles.imageWrapper}>
                <Skeleton height="100%" />
              </div>

              {/* بخش محتوا (پایین) */}
              <div className={styles.content}>
                {/* شبیه‌سازی عنوان دو خطی (.titleLine) */}
                <div className={styles.titleLine}>
                  <Skeleton
                    width="90%"
                    height={16}
                    style={{ marginBottom: 4 }}
                  />
                  <Skeleton width="60%" height={16} />
                </div>

                {/* شبیه‌سازی بخش Footer */}
                <div className={styles.footer}>
                  {/* Price */}
                  <Skeleton width={80} height={18} />
                  {/* City */}
                  <Skeleton width={60} height={15} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </SkeletonWrapper>
  );
};

export default MainSkeleton;
