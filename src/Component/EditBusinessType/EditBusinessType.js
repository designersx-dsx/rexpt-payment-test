import React, { useState, useRef,useEffect} from 'react';
import EditHeader from '../EditHeader/EditHeader';
import styles from '../EditBusinessType/EditBusinessType.module.css';
import AnimatedButton from '../AnimatedButton/AnimatedButton';
import Tooltip from '../TooltipSteps/Tooltip';
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

    const businessTypes = [
        { type: 'Real Estate Broker', subtype: 'Your Journey Begins Here', icon: 'svg/Estate-icon.svg' },
        { type: 'Restaurant', subtype: 'Your Journey Begins Here', icon: 'svg/Landscaping-icon.svg' },
        { type: 'Interior Designer', subtype: 'Your Journey Begins Here', icon: 'svg/Interior-Designer-icon.svg' },
        { type: 'Saloon', subtype: 'Your Journey Begins Here', icon: 'svg/Saloon-icon.svg' },
        { type: 'Landscaping Company', subtype: 'Your Journey Begins Here', icon: 'svg/Landscaping-icon.svg' },
        { type: 'Dentist', subtype: 'Your Journey Begins Here', icon: 'svg/Dentist-Office-icon.svg' },
        { type: "Doctor's Clinic", subtype: 'Your Journey Begins Here', icon: 'svg/Doctor-clinic-icon.svg' },
        { type: 'Gym & Fitness Center', subtype: 'Your Journey Begins Here', icon: 'svg/Gym-icon.svg' },
        { type: 'Personal Trainer', subtype: 'Your Journey Begins Here', icon: 'svg/Personal-Trainer-icon.svg' },
        { type: 'Web Design Agency', subtype: 'Your Journey Begins Here', icon: 'svg/Web-Design-Agency-icon.svg' },
        { type: 'Architect', subtype: 'Your Journey Begins Here', icon: 'svg/Architect-icon.svg' },
        { type: 'Property Rental & Leasing Service', subtype: 'Your Journey Begins Here', icon: 'svg/Property Rental & Leasing Service.svg' },
        { type: 'Construction Services', subtype: 'Your Journey Begins Here', icon: 'svg/Construction Services.svg' },
        { type: 'Insurance Agency', subtype: 'Your Journey Begins Here', icon: 'svg/Insurance Agency.svg' },
        { type: 'Old Age Home', subtype: 'Your Journey Begins Here', icon: 'svg/Old Age Home.svg' },
        { type: 'Travel Agency', subtype: 'Your Journey Begins Here', icon: 'svg/Travel Agency.svg' },
        { type: 'Ticket Booking', subtype: 'Your Journey Begins Here', icon: 'svg/Ticket Booking.svg' },
        { type: 'Accounting Services', subtype: 'Your Journey Begins Here', icon: 'svg/Accounting Services.svg' },
        { type: 'Financial Planners', subtype: 'Your Journey Begins Here', icon: 'svg/Financial Planners.svg' },
        { type: 'Beauty Parlour', subtype: 'Your Journey Begins Here', icon: 'svg/Beauty Parlour.svg' },
        { type: 'Nail Salon', subtype: 'Your Journey Begins Here', icon: 'svg/Nail Saloon.svg' },
        { type: 'Barber Studio/Shop', subtype: 'Your Journey Begins Here', icon: 'svg/Barber.svg' },
        { type: 'Hair Stylist', subtype: 'Your Journey Begins Here', icon: 'svg/Hair Stylist.svg' },
        { type: 'Bakery', subtype: 'Your Journey Begins Here', icon: 'svg/Bakery.svg' },
        { type: 'Dry Cleaner', subtype: 'Your Journey Begins Here', icon: 'svg/Dry Cleaner.svg' },
        { type: 'Cleaning Janitorial Service', subtype: 'Your Journey Begins Here', icon: 'svg/Cleaning Janitorial Service.svg' },
        { type: 'Other', subtype: 'Your Journey Begins Here', icon: 'svg/Web-Design-Agency-icon.svg' },
    ];

    const filteredBusinessTypes = businessTypes.filter((item) =>
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const btnImgRef = useRef(null);


      useEffect(() => {
        try {
          const stored = sessionStorage.getItem("businessDetails");
          console.log(stored)
          if (stored && stored !== "undefined" && stored !== "null") {
            const businessDetails = JSON.parse(stored);
            console.log(businessDetails)
            if (businessDetails) {
              setBusinessType(businessDetails.businessType || "");
              setprevBuisnessType(businessDetails.businessType || "");
              setBusinessSize(businessDetails.businessSize || "");
              setcustomBuisness(businessDetails.customBuisness || "");
            }
          }
        } catch (err) {
          console.error("Failed to parse businessDetails from sessionStorage:", err);
        }
      }, []);

        const handleBusinessSizeChange = (e) => {
    setBusinessSize(e.target.value);
  };

  const handlesave=()=>{}
//     const handlesave = () => {

//     if (prevBuisnessType != businessType) {
//       sessionStorage.removeItem("selectedServices");
//       sessionStorage.removeItem("selectedCustomServices");
//       const raw = sessionStorage.getItem("businesServices");
//       let previous = {};
//       try {
//         previous = raw ? JSON.parse(raw) : {};
//       } catch (err) {
//         console.error("Failed to parse businesServices:", err);
//       }

//       const updatedBusinessServices = {
//         selectedService: [],
//         email: previous.email,
//       };
//       sessionStorage.setItem("businesServices", JSON.stringify(updatedBusinessServices));
//     }

//     if (!businessType) {
//       setBusinessTypeError("Please select a business type.");
//       hasError = true;
//     } else {
//       setBusinessTypeError("");
//     }
//     const sizeError = validateBusinessSize(businessSize);
//     if (sizeError) {
//       setBusinessSizeError(sizeError);
//       hasError = true;
//     } else {
//       setBusinessSizeError("");
//     }
//     const serviceError = validateServices(customBuisness);
//     if (serviceError) {
//       setErrors((prev) => ({ ...prev, customBuisness: serviceError }));
//       hasError = true;
//     } else {
//       setErrors((prev) => ({ ...prev, customBuisness: "" }));
//     }
//     if (hasError) return;
//     let businessData;
//     // No errors - proceed
//     if (businessType === "Other" && customBuisness.trim()) {
//       businessData = {
//         userId,
//         businessType: "Other",
//         customBuisness: customBuisness.trim(),
//         businessName: businessName.trim(),
//         businessSize,
//       };
//       // navigate("/about-business-next");
//     } else {
//       businessData = {
//         userId,
//         businessType,
//         businessName: businessName.trim(),
//         businessSize,
//       };

//       // navigate("/business-services");
//     }
//     sessionStorage.setItem("businessDetails", JSON.stringify(businessData));
//     onStepChange?.(1);
//   };

console.log('setBusinessType',selectedType,customBuisness)
    return (
        <>
            <EditHeader title='Edit Agent ' agentName='Sofia' />
            <div className={styles.Maindiv}>
                <div className={styles.headerWrapper}>
                    <h2 className={styles.heading}>Select Category</h2>
                    <p className={styles.subheading}>Select category     best describes your business type</p>
                    <div className={styles.tooltipIcon}>
                        
                        <Tooltip></Tooltip>

                    </div>
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
                                filteredBusinessTypes.map((item, index) => (
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
                                                checked={businessType === item.type}
                                                onChange={() => setBusinessType(item.type)}
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
                    <div className={styles.stickyWrapper} onClick={handlesave}>
                        <AnimatedButton label="Save" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditBusinessType;
