import React from 'react'
import styles from '../../Component/CallTransfer/CallTransfer.module.css'
import HeaderBar from '../HeaderBar/HeaderBar'

function CallTransfer() {
    return (
        <>
            <HeaderBar title="Dynamic Call Transfer" />

            <div className={styles.CallTransferMain}>
                <div className={styles.headrPart}>
                    <h2>Call Transfer Condition</h2>
                    <img src='svg/Add-icon.svg' alt='Add-icon' />
                </div>
                <div className={styles.card}>
                    <label className={styles.label}>Condition for Agent to follow</label>
                    <select className={styles.select}>
                        <option>Forward when busy</option>
                        <option>Forward when no answer</option>
                        <option>Always forward</option>
                    </select>

                    <label className={styles.label}>Forward to</label>
                    <div className={styles.phoneInput}>
                        <div className={styles.countryCode}>
                            <img src="svg/india-Flag.svg" alt="flag" />
                            <span>+91</span>
                        </div>
                        <span className={styles.phoneNumber}>985 XXX 88XX</span>
                    </div>
                </div>

            </div>
        </>

    )
}

export default CallTransfer
