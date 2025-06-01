import React, { useRef } from "react";
import styles from './CallTest.module.css';
;
const CallTest = ({ onStartCall, onEndCall, isCallActive,callLoading,setCallLoading}) => {
    //       const [blob, setBlob] = useState<Blob>();
    //   const visualizerRef = useRef<HTMLCanvasElement>(null)
    const agentDetails = JSON.parse(sessionStorage.getItem("agentDetails"));
    console.log(callLoading)


    return (

        <div className={styles.container}>
            <div className={styles.imgrex}>
                <img src="images/rex.png" alt="Rex Agent" />
                {isCallActive ? 
                <div className={styles.reddiv}>
                    <div className={styles.phoneIcon}>
                        <img src="svg/Phone-call.svg" alt="Phone Call" />
                    </div>
                    <div className={styles.callText} onClick={onEndCall}>
                        <p>
                            Call End <span className={styles.agentTag}>{agentDetails.agentName.length > 15
                                ? agentDetails.agentName.slice(0, 7) + '...'
                                : agentDetails.agentName
                            }</span>
                        </p>
                        <small> {agentDetails?.business?.businessName.length > 10
                            ? agentDetails?.business?.businessName.slice(0, 15) + '...'
                            : agentDetails?.business?.businessName
                        }&nbsp; Agent is LIVE</small>
                    </div>
                </div> 
                :
                
                    callLoading ?
                    
                            <div className={styles.greendiv} onClick={onStartCall}>
                        <div className={styles.phoneIcon}>
                            <img src="svg/Phone-call.svg" alt="Phone Call" />
                        </div>
                        <div className={styles.callText}>
                            <p>
                                Connecting...
                               {/* Connecting... <span className={styles.agentTag}>{agentDetails.agentName.length > 15
                                    ? agentDetails.agentName.slice(0, 7) + '...'
                                    : agentDetails.agentName
                                }</span> */}
                            </p>
                            <small>


                                {agentDetails?.business?.businessName.length > 10
                                    ? agentDetails?.business?.businessName.slice(0, 15) + '...'
                                    : agentDetails?.business?.businessName
                                }&nbsp;
                                Agent is LIVE</small>
                        </div>
                    </div>
                    
                    :
                    <div className={styles.greendiv} onClick={onStartCall}>
                        <div className={styles.phoneIcon}>
                            <img src="svg/Phone-call.svg" alt="Phone Call" />
                        </div>
                        <div className={styles.callText}>
                            <p>
                                Call <span className={styles.agentTag}>{agentDetails.agentName.length > 15
                                    ? agentDetails.agentName.slice(0, 7) + '...'
                                    : agentDetails.agentName
                                }</span>
                            </p>
                            <small>


                                {agentDetails?.business?.businessName.length > 10
                                    ? agentDetails?.business?.businessName.slice(0, 15) + '...'
                                    : agentDetails?.business?.businessName
                                }&nbsp;
                                Agent is LIVE</small>
                        </div>
                    </div>
                }

            </div>


        </div>
    );
};

export default CallTest;
