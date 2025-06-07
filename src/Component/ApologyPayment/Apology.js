import React, { useEffect } from 'react';
import styles from '../ComingSoon/CommingSoon.module.css';
import { useNavigate } from 'react-router-dom';

const CommingSoon = ({ show, onClose }) => {
    let naviagte = useNavigate()
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
        <h4 className={styles.message}> Coming Soon </h4>
        <p className={styles.message2}></p>
        <button onClick={()=>naviagte('/signup')} className={styles.closeBtn}>Continue with Free</button>
      </div>
    </div>
  );
};

export default CommingSoon;
