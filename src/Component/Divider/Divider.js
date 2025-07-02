import React from 'react'
import styles from '../Divider/Divider.module.css'

const Divider = ({ label }) => {
    return (
        <div className={styles.divider}>
            <hr className={styles.line} />
            <span className={styles.text}>{label}</span>
            <hr className={styles.line} />
        </div>
    )
}

export default Divider
