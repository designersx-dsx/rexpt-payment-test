import React, { useState, useEffect } from 'react';
import styles from '../ModalChat/ModalChat.module.css';

const ModalChat = ({ isOpen2, onClose2, children }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen2) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else if (shouldRender) {
      setIsClosing(true);
      document.body.style.overflow = 'auto';

      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen2, shouldRender]);

  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', escHandler);
    return () => document.removeEventListener('keydown', escHandler);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose2(); // set isOpen2 = false from parent
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div
        className={`${styles.modalContainer} ${isClosing ? styles.slideDown : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modal}>
          <button className={styles.closeBtn} onClick={handleClose}>
            <img src="images/cross-icon.png" alt="cross-icon" />
          </button>
          {children}
        </div>
        <div className={styles.notch}></div>
      </div>
    </div>
  );
};

export default ModalChat;
