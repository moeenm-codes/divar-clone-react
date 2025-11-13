import styles from "./Sidebar.module.css";

function Sidebar({ categories, selectedCategoryId, onCategoryClick }) {
  return (
    <div className={styles.sidebar}>
      <h4>دسته بندی ها</h4>
      <ul>
        <li
          onClick={() => onCategoryClick(null)}
          className={selectedCategoryId === null ? styles.active : ""}
          style={{ cursor: "pointer" }}
        >
          <span style={{ marginRight: "8px" }}>همه</span>
          <p>همه</p>
        </li>
        {categories.data.map((category) => (
          <li
            key={category._id}
            onClick={() => onCategoryClick(category._id)}
            className={selectedCategoryId === category._id ? styles.active : ""}
            style={{ cursor: "pointer" }}
          >
            <img src={`/${category.icon}.svg`} alt={category.name} />
            <p>{category.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
