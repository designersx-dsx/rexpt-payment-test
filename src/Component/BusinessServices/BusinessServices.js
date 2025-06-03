import React from 'react'
import styles from '../BusinessServices/BusinessServices.module.css'

const businessOptions = [
    {
        icon: 'images/general.png',
        alt: 'Restaurant icon',
        title: 'Restaurant',
        subtype: 'Your Journey Begins Here',
        value: 'Restaurant',
    },
    {
        icon: 'images/school.png',
        alt: 'Real Estate Broker icon',
        title: 'Real Estate Broker',
        subtype: 'Your Journey Begins Here',
        value: 'Real Estate Broker',
    },
    {
        icon: 'images/other.png',
        alt: 'Salon icon',
        title: 'Salon',
        subtype: 'Your Journey Begins Here',
        value: 'Salon',
    },
    {
        icon: 'images/other.png',
        alt: 'Salon icon',
        title: 'Salon',
        subtype: 'Your Journey Begins Here',
        value: 'Salon',
    },
    {
        icon: 'images/other.png',
        alt: 'Salon icon',
        title: 'other',
        subtype: 'Your Journey Begins Here',
        value: 'Salon',
    },
]

const BusinessServices = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Business Services</h1>

            <div className={styles.searchBox}>
                <span className={styles.searchIcon}>
                    <img src="svg/Search-Icon.svg" alt="Search icon" />
                </span>
                <input
                    type="text"
                    placeholder="Quick find Business type"
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.optionList}>
                {businessOptions.map((option, index) => (
                    <label className={styles.option} key={index}>
                        <div className={styles.forflex}>
                            <div className={styles.icon}>
                                <img
                                    src={option.icon}
                                    alt={option.alt}
                                    className={styles.iconImg}
                                />
                            </div>
                            <div>
                                <strong>{option.title}</strong>
                                <p className={styles.subType}>{option.subtype}</p>
                            </div>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="businessType"
                                value={option.value}
                            />
                        </div>
                    </label>
                ))}
            </div>
            <div className={styles.labReq}>
                <div className={styles.inputGroup}>
                    <div className={styles.Dblock}>
                        <label>Email Address<span className={styles.requiredField}> *</span></label>
                        <input
                            type="text"
                            placeholder="Business Email Address"
                            value=''
                        />
                    </div>
                </div>
            </div>
            <div >
                <div type="submit">
                    <div className={styles.btnTheme}>
                        <img src="svg/svg-theme.svg" alt="" />
                        <p>Continue</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BusinessServices
