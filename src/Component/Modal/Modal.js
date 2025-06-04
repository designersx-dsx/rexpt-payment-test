import React, { useEffect, useState } from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, children }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

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
      setShouldRender(false);
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <div className={styles.backdrop} >
      <div
        className={`${styles.modalContainer} ${isClosing ? styles.slideDown : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modal}>
          <button className={styles.closeBtn} onClick={handleClose}>
            <img src='images/cross-icon.png' alt='cross-icon' />
          </button>
          {children}
        </div>
        <div className={styles.notch}></div>
      </div>
    </div>
  );
};

export default Modal;
