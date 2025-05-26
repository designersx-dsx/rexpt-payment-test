import React, { useState } from 'react';
import styles from '../Details/Details.module.css';
import { useNavigate } from 'react-router-dom';
import PopUp from '../Popup/Popup';
import axios from 'axios';
import { API_BASE_URL } from '../../Store/apiStore';
import decodeToken from '../../lib/decodeToken';
import Loader from '../Loader/Loader';

const Details = () => {
    const navigate = useNavigate();
    const [startExit, setStartExit] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const token = localStorage.getItem("token")
    const decodeTokenData = decodeToken(token)
    const userId = decodeTokenData.id
    const handleLoginClick = async () => {
        // Validation
        setLoading(true)
        if (!name.trim()) {
            setPopupType('failed');
            setPopupMessage('Name is required.');
            setShowPopup(true);
            setLoading(false)
            return;
        }
        if (!phone.trim()) {
            setPopupType('failed');
            setPopupMessage('Phone number is required.');
            setShowPopup(true);
            setLoading(false)
            return;
        }
        if (phone.length !== 10) {
            setPopupType('failed');
            setPopupMessage('Phone number must be exactly 10 digits.');
            setShowPopup(true);
            setLoading(false)
            return;
        }

        try {
            // Example update API call
            const response = await axios.put(`${API_BASE_URL}/endusers/users/${userId}`, {
                name,
                phone,
            });

            if (response.status === 200) {
                console.log(response, "75878543")
                setStartExit(true);
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
            setLoading(false)
        }
    };




    return (
        <div className={styles.pageWrapper}>

            <div className={styles.mask}>
                <img src='images/Mask.png' alt='Mask' />
            </div>

            <div className={styles.logimg}>
                <img className={styles.logo} src='images/Rexpt-Logo.png' alt='Rexpt-Logo' />
            </div>


            <div className={`${styles.Maincontent} ${startExit ? styles.fadeOut3 : ''}`}>
                <div className={styles.welcomeTitle}>
                    <h1>Personal Details</h1>
                </div>
            </div>

            <div className={`${styles.container} ${startExit ? styles.fadeOut3 : ''}`}>
                <label className={styles.label}>Name</label>
                <input type="text" className={styles.input} placeholder="Your name" value={name}
                    onChange={(e) => setName(e.target.value)} />

                <label className={styles.label}>Phone Number</label>
                <input type="tel" className={styles.input} placeholder="Phone number" value={phone}
                    onChange={(e) => setPhone(e.target.value)} />
            </div>

            {/* <p className={`${styles.codeText} ${startExit ? styles.fadeOut2 : ''}`}>Enter the send code</p> */}

            {/* <div className={`${styles.otpContainer} ${startExit ? styles.fadeOut2 : ''}`}>
                {[...Array(6)].map((_, i) => (
                    <input key={i} maxLength="1" className={styles.otpInput} />
                ))}
            </div> */}

            <div className={`${styles.Btn} ${startExit ? styles.fadeOut1 : ''}`} onClick={handleLoginClick}>
                <button type="submit">

                    {loading ? <Loader size={20} /> : (<>Login
                        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="..." fill="white" />
                        </svg></>)}
                </button>
            </div>
            {showPopup && (
                <PopUp type={popupType} onClose={() => setShowPopup(false)} message={popupMessage} />
            )}
        </div>
    );
};

export default Details;
