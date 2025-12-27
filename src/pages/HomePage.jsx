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
import SidebarSkeleton from "components/modules/Skeletons/SidebarSkeleton";
import MainSkeleton from "components/modules/Skeletons/MainSkeleton";
import styles from "./HomePage.module.css";

function HomePage() {
  const { selectedCity } = useCity();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: posts, isLoading: postLoading } = useQuery({
    queryKey: ["post-list"],
    queryFn: getAllPosts,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
  console.log(posts);
  const { data: categories, isLoading: categoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
    staleTime: 5 * 60 * 1000, // دسته‌بندی‌ها 5 دقیقه fresh باشن
  });

  const selectedCategoryId = searchParams.get("category") || null;
  const urlMinPrice = searchParams.get("minPrice") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";
  const searchQuery = searchParams.get("search") || "";

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

    if (urlMinPrice || urlMaxPrice) {
      const min = urlMinPrice ? parseInt(urlMinPrice, 10) : 0;
      const max = urlMaxPrice ? parseInt(urlMaxPrice, 10) : Infinity;
      filtered = filtered.filter(
        (post) => post.amount >= min && post.amount <= max
      );
    }

    if (searchQuery) {
      const normalizedQuery = normalizePersian(searchQuery);
      filtered = filtered.filter((post) => {
        const title = normalizePersian(post.title || "");
        const description = normalizePersian(post.description || "");
        const content = normalizePersian(post.content || "");
        return (
          title.includes(normalizedQuery) ||
          description.includes(normalizedQuery) ||
          content.includes(normalizedQuery)
        );
      });
    }

    return { data: { posts: filtered } };
  }, [
    posts,
    selectedCity,
    selectedCategoryId,
    urlMinPrice,
    urlMaxPrice,
    searchQuery,
  ]);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isLoading = postLoading || categoryLoading;
  const hasData = posts && categories;
  if (isLoading || !hasData) {
    return (
      <div className={styles.container}>
        <SidebarSkeleton />
        <div className={styles.main}>
          <MainSkeleton />
        </div>
      </div>
    );
  }

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
          onApplyPrice={(min, max) => {
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
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
        <Main
          posts={filteredPosts}
          key={`${selectedCategoryId || "all"}-${selectedCity}-${
            urlMinPrice || 0
          }-${urlMaxPrice || "inf"}-${searchQuery}`}
        />
      </div>
    </div>
  );
}

export default HomePage;
