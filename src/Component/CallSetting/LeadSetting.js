import React from 'react';
import styles from "./CallSetting.module.css";

const LeadSetting = () => {
  const reasons = [
    "Spam Calls",
    "Customer For Restaurant (Take away)",
    "Time Waste",
    "Irrelevant"
  ];

  return (
    <div className={styles.leadcontainer}>
      {reasons.map((reason, index) => (
        <div className={styles.reasonItem} key={index}>
          <span className={styles.reasonText}>{reason}</span>
          <div className={styles.actions}>
            <div className={styles.editBtn}>
              <img src="/svg/edit-svg.svg" alt="Edit" />
            </div>
            <div className={styles.deleteBtn}>
              <img src="/svg/delete-icon.svg" alt="Delete" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadSetting;
