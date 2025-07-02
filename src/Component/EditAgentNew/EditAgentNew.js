import React from 'react'
import styles from '../EditAgentNew/EditAgentNew.module.css'
import EditHeader from '../EditHeader/EditHeader';

const EditAgentNew = () => {
    const steps = [
        {
            number: 1,
            title: 'Business Type',
            desc: 'Edit Business List, Business Size.',
            active: true,
        },
        {
            number: 2,
            title: 'Services Offered',
            desc: 'Edit: Business Services & More.',
        },
        {
            number: 3,
            title: 'Public Listing',
            desc: 'Edit: Google listing, Website URL.',
        },
        {
            number: 4,
            title: 'Business Details',
            desc: 'Edit: Name, Email, Phone Nu...',
        },
        {
            number: 5,
            title: 'Agent Language',
            desc: 'Edit: Language.',
        },
        {
            number: 6,
            title: 'Agent Gender',
            desc: 'Edit: Gender, Voice.',
        },
        {
            number: 7,
            title: 'Name & Avatar',
            desc: 'Edit: Name, Avtar, Type.',
        },
    ];
    return (
        <div>
            <EditHeader title='Agent name' agentName='sofia' />
            <div className={styles.wrapper}>
                <div className={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.card}>
                            <span className={styles.stepNumber}>{step.number}</span>
                            <div className={styles.content}>
                                <h4>{step.title}</h4>
                                <p>{step.desc}</p>
                            </div>
                            <div className={styles.icon}>
                                <img src="/svg/edit-svg2.svg" alt="Edit" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EditAgentNew
