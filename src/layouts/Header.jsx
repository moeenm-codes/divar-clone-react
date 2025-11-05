import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { FaUser, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

function normalizePersian(str = "") {
  return String(str)
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200C/g, "") // حذف نیم‌فاصله
    .replace(/ـ/g, "") // حذف کشیده
    .toLowerCase();
}

function Header() {
  const [selectedCity, setSelectedCity] = useState(() => {
    const saved = localStorage.getItem("selectedCity");
    return saved || "تهران";
  });

  const [cityOpen, setCityOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const cityTimerRef = useRef(null);
  const profileTimerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listContainerRef = useRef(null);

  const provinces = useMemo(
    () => [
      "آذربایجان شرقی",
      "آذربایجان غربی",
      "اردبیل",
      "اصفهان",
      "البرز",
      "ایلام",
      "بوشهر",
      "تهران",
      "چهارمحال و بختیاری",
      "خراسان جنوبی",
      "خراسان رضوی",
      "خراسان شمالی",
      "خوزستان",
      "زنجان",
      "سمنان",
      "سیستان و بلوچستان",
      "فارس",
      "قزوین",
      "قم",
      "کردستان",
      "کرمان",
      "کرمانشاه",
      "کهگیلویه و بویراحمد",
      "گلستان",
      "گیلان",
      "لرستان",
      "مازندران",
      "مرکزی",
      "هرمزگان",
      "همدان",
      "یزد",
    ],
    []
  );

  const filteredCities = useMemo(() => {
    const q = normalizePersian(cityQuery);
    if (!q) return provinces;
    return provinces.filter((p) => normalizePersian(p).includes(q));
  }, [cityQuery, provinces]);

  // store selection
  useEffect(() => {
    localStorage.setItem("selectedCity", selectedCity);
  }, [selectedCity]);

  // when dropdown opens focus input
  useEffect(() => {
    if (cityOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 30);
    } else {
      setCityQuery("");
      setHighlightedIndex(-1);
    }
  }, [cityOpen]);

  // reset highlighted when filtered changes
  useEffect(() => {
    if (!cityOpen) return;
    if (filteredCities.length > 0) setHighlightedIndex(0);
    else setHighlightedIndex(-1);
  }, [filteredCities, cityOpen]);

  // scroll highlighted into view
  useEffect(() => {
    if (!listContainerRef.current) return;
    const container = listContainerRef.current;
    if (highlightedIndex < 0) return;
    const el = container.querySelector(`[data-index="${highlightedIndex}"]`);
    if (!el) return;
    const offsetTop = el.offsetTop;
    const offsetHeight = el.offsetHeight;
    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    if (offsetTop < scrollTop) {
      container.scrollTop = offsetTop;
    } else if (offsetTop + offsetHeight > scrollTop + clientHeight) {
      container.scrollTop = offsetTop + offsetHeight - clientHeight;
    }
  }, [highlightedIndex]);

  // city dropdown enter/leave with small delay to avoid flicker
  const handleCityEnter = () => {
    if (cityTimerRef.current) clearTimeout(cityTimerRef.current);
    setCityOpen(true);
  };
  const handleCityLeave = () => {
    if (cityTimerRef.current) clearTimeout(cityTimerRef.current);
    cityTimerRef.current = setTimeout(() => setCityOpen(false), 120);
  };

  // profile dropdown
  const handleProfileEnter = () => {
    if (profileTimerRef.current) clearTimeout(profileTimerRef.current);
    setProfileOpen(true);
  };
  const handleProfileLeave = () => {
    if (profileTimerRef.current) clearTimeout(profileTimerRef.current);
    profileTimerRef.current = setTimeout(() => setProfileOpen(false), 120);
  };

  // keyboard handlers (attached to input)
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
      if (highlightedIndex >= 0) {
        const city = filteredCities[highlightedIndex];
        if (city) {
          setSelectedCity(city);
          setCityOpen(false);
        }
      }
    } else if (e.key === "Escape") {
      setCityOpen(false);
    }
  };

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (cityTimerRef.current) clearTimeout(cityTimerRef.current);
      if (profileTimerRef.current) clearTimeout(profileTimerRef.current);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <img src="/divar.svg" alt="دیوار" className={styles.logoImg} />
          </Link>

          {/* استان/شهر انتخاب */}
          <div
            className={styles.dropdownWrapper}
            onMouseEnter={handleCityEnter}
            onMouseLeave={handleCityLeave}
          >
            <button
              className={`${styles.dropdownBtn} ${
                cityOpen ? styles.active : ""
              }`}
              aria-haspopup="menu"
              aria-expanded={cityOpen}
              type="button"
            >
              <FaMapMarkerAlt className={styles.icon} />
              <span className={styles.text}>{selectedCity}</span>
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
        </div>

        <div className={styles.right}>
          <div
            className={styles.dropdownWrapper}
            onMouseEnter={handleProfileEnter}
            onMouseLeave={handleProfileLeave}
          >
            <button
              className={`${styles.dropdownBtn} ${
                profileOpen ? styles.active : ""
              }`}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              type="button"
            >
              <FaUser className={styles.icon} />
              <span className={styles.text}>دیوار من</span>
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
                {[
                  { name: "ورود / ثبت‌نام", to: "/auth" },
                  { name: "آگهی‌های من", to: "/my-ads" },
                  { name: "علاقه‌مندی‌ها", to: "/favorites" },
                  { name: "داشبورد", to: "/dashboard" },
                  { name: "پشتیبانی", to: "/support" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={styles.dropdownItem}
                    onClick={() => setProfileOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/dashboard" className={styles.postAdButton}>
            <FaPlus className={styles.postAdIcon} />
            ثبت آگهی
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
