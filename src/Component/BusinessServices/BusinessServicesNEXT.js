// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from '../../Component/CallTransfer/CallTransfer.module.css';
// const AboutBusinessNext = () => {
//   const navigate = useNavigate();
//   const [services, setServices] = useState(['']);
//   const [existingServices, setExistingServices] = useState([]); 
//   useEffect(() => {
//     const savedSelectedServices = JSON.parse(sessionStorage.getItem("selectedCustomServices"));
//     setExistingServices(savedSelectedServices || []);
//   }, []);

//   const handleAddService = () => {
//     setServices([...services, '']);
//   };

//   const handleServiceChange = (index, value) => {
//     const updatedServices = [...services];
//     updatedServices[index] = value;
//     setServices(updatedServices);
//   };

//   const handleSubmit = () => {
//     const combinedServices = [
//       ...existingServices, 
//       ...services.filter(service => service.trim() !== "") 
//     ];
//     sessionStorage.setItem("selectedCustomServices", JSON.stringify(combinedServices));
//     navigate("/business-locations");
//   };

//   const handleSkip = () => {
//     navigate("/business-locations");
//   };

//   return (
//     <div className={styles.CallTransferMain1}>
//       <div className={styles.headrPart}>
//         <h2>Add More Services</h2>
//         <img 
//           src="svg/Add-icon.svg" 
//           alt="Add-icon" 
//           onClick={handleAddService} 
//           className={styles.addIcon}
//         />
//       </div>

//       {/* Render the input fields for the custom services */}
//       {services.map((service, index) => (
//         <div key={index} className={styles.card}>
//           <label className={styles.label}>Service Name</label>
//           <div className={styles.phoneInput}>
//             <input
//               type="text"
//               className={styles.phoneNumberInput}
//               placeholder="Enter Your Service Name"
//               value={service}
//               onChange={(e) => handleServiceChange(index, e.target.value)}  
//             />
//           </div>
//         </div>
//       ))}

//       {/* Skip button */}
//       <div onClick={handleSkip} className={styles.skipButton}>
//         <button>Skip for now</button>
//       </div>

//       {/* Submit Button */}
//       <div className={styles.Btn}>
//         <div type="submit">
//           <div className={styles.btnTheme} onClick={handleSubmit}>
//             <img src="svg/svg-theme2.svg" alt="Submit" />
//             <p>Submit</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AboutBusinessNext;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../Component/CallTransfer/CallTransfer.module.css';
import { useAgentCreator } from '../../hooks/useAgentCreator';
import Loader from '../Loader/Loader';
import PopUp from '../Popup/Popup';

const AboutBusinessNext = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([{ service: '' }]);
    const stepEditingMode=localStorage.getItem('UpdationModeStepWise')
     const [showPopup, setShowPopup] = useState(false);
      const [popupType, setPopupType] = useState(null);
      const [Loading, setLoading] = useState(null);
        const [popupMessage, setPopupMessage] = useState("");
    const EditingMode=localStorage.getItem('UpdationMode')
    const setHasFetched=true
  const { handleCreateAgent } = useAgentCreator({
    stepValidator: () => "businesServices", // or custom validation
    setLoading,
    setPopupMessage,
    setPopupType,
    setShowPopup,
    navigate,
    setHasFetched,
  });
useEffect(() => {
  let savedServices = sessionStorage.getItem('selectedCustomServices');
  try {
    savedServices = JSON.parse(savedServices);
    if (typeof savedServices === 'string') {
      savedServices = JSON.parse(savedServices); // handle double-stringified case
    }

    if (Array.isArray(savedServices)) {
      setServices(savedServices);
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

  const handleSubmit = () => {
   const filteredServices = services
  .map(item => item.service.trim())
  .filter(service => service !== '')
  .map(service => ({ service }));

sessionStorage.setItem('selectedCustomServices', JSON.stringify(filteredServices));
    navigate('/business-locations');
  };

  const handleSkip = () => {
    navigate('/business-locations');
  };

    const handleSaveEdit = (e) => {
  e.preventDefault();
  
   const filteredServices = services
  .map(item => item.service.trim())
  .filter(service => service !== '')
  .map(service => ({ service }));

sessionStorage.setItem('selectedCustomServices', JSON.stringify(filteredServices));

  console.log('edit hit')
  handleCreateAgent();

};

const handleRemoveService = (index) => {
  const updatedServices = services.filter((_, i) => i !== index);
  setServices(updatedServices.length ? updatedServices : [{ service: '' }]);
};

  return (
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

      {services.map((item, index) => (
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
              // style={{ padding: "4px 8px", borderRadius: "4px" }}
            >
              ❌
            </button>
          )}
          </div>
        </div>
      ))}

      <div onClick={handleSkip} className={styles.skipButton}>
       {stepEditingMode ? "" : <button>Skip for now</button>} 
      </div>
      {stepEditingMode!='ON'?    
      <div className={styles.Btn}>
        <div type="submit">
          <div className={styles.btnTheme} onClick={handleSubmit}>
            <img src="svg/svg-theme2.svg" alt="Submit" />
            <p>Submit</p>
          </div>
        </div>
      </div>
      :
      <div className={styles.Btn}>
        <div type="submit">
          <div className={styles.btnTheme} onClick={handleSaveEdit}>
            <img src="svg/svg-theme2.svg" alt="Submit" />
            <p>{Loading?<Loader size={20}/> :'Save Edits'}</p>
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
  );
};

export default AboutBusinessNext;
