import React from 'react'
import styles from '../MySubscription/MySubscription.module.css'

const MySubscription = () => {
    return (

        <div className={styles.cardWrapper}>
            <h3 className={styles.heading}>My Subscriptions</h3>
            <div className={styles.MySubscriptionInfo}>
                <div className={styles.row}>
                    <div className={styles.idDiv}>
                        <p className={styles.label1}>Agent Id:</p>
                        <p className={styles.valueBold}>B99213</p>
                    </div>
                    <div className={styles.statusDiv}>
                        <div className={styles.Dot}></div>
                        <div className={styles.status}>Active</div>
                    </div>


                </div>

                <div className={styles.row2}>
                    <span className={styles.label}>Agent Name</span>
                    <span className={styles.value}>SOFIA</span>
                </div>
                <div className={styles.row2}>
                    <span className={styles.label}>Business Name</span>
                    <span className={styles.value}>ACME Construction Services</span>
                </div>
                <div className={styles.row2}>
                    <span className={styles.label}>Plan Activated</span>
                    <span className={styles.plan}> STARTER</span>
                </div>
                <div className={styles.row2}>
                    <span className={styles.label}>Minutes Remaining</span>
                    <span className={styles.value}>158</span>
                </div>
                <div className={styles.row2}>
                    <span className={styles.label}>Initial Purchase Date</span>
                    <span className={styles.value}>07 Aug 2025</span>
                </div>
                <div className={styles.row2}>
                    <span className={styles.label}>Next Billing Date</span>
                    <span className={styles.valuebilling}>06 Aug 2026</span>
                </div>

                <div className={styles.row2}>
                    <span className={styles.label}>Frequency & Price</span>
                    <span className={styles.frequencyprice}> US $5,9888/year</span>
                </div>







            </div>
        </div>

    )
}

export default MySubscription
