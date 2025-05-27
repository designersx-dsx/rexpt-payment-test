import React, { useState } from 'react';
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

    const businessTypes = [
        { type: 'Immigration', icon: 'images/general-receptionist.png' },
        { type: 'School', icon: 'images/general-receptionist.png' },
        { type: 'Company', icon: 'images/general-receptionist.png' },
        { type: 'Other', icon: 'images/general-receptionist.png' },
    ];

    const handleLoginClick = () => {
        if (!businessType) {
            setPopupType("failed")
            setPopupMessage('Please select a business type.');
            setShowPopup(true);
            return;
        }
        if (!businessName.trim()) {
            setPopupType("failed")
            setPopupMessage('Please enter the business name.');
            setShowPopup(true);
            return;
        }
        if (!businessSize.trim()) {
            setPopupType("failed")
            setPopupMessage('Please enter the number of employees.');
            setShowPopup(true);
            return;
        }

        // Store details in sessionStorage
        const businessData = {
            userId,
            businessType: businessType,
            businessName,
            businessSize,
        };

        sessionStorage.setItem('businessDetails', JSON.stringify(businessData));
        navigate('/business-locations');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Business Details</h1>
            <h2 className={styles.subtitle}>Business Type</h2>

            <div className={styles.optionList}>
                {businessTypes.map((item, index) => (
                    <label className={styles.option} key={index}>
                        <div className={styles.icon}>
                            <img src={item.icon} alt={`${item.type} icon`} className={styles.iconImg} />
                        </div>
                        <span>{item.type}</span>
                        <input
                            type="radio"
                            name="businessType"
                            value={item.type}
                            checked={businessType === item.type}
                            onChange={(e) => setBusinessType(e.target.value)}
                        />
                    </label>
                ))}
            </div>

            <div className={styles.inputGroup}>
                <label>Business Name</label>
                <input
                    type="text"
                    placeholder="Your Business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                />
            </div>

            <div className={styles.inputGroup}>
                <label>Business Size (Number of Emp.)</label>
                <input
                    type="number"
                    placeholder="Number of employees"
                    value={businessSize}
                    onChange={(e) => setBusinessSize(e.target.value)}
                />
            </div>

            <div onClick={handleLoginClick}>
                <div type="submit">
                    <div className={styles.btnTheme}>
                        <img src='images/svg-theme.svg' alt='' />
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
