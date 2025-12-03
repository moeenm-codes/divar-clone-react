import { useState, useRef } from "react";
import { sendOtp } from "services/auth";
import styles from "./SendOtpForm.module.css";
import { p2e } from "utils/numbers";
import { GoArrowLeft } from "react-icons/go";

function SendOtpForm({ mobile, setMobile, setStep }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");

    if (mobile.length !== 11) {
      setError("شماره موبایل باید ۱۱ رقم باشد");
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    const { response, error: apiError } = await sendOtp(p2e(mobile));

    if (response) {
      setStep(2);
    }

    if (error) {
      setError(error.response?.data?.message || "خطا در ارسال کد");
      inputRef.current?.focus();
    }

    setIsLoading(false);
  };

  const handleMobileChange = (value) => {
    setError("");
    const cleanedValue = value.replace(/[^\d۰-۹]/g, "");
    setMobile(cleanedValue.slice(0, 11));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* هدر */}
        <div className={styles.header}>
          <div className={styles.brand}>
            <img src="/divar.svg" alt="دیوار" className={styles.brandName} />
          </div>
          <h1 className={styles.title}>ورود / ثبت‌نام</h1>
          <p className={styles.description}>شماره موبایل خود را وارد کنید</p>
        </div>

        {/* فرم */}
        <form onSubmit={submitHandler} className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                placeholder="09123456789"
                value={mobile}
                onChange={(e) => handleMobileChange(e.target.value)}
                className={`${styles.input} ${error ? styles.error : ""}`}
                dir="ltr"
                autoFocus
                disabled={isLoading}
              />
              <label className={styles.inputLabel}>شماره موبایل</label>
              <div className={styles.inputLine}></div>
            </div>

            {error && (
              <div className={styles.errorContainer}>
                <svg className={styles.errorIcon} viewBox="0 0 24 24">
                  <path
                    d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className={styles.errorText}>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading || mobile.length !== 11}
          >
            <span className={styles.btnText}>
              {isLoading ? "در حال ارسال" : "ادامه"}
            </span>
            <GoArrowLeft className={styles.btnIcon} />
          </button>
        </form>

        {/* فوتر */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            با ورود یا ثبت‌نام در دیوار،
            <a href="/terms" className={styles.link}>
              {" "}
              قوانین{" "}
            </a>
            و
            <a href="/privacy" className={styles.link}>
              {" "}
              حریم خصوصی{" "}
            </a>
            را می‌پذیرید.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SendOtpForm;
