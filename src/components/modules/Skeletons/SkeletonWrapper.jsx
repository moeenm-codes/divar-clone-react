import React, { useEffect, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonWrapper = ({ children }) => {
  // تشخیص تم از روی تگ html یا body (بسته به پیاده‌سازی تم شما)
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      setTheme(currentTheme === "dark" ? "dark" : "light");
    };

    // چک کردن اولیه
    checkTheme();

    // شنود تغییرات (MutationObserver برای حرفه‌ای‌تر شدن)
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const baseColor = theme === "dark" ? "#333" : "#ebebeb";
  const highlightColor = theme === "dark" ? "#444" : "#f5f5f5";

  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      {children}
    </SkeletonTheme>
  );
};

export default SkeletonWrapper;
