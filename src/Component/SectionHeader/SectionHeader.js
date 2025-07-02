import React from 'react'
import styles from '../SectionHeader/SectionHeader.module.css'
import Tooltip from '../TooltipSteps/Tooltip'

const SectionHeader = ({ heading, subheading, highlight, }) => {
    return (
        <div className={styles.headerWrapper}>
            <h2 className={styles.heading}>{heading}</h2>
            <p className={styles.subheading}>{subheading}</p>
            <div className={styles.tooltipIcon}>
                <img src='/svg/informtion-icon.svg' alt='informtion-icon' />
            </div>
        </div>
    )
}

export default SectionHeader
