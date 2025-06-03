import React, { useEffect, useState } from "react";
import styles from "./AgentDetail.module.css";
import AgentAnalysis from "./AgentAnalysisGraph/AgentAnalysis";
import { fetchAgentDetailById } from "../../Store/apiStore";
import OffCanvas from "../OffCanvas/OffCanvas";
import { useLocation, useNavigate } from "react-router-dom";

import { RetellWebClient } from "retell-client-js-sdk";
import CallTest from "../CallTest/CallTest";
import Modal2 from "../Modal2/Modal2";
import Loader2 from "../Loader2/Loader2";
import Footer from "./Footer/Footer";
import AssignNumberModal from "./AssignNumberModal";

import EditAgent from "../EditAgent/EditAgent"
import DetailModal from "../DetailModal/DetailModal"
import { useAgentStore } from "../../Store/agentStore";
const AgentDashboard = () => {
  // const [totalBookings, setTotalBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [agentData, setAgentData] = useState([]);

  const location = useLocation();
  const agentDetails = location.state;
  const [openOffcanvas, setOpenOffcanvas] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  // const [assignedNumbers, setAssignedNumbers] = useState([]);
  const [retellWebClient, setRetellWebClient] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [openCallModal, setOpenCallModal] = useState(false);
  const [callLoading, setCallLoading] = useState(false);

  console.log('agentDetails', agentDetails)
    const {
    agentData,
    assignedNumbers,
    totalBookings,
    setAgentData,
    setAssignedNumbers,
    setTotalBookings,
  } = useAgentStore();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isCalModalOpen, setIsCalModalOpen] = useState(false);
const [apiKey, setApiKey] = useState("");
const [isApiKeyEditable, setIsApiKeyEditable] = useState(false);
const [showEventInputs, setShowEventInputs] = useState(false);
const [eventCreateStatus, setEventCreateStatus] = useState(null);
const [eventCreateMessage, setEventCreateMessage] = useState("");
const [eventName, setEventName] = useState("");
const [eventSlug, setEventSlug] = useState("");
const [eventLength, setEventLength] = useState("");
const [showCalKeyInfo, setShowCalKeyInfo] = useState(false);

const isValidCalApiKey = (key) => key.startsWith("cal_live_");
const openCalModal = () => {
  if (!agentData?.agent) return;
  setApiKey(agentData.agent.calApiKey || "");
  setIsApiKeyEditable(false);
  setShowEventInputs(false);
  setEventCreateStatus(null);
  setEventCreateMessage("");
  setIsCalModalOpen(true);
};
const closeCalModal = () => {
  setIsCalModalOpen(false);
  setApiKey("");
  setShowEventInputs(false);
  setEventCreateStatus(null);
  setEventCreateMessage("");
  setEventName("");
  setEventSlug("");
  setEventLength("");
};

const handleApiKeySubmit = async () => {
  if (!agentData?.agent) return;

  if (!isValidCalApiKey(apiKey.trim())) {
    setEventCreateStatus("error");
    setEventCreateMessage("Invalid API Key! It must start with 'cal_live_'.");
    return;
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/agent/update-calapikey/${agentData.agent.agent_id}`,
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

    setEventCreateStatus("success");
    setEventCreateMessage("Cal API key updated successfully!");
    setShowEventInputs(true);
    setShowCalKeyInfo(true);
  } catch (error) {
    setEventCreateStatus("error");
    setEventCreateMessage(`Failed to save API Key: ${error.message}`);
  }
};

const createCalEvent = async () => {
  if (!apiKey.trim()) {
    alert("API Key is required to create an event.");
    return;
  }
  if (!eventName.trim() || !eventSlug.trim() || !eventLength.trim()) {
    alert("Please fill all event fields.");
    return;
  }
  try {
    const url = `https://api.cal.com/v1/event-types?apiKey=${encodeURIComponent(apiKey.trim())}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: eventName.trim(),
        slug: eventSlug.trim(),
        length: parseInt(eventLength, 10),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create event");
    }

    const responseData = await response.json();
    const eventTypeId = responseData.event_type.id;

    setEventCreateStatus("success");
    setEventCreateMessage("Your Cal event has been created successfully!");
    setShowCalKeyInfo(false);

    // Update Retell LLM with Cal event info
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

    const retellUrl = `https://api.retellai.com/update-retell-llm/${agentData.agent.llmId}`;
    const retellResponse = await fetch(retellUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
      },
      body: JSON.stringify(retellPayload),
    });

    if (!retellResponse.ok) {
      const retellError = await retellResponse.json();
      console.error("Error updating Retell LLM:", retellError);
    } else {
      console.log("Retell LLM updated successfully!");
    }

    setEventName("");
    setEventSlug("");
    setEventLength("");

    setTimeout(() => {
      closeCalModal();
    }, 1000);
  } catch (error) {
    setEventCreateStatus("error");
    setEventCreateMessage(`Error creating event: ${error.message}`);
    console.error("Error in createCalEvent:", error);
  }
};



  useEffect(() => {
    const getAgentDetailsAndBookings = async () => {
      try {
        const response = await fetchAgentDetailById(agentDetails);
        setAgentData(response?.data);
        const voipNumbersStr = response?.data?.agent?.voip_numbers;
        if (voipNumbersStr) {
          try {
            const numbersArray = JSON.parse(voipNumbersStr);
            setAssignedNumbers(numbersArray);
          } catch (e) {
            console.warn("Failed to parse voip_numbers:", e);
            setAssignedNumbers([]);
          }
        } else {
          setAssignedNumbers([]);
        }

        const calApiKey = response?.data?.agent?.calApiKey;
        if (calApiKey) {
          const calResponse = await fetch(
            `https://api.cal.com/v1/bookings?apiKey=${encodeURIComponent(calApiKey)}`
          );
          if (!calResponse.ok) {
            throw new Error("Failed to fetch total bookings from Cal.com");
          }

          const bookingsData = await calResponse.json();
          setTotalBookings(bookingsData.bookings?.length || 0);
        }
      } catch (err) {
        console.error("Failed to fetch data", err.response || err.message || err);
        setTotalBookings(0);
        setAssignedNumbers([]);
      } finally {
        setLoading(false);
      }
    };

    if (agentDetails ) {
      getAgentDetailsAndBookings();
    }
  }, [agentDetails]);

