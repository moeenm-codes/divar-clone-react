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
  FiUser,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiSmartphone,
  FiSettings,
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { useState } from "react";

const menuItems = [
  { to: "/", label: "صفحه اصلی", icon: <FiHome /> },
  { to: "/my-divar/my-posts", label: "آگهی‌های من", icon: <FiFileText /> },
  { to: "/my-divar/favorites", label: "علاقه‌مندی‌ها", icon: <FiHeart /> },
  { to: "/my-divar/support", label: "پشتیبانی", icon: <FiHelpCircle /> },
  { to: "/my-divar/settings", label: "تنظیمات", icon: <FiSettings /> },
];

function DashboardSidebar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // فرمت کردن شماره موبایل (09121234567 → ۰۹۱۲ ۱۲۳ ۴۵۶۷)
  const formatMobile = (mobile) => {
    if (!mobile) return "";
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const persianMobile = mobile.replace(/\d/g, (d) => persianDigits[d]);
    return persianMobile.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <aside className={styles.sidebar}>
      {/* عنوان */}
      <h3 className={styles.title}>دیوار من</h3>
      {/* بخش کاربر با dropdown - طراحی جدید */}
      <div className={styles.userDropdown}>
        {/* هدر dropdown */}
        <button
          className={styles.dropdownHeader}
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
          aria-label="نمایش اطلاعات حساب کاربری"
        >
          <div className={styles.userInfoCompact}>
            <div className={styles.userAvatarCompact}>
              <FiUser className={styles.userIconCompact} />
            </div>
            <div className={styles.userTextCompact}>
              <div className={styles.userTitle}>حساب کاربری دیوار</div>
              <div className={styles.verifiedCompact}>
                <MdVerified className={styles.verifiedIconCompact} />
                <span>تأیید شده</span>
              </div>
            </div>
          </div>

          <div className={styles.dropdownIcon}>
            {isDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </button>

        {/* محتوای dropdown */}
        <div
          className={`${styles.dropdownContent} ${
            isDropdownOpen ? styles.open : ""
          }`}
        >
          <div className={styles.dropdownItem}>
            <div className={styles.itemLabel}>
              <FiSmartphone className={styles.itemIcon} />
              <span>شماره ثبت‌نام شده</span>
            </div>
            <div className={styles.phoneNumberCompact}>
              {user?.mobile ? formatMobile(user.mobile) : "۰۰۰۰ ۰۰۰ ۰۰۰۰"}
            </div>
          </div>

          <div className={styles.dropdownItem}>
            <div className={styles.itemLabel}>
              <FiCheckCircle className={styles.itemIcon} />
              <span>وضعیت تأیید</span>
            </div>
            <div className={styles.verificationStatusCompact}>
              <span>تأیید شده</span>
            </div>
          </div>

          <div className={styles.dropdownHint}>
            <FiSmartphone className={styles.hintIcon} />
            <span>از این شماره برای ورود و بازیابی رمز استفاده می‌شود</span>
          </div>
        </div>
      </div>

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
