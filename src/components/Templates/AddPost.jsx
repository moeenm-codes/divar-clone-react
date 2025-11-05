// AddPost.jsx
import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategory, createPost } from "services/admin";
import { getCookie } from "utils/cookie";
import { useToast } from "components/hooks/useToast";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import styles from "./AddPost.module.css";

const PROVINCES = [
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "اردبیل",
  "اصفهان",
  "البرز",
  "ایلام",
  "بوشهر",
  "تهران",
  "چهارمحال و بختیاری",
  "خراسان جنوبی",
  "خراسان رضوی",
  "خراسان شمالی",
  "خوزستان",
  "زنجان",
  "سمنان",
  "سیستان و بلوچستان",
  "فارس",
  "قزوین",
  "قم",
  "کردستان",
  "کرمان",
  "کرمانشاه",
  "کهگیلویه و بویراحمد",
  "گلستان",
  "گیلان",
  "لرستان",
  "مازندران",
  "مرکزی",
  "هرمزگان",
  "همدان",
  "یزد",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function AddPost() {
  const [form, setForm] = useState({
    title_post: "",
    description: "",
    city: "",
    category: "",
    priceFrom: "",
    priceTo: "",
    lat: 35.6892,
    lng: 51.389,
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [fileNames, setFileNames] = useState([]);

  // State برای dropdown شهر
  const [cityOpen, setCityOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [highlightedCityIndex, setHighlightedCityIndex] = useState(0);

  // State برای dropdown دسته‌بندی
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [highlightedCategoryIndex, setHighlightedCategoryIndex] = useState(0);

  const toast = useToast();
  const queryClient = useQueryClient();

  // Refs
  const citySearchRef = useRef(null);
  const cityListRef = useRef(null);
  const categoryListRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // دریافت دسته‌بندی‌ها
  const { data: categoryData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "آگهی با موفقیت ایجاد شد!");
      resetForm();
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "خطا در ایجاد آگهی";
      toast.error(msg);
    },
  });

  const resetForm = () => {
    setForm({
      title_post: "",
      description: "",
      city: "",
      category: "",
      priceFrom: "",
      priceTo: "",
      lat: 35.6892,
      lng: 51.389,
      images: [],
    });
    setFileNames([]);
    setErrors({});
    setCityQuery("");
    setCityOpen(false);
    setCategoryOpen(false);
  };

  // فیلتر شهرها
  const filteredCities = useMemo(() => {
    if (!cityQuery.trim()) return PROVINCES;
    return PROVINCES.filter((p) => p.includes(cityQuery.trim()));
  }, [cityQuery]);

  // فیلتر دسته‌بندی‌ها (بدون جستجو)
  const categories = categoryData?.data || [];

  // کیبورد برای شهر
  const handleCityKeyDown = (e) => {
    if (!cityOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedCityIndex((prev) =>
        prev < filteredCities.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedCityIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCities[highlightedCityIndex]) {
        handleCitySelect(filteredCities[highlightedCityIndex]);
      }
    } else if (e.key === "Escape") {
      setCityOpen(false);
    }
  };

  // کیبورد برای دسته‌بندی
  const handleCategoryKeyDown = (e) => {
    if (!categoryOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedCategoryIndex((prev) =>
        prev < categories.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedCategoryIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (categories[highlightedCategoryIndex]) {
        handleCategorySelect(categories[highlightedCategoryIndex]);
      }
    } else if (e.key === "Escape") {
      setCategoryOpen(false);
    }
  };

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

  // فوکوس روی جستجو
  useEffect(() => {
    if (cityOpen && citySearchRef.current) citySearchRef.current.focus();
  }, [cityOpen]);

  // کلیک خارج
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
    const { name, value, files } = e.target;
    if (name === "images") {
      handleFilesChange(files);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleFilesChange = (files) => {
    const validFiles = [];
    const names = [];
    for (let file of files) {
      if (validFiles.length >= 10) break;
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`فقط JPG, PNG, WebP مجاز است.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`حجم فایل بیش از ۵ مگابایت است.`);
        continue;
      }
      validFiles.push(file);
      names.push(file.name);
    }
    setForm((prev) => ({ ...prev, images: validFiles }));
    setFileNames(names);
    if (errors.images) setErrors((prev) => ({ ...prev, images: false }));
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

  return (
    <div className={styles.page}>
      <div className={styles.toastContainer}></div>

      <form onSubmit={submitHandler} className={styles.form}>
        <h3>افزودن آگهی جدید</h3>
        <p className={styles.hint}>
          همه فیلدها الزامی هستند مگر اینکه مشخص شده باشد.
        </p>

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
            placeholder="مثال: آیفون ۱۳ پرو مکس"
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
            rows="4"
            placeholder="جزئیات کامل آگهی..."
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
              <span className={styles.text}>{form.city || "انتخاب استان"}</span>
              <IoIosArrowDown
                className={`${styles.arrow} ${cityOpen ? styles.open : ""}`}
              />
            </button>

            {cityOpen && (
              <div className={styles.dropdown}>
                <div className={styles.citySearchContainer}>
                  <input
                    ref={citySearchRef}
                    value={cityQuery}
                    onChange={(e) => {
                      setCityQuery(e.target.value);
                      setHighlightedCityIndex(0);
                    }}
                    onKeyDown={handleCityKeyDown}
                    placeholder="جستجوی استان..."
                    className={styles.citySearchInput}
                  />
                </div>
                <div className={styles.cityListContainer} ref={cityListRef}>
                  {filteredCities.length === 0 ? (
                    <div className={styles.cityEmptyResult}>موردی پیدا نشد</div>
                  ) : (
                    filteredCities.map((city, i) => (
                      <button
                        key={city}
                        type="button"
                        className={[
                          styles.dropdownItem,
                          i === highlightedCityIndex ? styles.activeItem : "",
                          city === form.city ? styles.selectedItem : "",
                        ].join(" ")}
                        onMouseEnter={() => setHighlightedCityIndex(i)}
                        onClick={() => handleCitySelect(city)}
                      >
                        <span className={styles.cityName}>{city}</span>
                        {city === form.city && (
                          <span className={styles.check}>✓</span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          {errors.city && <p className={styles.helperError}>{errors.city}</p>}
        </div>

        {/* دسته‌بندی (بدون جستجو) */}
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

            {categoryOpen && (
              <div className={styles.dropdown}>
                <div className={styles.cityListContainer} ref={categoryListRef}>
                  {categories.length === 0 ? (
                    <div className={styles.cityEmptyResult}>
                      دسته‌بندی موجود نیست
                    </div>
                  ) : (
                    categories.map((cat, i) => (
                      <button
                        key={cat._id}
                        type="button"
                        className={[
                          styles.dropdownItem,
                          i === highlightedCategoryIndex
                            ? styles.activeItem
                            : "",
                          cat._id === form.category ? styles.selectedItem : "",
                        ].join(" ")}
                        onMouseEnter={() => setHighlightedCategoryIndex(i)}
                        onClick={() => handleCategorySelect(cat)}
                      >
                        <span className={styles.cityName}>{cat.name}</span>
                        {cat._id === form.category && (
                          <span className={styles.check}>✓</span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          {errors.category && (
            <p className={styles.helperError}>{errors.category}</p>
          )}
        </div>

        {/* محدوده قیمت */}
        <div className={styles.field}>
          <label>مبلغ (تومان)</label>
          <div className={styles.priceRange}>
            <input
              type="number"
              name="priceFrom"
              value={form.priceFrom}
              onChange={changeHandler}
              placeholder="مبلغ مورد نظر خود را وارد کنید"
            />
          </div>
        </div>

        {/* آپلود عکس — ساده، تمیز، حرفه‌ای */}
        <div className={styles.field}>
          <label className={styles.uploadLabel}>عکس آگهی (حداکثر ۱۰ عکس)</label>

          <div className={styles.uploadBox}>
            <input
              type="file"
              name="images"
              id="images"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={changeHandler}
              className={styles.fileInput}
            />
            <label htmlFor="images" className={styles.uploadArea}>
              <div className={styles.uploadIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 16.5V18.75C3 19.3467 3.23705 19.9185 3.65901 20.341C4.08097 20.763 4.65268 21 5.328 21H18.672C19.3473 21 19.919 20.763 20.341 20.341C20.7629 19.9185 21 19.3467 21 18.75V16.5M16.5 12L12 7.5M12 7.5L7.5 12M12 7.5V16.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className={styles.uploadText}>
                {fileNames.length > 0
                  ? `${fileNames.length} عکس انتخاب شد`
                  : "کلیک کنید یا فایل را اینجا رها کنید"}
              </p>
              <span className={styles.uploadHint}>
                حداکثر ۱۰ عکس، هر کدام تا ۵ مگابایت
              </span>
            </label>
          </div>

          {errors.images && (
            <p className={styles.helperError}>{errors.images}</p>
          )}
        </div>

        <button type="submit" disabled={isPending} className={styles.submitBtn}>
          {isPending ? (
            <>
              <span className={styles.loader}></span> در حال ارسال...
            </>
          ) : (
            "ثبت آگهی"
          )}
        </button>
      </form>
    </div>
  );
}

export default AddPost;
