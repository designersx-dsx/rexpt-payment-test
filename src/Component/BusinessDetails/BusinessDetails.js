import React, { useEffect, useState } from "react";
import styles from "../BusinessDetails/BusinessDetails.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import PopUp from "../Popup/Popup";
import decodeToken from "../../lib/decodeToken";
import { getUserAgentMergedDataForAgentUpdate } from "../../Store/apiStore";
import { useAgentCreator } from "../../hooks/useAgentCreator";
import Loader from "../Loader/Loader";

const BusinessDetails = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessSize, setBusinessSize] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [Loading, setLoading] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const token = localStorage.getItem("token");
  const decodeTokenData = decodeToken(token);
  const userId = decodeTokenData?.id;
  const stepEditingMode = localStorage.getItem('UpdationModeStepWise')
  const EditingMode = localStorage.getItem('UpdationMode')
  const setHasFetched = true
  const { handleCreateAgent } = useAgentCreator({
    stepValidator: () => "BusinessDetails", // or custom validation
    setLoading,
    setPopupMessage,
    setPopupType,
    setShowPopup,
    navigate,
    setHasFetched,
  });
  const [businessNameError, setBusinessNameError] = useState("");
  const [businessSizeError, setBusinessSizeError] = useState("");
  const [businessTypeError, setBusinessTypeError] = useState("");
  const [serviesTypeError, setServiesTypeError] = useState("");
  const [errors, setErrors] = useState({});
  // Submission state trackers
  const [businessTypeSubmitted, setBusinessTypeSubmitted] = useState(false);
  const [businessNameSubmitted, setBusinessNameSubmitted] = useState(false);
  const [businessSizeSubmitted, setBusinessSizeSubmitted] = useState(false);
  const [serviceName, setServiceName] = useState("");


  console.log(serviceName, "serviceName")
  const location = useLocation();
  const agentDetails = location.state;

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
    {
      type: "Other",
      subtype: "Your Journey Begins Here",
      icon: "svg/Web-Design-Agency-icon.svg",
    }
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
  const stored = sessionStorage.getItem("businessDetails");
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("businessDetails");

      if (stored && stored !== "undefined" && stored !== "null") {
        const businessDetails = JSON.parse(stored);

        if (businessDetails) {
          setBusinessType(businessDetails.businessType || "");
          setBusinessName(businessDetails.businessName || "");
          setBusinessSize(businessDetails.businessSize || "");
          setServiceName(businessDetails.serviceName || "");
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

  const validateServices = (value) => {
    if (businessType === "Other" && !value.trim()) {
      return "Service name is required.";
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
  const handleNameChange = (e) => {
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
    if (e.target.value !== "Other") {
      setServiceName(""); // Clear textbox if not "Other"
    }
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
    const serviceError = validateServices(serviceName);
    if (serviceError) {
      setErrors((prev) => ({ ...prev, serviceName: serviceError }));
      hasError = true;
    } else {
      setErrors((prev) => ({ ...prev, serviceName: "" }));
    }
    if (hasError) return;
    let businessData;
    // No errors - proceed
    if (businessType === "Other" && serviceName.trim()) {
      businessData = {
        userId,
        businessType: "Other", 
        serviceName: serviceName.trim(), 
        businessName: businessName.trim(),
        businessSize,
      };
      navigate("/about-business-next");
    } else {
      businessData = {
        userId,
        businessType,
        businessName: businessName.trim(),
        businessSize,
      };
      navigate("/business-services");
    }
    sessionStorage.setItem("businessDetails", JSON.stringify(businessData));

  };
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const businessData = {
      userId,
      businessType,
      businessName: businessName.trim(),
      businessSize,
    };
    // if (businessType === "Other" && !serviceName.trim()) {
    //   newErrors.serviceName = "Service name is required for 'Other' type.";
    // }

    sessionStorage.setItem("businessDetails", JSON.stringify(businessData));
    console.log('edit hit')
    handleCreateAgent();

  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{EditingMode ? ' Edit Business Details' : 'Business Details'}</h1>
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


      {/* Conditional textbox for "Other" */}
      {businessType === "Other" && (
        <div className={styles.labReq}>
          <div className={styles.inputGroup}>
            <div className={styles.Dblock}>
              <label>Service Name<span className={styles.requiredField}> *</span></label>
              <input
                type="text"
                placeholder="Enter your service name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className={businessNameError ? styles.inputError : ""}
              />
              {errors.serviceName && (
                <p className={styles.inlineError}>{errors.serviceName}</p>
              )}
            </div>
          </div>
        </div>
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
      {stepEditingMode != 'ON' ?
        <div onClick={handleLoginClick}>
          <div type="submit">
            <div className={styles.btnTheme}>
              <img src="svg/svg-theme.svg" alt="" />
              <p>Continue</p>
            </div>
          </div>
        </div>
        :
        <div onClick={handleSaveEdit}>
          <div type="submit">
            <div className={styles.btnTheme}>
              <img src="svg/svg-theme.svg" alt="" />
              <p>{Loading ? <Loader size={20} /> : 'Save Edits'}</p>
            </div>
          </div>
        </div>
      }


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


// Safe parser for JSON-like strings
const safeParse = (value, fallback = null) => {
  try {
    if (typeof value === "string") {
      const cleaned = value.trim();
      if ((cleaned.startsWith("[") && cleaned.endsWith("]")) ||
        (cleaned.startsWith("{") && cleaned.endsWith("}")) ||
        (cleaned.startsWith('"') && cleaned.endsWith('"'))) {
        return JSON.parse(cleaned);
      }
    }
    return value;
  } catch {
    return fallback;
  }
};
