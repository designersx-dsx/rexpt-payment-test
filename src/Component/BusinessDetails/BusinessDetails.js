import React, {
  useEffect, useState, useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "../BusinessDetails/BusinessDetails.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import PopUp from "../Popup/Popup";
import decodeToken from "../../lib/decodeToken";
import { getUserAgentMergedDataForAgentUpdate } from "../../Store/apiStore";
import { useAgentCreator } from "../../hooks/useAgentCreator";
import Loader from "../Loader/Loader";
import useCheckAgentCreationLimit from "../../hooks/useCheckAgentCreationLimit";
const BusinessDetails = forwardRef(({ onNext, onBack, onValidationError, onStepChange }, ref) => {
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
    stepValidator: () => "BusinessDetails",
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
  const [customBuisness, setcustomBuisness] = useState("");
  const [prevBuisnessType, setprevBuisnessType] = useState("");
  const { isLimitExceeded, CheckingUserLimit } = useCheckAgentCreationLimit(userId);

  const location = useLocation();

  const businessTypes = [
    {
      type: "Real Estate Broker",
      subtype: "Your Journey Begins Here",
      icon: "svg/Estate-icon.svg",
    },
    {
      type: "Restaurant",
      subtype: "Your Journey Begins Here",
      icon: "svg/Landscaping-icon.svg",
    },
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
      type: "Landscaping Company",
      subtype: "Your Journey Begins Here",
      icon: "svg/Landscaping-icon.svg",
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
      type: "Architect",
      subtype: "Your Journey Begins Here",
      icon: "svg/Architect-icon.svg",
    },
    {
      type: "Property Rental & Leasing Service",
      subtype: "Your Journey Begins Here",
      icon: "svg/Property Rental & Leasing Service.svg",
    },
    {
      type: "Construction Services",
      subtype: "Your Journey Begins Here",
      icon: "svg/Construction Services.svg",
    },
    {
      type: "Insurance Agency",
      subtype: "Your Journey Begins Here",
      icon: "svg/Insurance Agency.svg",
    },
    {
      type: "Old Age Home",
      subtype: "Your Journey Begins Here",
      icon: "svg/Old Age Home.svg",
    },
    {
      type: "Travel Agency",
      subtype: "Your Journey Begins Here",
      icon: "svg/Travel Agency.svg",
    },
    {
      type: "Ticket Booking",
      subtype: "Your Journey Begins Here",
      icon: "svg/Ticket Booking.svg",
    },
    {
      type: "Accounting Services",
      subtype: "Your Journey Begins Here",
      icon: "svg/Accounting Services.svg",
    },
    {
      type: "Financial Planners",
      subtype: "Your Journey Begins Here",
      icon: "svg/Financial Planners.svg",
    },
    {
      type: "Beauty Parlour",
      subtype: "Your Journey Begins Here",
      icon: "svg/Beauty Parlour.svg",
    },
    {
      type: "Nail Salon",
      subtype: "Your Journey Begins Here",
      icon: "svg/Nail Saloon.svg",
    },
    {
      type: "Barber Studio/Shop",
      subtype: "Your Journey Begins Here",
      icon: "svg/Barber.svg",
    },
    {
      type: "Hair Stylist",
      subtype: "Your Journey Begins Here",
      icon: "svg/Hair Stylist.svg",
    },
    {
      type: "Bakery",
      subtype: "Your Journey Begins Here",
      icon: "svg/Bakery.svg",
    },
    {
      type: "Dry Cleaner",
      subtype: "Your Journey Begins Here",
      icon: "svg/Dry Cleaner.svg",
    },
    {
      type: "Cleaning Janitorial Service",
      subtype: "Your Journey Begins Here",
      icon: "svg/Cleaning Janitorial Service.svg",
    },
    // {
    //   type: "Marketing Agency",
    //   subtype: "Your Journey Begins Here",
    //   icon: "svg/Marketing Agency.svg",
    // },


    {
      type: "Other",
      subtype: "Your Journey Begins Here",
      icon: "svg/Web-Design-Agency-icon.svg",
    }
  ];

  const stored = sessionStorage.getItem("businessDetails");
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("businessDetails");

      if (stored && stored !== "undefined" && stored !== "null") {
        const businessDetails = JSON.parse(stored);

        if (businessDetails) {
          setBusinessType(businessDetails.businessType || "");
          setprevBuisnessType(businessDetails.businessType || "");
          setBusinessName(businessDetails.businessName || "");
          setBusinessSize(businessDetails.businessSize || "");
          setcustomBuisness(businessDetails.customBuisness || "");
        }
      }
    } catch (err) {
      console.error("Failed to parse businessDetails from sessionStorage:", err);
    }
  }, []);
  const validateBusinessSize = (value) => {
    if (!value?.trim()) return "Business size is required.";
    const allowedValues = [
      "1 to 10 employees",
      "10 to 50 employees",
      "50 to 100 employees",
      "100 to 250 employees",
      "250 to 500 employees",
      "500 to 1000 employees",
      "1000+ employees"
    ];
    if (!allowedValues?.includes(value)) {
      return "Invalid business size selected.";
    }
    return "";
  };

  const validateServices = (value) => {
    if (businessType === "Other" && !value.trim()) {
      return "Business type is required.";
    }
    return "";
  };

  const handleBusinessSizeChange = (e) => {
    setBusinessSize(e.target.value);
  };

  const handleBusinessTypeChange = (e) => {
    setBusinessType(e.target.value);
    if (e.target.value !== "Other") {
      setcustomBuisness(""); // Clear textbox if not "Other"
    }
    console.log("businessTypeSubmitted", businessTypeSubmitted);
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

    if (prevBuisnessType != businessType) {
      sessionStorage.removeItem("selectedServices");
      sessionStorage.removeItem("selectedCustomServices");
      const raw = sessionStorage.getItem("businesServices");
      let previous = {};
      try {
        previous = raw ? JSON.parse(raw) : {};
      } catch (err) {
        console.error("Failed to parse businesServices:", err);
      }

      const updatedBusinessServices = {
        selectedService: [],
        email: previous.email,
      };
      sessionStorage.setItem("businesServices", JSON.stringify(updatedBusinessServices));
    }

    if (!businessType) {
      setBusinessTypeError("Please select a business type.");
      hasError = true;
    } else {
      setBusinessTypeError("");
    }
    const sizeError = validateBusinessSize(businessSize);
    if (sizeError) {
      setBusinessSizeError(sizeError);
      hasError = true;
    } else {
      setBusinessSizeError("");
    }
    const serviceError = validateServices(customBuisness);
    if (serviceError) {
      setErrors((prev) => ({ ...prev, customBuisness: serviceError }));
      hasError = true;
    } else {
      setErrors((prev) => ({ ...prev, customBuisness: "" }));
    }
    if (hasError) return;
    let businessData;
    // No errors - proceed
    if (businessType === "Other" && customBuisness.trim()) {
      businessData = {
        userId,
        businessType: "Other",
        customBuisness: customBuisness.trim(),
        businessName: businessName.trim(),
        businessSize,
      };


      // navigate("/about-business-next");
    } else {
      businessData = {
        userId,
        businessType,
        businessName: businessName.trim(),
        businessSize,
      };

      // navigate("/business-services");
    }
    sessionStorage.setItem("businessDetails", JSON.stringify(businessData));
    onStepChange?.(1);
  };
  const handleSaveEdit = (e) => {
    console.log("helo")
    e.preventDefault();

    if (prevBuisnessType != businessType) {
      sessionStorage.removeItem("selectedServices");
      sessionStorage.removeItem("selectedCustomServices");
      const raw = sessionStorage.getItem("businesServices");
      let previous = {};
      try {
        previous = raw ? JSON.parse(raw) : {};
      } catch (err) {
        console.error("Failed to parse businesServices:", err);
      }

      const updatedBusinessServices = {
        selectedService: [],
        email: previous.email,
      };
      sessionStorage.setItem("businesServices", JSON.stringify(updatedBusinessServices));
    }
    const businessData = {
      userId,
      businessType,
      businessName: businessName.trim(),
      customBuisness: customBuisness.trim(),
      businessSize,
    };
    sessionStorage.setItem("businessDetails", JSON.stringify(businessData));
    if (prevBuisnessType != businessType) {
      setPopupType("confirm");
      setPopupMessage("Business type changed please change the related business services!");
      setShowPopup(true);
    }
    else {
      handleCreateAgent()
    }
  };
  //Using Error Handling
  useImperativeHandle(ref, () => ({
    validate: () => {
      // Validate business type
      console.log("Hello")
      if (!businessType) {

        setBusinessTypeError("Please select a business type.");
        onValidationError?.({
          type: "failed",
          message: "Please select a business type.",
        });
        return false;
      } else {
        setBusinessTypeError("");
      }

      // Validate business size
      if (!businessSize) {
        setBusinessSizeError("Please select a business size.");
        onValidationError?.({
          type: "failed",
          message: "Please select a business size.",
        });
        return false;
      } else {
        setBusinessSizeError("");
      }
      // Validate custom business if "Other" is selected
      const serviceError = validateServices(customBuisness);
      if (serviceError) {
        setErrors((prev) => ({ ...prev, customBuisness: serviceError }));
        onValidationError?.({
          type: "failed",
          message: serviceError,
        });
        return false;
      } else {
        setErrors((prev) => ({ ...prev, customBuisness: "" }));
      }
      handleLoginClick()
      return true; // No errors
    },
  }));
  const handleClosePopup = () => {
    if (!CheckingUserLimit && isLimitExceeded && !EditingMode) {
      navigate('/dashboard');
      setShowPopup(false);
    } else {
      setShowPopup(false);
    }
  }
  useEffect(() => {
    if (!CheckingUserLimit && isLimitExceeded && !EditingMode) {
      setShowPopup(true);
      setPopupType('failed');
      setPopupMessage("Agent creation limit exceeded. Please upgrade your plan!");
    }
  }, [CheckingUserLimit, isLimitExceeded]);

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.title}>{EditingMode ? ' Edit: Business Details' : 'Business Details'}</h1> */}
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
              <label>Business Type<span className={styles.requiredField}> *</span></label>
              <input
                type="text"
                placeholder="Enter your service name"
                value={customBuisness}
                onChange={(e) => setcustomBuisness(e.target.value)}
                className={businessNameError ? styles.inputError : ""}
              />
              {errors.customBuisness && (
                <p className={styles.inlineError}>{errors.customBuisness}</p>
              )}
            </div>
          </div>
        </div>
      )}
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
      {/* {stepEditingMode != 'ON' ?
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
            <div className={styles.btnTheme} style={{ pointerEvents: Loading ? "none" : "auto", opacity: Loading ? 0.6 : 1 }}>
              <img src="svg/svg-theme.svg" alt="" />
              <p>{Loading ? <>Saving &nbsp; <Loader size={20} /></> : 'Save Edits'}</p>
            </div>
          </div>
        </div>
      } */}


      {showPopup && (
        <PopUp
          type={popupType}
          onClose={() => handleClosePopup()}
          message={popupMessage}
          onConfirm={handleCreateAgent}
        />
      )}
    </div>
  );
});

export default BusinessDetails;

