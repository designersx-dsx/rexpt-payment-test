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
import { useNavigate } from "react-router-dom";
import CallRecording from "../CallRecording/CallRecording";
import { API_BASE_URL, token } from "../../Store/apiStore";
import axios from "axios";

const countryMappings = {
  us: { code: "+1", flag: "us" },
  ca: { code: "+1", flag: "ca" },
  gb: { code: "+44", flag: "gb" },
};

export default function CallSetting() {
  const [expanded, setExpanded] = useState("panel1");
  const { agents, setHasFetched } = useDashboardStore();
  const location = useLocation();
  const { selectedAgentname, fromPage } = location.state || {};
  const [frequency, setFrequency] = useState(0.7);
  const [frequency1, setFrequency1] = useState(0.2);

  const [selectedAgent, setSelectedAgent] = useState(selectedAgentname || "");
  const [settings, setSettings] = useState({
    phoneNumber: "",
    selectedCountry: "us",
    ringDuration: 30,
    maxCallDuration: 3600,
    endCallOnSilence: false,
    conversationalNods: false,
  });

  const agent = agents.find(
    (agent) => `${agent.agentName}-${agent.agentCode}` === selectedAgent
  );
  const agentId = agent?.agent_id;
  const businessId = agent?.businessId;

  const prevSettings = useRef(settings);
  const isInitialLoad = useRef(true);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    console.log(`Input changed: ${field} = ${value}`);
  };

  const dropdownOptions = agents.map(
    (agent) => `${agent.agentName}-${agent.agentCode}`
  );
   const placeDetails = sessionStorage.getItem("placeDetailsExtract");
  useEffect(() => {
 
    if (placeDetails) {
      const parsedDetails = JSON.parse(placeDetails);
      if (parsedDetails && parsedDetails.phone && parsedDetails.country) {
        const phone = parsedDetails.phone;
        const countryName = parsedDetails.country.toLowerCase();
        const countryData =
          countryMappings[countryName] || countryMappings["us"];
        const formattedPhone =
          phone.startsWith("+") && phone.startsWith(countryData.code)
            ? phone
            : `${countryData.code}${phone}`;

        setSettings((prevSettings) => ({
          ...prevSettings,
          phoneNumber: formattedPhone,
          selectedCountry: countryData.flag,
        }));
      }
    }
  }, [placeDetails]);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      prevSettings.current = settings;
      return;
    }
  }, [settings, selectedAgent, agents]);

  useEffect(() => {
    const selectedAgentId = sessionStorage.getItem("SelectAgentId");

    if (selectedAgentId) {
      const fetchAgentDetails = async () => {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/agent/getAgent/${selectedAgentId}` , 
             { headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },}
          );
          const silenceDurationMs = res.data.end_call_after_silence_ms;
          const silenceDurationSec = silenceDurationMs / 1000;
          setFrequency(silenceDurationSec <= 30 ? silenceDurationSec : 30);
        } catch (error) {
          console.error("Error fetching agent details:", error);
        }
      };
      fetchAgentDetails();
    } else {
      console.log("No selectedAgentId found in sessionStorage.");
    }
  }, []);

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
        <Accordion
          className="CallAccordion"
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography component="span" sx={{ width: "80%" }}>
              <p className={styles.DropDownHeader}>
                Call Recording Deceleration
              </p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CallRecording agentId={agentId} businessId={businessId} />
          </AccordionDetails>
        </Accordion>

        <Accordion
          className="CallAccordion"
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id="panel2bh-header"
          >
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>
                Default Call Transfer Number
              </p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className={styles.formGroup}>
                <label>
                  Phone Number <span className={styles.requiredStar1}>*</span>
                </label>
                <PhoneInput
                  value={settings.phoneNumber}
                  onChange={(phone, countryData) => {
                    const formattedPhone = phone.startsWith("+")
                      ? phone
                      : `+${countryData?.dialCode}${phone}`;
                    handleInputChange("phoneNumber", formattedPhone);
                    handleInputChange(
                      "selectedCountry",
                      countryData?.iso2 || "us"
                    );
                  }}
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    paddingLeft: "45px",
                    borderRadius: "5px",
                  }}
                  placeholder="+1 (123) 456-7890"
                  required
                  disabled
                />
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          className="CallAccordion"
          expanded={expanded === "panel5"}
          onChange={handleChange("panel5")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id="panel5bh-header"
          >
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>End Call on Silence</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={styles.sliderContainer}>
              <label className={styles.sliderLabel}>End Call Time (Sec.)</label>
              <div className={styles.sliderWrapper}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={frequency}
                  className={styles.sliderRange}
                  style={{
                    background: `linear-gradient(to right, #693bff ${
                      frequency * 100
                    }%, #fff ${frequency * 100}%)`,
                    cursor: "not-allowed",
                    pointerEvents: "none",
                  }}
                  disabled
                />
                <span className={styles.sliderValue}>
                  {frequency.toFixed(1)}Sec
                </span>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion
          className="CallAccordion"
          expanded={expanded === "panel6"}
          onChange={handleChange("panel6")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel6bh-content"
            id="panel6bh-header"
          >
            <Typography component="span" sx={{ width: "80%" }}>
              <p className={styles.DropDownHeader}>Conversational Nods</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ListeningAffirmations
              conversationalNods={settings.conversationalNods}
              onChange={(value) =>
                handleInputChange("conversationalNods", value)
              }
            />
          </AccordionDetails>
        </Accordion>

        <Accordion
          className="CallAccordion"
          expanded={expanded === "panel7"}
          onChange={handleChange("panel7")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id="panel7bh-header"
          >
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>Speech Setting</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SpeechSetting onChange={handleInputChange} />
          </AccordionDetails>
        </Accordion>
      </div>
      <Footer2 />
    </div>
  );
}

{
  /* <Accordion
          className="CallAccordion"
          expanded={expanded === "panel8"}
          onChange={handleChange("panel8")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id="panel8bh-header"
          >
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>Call Setting</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CallSeting1 onChange={handleInputChange} />
          </AccordionDetails>
        </Accordion> */
}

{
  /* <Accordion
          className="CallAccordion"
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id="panel3bh-header"
          >
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>Ring Duration</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <input
                type="number"
                value={settings.ringDuration}
                onChange={(e) =>
                  handleInputChange("ringDuration", parseInt(e.target.value))
                }
                placeholder="Enter ring duration (seconds)"
              />
            </Typography>
          </AccordionDetails>
        </Accordion> */
}

{
  /* <Accordion
          className="CallAccordion"
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id="panel4bh-header"
          >
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>Max Call Duration</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <input
                type="number"
                value={settings.maxCallDuration}
                onChange={(e) =>
                  handleInputChange("maxCallDuration", parseInt(e.target.value))
                }
                placeholder="Enter max call duration (seconds)"
              />
            </Typography>
          </AccordionDetails>
        </Accordion> */
}

{
  /* <Accordion
          className="CallAccordion"
          expanded={expanded === "panel9"}
          onChange={handleChange("panel9")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id="panel9bh-header"
          >
            <Typography component="span" sx={{ width: "80%", flexShrink: 0 }}>
              <p className={styles.DropDownHeader}>Lead Setting</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <LeadSetting onChange={handleInputChange} />
          </AccordionDetails>
        </Accordion> */
}
