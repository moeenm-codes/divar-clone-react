// components/ToastNotification.jsx
import React, { useEffect, useState } from "react";
import styles from "./ToastNotification.module.css";

const icons = {
  success: (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  ),
};

const ToastNotification = ({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  // خودکار بسته شدن
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // وقتی انیمیشن تموم شد → از DOM حذف بشه
  const handleAnimationEnd = () => {
    if (isClosing) onClose();
  };

  return (
    <div
      className={`${styles.notification} ${styles[type]} ${
        isClosing ? styles.hide : styles.show
      }`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.content}>
        <div className={styles.icon}>{icons[type]}</div>
        <div className={styles.text}>{message}</div>
      </div>
      <button
        className={styles.close}
        onClick={() => setIsClosing(true)}
        aria-label="بستن"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18 17.94 6M18 18 6.06 6"
          />
        </svg>
      </button>
      <div className={styles.progress} />
    </div>
  );
};

export default ToastNotification;
