import React from 'react'
import styles from '../Refferal/Refferal.module.css'

const Refferal = () => {
    return (
        <div className={styles.Refferalinfo}>
            <div className={styles.headerPart}>
                <h3>Earn 10% Referral Commission</h3>
            </div>
            <div className={styles.card}>
                <label className={styles.checkboxLabel}>
                    Show Referral link on Dashboard
                    <input type="checkbox" className={styles.customCheckbox} />
                </label>

                <div className={styles.linkSection}>
                    <p className={styles.label}>Referral Link</p>
                    <div className={styles.linkDiv}>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                value="https://rexpt.in/Anubhav-8BY472"
                                readOnly
                                className={styles.input}
                            />

                        </div>
                        <button className={styles.copyButton}>
                            <img src="/svg/copy-icon.svg" alt="Copy" />
                        </button>
                    </div>

                </div>

                <hr className={styles.divider} />

                <div className={styles.infoSection}>
                    <div className={styles.Linkdec}>
                        <img src='/svg/earn-icon.svg' alt='earn-icon' />
                        <p>Share your referral link and <b>earn 10% commission</b> of your friends’ spending.</p>
                    </div>
                    <div className={styles.Linkdec}>
                        <img src='/svg/commission-icon.svg' alt='commission-icon' />
                        <p>You will earn “Commission” every month for upto <b>12 months</b> or Customer Lifespan(Whichever is lower) </p>
                    </div>
                    <div className={styles.Linkdec}>
                        <img src='/svg/commission-icon.svg' alt='commission-icon' />
                        <p>We pay “Referral Commission” to our affiliate partners on <b>1st Day of every following month.</b></p>
                    </div>
                </div>

                <div className={styles.btnTheme}>
                    <div className={styles.imageWrapper}>
                        <img src="svg/svg-theme2.svg" alt="" />
                    </div>
                    <p>
                        Share Referral Link
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Refferal
