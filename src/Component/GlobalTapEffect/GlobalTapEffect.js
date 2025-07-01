import React, { useEffect } from 'react';
import styles from '../GlobalTapEffect/GlobalTapEffect.module.css';

const GlobalTapEffect = () => {
  useEffect(() => {
    const handleClick = (e) => {
      // ✅ Check if clicked element or parent has click event
      let el = e.target;

      // Traverse up to 3 levels to find any element with onClick or role="button"
      for (let i = 0; i < 3 && el; i++) {
        const hasPointer = getComputedStyle(el).cursor === 'pointer';
        const hasClickHandler = el.getAttribute('onclick') !== null || el.hasAttribute('role') || hasPointer;

        if (hasClickHandler) {
          const ripple = document.createElement('div');
          ripple.className = styles.tapRipple;
          ripple.style.left = `${e.clientX - 15}px`;
          ripple.style.top = `${e.clientY - 15}px`;
          document.body.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
          break;
        }

        el = el.parentElement;
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
};

export default GlobalTapEffect;
