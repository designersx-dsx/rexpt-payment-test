
import React, { useRef, useState } from "react";
import styles from './Widgets.module.css';

const WidgetScript = ({ isAgentDetails }) => {
    console.log(isAgentDetails)
    const scriptRef = useRef(null);
    const [copied, setCopied] = useState(false);

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
                <button className={styles.emailBtn}>Send to developer</button>
            </div>
        </div>
    );
};

export default WidgetScript;
