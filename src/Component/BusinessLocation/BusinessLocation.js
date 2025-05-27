import React, { useEffect, useState } from 'react';
import styles from '../BusinessLocation/BusinessLocation.module.css';
import { useNavigate } from 'react-router-dom';
import PopUp from '../Popup/Popup'; // import your popup component
import axios from 'axios';
import { API_BASE_URL } from '../../Store/apiStore';
import decodeToken from '../../lib/decodeToken';
const BusinessLocation = () => {
  const navigate = useNavigate();
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('error');
  const token = localStorage.getItem("token")
  const decodeTokenData = decodeToken(token)
  const userId = decodeTokenData.id
  const [countryCode, setCountryCode] = useState("us"); // default
  const [ipData, setIpData] = useState({});

    useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        // console.log("IP Location Data:", data);
        if (data && data.country_code) {
          setIpData(data);
          setCountryCode(data.country_code.toLowerCase());
        }
      } catch (err) {
        console.error("Failed to fetch IP location:", err);
      }
    };

    fetchCountryCode();
  }, []);


  const handleContinue = async () => {
    if (!state.trim()) {
      setPopupType("failed")
      setPopupMessage('Please enter the state.');
      setShowPopup(true);
      return;
    }
    if (!city.trim()) {
      setPopupType("failed")
      setPopupMessage('Please enter the city.');
      setShowPopup(true);
      return;
    }
    if (!address1.trim()) {
      setPopupType("failed")
      setPopupMessage('Please enter address line 1.');
      setShowPopup(true);
      return;
    }
    if (!address2.trim()) {
      setPopupType("failed")
      setPopupMessage('Please enter address line 2.');
      setShowPopup(true);
      return;
    }

    // Save to sessionStorage
    sessionStorage.setItem('businessLocation', JSON.stringify({
      country:ipData?.country_name || 'United States', // static value
      state,
      city,
      address1,
      address2
    }));

    const locationData = JSON.parse(sessionStorage.getItem('businessLocation'));
    const businessDetails = JSON.parse(sessionStorage.getItem('businessDetails'));
    const response = await axios.post(`${API_BASE_URL}/businessDetails/create`, {
      userId: userId,
      businessName: businessDetails.businessName
      ,
      businessSize: businessDetails.businessSize,
      businessType: businessDetails.businessType,
      address1: locationData.address1,
      address2: locationData.address2,
      city: locationData.city,
      state: locationData.state,
      country: locationData.country,
      zip: locationData.zip
    })
    setPopupType("success")
    setPopupMessage('Business details added successfully');
    setShowPopup(true);
    setTimeout(() => {
      navigate("/about-business");
    }, 2000);

  };
  return (
    <div>
      <div className={styles.container}>
        <h2 className={styles.title}>Business Location Details</h2>

        <label className={styles.label}>Country</label>
        <div className={styles.countryInput}>
          <div className={styles.countryDiv}>
            <img
              src={`https://flagcdn.com/${countryCode}.svg`}
              alt={`${ipData?.country_name} Flag`}
              className={styles.flag}
            />
          </div>
          <span>{ipData?.country_name}</span>
        </div>

        <label className={styles.label}>State</label>
        <input
          type="text"
          placeholder="State"
          className={styles.input}
          value={state}
          onChange={(e) => setState(e.target.value)}
        />

        <label className={styles.label}>City</label>
        <input
          type="text"
          placeholder="City"
          className={styles.input}
          value={ city}
          onChange={(e) => setCity(e.target.value)}
        />

        <label className={styles.label}>Address line 1</label>
        <input
          type="text"
          placeholder="First Address"
          className={styles.input}
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
        />

        <label className={styles.label}>Address line 2</label>
        <input
          type="text"
          placeholder="Second Address"
          className={styles.input}
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
        />

        <div className={styles.Btn}>
          <button type="submit" onClick={handleContinue}>
            Continue
            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="..." fill="white" />
            </svg>
          </button>
        </div>
      </div>

      {showPopup && (
        <PopUp
          type={popupType}
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default BusinessLocation;
