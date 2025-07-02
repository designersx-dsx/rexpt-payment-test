import React, { useState } from 'react';
import styles from './EditBusinessDetail.module.css'
import EditHeader from '../EditHeader/EditHeader'
import SectionHeader from '../SectionHeader/SectionHeader'
import AnimatedButton from '../AnimatedButton/AnimatedButton';




const EditBusinessDetail = () => {

 
    return (
        <>
            <EditHeader title='Edit Agent ' agentName='Sofia' />
            <div className={styles.Maindiv}>
                <SectionHeader
                    heading="Business Details"
                    subheading="Verify or Update your Business Details we got from your public listings"
                    highlight=""
                />

            </div>

            <div className={styles.container}>
      <div className={styles.inputSection}>
        <label className={styles.label}>Business Name</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Your Business Name"
        
        />
      </div>
      
      <div className={styles.inputSection}>
        <label className={styles.label}>Phone Number</label>
        <input
          type="text"
          className={styles.input}
          placeholder="88XX 77X X55"
         
        />
      </div>

      <div className={styles.inputSection}>
        <label className={styles.label}>Address</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Your Business Location "
         
        />
      </div>

      <div className={styles.inputSection}>
        <label className={styles.label}>Business Email</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Business Email Address"
         
        />
      </div>

      <div className={styles.inputSection}>
        <label className={styles.label}>Business Intro for Your Agent to know</label>
        <textarea  rows="3" cols="50"  className={styles.textarea}
          placeholder="Write an Intro for your Business here"
         
        > </textarea>
      </div>



       

     <div className={styles.stickyWrapper}>
                        <AnimatedButton label="Save" />
                    </div>
    </div>


        </>
    )
}

export default EditBusinessDetail
