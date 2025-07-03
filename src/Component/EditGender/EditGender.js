import React from 'react'
import EditHeader from '../EditHeader/EditHeader'
import SectionHeader from '../SectionHeader/SectionHeader'
import styles from "./EditGender.module.css"
import SelectGender from "./Step2/Step2"
import AnimatedButton from "../AnimatedButton/AnimatedButton"


function EditGender() {
  return (
    <div>
        
   <EditHeader title='Edit Agent ' agentName='Sofia' />
            <div className={styles.Maindiv}>
                <SectionHeader
                    heading="Select Gender"
                    subheading="Select the gender of your AI receptionist for your Business"
                    highlight=""
                />


                <div className={styles.container}>

<SelectGender/>

                </div>

                 <div className={styles.stickyWrapper}>
                                        <AnimatedButton label="Save" />
                                    </div>
            </div>

    </div>
  )
}

export default EditGender