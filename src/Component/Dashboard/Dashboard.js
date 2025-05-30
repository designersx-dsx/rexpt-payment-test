import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import Footer from "../AgentDetails/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { fetchDashboardDetails } from "../../Store/apiStore";
import decodeToken from "../../lib/decodeToken";
import { useDashboardStore } from "../../Store/agentZustandStore";
import OffCanvas from "../OffCanvas/OffCanvas";
import { RetellWebClient } from "retell-client-js-sdk";
import useUser from "../../Store/Context/UserContext";
import Modal2 from "../Modal2/Modal2";
import CallTest from "../CallTest/CallTest";

function Dashboard() {
  const { agents, totalCalls, hasFetched, setDashboardData, setHasFetched } =
    useDashboardStore();
  const navigate = useNavigate();

  // User info from context
  const { user } = useUser();

  // Retell Web Client Setup
  const [retellWebClient, setRetellWebClient] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [openCallModal, setOpenCallModal] = useState(false);
  const [agentDetails, setAgentDetails] = useState(null);

  // Cal.com & Event creation state
  const token = localStorage.getItem("token") || "";
  const decodeTokenData = decodeToken(token);
  const userIdFromToken = decodeTokenData?.id || "";
  const [userId, setUserId] = useState(userIdFromToken);

  const [localAgents, setLocalAgents] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openOffcanvas, setOpenOffcanvas] = useState(false);

  // Cal Modal & API key state
  const [isCalModalOpen, setIsCalModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isApiKeyEditable, setIsApiKeyEditable] = useState(false);

  // Event inputs
  const [eventName, setEventName] = useState("");
  const [eventSlug, setEventSlug] = useState("");
  const [eventLength, setEventLength] = useState("");
  const [showEventInputs, setShowEventInputs] = useState(false);
  const [eventCreateStatus, setEventCreateStatus] = useState(null);
  const [eventCreateMessage, setEventCreateMessage] = useState("");

  const planStyles = ["MiniPlan", "ProPlan", "Maxplan"];

  // Handle Agent Card click navigation
  const handleCardClick = (agent) => {
    const agentDetails = {
      agentId: agent.agent_id,
      bussinesId: agent.businessId,
    };
    navigate("/home", { state: agentDetails });
  };

  // Open Cal modal & set agent & apiKey
  const handleCalClick = (agent, e) => {
    e.stopPropagation();
    setSelectedAgent(agent);
    const agentInLocal = localAgents.find((a) => a.agent_id === agent.agent_id);
    setApiKey(agentInLocal?.calApiKey || "");
    setIsApiKeyEditable(false);
    setShowEventInputs(false);
    setEventCreateStatus(null);
    setEventCreateMessage("");
    setEventName("");
    setEventSlug("");
    setEventLength("");
    setIsCalModalOpen(true);
  };

  // Fetch Cal API keys from backend
  const fetchCalApiKeys = async (userId) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/agent/calapikeys/${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Cal API keys");
    }
    const data = await response.json();
    return data.agents;
  };

  // Initial load from localStorage
  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    const savedAgents = localStorage.getItem("agents");

    if (savedUserId) setUserId(savedUserId);
    if (savedAgents) setLocalAgents(JSON.parse(savedAgents));
  }, []);

  // Fetch dashboard data + merge Cal API keys
  useEffect(() => {
    const fetchAndMergeCalApiKeys = async () => {
      if (!userId) return;

      try {
        const res = await fetchDashboardDetails(userId);
        let agentsWithCalKeys = res.agents || [];

        const calApiAgents = await fetchCalApiKeys(userId);
        const calApiKeyMap = {};
        calApiAgents.forEach((agent) => {
          calApiKeyMap[agent.agent_id] = agent.calApiKey || null;
        });

        agentsWithCalKeys = agentsWithCalKeys.map((agent) => ({
          ...agent,
          calApiKey: calApiKeyMap[agent.agent_id] || null,
        }));

        setDashboardData(agentsWithCalKeys, res.total_call || 0);
        setHasFetched(true);

        localStorage.setItem("userId", userId);
        localStorage.setItem("agents", JSON.stringify(agentsWithCalKeys));
        setLocalAgents(agentsWithCalKeys);
      } catch (error) {
        console.error("Error fetching dashboard data or Cal API keys:", error);
      }
    };

    if ((!hasFetched || !localAgents.length) && userId) {
      fetchAndMergeCalApiKeys();
    }
  }, [userId, hasFetched, localAgents.length, setDashboardData, setHasFetched]);

  // Sync localAgents with store agents changes
  useEffect(() => {
    if (agents && agents.length > 0) {
      setLocalAgents(agents);
      localStorage.setItem("agents", JSON.stringify(agents));
    }
  }, [agents]);

  // Submit Cal API key to backend and show event inputs
  const handleApiKeySubmit = async () => {
    if (!selectedAgent) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/agent/update-calapikey/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ calApiKey: apiKey.trim() }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update API key");
      }

      alert(`API Key saved successfully for agent ${selectedAgent.agentName}`);
      const updatedAgents = localAgents.map((agent) =>
        agent.agent_id === selectedAgent.agent_id
          ? { ...agent, calApiKey: apiKey.trim() }
          : agent
      );
      setLocalAgents(updatedAgents);
      localStorage.setItem("agents", JSON.stringify(updatedAgents));
      setShowEventInputs(true);
    } catch (error) {
      alert(`Failed to save API Key: ${error.message}`);
    }
  };

  // Create event using Cal API with API key in query param
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
      const url = `https://api.cal.com/v1/event-types?apiKey=${encodeURIComponent(
        apiKey.trim()
      )}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      setEventCreateStatus("success");
      setEventCreateMessage("Event created successfully!");
      setEventName("");
      setEventSlug("");
      setEventLength("");
    } catch (error) {
      setEventCreateStatus("error");
      setEventCreateMessage(`Error creating event: ${error.message}`);
    }
  };

  const closeModal = () => {
    setIsCalModalOpen(false);
    setApiKey("");
    setSelectedAgent(null);
    setShowEventInputs(false);
    setEventCreateStatus(null);
    setEventCreateMessage("");
  };

  const toggleDropdown = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleDelete = (id) => {
    alert(`Delete clicked for card ${id}`);
    setOpenDropdown(null);
  };

  const handleUpgrade = (id) => {
    alert(`Upgrade clicked for card ${id}`);
    setOpenDropdown(null);
  };

  const handleOpencanvas = () => {
    setOpenOffcanvas(true);
  };
  const handleCloseOffcanvas = () => {
    setOpenOffcanvas(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("agents");
    sessionStorage.clear();
    window.location.href = "/signup";
  };

  // Retell Web Client init
  useEffect(() => {
    const client = new RetellWebClient();
    client.on("call_started", () => setIsCallActive(true));
    client.on("call_ended", () => setIsCallActive(false));
    setRetellWebClient(client);
  }, []);

  // Start Call handler
  const handleStartCall = async () => {
    if (!retellWebClient || !agentDetails) {
      console.error("RetellWebClient or agent details not ready.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/agent/create-web-call`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent_id: agentDetails.agent_id }),
        }
      );
      const data = await res.json();
      await retellWebClient.startCall({ accessToken: data.access_token });
    } catch (err) {
      console.error("Error starting call:", err);
    }
  };

  // End Call handler
  const handleEndCall = async () => {
    if (retellWebClient) {
      const response = await retellWebClient.stopCall();
      console.log("Call end response", response);
    }
  };

  // Open call modal
  const handleOpenCallModal = (agent) => {
    setAgentDetails(agent);
    sessionStorage.setItem("agentDetails", JSON.stringify(agent));
    setOpenCallModal(true);
  };

  // Close call modal
  const handleCloseCallModal = () => {
    setOpenCallModal(false);
  };

  return (
    <div>
      <div className={styles.forSticky}>
        <header className={styles.header}>
          <div className={styles.profileSection}>
            <div>
              <img
                src={user?.profile || "images/AgentImage.png"}
                alt="Profile"
                className={styles.profilePic}
              />
            </div>
            <div>
              <p className={styles.greeting}>Hello!</p>
              <h2 className={styles.name}>{user?.name || "John Vick"}</h2>
            </div>
          </div>
          <div className={styles.notifiMain}>
            <div className={styles.notificationIcon} onClick={handleOpencanvas}>
              {/* SVG Icon placeholder */}
            </div>
          </div>
        </header>

        {/* Summary cards */}
        <section className={styles.agentCard}>
          <div className={styles.agentInfo}>
            <h2>{totalCalls || 0}</h2>
            <img src="svg/total-call.svg" alt="total-call" />
          </div>
          <hr />
          <div className={styles.agentInfo2}>
            <h2>0</h2>
            <img src="svg/calender-booking.svg" alt="calender-booking" />
          </div>
        </section>
      </div>

      <div className={styles.main}>
        {localAgents.map((agent) => {
          const randomPlan =
            planStyles[Math.floor(Math.random() * planStyles.length)];
          return (
            <div
              key={agent.agent_id}
              className={`${styles.LangStyle} ${styles[randomPlan]}`}
              onClick={() => handleCardClick(agent)}
            >
              <div className={styles.PlanPriceMain}>
                <h3 className={styles.PlanPrice}>
                  {agent.plan || "Free Plan"}
                </h3>
              </div>
              <div className={styles.Lang}>
                <div className={styles.LangItem}>
                  <div className={styles.LangIcon}>
                    <img src="images/SofiaAgent.png" alt="English" />
                  </div>
                  <div className={styles.LangText}>
                    <h3 className={styles.agentName}>
                      {agent.agentName}{" "}
                      <span className={styles.activeText}>Active</span>
                    </h3>
                    <p className={styles.agentAccent}>
                      {agent.agentLanguage} •{agent.agentAccent}
                    </p>
                  </div>
                </div>

                <div
                  className={styles.FilterIcon}
                  onClick={(e) => toggleDropdown(e, agent.agent_id)}
                >
                  {/* Dropdown SVG Icon */}
                  {openDropdown === agent.agent_id && (
                    <div className={styles.OptionsDropdown}>
                      <div
                        className={styles.OptionItem}
                        onClick={() => handleDelete(agent.agent_id)}
                      >
                        Delete
                      </div>
                      <div
                        className={styles.OptionItem}
                        onClick={() => handleUpgrade(agent.agent_id)}
                      >
                        Upgrade
                      </div>
                      <div
                        className={styles.OptionItem}
                        onClick={() => handleOpenCallModal(agent)}
                      >
                        Test Call
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <hr className={styles.agentLine} />

              <div className={styles.LangPara}>
                <p className={styles.agentPara}>
                  For: <strong>{agent.business.businessName}</strong>
                </p>
                <div className={styles.VIA}>
                  {agent.calApiKey ? (
                    <img
                      src="svg/cal-svg.svg"
                      alt="cal-svg"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => handleCalClick(agent, e)}
                    />
                  ) : (
                    <img
                      src="svg/call-cross.svg"
                      alt="No API Key"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => handleCalClick(agent, e)}
                      title="Cal API Key not set"
                    />
                  )}
                </div>
              </div>

              <div className={styles.LangButton}>
                <div className={styles.AssignNum}>Assign Number</div>
                <div className={styles.minLeft}>
                  <span className={styles.MinL}>Min Left</span>{" "}
                  {agent?.callSummary?.remaining?.minutes || 0}
                </div>
              </div>
            </div>
          );
        })}

        {/* Cal API Key & Event Modal */}
        {isCalModalOpen && (
          <div className={styles.modalBackdrop} onClick={closeModal}>
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

              {/* API Key Input */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
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
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                    title="Edit API Key"
                    aria-label="Edit API Key"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      width="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* API Key Submit/Cancel Buttons */}
              {!showEventInputs && (
                <div className={styles.modalButtons}>
                  <button
                    className={`${styles.modalButton} ${styles.cancel}`}
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${styles.modalButton} ${styles.submit}`}
                    onClick={handleApiKeySubmit}
                    disabled={!apiKey.trim()}
                  >
                    {apiKey && !isApiKeyEditable ? "Update" : "Submit"}
                  </button>
                </div>
              )}

              {/* Event Inputs - shown only after API key saved */}
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
                      <label htmlFor="slug">Slug</label>
                      <input
                        id="slug"
                        type="text"
                        placeholder="Enter slug"
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

                  <div
                    className={styles.modalButtons}
                    style={{ marginTop: "10px" }}
                  >
                    <button
                      className={`${styles.modalButton} ${styles.cancel}`}
                      onClick={() => setShowEventInputs(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={`${styles.modalButton} ${styles.submit}`}
                      onClick={createCalEvent}
                      disabled={
                        !eventName.trim() ||
                        !eventSlug.trim() ||
                        !eventLength.trim()
                      }
                    >
                      Add Event
                    </button>
                  </div>

                  {/* Event creation status message */}
                  {eventCreateStatus && (
                    <p
                      style={{
                        color: eventCreateStatus === "success" ? "green" : "red",
                        marginTop: "10px",
                        fontWeight: "600",
                      }}
                    >
                      {eventCreateMessage}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Call Test Modal */}
        {openCallModal && (
          <Modal2 isOpen={openCallModal} onClose={handleCloseCallModal}>
            <CallTest
              isCallActive={isCallActive}
              onStartCall={handleStartCall}
              onEndCall={handleEndCall}
            />
          </Modal2>
        )}
      </div>

      <Footer />

      {/* OffCanvas for Logout */}
      {openOffcanvas && (
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
      )}
    </div>
  );
}

export default Dashboard;
