import React,{useState} from "react";
import styles from "../Footer/Footer2.module.css"

const Footer2 = () => {
    const [activeTab, setActiveTab] = useState("home");
  return (
    <div>
      <div className={styles.navbar}>
        <button
          className={`${styles.tab} ${
            activeTab === "home" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("home")}
        >
          <span className={styles.icon}>🏠</span>
        </button>

        <button
          className={`${styles.tab} ${
            activeTab === "calendar" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("calendar")}
        >
          <span className={styles.icon}>📅</span>
        </button>

        <div className={styles.createWrapper}>
          <button className={styles.createBtn}>
            <span className={styles.createIcon}>＋</span>
            <span className={styles.createText}>Create</span>
          </button>
        </div>

        <button
          className={`${styles.tab} ${
            activeTab === "info" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("info")}
        >
          <span className={styles.icon}>💬</span>
        </button>
      </div>
    </div>
  );
};

export default Footer2;