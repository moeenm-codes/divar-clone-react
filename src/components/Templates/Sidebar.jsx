// components/Templates/Sidebar.jsx

import { useState, useEffect, useRef } from "react";
import { sp } from "utils/numbers";
import styles from "./Sidebar.module.css";

function Sidebar({
  categories,
  selectedCategoryId,
  onCategoryClick,
  minPrice: globalMinPrice,
  maxPrice: globalMaxPrice,
  urlMinPrice: currentMinPrice, // این از URL میاد (مقدار فعلی اعمال شده)
  urlMaxPrice: currentMaxPrice,
  onApplyPrice,
}) {
  const [tempMinPrice, setTempMinPrice] = useState(currentMinPrice || "");
  const [tempMaxPrice, setTempMaxPrice] = useState(currentMaxPrice || "");
  const [showButtons, setShowButtons] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // track اینکه کاربر کلیک کرده

  const [minFocused, setMinFocused] = useState(false);
  const [maxFocused, setMaxFocused] = useState(false);

  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);

  // وقتی مقادیر URL تغییر کرد (بعد از اعمال فیلتر)
  useEffect(() => {
    setTempMinPrice(currentMinPrice ?? "");
    setTempMaxPrice(currentMaxPrice ?? "");
    setShowButtons(false);
    setHasInteracted(false); // ریست کردن وضعیت تعامل
  }, [currentMinPrice, currentMaxPrice]);

  // نمایش دکمه‌ها بر اساس تعامل کاربر
  useEffect(() => {
    if (hasInteracted) {
      setShowButtons(true);
    } else {
      const minChanged = String(tempMinPrice) !== String(currentMinPrice ?? "");
      const maxChanged = String(tempMaxPrice) !== String(currentMaxPrice ?? "");
      setShowButtons(minChanged || maxChanged);
    }
  }, [
    hasInteracted,
    tempMinPrice,
    tempMaxPrice,
    currentMinPrice,
    currentMaxPrice,
  ]);

  const handleApply = () => {
    setIsHiding(true);

    // انیمیشن خروج 300ms طول می‌کشه
    setTimeout(() => {
      onApplyPrice(tempMinPrice, tempMaxPrice);
      setIsHiding(false);
      setHasInteracted(false); // ریست کردن بعد از اعمال
      if (minPriceRef.current) minPriceRef.current.blur();
      if (maxPriceRef.current) maxPriceRef.current.blur();
    }, 300);
  };

  const handleCancel = () => {
    setIsHiding(true);

    // انیمیشن خروج 300ms طول می‌کشه
    setTimeout(() => {
      // پاک کردن کامل فیلتر قیمت
      setTempMinPrice("");
      setTempMaxPrice("");
      setShowButtons(false);
      setIsHiding(false);
      setHasInteracted(false); // ریست کردن بعد از انصراف

      // اعمال فیلتر خالی (حذف فیلتر از URL)
      onApplyPrice("", "");

      if (minPriceRef.current) minPriceRef.current.blur();
      if (maxPriceRef.current) maxPriceRef.current.blur();
    }, 300);
  };

  // مقدار نمایشی input
  const getDisplayValue = (value, isFocused) => {
    if (value === "" || value === null || value === undefined) return "";
    // همیشه اعداد فارسی نمایش بده
    const formattedValue = isFocused ? value : sp(value);
    return convertToPersianNumber(formattedValue);
  };

  // تبدیل اعداد انگلیسی به فارسی
  const convertToPersianNumber = (num) => {
    if (num === "" || num === null || num === undefined) return "";
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return String(num).replace(
      /\d/g,
      (digit) => persianDigits[parseInt(digit)]
    );
  };

  // تبدیل اعداد فارسی به انگلیسی (برای پردازش)
  const convertToEnglishNumber = (str) => {
    if (!str) return "";
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return String(str).replace(/[۰-۹]/g, (digit) =>
      persianDigits.indexOf(digit)
    );
  };

  // هندل کردن Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && showButtons) {
      e.preventDefault();
      handleApply();
    }
  };

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>دسته‌بندی‌ها</h3>
      <ul className={styles.list}>
        <li
          onClick={() => onCategoryClick(null)}
          className={`${styles.item} ${
            selectedCategoryId === null ? styles.active : ""
          }`}
        >
          <span>همه آگهی‌ها</span>
        </li>
        {categories?.data?.map((category, index) => (
          <li
            key={category._id}
            onClick={() => onCategoryClick(category._id)}
            className={`${styles.item} ${
              selectedCategoryId === category._id ? styles.active : ""
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <img
              src={`/${category.icon}.svg`}
              alt={category.name}
              className={styles.icon}
            />
            <span>{category.name}</span>
          </li>
        ))}
      </ul>

      <div className={styles.priceFilter}>
        <h4 className={styles.priceTitle}>فیلتر قیمت (تومان)</h4>

        <div className={styles.priceInputs}>
          <input
            ref={minPriceRef}
            type="text"
            inputMode="numeric"
            placeholder="از ۰"
            value={getDisplayValue(tempMinPrice, minFocused)}
            onChange={(e) => {
              // تبدیل اعداد فارسی به انگلیسی برای پردازش
              const englishValue = convertToEnglishNumber(e.target.value);
              const val = englishValue.replace(/[^0-9]/g, "");
              setTempMinPrice(
                val === "" ? "" : Math.max(0, parseInt(val) || 0)
              );
            }}
            onFocus={() => {
              setMinFocused(true);
              setHasInteracted(true); // نشان دادن دکمه‌ها به محض کلیک
            }}
            onBlur={() => setMinFocused(false)}
            onKeyPress={handleKeyPress}
            className={styles.priceInput}
          />

          <span className={styles.separator}>—</span>

          <input
            ref={maxPriceRef}
            type="text"
            inputMode="numeric"
            placeholder={`تا ${convertToPersianNumber(sp(globalMaxPrice))}`}
            value={getDisplayValue(tempMaxPrice, maxFocused)}
            onChange={(e) => {
              const englishValue = convertToEnglishNumber(e.target.value);
              const val = englishValue.replace(/[^0-9]/g, "");
              const num = parseInt(val) || "";
              if (num === "" || (num <= globalMaxPrice && num >= 0)) {
                setTempMaxPrice(num);
              }
            }}
            onFocus={() => {
              setMaxFocused(true);
              setHasInteracted(true); // نشان دادن دکمه‌ها به محض کلیک
            }}
            onBlur={() => setMaxFocused(false)}
            onKeyPress={handleKeyPress}
            className={styles.priceInput}
          />
        </div>

        {globalMaxPrice > 0 && (
          <p className={styles.priceHint}>
            محدوده: ۰ تا {convertToPersianNumber(sp(globalMaxPrice))} تومان
          </p>
        )}

        {showButtons && (
          <div
            className={`${styles.priceActions} ${
              isHiding ? styles.hiding : ""
            }`}
          >
            <button onClick={handleCancel} className={styles.cancelBtn}>
              انصراف
            </button>
            <button onClick={handleApply} className={styles.applyBtn}>
              اعمال
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
