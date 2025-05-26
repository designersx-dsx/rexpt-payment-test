// import React from 'react'
// import styles from '../BusinessDetails/BusinessDetails.module.css'
// import { useNavigate } from 'react-router-dom';
// import PopUp from '../Popup/Popup';

// const BusinessDetails = () => {
//     const navigate = useNavigate();
//     const [showPopup, setShowPopup] = useState(false);
//     const [popupType, setPopupType] = useState(null);
//     const [popupMessage, setPopupMessage] = useState("");
//     const [loading, setLoading] = useState(false)
//     const token = localStorage.getItem("token")
//     const decodeTokenData = decodeToken(token)
//     const userId = decodeTokenData.id
//     const handleLoginClick = () => {
//         navigate('/business-locations');
//     };
//     const businessTypes = [
//         { type: "Immigration", icon: "images/general-receptionist.png" },
//         { type: "School", icon: "images/general-receptionist.png" },
//         { type: "Immigration", icon: "images/general-receptionist.png" },
//         { type: "Other", icon: "images/general-receptionist.png" },
//     ];
//     return (
//         <div className={styles.container}>
//             <h1 className={styles.title}>Business Details</h1>
//             <h2 className={styles.subtitle}>Business Type</h2>

//             <div className={styles.optionList}>
//                 {businessTypes.map((item, index) => (
//                     <label className={styles.option} key={index}>
//                         <div className={styles.icon}>
//                             <img src={item.icon} alt={`${item.type} icon`} className={styles.iconImg} />
//                         </div>
//                         <span>{item.type}</span>
//                         <input type="radio" name="businessType" />
//                     </label>
//                 ))}
//             </div>

//             <div className={styles.inputGroup}>
//                 <label>Business Name</label>
//                 <input type="text" placeholder="Your Business name" />
//             </div>

//             <div className={styles.inputGroup}>
//                 <label>Business Size (Number of Emp.)</label>
//                 <input type="text" placeholder="Phone number" />
//             </div>
//             <div className={styles.Btn} onClick={handleLoginClick}>
//                 <button type="submit">Continue
//                     <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M14.3379 20.0391C13.9955 20.0391 13.6682 19.9595 13.3564 19.8027C12.9671 19.583 12.6561 19.2358 12.4844 18.8271C12.375 18.5441 12.2041 17.6951 12.2041 17.6797C12.0466 16.8233 11.9545 15.4716 11.9414 13.957L11.9404 13.5752C11.9404 11.9884 12.0329 10.5418 12.1729 9.59863L12.2959 9.01172C12.3641 8.70119 12.4534 8.34754 12.5469 8.16699C12.8892 7.50651 13.5589 7.09766 14.2754 7.09766H14.3379C14.803 7.11311 15.7779 7.5196 15.7861 7.53711C17.3649 8.19953 20.4105 10.1987 21.8174 11.624L22.2266 12.0527C22.3335 12.1686 22.4537 12.3062 22.5283 12.4131C22.7776 12.7433 22.9023 13.152 22.9023 13.5605C22.9023 14.0164 22.7625 14.4404 22.498 14.7871L22.0781 15.2402L21.9834 15.3369C20.707 16.7208 17.3744 18.9841 15.6309 19.6768L15.3672 19.7773C15.0505 19.8909 14.607 20.0265 14.3379 20.0391ZM5.11133 15.2051C4.21635 15.2049 3.49043 14.4721 3.49023 13.5684C3.49023 12.6645 4.21623 11.9309 5.11133 11.9307L9.10156 12.2842C9.80369 12.2844 10.373 12.8593 10.373 13.5684C10.3729 14.2784 9.80358 14.8523 9.10156 14.8525L5.11133 15.2051Z" fill="white" />
//                     </svg>
//                 </button>

//             </div>
//             {showPopup && (
//                 <PopUp type={popupType} onClose={() => setShowPopup(false)} message={popupMessage} />
//             )}
//         </div>
//     )
// }

// export default BusinessDetails


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

            <div className={styles.Btn} onClick={handleLoginClick}>
                <button type="submit">
                    Continue
                    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.3379 20.0391C13.9955 20.0391 13.6682 19.9595 13.3564 19.8027C12.9671 19.583 12.6561 19.2358 12.4844 18.8271C12.375 18.5441 12.2041 17.6951 12.2041 17.6797C12.0466 16.8233 11.9545 15.4716 11.9414 13.957L11.9404 13.5752C11.9404 11.9884 12.0329 10.5418 12.1729 9.59863L12.2959 9.01172C12.3641 8.70119 12.4534 8.34754 12.5469 8.16699C12.8892 7.50651 13.5589 7.09766 14.2754 7.09766H14.3379C14.803 7.11311 15.7779 7.5196 15.7861 7.53711C17.3649 8.19953 20.4105 10.1987 21.8174 11.624L22.2266 12.0527C22.3335 12.1686 22.4537 12.3062 22.5283 12.4131C22.7776 12.7433 22.9023 13.152 22.9023 13.5605C22.9023 14.0164 22.7625 14.4404 22.498 14.7871L22.0781 15.2402L21.9834 15.3369C20.707 16.7208 17.3744 18.9841 15.6309 19.6768L15.3672 19.7773C15.0505 19.8909 14.607 20.0265 14.3379 20.0391ZM5.11133 15.2051C4.21635 15.2049 3.49043 14.4721 3.49023 13.5684C3.49023 12.6645 4.21623 11.9309 5.11133 11.9307L9.10156 12.2842C9.80369 12.2844 10.373 12.8593 10.373 13.5684C10.3729 14.2784 9.80358 14.8523 9.10156 14.8525L5.11133 15.2051Z" fill="white" />
                    </svg>
                </button>
            </div>

            {showPopup && (
                <PopUp type={popupType} onClose={() => setShowPopup(false)} message={popupMessage} />
            )}
        </div>
    );
};

export default BusinessDetails;
