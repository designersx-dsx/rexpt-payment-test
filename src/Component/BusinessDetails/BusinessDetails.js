import React, { useEffect, useState } from "react";
import styles from "../BusinessDetails/BusinessDetails.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import PopUp from "../Popup/Popup";
import decodeToken from "../../lib/decodeToken";
import { getUserAgentMergedDataForAgentUpdate } from "../../Store/apiStore";

const BusinessDetails = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessSize, setBusinessSize] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const token = localStorage.getItem("token");
  const decodeTokenData = decodeToken(token);
  const userId = decodeTokenData?.id;

  const [businessNameError, setBusinessNameError] = useState("");
  const [businessSizeError, setBusinessSizeError] = useState("");
  const [businessTypeError, setBusinessTypeError] = useState("");

  // Submission state trackers
  const [businessTypeSubmitted, setBusinessTypeSubmitted] = useState(false);
  const [businessNameSubmitted, setBusinessNameSubmitted] = useState(false);
  const [businessSizeSubmitted, setBusinessSizeSubmitted] = useState(false);
  const location = useLocation();
  const agentDetails = location.state;

  const fetchPrevAgentDEtails=async(agent_id,businessId)=>{
      try {  
      const response=await getUserAgentMergedDataForAgentUpdate(agent_id,businessId)
      console.log('response',response)
      const agent=response?.data?.agent;
      const business=response?.data?.business;
      
    // console.log('agent',agent)
    sessionStorage.setItem('UpdationMode','ON')
    sessionStorage.setItem('agentName',agent.agentName)
    sessionStorage.setItem('agentGender',agent.agentGender)
    sessionStorage.setItem('agentLanguageCode',agent.agentLanguageCode)
    sessionStorage.setItem('agentLanguage',agent.agentLanguage)
    sessionStorage.setItem('llmId',agent.llmId)
    sessionStorage.setItem('agent_id',agent.agent_id)
    sessionStorage.setItem('knowledgeBaseId',agent.knowledgeBaseId)

    //need to clear later
    localStorage.setItem('agentName',agent.agentName)
    localStorage.setItem('agentGender',agent.agentGender)
    localStorage.setItem('agentLanguageCode',agent.agentLanguageCode)
    localStorage.setItem('agentLanguage',agent.agentLanguage)
    localStorage.setItem('llmId',agent.llmId)
    localStorage.setItem('agent_id',agent.agent_id)
    localStorage.setItem('knowledgeBaseId',agent.knowledgeBaseId)
    localStorage.setItem('agentRole',agent.agentRole)
    localStorage.setItem('agentVoice',agent.agentVoice)
    localStorage.setItem('agentVoiceAccent',agent.agentAccent)
    localStorage.setItem('avatar',agent.avatar)
    //need to clear above

    sessionStorage.setItem('agentRole',agent.agentRole)
    sessionStorage.setItem('agentVoice',agent.agentVoice)
    sessionStorage.setItem('agentVoiceAccent',agent.agentAccent)
    sessionStorage.setItem('avatar',agent.avatar)
    sessionStorage.setItem('businessDetails',agent.business)
    sessionStorage.setItem('businessLocation',agent.business)
    sessionStorage.setItem('businessId',agent.businessId)
 
    sessionStorage.setItem('businessLocation',  JSON.stringify({
    country: business?.country,
    state: business?.state.trim(),
    city: business?.city.trim(),
    address1: business?.address1.trim(),
    address2: business?.address2.trim(),
  }))



    } catch (error) {
      console.log('An Error Occured while fetching Agent Data for ', error)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('UpdationMode')) {
      fetchPrevAgentDEtails(agentDetails?.agentId, agentDetails?.bussinesId)
    }
  }, [agentDetails])

  const businessTypes = [
    {
      type: "Real Estate Broker",
      subtype: "Your Journey Begins Here",
      icon: "svg/Estate-icon.svg",
    },
    // {
    //   type: "  Landscaping Company",
    //   subtype: "Your Journey Begins Here",
    //   icon: "svg/Landscaping-icon.svg",
    // },
    // {
    //   type: " Architect",
    //   subtype: "Your Journey Begins Here",
    //   icon: "svg/Architect-icon.svg",
    // },
    {
      type: "Interior Designer",
      subtype: "Your Journey Begins Here",
      icon: "svg/Interior-Designer-icon.svg",
    },
    {
      type: "Saloon",
      subtype: "Your Journey Begins Here",
      icon: "svg/Saloon-icon.svg",
    },
    {
      type: "Dentist",
      subtype: "Your Journey Begins Here",
      icon: "svg/Dentist-Office-icon.svg",
    },
    {
      type: "Doctor's Clinic",
      subtype: "Your Journey Begins Here",
      icon: "svg/Doctor-clinic-icon.svg",
    },
    {
      type: "Gym & Fitness Center",
      subtype: "Your Journey Begins Here",
      icon: "svg/Gym-icon.svg",
    },

    {
      type: "Personal Trainer",
      subtype: "Your Journey Begins Here",
      icon: "svg/Personal-Trainer-icon.svg",
    },
    {
      type: "Web Design Agency",
      subtype: "Your Journey Begins Here",
      icon: "svg/Web-Design-Agency-icon.svg",
    },
  ];
  const businessSizeOptions = [
    "1 to 10",
    "11 to 50",
    "51 to 100",
    "101 to 250",
    "251 to 500",
    "501 to 1000",
    "1000+",
  ];

