import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "services/user";
import Loader from "components/modules/Loader";
import Main from "components/Templates/Main";
import Sidebar from "components/Templates/Sidebar";
import { getCategory } from "services/admin";
import { useCity } from "components/context/CityContext";
import { normalizePersian } from "utils/normalize";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const style = {
  display: "flex",
};

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

  const filteredPosts = useMemo(() => {
    if (!posts?.data?.posts) return { data: { posts: [] } };

    let filtered = posts.data.posts;

    // فیلتر شهر
    if (selectedCity !== "همه استان‌ها") {
      const normalizedCity = normalizePersian(selectedCity);
      filtered = filtered.filter((post) =>
        normalizePersian(post.options.city).includes(normalizedCity)
      );
    }

    // فیلتر دسته‌بندی
    if (selectedCategoryId) {
      filtered = filtered.filter(
        (post) => post.category === selectedCategoryId
      );
    }

    return { data: { posts: filtered } };
  }, [posts, selectedCity, selectedCategoryId]);

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

  return (
    <>
      {postLoading || categoryLoading ? (
        <Loader />
      ) : (
        <div style={style}>
          <Sidebar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryClick={handleCategoryClick}
          />
          <Main posts={filteredPosts} />
        </div>
      )}
    </>
  );
}

export default HomePage;
