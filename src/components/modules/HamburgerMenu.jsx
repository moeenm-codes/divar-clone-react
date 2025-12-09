import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "components/hooks/useAuth";
import { useCity } from "components/context/CityContext";
import { PROVINCES } from "../../constants/provinces";
import { normalizePersian } from "utils/normalize";
import styles from "./HamburgerMenu.module.css";
import {
  FiHome,
  FiFileText,
  FiHeart,
  FiHelpCircle,
  FiShield,
  FiLogOut,
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiSettings,
} from "react-icons/fi";
import { FaPlus, FaMapMarkerAlt } from "react-icons/fa";

const menuItems = [
  { to: "/", label: "صفحه اصلی", icon: <FiHome /> },
  { to: "/addpost", label: "ثبت آگهی", icon: <FaPlus /> },
  { to: "/my-divar", label: "داشبورد", icon: <FiUser /> },
  { to: "/my-divar/my-posts", label: "آگهی‌های من", icon: <FiFileText /> },
  { to: "/my-divar/favorites", label: "علاقه‌مندی‌ها", icon: <FiHeart /> },
  { to: "/my-divar/support", label: "پشتیبانی", icon: <FiHelpCircle /> },
  { to: "/my-divar/settings", label: "تنظیمات", icon: <FiSettings /> },
];

function HamburgerMenu({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { selectedCity, setSelectedCity } = useCity();
  const navigate = useNavigate();

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add(styles.bodyBlur);
    } else {
      document.body.classList.remove(styles.bodyBlur);
    }

    // Cleanup function
    return () => {
      document.body.classList.remove(styles.bodyBlur);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const allCities = ["همه استان‌ها", ...PROVINCES];

  const filteredCities = citySearchQuery.trim()
    ? allCities.filter((city) =>
        normalizePersian(city).includes(normalizePersian(citySearchQuery))
      )
    : allCities;

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCityDropdownOpen(false);
    setCitySearchQuery("");
  };

  const handleNavClick = (to) => {
    onClose();
    navigate(to);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={onClose}
      />

      {/* Menu Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        {/* Header - بدون دکمه X */}
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <FiUser />
            </div>
            <div className={styles.userText}>
              <h3>حساب کاربری دیوار</h3>
              <p>{user?.mobile || "مهمان"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {/* بخش انتخاب شهر */}
          <div className={styles.section}>
            <button
              className={styles.cityToggle}
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            >
              <div className={styles.cityToggleContent}>
                <FaMapMarkerAlt className={styles.cityIcon} />
                <span>{selectedCity}</span>
              </div>
              {cityDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {cityDropdownOpen && (
              <div className={styles.cityDropdown}>
                <div className={styles.citySearch}>
                  <input
                    type="text"
                    placeholder="جستجوی استان..."
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    className={styles.citySearchInput}
                  />
                </div>
                <div className={styles.cityList}>
                  {filteredCities.length === 0 ? (
                    <div className={styles.emptyCity}>موردی پیدا نشد</div>
                  ) : (
                    filteredCities.map((city) => (
                      <button
                        key={city}
                        className={`${styles.cityItem} ${
                          city === selectedCity ? styles.cityItemActive : ""
                        }`}
                        onClick={() => handleCitySelect(city)}
                      >
                        {city}
                        {city === selectedCity && (
                          <span className={styles.check}>✓</span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* منوی اصلی */}
          <ul className={styles.list}>
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `${styles.item} ${isActive ? styles.active : ""} ${
                      item.highlight ? styles.highlight : ""
                    }`
                  }
                  onClick={onClose}
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
                  onClick={onClose}
                >
                  <span className={styles.icon}>
                    <FiShield />
                  </span>
                  <span className={styles.label}>پنل ادمین</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Footer */}
        {user ? (
          <div className={styles.footer}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <FiLogOut />
              <span>خروج از حساب کاربری</span>
            </button>
          </div>
        ) : (
          <div className={styles.footer}>
            <button
              onClick={() => handleNavClick("/auth")}
              className={styles.loginBtn}
            >
              <FiUser />
              <span>ورود / ثبت‌نام</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default HamburgerMenu;
