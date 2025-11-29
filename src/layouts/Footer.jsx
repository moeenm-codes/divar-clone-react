import React from "react";
import styles from "./Footer.module.css";
import {
  FaApple,
  FaGooglePlay,
  FaInstagram,
  FaTelegram,
  FaLinkedin,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

function Footer() {
  const services = [
    { name: "درباره دیوار", link: "#" },
    { name: "تماس با ما", link: "#" },
    { name: "فرصت‌های شغلی", link: "#" },
    { name: "بلاگ دیوار", link: "#" },
    { name: "قوانین و مقررات", link: "#" },
    { name: "حریم خصوصی", link: "#" },
  ];

  const products = [
    { name: "دیوار برای کسب‌وکارها", link: "#" },
    { name: "پنل آگهی دهندگان", link: "#" },
    { name: "بلاگ دیوار", link: "#" },
    { name: "نشان ویژه", link: "#" },
    { name: "آگهی فروشگاهی", link: "#" },
    { name: "پشتیبانی", link: "/my-divar/support" },
  ];

  const categories = [
    { name: "دیجیتال", link: "/?category=68c8a3bd6bd2248d44890ba6" },
    { name: "وسایل شخصی", link: "/?category=68ca875d024480355f6fcbde" },
    { name: "سرگرمی", link: "/?category=68d31fad1a087964b126695b" },
    { name: "خدماتی", link: "/?category=690c49f23c4ff706d401b68a" },
    { name: "املاک", link: "/?category=6927f1c8ee294dac92014494" },
    { name: "خودرو", link: "/?category=6922f13933546c4f4f9b9558" },
  ];

  const apps = [
    {
      name: "App Store",
      icon: <FaApple />,
      subtitle: "دانلود از",
      link: "https://apps.apple.com/us/app/the-wall-see-buy/id1604353794",
    },
    {
      name: "Google Play",
      icon: <FaGooglePlay />,
      subtitle: "دانلود از",
      link: "https://divar.ir/downloads/android/release/release_251111010/Divar-release-11.14.5-251111010.apk",
    },
    {
      name: "کافه بازار",
      icon: (
        <img
          src="/cafebazaar.svg"
          alt="کافه بازار"
          style={{ width: "24px", height: "24px" }}
        />
      ),
      subtitle: "دانلود از",
      link: "https://cafebazaar.ir/app/ir.divar",
    },
  ];

  const socialMedia = [
    {
      icon: <FaSquareXTwitter />,
      link: "https://x.com/Divar_Official",
      name: "x",
    },
    {
      icon: <FaInstagram />,
      link: "https://www.instagram.com/divar.official/",
      name: "instagram",
    },
    {
      icon: <FaLinkedin />,
      link: "https://ir.linkedin.com/company/divarofficial",
      name: "linkedin",
    },
    {
      icon: <FaTelegram />,
      link: "https://telegram.me/divar_com",
      name: "telegram",
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* بخش بالای فوتر */}
        <div className={styles.top}>
          {/* ستون اول - خدمات */}
          <div className={styles.column}>
            <h3>خدمات دیوار</h3>
            <ul>
              {services.map((item, index) => (
                <li key={index}>
                  <a href={item.link} target="_blank">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ستون دوم - محصولات */}
          <div className={styles.column}>
            <h3>محصولات دیوار</h3>
            <ul>
              {products.map((item, index) => (
                <li key={index}>
                  <a href={item.link} target="_blank">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ستون سوم - دسته‌بندی‌ها */}
          <div className={styles.column}>
            <h3>دسته‌بندی‌ها</h3>
            <ul>
              {categories.map((item, index) => (
                <li key={index}>
                  <a href={item.link}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* ستون چهارم - اپلیکیشن */}
          <div className={styles.column}>
            <h3>دانلود اپلیکیشن</h3>
            <div className={styles.apps}>
              {apps.map((app, index) => (
                <a
                  href={app.link}
                  className={styles.appButton}
                  key={index}
                  target="_blank"
                >
                  <div className={styles.appIcon}>{app.icon}</div>
                  <div className={styles.appText}>
                    <span>{app.subtitle}</span>
                    <span>{app.name}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* بخش پایین - لوگو + شبکه‌های اجتماعی */}
        <div className={styles.bottom}>
          <div className={styles.info}>
            <div className={styles.logoAndSocial}>
              {/* لوگو */}
              <div className={styles.logoWrapper}>
                <img
                  src="/divar.svg"
                  alt="لوگوی دیوار"
                  className={styles.logoImg}
                />
              </div>

              {/* شبکه‌های اجتماعی - منتقل شده از middle */}
              <div className={styles.social}>
                <span>دیوار در شبکه‌های اجتماعی</span>
                <div className={styles.socialIcons}>
                  {socialMedia.map((item, index) => (
                    <a
                      href={item.link}
                      target="_blank"
                      className={styles.socialIcon}
                      key={index}
                      aria-label={item.name}
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className={styles.description}>
            دیوار، پایگاه خرید و فروش بی‌واسطه در ایران است که نیازمندی‌های
            روزانه، خدمات و کالاهای نو و دست دوم را پوشش می‌دهد. این پلتفرم با
            هدف متصل کردن فروشنده و خریدار بدون واسطه، با ارائه امکانات و خدمات
            متنوع، فرآیند خرید و فروش را برای میلیون‌ها کاربر در سراسر کشور آسان
            کرده است. دیوار با مأموریت تسهیل معاملات، سعی در ایجاد تجربه‌ای
            مطمئن و کارآمد دارد.
          </p>
        </div>
      </div>

      {/* کپی رایت */}
      <div className={styles.copyright}>
        <p>
          استفاده از مطالب دیوار، فقط برای مقاصد غیرتجاری و با ذکر منبع بلامانع
          است. | کلیه حقوق این سرویس محفوظ است © ۱۴۰۴
        </p>
      </div>
    </footer>
  );
}

export default Footer;
