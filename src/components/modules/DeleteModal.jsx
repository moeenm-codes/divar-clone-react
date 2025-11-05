import React from "react";
import styles from "./DeleteModal.module.css";

const DeleteModal = ({ isOpen, onConfirm, onCancel, categoryName }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop با بلور */}
      <div className={styles.backdrop} onClick={onCancel} />

      {/* مودال */}
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>حذف دسته‌بندی</h3>
        </div>
        <div className={styles.body}>
          <p>
            آیا از حذف دسته‌بندی <strong>«{categoryName}»</strong> مطمئن هستید؟
          </p>
          <p className={styles.warning}>این عمل قابل بازگشت نیست.</p>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            لغو
          </button>
          <button className={styles.deleteBtn} onClick={onConfirm}>
            حذف کن
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
