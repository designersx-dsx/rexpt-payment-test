// import React, { useEffect, useState } from "react";
// import Accordion from "@mui/material/Accordion";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import Typography from "@mui/material/Typography";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import HeaderBar from "../HeaderBar/HeaderBar";
// import styles from "./CallSetting.module.css";
// import ListeningAffirmations from "./ListeningAffirmation";
// import SpeechSetting from "./SpeechSetting"
// import CallSeting1 from "./CallSeting1"
// import LeadSetting from "./LeadSetting";

// import Footer2 from "../AgentDetails/Footer/Footer2";
// import PhoneInput from "react-phone-input-2";
// import { useDashboardStore } from "../../Store/agentZustandStore";
// import { useLocation } from "react-router-dom";



// export default function CallSetting() {
// const [expanded, setExpanded] = useState("panel1");
// const [selectedCountry, setSelectedCountry] = useState("");
// const [phoneNumber, setPhoneNumber] = useState("");
// const { agents, setHasFetched } =   useDashboardStore();

// console.log(agents, "agents in call setting");
//     const location = useLocation();
//   const { selectedAgentname, fromPage } = location.state || {};
//   const handleChange = (panel) => (event, isExpanded) => {
//     setExpanded(isExpanded ? panel : false);
//   };
//   console.log(selectedAgentname, "selectedAgentname in call setting");
//     const [selectedAgent, setSelectedAgent] = useState(selectedAgentname);
//     const [selectedAgentData, setSelectedAgentData] = useState([]);

//      const handleInputChange = (field, value) => {
//       // console.log(`Input changed: ${field} = ${value}`);
//      }
//   const dropdownOptions = agents.map((agent) => {
//     return `${agent.agentName}-${agent.agentCode}`;
//   });

// useEffect(() => {
//   if (agents.length && selectedAgent) { // wait until agents are loaded
//     const agent = agents.find(
//       (agent) => `${agent.agentName}-${agent.agentCode}` === selectedAgent
//     );
//     if (agent) {
//       setSelectedAgentData(agent);

//       const kb_data = JSON.parse(agent?.business?.knowledge_base_texts || "{}");
//       console.log(kb_data, "kb_data in call setting");

//       setPhoneNumber(kb_data?.phone || "");
//       setSelectedCountry(agent?.country || "us");
//     }
//   }
// }, [selectedAgent, agents]);

// // useEffect(() => {
// //   if (agents.length && !selectedAgent) {
// //     const defaultDropdown = `${agents[0].agentName}-${agents[0].agentCode}`;
// //     setSelectedAgent(defaultDropdown);
// //   }
// // }, [agents]);
//   return (
//     <div>
//       <div className={styles.headersection}>
//  <HeaderBar
//         // title={selectedAgent}
//         subtitle="Call Setting For"
//         dropdownOptions={dropdownOptions}
//         selectedAgent={selectedAgentname}
//         onDropdownChange={setSelectedAgent}
//       />
//       </div>
     


      

// <div className={styles.CallSettingContainer}>

//       <Accordion className="CallAccordion" expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel1bh-content"
//           id="panel1bh-header"
//         >
//           <Typography component="span" sx={{ width: "80%" }}>
//             <p className={styles.DropDownHeader}> Speech Setting</p>
           
//           </Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <ListeningAffirmations />
//         </AccordionDetails>
//       </Accordion>

//          <Accordion className="CallAccordion" expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel2bh-header">
//           <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
            
//              <p className={styles.DropDownHeader}> Default Call Transfer Number</p>
//           </Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Typography>
//                   <div className={styles.formGroup}>
//                 <label>
//                   Phone Number <span className={styles.requiredStar1}>*</span>
//                 </label>
//                 <PhoneInput
//                   country={selectedCountry}
//                   value={phoneNumber}
//                   onChange={(phone, countryData) => {
//                     const fullPhone = phone.startsWith("+")
//                       ? phone
//                       : `+${phone}`;
//                     setPhoneNumber(fullPhone);
//                     setSelectedCountry(countryData?.countryCode || "us");
//                     handleInputChange("phone", fullPhone);
//                   }}
//                   inputStyle={{
//                     width: "100%",
//                     height: "40px",
//                     paddingLeft: "45px",
//                     borderRadius: "5px",
//                   }}
//                   placeholder="+1 (123)456-7890"
//                   required
//                   disabled
//                 />  
//               </div>
//           </Typography>
//         </AccordionDetails>
//       </Accordion>


