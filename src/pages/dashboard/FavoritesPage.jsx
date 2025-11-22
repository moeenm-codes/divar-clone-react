// src/pages/dashboard/FavoritesPage.jsx
import { useFavorites } from "components/context/FavoritesContext";
import Main from "components/Templates/Main";

function FavoritesPage() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>علاقه‌مندی‌ها</h2>
        <p style={{ fontSize: "1.2rem", color: "#888", marginTop: "20px" }}>
          هنوز هیچ آگهی را لایک نکرده‌اید.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>
        علاقه‌مندی‌ها ({favorites.length})
      </h2>
      <Main posts={{ data: { posts: favorites } }} />
    </div>
  );
}

export default FavoritesPage;
