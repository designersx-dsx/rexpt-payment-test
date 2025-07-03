import React,{useState} from 'react'
import EditHeader from '../EditHeader/EditHeader'
import SectionHeader from '../SectionHeader/SectionHeader'
import styles from "./EditGender.module.css"
import SelectGender from "./Step2/Step2"
import AnimatedButton from "../AnimatedButton/AnimatedButton"
import { useAgentCreator } from '../../hooks/useAgentCreator'
import decodeToken from '../../lib/decodeToken'
import { useNavigate } from 'react-router-dom'
import PopUp from '../Popup/Popup'


function EditGender() {
      const [showPopup, setShowPopup] = useState(false);
      const [popupType, setPopupType] = useState(null);
      const [popupMessage, setPopupMessage] = useState("");
      const [Loading, setLoading] = useState(null);
      const navigate=useNavigate();
      const setHasFetched=true;
      const token = localStorage.getItem("token");
      const decodeTokenData = decodeToken(token);
      const userId = decodeTokenData?.id;
      const agentnm=sessionStorage.getItem("agentName");

      const { handleCreateAgent } = useAgentCreator({
      stepValidator: () => "EditGender",
      setLoading,
      setPopupMessage,
      setPopupType,
      setShowPopup,
      navigate,
      setHasFetched,
    });
  
    const handleClick=()=>{
      handleCreateAgent();
    }

  return (
    <div>
        
            <EditHeader title='Edit Agent ' agentName={agentnm} />
            <div className={styles.Maindiv}>
                <SectionHeader
                    heading="Select Gender"
                    subheading="Select the gender of your AI receptionist for your Business"
                    highlight=""
                />


                <div className={styles.container}>

        <SelectGender/>

                </div>

                 <div className={styles.stickyWrapper} onClick={handleClick} >
                  <AnimatedButton label="Save" isLoading={Loading}/>
                  </div>
            </div>
        {showPopup && (
            <PopUp
            type={popupType}
            onClose={()=>{}}
            message={popupMessage}
            onConfirm={()=>navigate('/edit-services-offered')}
            />
        )}
    </div>
  )
}

export default EditGender