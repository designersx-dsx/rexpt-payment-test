import React, { useState, useRef, useEffect } from "react";
import styles from "../TooltipSteps/Tooltip.module.css";

const Tooltip = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const iconRef = useRef(null);
  const tooltipRef = useRef(null);

  // Image cycling
  const images = [
    "/svg/informtion-icon.svg",    
    "/svg/informtion-icon 2.svg"
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Change every 1 second

    return () => clearInterval(interval);
  }, []);

  const handleClickOutside = (event) => {
    if (
      tooltipRef.current &&
      !tooltipRef.current.contains(event.target) &&
      !iconRef.current.contains(event.target)
    ) {
      setShowTooltip(false);
    }
  };

  const handleIconClick = () => {
    setShowTooltip((prev) => !prev);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.tooltipWrapper}>
      <div className={styles.tooltipIcon} onClick={handleIconClick} ref={iconRef}>
        {showTooltip && (
          <div className={styles.tooltipBox} ref={tooltipRef}>
            <p className={styles.tooltipTitle}>
              Pick a voice style and gender to shape your agent's identity.
            </p>
           
            <div className={styles.bubbleGroup}>
              <div className={styles.bigBubble}></div>
              <div className={styles.smallBubble}></div>
            </div>
          </div>
        )}
       <img
  key={currentImageIndex}
  src={images[currentImageIndex]}
  alt="info"
  className={styles.fadeImage}
/>
      </div>
    </div>
  );
};

export default Tooltip;
