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

  useEffect(() => {
    if (sessionStorage.getItem('businessDetails')) {
      const businessDetails = JSON.parse(sessionStorage?.getItem('businessDetails'));
      setBusinessType(businessDetails?.businessType);
      setBusinessName(businessDetails?.businessName);
      setBusinessSize(businessDetails?.businessSize);
    }
  }, []);

  const businessTypes = [
    { type: 'Immigration', subtype: 'Your Journey Begins Here', icon: 'images/general.png' },
    { type: 'School', subtype: 'Empowering Future Leaders', icon: 'images/school.png' },
    { type: 'Hospital', subtype: 'Always ready to assist', icon: 'images/Hospital.png' },
    { type: 'Other', subtype: 'Always ready to assist', icon: 'images/other.png' },
  ];

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
    setBusinessNameError(validateBusinessName(val));
  };

  const handleBusinessSizeChange = (e) => {
    // Only allow digits
    let val = e.target.value.replace(/\D/g, '');
    setBusinessSize(val);
    setBusinessSizeError(validateBusinessSize(val));
  };

  const handleLoginClick = () => {
    // Validate all fields
    setBusinessTypeError('');
    setBusinessNameError('');
    setBusinessSizeError('');

    let hasError = false;

    if (!businessType) {
      setBusinessTypeError('Please select a business type.');
      hasError = true;
    }

    const nameError = validateBusinessName(businessName);
    if (nameError) {
      setBusinessNameError(nameError);
      hasError = true;
    }

    const sizeError = validateBusinessSize(businessSize);
    if (sizeError) {
      setBusinessSizeError(sizeError);
      hasError = true;
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
                onChange={(e) => {
                  setBusinessType(e.target.value);
                  setBusinessTypeError('');
                }}
              />
            </div>
          </label>
        ))}
      </div>
      {businessTypeError && <p className={styles.inlineError}>{businessTypeError}</p>}

      <div className={styles.inputGroup}>
        <label>Business Name</label>
        <input
          type="text"
          placeholder="Your Business name"
          value={businessName}
          onChange={handleBusinessNameChange}
          className={businessNameError ? styles.inputError : ''}
        />
        {businessNameError && <p className={styles.inlineError}>{businessNameError}</p>}
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
        {businessSizeError && <p className={styles.inlineError}>{businessSizeError}</p>}
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
