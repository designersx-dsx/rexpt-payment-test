import React, { useEffect, useState ,forwardRef, useImperativeHandle } from 'react'
import styles from '../Step4/Step4.module.css'
import PopUp from '../Popup/Popup';
const roles = [
    {
        title: 'General Receptionist',
        description: 'Always ready to assist',
        icon: 'images/general-receptionist.png',
    },
    {
        title: 'Sales Receptionist',
        description: 'Boosting your sales calls.',
        icon: 'images/sales receptionist.png',
    },
    {
        title: 'Technical Receptionist',
        description: 'Smart support at entry.',
        icon: 'images/technical-receptionist.png',
    },
];
const Step4 =  forwardRef(({ onNext, onBack }, ref) => {
    const [selectedRole, setSelectedRole] = useState('');
      const [showPopup, setShowPopup] = useState(false);
      const [popupType, setPopupType] = useState(null);
      const [popupMessage, setPopupMessage] = useState("");
    console.log('selectedRole',selectedRole)
    useEffect(()=>{
        sessionStorage.setItem('agentRole',selectedRole)
    },[selectedRole])
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!selectedRole.trim()) {
        // Call parent showPopup to show alert
        if (showPopup) {
            setShowPopup(true)
            setPopupType("failed")
          setPopupMessage('Please select a role!');
        }
        return false;
      }
      return true;
    },
  }));
    return (
        <div className={styles.container}>
            {roles.map((role, index) => (
                <label
                    key={index}
                    className={`${styles.card} ${selectedRole === role.title ? styles.selected : ''
                        }`}
                >
                    <div className={styles.iconBox}>
                        <img src={role.icon} alt={role.title} className={styles.icon} />
                    </div>
                    <div className={styles.info}>
                        <p className={styles.title}>{role.title}</p>
                        <p className={styles.description}>{role.description}</p>
                    </div>
                    <input
                        type="radio"
                        name="receptionist"
                        value={role.title}
                        checked={selectedRole === role.title}
                        onChange={() => setSelectedRole(role.title)}
                        className={styles.radio}
                    />
                    <span className={styles.customRadio}></span>
                </label>
            ))}
             {showPopup && (
        <PopUp type={popupType} onClose={() => setShowPopup(false)} message={popupMessage} />
      )}
        </div>
    )
})

export default Step4
