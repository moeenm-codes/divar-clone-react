// components/modules/FaqAccordion.jsx
import { useState, useRef } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import styles from "./FaqAccordion.module.css";
import { FiChevronDown } from "react-icons/fi";

function FaqAccordion({ question, answer, isOpen, onToggle }) {
  const ref = useRef(null);

  useClickAway(ref, () => {
    if (isOpen) {
      onToggle(); // این باعث میشه activeIndex = null بشه
    }
  });

  return (
    <div
      ref={ref}
      className={`${styles.accordion} ${isOpen ? styles.open : ""}`}
    >
      <button
        className={styles.question}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <FiChevronDown
          className={`${styles.icon} ${isOpen ? styles.rotated : ""}`}
        />
      </button>

      <div
        className={styles.answerWrapper}
        style={{
          maxHeight: isOpen ? "600px" : "0px",
          padding: isOpen ? "24px" : "0 24px",
          opacity: isOpen ? 1 : 0,
          transition: "all 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className={styles.answer}>{answer}</div>
      </div>
    </div>
  );
}

export default FaqAccordion;
