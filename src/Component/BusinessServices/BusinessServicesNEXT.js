import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../Component/CallTransfer/CallTransfer.module.css';
import { useAgentCreator } from '../../hooks/useAgentCreator';
import Loader from '../Loader/Loader';
import PopUp from '../Popup/Popup';
import { API_BASE_URL } from '../../Store/apiStore';
import decodeToken from '../../lib/decodeToken';
import axios from "axios"
const AboutBusinessNext = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([{ service: '' }]);
  const stepEditingMode = localStorage.getItem('UpdationModeStepWise')
  const sessionBusinessiD = sessionStorage.getItem("bId")
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [Loading, setLoading] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const EditingMode = localStorage.getItem('UpdationMode')
  const [email, setEmail] = useState("");
  // Error states
  const [emailError, setEmailError] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const setHasFetched = true
  const token = localStorage.getItem('token');
  const decodeTokenData = decodeToken(token);
  const userId = decodeTokenData?.id;
  const { handleCreateAgent } = useAgentCreator({
    stepValidator: () => "businesServices", // or custom validation
    setLoading,
    setPopupMessage,
    setPopupType,
    setShowPopup,
    navigate,
    setHasFetched,
  });
  const locationData = JSON.parse(sessionStorage.getItem('businessLocation'));
  const businessDetails = JSON.parse(sessionStorage.getItem('businessDetails'));
  // const customServices = sessionStorage.getItem('selectedCustomServices') || []; 
  const businesServices = JSON.parse(sessionStorage.getItem('businesServices'))
  const rawCustomServices = JSON.parse(sessionStorage.getItem('selectedCustomServices')) || [];
  useEffect(() => {
    let savedServices = sessionStorage.getItem('selectedCustomServices');
    try {
      savedServices = JSON.parse(savedServices);
      if (typeof savedServices === 'string') {
        savedServices = JSON.parse(savedServices);
      }

      if (Array.isArray(savedServices)) {
        setServices(savedServices);
        setEmail(businesServices.email)
      } else {
        console.warn("Custom services not an array:", savedServices);
      }
    } catch (err) {
      console.error("Error parsing selectedCustomServices:", err);
      setServices([{ service: '' }]);
    }
  }, []);

  const handleAddService = () => {
    setServices([...services, { service: '' }]);
  };

  const handleServiceChange = (index, value) => {
    const updatedServices = [...services];
    updatedServices[index].service = value;
    setServices(updatedServices);
  };

  const handleSubmit = async () => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    // Step 1: Get old businesServices (if any)
    const raw = sessionStorage.getItem("businesServices");
    let previous = {};
    try {
      previous = raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error("Failed to parse businesServices:", err);
    }
    const updatedBusinessServices = {
      ...previous,
      email,
    };
    sessionStorage.setItem("businesServices", JSON.stringify(updatedBusinessServices));
    const filteredServices = services
      .map(item => item.service.trim())
      .filter(service => service !== '')
      .map(service => ({ service }));
    try {
      setLoading(true);

      const cleanedCustomServices = rawCustomServices
        .map(item => item?.service?.trim())
        .filter(Boolean)
        .map(service => ({ service }));
      let response;
      if (localStorage.getItem('UpdationMode') != "ON") {
        response = await axios.post(`${API_BASE_URL}/businessDetails/create`, {
          userId,
          businessName: businessDetails?.businessName,
          businessSize: businessDetails.businessSize,
          businessType: businessDetails.businessType,
          customBuisness: businessDetails?.customBuisness || "",    //custome business name
          buisnessEmail: email || businessDetails?.email,
          // buisnessService: [...businessDetails?.selectedService, ...customServices],  
          buisnessService: cleanServiceArray(),
          customServices: filteredServices,
          // customServices: cleanedCustomServices,
          // address1: locationData.address1,
          // address2: locationData.address2,
          // city: locationData.city,
          // state: locationData.state,
          // country: locationData.country,
          // zip: locationData.zip,
        });
      } else {
        response = await axios.patch(`${API_BASE_URL}/businessDetails/updateBusinessDetailsByUserIDandBuisnessID/${userId}?businessId=${sessionBusinessiD}`, {
          businessName: businessDetails?.businessName,
          businessSize: businessDetails.businessSize,
          businessType: businessDetails.businessType,
          buisnessEmail: email || businessDetails?.email,
          customBuisness: businessDetails?.customBuisness || "",   //custome business name
          // buisnessService: [...businessDetails?.selectedService, ...customServices], 
          buisnessService: cleanServiceArray(),
          customServices: filteredServices,
          // customServices: cleanedCustomServices,
          // address1: locationData.address1,
          // address2: locationData.address2,
          // city: locationData.city,
          // state: locationData.state,
          // country: locationData.country,
          // zip: locationData.zip,
        });
      }

      const id = response.data.businessId;
      sessionStorage.setItem(
        'businessId',
        JSON.stringify({
          businessId: id,
        })
      );
      sessionStorage.setItem(
        'bId',
        id
      );
      setPopupType('success');
      setPopupMessage('Business details added successfully');
      setShowPopup(true);

      setTimeout(() => {
        sessionStorage.setItem('selectedCustomServices', JSON.stringify(filteredServices));
        navigate('/about-business')
      }, 2000);
    } catch (error) {
      setPopupType('failed');
      setPopupMessage('An error occurred while adding business details.');
      setShowPopup(true);
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }

  };

  const handleSkip = () => {
    // navigate('/business-locations');
    navigate('/about-business')
  };
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const filteredServices = services
      .map(item => item.service.trim())
      .filter(service => service !== '')
      .map(service => ({ service }));
    sessionStorage.setItem('selectedCustomServices', JSON.stringify(filteredServices));
    handleCreateAgent();

  };

  const handleRemoveService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices.length ? updatedServices : [{ service: '' }]);

    let filteredServices = services
      .map(item => item?.service.trim())
      .filter(service => service !== '')
      .map(service => ({ service }));

    filteredServices = services?.filter((_, i) => i !== index);
    sessionStorage.setItem('selectedCustomServices', JSON.stringify(filteredServices));
  };

  return (
    <>
      {/* <HeaderBar></HeaderBar> */}
      <div className={styles.CallTransferMain1}>

        <div className={styles.headrPart}>
          <h2>Add More Services</h2>
          <img
            src="svg/Add-icon.svg"
            alt="Add-icon"
            onClick={handleAddService}
            className={styles.addIcon}
          />
        </div>
        {businessDetails?.businessType === "Other" && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>Business Email Address</label>
            <div className={styles.phoneInput}>
              <input
                type="email"
                placeholder="Business Email Address"
                value={email}
                className={styles.phoneNumberInput}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
              />
            </div>
            {emailError && (
              <p style={{ color: 'red', marginTop: '5px' }}>{emailError}</p>
            )}
            {isEmailVerified && (
              <p style={{ color: 'green', marginTop: '5px' }}>Email verified successfully!</p>
            )}
          </div>
        )}

        {services.map((item, index) => (
          <>

            <div key={index} className={styles.card}>
              <label className={styles.label}>Service Name</label>
              <div className={styles.phoneInput}>
                <input
                  type="text"
                  className={styles.phoneNumberInput}
                  placeholder="Enter Your Service Name"
                  value={item.service}
                  onChange={(e) => handleServiceChange(index, e.target.value)}
                />
                {services.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleRemoveService(index)}

                  >
                    ❌
                  </button>
                )}
              </div>
            </div>
          </>

        ))}

        {/* <div onClick={handleSkip} className={styles.skipButton}>
          {stepEditingMode ? "" : <button>Skip for now</button>}
        </div> */}
        {stepEditingMode != 'ON' ?
          <div className={styles.Btn}>
            <div type="submit">
              <div className={styles.btnTheme} onClick={handleSubmit}>
                <img src="svg/svg-theme2.svg" alt="Submit" />
                <p>
                  <p>{Loading ? <Loader size={20} /> : ' Submit'}</p>
                </p>
              </div>
            </div>
          </div>
          :
          <div className={styles.Btn}>
            <div type="submit">
              <div className={styles.btnTheme} onClick={handleSaveEdit}>
                <img src="svg/svg-theme2.svg" alt="Submit" />
                <p>{Loading ? <Loader size={20} /> : 'Save Edits'}</p>
              </div>
            </div>
          </div>
        }
        <PopUp
          type={popupType}
          message={popupMessage}
          onClose={() => setPopupMessage("")}  // Close the popup
        />
      </div>
    </>

  );
};

export default AboutBusinessNext;

const cleanServiceArray = () => {
  try {

    let raw
    if (localStorage.getItem('UpdationMode') != "ON") {
      raw = sessionStorage.getItem('businessDetails')
    } else {
      raw = raw = sessionStorage.getItem('businessDetails')
    }
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.selectedService)) {
      return parsed.selectedService;
    } else if (typeof parsed?.selectedService === 'object' && Array.isArray(parsed.selectedService.selectedService)) {
      return parsed.selectedService.selectedService;
    }
    return [];
  } catch {
    return [];
  }
}