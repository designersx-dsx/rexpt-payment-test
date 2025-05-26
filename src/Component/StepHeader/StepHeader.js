import React from 'react'
import styles from '../StepHeader/StepHeader.module.css'

const StepHeader = ({title}) => {
  return (
       <div className={styles.LogoDiv}>
            <div className={styles.logo}>
                <img src="/images/stepmask.png" alt="stepmask" />
                <img src="/images/inlogo.png" alt="inlogo" className={styles.inlogo} />
            </div>
            <h2 className={styles.heading}>{title}</h2>
        </div>
  )
}

export default StepHeader
