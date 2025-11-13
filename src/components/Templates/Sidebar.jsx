import styles from "./Sidebar.module.css";

function Sidebar({ categories, selectedCategoryId, onCategoryClick }) {
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
    </aside>
  );
}

export default Sidebar;
