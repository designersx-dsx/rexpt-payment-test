import React, { useEffect, useState } from "react";
import styles from "./AssignNumberModal.module.css";
import axios from "axios";
import { updateAgent } from "../../Store/apiStore";
import PopUp from "../Popup/Popup";
import Loader from "../Loader/Loader";
import { useDashboardStore } from "../../Store/agentZustandStore";

const AssignNumberModal = ({ isOpen, onClose, agentId, onCallApi, agentDetails,onAssignNumber }) => {
  const [loading, setLoading] = useState(false);
  const [areaCode, setAreaCode] = useState()
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setHasFetched } = useDashboardStore();
  function extractAreaCodeFromParsedPhone(phoneNumber) {
    try {
      if (!phoneNumber) return null;

      // Clean and extract area code using regex
      const match = phoneNumber.match(
        /(?:\+1[-\s.]?)?\(?(\d{3})\)?[-\s.]?\d{3}[-\s.]?\d{4}/
      );

      if (match && match[1]) {
        return match[1]; // ← this is your area code
      }

      return null;
    } catch (error) {
      console.error("Error extracting area code:", error);
      return null;
    }
  }
  const handleAssignNumber = async () => {
    try {
      if (isSubmitting) return; // Prevent multiple clicks

      setLoading(true);
      setIsSubmitting(true);
      const agentsData = JSON.parse(localStorage.getItem("agents") || "[]");

      if (!agentId) {
        throw new Error("Agent ID not found in localStorage.");
      }
      const payload = {
        inbound_agent_id: agentId,
        outbound_agent_id: agentId,
        inbound_agent_version: 0,
        outbound_agent_version: 0,
        area_code: parseInt(areaCode) || 406,
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
      const phoneNumber = response?.data?.phone_number;
      await updateAgent(agentId, { voip_numbers: [phoneNumber] });
      setPopupType("success")
      setPopupMessage(`Number ${phoneNumber} assigned and saved!`)
      onAssignNumber()
      setHasFetched(false);
    } catch (error) {
      console.log(error)
      console.error("Error assigning number:", error.response?.data || error.message);
      setPopupType("failed");
      setPopupMessage(error?.response?.data?.message || "Error assigning number");
    } finally {
      setLoading(false);
      setIsSubmitting(false);

    }
  };
  useEffect(() => {
    try {
      const businessDetails = agentDetails?.business || agentDetails
      const phoneData = JSON.parse(businessDetails?.knowledge_base_texts)
      const phoneNumber = phoneData?.phone
      const extractedCode = extractAreaCodeFromParsedPhone(phoneNumber);
      setAreaCode(extractedCode);
    } catch (err) {
      console.error("Failed to parse phone JSON:", err);
    }
  }, [agentDetails]);
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        <h2 className={styles.title}>Assign a New Number</h2>

        <p className={styles.warning}>
          <strong style={{ color: " #5a20d8" }}>Disclaimer:</strong> You will not be able to change this number before <strong>25 days</strong>
        </p>

        <p className={styles.subTitle}>You will be able to use this number as below:</p>

        <ul className={styles.list}>
          <li>1. Provide this number as your inbound support number.</li>
          <li>2. Forward calls from your current support number to this Rexpt.in number.</li>
        </ul>

        {/* <button
          className={styles.assignButton}
          onClick={handleAssignNumber}
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign Number"}
        </button> */}
        <div style={{
          pointerEvents: loading || isSubmitting ? "none" : "auto",
          opacity: loading || isSubmitting ? 0.6 : 1, // Optional: dim UI when disabled
        }}>
          <button
            className={styles.assignButton}
            onClick={handleAssignNumber}
            disabled={loading || isSubmitting}
          >
            {loading ? (
              <div className={styles.loaderWrapper}>
                <span className={styles.loadingText}>Assigning...</span>   <Loader size={17} />
              </div>
            ) : (
              "Assign Number"
            )}
          </button>
        </div>
        <p className={styles.comingSoon}>
          ✨ <strong>Coming Soon:</strong> We will provide option to choose your custom new support number.
        </p>
      </div>
      {popupMessage && (
        <PopUp
          type={popupType}
          message={popupMessage}
          onClose={() => { setPopupMessage(""); onClose(); setHasFetched(false); }}

        />
      )}
    </div>
  );
};

export default AssignNumberModal;
