// src/pages/dashboard/DashboardSidebar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "components/hooks/useAuth";
import styles from "./DashboardSidebar.module.css";
import {
  FiHome,
  FiFileText,
  FiHeart,
  FiHelpCircle,
  FiShield,
  FiLogOut,
} from "react-icons/fi";

const menuItems = [
  { to: "/", label: "صفحه اصلی", icon: <FiHome /> },
  { to: "/my-divar/my-posts", label: "آگهی‌های من", icon: <FiFileText /> },
  { to: "/my-divar/favorites", label: "علاقه‌مندی‌ها", icon: <FiHeart /> },
  { to: "/my-divar/support", label: "پشتیبانی", icon: <FiHelpCircle /> },
];

function DashboardSidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      {/* عنوان */}
      <h3 className={styles.title}>دیوار من</h3>

      {/* لیست منو */}
      <ul className={styles.list}>
        {menuItems.map((item, index) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
              }
              end
              onClick={() => window.scrollTo(0, 0)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          </li>
        ))}

        {/* پنل ادمین */}
        {user?.role === "ADMIN" && (
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
              }
              onClick={() => window.scrollTo(0, 0)}
            >
              <span className={styles.icon}>
                <FiShield />
              </span>
              <span className={styles.label}>پنل ادمین</span>
            </NavLink>
          </li>
        )}
      </ul>

      {/* دکمه خروج */}
      <button onClick={logout} className={styles.logout}>
        <FiLogOut className={styles.logoutIcon} />
        <span>خروج از حساب کاربری</span>
      </button>
    </aside>
  );
}

export default DashboardSidebar;
