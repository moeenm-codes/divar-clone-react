// CategoryList.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategory, deleteCategory } from "services/admin";
import Loader from "components/modules/Loader";
import ToastNotification from "components/modules/ToastNotification";
import DeleteButton from "components/modules/DeleteButton";
import DeleteModal from "components/modules/DeleteModal";
import styles from "./CategoryList.module.css";

function CategoryList() {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState(null);

  // حالت مودال حذف
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: "",
  });

  const openDeleteModal = (id, name) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: null, name: "" });
  };

  const confirmDelete = () => {
    deleteMutation.mutate(deleteModal.id);
    closeDeleteModal();
  };

  const { data, isFetching, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      setToast({ text: "دسته‌بندی با موفقیت حذف شد", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      setToast({
        text: error.message || "خطا در حذف دسته‌بندی",
        type: "error",
      });
    },
  });

  if (isFetching) {
    return (
      <div className={styles.container}>
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>خطا در دریافت اطلاعات!</div>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>هیچ دسته‌بندی‌ای وجود ندارد.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toast && (
        <div className={styles.toastContainer}>
          <ToastNotification
            message={toast.text}
            type={toast.type}
            onClose={() => setToast(null)}
            duration={3000}
          />
        </div>
      )}

      {/* لیست کارت‌ها */}
      <div className={styles.grid}>
        {data.data.map((item) => (
          <div className={styles.card} key={item._id}>
            <div className={styles.iconWrap}>
              <img
                src={`${item.icon}.svg`}
                alt={item.name}
                className={styles.icon}
              />
            </div>

            <div className={styles.content}>
              <h5 className={styles.title}>{item.name}</h5>
              <p className={styles.slug}>{item.slug}</p>
            </div>

            {/* دکمه حذف → مودال باز می‌شه */}
            <div className={styles.deleteButton}>
              <DeleteButton
                onClick={() => openDeleteModal(item._id, item.name)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* مودال تأیید حذف */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
        categoryName={deleteModal.name}
      />
    </div>
  );
}

export default CategoryList;
