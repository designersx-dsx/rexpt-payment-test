import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import Footer from "../AgentDetails/Footer/Footer";
import { useNavigate } from "react-router-dom";
import {
    EndWebCallUpdateAgentMinutesLeft,
    fetchDashboardDetails,
} from "../../Store/apiStore";
import decodeToken from "../../lib/decodeToken";
import { useDashboardStore } from "../../Store/agentZustandStore";
import OffCanvas from "../OffCanvas/OffCanvas";
import { RetellWebClient } from "retell-client-js-sdk";
import useUser from "../../Store/Context/UserContext";
import Modal2 from "../Modal2/Modal2";
import CallTest from "../CallTest/CallTest";
import WidgetScript from "../Widgets/WidgetScript";
import Popup from "../Popup/Popup";
function Dashboard() {
    const { agents, totalCalls, hasFetched, setDashboardData, setHasFetched } =
        useDashboardStore();
    const navigate = useNavigate();
    const { user } = useUser();

    // Retell Web Client states
    const [retellWebClient, setRetellWebClient] = useState(null);
    const [isCallActive, setIsCallActive] = useState(false);
    const [openCallModal, setOpenCallModal] = useState(false);
    const [agentDetails, setAgentDetails] = useState(null);
    const [openWidgetModal, setOpenWidgetModal] = useState(false);

    // UserId decoded from token
    const token = localStorage.getItem("token") || "";
    const decodeTokenData = decodeToken(token);
    const userIdFromToken = decodeTokenData?.id || "";
    const [userId, setUserId] = useState(userIdFromToken);

    // Agents and UI states
    const [localAgents, setLocalAgents] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [openOffcanvas, setOpenOffcanvas] = useState(false);

    // Cal API modal & event states
    const [isCalModalOpen, setIsCalModalOpen] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isApiKeyEditable, setIsApiKeyEditable] = useState(false);
    const [eventName, setEventName] = useState("");
    const [eventSlug, setEventSlug] = useState("");
    const [eventLength, setEventLength] = useState("");
    const [showEventInputs, setShowEventInputs] = useState(false);
    const [eventCreateStatus, setEventCreateStatus] = useState(null);
    const [eventCreateMessage, setEventCreateMessage] = useState("");
    const planStyles = ["MiniPlan", "ProPlan", "Maxplan"];

    //cal
    const isValidCalApiKey = (key) => key.startsWith("cal_live_");
    const [showCalKeyInfo, setShowCalKeyInfo] = useState(false);
    const [bookingCount, setBookingCount] = useState(0);

    //pop0up
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("success");

    // Navigate on agent card click
    const handleCardClick = (agent) => {
        navigate("/home", {
            state: { agentId: agent.agent_id, bussinesId: agent.businessId },
        });
    };
    useEffect(() => {
        const agents = JSON.parse(localStorage.getItem("agents")) || [];
        const agentWithCalKey = agents.find((agent) => agent.calApiKey);

        if (agentWithCalKey?.calApiKey) {
            const fetchBookings = async () => {
                try {
                    const response = await fetch(
                        `https://api.cal.com/v1/bookings?apiKey=${encodeURIComponent(
                            agentWithCalKey.calApiKey
                        )}`
                    );
                    if (!response.ok) throw new Error("Failed to fetch bookings");

                    const data = await response.json();
                    setBookingCount(data.bookings?.length || 0);
                } catch (error) {
                    console.error("Error fetching booking count:", error);
                    setBookingCount(0);
                }
            };

            fetchBookings();
        }
    }, []);
    // Open Cal modal & set current agent + API key
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
        if (!response.ok) throw new Error("Failed to fetch Cal API keys");
        const data = await response.json();
        return data.agents;
    };

    // Load from localStorage on mount
    useEffect(() => {
        const savedUserId = localStorage.getItem("userId");
        const savedAgents = localStorage.getItem("agents");
        if (savedUserId) setUserId(savedUserId);
        if (savedAgents) setLocalAgents(JSON.parse(savedAgents));
    }, []);

    // Fetch dashboard + merge Cal API keys
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

    // Sync local agents with store
    useEffect(() => {
        if (agents && agents.length > 0) {
            setLocalAgents(agents);
            localStorage.setItem("agents", JSON.stringify(agents));
        }
    }, [agents]);

    // Submit API key for selected agent
    const handleApiKeySubmit = async () => {
        if (!selectedAgent) return;

        if (!isValidCalApiKey(apiKey.trim())) {
            setPopupType("failed");
            setPopupMessage("Invalid API Key! It must start with 'cal_live_'.");
            return;
        }

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

            const updatedAgents = localAgents.map((agent) =>
                agent.agent_id === selectedAgent.agent_id
                    ? { ...agent, calApiKey: apiKey.trim() }
                    : agent
            );

            setLocalAgents(updatedAgents);
            localStorage.setItem("agents", JSON.stringify(updatedAgents));

            setShowEventInputs(true);
            setShowCalKeyInfo(true);
        } catch (error) {
            setPopupType("failed");
            setPopupMessage(`Failed to save API Key: ${error.message}`);
        }
    };

    // Create Cal event
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
            setPopupType("success");
            setPopupMessage("Your Cal event has been created successfully!");
            setShowCalKeyInfo(false);

            setEventName("");
            setEventSlug("");
            setEventLength("");
            setTimeout(() => {
                closeModal();
            }, 1000);
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

    // Retell Web Client initialization
    useEffect(() => {
        const client = new RetellWebClient();
        client.on("call_started", () => setIsCallActive(true));
        client.on("call_ended", () => setIsCallActive(false));
        setRetellWebClient(client);
    }, []);

    // Start call
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

    // End call
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

    // Open Widget modal
    const handleOpenWidgetModal = (agent) => {
        setOpenWidgetModal(true);
        setAgentDetails(agent);
    };

    // Close Widget modal
    const handleCloseWidgetModal = () => {
        setOpenWidgetModal(false);
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
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.448 1.75C16.5495 1.74997 15.8003 1.74995 15.2055 1.82991C14.5777 1.91432 14.0109 2.09999 13.5555 2.55546C13.1 3.01093 12.9143 3.57773 12.8299 4.20552C12.7499 4.8003 12.75 5.54951 12.75 6.44798V6.552C12.75 7.45047 12.7499 8.19971 12.8299 8.79448C12.9143 9.42228 13.1 9.98908 13.5555 10.4445C14.0109 10.9 14.5777 11.0857 15.2055 11.1701C15.8003 11.2501 16.5495 11.25 17.448 11.25H17.552C18.4505 11.25 19.1997 11.2501 19.7945 11.1701C20.4223 11.0857 20.9891 10.9 21.4445 10.4445C21.9 9.98908 22.0857 9.42228 22.1701 8.79448C22.2501 8.1997 22.25 7.45048 22.25 6.552V6.44801C22.25 5.54953 22.2501 4.80031 22.1701 4.20552C22.0857 3.57773 21.9 3.01093 21.4445 2.55546C20.9891 2.09999 20.4223 1.91432 19.7945 1.82991C19.1997 1.74995 18.4505 1.74997 17.552 1.75H17.448ZM14.6161 3.61612C14.7464 3.4858 14.9439 3.37858 15.4054 3.31654C15.8884 3.2516 16.536 3.25 17.5 3.25C18.464 3.25 19.1116 3.2516 19.5946 3.31654C20.0561 3.37858 20.2536 3.4858 20.3839 3.61612C20.5142 3.74644 20.6214 3.94393 20.6835 4.4054C20.7484 4.88843 20.75 5.53599 20.75 6.5C20.75 7.46401 20.7484 8.11157 20.6835 8.59461C20.6214 9.05607 20.5142 9.25357 20.3839 9.38389C20.2536 9.5142 20.0561 9.62143 19.5946 9.68347C19.1116 9.74841 18.464 9.75 17.5 9.75C16.536 9.75 15.8884 9.74841 15.4054 9.68347C14.9439 9.62143 14.7464 9.5142 14.6161 9.38389C14.4858 9.25357 14.3786 9.05607 14.3165 8.59461C14.2516 8.11157 14.25 7.46401 14.25 6.5C14.25 5.53599 14.2516 4.88843 14.3165 4.4054C14.3786 3.94393 14.4858 3.74644 14.6161 3.61612Z" fill="#0A0A0A" fill-opacity="0.9" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.44801 12.75C5.54954 12.75 4.8003 12.7499 4.20552 12.8299C3.57773 12.9143 3.01093 13.1 2.55546 13.5555C2.09999 14.0109 1.91432 14.5777 1.82991 15.2055C1.74995 15.8003 1.74997 16.5495 1.75 17.448V17.552C1.74997 18.4505 1.74995 19.1997 1.82991 19.7945C1.91432 20.4223 2.09999 20.9891 2.55546 21.4445C3.01093 21.9 3.57773 22.0857 4.20552 22.1701C4.80031 22.2501 5.54953 22.25 6.44801 22.25H6.552C7.45048 22.25 8.1997 22.2501 8.79448 22.1701C9.42228 22.0857 9.98908 21.9 10.4445 21.4445C10.9 20.9891 11.0857 20.4223 11.1701 19.7945C11.2501 19.1997 11.25 18.4505 11.25 17.552V17.448C11.25 16.5495 11.2501 15.8003 11.1701 15.2055C11.0857 14.5777 10.9 14.0109 10.4445 13.5555C9.98908 13.1 9.42228 12.9143 8.79448 12.8299C8.19971 12.7499 7.4505 12.75 6.55203 12.75H6.44801ZM3.61612 14.6161C3.74644 14.4858 3.94393 14.3786 4.4054 14.3165C4.88843 14.2516 5.53599 14.25 6.5 14.25C7.46401 14.25 8.11157 14.2516 8.59461 14.3165C9.05607 14.3786 9.25357 14.4858 9.38389 14.6161C9.5142 14.7464 9.62143 14.9439 9.68347 15.4054C9.74841 15.8884 9.75 16.536 9.75 17.5C9.75 18.464 9.74841 19.1116 9.68347 19.5946C9.62143 20.0561 9.5142 20.2536 9.38389 20.3839C9.25357 20.5142 9.05607 20.6214 8.59461 20.6835C8.11157 20.7484 7.46401 20.75 6.5 20.75C5.53599 20.75 4.88843 20.7484 4.4054 20.6835C3.94393 20.6214 3.74644 20.5142 3.61612 20.3839C3.4858 20.2536 3.37858 20.0561 3.31654 19.5946C3.2516 19.1116 3.25 18.464 3.25 17.5C3.25 16.536 3.2516 15.8884 3.31654 15.4054C3.37858 14.9439 3.4858 14.7464 3.61612 14.6161Z" fill="#0A0A0A" fill-opacity="0.9" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.75 6.5C1.75 3.87665 3.87665 1.75 6.5 1.75C9.12336 1.75 11.25 3.87665 11.25 6.5C11.25 9.12336 9.12336 11.25 6.5 11.25C3.87665 11.25 1.75 9.12336 1.75 6.5ZM6.5 3.25C4.70508 3.25 3.25 4.70508 3.25 6.5C3.25 8.29493 4.70508 9.75 6.5 9.75C8.29493 9.75 9.75 8.29493 9.75 6.5C9.75 4.70508 8.29493 3.25 6.5 3.25Z" fill="#0A0A0A" fill-opacity="0.9" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.75 17.5C12.75 14.8767 14.8767 12.75 17.5 12.75C20.1234 12.75 22.25 14.8767 22.25 17.5C22.25 20.1234 20.1234 22.25 17.5 22.25C14.8767 22.25 12.75 20.1234 12.75 17.5ZM17.5 14.25C15.7051 14.25 14.25 15.7051 14.25 17.5C14.25 19.2949 15.7051 20.75 17.5 20.75C19.2949 20.75 20.75 19.2949 20.75 17.5C20.75 15.7051 19.2949 14.25 17.5 14.25Z" fill="#0A0A0A" fill-opacity="0.9" />
              </svg>
                        </div>
                    </div>
                </header>

                <section className={styles.agentCard}>
                    <div className={styles.agentInfo}>
                        <h2>{totalCalls || 0}</h2>
                        <img src="svg/total-call.svg" alt="total-call" />
                    </div>
                    <hr />
                    <div className={styles.agentInfo2}>
                        <h2>{bookingCount}</h2>
                        <img src="svg/calender-booking.svg" alt="calender-booking" />
                    </div>
                </section>
            </div>

            <div className={styles.main}>
                {localAgents.map((agent) => {
                    const randomPlan =
                        planStyles["FreePlan"];
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
                                    <svg
                                        width="18"
                                        height="4"
                                        viewBox="0 0 18 4"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle cx="2" cy="2" r="2" fill="black" />
                                        <circle cx="9" cy="2" r="2" fill="black" />
                                        <circle cx="16" cy="2" r="2" fill="black" />
                                    </svg>
                                    {openDropdown === agent.agent_id && (
                                        <div className={styles.OptionsDropdown}>
                                             <div
                                                className={styles.OptionItem}
                                                onClick={() => ""}
                                            >
                                                Test Agent
                                            </div>
                                             <div
                                                className={styles.OptionItem}
                                                onClick={() => ""}
                                            >
                                                Integrate
                                            </div>
                                             <div
                                                className={styles.OptionItem}
                                                onClick={() => ""}
                                            >
                                                Call Settings
                                            </div>
                                             <div
                                                className={styles.OptionItem}
                                                onClick={() => ""}
                                            >
                                                Edit Agent
                                            </div>
                                            <div
                                                className={styles.OptionItem}
                                                onClick={() => handleUpgrade(agent.agent_id)}
                                            >
                                                Upgrade
                                            </div>
                                            <div
                                                className={styles.OptionItem}
                                                onClick={() => handleDelete(agent.agent_id)}
                                            >
                                                Delete Agent
                                            </div>
                                            
                                            <div
                                                className={styles.OptionItem}
                                                onClick={() => handleOpenCallModal(agent)}
                                            >
                                                Test Call
                                            </div>
                                            <div
                                                className={styles.OptionItem}
                                                onClick={() => handleOpenWidgetModal(agent)}
                                            >
                                                Widget
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

                {/* Cal API Modal */}
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
                            {showCalKeyInfo && (
                                <div className={styles.infoBanner}>
                                    Your Cal API key is added. Now create your Cal event.
                                </div>
                            )}

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

                                    {eventCreateStatus && (
                                        <p
                                            style={{
                                                color:
                                                    eventCreateStatus === "success" ? "green" : "red",
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
                {/* WidgetModal */}
                {openWidgetModal && (
                    <Modal2 isOpen={openWidgetModal} onClose={handleCloseWidgetModal}>
                        <WidgetScript isAgentDetails={agentDetails} onClose={handleCloseWidgetModal} />
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
            {popupMessage && (
                <Popup
                    type={popupType}
                    message={popupMessage}
                    onClose={() => setPopupMessage("")}
                />
            )}
                <Footer />
        </div>
    );
}

export default Dashboard;