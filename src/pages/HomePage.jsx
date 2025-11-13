import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "services/user";
import Loader from "components/modules/Loader";
import Main from "components/Templates/Main";
import Sidebar from "components/Templates/Sidebar";
import { getCategory } from "services/admin";
import { useCity } from "components/context/CityContext";
import { normalizePersian } from "utils/normalize";
import { useMemo } from "react";

const style = {
  display: "flex",
};

function HomePage() {
  const { selectedCity } = useCity();

  const { data: posts, isLoading: postLoading } = useQuery({
    queryKey: ["post-list"],
    queryFn: getAllPosts,
  });

  const { data: categories, isLoading: categoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  const filteredPosts = useMemo(() => {
    if (!posts?.data?.posts) return { data: { posts: [] } };

    if (selectedCity === "همه استان‌ها") {
      return posts;
    }

    const normalizedCity = normalizePersian(selectedCity);
    const filtered = posts.data.posts.filter((post) =>
      normalizePersian(post.options.city).includes(normalizedCity)
    );
    return { data: { posts: filtered } };
  }, [posts, selectedCity]);

  return (
    <>
      {postLoading || categoryLoading ? (
        <Loader />
      ) : (
        <div style={style}>
          <Sidebar categories={categories} />
          <Main posts={filteredPosts} />
        </div>
      )}
    </>
  );
}

export default HomePage;
