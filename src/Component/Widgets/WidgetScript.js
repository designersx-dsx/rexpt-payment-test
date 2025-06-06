
// import React, { useRef, useState, useEffect } from "react";
// import styles from "./Widgets.module.css";
// import { SendScriptToDeveloper, updateAgentWidgetDomain } from "../../Store/apiStore";
// import PopUp from "../Popup/Popup";
// const WidgetScript = ({ isAgentDetails, refreshFuntion }) => {
//   console.log(isAgentDetails)
//   const scriptRef = useRef(null);
//   const [copied, setCopied] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [email, setEmail] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupType, setPopupType] = useState(null);
//   const [popupMessage, setPopupMessage] = useState("");
//   const [domains, setDomains] = useState("");
//   const [currentDomain, setCurrentDomain] = useState("");
//   const [scriptVisible, setScriptVisible] = useState(false);
//   const [domainError, setDomainError] = useState("");
//   const [existingDomain, setExistingDomain] = useState([])
//   const domainRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
//   useEffect(() => {
//     setScriptVisible(false);
//   }, []);
//   const scriptText = `
// <script id="rex-widget-script" src="https://fascinating-lollipop-32d85d.netlify.app/index.js?agentId=${isAgentDetails.agent_id}"></script>
// `;
//   const handleAddDomain = async () => {
//     const trimmed = currentDomain.trim();
//     // if (!trimmed) {
//     //   setDomainError("Domain cannot be empty");
//     //   return;
//     // }

//     // if (!domainRegex.test(trimmed)) {
//     //   setDomainError("Invalid domain format");
//     //   return;
//     // }
//     // Add to domains array (avoid duplicates)
//     const url = (trimmed)
//     // Update state first
//     setDomains(url);
//     setCurrentDomain("");
//     setDomainError("");

