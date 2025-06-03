import React, { useRef, useState } from "react";
import styles from "./Widgets.module.css";
import { SendScriptToDeveloper, updateAgentWidgetDomain } from "../../Store/apiStore";
import PopUp from "../Popup/Popup";

const WidgetScript = ({ isAgentDetails }) => {
  const scriptRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [domains, setDomains] = useState([]);
  console.log(domains)
  const [currentDomain, setCurrentDomain] = useState("");
  const [actionType, setActionType] = useState(""); // "copy" or "send"

  const scriptText = `
<body>
  <div id="review-widget"></div>
  <script id="rex-widget-script" src="https://683f0cc188b34b4460f08d83--mellow-vacherin-b51e16.netlify.app/index.js?agentId=${isAgentDetails.agent_id}"></script>
</body>`;

  const openDomainModal = (type) => {
    setActionType(type);
    setShowDomainModal(true);
  };

  const handleAddDomain = async () => {
  const trimmed = currentDomain.trim();
  if (trimmed && !domains.includes(trimmed)) {
    const updatedDomains = [...domains, trimmed]; // Create updated array
    setDomains(updatedDomains);                   // Update state
    setCurrentDomain("");                         // Clear input

    console.log("Updated Domains:", updatedDomains);

    // Send updated array to API
    try {
      const response = await updateAgentWidgetDomain(isAgentDetails.agent_id, updatedDomains);
    } catch (error) {
      console.error("Failed to update domains:", error);
    }
  }
};


  const handleDomainContinue = () => {
    if (domains.length === 0) {
      alert("Please add at least one domain.");
      return;
    }

    setShowDomainModal(false);

    if (actionType === "copy") {
      handleCopyConfirmed();
    } else if (actionType === "send") {
      setShowModal(true);
    }
  };

  const handleCopyConfirmed = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSend = async () => {
    const payload = {
      email,
      script: scriptText,
      domains,
    };
    try {
      const response = await SendScriptToDeveloper(payload);
      console.log("send script", response);
      setShowPopup(true);
      setPopupType("success");
      setPopupMessage("Script sent");
    } catch (error) {
      alert("A Server Error occurred while sending script to developer");
    }

    setShowModal(false);
    setEmail("");
  };

  return (
    <div className={styles.container}>
      {!showModal && !showDomainModal && (
        <>
          <div className={styles.scriptBox}>
            <button className={styles.copyButton} onClick={() => openDomainModal("copy")}>
              {copied ? "Copied!" : "Copy"}
            </button>
            <br />
            <br />
            <pre ref={scriptRef} className={styles.scriptText}>
              {scriptText}
            </pre>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.emailBtn} onClick={() => openDomainModal("send")}>
              Send to developer
            </button>
          </div>
        </>
      )}
      {showModal && !showDomainModal && (
        <>
          <h3>Send to Developer</h3>
          <input
            type="email"
            placeholder="Enter developer's email"
            value={email}
            onChange={handleEmailChange}
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
        </>
      )}
      {/* Domain Modal */}
      {showDomainModal && (
        <div className={styles.domainModal}>
          <h3>Add Domain(s)</h3>
          <p className={styles.noteText}>
            Note: The widget will only work on the domains you add.
          </p>
          <div className={styles.domainInputRow}>
            <input
              type="text"
              placeholder="Enter domain (e.g., example.com)"
              value={currentDomain}
              onChange={(e) => setCurrentDomain(e.target.value)}
              className={styles.inputField}
            />
            <button className={styles.addDomainBtn} onClick={handleAddDomain}>
              Add
            </button>
          </div>
          <ul className={styles.domainList}>
            {domains.map((domain, index) => (
              <li key={index}>{domain}</li>
            ))}
          </ul>
          <div className={styles.modalActions}>
            <button onClick={handleDomainContinue} className={styles.sendBtn}>
              Continue
            </button>
            <button onClick={() => setShowDomainModal(false)} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </div>
      )}

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