//       <Accordion className="CallAccordion" expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel2bh-header">
//           <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
            
//              <p className={styles.DropDownHeader}> Ring Duration</p>
//           </Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Typography>
//             Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar
//             diam eros in elit. Pellentesque convallis laoreet laoreet.
//           </Typography>
//         </AccordionDetails>
//       </Accordion>

//       <Accordion className="CallAccordion" expanded={expanded === "panel3"} onChange={handleChange("panel3")}>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel3bh-header">
//           <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
            
//              <p className={styles.DropDownHeader}>Max Call Duration </p>
//           </Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Typography>
//             Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
//             vitae egestas augue. Duis vel est augue.
//           </Typography>
//         </AccordionDetails>
//       </Accordion>

//       <Accordion className="CallAccordion" expanded={expanded === "panel4"} onChange={handleChange("panel4")}>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel4bh-header">
//           <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
            
//              <p className={styles.DropDownHeader}> End Call on Silence</p>
//           </Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Typography>
//             Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
//             vitae egestas augue. Duis vel est augue.
//           </Typography>
//         </AccordionDetails>
//       </Accordion>
//     </div>


//       <div className={styles.CallSettingContainer}>

//         <Accordion className="CallAccordion" expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             aria-controls="panel1bh-content"
//             id="panel1bh-header"
//           >
//             <Typography component="span" sx={{ width: "80%" }}>
//               <p className={styles.DropDownHeader}>Conversational Nods</p>

//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <ListeningAffirmations />
//           </AccordionDetails>
//         </Accordion>

//         <Accordion className="CallAccordion" expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel2bh-header">
//             <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>

//               <p className={styles.DropDownHeader}> Speech Setting</p>
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>

//             <SpeechSetting />

//           </AccordionDetails>
//         </Accordion>

//         <Accordion className="CallAccordion" expanded={expanded === "panel3"} onChange={handleChange("panel3")}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel3bh-header">
//             <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>

//               <p className={styles.DropDownHeader}> Call Setting </p>
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>

//             <CallSeting1 />

//           </AccordionDetails>
//         </Accordion>
//         <Accordion className="CallAccordion" expanded={expanded === "panel4"} onChange={handleChange("panel4")}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel4bh-header">
//             <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>

//               <p className={styles.DropDownHeader}> Lead Setting </p>
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>

//    <LeadSetting/>
//           </AccordionDetails>
//         </Accordion>

//       </div>


//       <Footer2 />
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import Accordion from "@mui/material/Accordion";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import Typography from "@mui/material/Typography";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import HeaderBar from "../HeaderBar/HeaderBar";
// import styles from "./CallSetting.module.css";
// import ListeningAffirmations from "./ListeningAffirmation";
// import SpeechSetting from "./SpeechSetting";
// import CallSeting1 from "./CallSeting1";
// import LeadSetting from "./LeadSetting";
// import Footer2 from "../AgentDetails/Footer/Footer2";
// import PhoneInput from "react-phone-input-2";
// import { useDashboardStore } from "../../Store/agentZustandStore";
// import { useLocation } from "react-router-dom";

// export default function CallSetting() {
//   const [expanded, setExpanded] = useState("panel1");
//   const [selectedCountry, setSelectedCountry] = useState("us");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const { agents, setHasFetched } = useDashboardStore();
//   const location = useLocation();
//   const { selectedAgentname, fromPage } = location.state || {};

//   const [selectedAgent, setSelectedAgent] = useState(selectedAgentname || "");

//   console.log(agents, "agents in call setting");
//   console.log(selectedAgentname, "selectedAgentname in call setting");

//   const handleChange = (panel) => (event, isExpanded) => {
//     setExpanded(isExpanded ? panel : false);
//   };

//   const handleInputChange = (field, value) => {
//     console.log(`Input changed: ${field} = ${value}`);
//   };

//   const dropdownOptions = agents.map((agent) => `${agent.agentName}-${agent.agentCode}`);

//   // Debounced API call to save settings
//   useEffect(() => {
//     const delay = 2000; // 2 seconds debounce
//     let timer;
//     if (phoneNumber || selectedCountry) {
//       timer = setTimeout(async () => {
//         try {
//           const agent = agents.find(
//             (agent) => `${agent.agentName}-${agent.agentCode}` === selectedAgent
//           );
//           if (!agent) return;

