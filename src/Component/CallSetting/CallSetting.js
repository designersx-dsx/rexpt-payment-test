import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [selectedAgent, setSelectedAgent] = useState("SofiaB19548");
  const navigate = useNavigate();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCloseOverlay = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.blurContent}>
        <HeaderBar
          subtitle="Call Setting For"
          dropdownOptions={["SofiaB19548", "SommuB19548", "MarryB19548"]}
          onDropdownChange={setSelectedAgent}
        />

        <div className={styles.CallSettingContainer}>
          <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography component="span" sx={{ width: "80%" }}>
                <p className={styles.DropDownHeader}>Speech Setting</p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ListeningAffirmations />
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography component="span" sx={{ width: "80%" }}>
                <p className={styles.DropDownHeader}>Ring Duration</p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Coming soon content for Ring Duration.</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === "panel3"} onChange={handleChange("panel3")}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography component="span" sx={{ width: "80%" }}>
                <p className={styles.DropDownHeader}>Max Call Duration</p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Coming soon content for Max Call Duration.</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === "panel4"} onChange={handleChange("panel4")}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography component="span" sx={{ width: "80%" }}>
                <p className={styles.DropDownHeader}>End Call on Silence</p>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Coming soon content for End Call on Silence.</Typography>
            </AccordionDetails>
          </Accordion>
        </div>

        <Footer2 />
      </div>

      {/* Overlay */}
      <div className={styles.overlay}>
        <div className={styles.overlayContent}>
          <h2> Coming Soon</h2>
          <p>This feature is under development.</p>
          <button onClick={handleCloseOverlay} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
