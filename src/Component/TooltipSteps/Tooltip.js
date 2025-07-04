import React, { useState, useRef, useEffect } from "react";
import styles from "../TooltipSteps/Tooltip.module.css";

const Tooltip = ({ content }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState("top"); // default top
  const iconRef = useRef(null);
  const tooltipRef = useRef(null);

  const images = [
    "/svg/informtion-icon.svg",
    "/svg/informtion-icon 2.svg"
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fading, setFading] = useState(false);

  // Auto-change icon
  useEffect(() => {
    if (showTooltip) return;

    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFading(false);
      }, 500);
    }, 1500);

    return () => clearInterval(interval);
  }, [showTooltip]);

  // Handle tooltip position on scroll ONLY after open
  useEffect(() => {
    const handleScroll = () => {
      if (!iconRef.current) return;

      const rect = iconRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      // Shift to bottom only if not enough space above
      if (spaceAbove < 90 && spaceBelow > 90) {
        setTooltipPosition("bottom");
      } else {
        setTooltipPosition("top"); // stay top if enough space
      }
    };

    if (showTooltip) {
      window.addEventListener("scroll", handleScroll, true);
      // Run once on open
      handleScroll();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showTooltip]);

  const handleClickOutside = (event) => {
    if (
      tooltipRef.current &&
      !tooltipRef.current.contains(event.target) &&
      !iconRef.current.contains(event.target)
    ) {
      setShowTooltip(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleIconClick = () => {
    setShowTooltip((prev) => !prev);
  };

  return (
    <div className={styles.tooltipWrapper}>
      <div className={styles.tooltipIcon} onClick={handleIconClick} ref={iconRef}>
        {showTooltip && (
          <div
            className={`${styles.tooltipBox} ${tooltipPosition === "bottom" ? styles.bottom : styles.top
              }`}
            ref={tooltipRef}
          >
            <p className={styles.tooltipTitle}>
               {content}
            </p>
            <div
              className={`${styles.bubbleGroup} ${tooltipPosition === "bottom" ? styles.bubbleTop : styles.bubbleBottom
                }`}
            >
              <div className={styles.bigBubble}></div>
              <div
                className={`${styles.smallBubble} ${tooltipPosition === "bottom" ? styles.bottomDot : ""
                  }`}
              />
            </div>
          </div>
        )}
        <img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt="info"
          className={`${styles.fadeImage} ${fading ? styles.fadeOut : ""}`}
        />
      </div>
    </div>
  );
};

export default Tooltip;
