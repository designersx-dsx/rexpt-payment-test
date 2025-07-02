import React from 'react'

import EditHeader from '../EditHeader/EditHeader'
import SectionHeader from '../SectionHeader/SectionHeader'
import SelectNameAvatar from "./Step3/Step3"
import styles from "./EditNameAvtar.module.css"
import AnimatedButton from '../AnimatedButton/AnimatedButton'

function EditNameAvtar() {
  return (
    <div>
        

 <EditHeader title='Edit Agent ' agentName='Sofia' />
            <div className={styles.Maindiv}>
                <SectionHeader
                    heading="Name & Avatar"
                    subheading="Choose the Name & Looks of your agent"
                    highlight=""
                />
                </div>


                <div className={styles.container}>
<SelectNameAvatar/>


                 <div className={styles.stickyWrapper}>
                        <AnimatedButton label="Save" />
                    </div>



                </div>

        
    </div>
  )
}

export default EditNameAvtar