console.log('loading',loading)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("agents");
    sessionStorage.clear();
    window.location.href = "/signup";
  };

  const withShimmer = (content) =>
    loading ? (
      <div className={styles.shimmerContainer} style={{ minHeight: "150px" }}>
        {content}
      </div>
    ) : (
      content
    );

  const handleOpencanvas = () => {
    setOpenOffcanvas(true);
  };
  const handleCloseOffcanvas = () => {
    setOpenOffcanvas(false);
  };
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };
  useEffect(() => {
    const client = new RetellWebClient();
    client.on("call_started", () => setIsCallActive(true));
    client.on("call_ended", () => setIsCallActive(false));
    setRetellWebClient(client);
  }, []);

  // Start call handler
  const handleStartCall = async () => {
    if (!retellWebClient || !agentData?.agent) {
      console.error("RetellWebClient or agent data not ready.");
      return;
    }
    setCallLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/agent/create-web-call`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent_id: agentData.agent.agent_id }),
        }
      );
      const data = await res.json();
      await retellWebClient.startCall({ accessToken: data.access_token });
    } catch (err) {
      console.error("Error starting call:", err);
    } finally {
      setCallLoading(false);
    }
  };

  // End call handler
  const handleEndCall = async () => {
    if (retellWebClient) {
      const response = await retellWebClient.stopCall();
      console.log("Call end response", response);
    }
  };

  // Open call modal
  const openCallTestModal = () => {
    setOpenCallModal(true);
  };

  // Close call modal
  const closeCallTestModal = () => {
    setOpenCallModal(false);
  };

  return (
    <div>
      {loading ? (
        <Loader2 />
      ) : (
   <>
          <div className={styles.Forsticky}>
            <header className={styles.header}>
              <div className={styles.profileBack}>
                <img
                  src="svg/Notification.svg"
                  alt="Back button"
                  onClick={handleBackClick}
                ></img>
              </div>
              <div className={styles.profileSection}></div>
              <div className={styles.notifiMain}>
                <div className={styles.notificationIcon}>
                  <svg
                    width="20"
                    height="22"
                    viewBox="0 0 20 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10 4.68945C10.4142 4.68945 10.75 5.02524 10.75 5.43945V8.76945C10.75 9.18367 10.4142 9.51945 10 9.51945C9.58579 9.51945 9.25 9.18367 9.25 8.76945V5.43945C9.25 5.02524 9.58579 4.68945 10 4.68945Z"
                      fill="#0A0A0A"
                      fill-opacity="0.9"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2.61001 7.66C2.61001 3.56579 5.9258 0.25 10.02 0.25C14.0946 0.25 17.4289 3.58574 17.44 7.65795L17.44 7.65898V9.76C17.44 10.0064 17.4942 10.3614 17.5969 10.7349C17.6997 11.1089 17.8345 11.441 17.9621 11.6525L17.9628 11.6535L19.2334 13.7746L19.2336 13.7749C20.2082 15.4038 19.4348 17.519 17.6272 18.1215L17.6269 18.1216L17.6267 18.1217C12.693 19.7628 7.35696 19.7628 2.42329 18.1217L2.42306 18.1216L2.42284 18.1215C1.50673 17.8161 0.827321 17.1773 0.523982 16.3562C0.220761 15.5354 0.320841 14.6072 0.815592 13.7763L0.816106 13.7754L2.08724 11.6535L2.08787 11.6525C2.21604 11.4401 2.35075 11.1098 2.45325 10.7381C2.55563 10.3669 2.61001 10.0118 2.61001 9.76V7.66ZM10.02 1.75C6.75423 1.75 4.11001 4.39421 4.11001 7.66V9.76C4.11001 10.1882 4.02439 10.6831 3.89927 11.1369C3.7744 11.5897 3.59436 12.0589 3.37286 12.4263C3.37262 12.4267 3.37239 12.4271 3.37215 12.4275L2.10443 14.5437C2.10428 14.544 2.10413 14.5442 2.10398 14.5445C1.81916 15.0233 1.79933 15.4798 1.93104 15.8363C2.0627 16.1927 2.37329 16.5239 2.89718 16.6985C7.52323 18.2372 12.5268 18.2372 17.1528 16.6985C18.0452 16.401 18.4317 15.3562 17.9464 14.5451L16.6778 12.4275C16.6777 12.4272 16.6775 12.427 16.6774 12.4267C16.4552 12.0583 16.2752 11.5858 16.1506 11.1326C16.0258 10.6786 15.94 10.1836 15.94 9.76V7.66107C15.9306 4.41373 13.2651 1.75 10.02 1.75Z"
                      fill="#0A0A0A"
                      fill-opacity="0.9"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.41992 17.8203C7.41992 18.5204 7.71292 19.1727 8.18025 19.64L8.18027 19.64C8.64755 20.1073 9.2998 20.4003 9.99988 20.4003C11.4157 20.4003 12.5799 19.2361 12.5799 17.8203H14.0799C14.0799 20.0645 12.2441 21.9003 9.99988 21.9003C8.87997 21.9003 7.85223 21.4333 7.11959 20.7006M7.11957 20.7006C6.38691 19.968 5.91992 18.9402 5.91992 17.8203H7.41992"
                      fill="#0A0A0A"
                      fill-opacity="0.9"
                    />
                  </svg>
                </div>
                <div className={styles.notificationIcon} onClick={handleOpencanvas}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M17.448 1.75C16.5495 1.74997 15.8003 1.74995 15.2055 1.82991C14.5777 1.91432 14.0109 2.09999 13.5555 2.55546C13.1 3.01093 12.9143 3.57773 12.8299 4.20552C12.7499 4.8003 12.75 5.54951 12.75 6.44798V6.552C12.75 7.45047 12.7499 8.19971 12.8299 8.79448C12.9143 9.42228 13.1 9.98908 13.5555 10.4445C14.0109 10.9 14.5777 11.0857 15.2055 11.1701C15.8003 11.2501 16.5495 11.25 17.448 11.25H17.552C18.4505 11.25 19.1997 11.2501 19.7945 11.1701C20.4223 11.0857 20.9891 10.9 21.4445 10.4445C21.9 9.98908 22.0857 9.42228 22.1701 8.79448C22.2501 8.1997 22.25 7.45048 22.25 6.552V6.44801C22.25 5.54953 22.2501 4.80031 22.1701 4.20552C22.0857 3.57773 21.9 3.01093 21.4445 2.55546C20.9891 2.09999 20.4223 1.91432 19.7945 1.82991C19.1997 1.74995 18.4505 1.74997 17.552 1.75H17.448ZM14.6161 3.61612C14.7464 3.4858 14.9439 3.37858 15.4054 3.31654C15.8884 3.2516 16.536 3.25 17.5 3.25C18.464 3.25 19.1116 3.2516 19.5946 3.31654C20.0561 3.37858 20.2536 3.4858 20.3839 3.61612C20.5142 3.74644 20.6214 3.94393 20.6835 4.4054C20.7484 4.88843 20.75 5.53599 20.75 6.5C20.75 7.46401 20.7484 8.11157 20.6835 8.59461C20.6214 9.05607 20.5142 9.25357 20.3839 9.38389C20.2536 9.5142 20.0561 9.62143 19.5946 9.68347C19.1116 9.74841 18.464 9.75 17.5 9.75C16.536 9.75 15.8884 9.74841 15.4054 9.68347C14.9439 9.62143 14.7464 9.5142 14.6161 9.38389C14.4858 9.25357 14.3786 9.05607 14.3165 8.59461C14.2516 8.11157 14.25 7.46401 14.25 6.5C14.25 5.53599 14.2516 4.88843 14.3165 4.4054C14.3786 3.94393 14.4858 3.74644 14.6161 3.61612Z"
                      fill="#0A0A0A"
                      fill-opacity="0.9"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.44801 12.75C5.54954 12.75 4.8003 12.7499 4.20552 12.8299C3.57773 12.9143 3.01093 13.1 2.55546 13.5555C2.09999 14.0109 1.91432 14.5777 1.82991 15.2055C1.74995 15.8003 1.74997 16.5495 1.75 17.448V17.552C1.74997 18.4505 1.74995 19.1997 1.82991 19.7945C1.91432 20.4223 2.09999 20.9891 2.55546 21.4445C3.01093 21.9 3.57773 22.0857 4.20552 22.1701C4.80031 22.2501 5.54953 22.25 6.44801 22.25H6.552C7.45048 22.25 8.1997 22.2501 8.79448 22.1701C9.42228 22.0857 9.98908 21.9 10.4445 21.4445C10.9 20.9891 11.0857 20.4223 11.1701 19.7945C11.2501 19.1997 11.25 18.4505 11.25 17.552V17.448C11.25 16.5495 11.2501 15.8003 11.1701 15.2055C11.0857 14.5777 10.9 14.0109 10.4445 13.5555C9.98908 13.1 9.42228 12.9143 8.79448 12.8299C8.19971 12.7499 7.4505 12.75 6.55203 12.75H6.44801ZM3.61612 14.6161C3.74644 14.4858 3.94393 14.3786 4.4054 14.3165C4.88843 14.2516 5.53599 14.25 6.5 14.25C7.46401 14.25 8.11157 14.2516 8.59461 14.3165C9.05607 14.3786 9.25357 14.4858 9.38389 14.6161C9.5142 14.7464 9.62143 14.9439 9.68347 15.4054C9.74841 15.8884 9.75 16.536 9.75 17.5C9.75 18.464 9.74841 19.1116 9.68347 19.5946C9.62143 20.0561 9.5142 20.2536 9.38389 20.3839C9.25357 20.5142 9.05607 20.6214 8.59461 20.6835C8.11157 20.7484 7.46401 20.75 6.5 20.75C5.53599 20.75 4.88843 20.7484 4.4054 20.6835C3.94393 20.6214 3.74644 20.5142 3.61612 20.3839C3.4858 20.2536 3.37858 20.0561 3.31654 19.5946C3.2516 19.1116 3.25 18.464 3.25 17.5C3.25 16.536 3.2516 15.8884 3.31654 15.4054C3.37858 14.9439 3.4858 14.7464 3.61612 14.6161Z"
                      fill="#0A0A0A"
                      fill-opacity="0.9"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M1.75 6.5C1.75 3.87665 3.87665 1.75 6.5 1.75C9.12336 1.75 11.25 3.87665 11.25 6.5C11.25 9.12336 9.12336 11.25 6.5 11.25C3.87665 11.25 1.75 9.12336 1.75 6.5ZM6.5 3.25C4.70508 3.25 3.25 4.70508 3.25 6.5C3.25 8.29493 4.70508 9.75 6.5 9.75C8.29493 9.75 9.75 8.29493 9.75 6.5C9.75 4.70508 8.29493 3.25 6.5 3.25Z"
                      fill="#0A0A0A"
                      fill-opacity="0.9"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.75 17.5C12.75 14.8767 14.8767 12.75 17.5 12.75C20.1234 12.75 22.25 14.8767 22.25 17.5C22.25 20.1234 20.1234 22.25 17.5 22.25C14.8767 22.25 12.75 20.1234 12.75 17.5ZM17.5 14.25C15.7051 14.25 14.25 15.7051 14.25 17.5C14.25 19.2949 15.7051 20.75 17.5 20.75C19.2949 20.75 20.75 19.2949 20.75 17.5C20.75 15.7051 19.2949 14.25 17.5 14.25Z"
                      fill="#0A0A0A"
                      fill-opacity="0.9"
                    />
                  </svg>
                </div>
              </div>
            </header>

            <section className={styles.agentCard}>
              <div className={styles.agentInfo}>
                <div className={styles.agentAvatarContainer}>
                  <img
                    src={agentData?.agent?.avatar || "images/SofiaAgent.png"}
                    alt="Sofia"
                    className={styles.agentAvatar}
                  />
                </div>
                <div>
                  <div className={styles.foractive}>
                    <h3 className={styles.agentName}>
                      {agentData?.agent?.agentName}
                      <span
                        className={
                          agentData?.agent?.agentStatus
                            ? styles.activeText
                            : styles.InactiveText
                        }
                      >
                        {agentData?.agent?.agentStatus ? "Active" : "Inactive"}
                      </span>
                    </h3>
                    <p className={styles.agentAccent}>
                      {agentData?.agent?.agentLanguage}.
                      {agentData?.agent?.agentAccent}
                    </p>
                  </div>

                  <hr className={styles.agentLine}></hr>

                  <div className={styles.agentDetailsFlex}>

                    {assignedNumbers.length > 0 ? (
                      <div className={styles.AssignNumText}>Assigned Number<p>{assignedNumbers.join(", ")}</p>
                      </div>
                    ) : (
                      <div
                        className={styles.AssignNum}
                        onClick={() => setIsAssignModalOpen(true)}
                      >
                        Assign Number
                      </div>
                    )}

                    <p className={styles.agentDetails}>
                      Agent Code{" "}
                      <strong>{agentData?.agent?.agentCode || "NA"}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className={styles.container}>
            <div className={styles.businessInfo}>
              <div className={styles.card1}>
                <h2>{agentData?.business?.businessName || "NA"}</h2>
                <p>{agentData?.business?.businessSize || "NA"}</p>
                <div className={styles.health}>
                  {/* <h3>Health <span> /Categories</span></h3> */}
                  <h3>{agentData?.business?.businessType || "NA"}<span> / Categories</span></h3>
                </div>

                <h4>Business Details</h4>
              </div>

              <div className={styles.card2}>
                <h2>
                  URL:
                  <span style={{ fontSize: "12px" }}>
                    {(() => {
                      const filteredUrls =
                        agentData?.knowledgeBase?.knowledge_base_sources?.filter(
                          (src) => src?.url && !src.url.includes("google.com")
                        );
                      if (filteredUrls && filteredUrls.length > 0) {
                        return filteredUrls.map((src, index) => (
                          <div key={index}>{src.url}</div>
                        ));
                      } else {
                        return <div>NA</div>;
                      }
                    })()}
                  </span>
                </h2>
                <div className={styles.google}>
                  <img src="images/google-icon.png" alt="google-icon" />
                  <p>
                    <span style={{ fontSize: "12px" }}>
                      {(() => {
                        const filteredUrls =
                          agentData?.knowledgeBase?.knowledge_base_sources?.filter(
                            (src) => src?.url && src.url.includes("google.com")
                          );
                        if (filteredUrls && filteredUrls.length > 0) {
                          return filteredUrls.map((src, index) => (
                            <div key={index}>{src.url}</div>
                          ));
                        } else {
                          return <div>NA</div>;
                        }
                      })()}
                    </span>
                  </p>
                </div>
                <div className={styles.address}>
                  <img src="svg/location.svg" alt="location" />
                  <p>
                    {agentData?.business?.address1 || ""}{" "}
                    {agentData?.business?.address2 || ""},
                    {agentData?.business?.city}
                  </p>
                </div>
                <h4>Knowledge Base</h4>
              </div>
            </div>
            <div className={styles.managementActions}>
              <div className={styles.managementItem} >
                <div className={styles.SvgDesign}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.0001 3.90244L16.0977 0L13.3936 2.70407L17.296 6.60651L20.0001 3.90244Z" fill="#6524EB" />
                    <path d="M4 16L8.2927 15.6098L15.6797 8.22279L11.7772 4.32031L4.39024 11.7073L4 16Z" fill="#6524EB" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13 20H0V18H13V20Z" fill="#6524EB" />
                  </svg>

                </div>
                <p className={styles.managementText} onClick={() => setModalOpen(true)}>Edit Agent</p>
              </div>
              <div className={styles.managementItem}>
                <div className={styles.SvgDesign}>
                  <svg
                    width="22"
                    height="25"
                    viewBox="0 0 22 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.45652 14.9118C4.63352 14.4278 5.31903 14.4278 5.49604 14.9118L6.32479 17.1862C6.49258 17.6466 6.85476 18.0088 7.31517 18.1766L9.5896 19.0054C10.0736 19.1824 10.0736 19.8679 9.5896 20.0449L7.31517 20.8736C6.85476 21.0414 6.49258 21.4036 6.32479 21.864L5.49604 24.1384C5.31904 24.6224 4.63353 24.6224 4.45652 24.1384L3.62777 21.864C3.45998 21.4036 3.0978 21.0414 2.63739 20.8736L0.362965 20.0449C-0.120988 19.8679 -0.120988 19.1824 0.362965 19.0054L2.63739 18.1766C3.0978 18.0088 3.45999 17.6466 3.62777 17.1862L4.45652 14.9118Z"
                      fill="#6524EB"
                    />
                    <path
                      d="M14.4798 6.40251C14.7213 5.73953 15.6595 5.73953 15.902 6.40251L17.0356 9.51493C17.2658 10.1441 17.762 10.6404 18.3912 10.8696L21.5037 12.0042C22.1666 12.2467 22.1666 13.1849 21.5037 13.4264L18.3912 14.56C17.762 14.7902 17.2658 15.2864 17.0356 15.9157L15.902 19.0281C15.6605 19.6911 14.7213 19.6911 14.4798 19.0281L13.3462 15.9157C13.116 15.2864 12.6198 14.7902 11.9905 14.56L8.87809 13.4264C8.21511 13.1849 8.21511 12.2467 8.87809 12.0042L11.9905 10.8696C12.6197 10.6404 13.116 10.1442 13.3462 9.51493L14.4798 6.40251Z"
                      fill="#6524EB"
                    />
                    <path
                      d="M4.86428 1.28246C5.03617 0.810794 5.70325 0.810794 5.87515 1.28246L6.68239 3.49652C6.84609 3.94464 7.19908 4.29763 7.64721 4.46134L9.86126 5.26756C10.3329 5.44047 10.3329 6.10754 9.86126 6.27944L7.64721 7.08669C7.19908 7.25039 6.84609 7.60338 6.68239 8.0515L5.87515 10.2656C5.70326 10.7372 5.03618 10.7372 4.86428 10.2656L4.05704 8.0515C3.89334 7.60338 3.54034 7.25039 3.09222 7.08669L0.878166 6.27944C0.406497 6.10756 0.406497 5.44048 0.878166 5.26756L3.09222 4.46134C3.54034 4.29763 3.89334 3.94464 4.05704 3.49652L4.86428 1.28246Z"
                      fill="#6524EB"
                    />
                  </svg>
                </div>
                <p className={styles.managementText} onClick={openCallTestModal} style={{ cursor: "pointer" }}>Test Agent</p>

              </div>
              <div className={styles.managementItem}>
                <div className={styles.SvgDesign}>
                  <svg
                    width="22"
                    height="19"
                    viewBox="0 0 22 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.49847 3.35056C7.49847 1.49923 9.06498 0 10.9997 0C12.9343 0 14.5008 1.49912 14.5008 3.35056C14.5008 4.91572 13.3783 6.23225 11.8624 6.59968V11.163L15.8765 13.426C16.5206 12.7348 17.4545 12.2989 18.4988 12.2989C20.4334 12.2989 22 13.798 22 15.6494C22 17.5008 20.4335 19 18.4988 19C16.5641 19 14.9956 17.4987 14.9956 15.6494C14.9956 15.3457 15.0393 15.0507 15.1198 14.7711L10.9976 12.4465L6.8802 14.7667C6.96071 15.0485 7.00442 15.3435 7.00442 15.6494C7.00442 17.4986 5.43562 19 3.50324 19C1.57086 19 0 17.4987 0 15.6494C0 13.8002 1.5688 12.2989 3.50324 12.2989C4.54297 12.2989 5.4792 12.7326 6.12099 13.4238L10.2685 11.0859V6.62828C8.68585 6.30689 7.4989 4.96185 7.4989 3.35042L7.49847 3.35056Z"
                      fill="#6524EB"
                    />
                  </svg>
                </div>
                <p className={styles.managementText}>Integrate</p>
              </div>
              <div className={styles.managementItem}>
                <div className={styles.SvgDesign}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.9075 13.7036C17.7025 12.4986 15.8722 12.3081 14.4642 13.123C12.3349 14.3748 9.5527 14.0927 7.72536 12.2647C5.88086 10.4205 5.61058 7.60564 6.90038 5.46931C6.89904 5.4683 6.89702 5.46729 6.89567 5.46628C7.67353 4.06607 7.47157 2.26734 6.28241 1.07818C4.84484 -0.359392 2.51497 -0.359392 1.07707 1.07818C-0.279723 2.4353 -0.354108 4.58711 0.850878 6.0331C2.69875 8.47067 4.7277 10.8143 6.95154 13.0382C9.16562 15.2523 11.4975 17.2768 13.922 19.12C13.9246 19.1176 13.9267 19.1153 13.9287 19.1129C15.375 20.3398 17.543 20.2735 18.9078 18.9086C20.3444 17.4717 20.3444 15.1412 18.9075 13.7036Z" fill="#6524EB" />
                    <path d="M11.6781 3.26778H12.6878V3.9349H13.6976V3.26744V1.92109V1.24219H12.6878V1.92142H11.6781C11.3065 1.92142 11.0049 2.22301 11.0049 2.5946C11.0049 2.96619 11.3065 3.26778 11.6781 3.26778Z" fill="#6524EB" />
                    <path d="M19.4351 2.5931C19.4351 2.22151 19.1335 1.91992 18.7619 1.91992L14.3711 1.92093V3.26729L18.7619 3.26661C19.1335 3.26628 19.4351 2.96469 19.4351 2.5931Z" fill="#6524EB" />
                    <path d="M11.6781 5.96031L16.3903 5.95964V4.61328L11.6781 4.61396C11.3065 4.61396 11.0049 4.91554 11.0049 5.28713C11.0049 5.65873 11.3065 5.96031 11.6781 5.96031Z" fill="#6524EB" />
                    <path d="M18.7616 4.61246H18.0732V3.93457H17.0635V4.6128V5.95915V6.62728H18.0732V5.95915H18.7616C19.1332 5.95915 19.4347 5.65757 19.4347 5.28597C19.4347 4.91438 19.1332 4.61246 18.7616 4.61246Z" fill="#6524EB" />
                    <path d="M11.6781 8.65352L13.0244 8.65318V9.32064H14.0342V8.65318V7.30683V6.62793H13.0244V7.30683L11.6781 7.30717C11.3065 7.30717 11.0049 7.60875 11.0049 7.98034C11.0049 8.35194 11.3065 8.65352 11.6781 8.65352Z" fill="#6524EB" />
                    <path d="M18.7612 7.30469L14.707 7.3057V8.65205L18.7612 8.65138C19.1328 8.65138 19.4344 8.34979 19.4344 7.9782C19.4344 7.60661 19.1328 7.30469 18.7612 7.30469Z" fill="#6524EB" />
                  </svg>

                </div>
                <p className={styles.managementText}>Call Setting</p>
              </div>

              
              <div className={styles.managementItem}>
                <div className={styles.SvgDesign}>
                  <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.01032 16.5278C3.10401 17.5153 3.92705 18.2446 4.91546 18.2446H11.6882C12.6756 18.2446 13.4987 17.5153 13.5933 16.5278L14.6754 5.875L1.90527 5.87592L3.01032 16.5278ZM9.59468 9.2857H10.5353V14.8119H9.59468V9.2857ZM6.37328 9.2857H7.3139V14.8119H6.37328V9.2857Z" fill="#6524EB" />
                    <path d="M11.5694 1.40769C11.5694 0.772956 11.0522 0.255801 10.4175 0.255801L6.18469 0.254883C5.54996 0.254883 5.0328 0.772038 5.0328 1.40677V3.00602H0V4.88726H16.6025V3.00602H11.5697L11.5694 1.40769Z" fill="#6524EB" />
                  </svg>

                </div>
                <p className={styles.managementText}>Delete Agent</p>
              </div>
            
<div
  className={styles.managementItem}
  onClick={openCalModal} // open Cal modal on click
  style={{ cursor: "pointer" }}
>
  <div className={styles.SvgDesign}>
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.76866 16.5998C4.22338 16.5998 4.59201 16.2312 4.59201 15.7765C4.59201 15.3218 4.22338 14.9531 3.76866 14.9531C3.31394 14.9531 2.94531 15.3218 2.94531 15.7765C2.94531 16.2312 3.31394 16.5998 3.76866 16.5998Z" fill="#6524EB" />
      <path d="M6.78429 16.5998C7.23901 16.5998 7.60763 16.2312 7.60763 15.7765C7.60763 15.3218 7.23901 14.9531 6.78429 14.9531C6.32956 14.9531 5.96094 15.3218 5.96094 15.7765C5.96094 16.2312 6.32956 16.5998 6.78429 16.5998Z" fill="#6524EB" />
      <path d="M9.75304 16.5998C10.2078 16.5998 10.5764 16.2312 10.5764 15.7765C10.5764 15.3218 10.2078 14.9531 9.75304 14.9531C9.29831 14.9531 8.92969 15.3218 8.92969 15.7765C8.92969 16.2312 9.29831 16.5998 9.75304 16.5998Z" fill="#6524EB" />
      <path d="M13.0499 16.5998C13.5046 16.5998 13.8733 16.2312 13.8733 15.7765C13.8733 15.3218 13.5046 14.9531 13.0499 14.9531C12.5952 14.9531 12.2266 15.3218 12.2266 15.7765C12.2266 16.2312 12.5952 16.5998 13.0499 16.5998Z" fill="#6524EB" />
      <path d="M9.75304 13.8029C10.2078 13.8029 10.5764 13.4343 10.5764 12.9796C10.5764 12.5249 10.2078 12.1562 9.75304 12.1562C9.29831 12.1562 8.92969 12.5249 8.92969 12.9796C8.92969 13.4343 9.29831 13.8029 9.75304 13.8029Z" fill="#6524EB" />
      <path d="M13.9722 4.64641H13.8698C13.8694 3.73676 13.1324 3 12.223 3C11.3137 3 10.5763 3.73676 10.5763 4.64641H6.23979C6.23947 3.73676 5.50238 3 4.59306 3C3.68373 3 2.94632 3.73676 2.94632 4.64641H2.56826C1.14846 4.64641 0 5.79848 0 7.21499V7.21665V17.4916C0 18.9098 1.14874 20.0602 2.56826 20.0602H13.9722C15.3904 20.0602 16.5421 18.9098 16.5421 17.4916V7.21661V7.21495C16.5421 5.79848 15.3903 4.64641 13.9722 4.64641ZM14.8173 17.4445C14.8173 17.8673 14.4735 18.2128 14.0496 18.2128H2.59921C2.17536 18.2128 1.8302 17.8673 1.8302 17.4445V10.8104H14.8173V17.4445Z" fill="#6524EB" />
      <path d="M13.0499 13.8029C13.5046 13.8029 13.8733 13.4343 13.8733 12.9796C13.8733 12.5249 13.5046 12.1562 13.0499 12.1562C12.5952 12.1562 12.2266 12.5249 12.2266 12.9796C12.2266 13.4343 12.5952 13.8029 13.0499 13.8029Z" fill="#6524EB" />
      <circle cx="14.5938" cy="4.5" r="4.5" fill="white" />
      <path d="M19.2197 4.56299C19.2197 7.08306 17.1768 9.12598 14.6567 9.12598C12.1367 9.12598 10.0938 7.08306 10.0938 4.56299C10.0938 2.04292 12.1367 0 14.6567 0C17.1768 0 19.2197 2.04292 19.2197 4.56299ZM16.9555 2.83457C16.7885 2.66751 16.5176 2.66751 16.3506 2.83457C16.3465 2.8386 16.3427 2.84288 16.3392 2.84736L14.3587 5.37106L13.1646 4.17697C12.9975 4.00991 12.7267 4.00991 12.5596 4.17697C12.3925 4.34403 12.3925 4.61489 12.5596 4.78195L14.0691 6.29141C14.2361 6.45847 14.507 6.45847 14.674 6.29141C14.6778 6.28769 14.6813 6.28377 14.6846 6.27966L16.9616 3.43335C17.1226 3.26585 17.1205 2.99958 16.9555 2.83457Z" fill="#1AA850" />
    </svg>
  </div>
  <p className={styles.managementText}>Cal.com</p>
</div>

            </div>

            <h1 className={styles.Agenttitle}>Agent Analysis</h1>
            <div className={styles.agentStats}>
              <div className={` ${styles.stat} ${styles.Yellow}`}>
                <div className={` ${styles.statText} `}>Total Calls</div>
                <div className={styles.statDetail}>
                  {agentData?.callSummary?.totalCalls || "NA"}
                </div>
              </div>

              <div className={` ${styles.stat} ${styles.blue}`}>
                <span className={` ${styles.statText} `}>Avg. Call Duration</span>

                <span className={styles.statDetail}>
                  {agentData?.avgCallTime?.minutes ||
                    agentData?.avgCallTime?.seconds ? (
                    <>
                      {agentData?.avgCallTime?.minutes}
                      <span className={styles.MinFont}>m</span>
                      {agentData?.avgCallTime?.seconds}
                      <span className={styles.MinFont}>s</span>
                    </>
                  ) : (
                    <>NA</>
                  )}
                </span>
              </div>

              <div className={` ${styles.stat}  ${styles.Purple}`}>
                <span className={` ${styles.statText}`}>Bookings</span>
                <span className={styles.statDetail}>
                  {totalBookings !== null ? totalBookings : "0"}
                </span>
              </div>

              <div className={` ${styles.stat} ${styles.Red}`}>
                <span className={` ${styles.statText} `}>Minutes Remaining</span>
                <span className={styles.statDetail}>
                  {Math.floor(agentData?.agent?.mins_left / 60)}
                </span>
              </div>
            </div>

            <section className={styles.management}>
              <AgentAnalysis data={agentData?.callSummary?.data} />
            </section>
          </div>
       
{
  openCallModal && (
    <Modal2 isOpen={openCallModal} onClose={closeCallTestModal}>
      <CallTest
        isCallActive={isCallActive}
        onStartCall={handleStartCall}
        onEndCall={handleEndCall}
        callLoading={callLoading}
        setCallLoading={setCallLoading}
        agentName={agentData?.agent?.agentName}
        agentAvatar={agentData?.agent?.avatar}
        businessName={agentData?.business?.businessName}
      />
    </Modal2>
  )
}

{/* OffCanvas for Logout */ }
{
  openOffcanvas && (
    <OffCanvas
      onClose={handleCloseOffcanvas}
      isOpen={openOffcanvas}
      direction="right"
      width="70%"
    >
      <div className="HeaderTop">
        <div className={styles.logoutdiv} onClick={handleLogout}>
          Logout
        </div>
      </div>
    </OffCanvas>
  )
}
{isCalModalOpen && (
  <div className={styles.modalBackdrop} onClick={closeCalModal}>
    <div
      className={styles.modalContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <h2>Connect with Cal</h2>
      <p>
        Click on the link to connect with Cal:{" "}
        <a
          href="https://cal.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://cal.com/
        </a>
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <label htmlFor="apiKey">Enter your API Key:</label>
        <input
          id="apiKey"
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="API Key"
          className={styles.modalInput}
          disabled={!isApiKeyEditable && !!apiKey}
        />
        {apiKey && !isApiKeyEditable && (
          <button
            type="button"
            onClick={() => setIsApiKeyEditable(true)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
            title="Edit API Key"
            aria-label="Edit API Key"
          >
            {/* edit icon svg */}
          </button>
        )}
      </div>
      {showCalKeyInfo && (
        <div className={styles.infoBanner}>
          Your Cal API key is added. Now create your Cal event.
        </div>
      )}

      {!showEventInputs && (
        <div className={styles.modalButtons}>
          <button className={`${styles.modalButton} ${styles.cancel}`} onClick={closeCalModal}>
            Cancel
          </button>
          <button
            className={`${styles.modalButton} ${styles.submit}`}
            onClick={handleApiKeySubmit}
            disabled={!isValidCalApiKey(apiKey.trim())}
          >
            {apiKey && !isApiKeyEditable ? "Update" : "Submit"}
          </button>
        </div>
      )}

      {showEventInputs && (
        <>
          <div className={styles.createEventSection}>
            <h3>Create Event</h3>
            <div className={styles.inputGroup}>
              <label htmlFor="title">Event Name</label>
              <input
                id="title"
                type="text"
                placeholder="Enter event name"
                className={styles.modalInput}
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="slug">Description</label>
              <input
                id="slug"
                type="text"
                placeholder="Enter Description"
                className={styles.modalInput}
                value={eventSlug}
                onChange={(e) => setEventSlug(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="length">Length (minutes)</label>
              <input
                id="length"
                type="number"
                placeholder="Enter length"
                className={styles.modalInput}
                value={eventLength}
                onChange={(e) => setEventLength(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className={styles.modalButtons} style={{ marginTop: "10px" }}>
            <button className={`${styles.modalButton} ${styles.cancel}`} onClick={() => setShowEventInputs(false)}>
              Cancel
            </button>
            <button
              className={`${styles.modalButton} ${styles.submit}`}
              onClick={createCalEvent}
              disabled={!eventName.trim() || !eventSlug.trim() || !eventLength.trim()}
            >
              Add Event
            </button>
          </div>

          {eventCreateStatus && (
            <p style={{ color: eventCreateStatus === "success" ? "green" : "red", marginTop: "10px", fontWeight: "600" }}>
              {eventCreateMessage}
            </p>
          )}
        </>
      )}
    </div>
  </div>
)}
<DetailModal isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        height="80vh">

        <div>
          <EditAgent />
        </div>
      </DetailModal>

      <AssignNumberModal 
  isOpen={isAssignModalOpen} 
  agentId={agentDetails?.agentId}
  onClose={() => setIsAssignModalOpen(false)} 
/>


      <Footer/>
   </>

  )
}
    </div >
  );
};

export default AgentDashboard;
