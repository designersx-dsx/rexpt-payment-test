import React, { useEffect, useState } from 'react';
import styles from '../BusinessLocation/BusinessLocation.module.css';
import { useNavigate } from 'react-router-dom';
import PopUp from '../Popup/Popup';
import axios from 'axios';
import { API_BASE_URL } from '../../Store/apiStore';
import decodeToken from '../../lib/decodeToken';

const BusinessLocation = () => {
  const navigate = useNavigate();
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  // Inline validation error states
  const [stateError, setStateError] = useState('');
  const [cityError, setCityError] = useState('');
  const [address1Error, setAddress1Error] = useState('');
  const [address2Error, setAddress2Error] = useState('');

  // Submission flags
  const [stateSubmitted, setStateSubmitted] = useState(false);
  const [citySubmitted, setCitySubmitted] = useState(false);
  const [address1Submitted, setAddress1Submitted] = useState(false);
  const [address2Submitted, setAddress2Submitted] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('error');

  const token = localStorage.getItem('token');
  const decodeTokenData = decodeToken(token);
  const userId = decodeTokenData?.id;

  const [countryCode, setCountryCode] = useState('');
  const [ipData, setIpData] = useState({});

  useEffect(() => {
    const businessLocation = JSON.parse(sessionStorage.getItem('businessLocation'));
    if (businessLocation) {
      setState(businessLocation.state || '');
      setCity(businessLocation.city || '');
      setAddress1(businessLocation.address1 || '');
      setAddress2(businessLocation.address2 || '');
    }
  }, []);

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const res = await axios.get('https://ipwho.is/');
        const data = res?.data;
        if (data && data.country_code) {
          setIpData(data);
          setCountryCode(data.country_code.toLowerCase());
        }
      } catch (err) {
        console.error('Failed to fetch IP location:', err);
      }
    };
    fetchCountryCode();
  }, []);

  const containsEmoji = (text) => {
    return /[\p{Emoji_Presentation}\u200d]/u.test(text);
  };

  const validateState = (value) => {
    if (!value.trim()) return 'State is required.';
    if (containsEmoji(value)) return 'Emojis are not allowed in state.';
    if (/[^a-zA-Z\s.-]/.test(value)) return 'State contains invalid characters.';
    return '';
  };

  const validateCity = (value) => {
    if (!value.trim()) return 'City is required.';
    if (containsEmoji(value)) return 'Emojis are not allowed in city.';
    if (/[^a-zA-Z\s.-]/.test(value)) return 'City contains invalid characters.';
    return '';
  };

  const validateAddress = (value, fieldName) => {
    if (!value.trim()) return `${fieldName} is required.`;
    if (containsEmoji(value)) return `Emojis are not allowed in ${fieldName.toLowerCase()}.`;
    if (/[^a-zA-Z0-9\s,.\-#/]/.test(value))
      return `${fieldName} contains invalid characters.`;
    return '';
  };

  const handleStateChange = (e) => {
    const val = e.target.value;
    setState(val);
    if (stateSubmitted) setStateError(validateState(val));
    else setStateError('');
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    setCity(val);
    if (citySubmitted) setCityError(validateCity(val));
    else setCityError('');
  };

  const handleAddress1Change = (e) => {
    const val = e.target.value;
    setAddress1(val);
    if (address1Submitted) setAddress1Error(validateAddress(val, 'Address line 1'));
    else setAddress1Error('');
  };

  const handleAddress2Change = (e) => {
    const val = e.target.value;
    setAddress2(val);
    if (address2Submitted) setAddress2Error(validateAddress(val, 'Address line 2'));
    else setAddress2Error('');
  };

  const handleContinue = async () => {
    setStateSubmitted(true);
    setCitySubmitted(true);
    setAddress1Submitted(true);
    setAddress2Submitted(true);

    const sError = validateState(state);
    const cError = validateCity(city);
    const a1Error = validateAddress(address1, 'Address line 1');
    const a2Error = validateAddress(address2, 'Address line 2');

    setStateError(sError);
    setCityError(cError);
    setAddress1Error(a1Error);
    setAddress2Error(a2Error);

    if (sError || cError || a1Error || a2Error) return;

    sessionStorage.setItem(
      'businessLocation',
      JSON.stringify({
        country: ipData?.country_name || 'United States',
        state: state.trim(),
        city: city.trim(),
        address1: address1.trim(),
        address2: address2.trim(),
      })
    );

    try {
      const locationData = JSON.parse(sessionStorage.getItem('businessLocation'));
      const businessDetails = JSON.parse(sessionStorage.getItem('businessDetails'));

      const response = await axios.post(`${API_BASE_URL}/businessDetails/create`, {
        userId,
        businessName: businessDetails?.businessName,
        businessSize: businessDetails.businessSize,
        businessType: businessDetails.businessType,
        address1: locationData.address1,
        address2: locationData.address2,
        city: locationData.city,
        state: locationData.state,
        country: locationData.country,
        zip: locationData.zip,
      });

      const id = response.data.businessId;
      sessionStorage.setItem(
        'businessId',
        JSON.stringify({
          businessId: id,
        })
      );

      setPopupType('success');
      setPopupMessage('Business details added successfully');
      setShowPopup(true);

      setTimeout(() => {
        navigate('/about-business');
      }, 2000);
    } catch (error) {
      setPopupType('failed');
      setPopupMessage('An error occurred while adding business details.');
      setShowPopup(true);
      console.error(error);
    }
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
              alt={`${ipData?.country} Flag`}
              className={styles.flag}
            />
          </div>
          <span>{ipData?.country}</span>
        </div>

        <label className={styles.label}>State</label>
        <input
          type="text"
          placeholder="State"
          className={`${styles.input} ${stateError ? styles.inputError : ''}`}
          value={state}
          onChange={handleStateChange}
        />
        {stateError && <p className={styles.inlineError}>{stateError}</p>}

        <label className={styles.label}>City</label>
        <input
          type="text"
          placeholder="City"
          className={`${styles.input} ${cityError ? styles.inputError : ''}`}
          value={city}
          onChange={handleCityChange}
        />
        {cityError && <p className={styles.inlineError}>{cityError}</p>}

        <label className={styles.label}>Address line 1</label>
        <input
          type="text"
          placeholder="First Address"
          className={`${styles.input} ${address1Error ? styles.inputError : ''}`}
          value={address1}
          onChange={handleAddress1Change}
        />
        {address1Error && <p className={styles.inlineError}>{address1Error}</p>}

        <label className={styles.label}>Address line 2</label>
        <input
          type="text"
          placeholder="Second Address"
          className={`${styles.input} ${address2Error ? styles.inputError : ''}`}
          value={address2}
          onChange={handleAddress2Change}
        />
        {address2Error && <p className={styles.inlineError}>{address2Error}</p>}

        <div>
          <div type="submit" onClick={handleContinue}>
            <div className={styles.btnTheme}>
              <img src="images/svg-theme.svg" alt="" />
              <p>Continue</p>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <PopUp type={popupType} message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default BusinessLocation;
