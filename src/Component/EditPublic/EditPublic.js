import React from 'react'
import styles from '../EditPublic/EditPublic.module.css'
import EditHeader from '../EditHeader/EditHeader'
import SectionHeader from '../SectionHeader/SectionHeader'

const EditPublic = () => {
    return (
        <>
            <EditHeader title='Edit Agent ' agentName='Sofia' />
            <div className={styles.Maindiv}>
                <SectionHeader
                    heading="Public Listing"
                    subheading="Enter your Google My Business Listing & Website"
                    highlight=""
                />

            </div>

        </>
    )
}

export default EditPublic
