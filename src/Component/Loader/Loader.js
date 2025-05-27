import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ size = 60 }) => {
  return (
    <div className={styles.overlay}>
      <div
        className={styles.circle}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${size / 16}px`,
        }}
      ></div>
    </div>
  );
};

export default Loader;
