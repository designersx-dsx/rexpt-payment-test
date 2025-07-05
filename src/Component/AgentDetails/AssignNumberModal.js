import React, { useState } from "react";
import styles from "./AssignNumberModal.module.css";
import axios from "axios";
import { updateAgent } from "../../Store/apiStore";
import PopUp from "../Popup/Popup";

const AssignNumberModal = ({ isOpen, onClose, agentId, onCallApi }) => {
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  if (!isOpen) return null;
  const handleAssignNumber = async () => {
    try {
      setLoading(true);
      const agentsData = JSON.parse(localStorage.getItem("agents") || "[]");


      if (!agentId) {
        throw new Error("Agent ID not found in localStorage.");
      }
      const payload = {
        inbound_agent_id: agentId,
        outbound_agent_id: agentId,
        inbound_agent_version: 0,
        outbound_agent_version: 0,
        area_code: 406,
        number_provider: "twilio",
      };
      const response = await axios.post(
        "https://api.retellai.com/create-phone-number",
        payload,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Phone number created:", response.data);
      const phoneNumber = response?.data?.phone_number;

      if (!phoneNumber) {
        throw new Error("No phone number returned from Retell API.");
      }

      await updateAgent(agentId, { voip_numbers: [phoneNumber] });
      setPopupType("success")
      setPopupMessage(`Number ${phoneNumber} assigned and saved! 🎉`)
      onCallApi()
      setTimeout(() => {
        onClose()
      }, 2000);
    } catch (error) {
      console.error("Error assigning number:", error.response?.data || error.message);
      alert("Failed to assign number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        <h2 className={styles.title}>Assign a New Number</h2>

        <p className={styles.warning}>
          ⚠️ <strong style={{ color: 'red' }}>Warning:</strong> You will not be able to change this number before <strong>30 days</strong>
        </p>

        <p className={styles.subTitle}>You will be able to use this number as below:</p>

        <ul className={styles.list}>
          <li>1. Provide this number as your inbound support number.</li>
          <li>2. Forward calls from your current support number to this Rexpt.in number.</li>
        </ul>

        <button
          className={styles.assignButton}
          onClick={handleAssignNumber}
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign Number"}
        </button>

        <p className={styles.comingSoon}>
          ✨ <strong>Coming Soon:</strong> We will provide option to choose your custom new support number.
        </p>
      </div>
      {popupMessage && (
        <PopUp
          type={popupType}
          message={popupMessage}
          onClose={() => setPopupMessage("")}

        />
      )}
    </div>
  );
};

export default AssignNumberModal;