//           const payload = {
//             agentId: agent.agentCode,
//             phoneNumber,
//             country: selectedCountry,
//           };

//           // Update Retell agent (replace with actual API endpoint)
//           await fetch("/api/retell/update-agent", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//           });

//           // Update database (replace with actual API endpoint)
//           await fetch("/api/database/update-agent-settings", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               ...payload,
//               knowledge_base_texts: JSON.stringify({ phone: phoneNumber }),
//             }),
//           });

//           console.log("Settings saved:", payload);
//         } catch (error) {
//           console.error("Failed to save settings:", error);
//         }
//       }, delay);
//     }

//     return () => clearTimeout(timer);
//   }, [phoneNumber, selectedCountry, selectedAgent, agents]);

//   useEffect(() => {
//     if (!agents.length) {
//       setHasFetched(false); // Trigger fetch if agents not loaded
//     }

//     if (agents.length && !selectedAgent) {
//       const defaultAgent = `${agents[0].agentName}-${agents[0].agentCode}`;
//       setSelectedAgent(defaultAgent);
//     }

//     if (agents.length && selectedAgent) {
//       const agent = agents.find(
//         (agent) => `${agent.agentName}-${agent.agentCode}` === selectedAgent
//       );
//       if (agent) {
//         const kb_data = JSON.parse(agent?.business?.knowledge_base_texts || "{}");
//         console.log(kb_data, "kb_data in call setting");
//         setPhoneNumber(kb_data?.phone || "");
//         setSelectedCountry(agent?.country || "us");
//       }
//     }
//   }, [agents, selectedAgent, setHasFetched]);

//   return (
//     <div>
//       <div className={styles.headersection}>
//         <HeaderBar
//           subtitle="Call Setting For"
//           dropdownOptions={dropdownOptions}
//           selectedAgent={selectedAgent} // Use selectedAgent state
//           onDropdownChange={setSelectedAgent}
//         />
//       </div>

//       <div className={styles.CallSettingContainer}>
//         <Accordion className="CallAccordion" expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
//             <Typography component="span" sx={{ width: "80%" }}>
//               <p className={styles.DropDownHeader}>Speech Setting</p>
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <ListeningAffirmations />
//           </AccordionDetails>
//         </Accordion>

//         <Accordion className="CallAccordion" expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel2bh-header">
//             <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
//               <p className={styles.DropDownHeader}>Default Call Transfer Number</p>
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <Typography>
//               <div className={styles.formGroup}>
//                 <label>
//                   Phone Number <span className={styles.requiredStar1}>*</span>
//                 </label>
//                 <PhoneInput
//                   country={selectedCountry}
//                   value={phoneNumber}
//                   onChange={(phone, countryData) => {
//                     const fullPhone = phone.startsWith("+") ? phone : `+${phone}`;
//                     setPhoneNumber(fullPhone);
//                     setSelectedCountry(countryData?.countryCode || "us");
//                     handleInputChange("phone", fullPhone);
//                   }}
//                   inputStyle={{
//                     width: "100%",
//                     height: "40px",
//                     paddingLeft: "45px",
//                     borderRadius: "5px",
//                   }}
//                   placeholder="+1 (123)456-7890"
//                   required
//                   disabled
//                 />
//               </div>
//             </Typography>
//           </AccordionDetails>
//         </Accordion>

//         <Accordion className="CallAccordion" expanded={expanded === "panel3"} onChange={handleChange("panel3")}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel3bh-header">
//             <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
//               <p className={styles.DropDownHeader}>Ring Duration</p>
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <Typography>
//               Configure the duration for which the call should ring before timing out.
//             </Typography>
//           </AccordionDetails>
//         </Accordion>

//         <Accordion className="CallAccordion" expanded={expanded === "panel4"} onChange={handleChange("panel4")}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel4bh-header">
//             <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
//               <p className={styles.DropDownHeader}>Max Call Duration</p>
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <Typography>
//               Set the maximum duration for a call before it is automatically terminated.
//             </Typography>
//           </AccordionDetails>
//         </Accordion>

//         <Accordion className="CallAccordion" expanded={expanded === "panel5"} onChange={handleChange("panel5")}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel5bh-header">
//             <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
//               <p className={styles.DropDownHeader}>End Call on Silence</p>
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <Typography>
//               Configure settings to end the call if prolonged silence is detected.
//             </Typography>
//           </AccordionDetails>
//         </Accordion>
//       </div>

