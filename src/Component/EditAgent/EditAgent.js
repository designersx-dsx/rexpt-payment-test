import React, { useEffect, useState } from "react";
import styles from '../EditAgent/EditAgent.module.css'
import { getUserAgentMergedDataForAgentUpdate } from "../../Store/apiStore";
import { useNavigate } from "react-router-dom";

const options = [
    {
        id: "details",
        title: "Business Details",
        description: "Edit name, size, and type.",
        path: "/business-details"
    },
    {
        id: "services",
        title: "Business Services",
        description: "Edit Services List, Email Address.",
        path: "/business-services"
    },
    {
        id: "location",
        title: "Business Location",
        description: "Edit Country, State and City.",
        path: "/business-locations"
    },
    {
        id: "about",
        title: "About Your Business",
        description: "Edit URL, Google Listing.",
        path: "/about-business"
    },
    {
        id: "avatar",
        title: "Agent (Avatar)",
        description: "Edit Language, Gender, etc.",
        path: "/steps"
    },
];

const EditOptions = ({agentDetails}) => {
    const [selected, setSelected] = useState("details");
    const navigate = useNavigate();  // get navigate function
    const handleOptionClick = (option) => {
        setSelected(option.id);
        navigate(option.path);  // navigate to path on click
    };

//       const fetchPrevAgentDEtails=async(agent_id,businessId)=>{
//           try {  
//           const response=await getUserAgentMergedDataForAgentUpdate(agent_id,businessId)
//           console.log('response',response)
//           const agent=response?.data?.agent;
//           const business=response?.data?.business;
          
//         // console.log('agent',agent)
//     sessionStorage.setItem('UpdationMode','ON')
//     sessionStorage.setItem('agentName',agent.agentName)
//     sessionStorage.setItem('agentGender',agent.agentGender)
//     sessionStorage.setItem('agentLanguageCode',agent.agentLanguageCode)
//     sessionStorage.setItem('agentLanguage',agent.agentLanguage)
//     sessionStorage.setItem('llmId',agent.llmId)
//     sessionStorage.setItem('agent_id',agent.agent_id)
//     sessionStorage.setItem('knowledgeBaseId',agent.knowledgeBaseId)

//     //need to clear later
//     localStorage.setItem('UpdationMode','ON')
//     localStorage.setItem('UpdationModeStepWise','ON')
//     localStorage.setItem('agentName',agent.agentName)
//     localStorage.setItem('agentGender',agent.agentGender)
//     localStorage.setItem('agentLanguageCode',agent.agentLanguageCode)
//     localStorage.setItem('agentLanguage',agent.agentLanguage)
//     localStorage.setItem('llmId',agent.llmId)
//     localStorage.setItem('agent_id',agent.agent_id)
//     localStorage.setItem('knowledgeBaseId',agent.knowledgeBaseId)
//     localStorage.setItem('agentRole',agent.agentRole)
//     localStorage.setItem('agentVoice',agent.agentVoice)
//     localStorage.setItem('agentVoiceAccent',agent.agentAccent)
//     localStorage.setItem('avatar',agent.avatar)
//     sessionStorage.setItem("googleListing",business.googleUrl)
//     sessionStorage.getItem("displayBusinessName",);
//     localStorage.setItem('googleUrl',business.googleUrl)
//     localStorage.setItem('webUrl',business.webUrl)
//     localStorage.setItem('aboutBusiness',business.aboutBusiness)
//     localStorage.setItem('additionalInstruction',business.additionalInstruction)
//     localStorage.setItem('knowledge_base_name',business.knowledge_base_name)
//     localStorage.setItem('knowledge_base_id',business.knowledge_base_id)
//     //need to clear above

//     sessionStorage.setItem(
//     "aboutBusinessForm",
//     JSON.stringify({
//       businessUrl:business.webUrl,
//       googleListing:business.googleUrl,
//       aboutBusiness:business.aboutBusiness,
//       note:business.additionalInstruction,
//     }))

//     sessionStorage.setItem('agentRole',agent.agentRole)
//     sessionStorage.setItem('agentVoice',agent.agentVoice)
//     sessionStorage.setItem('agentVoiceAccent',agent.agentAccent)
//     sessionStorage.setItem('avatar',agent.avatar)
//     sessionStorage.setItem('businessDetails',agent.business)
//     sessionStorage.setItem('businessId',agent.businessId)
        
//       const businessData = {
//       userId:business.userId  ,
//       businessType:business.businessType,
//       businessName: business.businessName.trim(),
//       businessSize:business.businessSize,
//     };

  
//     sessionStorage.setItem("businesServices",JSON.stringify({
//        selectedService:business.buisnessService,
//         email:business.buisnessEmail
//     }))

//     sessionStorage.setItem("businessDetails", JSON.stringify(businessData));
//     sessionStorage.setItem('businessLocation',  JSON.stringify({
//     country: business?.country,
//     state: business?.state.trim(),
//     city: business?.city.trim(),
//     address1: business?.address1.trim(),
//     address2: business?.address2.trim(),
//   }))
    
    
    
//         } catch (error) {
//           console.log('An Error Occured while fetching Agent Data for ', error)
//         }
//       }

//       useEffect(()=>{
//         if(agentDetails)
//      fetchPrevAgentDEtails(agentDetails.agentId,agentDetails.bussinesId)
//       },[agentDetails])

    return (
        <div className={styles.container}>
            <div className={styles.TitleBar}>
             <h3>Edit Agent:</h3><p>Sofia</p>
            </div>
            {options.map((option) => (
                <label
                    key={option.id}
                    className={`${styles.card} ${selected === option.id ? styles.active : ""
                        }`}
                    onClick={() => handleOptionClick(option)} // handle click on entire label

                >
                    <div className={styles.leftSection}>
                        <input
                            type="radio"
                            name="editOption"
                            value={option.id}
                            checked={selected === option.id}
                            // onChange={() => setSelected(option.id)}
                            onChange={() => handleOptionClick(option)}
                        />
                        <div className={styles.textContainer}>
                            <span className={styles.title}>{option.title}</span>
                            <span className={styles.description}>{option.description}</span>
                        </div>
                    </div>
                    <span className={styles.arrow}>›</span>
                </label>
            ))}
            <div >
                {/* <div type="submit">
                    <div className={styles.btnTheme}>
                        <img src="svg/svg-theme.svg" alt="" />
                        <p>Continue</p>
                    </div>
                </div> */}     
                   
            </div>
        </div>
    );
};

export default EditOptions;
