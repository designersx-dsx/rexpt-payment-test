import React from 'react'
import EditHeader from '../EditHeader/EditHeader'
import SectionHeader from '../SectionHeader/SectionHeader'
import styles from "./EditLanguage.module.css"
import SelectLauguage from "./Step1/Step1";
import AnimatedButton from '../AnimatedButton/AnimatedButton'


function EditLanguage() {

  const handleClick=()=>{
    
  }
  return (
    <div>
        
   <EditHeader title='Edit Agent ' agentName='Sofia' />
            <div className={styles.Maindiv}>
                <SectionHeader
                    heading="Select Language"
                    subheading="Select the Primary Language, You want your agent to speak"
                    highlight=""
                />

            </div>

            <div className={styles.container}>

          <SelectLauguage />
</div>

    <div className={styles.stickyWrapper} >
      <AnimatedButton label="Save" />
    </div>

    </div>
  )
}

export default EditLanguage