useEffect(() => {
  try {
    const stored = sessionStorage.getItem("businessDetails");

    if (stored && stored !== "undefined" && stored !== "null") {
      const businessDetails = JSON.parse(stored);

      if (businessDetails) {
        setBusinessType(businessDetails.businessType || "");
        setBusinessName(businessDetails.businessName || "");
        setBusinessSize(businessDetails.businessSize || "");
      }
    }
  } catch (err) {
    console.error("Failed to parse businessDetails from sessionStorage:", err);
  }
}, []);

  const containsEmoji = (text) => {
    return /[\p{Emoji_Presentation}\u200d]/u.test(text);
  };

  const validateBusinessName = (value) => {
    if (!value.trim()) return "Business name is required.";
    if (containsEmoji(value)) return "Emojis are not allowed in business name.";
    if (/[^a-zA-Z0-9\s.'-]/.test(value))
      return "Business name contains invalid characters.";
    if (value.trim().length < 2)
      return "Business name must be at least 2 characters.";
    return "";
  };

  const validateBusinessSize = (value) => {
    if (!value.trim()) return "Business size is required.";
    console.log(value)
    const allowedValues = [
      "1 to 10 employees",
      "10 to 50 employees",
      "50 to 100 employees",
      "100 to 250 employees",
      "250 to 500 employees",
      "500 to 1000 employees",
      "1000+ employees"
    ];
    if (!allowedValues.includes(value)) {
      return "Invalid business size selected.";
    }
    return "";
  };

  const handleBusinessNameChange = (e) => {
    const val = e.target.value;
    setBusinessName(val);
    if (businessNameSubmitted) {
      setBusinessNameError(validateBusinessName(val));
    } else {
      setBusinessNameError("");
    }
  };

  const handleBusinessSizeChange = (e) => {
    setBusinessSize(e.target.value);
  };

  const handleBusinessTypeChange = (e) => {
    setBusinessType(e.target.value);
    if (businessTypeSubmitted) {
      setBusinessTypeError("");
    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredBusinessTypes = businessTypes.filter(
    (item) =>
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtype.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleLoginClick = () => {
    // Mark all as submitted to show errors
    setBusinessTypeSubmitted(true);
    setBusinessNameSubmitted(true);
    setBusinessSizeSubmitted(true);

    // Validate all fields
    let hasError = false;

    if (!businessType) {
      setBusinessTypeError("Please select a business type.");
      hasError = true;
    } else {
      setBusinessTypeError("");
    }

    const nameError = validateBusinessName(businessName);
    if (nameError) {
      setBusinessNameError(nameError);
      hasError = true;
    } else {
      setBusinessNameError("");
    }

    const sizeError = validateBusinessSize(businessSize);
    if (sizeError) {
      setBusinessSizeError(sizeError);
      hasError = true;
    } else {
      setBusinessSizeError("");
    }

    if (hasError) return;

    // No errors - proceed
    const businessData = {
      userId,
      businessType,
      businessName: businessName.trim(),
      businessSize,
    };

    sessionStorage.setItem("businessDetails", JSON.stringify(businessData));
    navigate("/business-services");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Business Details</h1>
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>
          <img src="svg/Search-Icon.svg" alt="Search icon" />
        </span>
        <input
          type="text"
          placeholder="Quick find Business type"
          className={styles.searchInput}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className={styles.ListDiv}>
        <div className={styles.optionList}>
          {filteredBusinessTypes.length > 0 ? (
            filteredBusinessTypes.map((item, index) => (
              <label className={styles.option} key={index}>
                <div className={styles.forflex}>
                  <div className={styles.icon}>
                    <img
                      src={item.icon}
                      alt={`${item.type} icon`}
                      className={styles.iconImg}
                    />
                  </div>
                  <div>
                    <strong>{item.type}</strong>
                    <p className={styles.subType}>{item.subtype}</p>
                  </div>
                </div>

                <div>
                  <input
                    type="radio"
                    name="businessType"
                    value={item.type}
                    checked={businessType === item.type}
                    onChange={handleBusinessTypeChange}
                  />
                </div>
              </label>
            ))
          ) : (
            <p className={styles.noItemFound}>No item found</p>
          )}
        </div>
      </div>


      {businessTypeSubmitted && businessTypeError && (
        <p className={styles.inlineError}>{businessTypeError}</p>
      )}

      <div className={styles.labReq}>
        <div className={styles.inputGroup}>
          <div className={styles.Dblock}>
            <label>Business Name<span className={styles.requiredField}> *</span></label>
            <input
              type="text"
              placeholder="Your Business name"
              value={businessName}
              onChange={handleBusinessNameChange}
              className={businessNameError ? styles.inputError : ""}
            />
            {businessNameSubmitted && businessNameError && (
              <p className={styles.inlineError}>{businessNameError}</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.inputGroup}>
        {/* <label>Business Size (Number of Emp.)</label> */}
        {/* <input
          type="text"
          placeholder="Number of employees"
          value={businessSize}
          onChange={handleBusinessSizeChange}
          maxLength={5}
          className={businessSizeError ? styles.inputError : ''}
          inputMode="numeric"
        /> */}
        {/* {businessSizeSubmitted && businessSizeError && (
          <p className={styles.inlineError}>{businessSizeError}</p>
        )} */}
      </div>
      {/* business size –- now a dropdown */}
      <div className={styles.inputGroup}>
        <label>Business Size (Number of Emp.)<span className={styles.requiredField}> *</span></label>
        <select
          value={businessSize}
          onChange={handleBusinessSizeChange}
          className={`${styles.selectInput} ${businessSizeError ? styles.inputError : ""
            }`}
        >
          <option value="" disabled className={styles.selectOption}>
            {'Select Business Size'}
          </option>
          <option value='1 to 10 employees' className={`${styles.selectOption}`} >
            {'1 to 10 employees'}
          </option>
          <option value='10 to 50 employees' className={`${styles.selectOption}`}>
            {'10 to 50 employees'}
          </option>
          <option value='50 to 100 employees' className={`${styles.selectOption}`}>
            {'50 to 100 employees'}
          </option>
          <option value='100 to 250 employees' className={`${styles.selectOption}`}>
            {'100 to 250 employees'}
          </option>
          <option value='250 to 500 employees' className={`${styles.selectOption}`}>
            {'250 to 500  employees'}
          </option>
          <option value='500 to 1000 employees' className={`${styles.selectOption}`}>
            {'500 to 1000 employees'}
          </option>
          <option value='1000+ employees' className={`${styles.selectOption}`}>
            {'1000+ employees'}
          </option>
        </select>
        {businessSizeSubmitted && businessSizeError && (
          <p className={styles.inlineError}>{businessSizeError}</p>
        )}
      </div>
      <div onClick={handleLoginClick}>
        <div type="submit">
          <div className={styles.btnTheme}>
            <img src="svg/svg-theme.svg" alt="" />
            <p>Continue</p>
          </div>
        </div>
      </div>

      {showPopup && (
        <PopUp
          type={popupType}
          onClose={() => setShowPopup(false)}
          message={popupMessage}
        />
      )}
    </div>
  );
};

export default BusinessDetails;
