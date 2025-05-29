import React from "react";
import styles from './CallTest.module.css';

const CallTest = ({ onStartCall, onEndCall, isCallActive, agentDetails }) => {
    return (
        <div className={styles.container}>
            <div className={styles.imgrex}>
                <img src="images/rex.png" alt="Rex Agent" />
                {isCallActive ? <div className={styles.reddiv}>
                    <div className={styles.phoneIcon}>
                        <img src="svg/Phone-call.svg" alt="Phone Call" />
                    </div>
                    <div className={styles.callText} onClick={onEndCall}>
                        <p>
                            Call End <span className={styles.agentTag}>[AGENT]</span>
                        </p>
                        <small>[BUSINESS NAME] Agent is LIVE</small>
                    </div>
                </div> :
                    <div className={styles.greendiv} onClick={onStartCall}>
                        <div className={styles.phoneIcon}>
                            <img src="svg/Phone-call.svg" alt="Phone Call" />
                        </div>
                        <div className={styles.callText}>
                            <p>
                                Call Start <span className={styles.agentTag}>[AGENT]</span>
                            </p>
                            <small>[BUSINESS NAME] Agent is LIVE</small>
                        </div>
                    </div>}
            </div>

            {/* <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {
                    isCallActive ? (
                        <button onClick={onEndCall} className={styles.callBtnEnd}>
                            End Call
                        </button>
                    ) : (
                        <button onClick={onStartCall} className={styles.callBtnStart}>
                            Start Call
                        </button>
                    )
                }
            </div> */}
        </div>
    );
};

export default CallTest;
