import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "services/user";
import Loader from "components/modules/Loader";
import Sidebar from "components/Templates/Sidebar";
import Main from "components/Templates/Main";
import { getCategory } from "services/admin";
import { useCity } from "components/context/CityContext";
import { normalizePersian } from "utils/normalize";
import { useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./HomePage.module.css";

function HomePage() {
  const { selectedCity } = useCity();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: posts, isLoading: postLoading } = useQuery({
    queryKey: ["post-list"],
    queryFn: getAllPosts,
  });

  const { data: categories, isLoading: categoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  const selectedCategoryId = searchParams.get("category") || null;
  const urlMinPrice = searchParams.get("minPrice") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";

  const { minPrice, maxPrice } = useMemo(() => {
    if (!posts?.data?.posts?.length) return { minPrice: 0, maxPrice: 0 };

    const prices = posts.data.posts.map((p) => p.amount);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts?.data?.posts) return { data: { posts: [] } };

    let filtered = posts.data.posts;

    if (selectedCity !== "همه استان‌ها") {
      const normalizedCity = normalizePersian(selectedCity);
      filtered = filtered.filter((post) =>
        normalizePersian(post.options.city).includes(normalizedCity)
      );
    }

    if (selectedCategoryId) {
      filtered = filtered.filter(
        (post) => post.category === selectedCategoryId
      );
    }
    // === فیلتر قیمت ===
    if (urlMinPrice || urlMaxPrice) {
      const min = urlMinPrice ? parseInt(urlMinPrice, 10) : 0;
      const max = urlMaxPrice ? parseInt(urlMaxPrice, 10) : Infinity;
      filtered = filtered.filter(
        (post) => post.amount >= min && post.amount <= max
      );
    }

    return { data: { posts: filtered } };
  }, [posts, selectedCity, selectedCategoryId, urlMinPrice, urlMaxPrice]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedCity === "همه استان‌ها") {
      newParams.delete("city");
    } else {
      newParams.set("city", selectedCity);
    }
    setSearchParams(newParams, { replace: true });
  }, [selectedCity, searchParams, setSearchParams]);

  const handleCategoryClick = (categoryId) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId === null) {
      newParams.delete("category");
    } else {
      newParams.set("category", categoryId);
    }
    setSearchParams(newParams);
  };

  if (postLoading || categoryLoading) return <Loader />;

  return (
    <div className={styles.homepage}>
      <div className={styles.container}>
        <Sidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategoryClick={handleCategoryClick}
          minPrice={minPrice}
          maxPrice={maxPrice}
          urlMinPrice={urlMinPrice}
          urlMaxPrice={urlMaxPrice}
          onPriceChange={(min, max) => {
            const newParams = new URLSearchParams(searchParams);
            if (min === "" || min === null) {
              newParams.delete("minPrice");
            } else {
              newParams.set("minPrice", min);
            }
            if (max === "" || max === null) {
              newParams.delete("maxPrice");
            } else {
              newParams.set("maxPrice", max);
            }
            setSearchParams(newParams);
          }}
        />
        <Main posts={filteredPosts} />
      </div>
    </div>
  );
}

export default HomePage;