//     try {
//       // Send updated array to backend
//       await updateAgentWidgetDomain(isAgentDetails.agent_id, url);
//       refreshFuntion()
//     } catch (error) {
//       console.error("Failed to update domain:", error);
//       setDomainError("Failed to update domain");
//     }
//   };
//   const handleGenerateScript = () => {
//     if (domains.length === 0) {
//       alert("Please add at least one domain.");
//       return;
//     }
//     setScriptVisible(true);
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(scriptText);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleSend = async () => {
//     const payload = {
//       email,
//       script: scriptText,
//       domains,
//     };
//     try {
//       const response = await SendScriptToDeveloper(payload);
//       setShowPopup(true);
//       setPopupType("success");
//       setPopupMessage("Script sent successfully");
//     } catch (error) {
//       console.log(error)
//       alert("A Server Error occurred while sending script to developer");
//     }
//     setShowModal(false);
//     setEmail("");
//   };
//   useEffect(() => {
//     if (typeof isAgentDetails.agentWidgetDomain === "string") {
//       try {
//         const parsed = JSON.parse(isAgentDetails.agentWidgetDomain);
//         setExistingDomain(parsed);
//       } catch (error) {
//         console.error("Failed to parse agentWidgetDomain", error);
//         setExistingDomain([]);
//       }
//     } else if (Array.isArray(isAgentDetails.agentWidgetDomain)) {
//       setExistingDomain(isAgentDetails.agentWidgetDomain);
//     } else {
//       setExistingDomain([]);
//     }
//   }, [isAgentDetails])
//   return (
//     <div className={styles.container}>
//       {!scriptVisible && (
//         <div className={styles.domainModal}>
//           {existingDomain ? "" : <div>
//             <h2>Already Domain Exist </h2>
//             <ul className={styles.domainList}>
//               {existingDomain.map((d, i) => (
//                 <li key={`existing-${i}`}>{d.domain}</li>
//               ))}
//             </ul>
//           </div>}
//           {existingDomain ? "" : <div>
//             <h3> Enter your Website URL</h3>
//             <p className={styles.noteText}>
//               Note: The widget will only work on the domains you add.
//             </p>
//             <div className={styles.domainInputRow}>
//               <input
//                 type="text"
//                 placeholder="Enter domain (e.g., example.com)"
//                 value={currentDomain}
//                 onChange={(e) => {
//                   setCurrentDomain(e.target.value);
//                   setDomainError(""); // Clear error while typing
//                 }}
//                 className={styles.inputField}
//               />
//               {domainError && <p style={{ color: "red" }} className={styles.errorText}>{domainError}</p>}

//               <button className={styles.sendBtn} onClick={handleAddDomain}>
//                 Add
//               </button>
//             </div>

//             <ul className={styles.domainList}>
//               {domains && <li>{domains}</li>}
//             </ul>

//             <div className={styles.modalActions}>
//               <button onClick={handleGenerateScript} className={styles.sendBtn}>
//                 Generate Code
//               </button>
//             </div>
//           </div>}
//         </div>

//       )}

//       <br />
//       {/* Script Section */}
//       { existingDomain.length<0? (
//         <>
//          <h3> Enter your Website URL</h3>
//             <p className={styles.noteText}>
//               Note: The widget will only work on the domains you add.
//             </p>
//             <div className={styles.domainInputRow}>
//               <input
//                 type="text"
//                 placeholder="Enter domain (e.g., example.com)"
//                 value={currentDomain}
//                 onChange={(e) => {
//                   setCurrentDomain(e.target.value);
//                   setDomainError(""); // Clear error while typing
//                 }}
//                 className={styles.inputField}
//               />
//               {domainError && <p style={{ color: "red" }} className={styles.errorText}>{domainError}</p>}

//               <button className={styles.sendBtn} onClick={handleAddDomain}>
//                 Add
//               </button>
//             </div>

//           {/* <div>
//             <div className={styles.scriptBox}>
//               <button className={styles.copyButton} onClick={handleCopy}>
//                 {copied ? "Copied!" : "Copy"}
//               </button>
//               <br />
//               <pre ref={scriptRef} className={styles.scriptText}>
//                 {scriptText}
//               </pre>
//             </div>

//             <div className={styles.actionButtons}>
//               <button className={styles.emailBtn} onClick={() => {
//                 setShowModal(true);
//                 setScriptVisible(false);

//               }}>
//                 Send to Developer
//               </button>
//             </div>
//           </div> */}
//         </>
//       ) : <div>
//         <div className={styles.scriptBox}>
//           <button className={styles.copyButton} onClick={handleCopy}>
//             {copied ? "Copied!" : "Copy"}
//           </button>
//           <br />
//           <pre ref={scriptRef} className={styles.scriptText}>
//             {scriptText}
//           </pre>
//         </div>

//         <div className={styles.actionButtons}>
//           <button className={styles.emailBtn} onClick={() => {
//             setShowModal(true);
//             setScriptVisible(false);

//           }}>
//             Send to Developer
//           </button>
//         </div>
//       </div>}
//       <br />
//       {/* Email Modal */}
//       {showModal && (
//         <div className={styles.modalContainer}>
//           <h3>Send to Developer</h3>
//           <input
//             type="email"
//             placeholder="Enter developer's email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className={styles.inputField}
//           />
//           <div className={styles.modalActions}>
//             <button onClick={handleSend} className={styles.sendBtn}>
//               Send
//             </button>
//             <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Popup */}
//       {showPopup && (
//         <PopUp
//           type={popupType}
//           onClose={() => setShowPopup(false)}
//           message={popupMessage}
//         />
//       )}
//     </div>
//   );
// };

// export default WidgetScript;

import React, { useRef, useState, useEffect } from "react";
import styles from "./Widgets.module.css";
import { API_BASE_URL, SendScriptToDeveloper, updateAgentWidgetDomain } from "../../Store/apiStore";
import PopUp from "../Popup/Popup";

const WidgetScript = ({ isAgentDetails, refreshFuntion,alertPopUp }) => {
  const scriptRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [currentDomain, setCurrentDomain] = useState("");
  const [domainError, setDomainError] = useState("");
  const [existingDomain, setExistingDomain] = useState([]);
  const [showDomainInput, setShowDomainInput] = useState(false); // for Add More
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState("");
  
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };
  const domainRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

  const scriptText = `
<script id="rex-widget-script" src="https://gilded-pie-8b3125.netlify.app/index.js?agentId=${isAgentDetails.agent_id}"></script>
`;

  useEffect(() => {
    if (typeof isAgentDetails.agentWidgetDomain === "string") {
      try {
        const parsed = JSON.parse(isAgentDetails.agentWidgetDomain);
        setExistingDomain(parsed);
      } catch {
        setExistingDomain([]);
      }
    } else if (Array.isArray(isAgentDetails.agentWidgetDomain)) {
      setExistingDomain(isAgentDetails.agentWidgetDomain);
    }
  }, [isAgentDetails]);
  const handleAddDomain = async () => {
    const trimmed = currentDomain.trim();
    if (!trimmed) {
      setDomainError("Domain cannot be empty");
      return;
    }

    if (!domainRegex.test(trimmed)) {
      setDomainError("Invalid domain format");
      return;
    }

    const updatedDomains = [...existingDomain, { domain: trimmed }];
    try {
      await updateAgentWidgetDomain(isAgentDetails.agent_id, trimmed);
      setExistingDomain(updatedDomains);
      setCurrentDomain("");
      setDomainError("");
      setShowDomainInput(false); // hide input after successful add
      refreshFuntion();
    } catch (error) {
      setDomainError("Failed to update domain");
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleAddEmails = () => {
    const rawEmails = emailInput.split(",").map(e => e.trim()).filter(e => e);
    const validEmails = rawEmails.filter(validateEmail);
    const invalidEmails = rawEmails.filter(e => !validateEmail(e));

    if (invalidEmails.length > 0) {
      setError(`Invalid email(s): ${invalidEmails.join(", ")}`);
      return;
    }

    setEmails([...emails, ...validEmails]);
    setEmailInput("");
    setError("");
  };
  const handleDelete = (index) => {
    const updated = [...emails];
    updated.splice(index, 1);
    setEmails(updated);
  };

  const handleSend = async () => {
    if (emails.length === 0) {
      setError("Please add at least one valid email.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/agent/sendScriptToEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emails, script: scriptText }),
      });

      const result = await res.json();
      alertPopUp("true","Script sent successfully!","success")
      
      // alert(result.msg || "Script sent!");
      setEmails([]);
    } catch (err) {
      // alert("Failed to send emails");
       alertPopUp("true","Script sent successfully!","fail")
      console.error(err);
    }
  };

  const renderDomainInput = () => (
    <div>
      <h3>Enter your Website URL</h3>
      <p className={styles.noteText}>Note: The widget will only work on the domains you add.</p>
      <div className={styles.domainInputRow}>
        <input
          type="text"
          placeholder="e.g., https://example.com"
          value={currentDomain}
          onChange={(e) => {
            setCurrentDomain(e.target.value);
            setDomainError("");
          }}
          className={styles.inputField}
        />
        <button className={styles.sendBtn} onClick={handleAddDomain}>Add</button>
      </div>
      {domainError && <p style={{ color: "red" }}>{domainError}</p>}
    </div>
  );
  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
  };
  return (
    <div className={styles.container}>
      {/* No domain yet: Show input form */}
      {existingDomain.length === 0 && renderDomainInput()}

      {/* Domain exists: show script & buttons */}
      {existingDomain.length > 0 && (
        <>
          <h2>Widget Script</h2>
          <div className={styles.domainList}>
            <strong>Allowed Domains:</strong>
            <ul>
              {existingDomain.map((d, i) => (
                <li key={`d-${i}`}>{d.domain}</li>
              ))}
            </ul>
          </div>

          {showDomainInput && renderDomainInput()}

          <div className={styles.scriptBox}>
            <button className={styles.copyButton} onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </button>
            <br />
            <pre ref={scriptRef} className={styles.scriptText}>{scriptText}</pre>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.emailBtn} onClick={() => setShowModal(true)}>
              Send to Developer
            </button>
            <button className={styles.sendBtn} onClick={() => setShowDomainInput(!showDomainInput)}>
              {showDomainInput ? "Cancel" : "Add More Domain"}
            </button>
          </div>
        </>
      )}

      {/* Email Modal */}
      {showModal && (
        <div className={styles.modalContainer}>
          <h3>Send Script to Developer</h3>
          <div className={styles.modalInfo}>
            <input
              type="text"
              placeholder="Enter emails separated by comma"
              value={emailInput}
              onChange={handleEmailChange}
              onBlur={handleAddEmails}
              className={styles.inputField}
            />
            <div className={styles.modalActions}>
              <button onClick={handleAddEmails}>Add</button>
            </div>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}



          <ul>
            {emails.map((e, idx) => (
              <li key={idx}>
                {e}
                <button onClick={() => handleDelete(idx)}>x</button>
              </li>
            ))}
          </ul>
          <div className={styles.modalActions}>
            <button onClick={handleSend}>Send Emails</button>
          </div>
        </div>
      )}

      {/* Popup message */}
      {showPopup && (
        <PopUp
          type={popupType}
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default WidgetScript;
