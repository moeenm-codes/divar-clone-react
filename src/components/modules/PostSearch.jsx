// components/modules/PostSearch.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { POPULAR_SEARCHES } from "../../constants/popularSearches";
import { normalizePersian } from "utils/normalize";
import styles from "./PostSearch.module.css";
import { FiSearch } from "react-icons/fi";

export default function PostSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // همگام‌سازی با URL
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    setQuery(urlSearch || "");
  }, [searchParams]);

  // فوکوس خودکار
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    const normalized = normalizePersian(query);
    return POPULAR_SEARCHES.filter((item) =>
      normalizePersian(item).includes(normalized)
    ).slice(0, 15);
  }, [query]);

  const performSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const newParams = new URLSearchParams(searchParams);
    newParams.set("search", trimmed);
    // اختیاری: صفحه اول بشه
    newParams.delete("page");
    setSearchParams(newParams);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        performSearch(filteredSuggestions[highlightedIndex]);
      } else if (query.trim()) {
        performSearch(query);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // کلیک بیرون → بستن
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.searchWrapper} ref={dropdownRef}>
      <div className={`${styles.searchBox} ${isOpen ? styles.active : ""}`}>
        <FiSearch className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="جستجو در همه آگهی‌ها..."
          className={styles.searchInput}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              const newParams = new URLSearchParams(searchParams);
              newParams.delete("search");
              setSearchParams(newParams);
            }}
            className={styles.clearBtn}
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {filteredSuggestions.length === 0 ? (
            <div className={styles.empty}>
              {query.trim()
                ? `هیچ نتیجه‌ای برای "${query}" یافت نشد`
                : "شروع به تایپ کنید..."}
            </div>
          ) : (
            <div className={styles.suggestionsList}>
              {filteredSuggestions.map((item, index) => (
                <button
                  key={item}
                  className={`${styles.suggestionItem} ${
                    index === highlightedIndex ? styles.highlighted : ""
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => performSearch(item)}
                >
                  <FiSearch className={styles.itemIcon} />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
