// src/components/Templates/EditPost.jsx

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPost, updateMyPost } from "services/user";
import { getCategory } from "services/admin";
import { PROVINCES } from "../../constants/provinces";
import { useToast } from "components/hooks/useToast";
import { normalizePersian } from "utils/normalize";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import styles from "./EditPost.module.css";

const MAX_IMAGES = 5;

function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const baseURL = import.meta.env.VITE_BASE_URL;

  const [form, setForm] = useState({
    title_post: "",
    description: "",
    city: "",
    category: "",
    priceFrom: "",
    images: [],
    existingImages: [],
  });

  const [cityOpen, setCityOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const cityDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  const { data: postData, isLoading: loadingPost } = useQuery({
    queryKey: ["edit-post", postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
  });

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  const categories = catData?.data || [];

  useEffect(() => {
    if (postData?.data?.post) {
      const p = postData.data.post;
      setForm({
        title_post: p.title || "",
        description: p.content || "",
        city: p.city || "",
        category: p.category?._id || p.category || "",
        priceFrom: p.amount?.toString() || "",
        images: [],
        existingImages: Array.isArray(p.images) ? p.images : [],
      });
      setCityQuery(p.city || "");
    }
  }, [postData]);

  const filteredCities = useMemo(() => {
    const q = normalizePersian(cityQuery);
    if (!q) return PROVINCES;
    return PROVINCES.filter((c) => normalizePersian(c).includes(q));
  }, [cityQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(e.target)
      )
        setCityOpen(false);
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target)
      )
        setCategoryOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⭐ Mutation با invalidate درست
  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => updateMyPost(postId, formData),
    onSuccess: (response) => {
      console.log("✅ ویرایش موفق:", response.data);
      toast.success("آگهی با موفقیت ویرایش شد!");

      // ⭐ Invalidate به جای Remove
      queryClient.invalidateQueries({ queryKey: ["post-list"], exact: true });
      queryClient.invalidateQueries({
        queryKey: ["my-post-list"],
        exact: true,
      });
      queryClient.invalidateQueries({ queryKey: ["edit-post", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });

      // کمی تاخیر بذار تا invalidate انجام بشه
      setTimeout(() => {
        navigate("/my-divar/my-posts", { replace: true });
      }, 100);
    },
    onError: (error) => {
      console.error("❌ خطا در ویرایش:", error);
      console.error("Response:", error.response?.data);
      toast.error(error.response?.data?.message || "خطا در ویرایش آگهی");
    },
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const removeExistingImage = (index) => {
    setForm((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  const removeNewImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleNewImage = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setForm((prev) => {
        const availableSlots =
          MAX_IMAGES - (prev.existingImages.length + prev.images.length);
        const filesToAdd = files.slice(0, availableSlots);
        return {
          ...prev,
          images: [...prev.images, ...filesToAdd],
        };
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!form.title_post.trim()) {
      toast.error("لطفا عنوان آگهی را وارد کنید");
      return;
    }

    if (!form.description.trim()) {
      toast.error("لطفا توضیحات آگهی را وارد کنید");
      return;
    }

    if (!form.city) {
      toast.error("لطفا شهر را انتخاب کنید");
      return;
    }

    if (!form.category) {
      toast.error("لطفا دسته‌بندی را انتخاب کنید");
      return;
    }

    // ⭐ ساخت FormData
    const formData = new FormData();
    formData.append("title_post", form.title_post);
    formData.append("description", form.description);
    formData.append("city", form.city);
    formData.append("category", form.category);
    if (form.priceFrom) formData.append("amount", form.priceFrom);

    // ⭐ عکس‌های فعلی
    formData.append("existingImages", JSON.stringify(form.existingImages));

    // ⭐ عکس‌های جدید
    form.images.forEach((img) => {
      if (img) formData.append("images", img);
    });

    console.log("📤 ارسال داده‌ها:");
    console.log("- existingImages:", form.existingImages);
    console.log("- newImages count:", form.images.length);
    console.log("- title:", form.title_post);
    console.log("- city:", form.city);

    mutate(formData);
  };

  if (loadingPost) {
    return (
      <div className={styles.page}>
        <div className={styles.form}>
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <h3>در حال بارگذاری آگهی...</h3>
          </div>
        </div>
      </div>
    );
  }

  const totalImages = form.existingImages.length + form.images.length;
  const emptySlots = MAX_IMAGES - totalImages;

  return (
    <div className={styles.page}>
      <form onSubmit={submitHandler} className={styles.form}>
        <div className={styles.header}>
          <h3>ویرایش آگهی</h3>
          <p className={styles.hint}>هر قسمتی که بخوای رو تغییر بده</p>
        </div>

        <div className={styles.field}>
          <label className={styles.uploadLabel}>
            عکس‌های آگهی (حداکثر {MAX_IMAGES} عکس)
            <span className={styles.imageCount}>
              {totalImages}/{MAX_IMAGES}
            </span>
          </label>

          <div className={styles.imageGrid}>
            {form.existingImages.map((img, i) => (
              <div key={`existing-${i}`} className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                  <img
                    src={`${baseURL}${img.replace(/\\/g, "/")}`}
                    alt={`عکس ${i + 1}`}
                    className={styles.image}
                  />
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeExistingImage(i)}
                  aria-label="حذف عکس"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}

            {form.images.map((file, i) => (
              <div key={`new-${i}`} className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`جدید ${i + 1}`}
                    className={styles.image}
                  />
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeNewImage(i)}
                  aria-label="حذف عکس"
                >
                  <CloseIcon />
                </button>
                <span className={styles.newBadge}>جدید</span>
              </div>
            ))}

            {emptySlots > 0 && (
              <label className={styles.uploadSlot}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewImage}
                  className={styles.hiddenInput}
                />
                <div className={styles.uploadContent}>
                  <UploadIcon />
                  <span>افزودن عکس</span>
                </div>
              </label>
            )}
          </div>

          {emptySlots === 0 && (
            <p className={styles.maxImagesHint}>
              شما حداکثر تعداد عکس‌ها را انتخاب کرده‌اید
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label>عنوان آگهی</label>
          <input
            type="text"
            name="title_post"
            value={form.title_post}
            onChange={changeHandler}
            placeholder="مثال: آیفون ۱۳ پرو مکس سالم"
            className={!form.title_post ? styles.inputError : ""}
          />
          {!form.title_post && (
            <p className={styles.helperError}>عنوان آگهی الزامی است</p>
          )}
        </div>

        <div className={styles.field}>
          <label>توضیحات</label>
          <textarea
            name="description"
            value={form.description}
            onChange={changeHandler}
            rows="6"
            placeholder="شرح کامل آگهی خود را اینجا بنویسید..."
            className={!form.description ? styles.inputError : ""}
          />
          {!form.description && (
            <p className={styles.helperError}>توضیحات آگهی الزامی است</p>
          )}
        </div>

        <div className={styles.field}>
          <label>شهر</label>
          <div className={styles.dropdownWrapper} ref={cityDropdownRef}>
            <button
              type="button"
              className={`${styles.dropdownBtn} ${
                cityOpen ? styles.active : ""
              } ${!form.city ? styles.inputError : ""}`}
              onClick={() => setCityOpen(!cityOpen)}
            >
              <FaMapMarkerAlt className={styles.icon} />
              <span className={styles.text}>{form.city || "انتخاب شهر"}</span>
              <IoIosArrowDown
                className={`${styles.arrow} ${cityOpen ? styles.open : ""}`}
              />
            </button>
            {!form.city && (
              <p className={styles.helperError}>انتخاب شهر الزامی است</p>
            )}
            {cityOpen && (
              <div className={styles.dropdown}>
                <div className={styles.citySearchContainer}>
                  <input
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                    placeholder="جستجوی شهر..."
                    className={styles.citySearchInput}
                    autoFocus
                  />
                </div>
                <div className={styles.cityListContainer}>
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        className={`${styles.dropdownItem} ${
                          form.city === city ? styles.selectedItem : ""
                        }`}
                        onClick={() => {
                          setForm((prev) => ({ ...prev, city }));
                          setCityOpen(false);
                          setCityQuery(city);
                        }}
                      >
                        <span className={styles.cityName}>{city}</span>
                        {form.city === city && (
                          <span className={styles.check}>✓</span>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className={styles.cityEmptyResult}>شهری یافت نشد</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label>دسته‌بندی</label>
          <div className={styles.dropdownWrapper} ref={categoryDropdownRef}>
            <button
              type="button"
              className={`${styles.dropdownBtn} ${
                categoryOpen ? styles.active : ""
              } ${!form.category ? styles.inputError : ""}`}
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <span className={styles.text}>
                {form.category
                  ? categories.find((c) => c._id === form.category)?.name ||
                    "انتخاب کنید"
                  : "انتخاب کنید"}
              </span>
              <IoIosArrowDown
                className={`${styles.arrow} ${categoryOpen ? styles.open : ""}`}
              />
            </button>
            {!form.category && (
              <p className={styles.helperError}>انتخاب دسته‌بندی الزامی است</p>
            )}
            {categoryOpen && (
              <div className={styles.dropdown}>
                <div className={styles.cityListContainer}>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      className={`${styles.dropdownItem} ${
                        form.category === cat._id ? styles.selectedItem : ""
                      }`}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, category: cat._id }));
                        setCategoryOpen(false);
                      }}
                    >
                      <span className={styles.cityName}>{cat.name}</span>
                      {form.category === cat._id && (
                        <span className={styles.check}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label>قیمت (تومان)</label>
          <div className={styles.priceInputContainer}>
            <input
              type="number"
              name="priceFrom"
              value={form.priceFrom}
              onChange={changeHandler}
              placeholder="مثال: 25000000"
              className={styles.priceInput}
            />
            <span className={styles.currency}>تومان</span>
          </div>
          <p className={styles.priceHint}>
            در صورت تمایل می‌توانید قیمت را خالی بگذارید
          </p>
        </div>

        <div className={styles.actionButtons}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.cancelBtn}
            disabled={isPending}
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={styles.submitBtn}
          >
            {isPending ? (
              <>
                <span className={styles.loader}></span>
                در حال ارسال...
              </>
            ) : (
              "ثبت تغییرات"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.853 3.147a.5.5 0 0 1 0 .708L8.707 8l4.146 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293l4.146-4.146a.5.5 0 0 1 .707 0z" />
  </svg>
);

const UploadIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default EditPost;
