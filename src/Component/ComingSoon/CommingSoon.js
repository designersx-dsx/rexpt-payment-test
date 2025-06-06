import React, { useEffect } from 'react';
import styles from '../ComingSoon/CommingSoon.module.css';

const CommingSoon = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.message}> Coming </h2>
        <h1 className={styles.message2}>Soon</h1>
        <button onClick={onClose} className={styles.closeBtn}>CLOSE</button>
      </div>
    </div>
  );
};

export default CommingSoon;
