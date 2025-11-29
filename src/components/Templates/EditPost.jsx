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
import styles from "./AddPost.module.css";

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

  // دریافت اطلاعات آگهی
  const { data: postData, isLoading: loadingPost } = useQuery({
    queryKey: ["edit-post", postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
  });

  // دریافت دسته‌بندی‌ها
  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  const categories = catData?.data || [];

  // پر کردن فرم وقتی داده‌ها آمد
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
        existingImages: p.images || [],
      });
      setCityQuery(p.city || "");
    }
  }, [postData]);

  // فیلتر شهرها
  const filteredCities = useMemo(() => {
    const q = normalizePersian(cityQuery);
    if (!q) return PROVINCES;
    return PROVINCES.filter((c) => normalizePersian(c).includes(q));
  }, [cityQuery]);

  // کلیک خارج از دراپ‌داون — حتماً بالای return باشه!
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

  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => updateMyPost(postId, formData),
    onSuccess: () => {
      toast.success("آگهی با موفقیت ویرایش شد!");
      queryClient.removeQueries({ queryKey: ["post-list"] });
      queryClient.removeQueries({ queryKey: ["my-post-list"] });
      navigate("/my-divar/my-posts", { replace: true });
    },
    onError: () => toast.error("خطا در ویرایش آگهی"),
  });

  const changeHandler = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setForm((prev) => ({ ...prev, images: Array.from(files) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title_post", form.title_post);
    formData.append("description", form.description);
    formData.append("city", form.city);
    formData.append("category", form.category);
    if (form.priceFrom) formData.append("amount", form.priceFrom);
    form.images.forEach((file) => formData.append("images", file));
    mutate(formData);
  };

  // لودینگ — قبل از هر useEffect دیگه‌ای
  if (loadingPost) {
    return (
      <div className={styles.page}>
        <div className={styles.form}>
          <h3>در حال بارگذاری آگهی...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <form onSubmit={submitHandler} className={styles.form}>
        <h3>ویرایش آگهی</h3>
        <p className={styles.hint}>هر قسمتی که بخوای رو تغییر بده</p>

        {/* عکس‌های فعلی */}
        {form.existingImages.length > 0 && (
          <div className={styles.field}>
            <label className={styles.uploadLabel}>
              عکس‌های فعلی (در صورت آپلود جدید، جایگزین میشن)
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              {form.existingImages.map((img, i) => (
                <img
                  key={i}
                  src={`${baseURL}${img.replace(/\\/g, "/")}`}
                  alt={`عکس ${i + 1}`}
                  style={{
                    width: "100%",
                    height: "130px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* عنوان */}
        <div className={styles.field}>
          <label>عنوان آگهی</label>
          <input
            type="text"
            name="title_post"
            value={form.title_post}
            onChange={changeHandler}
          />
        </div>

        {/* توضیحات */}
        <div className={styles.field}>
          <label>توضیحات</label>
          <textarea
            name="description"
            value={form.description}
            onChange={changeHandler}
            rows="6"
          />
        </div>

        {/* شهر */}
        <div className={styles.field}>
          <label>شهر</label>
          <div className={styles.dropdownWrapper} ref={cityDropdownRef}>
            <button
              type="button"
              className={`${styles.dropdownBtn} ${
                cityOpen ? styles.active : ""
              }`}
              onClick={() => setCityOpen(!cityOpen)}
            >
              <FaMapMarkerAlt className={styles.icon} />
              <span>{form.city || "انتخاب شهر"}</span>
              <IoIosArrowDown
                className={`${styles.arrow} ${cityOpen ? styles.open : ""}`}
              />
            </button>

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
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, city }));
                        setCityOpen(false);
                        setCityQuery(city);
                      }}
                    >
                      {city}
                    </button>
                  ))}
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
              }`}
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <span>
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
                <div className={styles.cityListContainer}>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, category: cat._id }));
                        setCategoryOpen(false);
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* قیمت */}
        <div className={styles.field}>
          <label>قیمت (تومان)</label>
          <input
            type="number"
            name="priceFrom"
            value={form.priceFrom}
            onChange={changeHandler}
          />
        </div>

        {/* آپلود عکس جدید */}
        <div className={styles.field}>
          <label className={styles.uploadLabel}>آپلود عکس جدید (اختیاری)</label>
          <div className={styles.uploadBox}>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={changeHandler}
              className={styles.fileInput}
            />
            <label className={styles.uploadArea}>
              <div className={styles.uploadIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <p className={styles.uploadText}>
                {form.images.length > 0
                  ? `${form.images.length} عکس انتخاب شد`
                  : "کلیک کنید یا عکس را اینجا بکشید"}
              </p>
              <p className={styles.uploadHint}>
                حداکثر ۱۰ عکس • هر عکس حداکثر ۵ مگابایت
              </p>
            </label>
          </div>
        </div>

        <button type="submit" disabled={isPending} className={styles.submitBtn}>
          {isPending ? (
            <>
              <span className={styles.loader}></span>
              در حال ارسال...
            </>
          ) : (
            "ثبت تغییرات"
          )}
        </button>
      </form>
    </div>
  );
}

export default EditPost;
