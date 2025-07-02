import React from 'react';
import styles from '../EditHeader/EditHeader.module.css';

const EditHeader = ({ title, agentName, }) => {
    return (
        <div className={styles.forSticky}>
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
