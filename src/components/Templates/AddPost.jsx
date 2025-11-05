import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getCategory } from "services/admin";
import styles from "./AddPost.module.css";
import { getCookie } from "utils/cookie";
import axios from "axios";

function AddPost() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    city: "",
    category: "",
    amount: null,
    iamges: null,
  });

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  const changeHandler = (event) => {
    const name = event.target.name;
    if (name !== "images") {
      setForm({ ...form, [name]: event.target.value });
    } else {
      setForm({ ...form, [name]: event.target.files[0] });
    }
  };

  const addHandler = (event) => {
    event.preventDefault();
    const formData = new formData();
    for (let item in form) {
      formData.append(item, form[item]);
    }
    const token = getCookie("accessToken");
    axios.post(`${import.meta.env.VITE_BASE_URL}post/create`, formData, {
      "Content-Type": "multipart/form-data",
      Authorization: `bearer ${token}`,
    });
  };

  return (
    <form onChange={changeHandler} className={styles.form}>
      <h3>افزودن آگهی</h3>
      <label htmlFor="title">عنوان آگهی</label>
      <input type="text" name="title" id="title" />

      <label htmlFor="content">توضیحات</label>
      <textarea name="content" id="content" />

      <label htmlFor="amount">مبلغ</label>
      <input type="text" name="amount" id="amount" />

      <label htmlFor="city">شهر</label>
      <input type="text" name="city" id="city" />

      <label htmlFor="category">دسته بندی</label>
      <select name="category" id="category">
        {data?.data.map((item) => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
      <label htmlFor="images">عکس آگهی</label>
      <input type="file" name="images" id="images" />
      <button onClick={addHandler}>ایجاد</button>
    </form>
  );
}

export default AddPost;
