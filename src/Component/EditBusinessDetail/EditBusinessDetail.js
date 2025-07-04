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
  const token = localStorage.getItem("token");
  const decodeTokenData = decodeToken(token);
  const userId = decodeTokenData?.id;
  const navigate = useNavigate();
  const EditingMode1 = localStorage.getItem("UpdationMode");
  const setHasFetched = true;
  const { handleCreateAgent } = useAgentCreator({
    stepValidator: () => "BusinessListing",
    setLoading,
    setPopupMessage,
    setPopupType,
    setShowPopup,
    navigate,
    setHasFetched,
  });

  useEffect(() => {
    const storedDetails = sessionStorage.getItem("placeDetailsExtract");
    console.log('storedDetails',storedDetails)
    if (storedDetails) {
      const details = JSON.parse(storedDetails);
      setBusinessName( details?.businessName || "");;
      setPhoneNumber(details?.phone || details.internationalPhone || "");
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
      const agentCount = 0;
      if (!businessName || !address || !phoneNumber) {
        alert("Please fill all required fields.");
        return;
      }
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
      const knowledgeBaseName=await getKnowledgeBaseName(business,userId,packageValue);
    
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
      const mergedUrls = rawUrl ? [rawUrl] : [];

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
    //Crate Knowledge Base
      formData2.append("googleUrl", aboutBusinessForm.googleListing);
      formData2.append("webUrl", aboutBusinessForm.businessUrl.trim());
      formData2.append("aboutBusiness", aboutBussiness);
      formData2.append("additionalInstruction", aboutBusinessForm.note || "");
      formData2.append("agentId", localStorage.getItem("agent_id"));
      formData2.append("googleBusinessName",displayBusinessName || "");
      formData2.append("address1", businessData.address);
      formData2.append("businessEmail", email);
      formData2.append("businessName",placeDetails?.businessName|| businessName);
      formData2.append("phoneNumber", phoneNumber);
      formData2.append("isGoogleListing", aboutBusinessForm.noGoogleListing);
      formData2.append("isWebsiteUrl", aboutBusinessForm.noBusinessWebsite)

        formData3.append(
        "knowledge_base_texts",
        JSON.stringify(knowledgeBaseText)
      );
      let knowledge_Base_ID = knowledgeBaseId;

      if (knowledge_Base_ID !== null &&
        knowledge_Base_ID !== undefined &&
        knowledge_Base_ID !== "null" &&
        knowledge_Base_ID !== "undefined" &&
        knowledge_Base_ID !== "") {
        const response = await axios.post(
          `https://api.retellai.com/add-knowledge-base-sources/${knowledge_Base_ID}`,
          formData3,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        formData2.append("knowledge_base_id", response?.data?.knowledge_base_id);
      } else {
        const response = await axios.post(
          "https://api.retellai.com/create-knowledge-base",
          formData,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
            },
          }
        );
        formData2.append("knowledge_base_id", response?.data?.knowledge_base_id);
        formData2.append("knowledge_base_name", knowledgeBaseName);

        knowledge_Base_ID = response.data.knowledge_base_id;
        sessionStorage.setItem("knowledgeBaseId", knowledge_Base_ID);
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

      if (stepEditingMode === "ON" && knowledge_Base_ID) {

        handleCreateAgent()
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
    onChange={(e) => handleInputChange("phone", e.target.value)}
         
        />
      </div>

      <div className={styles.inputSection}>
        <label className={styles.label}>Address</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Your Business Location "
            value={address}
    onChange={(e) => handleInputChange("address", e.target.value)}
         
        />
      </div>

      <div className={styles.inputSection}>
        <label className={styles.label}>Business Email</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Business Email Address"
           value={email}
    onChange={(e) => handleInputChange("email", e.target.value)}
    
         
        />
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
                        <AnimatedButton label="Save" />
                    </div>
              {showPopup && (
        <PopUp
        type={popupType}
        onClose={()=>{}}
        message={popupMessage}
        onConfirm={()=>{}}
        />
    )}
    </div>


        </>
    )
}

export default EditBusinessDetail
