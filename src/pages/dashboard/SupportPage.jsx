import { useState } from "react";
import { faqData } from "../../constants/supportFaq";
import FaqAccordion from "./FaqAccordion";
import styles from "./SupportPage.module.css";
import { FiPhone, FiClock, FiMail, FiHelpCircle } from "react-icons/fi";

function SupportPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <FiHelpCircle className={styles.icon} />
          پشتیبانی دیوار
        </h1>
        <p className={styles.subtitle}>
          سوالات متداول خود را اینجا پیدا کنید یا با ما در ارتباط باشید
        </p>
      </header>

      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>سوالات متداول</h2>
        <div className={styles.faqList}>
          {faqData.map((item, index) => (
            <FaqAccordion
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={activeIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </section>

      {/* داخل SupportPage.jsx → بخش تماس با ما */}
      <section className={styles.contactSection}>
        <h2 className={styles.sectionTitle}>تماس با ما</h2>

        <div className={styles.contactGrid}>
          {/* تلفن */}
          <div className={styles.miniCard}>
            <div className={styles.miniIcon}>
              <FiPhone />
            </div>
            <div>
              <h3>تلفن پشتیبانی</h3>
              <p>در حال حاضر فعال نیست</p>
            </div>
          </div>

          {/* ساعت */}
          <div className={styles.miniCard}>
            <div className={styles.miniIcon}>
              <FiClock />
            </div>
            <div>
              <h3>ساعات پاسخگویی</h3>
              <p>همه روزه ۸ صبح تا ۱۲ شب</p>
            </div>
          </div>

          {/* ایمیل */}
          <div className={styles.miniCard}>
            <div className={styles.miniIcon}>
              <FiMail />
            </div>
            <div>
              <h3>ایمیل</h3>
              <p>support@divar.ir</p>
            </div>
          </div>
        </div>

        <div className={styles.simpleAlert}>
          <strong>نکته:</strong> دیوار فقط بستر آگهی است. قبل از پرداخت، کالا را
          حضوری ببینید.
        </div>
      </section>
    </div>
  );
}

export default SupportPage;
