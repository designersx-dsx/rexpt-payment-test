import React from 'react'
import styles from '../SectionHeader/SectionHeader.module.css'

const SectionHeader = ({ heading, subheading, highlight, }) => {
    return (
        <div className={styles.headerWrapper}>
            <h2 className={styles.heading}>{heading}</h2>
              <p className={styles.subheading}>Select the “Services You Offer” for your <text className={styles.higlight}>Restaurant</text> Business</p>
            <div className={styles.tooltipIcon}>
                <img src='/svg/informtion-icon.svg' alt='informtion-icon' />
            </div>
        </div>
    )
}

export default SectionHeader
