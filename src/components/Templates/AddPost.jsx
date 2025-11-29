// src/components/Templates/AddPost.jsx

import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCategory, createPost } from "services/admin";
import { PROVINCES } from "../../constants/provinces";
import { getCookie } from "utils/cookie";
import { useToast } from "components/hooks/useToast";
import { normalizePersian } from "utils/normalize";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import styles from "./AddPost.module.css";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function AddPost() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title_post: "",
    description: "",
    city: "",
    category: "",
    priceFrom: "",
    lat: 35.6892,
    lng: 51.389,
    images: [],
  });

  const [errors, setErrors] = useState({});

  // State برای dropdown
  const [cityOpen, setCityOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  // Refs
  const cityDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // دریافت دسته‌بندی‌ها
  const { data: categoryData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
    staleTime: 5 * 60 * 1000,
  });

  // بخش ثبت آگهی
  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "آگهی با موفقیت ایجاد شد!");

      // کش‌ها رو پاک می‌کنیم تا جدیدترین داده‌ها لود بشن
      queryClient.removeQueries({ queryKey: ["my-post-list"] });
      queryClient.removeQueries({ queryKey: ["post-list"] });

      // مستقیم می‌ریم به آگهی‌های من
      navigate("/my-divar/my-posts", { replace: true });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "خطا در ایجاد آگهی";
      toast.error(msg);
    },
  });

  // فیلتر شهرها
  const filteredCities = useMemo(() => {
    const q = normalizePersian(cityQuery);
    if (!q) return PROVINCES;
    return PROVINCES.filter((p) => normalizePersian(p).includes(q));
  }, [cityQuery]);

  const categories = categoryData?.data || [];

  const handleCitySelect = (city) => {
    setForm((prev) => ({ ...prev, city }));
    setCityOpen(false);
    if (errors.city) setErrors((prev) => ({ ...prev, city: false }));
  };

  const handleCategorySelect = (cat) => {
    setForm((prev) => ({ ...prev, category: cat._id }));
    setCategoryOpen(false);
    if (errors.category) setErrors((prev) => ({ ...prev, category: false }));
  };

  // کلیک خارج از دراپ‌داون
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

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  // اضافه کردن عکس جدید
  const handleNewImage = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = [];

      for (let file of files) {
        if (validFiles.length >= MAX_IMAGES - form.images.length) break;
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`فقط JPG, PNG, WebP مجاز است.`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`حجم فایل بیش از ۵ مگابایت است.`);
          continue;
        }
        validFiles.push(file);
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
      }));

      if (errors.images) setErrors((prev) => ({ ...prev, images: false }));
    }
  };

  // حذف عکس
  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.title_post.trim()) newErrors.title_post = "عنوان الزامی است.";
    if (!form.description.trim()) newErrors.description = "توضیحات الزامی است.";
    if (!form.city) newErrors.city = "شهر الزامی است.";
    if (!form.category) newErrors.category = "دسته‌بندی الزامی است.";
    if (form.images.length === 0) newErrors.images = "حداقل یک عکس الزامی است.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("title_post", form.title_post);
    formData.append("description", form.description);
    formData.append("city", form.city);
    formData.append("category", form.category);
    if (form.priceFrom) formData.append("amount", form.priceFrom);
    formData.append("lat", form.lat);
    formData.append("lng", form.lng);
    form.images.forEach((img) => formData.append("images", img));

    const token = getCookie("accessToken");
    mutate({ formData, token });
  };

  // محاسبه تعداد اسلات‌های خالی
  const totalImages = form.images.length;
  const emptySlots = MAX_IMAGES - totalImages;

  return (
    <div className={styles.page}>
      <form onSubmit={submitHandler} className={styles.form}>
        <div className={styles.header}>
          <h3>افزودن آگهی جدید</h3>
          <p className={styles.hint}>
            همه فیلدها الزامی هستند مگر اینکه مشخص شده باشد.
          </p>
        </div>

        {/* عکس‌ها */}
        <div className={styles.field}>
          <label className={styles.uploadLabel}>
            عکس‌های آگهی (حداکثر {MAX_IMAGES} عکس)
            <span className={styles.imageCount}>
              {totalImages}/{MAX_IMAGES}
            </span>
          </label>

          <div className={styles.imageGrid}>
            {/* عکس‌های آپلود شده */}
            {form.images.map((file, i) => (
              <div key={`image-${i}`} className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`عکس ${i + 1}`}
                    className={styles.image}
                  />
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeImage(i)}
                  aria-label="حذف عکس"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}

            {/* اسلات آپلود */}
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
                  <span className={styles.uploadHint}>
                    تا {emptySlots} عکس دیگر
                  </span>
                </div>
              </label>
            )}
          </div>

          {errors.images && (
            <p className={styles.helperError}>{errors.images}</p>
          )}

          {emptySlots === 0 && (
            <p className={styles.maxImagesHint}>
              شما حداکثر تعداد عکس‌ها را انتخاب کرده‌اید
            </p>
          )}
        </div>

        {/* عنوان */}
        <div className={styles.field}>
          <label htmlFor="title_post">عنوان آگهی</label>
          <input
            type="text"
            name="title_post"
            id="title_post"
            value={form.title_post}
            onChange={changeHandler}
            className={errors.title_post ? styles.inputError : ""}
            placeholder="مثال: آیفون ۱۳ پرو مکس سالم"
          />
          {errors.title_post && (
            <p className={styles.helperError}>{errors.title_post}</p>
          )}
        </div>

        {/* توضیحات */}
        <div className={styles.field}>
          <label htmlFor="description">توضیحات</label>
          <textarea
            name="description"
            id="description"
            value={form.description}
            onChange={changeHandler}
            className={errors.description ? styles.inputError : ""}
            rows="6"
            placeholder="شرح کامل آگهی خود را اینجا بنویسید..."
          />
          {errors.description && (
            <p className={styles.helperError}>{errors.description}</p>
          )}
        </div>

        {/* شهر */}
        <div className={styles.field}>
          <label>شهر</label>
          <div className={styles.dropdownWrapper} ref={cityDropdownRef}>
            <button
              type="button"
              className={`${styles.dropdownBtn} ${
                cityOpen ? styles.active : ""
              } ${errors.city ? styles.inputError : ""}`}
              onClick={() => setCityOpen(!cityOpen)}
            >
              <FaMapMarkerAlt className={styles.icon} />
              <span className={styles.text}>{form.city || "انتخاب شهر"}</span>
              <IoIosArrowDown
                className={`${styles.arrow} ${cityOpen ? styles.open : ""}`}
              />
            </button>
            {errors.city && <p className={styles.helperError}>{errors.city}</p>}
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
                        onClick={() => handleCitySelect(city)}
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

        {/* دسته‌بندی */}
        <div className={styles.field}>
          <label>دسته‌بندی</label>
          <div className={styles.dropdownWrapper} ref={categoryDropdownRef}>
            <button
              type="button"
              className={`${styles.dropdownBtn} ${
                categoryOpen ? styles.active : ""
              } ${errors.category ? styles.inputError : ""}`}
              onClick={() => setCategoryOpen(!categoryOpen)}
              disabled={isLoadingCategories}
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
            {errors.category && (
              <p className={styles.helperError}>{errors.category}</p>
            )}
            {categoryOpen && (
              <div className={styles.dropdown}>
                <div className={styles.cityListContainer}>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <button
                        key={cat._id}
                        type="button"
                        className={`${styles.dropdownItem} ${
                          form.category === cat._id ? styles.selectedItem : ""
                        }`}
                        onClick={() => handleCategorySelect(cat)}
                      >
                        <span className={styles.cityName}>{cat.name}</span>
                        {form.category === cat._id && (
                          <span className={styles.check}>✓</span>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className={styles.cityEmptyResult}>
                      دسته‌بندی موجود نیست
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* قیمت */}
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

        {/* دکمه‌های اقدام */}
        <div className={styles.actionButtons}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.cancelBtn}
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
              "ثبت آگهی"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// آیکون مینیمال برای بستن
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.853 3.147a.5.5 0 0 1 0 .708L8.707 8l4.146 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293l4.146-4.146a.5.5 0 0 1 .707 0z" />
  </svg>
);

// آیکون مینیمال برای آپلود
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

export default AddPost;
