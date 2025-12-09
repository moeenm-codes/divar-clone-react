import React from "react";
import Skeleton from "react-loading-skeleton";
import SkeletonWrapper from "./SkeletonWrapper";
import styles from "./Skeletons.module.css";
import sidebarStyles from "../../Templates/Sidebar.module.css";

const SidebarSkeleton = () => {
  return (
    <SkeletonWrapper>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>
          <Skeleton width={120} height={20} />
        </div>

        <ul className={sidebarStyles.list}>
          <li className={styles.sidebarItem}>
            <Skeleton width={100} height={15} />
          </li>

          {/* آیتم‌های دسته‌بندی */}
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <li
                key={i}
                className={styles.sidebarItem}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <Skeleton circle width={20} height={20} />
                {/* شبیه‌سازی نام دسته */}
                <Skeleton width={"100%"} height={15} />
              </li>
            ))}
        </ul>

        {/* === بخش فیلتر قیمت === */}
        <div className={styles.priceFilter}>
          {/* شبیه‌سازی h4.priceTitle */}
          <Skeleton width={140} height={20} style={{ marginBottom: 12 }} />

          {/* شبیه‌سازی ورودی‌های قیمت (.priceInputs) */}
          <div className={styles.priceInputs}>
            {/* ورودی "از" */}
            <Skeleton
              width="100%"
              height={40}
              style={{ flex: 1, borderRadius: 10 }}
            />
            {/* جداکننده (—) */}
            <span className={styles.separator}>—</span>
            {/* ورودی "تا" */}
            <Skeleton
              width="100%"
              height={40}
              style={{ flex: 1, borderRadius: 10 }}
            />
          </div>

          {/* شبیه‌سازی راهنمای قیمت (.priceHint) */}
          <div style={{ marginTop: 8 }}>
            <Skeleton width={180} height={15} />
          </div>
        </div>
      </aside>
    </SkeletonWrapper>
  );
};

export default SidebarSkeleton;
