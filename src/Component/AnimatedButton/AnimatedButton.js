import React, { useRef } from 'react';
import styles from "../AnimatedButton/AnimatedButton.module.css";

const AnimatedButton = ({ label = 'Save' }) => {
  const imgRef = useRef(null);
  const textRef = useRef(null);

  const handleZoomAnimation = () => {
    const img = imgRef.current;
    const text = textRef.current;

    if (!img || !text) return;

    // Remove & re-add class to re-trigger animation
    [img, text].forEach((el) => {
      el.classList.remove(styles.zoomAnimate);
      void el.offsetWidth;
      el.classList.add(styles.zoomAnimate);
    });
  };

  return (
    <div className={styles.btnFix}>
      <div
        className={styles.btnTheme}
        onMouseEnter={handleZoomAnimation}
        onTouchStart={handleZoomAnimation}
      >
        <img
          src="svg/svg-theme2.svg"
          alt="button-bg"
          ref={imgRef}
        />
        <p ref={textRef}>{label}</p>
      </div>
    </div>
  );
};

export default AnimatedButton;
