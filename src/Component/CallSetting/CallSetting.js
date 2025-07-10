import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HeaderBar from "../HeaderBar/HeaderBar";
import styles from "./CallSetting.module.css";
import ListeningAffirmations from "./ListeningAffirmation";
import SpeechSetting from "./SpeechSetting"
import CallSeting1 from "./CallSeting1"
import LeadSetting from "./LeadSetting";

import Footer2 from "../AgentDetails/Footer/Footer2";
import PhoneInput from "react-phone-input-2";
import { useDashboardStore } from "../../Store/agentZustandStore";



export default function CallSetting() {
const [expanded, setExpanded] = useState("panel1");
const [selectedCountry, setSelectedCountry] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const { agents, setHasFetched } =   useDashboardStore();

console.log(agents, "agents in call setting");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

    const [selectedAgent, setSelectedAgent] = useState('SofiaB19548');
    const [selectedAgentData, setSelectedAgentData] = useState([]);

     const handleInputChange = (field, value) => {
      // console.log(`Input changed: ${field} = ${value}`);
     }
  const dropdownOptions = agents.map((agent) => {
    return `${agent.agentName}-${agent.agentCode}`;
  });
  console.log(dropdownOptions, "dropdownOptions in call setting");
  console .log(selectedAgent, "selectedAgent in call setting");

useEffect(() => {
  if (agents.length && selectedAgent) { // wait until agents are loaded
    const agent = agents.find(
      (agent) => `${agent.agentName}-${agent.agentCode}` === selectedAgent
    );
    console.log(agent, "agent in call setting (first load)");
    if (agent) {
      setSelectedAgentData(agent);

      const kb_data = JSON.parse(agent?.business?.knowledge_base_texts || "{}");
      console.log(kb_data, "kb_data in call setting");

      setPhoneNumber(kb_data?.phone || "");
      setSelectedCountry(agent?.country || "us");
    }
  }
}, [selectedAgent, agents]);

useEffect(() => {
  if (agents.length && !selectedAgent) {
    const defaultDropdown = `${agents[0].agentName}-${agents[0].agentCode}`;
    setSelectedAgent(defaultDropdown);
  }
}, [agents]);
  return (
    <div>
      <div className={styles.headersection}>
 <HeaderBar
        // title={selectedAgent}
        subtitle="Call Setting For"
        dropdownOptions={dropdownOptions}
        onDropdownChange={setSelectedAgent}
      />
      </div>
     


      

<div className={styles.CallSettingContainer}>

      <Accordion className="CallAccordion" expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography component="span" sx={{ width: "80%" }}>
            <p className={styles.DropDownHeader}> Speech Setting</p>
           
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ListeningAffirmations />
        </AccordionDetails>
      </Accordion>

         <Accordion className="CallAccordion" expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel2bh-header">
          <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
            
             <p className={styles.DropDownHeader}> Default Call Transfer Number</p>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
                  <div className={styles.formGroup}>
                <label>
                  Phone Number <span className={styles.requiredStar1}>*</span>
                </label>
                <PhoneInput
                  country={selectedCountry}
                  value={phoneNumber}
                  onChange={(phone, countryData) => {
                    const fullPhone = phone.startsWith("+")
                      ? phone
                      : `+${phone}`;
                    setPhoneNumber(fullPhone);
                    setSelectedCountry(countryData?.countryCode || "us");
                    handleInputChange("phone", fullPhone);
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


      <Accordion className="CallAccordion" expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel2bh-header">
          <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
            
             <p className={styles.DropDownHeader}> Ring Duration</p>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar
            diam eros in elit. Pellentesque convallis laoreet laoreet.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion className="CallAccordion" expanded={expanded === "panel3"} onChange={handleChange("panel3")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel3bh-header">
          <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
            
             <p className={styles.DropDownHeader}>Max Call Duration </p>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion className="CallAccordion" expanded={expanded === "panel4"} onChange={handleChange("panel4")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel4bh-header">
          <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
            
             <p className={styles.DropDownHeader}> End Call on Silence</p>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>


      <div className={styles.CallSettingContainer}>

        <Accordion className="CallAccordion" expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography component="span" sx={{ width: "80%" }}>
              <p className={styles.DropDownHeader}>Conversational Nods</p>

            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ListeningAffirmations />
          </AccordionDetails>
        </Accordion>

        <Accordion className="CallAccordion" expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel2bh-header">
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>

              <p className={styles.DropDownHeader}> Speech Setting</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>

            <SpeechSetting />

          </AccordionDetails>
        </Accordion>

        <Accordion className="CallAccordion" expanded={expanded === "panel3"} onChange={handleChange("panel3")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel3bh-header">
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>

              <p className={styles.DropDownHeader}> Call Setting </p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>

            <CallSeting1 />

          </AccordionDetails>
        </Accordion>
        <Accordion className="CallAccordion" expanded={expanded === "panel4"} onChange={handleChange("panel4")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel4bh-header">
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>

              <p className={styles.DropDownHeader}> Lead Setting </p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>

   <LeadSetting/>
          </AccordionDetails>
        </Accordion>

      </div>


      <Footer2 />
    </div>
  );
}
