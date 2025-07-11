import React,{useState} from 'react'

import EditHeader from '../EditHeader/EditHeader'
import SectionHeader from '../SectionHeader/SectionHeader'
import SelectNameAvatar from "./Step3/Step3"
import styles from "./EditNameAvtar.module.css"
import AnimatedButton from '../AnimatedButton/AnimatedButton'
import { useAgentCreator } from '../../hooks/useAgentCreator'
import decodeToken from '../../lib/decodeToken'
import { useNavigate } from 'react-router-dom'
import PopUp from '../Popup/Popup'
import { useDashboardStore } from '../../Store/agentZustandStore'

function EditNameAvtar() {
        const [showPopup, setShowPopup] = useState(false);
        const [popupType, setPopupType] = useState(null);
        const [popupMessage, setPopupMessage] = useState("");
        const [Loading, setLoading] = useState(null);
        const navigate=useNavigate();
        const { setHasFetched } =    useDashboardStore() 

        const token = localStorage.getItem("token");
        const decodeTokenData = decodeToken(token);
        const userId = decodeTokenData?.id;
        const agentnm=sessionStorage.getItem("agentName");
    
        const { handleCreateAgent } = useAgentCreator({
        stepValidator: () => "EditNameAvtar",
        setLoading,
        setPopupMessage,
        setPopupType,
        setShowPopup,
        navigate,
        setHasFetched,
      });

      
  const handleClick=()=>{
    if(!sessionStorage.getItem('avatar')){
      setPopupType("failed");
      setPopupMessage("Please select a Agent Avtar!");
      setShowPopup(true);
      return;
    }else{
          handleCreateAgent();
    }
  }
  
  return (
    <div>
        

            <EditHeader title='Edit Agent ' agentName={agentnm} />
            <div className={styles.Maindiv}>
                <SectionHeader
                    heading="Name & Avatar"
                    subheading="Choose the Name & Looks of your agent"
                    highlight=""
                />
                </div>


                <div className={styles.container}>
                <SelectNameAvatar/>


                 <div className={styles.stickyWrapper} onClick={handleClick}>
                        <AnimatedButton label="Save" isLoading={Loading} />
                    </div>



                </div>

            {showPopup && (
            <PopUp
            type={popupType}
            onClose={() => setShowPopup(false)}
            message={popupMessage}
            onConfirm={()=>{}}
            />
        )}
    </div>
  )
}

export default EditNameAvtar