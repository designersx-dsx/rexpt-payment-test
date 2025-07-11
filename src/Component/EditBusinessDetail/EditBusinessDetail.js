import React, { useState,useEffect } from 'react';
import styles from './EditBusinessDetail.module.css'
import EditHeader from '../EditHeader/EditHeader'
import SectionHeader from '../SectionHeader/SectionHeader'
import AnimatedButton from '../AnimatedButton/AnimatedButton';
import { useAgentCreator } from '../../hooks/useAgentCreator';
import decodeToken from '../../lib/decodeToken';
import { useNavigate } from 'react-router-dom';
import PopUp from '../Popup/Popup';
import axios from 'axios';
import getKnowledgeBaseName from '../../utils/getKnowledgeBaseName';
import { API_BASE_URL } from '../../Store/apiStore';
import { useDashboardStore } from '../../Store/agentZustandStore';
import { red } from '@mui/material/colors';
const EditBusinessDetail = () => {
    const agentnm=sessionStorage.getItem("agentName");
     const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [aboutBussiness, setAboutBusiness] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [emailError, setEmailError] = useState('');

  const token = localStorage.getItem("token");
  const decodeTokenData = decodeToken(token);
  const userId = decodeTokenData?.id;
  const navigate = useNavigate();
  const EditingMode1 = localStorage.getItem("UpdationMode");
   const { setHasFetched } =    useDashboardStore();   

  const agentCode=sessionStorage.getItem('agentCode')||"";
  const { handleCreateAgent } = useAgentCreator({
    stepValidator: () => "EditBusinessDetail",
    setLoading,
    setPopupMessage,
    setPopupType,
    setShowPopup,
    navigate,
    setHasFetched,
  });

  useEffect(() => {
    const storedDetails = sessionStorage.getItem("placeDetailsExtract");
    if (storedDetails) {
      const details = JSON.parse(storedDetails);
      setBusinessName( details?.businessName || "");;
      setPhoneNumber( details.internationalPhone ||details?.phone || "");
      setAddress(details?.address || "");
      setEmail(details?.email || "");
      setAboutBusiness(details?.aboutBusiness ||details?.aboutBussiness|| "");
    }
    if (EditingMode1 != "ON") {
      const details = JSON.parse(storedDetails);
      setAboutBusiness(details?.aboutBusiness || details?.aboutBussiness ||"");
    }
  }, []);

  const handleInputChange = (field, value) => {
    const currentData = JSON.parse(
      sessionStorage.getItem("placeDetailsExtract") || "{}"
    );
    const updatedData = { ...currentData, [field]: value };
    sessionStorage.setItem("placeDetailsExtract", JSON.stringify(updatedData));

    switch (field) {
      case "businessName":
        setBusinessName(value);
        break;
      case "phone":
      case "internationalPhone":
        setPhoneNumber(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "aboutBussiness":
        setAboutBusiness(value);
        break;
      default:
        break;
    }
  };
  const formatLabel = (str) =>
    str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .replace(/_/g, " ");

  const handleSubmit = async (e) => {
    e.preventDefault();

   if (document.activeElement && document.activeElement.blur) {
    document.activeElement.blur();
  }

  if(emailError){
      return
  }
    try {
      setLoading(true);
      const aboutBusinessForm = JSON.parse(
        sessionStorage.getItem("aboutBusinessForm") || "{}"
      );
      const placeDetails = JSON.parse(
        sessionStorage.getItem("placeDetailsExtract") || "{}"
      );
      const business = JSON.parse(
        sessionStorage.getItem("businessDetails") || "{}"
      );
      const sessionBusinessiD = JSON.parse(sessionStorage.getItem("bId"));
      const knowledgeBaseId = sessionStorage.getItem("knowledgeBaseId");
      const displayBusinessName = sessionStorage.getItem("displayBusinessName")
      const packageName = sessionStorage.getItem("package") || "Free";
      const stepEditingMode = localStorage.getItem("UpdationModeStepWise");
      const EditingMode = localStorage.getItem("UpdationMode");
      const googleListing=sessionStorage.getItem('googleListing')
      const agentCount = 0;
      if (!businessName || !address || !phoneNumber) {
       setShowPopup(true)
        setPopupType("failed")
        setPopupMessage("Please fill all required fields.")
        return;
      }
      console.log("businessName", phoneNumber, address);
      const updatedPlaceDetails = {
        ...placeDetails,
        businessName: businessName || placeDetails?.businessName ,
        phone: phoneNumber,
        address: address,
        email: email,
        aboutBussiness: aboutBussiness,
        // name: businessName || placeDetails?.businessName || "",
      };
      sessionStorage.setItem(
        "placeDetailsExtract",
        JSON.stringify(updatedPlaceDetails)
      );

      const packageMap = {
        Free: 1,
        Starter: 2,
        Scaler: 3,
        Growth: 4,
        Corporate: 5,
        Enterprise: 6,
      };
      const packageValue = packageMap[packageName] || 1;
      const knowledgeBaseName=await getKnowledgeBaseName(business,userId,packageValue,agentCode);
    
      const businessData = {
        businessName:  businessName || placeDetails?.businessName || "",
        address: placeDetails?.address || address,
        phone: placeDetails?.phone || phoneNumber,
        website: placeDetails?.website || aboutBusinessForm.businessUrl,
        rating: placeDetails?.rating || "",
        totalRatings: placeDetails?.totalRatings || "",
        hours: Array.isArray(placeDetails?.hours) ? placeDetails.hours.join(" | ") : "",
        businessStatus: placeDetails?.businessStatus || "",
        categories: Array.isArray(placeDetails?.categories) ? placeDetails.categories.join(", ") : "",
        email: email,
        aboutBussiness: aboutBussiness
      };
      const placeDetailsForKBT = JSON.parse(sessionStorage.getItem("placeDetailsExtract") || "{}");
      const readableDetails = Object?.entries(placeDetailsForKBT)
        .map(
          ([key, value]) =>
            `${formatLabel(key)}: ${Array.isArray(value) ? value.join(", ") : value || "N/A"
            }`
        )
        .join("\n");

      const knowledgeBaseText = [
        {
          title: "Business Details",
          text: readableDetails,
        },
      ];

      const rawUrl = aboutBusinessForm.businessUrl?.trim();
      const mergedUrls = [];
      if (rawUrl) {
        mergedUrls.push(rawUrl); // add businessUrl
      }

      if (googleListing) {
        mergedUrls.push(googleListing); // add googleListing
      }

      // const mergedUrls = rawUrl ? [rawUrl] : [];
      const formData = new FormData();
      const formData2 = new FormData();
      const formData3 = new FormData();
      if (mergedUrls.length > 0) {
        formData.append("knowledge_base_urls", JSON.stringify(mergedUrls));
        formData3.append("knowledge_base_urls", JSON.stringify(mergedUrls));
      }
      formData.append("knowledge_base_name", knowledgeBaseName);
      formData.append("enable_auto_refresh", "true");
      formData.append(
        "knowledge_base_texts",
        JSON.stringify(knowledgeBaseText)
      );
      formData2.append(
        "knowledge_base_texts",
        JSON.stringify(businessData)
      );

      //   formData3.append(
      //   "knowledge_base_texts",
      //   JSON.stringify(knowledgeBaseText)
      // );
    //Crate Knowledge Base
      formData2.append("googleUrl", aboutBusinessForm?.googleListing);
      formData2.append("webUrl", aboutBusinessForm?.businessUrl?.trim());
      formData2.append("aboutBusiness", aboutBussiness);
      formData2.append("additionalInstruction", aboutBusinessForm?.note || "");
      formData2.append("agentId", localStorage.getItem("agent_id"));
      formData2.append("googleBusinessName",displayBusinessName || "");
      formData2.append("address1", businessData?.address);
      formData2.append("businessEmail", email);
      formData2.append("businessName",placeDetails?.businessName|| businessName);
      formData2.append("phoneNumber", phoneNumber);
      formData2.append("isGoogleListing", aboutBusinessForm?.noGoogleListing);
      formData2.append("isWebsiteUrl", aboutBusinessForm?.noBusinessWebsite)
      // if(googleListing)
      // { 
      //   formData.append("knowledge_base_urls", JSON.stringify(googleListing));
      // }
   
      let knowledge_Base_ID = knowledgeBaseId;

      if (knowledge_Base_ID !== null &&
        knowledge_Base_ID !== undefined &&
        knowledge_Base_ID !== "null" &&
        knowledge_Base_ID !== "undefined" &&
        knowledge_Base_ID !== "") {
        
          try {
                 const sourcesResp = await axios.delete(
                  `https://api.retellai.com/delete-knowledge-base/${knowledge_Base_ID}`,
                  {   
                      headers: {
                      Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
               console.log('prev Knowledgbase deleted')
          } catch (error) {
            console.log('error while removing prev Knowledgbase ',error)
          }
      }

      try {
          const response = await axios.post(
            "https://api.retellai.com/create-knowledge-base",
            formData,
            {
              headers: {
                Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          formData2.append("knowledge_base_id", response?.data?.knowledge_base_id);
          formData2.append("knowledge_base_name", knowledgeBaseName);
  
          knowledge_Base_ID = response?.data?.knowledge_base_id;
          sessionStorage.setItem("knowledgeBaseId", knowledge_Base_ID);
      } catch (error) {
        console.log('error while adding knowlde create-knowledge-base',error)
      }

    
      await axios.patch(
        `${API_BASE_URL}/businessDetails/updateKnowledeBase/${sessionBusinessiD}`,
        formData2,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (EditingMode === "ON" && knowledge_Base_ID) {

        handleCreateAgent()
        setHasFetched(false);
      }

      // if (stepEditingMode !== "ON") {
      //   setShowPopup(true)
      //   setPopupType("success")
      //   setPopupMessage("Knowledge base created successfully!")
      //   setTimeout(() => {
      //     navigate("/steps");
      //   }, 1000);


      // } else {
      //   setShowPopup(true)
      //   setPopupType("success")
      //   setPopupMessage("Knowledge base updated successfully!")
      //   setTimeout(() => {
      //     navigate("/agent-detail", {
      //       state: {
      //         agentId: localStorage.getItem("agent_id"),
      //         bussinesId: sessionBusinessiD,
      //       },
      //     });
      //   }, 1000);

      // }
    } catch (error) {
      console.log(error)
      if (error?.response?.status === 422) {
        setShowPopup(true)
        setPopupType("failed")
        setPopupMessage("Knowledge base is currently updating. Try again later.")
      } else {
        setShowPopup(true)
        setPopupType("failed")
        console.error("Submission failed:", error);
        setPopupMessage("Something went wrong. Please try again.")

      }
    } finally {
      setLoading(false);
    }
  };
    const EditingMode = localStorage.getItem("UpdationMode");

    return (
        <>
            <EditHeader title='Edit Agent ' agentName={agentnm} />
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
           value={businessName}
    onChange={(e) => handleInputChange("businessName", e.target.value)}
        
        />
      </div>
      
      <div className={styles.inputSection}>
        <label className={styles.label}>Phone Number</label>
        <input
          type="text"
          className={styles.input}
          placeholder="88XX 77X X55"
          value={phoneNumber}
           maxLength={15}
                minLength={8}
                onChange={(e) => {
                  const raw = e.target.value;
                  const cleaned = raw.replace(/[^0-9+\s]/g, "");
                  handleInputChange("phone", cleaned);
                }}
          // onChange={(e) => {handleInputChange("phone", e.target.value)}
         
        />
      </div>

      <div className={styles.inputSection}>
        <label className={styles.label}>Address</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Your Business Location "
          maxLength={150}
          value={address}
          onChange={(e) => handleInputChange("address", e.target.value)}
         
        />
      </div>

      <div className={styles.inputSection}>
        <label className={styles.label}>Business Email</label>
        <input
          type="email"
          className={styles.input}
          placeholder="Business Email Address"
           value={email}
           onChange={(e) => handleInputChange("email", e.target.value)}
    
          onBlur={(e) => {
            const value = e.target.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (value && !emailRegex.test(value)) {
             setEmailError("Please enter a valid email address.");
            }else{
              setEmailError('');
            }
          }}
        />
        {emailError && <p style={{color:'red'}}>{emailError}</p> }
      </div>

      <div className={styles.inputSection}>
        <label className={styles.label}>Business Intro for Your Agent to know</label>
        <textarea  rows="3" cols="50"  className={styles.textarea}
          placeholder="Write an Intro for your Business here"
              value={aboutBussiness}
              onChange={(e) => handleInputChange("aboutBussiness", e.target.value)}
        > </textarea>
      </div>



       

     <div className={styles.stickyWrapper} onClick={handleSubmit}>
                        <AnimatedButton label="Save" isLoading={loading}/>
                    </div>
              {showPopup && (
        <PopUp
        type={popupType}
        onClose={()=>{setShowPopup(false)}}
        message={popupMessage}
        onConfirm={()=>{}}
        />
    )}
    </div>


        </>
    )
}

export default EditBusinessDetail
