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
import { useDashboardStore } from '../../Store/agentZustandStore'


function EditGender() {
      const [showPopup, setShowPopup] = useState(false);
      const [popupType, setPopupType] = useState(null);
      const [popupMessage, setPopupMessage] = useState("");
      const [Loading, setLoading] = useState(null);
      const navigate=useNavigate();
      // const setHasFetched=true;
      const token = localStorage.getItem("token");
      const decodeTokenData = decodeToken(token);
      const userId = decodeTokenData?.id;
      const agentnm=sessionStorage.getItem("agentName");
      const { setHasFetched } =    useDashboardStore(); 

      const { handleCreateAgent } = useAgentCreator({
      stepValidator: () => "EditGender",
      setLoading,
      setPopupMessage,
      setPopupType,
      setShowPopup,
      navigate,
      setHasFetched,
    });
const [stepValidation, setStepValidation] = useState({
  genderChanged: false,
  voiceSelected: false,
});

  
const handleValidationChange = (validation) => {
  setStepValidation(validation);
};
    // const handleClick=()=>{
    //     const storedGender = localStorage.getItem("agentGender");
    //    const  prevAgentGender=sessionStorage.getItem('prevAgentGender')
    //    if(storedGender.toLocaleLowerCase()!=prevAgentGender.toLocaleLowerCase()){
    //   setPopupType("confirm");
    //   setPopupMessage("Agent Gender Changed Would you like to Update Agent Avtar?" );
    //   setShowPopup(true);
    //    }
    //   else{
    //   handleCreateAgent();
    //   }
    // }
  const handleClick = () => {
  const storedGender = sessionStorage.getItem("agentGender");
  const prevAgentGender = sessionStorage.getItem('prevAgentGender');
  // console.log(storedGender.toLocaleLowerCase(),prevAgentGender?.toLocaleLowerCase())
  if (storedGender.toLocaleLowerCase() != prevAgentGender?.toLocaleLowerCase() ) {
    if (!stepValidation.voiceSelected) {
      setPopupType("failed");
      setPopupMessage("Please select a voice after changing gender!");
      setShowPopup(true);
      return;
    }
    setPopupType("confirm");
    setPopupMessage("Agent Gender Changed. Would you like to Update Agent Avatar?");
    setShowPopup(true);
    return; // 🔥 Stop further processing

  } else {
    handleCreateAgent();
  }
};

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

               <SelectGender  onValidationChange={handleValidationChange}/>

                </div>

                 <div className={styles.stickyWrapper} onClick={handleClick} >
                  <AnimatedButton label="Save" isLoading={Loading}/>
                  </div>
            </div>
        {showPopup && (
            <PopUp
            type={popupType}
            onClose={()=>{setShowPopup(false)}}
            message={popupMessage}
            onConfirm={ ()=>{sessionStorage.removeItem('avatar'); // 🗑 Remove old avatar
                        setTimeout(() => {
                          navigate('/edit-name-avtar'); // 🔥 Navigate back to avatar screen
                        }, 500);}}
            />
        )}
    </div>
  )
}

export default EditGender