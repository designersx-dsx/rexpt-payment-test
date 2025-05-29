import React, { useEffect, useState } from 'react';
import styles from '../BusinessDetails/BusinessDetails.module.css';
import { useNavigate } from 'react-router-dom';
import PopUp from '../Popup/Popup';
import decodeToken from '../../lib/decodeToken';

const BusinessDetails = () => {
  const navigate = useNavigate();
  const [businessType, setBusinessType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessSize, setBusinessSize] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const token = localStorage.getItem('token');
  const decodeTokenData = decodeToken(token);
  const userId = decodeTokenData?.id;

  const [businessNameError, setBusinessNameError] = useState('');
  const [businessSizeError, setBusinessSizeError] = useState('');
  const [businessTypeError, setBusinessTypeError] = useState('');

  // Submission state trackers
  const [businessTypeSubmitted, setBusinessTypeSubmitted] = useState(false);
  const [businessNameSubmitted, setBusinessNameSubmitted] = useState(false);
  const [businessSizeSubmitted, setBusinessSizeSubmitted] = useState(false);
  
  const businessTypes = [
    { type: 'Immigration', subtype: 'Your Journey Begins Here', icon: 'images/general.png' },
    { type: 'School', subtype: 'Empowering Future Leaders', icon: 'images/school.png' },
    { type: 'Hospital', subtype: 'Always ready to assist', icon: 'images/Hospital.png' },
    { type: 'Other', subtype: 'Always ready to assist', icon: 'images/other.png' },
  ];

  useEffect(() => {
    if (sessionStorage.getItem('businessDetails')) {
      const businessDetails = JSON.parse(sessionStorage?.getItem('businessDetails'));
      setBusinessType(businessDetails?.businessType);
      setBusinessName(businessDetails?.businessName);
      setBusinessSize(businessDetails?.businessSize);
    }
  }, []);

  const containsEmoji = (text) => {
    return /[\p{Emoji_Presentation}\u200d]/u.test(text);
  };

  const validateBusinessName = (value) => {
    if (!value.trim()) return 'Business name is required.';
    if (containsEmoji(value)) return 'Emojis are not allowed in business name.';
    if (/[^a-zA-Z0-9\s.'-]/.test(value)) return 'Business name contains invalid characters.';
    if (value.trim().length < 2) return 'Business name must be at least 2 characters.';
    return '';
  };

  const validateBusinessSize = (value) => {
    if (!value.trim()) return 'Business size is required.';
    if (!/^\d+$/.test(value)) return 'Business size must be a positive whole number.';
    if (parseInt(value, 10) <= 0) return 'Business size must be greater than zero.';
    return '';
  };

  const handleBusinessNameChange = (e) => {
    const val = e.target.value;
    setBusinessName(val);
    if (businessNameSubmitted) {
      setBusinessNameError(validateBusinessName(val));
    } else {
      setBusinessNameError('');
    }
  };

  const handleBusinessSizeChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    setBusinessSize(val);
    if (businessSizeSubmitted) {
      setBusinessSizeError(validateBusinessSize(val));
    } else {
      setBusinessSizeError('');
    }
  };

  const handleBusinessTypeChange = (e) => {
    setBusinessType(e.target.value);
    if (businessTypeSubmitted) {
      setBusinessTypeError('');
    }
  };

  const handleLoginClick = () => {
    // Mark all as submitted to show errors
    setBusinessTypeSubmitted(true);
    setBusinessNameSubmitted(true);
    setBusinessSizeSubmitted(true);

    // Validate all fields
    let hasError = false;

    if (!businessType) {
      setBusinessTypeError('Please select a business type.');
      hasError = true;
    } else {
      setBusinessTypeError('');
    }

    const nameError = validateBusinessName(businessName);
    if (nameError) {
      setBusinessNameError(nameError);
      hasError = true;
    } else {
      setBusinessNameError('');
    }

    const sizeError = validateBusinessSize(businessSize);
    if (sizeError) {
      setBusinessSizeError(sizeError);
      hasError = true;
    } else {
      setBusinessSizeError('');
    }

    if (hasError) return;

    // No errors - proceed
    const businessData = {
      userId,
      businessType,
      businessName: businessName.trim(),
      businessSize,
    };

    sessionStorage.setItem('businessDetails', JSON.stringify(businessData));
    navigate('/business-locations');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Business Details</h1>
      <h2 className={styles.subtitle}>Select Type</h2>

      <div className={styles.optionList}>
        {businessTypes.map((item, index) => (
          <label className={styles.option} key={index}>
            <div className={styles.forflex}>
              <div className={styles.icon}>
                <img src={item.icon} alt={`${item.type} icon`} className={styles.iconImg} />
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
        ))}
      </div>
      {businessTypeSubmitted && businessTypeError && (
        <p className={styles.inlineError}>{businessTypeError}</p>
      )}

      <div className={styles.inputGroup}>
        <label>Business Name</label>
        <input
          type="text"
          placeholder="Your Business name"
          value={businessName}
          onChange={handleBusinessNameChange}
          className={businessNameError ? styles.inputError : ''}
        />
        {businessNameSubmitted && businessNameError && (
          <p className={styles.inlineError}>{businessNameError}</p>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label>Business Size (Number of Emp.)</label>
        <input
          type="text"
          placeholder="Number of employees"
          value={businessSize}
          onChange={handleBusinessSizeChange}
          maxLength={5}
          className={businessSizeError ? styles.inputError : ''}
          inputMode="numeric"
        />
        {businessSizeSubmitted && businessSizeError && (
          <p className={styles.inlineError}>{businessSizeError}</p>
        )}
      </div>

      <div onClick={handleLoginClick}>
        <div type="submit">
          <div className={styles.btnTheme}>
            <img src="images/svg-theme.svg" alt="" />
            <p>Continue</p>
          </div>
        </div>
      </div>

      {showPopup && (
        <PopUp type={popupType} onClose={() => setShowPopup(false)} message={popupMessage} />
      )}
    </div>
  );
};

export default BusinessDetails;
