
import React, { useRef, useState } from "react";
import styles from './Widgets.module.css';

const WidgetScript = ({ isAgentDetails }) => {
    console.log(isAgentDetails)
    const scriptRef = useRef(null);
    const [copied, setCopied] = useState(false);

    const scriptText = `<iframe 
    src="https://rexpt-widget.vercel.app/?agentId=${isAgentDetails.agent_id}" 
    width="100%" 
    height="500" 
    frameborder="0" 
    allow="microphone; camera">
  </iframe>`;

    const handleCopy = () => {
        if (scriptRef.current) {
            navigator.clipboard.writeText(scriptText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

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
                {/* <button className={styles.whatsappBtn}>Send WhatsApp</button> */}
                <button className={styles.emailBtn}>Send to Email</button>
            </div>
        </div>
    );
};

export default WidgetScript;