//       <div className={styles.CallSettingContainer}>
//         <Accordion className="CallAccordion" expanded={expanded === "panel6"} onChange={handleChange("panel6")}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel6bh-content" id="panel6bh-header">
//             <Typography component="span" sx={{ width: "80%" }}>
//               <p className={styles.DropDownHeader}>Conversational Nods</p>
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <ListeningAffirmations />
//           </AccordionDetails>
//         </Accordion>

//         <Accordion className="CallAccordion" expanded={expanded === "panel7"} onChange={handleChange("panel7")}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel7bh-header">
//             <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
//               <p className={styles.DropDownHeader}>Speech Setting</p>
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <SpeechSetting />
//           </AccordionDetails>
//         </Accordion>

//         <Accordion className="CallAccordion" expanded={expanded === "panel8"} onChange={handleChange("panel8")}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel8bh-header">
//             <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
//               <p className={styles.DropDownHeader}>Call Setting</p>
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <CallSeting1 />
//           </AccordionDetails>
//         </Accordion>

//         <Accordion className="CallAccordion" expanded={expanded === "panel9"} onChange={handleChange("panel9")}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel9bh-header">
//             <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
//               <p className={styles.DropDownHeader}>Lead Setting</p>
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <LeadSetting />
//           </AccordionDetails>
//         </Accordion>
//       </div>

//       <Footer2 />
//     </div>
//   );
// }


import React, { useEffect, useState, useRef } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HeaderBar from "../HeaderBar/HeaderBar";
import styles from "./CallSetting.module.css";
import ListeningAffirmations from "./ListeningAffirmation";
import SpeechSetting from "./SpeechSetting";
import CallSeting1 from "./CallSeting1";
import LeadSetting from "./LeadSetting";
import Footer2 from "../AgentDetails/Footer/Footer2";
import PhoneInput from "react-phone-input-2";
import { useDashboardStore } from "../../Store/agentZustandStore";
import { useLocation } from "react-router-dom";

