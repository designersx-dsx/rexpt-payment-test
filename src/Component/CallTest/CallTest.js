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

// import React, { useState, useEffect, useRef } from "react";
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import styles from './CallTest.module.css';

// const CallTest = ({
//   onStartCall,
//   onEndCall,
//   isCallActive,
//   callLoading,
//   isliveTranscript = true,
//   agentName,
//   agentAvatar,
//   businessName
// }) => {
//   const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
//   const [transcripts, setTranscripts] = useState([]);
//   const userSpeechTimer = useRef(null);
//   const previousAgentSentences = useRef(new Set());
//   const lastAgentSentence = useRef('');
//   const bottomRef = useRef(null);
//   const isAgentSpeakingRef = useRef(false);

//   const displayAgentName = agentName?.length > 15 ? agentName.slice(0, 7) + '...' : agentName;
//   const displayBusinessName = businessName?.length > 10 ? businessName.slice(0, 15) + '...' : businessName;

//   // Auto-scroll to bottom
//   useEffect(() => {
//     if (bottomRef.current) {
//       bottomRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [transcripts]);

//   // Handle user speech
//   useEffect(() => {
//     if (!isCallActive || !isliveTranscript || isAgentSpeakingRef.current || !listening) {
//       console.log('User speech hook skipped:', { isCallActive, isliveTranscript, isAgentSpeaking: isAgentSpeakingRef.current, listening });
//       return;
//     }

//     if (transcript && transcript.trim()) {
//       console.log("User transcript detected:", transcript);

//       if (userSpeechTimer.current) clearTimeout(userSpeechTimer.current);

//       userSpeechTimer.current = setTimeout(() => {
//         const message = transcript.trim();
//         const normalizedMessage = message.toLowerCase().replace(/[^a-z0-9\s]/g, '');

//         if (message && !previousAgentSentences.current.has(normalizedMessage)) {
//           setTranscripts(prev => [
//             ...prev,
//             {
//               speaker: 'user',
//               text: message,
//               timestamp: new Date().toISOString(),
//               tag: 1
//             }
//           ]);
//           console.log("User message added:", message);
//           resetTranscript();
//         } else {
//           console.log("User message skipped (duplicate or agent match):", message);
//         }
//       }, 1000);

//     }

//     return () => {
//       if (userSpeechTimer.current) clearTimeout(userSpeechTimer.current);
//     };
//   }, [transcript, isCallActive, isliveTranscript, listening]);

//   // Handle agent messages
//   useEffect(() => {
//     if (!isCallActive || !isliveTranscript) return;

//     const handleAgentUpdate = (event) => {
//       console.log("retellUpdate event received:", event.detail); // Debug log
//       let text = '';
//       const update = event.detail;

//       // Extract new agent text
//       if (Array.isArray(update?.transcript)) {
//         // Process only the latest agent message
//         const latestAgentMessage = update.transcript
//           .filter(t => (t.role === 'agent' || t.speaker === 'agent') && t.content)
//           .slice(-1)[0]; // Get the last agent message
//         text = latestAgentMessage?.content?.trim() || '';
//       } else if (typeof update?.transcript === 'string') {
//         // Assume the string is the latest message
//         text = update.transcript.trim();
//       }

//       console.log("Extracted agent text:", text); // Debug log

//       // Skip if empty or incomplete
//       if (!text || !/[.!?]$/.test(text)) {
//         console.log("Agent text skipped (empty or incomplete):", text);
//         return;
//       }

//       // Normalize text for duplicate check
//       const normalizedText = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
//       console.log("Normalized agent text:", normalizedText); // Debug log

//       // Skip if duplicate
//       if (previousAgentSentences.current.has(normalizedText)) {
//         console.log("Agent text skipped (duplicate):", text);
//         return;
//       }

//       isAgentSpeakingRef.current = true;
//       previousAgentSentences.current.add(normalizedText);
//       lastAgentSentence.current = text;

//       setTranscripts(prev => [
//         ...prev,
//         {
//           speaker: 'agent',
//           text,
//           timestamp: new Date().toISOString(),
//           tag: 0
//         }
//       ]);
//       console.log("Agent message added:", text); // Debug log

//       // Stop mic to prevent echo
//       SpeechRecognition.stopListening();

//       // Resume mic after delay
//       setTimeout(() => {
//         isAgentSpeakingRef.current = false;
//         if (isCallActive && isliveTranscript) {
//           SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
//         }
//       }, 2500);
//     };

