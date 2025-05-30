import React from 'react'
import styles from '../Loader2/Loader2.module.css'

const Loader2 = () => {
    return (
        <div className={styles.wrap}>
            <div className={styles.ball}></div>
            <div className={styles.ball}></div>
            <div className={styles.ball}></div>
          
        </div>
    )
}

export default Loader2
