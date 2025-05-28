
// import React, { useEffect } from "react";
// import Lottie from "lottie-react";
// import styles from "./AgentCreation.module.css";
// // import loaderAnim from "animations/agent-creatio-loader.json"; // adjust path
// import loaderAnim from "./agent-creatio-loader.json";

// /**
//  * Props
//  *  - show        : boolean   → whether overlay is visible
//  *  - message     : string?   → optional loading text
//  *  - onEscClose? : () => void  fires when user hits ESC (optional)
//  */
// const AgentCreationLoader = ({ show = false, message, onEscClose }) => {
//   // Disable page scroll while loader is shown
//   useEffect(() => {
//     if (show) document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [show]);

//   // ESC key closes loader if callback provided
// //   useEffect(() => {
// //     if (!onEscClose) return;
// //     const handle = (e) => e.key === "Escape" && onEscClose();
// //     window.addEventListener("keydown", handle);
// //     return () => window.removeEventListener("keydown", handle);
// //   }, [onEscClose]);

//   if (!show) return null;

//   return (
//     <div className={styles.overlay}>
//       <div className={styles.box}>
//         <Lottie
//         //   animationData='animations/agent-creatio-loader.json'
//           animationData={loaderAnim}
//           loop
//           className={styles.anim}
//         />
//         {message && <p className={styles.text}>{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default AgentCreationLoader;


import React from 'react';
import Lottie from 'lottie-react';
import agentAnimation from "./agent-creatio-loader.json"; // Replace with your Lottie JSON path

const AgentCreationLoader = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    width: '100%',
    textAlign: 'center',
    padding: '40px',
    marginTop:"5rem"
  };

  const textStyle = {
    fontSize: '18px',
    color: '#555',
    marginTop: '40px'
  };

  return (
    <div style={containerStyle}>
      <Lottie
        animationData={agentAnimation}
        loop
        autoplay
        style={{ height: 450, width: 450 }}
      />
      <p style={textStyle}>Creating your AI Agent...</p>
    </div>
  );
};

export default AgentCreationLoader;
