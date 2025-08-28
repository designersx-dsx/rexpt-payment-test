import React, { useState, useRef, useEffect } from 'react';
import EditHeader from '../EditHeader/EditHeader';
import styles from '../EditBusinessType/EditBusinessType.module.css';
import AnimatedButton from '../AnimatedButton/AnimatedButton';

import Tooltip from '../TooltipSteps/Tooltip';

import decodeToken from '../../lib/decodeToken';
import PopUp from '../Popup/Popup';
import { useAgentCreator } from '../../hooks/useAgentCreator';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../../Store/agentZustandStore';


const EditBusinessType = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [businessType, setBusinessType] = useState("");
  const [businessSize, setBusinessSize] = useState("")
  const [customBuisness, setcustomBuisness] = useState("");
  const [prevBuisnessType, setprevBuisnessType] = useState("");
  const [businessNameError, setBusinessNameError] = useState("");
  const [businessSizeError, setBusinessSizeError] = useState("");
  const [businessTypeError, setBusinessTypeError] = useState("");
  const [serviesTypeError, setServiesTypeError] = useState("");
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");
  const decodeTokenData = decodeToken(token);
  const agentnm = sessionStorage.getItem("agentName");

  const [businessTypeSubmitted, setBusinessTypeSubmitted] = useState(false);
  const [businessNameSubmitted, setBusinessNameSubmitted] = useState(false);
  const [businessSizeSubmitted, setBusinessSizeSubmitted] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [initialDetails, setInitialDetails] = useState(null);


  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [Loading, setLoading] = useState(null);
  const navigate = useNavigate();
  const { setHasFetched } = useDashboardStore();
  const userId = decodeTokenData?.id;
  const { handleCreateAgent } = useAgentCreator({
    stepValidator: () => "EditBusinessType",
    setLoading,
    setPopupMessage,
    setPopupType,
    setShowPopup,
    navigate,
    setHasFetched,
  });

  const businessTypes = [
    {
      type: "Real Estate Broker",
      subtype: "Property Transaction Facilitator",
      icon: "svg/Estate-icon.svg",
    },
    {
      type: "Restaurant",
      subtype: "Food Service Establishment",
      icon: "svg/Landscaping-icon.svg",
    },
    {
      type: "Interior Designer",
      subtype: "Indoor Space Beautifier",
      icon: "svg/Interior-Designer-icon.svg",
    },
    {
      type: "Saloon",
      subtype: "Hair Styling & Grooming",
      icon: "svg/Saloon-icon.svg",
    },
    {
      type: "Landscaping Company",
      subtype: "Outdoor Space Beautification",
      icon: "svg/Landscaping-icon.svg",
    },
    {
      type: "Dentist",
      subtype: "Dental Care Provider",
      icon: "svg/Dentist-Office-icon.svg",
    },
    {
      type: "Doctor's Clinic",
      subtype: "Medical Consultation & Treatment",
      icon: "svg/Doctor-clinic-icon.svg",
    },
    {
      type: "Gym & Fitness Center",
      subtype: "Exercise Facility & Training",
      icon: "svg/Gym-icon.svg",
    },

    {
      type: "Personal Trainer",
      subtype: "Individual Fitness Coaching",
      icon: "svg/Personal-Trainer-icon.svg",
    },
    {
      type: "Web Design Agency",
      subtype: "Website Creation & Development",
      icon: "svg/Web-Design-Agency-icon.svg",
    },
    {
      type: "Architect",
      subtype: "Building Design Expert",
      icon: "svg/Architect-icon.svg",
    },
    {
      type: "Property Rental & Leasing Service",
      subtype: "Property Rental Management",
      icon: "svg/Property Rental & Leasing Service.svg",
    },
    {
      type: "Construction Services",
      subtype: "Building Construction & Repair",
      icon: "svg/Construction Services.svg",
    },
    {
      type: "Insurance Agency",
      subtype: "Risk Protection Provider",
      icon: "svg/Insurance Agency.svg",
    },
    {
      type: "Old Age Home",
      subtype: "Senior Living Facility",
      icon: "svg/Old Age Home.svg",
    },
    {
      type: "Travel Agency",
      subtype: "Trip Planning & Booking",
      icon: "svg/Travel Agency.svg",
    },
    {
      type: "Ticket Booking",
      subtype: "Travel Ticket Provider",
      icon: "svg/Ticket Booking.svg",
    },
    {
      type: "Accounting Services",
      subtype: "Financial Record Management",
      icon: "svg/Accounting Services.svg",
    },
    {
      type: "Financial Planners",
      subtype: "Wealth Management Advice",
      icon: "svg/Financial Planners.svg",
    },
    {
      type: "Beauty Parlour",
      subtype: "Cosmetic Beauty Services",
      icon: "svg/Beauty Parlour.svg",
    },
    {
      type: "Nail Salon",
      subtype: "Manicure/Pedicure Services",
      icon: "svg/Nail Saloon.svg",
    },
    {
      type: "Barber Studio/Shop",
      subtype: "Men's Hair Grooming",
      icon: "svg/Barber.svg",
    },
    {
      type: "Hair Stylist",
      subtype: "Professional Hair Care",
      icon: "svg/Hair Stylist.svg",
    },
    {
      type: "Bakery",
      subtype: "Baked Goods Producer",
      icon: "svg/Bakery.svg",
    },
    {
      type: "Dry Cleaner",
      subtype: "Garment Cleaning & Care",
      icon: "svg/Dry Cleaner.svg",
    },
    {
      type: "Cleaning Janitorial Service",
      subtype: "Professional Cleaning Solutions",
      icon: "svg/Cleaning Janitorial Service.svg",
    },
    {
      type: "Other",
      subtype: "More Ideas, More Impact",
      icon: "svg/Web-Design-Agency-icon.svg",
    }
  ];

  const filteredBusinessTypes = businessTypes.filter((item) =>
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const btnImgRef = useRef(null);


  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("businessDetails");
      // console.log(stored)
      if (stored && stored !== "undefined" && stored !== "null") {
        const businessDetails = JSON.parse(stored);
        // console.log(businessDetails)
            setInitialDetails(businessDetails);  // 👈 first time original save
        if (businessDetails) {
          setBusinessType(businessDetails?.businessType || "");
          setprevBuisnessType(businessDetails?.businessType || "");
          if (!sessionStorage.getItem("prevBuisnessType")) {
            sessionStorage.setItem("prevBuisnessType", businessDetails?.businessType)
          }
          setBusinessSize(businessDetails?.businessSize || "");
          setcustomBuisness(businessDetails?.customBuisness || "");
        }
      }
    } catch (err) {
      console.error("Failed to parse businessDetails from sessionStorage:", err);
    }
  }, []);

  const handleBusinessSizeChange = (e) => {
    setBusinessSize(e.target.value);
  };

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

  const updateSessionBusinessDetails = (key, value) => {
    let existing = {};
    try {
      const stored = sessionStorage.getItem("businessDetails");

      if (stored && stored !== "undefined" && stored !== "null") {
        existing = JSON.parse(stored);
        // selectedServices
        sessionStorage.removeItem("selectedServices");
        sessionStorage.removeItem("businesServices");
      }
    } catch (e) {
      console.error("Error parsing sessionStorage businessDetails:", e);
    }

    const updated = {
      ...existing,
      [key]: value,
    };
    sessionStorage.setItem("businessDetails", JSON.stringify(updated));
  };
  const handleBusinessTypeChange = (e) => {
    // console.log(e.target.value)
    setBusinessType(e.target.value);
    if (e.target.value !== "Other") {
      setcustomBuisness(""); // Clear textbox if not "Other"
      updateSessionBusinessDetails("businessType", e.target.value);
      sessionStorage.removeItem("showInput");
    }
    updateSessionBusinessDetails("businessType", e.target.value);
    // console.log("businessTypeSubmitted", businessTypeSubmitted);
    if (businessTypeSubmitted) {
      setBusinessTypeError("");
    }


  };

  const handlesave = () => {

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
        businessSize,
      };
      // navigate("/about-business-next");
    } else {
      businessData = {
        userId,
        businessType,
        businessSize,
      };

      // navigate("/business-services");
    }
    sessionStorage.setItem("businessDetails", JSON.stringify(businessData));
    // console.log('dsdsdsdsd',prevBuisnessType, businessType)
    if (sessionStorage.getItem("prevBuisnessType") != businessType) {
      setPopupType("confirm");
      setPopupMessage(
        "Business type changed please change the related business services!"
      );
      setShowPopup(true);
    } else {
      handleCreateAgent();
      // setHasFetched(false)

    }

  };

  useEffect(() => {
  try {
    if (initialDetails) {
  
      // console.log(initialDetails,businessType)
      const isTypeChanged = initialDetails?.businessType !== businessType;
      const isSizeChanged = initialDetails?.businessSize !== businessSize;
      const isCustomChanged = (initialDetails?.customBuisness || "") !== customBuisness;

      setIsChanged(isTypeChanged || isSizeChanged || isCustomChanged);
    } else {
      // Agar koi stored details hi nahi h toh by default changed maana
      setIsChanged(true);
    }
  } catch (err) {
    console.error("Failed to parse businessDetails from sessionStorage:", err);
    setIsChanged(true);
  }
}, [businessType, businessSize, customBuisness,initialDetails]);

  // console.log('setBusinessType',isChanged,initialDetails)
  return (
    <>
      <EditHeader title='Edit Agent ' agentName={agentnm} />
      <div className={styles.Maindiv}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.heading}>Select Category</h2>
          <p className={styles.subheading}>Select category     best describes your business type</p>

        </div>


        <div className={styles.section}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>
              <img src='svg/Search-Icon.svg' alt='Search icon' />
            </span>
            <input
              type='text'
              placeholder='Quick find Business type'
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.ListDiv}>
            <div className={styles.optionList}>
              {filteredBusinessTypes.length > 0 ? (
                // filteredBusinessTypes
                [...filteredBusinessTypes]
                  .sort((a, b) => a.type.localeCompare(b.type))
                  .map((item, index) => (
                    <label className={styles.option} key={index}>
                      <div className={styles.forflex}>
                        <div className={styles.icon}>
                          <img src={item.icon} alt={`${item.type} icon`} className={styles.iconImg} />
                        </div>
                        <div className={styles.strongDiv}>
                          <strong>{item.type}</strong>
                          <p className={styles.subType}>{item.subtype}</p>
                        </div>
                      </div>

                      <div>
                        <input
                          type='radio'
                          name='businessType'
                          value={item.type}
                          checked={businessType === item.type}
                          onChange={handleBusinessTypeChange}
                        />
                      </div>
                    </label>
                  ))
              ) : (
                <div className={styles.noResult}>No results found</div>
              )}

            </div>
          </div>
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
          <div className={styles.inputGroup}>
            <label>Business Size (Number of Emp.)<span className={styles.requiredField}> *</span></label>
            <select className={styles.selectInput}
              value={businessSize}
              onChange={handleBusinessSizeChange}
            >
              <option value="" disabled className={styles.selectOption}>
                Number of Employe
              </option>
              <option value="1 to 10 employees" className={styles.selectOption}>
                1 to 10 employees
              </option>
              <option value="10 to 50 employees" className={styles.selectOption}>
                10 to 50 employees
              </option>
              <option value="50 to 100 employees" className={styles.selectOption}>
                50 to 100 employees
              </option>
              <option value="100 to 250 employees" className={styles.selectOption}>
                100 to 250 employees
              </option>
              <option value="250 to 500 employees" className={styles.selectOption}>
                250 to 500 employees
              </option>
              <option value="500 to 1000 employees" className={styles.selectOption}>
                500 to 1000 employees
              </option>
              <option value="1000+ employees" className={styles.selectOption}>
                1000+ employees
              </option>
            </select>


          </div>
          <div className={styles.stickyWrapper}
          //  onClick={handlesave}   
           style={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "white",
            padding: "8px",
            opacity: isChanged ? 1 : 0.5,
            cursor: isChanged ? "pointer" : "not-allowed"
          }}
          onClick={isChanged ? handlesave : undefined}>
          <AnimatedButton label="Save" isLoading={Loading} position={{ position: 'relative' }} disabled={!isChanged}/>
          </div>
        </div>
        {showPopup && (
          <PopUp
            type={popupType}
            onClose={() => { setShowPopup(false) }}
            message={popupMessage}
            onConfirm={() => navigate('/edit-services-offered')}
          />
        )}
      </div>
    </>
  );
};

export default EditBusinessType;
