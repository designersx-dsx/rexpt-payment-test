import React, { useState } from 'react';
import styles from '../Details/Details.module.css';
import { useNavigate } from 'react-router-dom';

const Details = () => {
    const navigate = useNavigate();
    const [startExit, setStartExit] = useState(false);

    const handleLoginClick = () => {
        setStartExit(true);
        setTimeout(() => {
            navigate('/business-details');
        }, 2000);
    };

    return (
        <div className={styles.pageWrapper}>
     
            <div className={styles.mask}>
                <img src='images/Mask.png' alt='Mask' />
            </div>

            <div className={styles.logimg}>
                <img className={styles.logo} src='images/Rexpt-Logo.png' alt='Rexpt-Logo' />
            </div>

    
            <div className={`${styles.Maincontent} ${startExit ? styles.fadeOut3 : ''}`}>
                <div className={styles.welcomeTitle}>
                    <h1>Personal Details</h1>
                </div>
            </div>

            <div className={`${styles.container} ${startExit ? styles.fadeOut3 : ''}`}>
                <label className={styles.label}>Name</label>
                <input type="text" className={styles.input} placeholder="Your name" />

                <label className={styles.label}>Phone Number</label>
                <input type="tel" className={styles.input} placeholder="Phone number" />
            </div>

            <p className={`${styles.codeText} ${startExit ? styles.fadeOut2 : ''}`}>Enter the send code</p>

            <div className={`${styles.otpContainer} ${startExit ? styles.fadeOut2 : ''}`}>
                {[...Array(6)].map((_, i) => (
                    <input key={i} maxLength="1" className={styles.otpInput} />
                ))}
            </div>

            <div className={`${styles.Btn} ${startExit ? styles.fadeOut1 : ''}`} onClick={handleLoginClick}>
                <button type="submit">
                    Login
                    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="..." fill="white" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Details;