//     window.addEventListener('retellUpdate', handleAgentUpdate);

//     return () => {
//       window.removeEventListener('retellUpdate', handleAgentUpdate);
//     };
//   }, [isCallActive, isliveTranscript]);

//   // Manage speech recognition lifecycle
//   useEffect(() => {
//     console.log('Speech recognition lifecycle:', { isCallActive, isliveTranscript, isAgentSpeaking: isAgentSpeakingRef.current, listening });
//     if (isCallActive && isliveTranscript && !isAgentSpeakingRef.current) {
//       SpeechRecognition.startListening({ continuous: true, language: 'en-US', interimResults: true });
//     } else {
//       SpeechRecognition.stopListening();
//     }

//     return () => {
//       SpeechRecognition.stopListening();
//     };
//   }, [isCallActive, isliveTranscript]);

//   // Cleanup on call end
//   useEffect(() => {
//     if (!isCallActive) {
//       setTranscripts([]);
//       resetTranscript();
//       previousAgentSentences.current.clear();
//       lastAgentSentence.current = '';
//       isAgentSpeakingRef.current = false;
//       if (userSpeechTimer.current) clearTimeout(userSpeechTimer.current);
//     }
//   }, [isCallActive]);

//   // Mic support and permission check
//   useEffect(() => {
//     if (!browserSupportsSpeechRecognition) {
//       alert("Your browser does not support Speech Recognition. Please use Chrome or enable mic access.");
//     } else {
//       navigator.mediaDevices.getUserMedia({ audio: true })
//         .catch(err => {
//           console.error("Microphone access denied:", err);
//           alert("Microphone access is required for speech recognition. Please enable it in your browser settings.");
//         });
//     }
//   }, []);

//   return (
//     <div className={styles.container}>
//       {/* Header */}
//       <div className={styles.imgrex}>
//         <img src={agentAvatar || "images/rex.png"} alt={agentName || "Agent"} />
//         {isCallActive ? (
//           <div className={styles.reddiv}>
//             <div className={styles.phoneIcon}>
//               <img src="svg/Phone-call.svg" alt="Phone Call" />
//             </div>
//             <div className={styles.callText} onClick={onEndCall}>
//               <p>Call End <span className={styles.agentTag}>{displayAgentName}</span></p>
//               <small>{displayBusinessName} Agent is LIVE</small>
//             </div>
//           </div>
//         ) : callLoading ? (
//           <div className={styles.greendiv} style={{ pointerEvents: 'none', opacity: 0.7 }}>
//             <div className={styles.phoneIcon}>
//               <img src="svg/Phone-call.svg" alt="Phone Call" />
//             </div>
//             <div className={styles.callText}>
//               <p>Connecting...</p>
//               <small>{displayBusinessName} Agent is LIVE</small>
//             </div>
//           </div>
//         ) : (
//           <div className={styles.greendiv} onClick={onStartCall}>
//             <div className={styles.phoneIcon}>
//               <img src="svg/Phone-call.svg" alt="Phone Call" />
//             </div>
//             <div className={styles.callText}>
//               <p>Call <span className={styles.agentTag}>{displayAgentName}</span></p>
//               <small>{displayBusinessName} Agent is LIVE</small>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Transcript Section */}
//       {isCallActive && isliveTranscript && (
//         <div className={styles.transcriptContainer}>
//           <div className={styles.transcriptContent}>
//             {/* {!listening && (
//               <p style={{ color: 'red' }}>Mic not active. Please allow microphone access.</p>
//             )} */}
//             {transcripts.length === 0 ? (
//               <p>No transcript yet...</p>
//             ) : (
//               <>
//                 {transcripts.map((msg, index) => (
//                   <div
//                     key={index}
//                     className={`${styles.transcriptMessage} ${msg.speaker === 'agent' ? styles.agentMessage : styles.userMessage}`}
//                     style={{
//                       textAlign: msg.speaker === 'agent' ? 'left' : 'right',
//                       alignSelf: msg.speaker === 'agent' ? 'flex-start' : 'flex-end',
//                     }}
//                   >
//                     <strong>{msg.speaker === 'agent' ? agentName : 'You:'}</strong>
//                     <span> {msg.text}</span>
//                     <br />
//                     <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
//                   </div>
//                 ))}
//                 <div ref={bottomRef} />
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CallTest;