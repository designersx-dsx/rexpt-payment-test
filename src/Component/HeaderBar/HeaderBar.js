import React from 'react';
import styles from "../HeaderBar/HeaderBar.module.css";

const HeaderBar = ({ title }) => {
    return (
        <div>
            <div className={styles.headerMain}>
                <div className={styles.BothFlex}>
                    <div className={styles.backIcon}>
                        <img src='svg/Back-icon.svg' alt='Back-icon' />
                    </div>
                    <div className={styles.title}>
                        <h2>{title}</h2>
                    </div>
                </div>
                <div className={styles.filterIcon}>
                    <img src='svg/Filter-icon.svg' alt='Filter-icon' />
                </div>
            </div>
        </div>
    );
};

export default HeaderBar;
