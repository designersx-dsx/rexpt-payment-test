import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../Component/CallTransfer/CallTransfer.module.css';

const AboutBusinessNext = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState(['']);
  const [existingServices, setExistingServices] = useState([]); 

  useEffect(() => {
    const savedSelectedServices = JSON.parse(sessionStorage.getItem("selectedServices"));
    setExistingServices(savedSelectedServices || []);
  }, []);

  const handleAddService = () => {
    setServices([...services, '']);
  };

  const handleServiceChange = (index, value) => {
    const updatedServices = [...services];
    updatedServices[index] = value;
    setServices(updatedServices);
  };

  const handleSubmit = () => {
    const combinedServices = [
      ...existingServices, 
      ...services.filter(service => service.trim() !== "") 
    ];
    sessionStorage.setItem("selectedServices", JSON.stringify(combinedServices));
    navigate("/business-locations");
  };

  const handleSkip = () => {
    navigate("/business-locations");
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

      {/* Render the input fields for the custom services */}
      {services.map((service, index) => (
        <div key={index} className={styles.card}>
          <label className={styles.label}>Service Name</label>
          <div className={styles.phoneInput}>
            <input
              type="text"
              className={styles.phoneNumberInput}
              placeholder="Enter Your Service Name"
              value={service}
              onChange={(e) => handleServiceChange(index, e.target.value)}  
            />
          </div>
        </div>
      ))}

      {/* Skip button */}
      <div onClick={handleSkip} className={styles.skipButton}>
        <button>Skip for now</button>
      </div>

      {/* Submit Button */}
      <div className={styles.Btn}>
        <div type="submit">
          <div className={styles.btnTheme} onClick={handleSubmit}>
            <img src="svg/svg-theme2.svg" alt="Submit" />
            <p>Submit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutBusinessNext;
