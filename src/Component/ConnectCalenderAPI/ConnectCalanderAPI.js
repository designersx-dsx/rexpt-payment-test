import React, { useEffect, useState } from "react";
import styles from "./CalendarConnect.module.css";
import HeaderBar from "../HeaderBar/HeaderBar";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import decodeToken from "../../lib/decodeToken";
import { useLocation } from "react-router-dom";
import PopUp from "../Popup/Popup";

const CalendarConnect = () => {
  const [enabled, setEnabled] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const token = localStorage.getItem("token");
  const userId = decodeToken(token)?.id;
  const isValidCalApiKey = (key) => key.startsWith("cal_live_");
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventSlug, setEventSlug] = useState("");
  const [eventLength, setEventLength] = useState("");
  const [eventLoading, setEventLoading] = useState(false);
  const [agentId, setAgentId] = useState(null);
  const [llmId, setLlmId] = useState(null);
  const location = useLocation();
  const [popup, setPopup] = useState({ type: "", message: "" });
  const [apiSubmitting, setApiSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidCalApiKey(apiKey.trim())) {
      setPopup({
        type: "failed",
        message: "Invalid API Key! It must start with 'cal_live_'.",
      });
      return;
    }

    setApiSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/agent/update-calapikey/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ calApiKey: apiKey.trim() }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update API key");
      }

      setShowEventModal(true);
    } catch (error) {
      setPopup({
        type: "failed",
        message: "Failed to save API key. Please contact Rexpt team.",
      });
    } finally {
      setApiSubmitting(false);
    }
  };

  const createCalEvent = async () => {
    if (!apiKey || !eventName || !eventSlug || !eventLength) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setEventLoading(true);

      const response = await fetch(
        `https://api.cal.com/v1/event-types?apiKey=${encodeURIComponent(
          apiKey
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: eventName,
            slug: eventSlug,
            length: parseInt(eventLength, 10),
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to create event");
      }

      const data = await response.json();
      const eventTypeId = data?.event_type?.id;
      const retellPayload = {
        general_tools: [
          {
            type: "book_appointment_cal",
            name: "cal_tool",
            cal_api_key: apiKey.trim(),
            event_type_id: eventTypeId,
          },
        ],
      };

      const retellRes = await fetch(
        `https://api.retellai.com/update-retell-llm/${llmId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
          },
          body: JSON.stringify(retellPayload),
        }
      );

      if (!retellRes.ok) {
        const errData = await retellRes.json();
        throw new Error(
          "Retell LLM update failed: " + (errData?.message || "")
        );
      }

      setPopup({
        type: "success",
        message: "Cal event and Retell LLM updated successfully!",
      });

      setShowEventModal(false);
      setEventName("");
      setEventSlug("");
      setEventLength("");
    } catch (err) {
      setPopup({
        type: "failed",
        message: "Failed to create event. Please contact Rexpt team.",
      });
    } finally {
      setEventLoading(false);
    }
  };

  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const { agentId, llmId } = location.state || {};
    setAgentId(agentId);
    setLlmId(llmId);
  }, [location.state]);

  useEffect(() => {
    const { agentId: incomingAgentId, llmId: incomingLlmId } =
      location.state || {};
    setAgentId(incomingAgentId);
    setLlmId(incomingLlmId);

    try {
      const sessionData = JSON.parse(
        sessionStorage.getItem("dashboard-session-storage")
      );
      const agents = sessionData?.state?.agents || [];
      const matchedAgent = agents.find(
        (agent) => agent.agent_id === incomingAgentId
      );

      if (matchedAgent?.calApiKey) {
        setApiKey(matchedAgent.calApiKey);
      }
    } catch (err) {
      console.error("Error reading session storage:", err);
    }
  }, [location.state]);

  return (
    <div>
      <HeaderBar title="Connect Calendar" />
      <div className={styles.container}>
        <p className={styles.TopPara}>
          You can easily{" "}
          <strong>Connect your personal or business Calendar</strong> with your{" "}
          <a href="#">Rexptin Agent</a> to receive calendar Meetings.
        </p>

        <div className={styles.supportSection}>
          {/* <p>We Support</p> */}
          <div className={styles.icons}>
            <img src="/images/CalcSupport.png" alt="Outlook" />
          </div>
        </div>

        <div className={styles.toggleSection}>
          <label>
            I have <a href="#">Cal.com Account</a> to connect
          </label>

          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        {enabled && (
          <div className={styles.ONSwitch}>
            <form onSubmit={handleSubmit}>
              <div className={styles.labelRow}>
                <label htmlFor="apiKey">Enter your API Key below:</label>
                <a
                  href="https://app.cal.com/settings/developer/api-keys"
                  className={styles.link}
                >
                  Where is my Key?
                </a>
              </div>

              <input
                type="text"
                id="apiKey"
                placeholder="Cal.com API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={styles.input}
                readOnly={!!apiKey}
              />

              <p className={styles.description}>
                We will use your <strong>API Key</strong>, to create a custom
                meeting in your Cal.com profile for your agent to book meetings
                for you.
              </p>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={apiSubmitting}
              >
                {apiSubmitting ? (
                  "Submitting..."
                ) : (
                  <img src="/svg/CalSubmit.svg" alt="submit" />
                )}
              </button>
            </form>

            <div className={styles.helpLink}>
              <a href="/calinfo" target="_blank" rel="noopener noreferrer">
                Need Help to Find the API Key?
              </a>
            </div>
          </div>
        )}

        {!enabled && (
          <div className={styles.offSwitch}>
            <a href="https://cal.com/?via=designersx&dub_id=kTPL5nvpvLqoLhE2">
              {" "}
              <div className={styles.recommendation}>
                <img src="/images/CalCOm.png" />
              </div>
            </a>
            <p className={styles.patnerCal}>
              We have partnered with <strong>Cal.com</strong> to connect all
              your calendars to your AI Receptionist’s smooth operations.
            </p>

            {/* <hr /> */}

            <div className={styles.guideSection}>
              <Accordion
                className="CallAccordion connectCalender"
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
              >
                <AccordionSummary id="panel2bh-header">
                  <Typography
                    component="span"
                    sx={{ width: "80%", flexShrink: 0 }}
                  >
                    <p className={styles.ShowClick}>
                      <strong>
                        <a href="#">Why Cal.com Account</a>
                      </strong>{" "}
                      for Calendar Connection?
                    </p>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="AccorParaPadig">
                  <Typography>
                    <p className={styles.AccorPara}>
                      We have spent significant time & effort to build{" "}
                      <strong>the best Agentic AI Receptionist </strong>{" "}
                      service. Our goal is to democratize the AI Receptionist
                      creation for everyone rather the building calendar and
                      meeting management system.<br></br>
                      <br></br>
                      So we partnered with the best scheduling platform for
                      seamless integration of your calendars.
                    </p>
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <button className={styles.guideButton}>
                <div>
                  <h6>Guide to Connect</h6>

                  <p className={styles.paraTest}>
                    your agent to Cal.com Account
                  </p>
                </div>
                <div className={styles.playIcon}>
                  {/* <img src='/images/PlayBox.png'/> */}
                  <svg
                    width="55"
                    height="55"
                    viewBox="0 0 67 65"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="2" width="65" height="65" rx="16" fill="#5F33E1" />
                    <path
                      d="M25.1855 21.8388C25.1855 16.4934 31.6484 13.8164 35.4282 17.5962L46.1284 28.2964C48.4716 30.6396 48.4716 34.4385 46.1284 36.7817L35.4282 47.4819C31.6484 51.2617 25.1855 48.5847 25.1855 43.2393V32.5391V21.8388Z"
                      fill="#E0E5F2"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        )}
        {showEventModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <h2>Create Cal Event</h2>

              <label>Event Name</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Meeting with John"
              />

              <label>Slug (Description)</label>
              <input
                type="text"
                value={eventSlug}
                onChange={(e) => setEventSlug(e.target.value)}
                placeholder="Follow-up session"
              />

              <label>Length (in minutes)</label>
              <input
                type="number"
                value={eventLength}
                onChange={(e) => setEventLength(e.target.value)}
                placeholder="30"
              />

              <div className={styles.modalActions}>
                <button onClick={() => setShowEventModal(false)}>Cancel</button>
                <button onClick={createCalEvent} disabled={eventLoading}>
                  {eventLoading ? "Creating..." : "Create Event"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <PopUp
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ type: "", message: "" })}
      />
    </div>
  );
};

export default CalendarConnect;
