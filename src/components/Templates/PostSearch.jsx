// components/modules/PostSearch.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { POPULAR_SEARCHES } from "../../constants/popularSearches";
import { normalizePersian } from "utils/normalize";
import styles from "./PostSearch.module.css";
import { FiSearch, FiClock, FiTrendingUp, FiX } from "react-icons/fi";
import { useClickAway } from "@uidotdev/usehooks";

export default function PostSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);

  const inputRef = useRef(null);
  const dropdownRef = useClickAway(() => {
    setIsOpen(false);
  });

  // بارگذاری جستجوهای اخیر از localStorage
  useEffect(() => {
    const saved = localStorage.getItem("divar-recent-searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // ذخیره جستجوهای اخیر
  const saveToRecentSearches = (searchTerm) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter((item) => item !== trimmed),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("divar-recent-searches", JSON.stringify(updated));
  };

  // همگام‌سازی با URL - فقط در صفحه اصلی
  useEffect(() => {
    if (location.pathname === "/") {
      const urlSearch = searchParams.get("search");
      setQuery(urlSearch || "");
    } else {
      setQuery(""); // در صفحات دیگر، input خالی باشد
    }
  }, [searchParams, location.pathname]);

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    const normalized = normalizePersian(query);
    return POPULAR_SEARCHES.filter((item) =>
      normalizePersian(item).includes(normalized)
    ).slice(0, 8);
  }, [query]);

  const performSearch = (searchValue, fromSuggestion = false) => {
    const trimmed = searchValue.trim();
    if (!trimmed) return;

    // ذخیره در جستجوهای اخیر اگر از کاربر است
    if (!fromSuggestion) {
      saveToRecentSearches(trimmed);
    }

    // اگر در صفحه اصلی نیستیم، به صفحه اصلی هدایت شو
    if (location.pathname !== "/") {
      navigate(`/?search=${encodeURIComponent(trimmed)}`);
    } else {
      // اگر در صفحه اصلی هستیم، فقط پارامترها رو آپدیت کنیم
      const newParams = new URLSearchParams(searchParams);
      newParams.set("search", trimmed);
      newParams.delete("page");
      setSearchParams(newParams);
    }

    setIsOpen(false);
    setHighlightedIndex(-1);

    // اسکرول به بالا برای نمایش نتایج
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    const totalItems = getTotalItems();

    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleHighlightedItemSelection();
      } else if (query.trim()) {
        performSearch(query);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getTotalItems = () => {
    if (!query.trim()) {
      return recentSearches.length + POPULAR_SEARCHES.slice(0, 6).length;
    }
    return filteredSuggestions.length;
  };

  const handleHighlightedItemSelection = () => {
    if (!query.trim()) {
      // حالت پیش‌فرض
      if (highlightedIndex < recentSearches.length) {
        performSearch(recentSearches[highlightedIndex]);
      } else {
        const popularIndex = highlightedIndex - recentSearches.length;
        performSearch(POPULAR_SEARCHES[popularIndex], true);
      }
    } else {
      // حالت جستجو
      performSearch(filteredSuggestions[highlightedIndex], true);
    }
  };

  const handleClear = () => {
    setQuery("");

    // اگر در صفحه اصلی هستیم، پارامتر سرچ رو حذف کنیم
    if (location.pathname === "/") {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("search");
      setSearchParams(newParams);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const removeRecentSearch = (searchToRemove, e) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== searchToRemove);
    setRecentSearches(updated);
    localStorage.setItem("divar-recent-searches", JSON.stringify(updated));
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("divar-recent-searches");
  };

  // محتوای dropdown
  const renderDropdownContent = () => {
    if (!query.trim()) {
      // حالت پیش‌فرض - جستجوهای اخیر و پرطرفدار
      return (
        <>
          {recentSearches.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FiClock className={styles.sectionIcon} />
                <span>جستجوهای اخیر</span>
                <button
                  className={styles.clearAllBtn}
                  onClick={clearAllRecentSearches}
                >
                  پاک کردن
                </button>
              </div>
              <div className={styles.suggestionsList}>
                {recentSearches.map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.suggestionItem} ${
                      index === highlightedIndex ? styles.highlighted : ""
                    }`}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => performSearch(item)}
                  >
                    <FiClock className={styles.itemIcon} />
                    <span className={styles.itemText}>{item}</span>
                    <button
                      className={styles.removeBtn}
                      onClick={(e) => removeRecentSearch(item, e)}
                      aria-label="حذف"
                    >
                      <FiX />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FiTrendingUp className={styles.sectionIcon} />
              <span>جستجوهای پرطرفدار</span>
            </div>
            <div className={styles.suggestionsList}>
              {POPULAR_SEARCHES.slice(0, 6).map((item, index) => {
                const absoluteIndex = recentSearches.length + index;
                return (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.suggestionItem} ${
                      absoluteIndex === highlightedIndex
                        ? styles.highlighted
                        : ""
                    }`}
                    onMouseEnter={() => setHighlightedIndex(absoluteIndex)}
                    onClick={() => performSearch(item, true)}
                  >
                    <FiTrendingUp className={styles.itemIcon} />
                    <span className={styles.itemText}>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      );
    }

    // حالت جستجو - پیشنهادات
    if (filteredSuggestions.length > 0) {
      return (
        <div className={styles.section}>
          <div className={styles.suggestionsList}>
            {filteredSuggestions.map((item, index) => (
              <button
                key={item}
                type="button"
                className={`${styles.suggestionItem} ${
                  index === highlightedIndex ? styles.highlighted : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => performSearch(item, true)}
              >
                <FiSearch className={styles.itemIcon} />
                <span className={styles.itemText}>{item}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // حالت بدون نتیجه - پیام بهبود یافته
    return (
      <div className={styles.emptyState}>
        <FiSearch className={styles.emptyIcon} />
        <div className={styles.emptyText}>موردی در پیشنهادات پیدا نشد</div>
        <div className={styles.emptyHint}>
          <button
            className={styles.searchAnywayBtn}
            onClick={() => performSearch(query)}
          >
            جستجوی "<strong>{query}</strong>" در همه آگهی‌ها
          </button>
        </div>
      </div>
    );
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className={styles.searchWrapper} ref={dropdownRef}>
      <div className={`${styles.searchBox} ${isOpen ? styles.active : ""}`}>
        <FiSearch className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="جستجو در همه آگهی‌ها..."
          className={styles.searchInput}
          aria-label="جستجو در آگهی‌ها"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        {query && (
          <button
            onClick={handleClear}
            className={styles.clearBtn}
            type="button"
            aria-label="پاک کردن متن جستجو"
          >
            <FiX />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={styles.dropdown}
          role="listbox"
          aria-label="پیشنهادات جستجو"
        >
          {renderDropdownContent()}
        </div>
      )}
    </div>
  );
}
