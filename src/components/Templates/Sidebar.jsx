import { sp } from "utils/numbers";
import styles from "./Sidebar.module.css";

function Sidebar({
  categories,
  selectedCategoryId,
  onCategoryClick,
  minPrice,
  maxPrice,
  urlMinPrice,
  urlMaxPrice,
  onPriceChange,
}) {
  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>دسته‌بندی‌ها</h3>
      <ul className={styles.list}>
        <li
          onClick={() => onCategoryClick(null)}
          className={`${styles.item} ${
            selectedCategoryId === null ? styles.active : ""
          }`}
        >
          <span>همه آگهی‌ها</span>
        </li>
        {categories?.data?.map((category, index) => (
          <li
            key={category._id}
            onClick={() => onCategoryClick(category._id)}
            className={`${styles.item} ${
              selectedCategoryId === category._id ? styles.active : ""
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <img
              src={`/${category.icon}.svg`}
              alt={category.name}
              className={styles.icon}
            />
            <span>{category.name}</span>
          </li>
        ))}
      </ul>
      <div className={styles.priceFilter}>
        <h4 className={styles.priceTitle}>فیلتر قیمت (تومان)</h4>
        <div className={styles.priceInputs}>
          <input
            type="number"
            placeholder={`از ۰`}
            value={urlMinPrice}
            onChange={(e) => {
              const val = e.target.value;
              onPriceChange(
                val === "" ? "" : Math.max(0, parseInt(val) || 0),
                urlMaxPrice
              );
            }}
            className={styles.priceInput}
            min="0"
            max={maxPrice}
          />
          <span className={styles.separator}>—</span>
          <input
            type="number"
            placeholder={`تا ${sp(maxPrice)}`}
            value={urlMaxPrice}
            onChange={(e) => {
              const val = e.target.value;
              const num = parseInt(val) || "";
              if (num === "" || (num <= maxPrice && num >= 0)) {
                onPriceChange(urlMinPrice, num === "" ? "" : num);
              }
            }}
            className={styles.priceInput}
            min="0"
            max={maxPrice}
          />
        </div>
        {maxPrice > 0 && (
          <p className={styles.priceHint}>محدوده: ۰ تا {sp(maxPrice)} تومان</p>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
