import React from 'react';
import styles from "../HeaderBar/HeaderBar.module.css";
import { useNavigate } from 'react-router-dom';

const HeaderBar = ({ title, subtitle, dropdownOptions = [], onDropdownChange }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.headerMain}>
      <div className={styles.BothFlex}>
        <div className={styles.backIcon}>
          <img src='svg/Back-icon.svg' alt='Back-icon' onClick={handleBack} />
        </div>

        <div className={styles.titleWrapper}>
          <div className={styles.title}>
            {subtitle && <h6>{subtitle}</h6>}
            <h2>{title}</h2>
          </div>

          {dropdownOptions.length > 0 && (
            <select
              className={styles.dropdown}
              onChange={(e) => onDropdownChange?.(e.target.value)}
            >
              {dropdownOptions.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
