import React from 'react';
import styles from "../HeaderBar/HeaderBar.module.css";
import { useNavigate } from 'react-router-dom';
const HeaderBar = ({ title }) => {
    const navigate=useNavigate()
    const handleBack=()=>{
       navigate(-1)
    }
    return (
        <div>
            <div className={styles.headerMain}>
                <div className={styles.BothFlex}>
                    <div className={styles.backIcon}>
                        <img src='svg/Back-icon.svg' alt='Back-icon'  onClick={handleBack} />
                    </div>
                    <div className={styles.title}>
                        <h2>{title}</h2>
                    </div>
                </div>
                {/* <div className={styles.filterIcon}>
                    <img src='svg/Filter-icon.svg' alt='Filter-icon' />
                </div> */}
            </div>
        </div>
    );
};

export default HeaderBar;
