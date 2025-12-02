import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { checkOpt } from "services/auth";
import { getProfile } from "services/user";
import { setCookie } from "utils/cookie";
import { GoArrowLeft } from "react-icons/go";
import { IoMdTimer } from "react-icons/io";

import styles from "./CheckOtpForm.module.css";

function CheckOtpForm({ code, setCode, setStep, mobile }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(112); // 1:52 دقیقه
  const inputRefs = useRef([]);

  const { refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  // تایمر معکوس
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // فوکوس روی اینپوت اول (اولین باکس سمت چپ)
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleChange = (index, value) => {
    setError("");

    // فقط اعداد مجاز
    const numValue = value.replace(/[^\d]/g, "");

    if (numValue) {
      const newCode = code.split("");
      newCode[index] = numValue;
      setCode(newCode.join(""));

      // رفتن به اینپوت بعدی (سمت راست)
      if (index < 4 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === "" && index > 0) {
      // اگر حذف کرد و اینپوت خالی شد، به قبلی برو (سمت چپ)
      const newCode = code.split("");
      newCode[index] = "";
      setCode(newCode.join(""));
      inputRefs.current[index - 1].focus();
    } else if (value === "" && index === 0) {
      // اگر در اولین باکس حذف کرد
      const newCode = code.split("");
      newCode[0] = "";
      setCode(newCode.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1].focus();
    }

    // ArrowLeft - حرکت به چپ
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // ArrowRight - حرکت به راست
    if (e.key === "ArrowRight" && index < 4) {
      inputRefs.current[index + 1].focus();
    }

    // Delete - حرکت به راست
    if (e.key === "Delete" && code[index] && index < 4) {
      const newCode = code.split("");
      newCode[index] = "";
      setCode(newCode.join(""));
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^\d]/g, "");

    if (pastedData.length === 5) {
      setCode(pastedData);
      inputRefs.current[4].focus(); // فوکوس روی آخرین باکس
    } else if (pastedData.length > 0) {
      // اگر کمتر از ۵ رقم بود، پر کن تا ۵ رقم
      const paddedData = pastedData.padEnd(5, "").substring(0, 5);
      setCode(paddedData);
      const lastFilledIndex = Math.min(pastedData.length, 4);
      inputRefs.current[lastFilledIndex].focus();
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");

    if (code.length !== 5) {
      setError("کد تایید باید ۵ رقم باشد");
      return;
    }

    setIsLoading(true);
    const { response, error: apiError } = await checkOpt(mobile, code);

    if (response) {
      setCookie(response.data);
      refetch();
      navigate("/");
    }

    if (apiError) {
      setError(apiError.response?.data?.message || "کد وارد شده نامعتبر است");
      // ریست کد و فوکوس
      setCode("");
      inputRefs.current[0]?.focus();
    }

    setIsLoading(false);
  };

  const handleResendCode = async () => {
    // در اینجا باید تابع ارسال مجدد کد فراخوانی شود
    setTimer(112);
    setError("");
    setCode("");
    inputRefs.current[0]?.focus();
  };

  const handleEditMobile = () => {
    setStep(1);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* هدر */}
        <div className={styles.header}>
          <div className={styles.brand}>
            <img src="/divar.svg" alt="دیوار" className={styles.brandName} />
          </div>
          <h1 className={styles.title}>تایید شماره موبایل</h1>
          <p className={styles.description}>
            کد ۵ رقمی ارسال‌شده به <strong>{mobile}</strong> را وارد کنید
          </p>
        </div>

        {/* فرم */}
        <form onSubmit={submitHandler} className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.codeInputsWrapper}>
              <div className={styles.codeInputsContainer} onPaste={handlePaste}>
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className={styles.codeInputWrapper}>
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="tel"
                      inputMode="numeric"
                      maxLength="1"
                      value={code[index] || ""}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`${styles.codeInput} ${
                        error ? styles.error : ""
                      }`}
                      dir="ltr"
                      autoComplete="off"
                      data-index={index}
                    />
                  </div>
                ))}
              </div>
              <label className={styles.codeLabel}>کد تایید</label>
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

          {/* تایمر و دکمه ویرایش */}
          <div className={styles.actionsContainer}>
            <div className={styles.timerContainer}>
              <IoMdTimer className={styles.timerIcon} />
              <span className={styles.timerText}>
                {timer > 0 ? (
                  <>
                    امکان ارسال مجدد کد تا
                    <span className={styles.timerValue}>
                      {" "}
                      {formatTime(timer)}
                    </span>
                  </>
                ) : (
                  "کد منقضی شده است"
                )}
              </span>
            </div>

            {timer === 0 && (
              <button
                type="button"
                onClick={handleResendCode}
                className={styles.resendBtn}
              >
                ارسال مجدد کد
              </button>
            )}

            <button
              type="button"
              onClick={handleEditMobile}
              className={styles.editMobileBtn}
            >
              ویرایش شماره موبایل
            </button>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading || code.length !== 5}
          >
            <span className={styles.btnText}>
              {isLoading ? "در حال  بررسی" : "تایید و ادامه"}
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

export default CheckOtpForm;
