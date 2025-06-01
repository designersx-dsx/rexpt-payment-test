import React, { useState, useEffect } from 'react';
import styles from '../Details/Details.module.css';
import { useNavigate } from 'react-router-dom';
import PopUp from '../Popup/Popup';
import axios from 'axios';
import { API_BASE_URL } from '../../Store/apiStore';
import decodeToken from '../../lib/decodeToken';
import Loader from '../Loader/Loader';
import useUser from '../../Store/Context/UserContext';

const Details = () => {
  const navigate = useNavigate();
  const [startExit, setStartExit] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);

  const token = localStorage.getItem('token');
  const decodeTokenData = decodeToken(token);
  const userId = decodeTokenData?.id;
  const { user, setUser } = useUser()
  useEffect(() => {
    if (sessionStorage.getItem('OwnerDetails')) {
      const ownerDetails = JSON.parse(sessionStorage.getItem('OwnerDetails'));
      setName(ownerDetails.name || '');
      setPhone(ownerDetails.phone || '');
    }
  }, []);

  const containsEmoji = (text) => {
    return /[\p{Emoji_Presentation}\u200d]/u.test(text);
  };

  const validateName = (value) => {
    if (!value.trim()) return 'Name is required.';
    if (containsEmoji(value)) return 'Emojis are not allowed in the name.';
    if (/[^a-zA-Z\s.'-]/.test(value)) return 'Name contains invalid characters.';
    if (value.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  };

  const validatePhone = (value) => {
    if (!value.trim()) return 'Phone number is required.';
    if (!/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits.';
    return '';
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);

    // Show error only if submitted once
    if (nameSubmitted) {
      setNameError(validateName(val));
    } else {
      setNameError('');
    }
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    setPhone(val);

    if (phoneSubmitted) {
      setPhoneError(validatePhone(val));
    } else {
      setPhoneError('');
    }
  };

  const handleLoginClick = async () => {
    setNameSubmitted(true);
    setPhoneSubmitted(true);

    const nError = validateName(name);
    const pError = validatePhone(phone);

    setNameError(nError);
    setPhoneError(pError);

    if (nError || pError) return;

    setLoading(true);

    try {
      const response = await axios.put(`${API_BASE_URL}/endusers/users/${userId}`, {
        name: name.trim(),
        phone,
      });

      if (response.status === 200) {
        setStartExit(true);
        sessionStorage.setItem('OwnerDetails', JSON.stringify({ name: name.trim(), phone }));
        setUser({ name: name })
        setTimeout(() => {
          navigate('/business-details');
        }, 2000);
      } else {
        setPopupType('failed');
        setPopupMessage('Update failed. Please try again.');
        setShowPopup(true);
      }
    } catch (error) {
      setPopupType('failed');
      setPopupMessage('An error occurred during update.');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mask}>
        <img src="images/Mask.png" alt="Mask" />
      </div>

      <div className={styles.logimg}>
        <img className={styles.logo} src="svg/Rexpt-Logo.svg" alt="Rexpt-Logo" />
      </div>

      <div
        className={`${styles.Maincontent} ${styles.animate1} ${startExit ? styles.fadeOut3 : ''}`}
      >
        <div className={styles.welcomeTitle}>
          <h1>Personal Details</h1>
        </div>
      </div>

      <div
        className={`${styles.container} ${styles.animate2} ${startExit ? styles.fadeOut3 : ''}`}
      >
        <div className={styles.labReq} >
          <div className={styles.Dblock} >
            <label className={styles.label}>Name</label>
            <input
              type="text"
              className={`${styles.input} ${nameError ? styles.inputError : ''}`}
              placeholder="Your name"
              value={name}
              onChange={handleNameChange}
            />
          </div>
          {nameError && <p className={styles.inlineError}>{nameError}</p>}
        </div>
        <div className={styles.labReq} >
          <div className={styles.Dblock} >

            <label className={styles.label}>Phone Number</label>
            <input
              type="tel"
              className={`${styles.input} ${phoneError ? styles.inputError : ''}`}
              placeholder="Phone number"
              value={phone}
              maxLength={10}
              onChange={handlePhoneChange}
              inputMode="numeric"
            />
          </div>

          {phoneError && <p className={styles.inlineError}>{phoneError}</p>}
        </div>
      </div>


      <div
        className={`${styles.Btn} ${styles.animate3} ${startExit ? styles.fadeOut1 : ''}`}
        onClick={handleLoginClick}
      >
        <div type="submit">
          <div className={styles.btnTheme}>
            <img src="images/svg-theme.svg" alt="" />
            <p>{loading ? <Loader size={20} /> : 'Continue'}</p>
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

export default Details;
