import React from 'react';
import styles from '../EditHeader/EditHeader.module.css';
import { useNavigate } from 'react-router-dom';

const EditHeader = ({ title, agentName, }) => {
    const navigate=useNavigate();
    return (
        <div className={styles.forSticky} onClick={()=>navigate(-1)}>
            <div className={styles.title}>
                <img
                    src='/svg/back-svg.svg'
                    alt='back-svg'
                    className={styles.backIcon}
                />
                <h2 >
                    <span className={styles.back}></span> {title}: <b>{agentName}</b>
                </h2>
            </div>
        </div>
    );
};

export default EditHeader;
