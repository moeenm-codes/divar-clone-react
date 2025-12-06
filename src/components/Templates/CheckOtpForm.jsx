import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { checkOtp, sendOtp } from "services/auth";
import { getProfile } from "services/user";
import { setCookie } from "utils/cookie";
import { p2e } from "utils/numbers";
import { useToast } from "components/hooks/useToast";
import { GoArrowLeft } from "react-icons/go";
import { IoMdTimer } from "react-icons/io";

import styles from "./CheckOtpForm.module.css";

const RESEND_TIME_SECONDS = 120;

function CheckOtpForm({ code, setCode, setStep, mobile }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_TIME_SECONDS);
  const inputRefs = useRef([]);
  const containerRef = useRef(null); // برای shake animation

  const { refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: false,
  });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const focusFirstInput = () => {
    inputRefs.current[0]?.focus();
  };

  useEffect(() => {
    focusFirstInput();
  }, []);

  // تابع shake animation
  const triggerShake = () => {
    if (containerRef.current) {
      containerRef.current.classList.add(styles.shake);
      setTimeout(() => {
        containerRef.current?.classList.remove(styles.shake);
      }, 500);
    }
  };

  // خودکار سابمیت کردن فرم هنگام تکمیل کد
  useEffect(() => {
    if (code.length === 5 && !isLoading) {
      submitHandler();
    }
  }, [code]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleChange = (index, value) => {
    setError("");

    // فقط اعداد مجاز (فارسی و انگلیسی)
    const numValue = value.replace(/[^\d۰-۹]/g, "");

    if (numValue) {
      const newCodeArray = code.split("");
      newCodeArray[index] = p2e(numValue);
      setCode(newCodeArray.join(""));

      if (index < 4 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === "" && index > 0) {
      const newCodeArray = code.split("");
      newCodeArray[index] = "";
      setCode(newCodeArray.join(""));
      inputRefs.current[index - 1].focus();
    } else if (value === "" && index === 0) {
      const newCodeArray = code.split("");
      newCodeArray[0] = "";
      setCode(newCodeArray.join(""));
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
    const pastedData = p2e(
      e.clipboardData.getData("text").replace(/[^\d]/g, "")
    );

    if (pastedData.length >= 5) {
      setCode(pastedData.substring(0, 5));
      inputRefs.current[4].focus();
    } else if (pastedData.length > 0) {
      const paddedData = pastedData.padEnd(5, "").substring(0, 5);
      setCode(paddedData);
      const lastFilledIndex = pastedData.length - 1;
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const submitHandler = async (event) => {
    event?.preventDefault();

    if (code.length !== 5) {
      setError("کد تایید باید ۵ رقم باشد");
      return;
    }

    setIsLoading(true);
    const englishCode = p2e(code);

    try {
      const { response, error: apiError } = await checkOtp(mobile, englishCode);

      if (response) {
        setCookie(response.data);
        await refetch();
        navigate("/");
        return;
      }

      if (apiError) {
        const errorMsg =
          apiError.response?.data?.message || "کد وارد شده نامعتبر است";
        setError(errorMsg);
        triggerShake();
        toast.error("کد وارد شده اشتباه است");

        setCode("");
        focusFirstInput();
      }
    } catch (err) {
      toast.error("خطایی رخ داده است");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);

    try {
      const { response, error: apiError } = await sendOtp(mobile);

      if (response) {
        setTimer(RESEND_TIME_SECONDS);
        setError("");
        setCode("");
        focusFirstInput();
        toast.success("کد تایید مجددا ارسال شد.");
      }

      if (apiError) {
        toast.error(
          apiError.response?.data?.message || "خطا در ارسال مجدد کد."
        );
      }
    } catch (err) {
      console.error("Error in resend:", err);
      toast.error("خطا در ارسال مجدد کد.");
    } finally {
      setIsLoading(false);
    }
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
            <div className={styles.codeInputsWrapper} ref={containerRef}>
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
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
              <label className={styles.codeLabel}>کد تایید</label>
            </div>
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
                disabled={isLoading}
              >
                ارسال مجدد کد
              </button>
            )}

            <button
              type="button"
              onClick={handleEditMobile}
              className={styles.editMobileBtn}
              disabled={isLoading}
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
              {isLoading ? "در حال بررسی" : "تایید و ادامه"}
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
