import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HeaderBar from "../HeaderBar/HeaderBar";
import styles from "./CallSetting.module.css";
import ListeningAffirmations from "./ListeningAffirmation";
import Footer2 from "../AgentDetails/Footer/Footer2";


export default function CallSetting() {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
    const [selectedAgent, setSelectedAgent] = useState('SofiaB19548');

  return (
    <div>
     <HeaderBar
        // title={selectedAgent}
        subtitle="Call Setting For"
        dropdownOptions={['SofiaB19548', 'SommuB19548', 'MarryB19548']}
        onDropdownChange={setSelectedAgent}
      />

      

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


    <Footer2/>
    </div>
  );
}
