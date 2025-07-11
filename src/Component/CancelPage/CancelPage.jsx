import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./CancelPage.module.css";

const CancelPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const price = sessionStorage.getItem("priceId");
  const updatetn = sessionStorage.getItem("updateBtn");

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      if (updatetn) {
        navigate("/dashboard");
      } else if (token && price) {
        navigate("/plan");
      } else {
        navigate("/plans");
      }
    }, 3000);

    sessionStorage.removeItem("checkPage");

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimeout);
    };
  }, [navigate, token, price, updatetn]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>❌</div>
        <h1 className={styles.title}>Payment Cancelled</h1>
        <p className={styles.message}>
          Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
        </p>
        <div className={styles.loader}></div>
      </div>
    </div>
  );
};

export default CancelPage;
