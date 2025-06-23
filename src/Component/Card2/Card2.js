import React from 'react'
import styles from '../Card2/Card2.module.css'

const Card2 = () => {
    return (
        <div className={styles.CardMain}>
            <h2 className={styles.title}>Knowledge Base</h2>
            <div className={styles.MoreDetails}>

                <h3>More Details</h3>

                <div className={styles.details}>
                    <p className={styles.Ptext}>Google my Business</p>
                    <div className={styles.rightpart}>
                        <strong>A2Z Gym</strong>
                    </div>
                </div>
                <div className={styles.details}>
                    <p className={styles.Ptext}>URL(website)</p>
                    <div className={styles.rightpart}>
                        <strong>A2Zgym.com </strong>
                    </div>
                </div>

                <div className={styles.details}>
                    <p className={styles.Ptext}>Services</p>
                    <div className={styles.rightpart}>
                        <strong>Self Trainer, Diet Plan</strong>
                    </div>
                </div>
                <div className={styles.details}>
                    <p className={styles.Ptext}>Address 1</p>
                    <div className={styles.rightpart}>
                        <strong>575c,sector 5 </strong>
                    </div>
                </div>
                <div className={styles.details}>
                    <p className={styles.Ptext}>Address 2</p>

                    <div className={styles.rightpart}>
                        <strong>kurukshetr, Haryana</strong>
                    </div>
                </div>
                <div className={styles.About}>
                    <h3>Knowledge base description</h3>
                    <p>The Knowledge Base section displays essential business details such as the Google My Business name, website URL, services offered, and address. It helps users quickly understand and verify the business information provided by the agent.</p>
                </div>
            </div>
        </div>
    )
}

export default Card2
