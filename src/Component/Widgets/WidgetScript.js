
import React, { useRef, useState } from "react";
import styles from './Widgets.module.css';
import Modal2 from "../Modal2/Modal2";

const WidgetScript = ({ isAgentDetails, onClose }) => {
    console.log(isAgentDetails)
    const scriptRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");

    const scriptText = `
<body>
  <div id="rexWidgetContainer"></div>
   <script id="rex-widget-script" src="https://whimsical-douhua-9d1125.netlify.app/index.js?agentId=agentId=${isAgentDetails.agent_id}"></script>
</body>
`;

    const handleCopy = () => {
        if (scriptRef.current) {
            navigator.clipboard.writeText(scriptText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSend = async () => {

        console.log("Email sent to developer:", email);
        // TODO: Add actual sending logic here

        setShowModal(false);
        setEmail("");
    };
    const handleCloseCallModal = () => {
        setShowModal(false)

    }
    const handleOpenModal = () => {
        setShowModal(true);
        // onClose()
    }
    return (
        <div className={styles.container}>
            <div className={styles.scriptBox}>
                <button className={styles.copyButton} onClick={handleCopy}>
                    {copied ? "Copied!" : "Copy"}
                </button>
                <br /> <br />
                <pre ref={scriptRef} className={styles.scriptText}>
                    {scriptText}
                </pre>
            </div>

            <div className={styles.actionButtons}>
                <button className={styles.emailBtn} onClick={handleOpenModal}>Send to developer</button>
            </div>
            {/* Modal */}

            {showModal && <Modal2 isOpen={showModal} onClose={handleCloseCallModal}>
                <div className="modalTop">
                    <h3>Send to Developer</h3>
                    <input
                        type="email"
                        placeholder="Enter developer's email"
                        value={email}
                        onChange={handleEmailChange}
                        className={styles.inputField}
                    />
                    <div className={styles.modalActions}>
                        <button onClick={handleSend} className={styles.sendBtn}>Send</button>
                        <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                    </div>
                </div>
            </Modal2>}
        </div>
    );
};

export default WidgetScript;