export default function CallSetting() {
  const [expanded, setExpanded] = useState("panel1");
  const { agents, setHasFetched } = useDashboardStore();
  const location = useLocation();
  const { selectedAgentname, fromPage } = location.state || {};

  const [selectedAgent, setSelectedAgent] = useState(selectedAgentname || "");
  const [settings, setSettings] = useState({
    phoneNumber: "",
    selectedCountry: "us",
    ringDuration: 30,
    maxCallDuration: 3600,
    endCallOnSilence: false,
    conversationalNods: false,
  });

  const prevSettings = useRef(settings);
  const isInitialLoad = useRef(true);

  console.log(agents, "agents in call setting");
  console.log(selectedAgentname, "selectedAgentname in call setting");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    console.log(`Input changed: ${field} = ${value}`);
  };

  const dropdownOptions = agents.map((agent) => `${agent.agentName}-${agent.agentCode}`);

  useEffect(() => {
    if (!agents.length) {
      setHasFetched(false);
    }

    if (agents.length && !selectedAgent) {
      const defaultAgent = `${agents[0].agentName}-${agents[0].agentCode}`;
      setSelectedAgent(defaultAgent);
    }

    if (agents.length && selectedAgent) {
      const agent = agents.find(
        (agent) => `${agent.agentName}-${agent.agentCode}` === selectedAgent
      );
      if (agent) {
        const kb_data = JSON.parse(agent?.business?.knowledge_base_texts || "{}");
        console.log(kb_data, "kb_data in call setting");
        setSettings((prev) => ({
          ...prev,
          phoneNumber: kb_data?.phone || "",
          selectedCountry: agent?.country || "us",
        }));
      }
    }
  }, [agents, selectedAgent, setHasFetched]);

  // Debounced API call when settings change
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      prevSettings.current = settings;
      return;
    }

    const settingsChanged = Object.keys(settings).some(
      (key) => settings[key] !== prevSettings.current[key]
    );

    // if (settingsChanged) {
    //   const delay = 4000; // 4 seconds debounce
    //   const timer = setTimeout(async () => {
    //     try {
    //       const agent = agents.find(
    //         (agent) => `${agent.agentName}-${agent.agentCode}` === selectedAgent
    //       );
    //       if (!agent) return;

    //       const payload = {
    //         agentId: agent.agentCode,
    //         ...settings,
    //       };

    //       // Update Retell agent (replace with actual API endpoint)
    //       await fetch("/api/retell/update-agents", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(payload),
    //       });

    //       // Update database (replace with actual API endpoint)
    //       await fetch("/api/database/update-agent-settingss", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //           ...payload,
    //           knowledge_base_texts: JSON.stringify({ phone: settings.phoneNumber }),
    //         }),
    //       });

    //       console.log("Settings saved:", payload);
    //     } catch (error) {
    //       console.error("Failed to save settings:", error);
    //     }
    //   }, delay);

    //   prevSettings.current = { ...settings };

    //   return () => clearTimeout(timer);
    // }
  }, [settings, selectedAgent, agents]);

  return (
    <div>
      <div className={styles.headersection}>
        <HeaderBar
          subtitle="Call Setting For"
          dropdownOptions={dropdownOptions}
          selectedAgent={selectedAgent}
          onDropdownChange={setSelectedAgent}
        />
      </div>

      <div className={styles.CallSettingContainer}>
        <Accordion className="CallAccordion" expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
            <Typography component="span" sx={{ width: "80%" }}>
              <p className={styles.DropDownHeader}>Speech Setting</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ListeningAffirmations
              conversationalNods={settings.conversationalNods}
              onChange={(value) => handleInputChange("conversationalNods", value)}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion className="CallAccordion" expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel2bh-header">
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>Default Call Transfer Number</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className={styles.formGroup}>
                <label>
                  Phone Number <span className={styles.requiredStar1}>*</span>
                </label>
                <PhoneInput
                  country={settings.selectedCountry}
                  value={settings.phoneNumber}
                  onChange={(phone, countryData) => {
                    const fullPhone = phone.startsWith("+") ? phone : `+${phone}`;
                    handleInputChange("phoneNumber", fullPhone);
                    handleInputChange("selectedCountry", countryData?.countryCode || "us");
                  }}
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    paddingLeft: "45px",
                    borderRadius: "5px",
                  }}
                  placeholder="+1 (123)456-7890"
                  required
                  disabled
                />
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion className="CallAccordion" expanded={expanded === "panel3"} onChange={handleChange("panel3")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel3bh-header">
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>Ring Duration</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <input
                type="number"
                value={settings.ringDuration}
                onChange={(e) => handleInputChange("ringDuration", parseInt(e.target.value))}
                placeholder="Enter ring duration (seconds)"
              />
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion className="CallAccordion" expanded={expanded === "panel4"} onChange={handleChange("panel4")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel4bh-header">
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>Max Call Duration</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <input
                type="number"
                value={settings.maxCallDuration}
                onChange={(e) => handleInputChange("maxCallDuration", parseInt(e.target.value))}
                placeholder="Enter max call duration (seconds)"
              />
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion className="CallAccordion" expanded={expanded === "panel5"} onChange={handleChange("panel5")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel5bh-header">
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>End Call on Silence</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <input
                type="checkbox"
                checked={settings.endCallOnSilence}
                onChange={(e) => handleInputChange("endCallOnSilence", e.target.checked)}
              />
              <label>End call on prolonged silence</label>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className={styles.CallSettingContainer}>
        <Accordion className="CallAccordion" expanded={expanded === "panel6"} onChange={handleChange("panel6")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel6bh-content" id="panel6bh-header">
            <Typography component="span" sx={{ width: "80%" }}>
              <p className={styles.DropDownHeader}>Conversational Nods</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ListeningAffirmations
              conversationalNods={settings.conversationalNods}
              onChange={(value) => handleInputChange("conversationalNods", value)}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion className="CallAccordion" expanded={expanded === "panel7"} onChange={handleChange("panel7")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel7bh-header">
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>Speech Setting</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SpeechSetting
              onChange={handleInputChange}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion className="CallAccordion" expanded={expanded === "panel8"} onChange={handleChange("panel8")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel8bh-header">
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>Call Setting</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CallSeting1
              onChange={handleInputChange}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion className="CallAccordion" expanded={expanded === "panel9"} onChange={handleChange("panel9")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel9bh-header">
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>Lead Setting</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <LeadSetting
              onChange={handleInputChange}
            />
          </AccordionDetails>
        </Accordion>
      </div>

      <Footer2 />
    </div>
  );
}
