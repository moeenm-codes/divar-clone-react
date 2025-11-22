import React, { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites_posts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites_posts", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (post) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p._id === post._id);
      if (exists) {
        return prev.filter((p) => p._id !== post._id);
      } else {
        return [...prev, post];
      }
    });
  };

  const isFavorite = (postId) => favorites.some((p) => p._id === postId);

  const favoritePosts = favorites; // این برای صفحه علاقه‌مندی‌ها

  return (
    <FavoritesContext.Provider
      value={{ favorites: favoritePosts, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
