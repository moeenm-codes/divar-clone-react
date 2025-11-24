import React, { useState, useEffect, useRef, useMemo } from "react";
import { PROVINCES } from ".././constants/provinces";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPlus,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useAuth } from "components/hooks/useAuth";
import { useCity } from "components/context/CityContext";
import { normalizePersian } from "utils/normalize";
import PostSearch from "components/modules/PostSearch";

function Header() {
  const [cityOpen, setCityOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchInputRef = useRef(null);
  const listContainerRef = useRef(null);

  const { user, isLoading: authLoading, logout } = useAuth();

  const { selectedCity, setSelectedCity } = useCity();

  const allCities = useMemo(() => ["همه استان‌ها", ...PROVINCES], []);

  const filteredCities = useMemo(() => {
    const q = normalizePersian(cityQuery);
    if (!q) return allCities;
    return allCities.filter((p) => normalizePersian(p).includes(q));
  }, [cityQuery, allCities]);

  useEffect(() => {
    if (cityOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 30);
    } else {
      setCityQuery("");
      setHighlightedIndex(-1);
    }
  }, [cityOpen]);

  useEffect(() => {
    if (!cityOpen) return;
    if (filteredCities.length > 0) setHighlightedIndex(0);
    else setHighlightedIndex(-1);
  }, [filteredCities, cityOpen]);

  useEffect(() => {
    if (!listContainerRef.current || highlightedIndex < 0) return;
    const container = listContainerRef.current;
    const el = container.querySelector(`[data-index="${highlightedIndex}"]`);
    if (!el) return;

    const { offsetTop, offsetHeight } = el;
    const { scrollTop, clientHeight } = container;

    if (offsetTop < scrollTop) {
      container.scrollTop = offsetTop;
    } else if (offsetTop + offsetHeight > scrollTop + clientHeight) {
      container.scrollTop = offsetTop + offsetHeight - clientHeight;
    }
  }, [highlightedIndex]);

  const handleInputKeyDown = (e) => {
    if (!cityOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCities.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCities.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredCities[highlightedIndex]) {
        setSelectedCity(filteredCities[highlightedIndex]);
        setCityOpen(false);
      }
    } else if (e.key === "Escape") {
      setCityOpen(false);
    }
  };

  const profileMenuItems = useMemo(() => {
    const items = [];

    if (!user) {
      items.push({ name: "ورود / ثبت‌نام", to: "/auth" });
    }

    items.push(
      { name: "صفحه اصلی", to: "/" },
      { name: "داشبورد", to: "/my-divar" },
      { name: "آگهی‌های من", to: "/my-divar/my-posts" },
      { name: "علاقه‌مندی‌ها", to: "/my-divar/favorites" },
      { name: "پشتیبانی", to: "/my-divar/support" }
    );

    if (user?.role === "ADMIN") {
      items.push({ name: "پنل ادمین", to: "/admin" });
    }

    if (user) {
      items.push({
        name: "خروج از حساب کاربری",
        to: "#",
        icon: <FaSignOutAlt />,
        className: "logoutItem",
        onClick: (e) => {
          e.preventDefault();
          logout();
          setProfileOpen(false);
        },
      });
    }

    return items;
  }, [user, logout]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* سمت چپ: لوگو و شهر */}
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <img src="/divar.svg" alt="دیوار" className={styles.logoImg} />
          </Link>

          {/* انتخاب شهر */}
          <div className={styles.dropdownWrapper}>
            <button
              className={`${styles.dropdownBtn} ${
                cityOpen ? styles.active : ""
              }`}
              onClick={() => setCityOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={cityOpen}
              type="button"
            >
              <FaMapMarkerAlt className={styles.icon} />
              <span className={styles.text}>
                {selectedCity === "همه استان‌ها"
                  ? "همه استان‌ها"
                  : selectedCity}
              </span>
              <IoIosArrowDown
                className={`${styles.arrow} ${cityOpen ? styles.open : ""}`}
              />
            </button>

            {cityOpen && (
              <div
                className={styles.dropdown}
                role="menu"
                aria-label="استان‌ها"
              >
                <div className={styles.citySearchContainer}>
                  <input
                    ref={searchInputRef}
                    value={cityQuery}
                    onChange={(e) => {
                      setCityQuery(e.target.value);
                      setHighlightedIndex(0);
                    }}
                    onKeyDown={handleInputKeyDown}
                    placeholder="جستجوی استان..."
                    aria-label="جستجوی استان"
                    className={styles.citySearchInput}
                  />
                </div>

                <div
                  className={styles.cityListContainer}
                  ref={listContainerRef}
                >
                  {filteredCities.length === 0 ? (
                    <div className={styles.cityEmptyResult}>موردی پیدا نشد</div>
                  ) : (
                    filteredCities.map((city, index) => {
                      const isHighlighted = index === highlightedIndex;
                      const isSelected = city === selectedCity;
                      return (
                        <button
                          key={city}
                          data-index={index}
                          type="button"
                          className={[
                            styles.dropdownItem,
                            isHighlighted ? styles.activeItem : "",
                            isSelected ? styles.selectedItem : "",
                          ].join(" ")}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          onClick={() => {
                            setSelectedCity(city);
                            setCityOpen(false);
                          }}
                        >
                          <span className={styles.cityName}>{city}</span>
                          {isSelected && (
                            <span className={styles.check}>✓</span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          <PostSearch />
        </div>

        {/* سمت راست: منوی کاربری و ثبت آگهی */}
        <div className={styles.right}>
          {/* منوی کاربری */}
          <div className={styles.dropdownWrapper}>
            <button
              className={`${styles.dropdownBtn} ${
                profileOpen ? styles.active : ""
              }`}
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              type="button"
              disabled={authLoading}
            >
              {authLoading ? (
                <div className={styles.skeletonIcon} />
              ) : user ? (
                <FaUser className={styles.icon} />
              ) : (
                <FaSignInAlt className={styles.icon} />
              )}
              <span className={styles.text}>{user ? "دیوار من" : "ورود"}</span>
              <IoIosArrowDown
                className={`${styles.arrow} ${profileOpen ? styles.open : ""}`}
              />
            </button>

            {profileOpen && (
              <div
                className={styles.dropdown}
                role="menu"
                aria-label="منوی کاربری"
              >
                {profileMenuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`${styles.dropdownItem} ${
                      item.className ? styles[item.className] : ""
                    }`}
                    onClick={(e) => {
                      item.onClick?.(e);
                      setProfileOpen(false);
                    }}
                  >
                    {item.icon && (
                      <span className={styles.itemIcon}>{item.icon}</span>
                    )}
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* دکمه ثبت آگهی */}
          <Link
            to="/addpost"
            className={styles.postAdButton}
            onClick={() => {
              window.scrollTo(0, 0); // این خط جادویی!
            }}
          >
            <FaPlus className={styles.postAdIcon} />
            ثبت آگهی
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
