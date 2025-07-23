import React from "react";
import styles from './CallTest.module.css';
import Loader from "../Loader/Loader";
import Loader2 from "../Loader2/Loader2";
const CallTest = ({
  onStartCall,
  onEndCall,
  isCallActive,
  callLoading,
  setCallLoading,
  isliveTranscript,
  agentName,
  agentAvatar,
  businessName,
  isEndingRef
}) => {

  const displayAgentName = agentName && agentName.length > 15
    ? agentName.slice(0, 7) + '...'
    : agentName;

  const displayBusinessName = businessName && businessName.length > 10
    ? businessName.slice(0, 15) + '...'
    : businessName;

  return (
    <div className={styles.container}>
      <div className={styles.imgrex}>
        <img src={agentAvatar || "images/rex.png"} alt={agentName || "Agent"} />
        {
           isEndingRef.current ? (
        
               <div
            className={styles.reddiv}
            style={{
              pointerEvents: 'none',
              opacity: 0.7,
              cursor: 'not-allowed',
            }}
          >
            <div className={styles.phoneIcon}>
              <img src="svg/Phone-call.svg" alt="Phone Call" />
            </div>
            <div className={styles.callText}>
              <p>Disconecting...</p>
              <small>{displayBusinessName}&nbsp; Agent is LIVE</small>
            </div>

          </div>
        ):
        isCallActive ? (
          <div className={styles.reddiv}>
            <div className={styles.phoneIcon}>
              <img src="svg/Phone-call.svg" alt="Phone Call" />
            </div>
              <div className={styles.callText} onClick={onEndCall}>
                <p>
                  Call End <span className={styles.agentTag}>{displayAgentName}</span>
                </p>
                <small>{displayBusinessName}&nbsp; Agent is LIVE</small>
              </div>
          </div>
        ) : callLoading ? (
          <div
            className={styles.greendiv}
            style={{
              pointerEvents: 'none',
              opacity: 0.7,
              cursor: 'not-allowed',
            }}
          >
            <div className={styles.phoneIcon}>
              <img src="svg/Phone-call.svg" alt="Phone Call" />
            </div>
            <div className={styles.callText}>
              <p>Connecting...</p>
              <small>{displayBusinessName}&nbsp; Agent is LIVE</small>
            </div>

          </div>
        ) : (
          <div className={styles.greendiv} onClick={onStartCall}>
            <div className={styles.phoneIcon}>
              <img src="svg/Phone-call.svg" alt="Phone Call" />
            </div>
            <div className={styles.callText}>
              <p>
                Call <span className={styles.agentTag}>{displayAgentName}</span>
              </p>
              <small>{displayBusinessName}&nbsp; Agent is LIVE</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CallTest;

