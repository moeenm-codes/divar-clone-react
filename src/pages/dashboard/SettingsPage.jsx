// src/pages/dashboard/SettingsPage.jsx
import { FiMoon, FiSun, FiMonitor } from "react-icons/fi";
import { useTheme, themeOptions } from "../../components/context/ThemeContext";
import styles from "./SettingsPage.module.css";

const themeConfig = [
  {
    value: themeOptions.SYSTEM,
    label: "سیستم",
    icon: <FiMonitor />,
    desc: "پیروی از تنظیمات سیستم",
  },
  {
    value: themeOptions.LIGHT,
    label: "روز",
    icon: <FiSun />,
    desc: "تم روشن",
  },
  {
    value: themeOptions.DARK,
    label: "شب",
    icon: <FiMoon />,
    desc: "تم تیره",
  },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>تنظیمات</h1>
        <p className={styles.subtitle}>شخصی‌سازی تجربه کاربری</p>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>تم برنامه</h2>
            <p className={styles.sectionDesc}>
              ظاهر دیوار را متناسب با ترجیح خود انتخاب کنید
            </p>
          </div>

          <div className={styles.themeGrid}>
            {themeConfig.map((option) => (
              <button
                key={option.value}
                className={`${styles.themeCard} ${
                  theme === option.value ? styles.active : ""
                }`}
                onClick={() => setTheme(option.value)}
                aria-pressed={theme === option.value}
              >
                <div className={styles.cardContent}>
                  <div className={styles.iconWrapper}>
                    <div className={styles.iconBackground}>{option.icon}</div>
                  </div>
                  <div className={styles.cardText}>
                    <h3 className={styles.cardTitle}>{option.label}</h3>
                    <p className={styles.cardDesc}>{option.desc}</p>
                  </div>
                  <div className={styles.selectionIndicator}>
                    <div
                      className={`${styles.radio} ${
                        theme === option.value ? styles.radioActive : ""
                      }`}
                    >
                      {theme === option.value && (
                        <div className={styles.radioDot} />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
