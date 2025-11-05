import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <img src="/404.png" alt="404 Error" className={styles.image} />
        </div>
        <h1 className={styles.title}>صفحه مورد نظر پیدا نشد</h1>
        <p className={styles.description}>
          ممکن است صفحه حذف شده باشد یا آدرس را اشتباه وارد کرده باشید.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.primaryButton}>
            <span className={styles.buttonText}>صفحهٔ اصلی دیوار</span>
            <div className={styles.buttonGlow}></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
