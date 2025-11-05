// CategoryForm.jsx
import React, { useState } from "react";
import styles from "./CategoryForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategory } from "services/admin";
import ToastNotification from "components/modules/ToastNotification";
function CategoryForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", slug: "", icon: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const { mutate, isLoading } = useMutation({
    mutationFn: addCategory,
    onSuccess: (res) => {
      const status =
        res?.status || res?.statusCode || (res?.data && res.data.status);
      const payload = res?.data || res;

      if (status === 201 || status === 200) {
        setToast({ text: "دسته‌بندی با موفقیت ایجاد شد", type: "success" });
        setForm({ name: "", slug: "", icon: "" });
        setErrors({});
      } else {
        setToast({
          text: payload?.message || "چنین دسته‌بندی قبلاً وجود دارد",
          type: "error",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "slug" ? value.replace(/[^a-z0-9-]/g, "").toLowerCase() : value;

    setForm((prev) => ({ ...prev, [name]: newValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "نام دسته‌بندی الزامی است.";
    if (!form.slug.trim()) newErrors.slug = "اسلاگ الزامی است.";
    if (!form.icon.trim()) newErrors.icon = "آیکون الزامی است.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    mutate(form);
  };

  return (
    <>
      {/* Toast Container - بالای فرم */}
      <div className={styles.toastContainer}>
        {toast && (
          <ToastNotification
            message={toast.text}
            type={toast.type}
            onClose={() => setToast(null)}
            duration={3000}
          />
        )}
      </div>

      {/* فرم اصلی */}
      <form onSubmit={submitHandler} className={styles.form}>
        <h3>دسته بندی جدید</h3>
        <p className={styles.hint}>
          اینجا یک دسته جدید اضافه کن — نام، اسلاگ و آیکون
        </p>

        {/* فیلد نام */}
        <div className={styles.field}>
          <label htmlFor="name">نام دسته بندی</label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={changeHandler}
            className={errors.name ? styles.inputError : ""}
            placeholder="مثال: موبایل"
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className={styles.helperError}>{errors.name}</p>}
        </div>

        {/* فیلد اسلاگ */}
        <div className={styles.field}>
          <label htmlFor="slug">اسلاگ</label>
          <input
            type="text"
            name="slug"
            id="slug"
            value={form.slug}
            onChange={changeHandler}
            className={errors.slug ? styles.inputError : ""}
            placeholder="مثال: mobile"
            aria-invalid={!!errors.slug}
          />
          {errors.slug && <p className={styles.helperError}>{errors.slug}</p>}
        </div>

        {/* فیلد آیکون */}
        <div className={styles.field}>
          <label htmlFor="icon">آیکون</label>
          <input
            type="text"
            name="icon"
            id="icon"
            value={form.icon}
            onChange={changeHandler}
            className={errors.icon ? styles.inputError : ""}
            placeholder="مثال: smartphone"
            aria-invalid={!!errors.icon}
          />
          {errors.icon && <p className={styles.helperError}>{errors.icon}</p>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className={styles.loader}></span> در حال ایجاد...
            </>
          ) : (
            "ایجاد دسته بندی"
          )}
        </button>
      </form>
    </>
  );
}

export default CategoryForm;
