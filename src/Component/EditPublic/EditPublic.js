import React, { useState } from 'react';
import styles from '../EditPublic/EditPublic.module.css'
import EditHeader from '../EditHeader/EditHeader'
import SectionHeader from '../SectionHeader/SectionHeader'
import AnimatedButton from '../AnimatedButton/AnimatedButton';




const EditPublic = () => {

  const [hasGMB, setHasGMB] = useState(true);
  const [hasWebsite, setHasWebsite] = useState(true);

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

            <div className={styles.container}>
      <div className={styles.inputSection}>
        <label className={styles.label}>Google My Business</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Type the name of your Business to Search"
          disabled={!hasGMB}
        />
      </div>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={!hasGMB}
            onChange={() => setHasGMB(!hasGMB)}
          />
          <span className={styles.customCheckbox}></span>
          I do not have Google my Business Listing
        </label>

      <hr className={styles.separator} />

      <div className={styles.inputSection}>
        <label className={styles.label}>Website (URL)</label>
        <input
          type="text"
          className={styles.input}
          placeholder="https://Designersx.us"
          disabled={!hasWebsite}
        />
      </div>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={!hasGMB}
            onChange={() => setHasGMB(!hasGMB)}
          />
          <span className={styles.customCheckbox}></span>
          I do not have Google my Business website link 
        </label>



     <div className={styles.stickyWrapper}>
                        <AnimatedButton label="Save" />
                    </div>
          </div>

    

        </>
    )
}

export default EditPublic
