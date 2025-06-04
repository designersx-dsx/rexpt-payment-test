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
                    <div className={styles.selectWrapper}>
                        <label className={styles.label}>Condition for Agent to follow</label>
                        <select className={styles.select}>
                            <option>Forward when busy</option>
                            <option>Forward when no answer</option>
                            <option>Always forward</option>
                        </select>
                        <img
                            src="svg/select-arrow.svg"
                            alt="arrow"
                            className={styles.arrowIcon}
                        />
                    </div>

                    <label className={styles.label}>Forward to</label>
                    <div className={styles.phoneInput}>
                        <div className={styles.countryCode}>
                            <img src="svg/india-Flag.svg" alt="flag" />
                            <span>+91</span>
                        </div>
                        <input
                            type="tel"
                            className={styles.phoneNumberInput}
                            placeholder="985 XXX 88XX"
                        />
                    </div>
                </div>
                <div className={styles.Btn} >
                    <div type="submit">
                        <div className={styles.btnTheme}>
                            <img src="svg/svg-theme2.svg" alt="" />
                            <p>
                                Submit
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default CallTransfer
