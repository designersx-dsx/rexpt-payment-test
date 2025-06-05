
import React, { useRef, useState, useEffect } from "react";
import styles from "./Widgets.module.css";
import { SendScriptToDeveloper, updateAgentWidgetDomain } from "../../Store/apiStore";
import PopUp from "../Popup/Popup";

const WidgetScript = ({ isAgentDetails }) => {
  console.log(isAgentDetails, "isAgentDetails")
  console.log(JSON.parse(isAgentDetails.agentWidgetDomain), "isAgentDetails")
  const scriptRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [domains, setDomains] = useState([]);
  console.log(domains,"domains")
  const [currentDomain, setCurrentDomain] = useState("");
  const [scriptVisible, setScriptVisible] = useState(false);
  const [domainError, setDomainError] = useState("");
  const domainRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
  useEffect(() => {
    // Show domain modal on load
    setScriptVisible(false);
  }, []);

  const scriptText = `
<script id="rex-widget-script" src="https://delicate-dango-84275c.netlify.app/index.js?agentId=${isAgentDetails.agent_id}"></script>
`;

const handleAddDomain = async () => {
  const trimmed = currentDomain.trim();
  console.log(trimmed,"HELLO")
  setDomains(trimmed); 
  setCurrentDomain("");
  setDomainError("");

  try {
    await updateAgentWidgetDomain(isAgentDetails.agent_id, domains); // ✅ send single string
  } catch (error) {
    console.error("Failed to update domain:", error);
  }
};

  const handleGenerateScript = () => {
    if (domains.length === 0) {
      alert("Please add at least one domain.");
      return;
    }
    setScriptVisible(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    const payload = {
      email,
      script: scriptText,
      domains,
    };
    try {
      const response = await SendScriptToDeveloper(payload);
      setShowPopup(true);
      setPopupType("success");
      setPopupMessage("Script sent successfully");
    } catch (error) {
      console.log(error)
      alert("A Server Error occurred while sending script to developer");
    }
    setShowModal(false);
    setEmail("");
  };

  return (
    <div className={styles.container}>
      {/* Domain Modal (Always Visible at first) */}
      {!scriptVisible && (
        <div className={styles.domainModal}>
          <h3> Enter your Website URL</h3>
          <p className={styles.noteText}>
            Note: The widget will only work on the domains you add.
          </p>
          <div className={styles.domainInputRow}>
            <input
              type="text"
              placeholder="Enter domain (e.g., example.com)"
              value={currentDomain}
              onChange={(e) => {
                setCurrentDomain(e.target.value);
                setDomainError(""); // Clear error while typing
              }}
              className={styles.inputField}
            />
            {domainError && <p style={{ color: "red" }} className={styles.errorText}>{domainError}</p>}

            <button className={styles.sendBtn} onClick={handleAddDomain}>
              Add
            </button>
          </div>
          <ul className={styles.domainList}>
            {domains}
          </ul>
          <div className={styles.modalActions}>
            <button onClick={handleGenerateScript} className={styles.sendBtn}>
              Generate Code
            </button>
          </div>
        </div>
      )}

      {/* Script Section */}
      {scriptVisible && (
        <>
          <div className={styles.scriptBox}>
            <button className={styles.copyButton} onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </button>
            <br />
            <pre ref={scriptRef} className={styles.scriptText}>
              {scriptText}
            </pre>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.emailBtn} onClick={() => setShowModal(true)}>
              Send to Developer
            </button>
          </div>
        </>
      )}

      {/* Email Modal */}
      {showModal && (
        <div className={styles.modalContainer}>
          <h3>Send to Developer</h3>
          <input
            type="email"
            placeholder="Enter developer's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
          />
          <div className={styles.modalActions}>
            <button onClick={handleSend} className={styles.sendBtn}>
              Send
            </button>
            <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Popup */}
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

export default WidgetScript;
