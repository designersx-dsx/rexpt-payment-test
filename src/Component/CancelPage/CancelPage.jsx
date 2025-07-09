import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CancelPage.module.css";

const CancelPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const price = sessionStorage.getItem("priceId")

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token && price) {
        navigate("/plan"); // 👈 Change if needed
      } else {
        navigate("/plans");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>❌</div>
        <h1 className={styles.title}>Payment Cancelled</h1>
        <p className={styles.message}>Redirecting in 5 seconds...</p>
        <div className={styles.loader}></div>
      </div>
    </div>
  );
};

export default CancelPage;
