import React, { useEffect, useRef, useState } from "react";
import styles from "./Dashboard.module.css";
import Footer from "../AgentDetails/Footer/Footer";
import Plan from "../Plan/Plan";
import { useNavigate, useLocation, Await } from "react-router-dom";
import dayjs from 'dayjs';


import {
  deleteAgent,
  EndWebCallUpdateAgentMinutesLeft,
  fetchDashboardDetails,
  getBusinessDetailsByBusinessId,
  getUserAgentMergedDataForAgentUpdate,
  toggleAgentActivation,
  updateAgentKnowledgeBaseId,
  getUserReferralCodeForDashboard,
  updateShowReferralFloatingStatus,
  updateAgentEventId,
  refundAndCancelSubscriptionAgnetApi,
} from "../../Store/apiStore";
import decodeToken from "../../lib/decodeToken";
import { useDashboardStore } from "../../Store/agentZustandStore";
import { RetellWebClient } from "retell-client-js-sdk";
import useUser from "../../Store/Context/UserContext";
import Modal2 from "../Modal2/Modal2";
import CallTest from "../CallTest/CallTest";
import WidgetScript from "../Widgets/WidgetScript";
import Popup from "../Popup/Popup";
import UploadProfile from "../Popup/profilePictureUpdater/UploadProfile";
import AssignNumberModal from "../AgentDetails/AssignNumberModal";
import CommingSoon from "../ComingSoon/CommingSoon";
import Footer2 from "../AgentDetails/Footer/Footer2";
import Modal from "../Modal2/Modal2";
import Loader from "../Loader/Loader";
import getKnowledgeBaseName from "../../utils/getKnowledgeBaseName";
import Refferal from "../Refferal/Refferal";
import Modal3 from "../Modal3/Modal3";

import AnimatedButton from "../AnimatedButton/AnimatedButton";

import axios from "axios";


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
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const packageName = sessionStorage.getItem("package") || "Free";
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

  const [callId, setCallId] = useState(null);
  //pop0up
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [popupMessage2, setPopupMessage2] = useState("");
  const [popupType2, setPopupType2] = useState("success");
  const [popupMessage3, setPopupMessage3] = useState();
  const [popupType3, setPopupType3] = useState("confirm");
  const [callLoading, setCallLoading] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState();

  //cam-icon
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const isSmallFont =
    totalCalls?.toString().length > 1 || bookingCount?.toString().length > 1;
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAgentForAssign, setSelectedAgentForAssign] = useState(null);

  const [isAssignNumberModalOpen, setIsAssignNumberModalOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [close, setClose] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [agentToDeactivate, setAgentToDeactivate] = useState(null);

  const [agentId, setagentId] = useState();
  const [subscriptionId, setsubscriptionId] = useState();
  const openAssignNumberModal = () => setIsAssignNumberModalOpen(true);
  const closeAssignNumberModal = () => setIsAssignNumberModalOpen(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const [calloading, setcalloading] = useState(false);
  const [calapiloading, setCalapiloading] = useState(false);
  const [deleteloading, setdeleteloading] = useState(false);
  const [isApiKeySubmitted, setIsApiKeySubmitted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [agentToCancel, setAgentToCancel] = useState(null)
  const [showDashboardReferral, setShowDashboardReferral] = useState("");
  const [showreferralfloating, setShowreferralfloating] = useState(
    localStorage.getItem("showreferralfloating") || "true"
  );
  const [copied, setCopied] = useState(false);
  const [userCalApiKey, setUserCalApiKey] = useState(sessionStorage.getItem("userCalApiKey"))
  const [agentDetailsForCal, setAgentDetailsForCal] = useState([])
  const [isConfirming, setIsConfirming] = useState(false);
  const isConfirmedRef = useRef(false);
  //getTimeZone
  const timeZone = Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone;
  // console.log(isConfirming)
  useEffect(() => {
    window.history.pushState(null, document.title, window.location.pathname);

    const handlePopState = () => {
      navigate("/dashboard");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);
  const handleAssignNumberClick = (agent, e) => {
    e.stopPropagation();
    if (agent?.isDeactivated === 1) {
      handleInactiveAgentAlert();
      return;
    }

    const planName = agent?.subscription?.plan_name || "Free";
    if (planName.toLowerCase() === "free") {
      openAssignNumberModal();
    } else {
      setSelectedAgentForAssign(agent);
      setIsAssignModalOpen(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("UpdationMode") == "ON") {
      localStorage.removeItem("UpdationMode");
      localStorage.removeItem("displayBusinessName");
      localStorage.removeItem("agentName");
      localStorage.removeItem("agentGender");
      localStorage.removeItem("agentLanguageCode");
      localStorage.removeItem("agentLanguage");
      localStorage.removeItem("llmId");
      localStorage.removeItem("agent_id");
      localStorage.removeItem("knowledgeBaseId");
      localStorage.removeItem("agentRole");
      localStorage.removeItem("agentVoice");
      localStorage.removeItem("agentVoiceAccent");
      localStorage.removeItem("avatar");
      localStorage.removeItem("googleUrl");
      localStorage.removeItem("knowledge_base_id");
      localStorage.removeItem("knowledge_base_name");
      localStorage.removeItem("selectedAgentAvatar");
      localStorage.removeItem("webUrl");
      localStorage.removeItem("googleUrl");
      localStorage.removeItem("webUrl");
      localStorage.removeItem("aboutBusiness");
      localStorage.removeItem("additionalInstruction");
      localStorage.removeItem("knowledge_base_name");
      localStorage.removeItem("knowledge_base_id");
      localStorage.removeItem("bId");
      sessionStorage.removeItem("UpdationMode");
      sessionStorage.removeItem("agentName");
      sessionStorage.removeItem("agentGender");
      sessionStorage.removeItem("agentLanguageCode");
      sessionStorage.removeItem("agentLanguage");
      sessionStorage.removeItem("llmId");
      sessionStorage.removeItem("agent_id");
      sessionStorage.removeItem("knowledgeBaseId");
      sessionStorage.removeItem("googleListing");
      sessionStorage.removeItem("displayBusinessName");
      sessionStorage.removeItem("aboutBusinessForm");
      sessionStorage.removeItem("agentRole");
      sessionStorage.removeItem("agentVoice");
      sessionStorage.removeItem("agentVoiceAccent");
      sessionStorage.removeItem("avatar");
      sessionStorage.removeItem("businessDetails");
      sessionStorage.removeItem("businessId");
      sessionStorage.removeItem("businesServices");
      sessionStorage.removeItem("businessLocation");
      sessionStorage.removeItem("selectedCustomServices");
      sessionStorage.removeItem("bId");
      localStorage.removeItem("UpdationMode");
      localStorage.removeItem("UpdationModeStepWise");
      localStorage.removeItem("agentName");
      localStorage.removeItem("agentGender");
      localStorage.removeItem("agentLanguageCode");
      localStorage.removeItem("agentLanguage");
      localStorage.removeItem("llmId");
      localStorage.removeItem("agent_id");
      localStorage.removeItem("knowledgeBaseId");
      localStorage.removeItem("agentRole");
      localStorage.removeItem("agentVoice");
      localStorage.removeItem("agentVoiceAccent");
      localStorage.removeItem("avatar");
      localStorage.removeItem("googleUrl");
      localStorage.removeItem("webUrl");
      localStorage.removeItem("aboutBusiness");
      localStorage.removeItem("additionalInstruction");
      localStorage.removeItem("knowledge_base_name");
      localStorage.removeItem("knowledge_base_id");
      sessionStorage.removeItem("selectedfilterOption");
      sessionStorage.removeItem("placeDetailsExtract");
      sessionStorage.removeItem("agentNote");
      sessionStorage.removeItem("prevBuisnessType");
      sessionStorage.removeItem("prevAgentGender");
      sessionStorage.removeItem("prevAgentGender");
      sessionStorage.removeItem("UpdationModeStepWise");
      sessionStorage.removeItem("customServices");
      sessionStorage.removeItem("agentCode");
      sessionStorage.removeItem("businessUrl");
      sessionStorage.removeItem("selectedServices");

    }
  }, []);
  // Navigate on agent card click
  const handleCardClick = (agent) => {
    setHasFetched(false);
    localStorage.setItem("selectedAgentAvatar", agent?.avatar);

    sessionStorage.setItem('SelectAgentId', agent?.agent_id)
    sessionStorage.setItem('SelectAgentBusinessId', agent?.businessId)

    navigate("/agent-detail", {
      state: { agentId: agent?.agent_id, bussinesId: agent?.businessId },
    });
  };
  useEffect(() => {
    const agentWithCalKey = localAgents?.find((agent) => agent.calApiKey);
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
  }, [localAgents]);
  // Open Cal modal & set current agent + API key
  const handleCalClick = (agent, e) => {
    e.stopPropagation();
    setSelectedAgent(agent);
    const agentInLocal = localAgents?.find(
      (a) => a.agent_id === agent.agent_id
    );
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
  // Fetch dashboard + merge Cal API keys
  const fetchAndMergeCalApiKeys = async () => {
    if (!userId) return;
    try {
      const res = await fetchDashboardDetails(userId);
      // console.log(res, "res")
      setUserCalApiKey(res?.calApiKey)
      sessionStorage.setItem("userCalApiKey", res?.calApiKey)

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
      // localStorage.setItem("userId", userId);
      // localStorage.setItem("agents", JSON.stringify(agentsWithCalKeys));
      setLocalAgents(agentsWithCalKeys);
    } catch (error) {
      console.error("Error fetching dashboard data or Cal API keys:", error);
    }
  };
  useEffect(() => {
    if (!hasFetched || !agents.length) {
      fetchAndMergeCalApiKeys();
    }
  }, [userId, hasFetched, setDashboardData, setHasFetched]);
  // Sync local agents with store
  useEffect(() => {
    if (agents && agents.length > 0) {
      setLocalAgents(agents);
      // localStorage.setItem("agents", JSON.stringify(agents));
    }
  }, [agents]);

  // Submit API key for selected agent
  const handleApiKeySubmit = async () => {
    const agent = agentDetailsForCal
    try {
      setCalapiloading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/agent/update-calapikey/${agent?.agent_id
        }`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ calApiKey: userCalApiKey.trim(), userId: userId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update API key");
      }
      setHasFetched(false);
      setShowCalKeyInfo(true);
      setShowEventInputs(true);
      setTimeout(() => {
        setIsApiKeySubmitted(true);
      }, 0);
    } catch (error) {
      setPopupType("failed");
      setPopupMessage(`Failed to save API Key: ${error.message}`);
    } finally {
      setCalapiloading(false);
    }
  };

  // Create Cal event
  const createCalEvent = async () => {
    const agent = agentDetailsForCal
    await handleApiKeySubmit()
    try {
      setcalloading(true);
      // Call Cal API to create an event
      const url = `https://api.cal.com/v1/event-types?apiKey=${encodeURIComponent(
        userCalApiKey.trim()
      )}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `MEETING BY ${agent?.agentName}`,
          slug: `${agent?.agentName}_${agent?.agentCode}`,
          length: 15,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      const responseData = await response.json();
      const eventTypeId = responseData.event_type.id;
      if (!eventTypeId) {
        throw new Error("Event ID not received from Cal.com");
      }
      try {
        await updateAgentEventId(agent.agent_id, eventTypeId);
        console.log(" Event ID saved to agent.");
      } catch (err) {
        console.error("Failed to update agent with event ID:", err);
      }
      const retellPayload = {
        general_tools: [
          {
            type: "book_appointment_cal",
            name: "cal_tool",
            cal_api_key: userCalApiKey.trim(),
            event_type_id: eventTypeId,
          },
          {
            type: "check_availability_cal",
            name: "check_availability",
            cal_api_key: userCalApiKey.trim(),
            event_type_id: eventTypeId,
            description: "Checking availability for event booking",
            timezone: timeZone

          }
        ],
      };

      // Update LLM using the Retell API
      const retellUrl = `https://api.retellai.com/update-retell-llm/${agent.llmId}`;
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
        console.error("Error updating  LLM:", retellError);
      } else {
        // console.log("Updated successfully!");
      }

      // Success
      setPopupType("success");
      setPopupMessage("Your Cal event has been created successfully!");
      setHasFetched(false)
      setShowCalKeyInfo(false);
      setEventName("");
      setEventSlug("");
      setEventLength("");

      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      setEventCreateStatus("error");

      setEventCreateMessage(`Unauthorized! Invalid API Key.`);
      console.error("Error in createCalEvent:", error);
    } finally {
      setcalloading(false);
      setIsConfirming(false)
    }
  };
  const closeModal = () => {
    setIsCalModalOpen(false);
    setApiKey("");
    setSelectedAgent(null);
    setShowEventInputs(false);
    setEventCreateStatus(null);
    setEventCreateMessage("");
    setIsApiKeySubmitted(false);
  };

  const toggleDropdown = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleUpgrade = (id) => {
    setShow(true);
  };
  const handleCLose = () => {
    setClose(true);
    setShow(false);
  };

  const handleLogout = () => {
    setPopupType("confirm");
    setPopupMessage("Are you sure you want to logout?");
  };
  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("agents");
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/signup");
    // window.location.href = "/signup";
  };
  // Retell Web Client initializationcxcxc
  useEffect(() => {
    const client = new RetellWebClient();
    client.on("call_started", () => setIsCallActive(true));
    client.on("call_ended", () => setIsCallActive(false));
    client.on("update", (update) => {
      //  Mark the update clearly as AGENT message
      const customUpdate = {
        ...update,
        source: "agent", // Add explicit source
      };

      // Dispatch custom event for CallTest
      window.dispatchEvent(
        new CustomEvent("retellUpdate", { detail: customUpdate })
      );
    });

    setRetellWebClient(client);
  }, []);
  const handleDelete = async (agent) => {
    console.log("agentId", agent)
    const agent_id = agent?.agent_id
    const mins_left = agent?.mins_left ? Math.floor(agent.mins_left / 60) : 0;
    try {
      setdeleteloading(true);
      const storedDashboard = JSON.parse(
        sessionStorage.getItem("dashboard-session-storage")
      );

      const agents = storedDashboard?.state?.agents || [];

      if (agents.length === 1) {
        setPopupType("failed");
        setPopupMessage(
          "Cannot delete. You must have at least two agents to delete one agent."
        );
        setShowDeleteConfirm(false);
        return;
      }

      // Try to refund API
      try {
        await refundAndCancelSubscriptionAgnetApi(agent_id, mins_left); // Replace with your actual API
      } catch (notifyError) {
        throw new Error(`Refund failed: ${notifyError.message}`);
      }
      // Try to delete the agent
      try {
        await deleteAgent(agent_id);
      } catch (deleteError) {
        throw new Error(`Delete failed: ${deleteError.message}`);
      }


      const updatedAgents = localAgents.filter(
        (agent) => agent.agent_id !== agentId
      );
      setLocalAgents(updatedAgents);
      setPopupMessage("Agent deleted successfully!");
      setPopupType("success");
      setHasFetched(false);
    } catch (error) {
      setPopupMessage(`Failed to delete agent: ${error.message}`);
      setPopupType("failed");
    } finally {
      setdeleteloading(false);
    }
  };

  const handleCancelSubscription = async (agent) => {
    console.log("agent", agent)
    const agent_id = agent?.agent_id;
    const mins_left = agent?.mins_left ? Math.floor(agent.mins_left / 60) : 0;

    try {
      setdeleteloading(true);


      try {
        await refundAndCancelSubscriptionAgnetApi(agent_id, mins_left);
      } catch (notifyError) {
        throw new Error(`Refund failed: ${notifyError.message}`);
      }


      const updatedAgents = localAgents.filter(
        (a) => a.agent_id !== agent_id
      );
      setLocalAgents(updatedAgents);
      setPopupMessage("Subscription Cancelled successfully!");
      setPopupType("success");
      setHasFetched(false);
    } catch (error) {
      setPopupMessage(`Failed to Cancel Subscription: ${error.message}`);
      setPopupType("failed");
    } finally {
      setdeleteloading(false);
    }
  };

  // Start call
  let micStream = "";
  const isStartingRef = useRef(false);
  const handleStartCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Store the stream globally or in state if needed
      micStream = stream;
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      // alert("Please allow microphone access to proceed with the call.");
      setPopupMessage("Microphone access is required to test.");
      setPopupType("failed");
      return;
    }

    if (isStartingRef.current || isCallInProgress || !retellWebClient || !agentDetails) {
      console.error("RetellWebClient or agent details not ready.");
      return;
    }
    isStartingRef.current = true;
    setCallLoading(false);
    setIsCallInProgress(true);

    try {
      setCallLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/agent/create-web-call`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent_id: agentDetails.agent_id }),
        }
      );
      if (res.status == 403) {
        setPopupMessage("Agent Plan minutes exhausted");
        setPopupType("failed");
        setIsCallInProgress(false);
        setTimeout(() => {
          setPopupMessage("");
        }, 5000);
        return;
      }
      const data = await res.json();
      await retellWebClient.startCall({ accessToken: data.access_token });
      setCallId(data?.call_id);
    } catch (err) {
      console.error("Error starting call:", err);
    } finally {
      setCallLoading(false);
      isStartingRef.current = false;
    }
  };
  // End call
  const isEndingRef = useRef(false);
  const handleEndCall = async () => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;

    if (retellWebClient) {
      try {
        const response = await retellWebClient.stopCall();
        const payload = { agentId: agentDetails.agent_id, callId: callId };
        if (isCallInProgress && callId) {
          const DBresponse = await EndWebCallUpdateAgentMinutesLeft(payload);
          setIsCallInProgress(false);
        }
      } catch (err) {
        console.error("Error ending call:", err);
      } finally {
        setHasFetched(false);
        setIsCallInProgress(false);
        isEndingRef.current = false;
      }
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
    handleEndCall();
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

  // Open upload modal
  const openUploadModal = () => {
    setIsUploadModalOpen(true);
    setIsDropdownOpen(false);
  };

  // Close upload modal
  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleUpload = (image) => {
    setUploadedImage(image);
    closeUploadModal();
  };

  const handleEditAgent = async (ag) => {
    // localStorage.setItem("UpdationMode", "ON");
    // await fetchPrevAgentDEtails(ag.agent_id, ag.businessId);

    // navigate("/business-details", {
    //   state: { agentId: ag.agent_id, bussinesId: ag.businessId },
    // });
    sessionStorage.setItem('naviateFrom', 'dashboard')
    sessionStorage.setItem('SelectAgentBusinessId', ag?.businessId)
    sessionStorage.setItem('SelectAgentId', ag?.agent_id)
    navigate('/edit-agent', {
      state: {
        agentId: ag?.agent_id,
        businessId: ag?.businessId,
      },
    });

  };

  const handleRefresh = () => {
    setHasFetched(false);
    fetchAndMergeCalApiKeys();
  };

  const handleAlertPopUp = (show, message, type) => {
    setPopupMessage(message);
    setPopupType(type);
  };
  const handleCalender = () => {
    navigate("/calendar");
  };
  const handleTotalCallClick = () => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("totalCallView", true);
    localStorage.setItem("filterType", "all");
    sessionStorage.removeItem("agentId");
    navigate("/totalcall-list");
  };

  function formatName(name) {
    if (!name) return "";

    if (name.includes(" ")) {
      const firstName = name.split(" ")[0];
      if (firstName.length <= 7) {
        return firstName;
      } else {
        return firstName.substring(0, 10) + "...";
      }
    } else {
      if (name.length > 7) {
        return name.substring(0, 10) + "...";
      } else {
        return name;
      }
    }
  }

  function formatBusinessName(name) {
    if (!name) return "";

    if (name.length > 15) {
      return name.substring(0, 15) + "...";
    }

    return name;
  }
  function formatAgentName(name) {
    if (!name) return "";

    if (name.length > 15) {
      return name.substring(0, 10) + "...";
    }

    return name;
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/signup");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInactiveAgentAlert = () => {
    setPopupType("failed");
    setPopupMessage(
      "Your agent is not active. Please activate your agent first."
    );
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };
  //   const handleDeactivateAgent = async () => {
  //     try {
  //       setDeactivateLoading(true);
  //       const dashboardState = JSON.parse(
  //         sessionStorage.getItem("dashboard-session-storage")
  //       );

  //       const agentData = dashboardState?.state?.agents?.find(
  //         (ag) => ag.agent_id === agentToDeactivate.agent_id
  //       );
  //       console.log("agentToDeactivate", agentToDeactivate)

  //       const knowledgeBaseId = agentData?.knowledgeBaseId;
  //       const businessId = agentData?.businessId;

  //       const isCurrentlyDeactivated = agentToDeactivate.isDeactivated === 1;
  //       if (!isCurrentlyDeactivated && knowledgeBaseId) {

  //         // try{
  //         //      await fetch(
  //         //   `https://api.retellai.com/delete-knowledge-base/${knowledgeBaseId}`,
  //         //   {
  //         //     method: "DELETE",
  //         //     headers: {
  //         //       Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
  //         //       "Content-Type": "application/json",
  //         //     },
  //         //   }
  //         // );
  //         // }catch(error){
  //         //   console.log(error,"Error while deleting delete-knowledge-base")
  //         // }


  // try {
  //   console.log("Checking if knowledge base exists:", knowledgeBaseId);

  //   const checkRes = await axios.get(
  //     `https://api.retellai.com/get-knowledge-base/${knowledgeBaseId}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
  //       },
  //     }
  //   );

  //   // If found, try deleting
  //   try {
  //     const deleteRes = await axios.delete(
  //       `https://api.retellai.com/delete-knowledge-base/${knowledgeBaseId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
  //         },
  //       }
  //     );
  //     console.log("Knowledge base deleted:", deleteRes.data);
  //   } catch (deleteErr) {
  //     console.error("Error during delete:", deleteErr.response?.data || deleteErr.message);
  //   }
  // } catch (checkErr) {
  //   if (checkErr.response?.status === 404) {
  //     console.warn(`Knowledge base ${knowledgeBaseId} not found. Skipping delete.`);
  //     // ✅ Do not throw, continue to next part
  //   } else {
  //     console.error("Error checking knowledge base:", checkErr.response?.data || checkErr.message);
  //   }
  // }

  // // ✅ Control will continue here, e.g. pause subscription
  // console.log("Continuing with subscription pause or next steps...");




  //         // try {
  //         //   const pauseRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/subscription-pause`, {
  //         //     method: "POST",
  //         //     headers: {
  //         //       "Content-Type": "application/json",
  //         //     },
  //         //     body: JSON.stringify({
  //         //       subscriptionId: agentToDeactivate.subscriptionId,
  //         //     }),
  //         //   });

  //         //   if (!pauseRes.ok) {
  //         //     const pauseErr = await pauseRes.json();
  //         //     console.error("Subscription pause failed:", pauseErr);
  //         //     throw new Error("Failed to pause subscription");
  //         //   }
  //         // } catch (pauseError) {
  //         //   console.error("Error pausing subscription:", pauseError);
  //         // }
  //       }
  //       if (isCurrentlyDeactivated && businessId) {
  //         const businessDetails = await getBusinessDetailsByBusinessId(
  //           businessId
  //         );
  //         const packageMap = {
  //           Free: 1,
  //           Starter: 2,
  //           Scaler: 3,
  //           Growth: 4,
  //           Corporate: 5,
  //           Enterprise: 6,
  //         };
  //         const packageValue = packageMap[packageName] || 1;

  //         // const knowledgeBaseName = `${shortName}_kb_${Date.now()}`;
  //         const knowledgeBaseName = await getKnowledgeBaseName(
  //           businessDetails,
  //           userId,
  //           packageValue
  //         );
  //         const mergedUrls = [businessDetails?.webUrl?.trim()].filter(Boolean);
  //         // const businessData = JSON.parse(businessDetails.knowledge_base_texts);
  //         const businessData = businessDetails.knowledge_base_texts;
  //         const knowledgeBaseText = {
  //           title: businessDetails?.businessType || "Business Info",
  //           text: `
  //                 Business Name: ${businessData?.name}
  //                 Address: ${businessData?.address}
  //                 Phone: ${businessData?.phone}
  //                 Website: ${businessData?.website}
  //                 Rating: ${businessData?.rating} (${businessData?.totalRatings} reviews)
  //                 Business Status: ${businessData?.businessStatus}
  //                 Categories: ${businessData?.categories}
  //                 Opening Hours: ${businessData?.hours}
  //                 `.trim(),
  //         };

  //         // Step 1: Create Knowledge Base
  //         const formData = new FormData();
  //         formData.append("knowledge_base_name", knowledgeBaseName);
  //         formData.append("knowledge_base_urls", JSON.stringify(mergedUrls));
  //         formData.append("enable_auto_refresh", "true");
  //         formData.append(
  //           "knowledge_base_texts",
  //           JSON.stringify([knowledgeBaseText])
  //         );

  //         const createRes = await fetch(
  //           `https://api.retellai.com/create-knowledge-base`,
  //           {
  //             method: "POST",
  //             headers: {
  //               Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
  //             },
  //             body: formData,
  //           }
  //         );

  //         if (!createRes.ok) {
  //           const errData = await createRes.json();
  //           console.error("Knowledge base creation failed:", errData);
  //           throw new Error("Failed to create knowledge base during activation");
  //         }

  //         const createdKB = await createRes.json();
  //         const knowledgeBaseId = createdKB.knowledge_base_id;
  //         sessionStorage.setItem("knowledgeBaseId", knowledgeBaseId);

  //         // Step 2: Update LLM for the agent
  //         const llmId =
  //           agentToDeactivate?.llmId ||
  //           localStorage.getItem("llmId") ||
  //           sessionStorage.getItem("llmId");

  //         if (llmId && knowledgeBaseId) {
  //           const llmPayload = {
  //             knowledge_base_ids: [knowledgeBaseId],
  //           };

  //           try {
  //             const updateLLMRes = await fetch(
  //               `https://api.retellai.com/update-retell-llm/${llmId}`,
  //               {
  //                 method: "PATCH",
  //                 headers: {
  //                   "Content-Type": "application/json",
  //                   Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
  //                 },
  //                 body: JSON.stringify(llmPayload),
  //               }
  //             );

  //             if (!updateLLMRes.ok) {
  //               const err = await updateLLMRes.json();
  //               console.error("Failed to update LLM:", err);
  //               throw new Error("LLM update failed");
  //             }
  //           } catch (error) {
  //             console.error("Error updating LLM:", error);
  //           }
  //           // Resume subscription
  //           try {
  //             const resumeRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/subscription-resume`, {
  //               method: "POST",
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify({
  //                 subscriptionId: agentToDeactivate.subscriptionId,
  //               }),
  //             });

  //             if (!resumeRes.ok) {
  //               const resumeErr = await resumeRes.json();
  //               console.error("Subscription resume failed:", resumeErr);
  //               throw new Error("Failed to resume subscription");
  //             } else {
  //               console.log("Subscription resumed successfully");
  //             }
  //           } catch (resumeError) {
  //             console.error("Error resuming subscription:", resumeError);
  //           }
  //         } else {
  //           console.warn(
  //             "LLM ID or Knowledge Base ID missing. LLM update skipped."
  //           );
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error during agent deactivation/reactivation:", error);
  //     } finally {
  //       setDeactivateLoading(false);
  //     }
  //   };


  const handleDeactivateAgent = async () => {
    try {
      setDeactivateLoading(true);
      const dashboardState = JSON.parse(
        sessionStorage.getItem("dashboard-session-storage")
      );

      const agentData = dashboardState?.state?.agents?.find(
        (ag) => ag.agent_id === agentToDeactivate.agent_id
      );

      const knowledgeBaseId = agentData?.knowledgeBaseId;
      const businessId = agentData?.businessId;

      const isCurrentlyDeactivated = agentToDeactivate.isDeactivated === 1;
      if (!isCurrentlyDeactivated && knowledgeBaseId) {
        await fetch(
          `https://api.retellai.com/delete-knowledge-base/${knowledgeBaseId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
              "Content-Type": "application/json",
            },
          }
        );
        try {
          const pauseRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/subscription-pause`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subscriptionId: agentToDeactivate.subscriptionId,
            }),
          });

          if (!pauseRes.ok) {
            const pauseErr = await pauseRes.json();
            console.error("Subscription pause failed:", pauseErr);
            throw new Error("Failed to pause subscription");
          }
        } catch (pauseError) {
          console.error("Error pausing subscription:", pauseError);
        }
      }
      if (isCurrentlyDeactivated && businessId) {
        const businessDetails = await getBusinessDetailsByBusinessId(
          businessId
        );

        // const shortName = (businessDetails?.businessName || "Business")
        //   .trim()
        //   .toLowerCase()
        //   .replace(/\s+/g, "_")
        //   .slice(0, 20);
        const packageMap = {
          Free: 1,
          Starter: 2,
          Scaler: 3,
          Growth: 4,
          Corporate: 5,
          Enterprise: 6,
        };
        const packageValue = packageMap[packageName] || 1;

        // const knowledgeBaseName = `${shortName}_kb_${Date.now()}`;
        const knowledgeBaseName = await getKnowledgeBaseName(businessDetails, userId, packageValue);
        const mergedUrls = [businessDetails?.webUrl?.trim()].filter(Boolean);
        // const businessData = JSON.parse(businessDetails.knowledge_base_texts);
        const businessData = businessDetails.knowledge_base_texts;
        const knowledgeBaseText = {
          title: businessDetails?.businessType || "Business Info",
          text: `
                Business Name: ${businessData?.name}
                Address: ${businessData?.address}
                Phone: ${businessData?.phone}
                Website: ${businessData?.website}
                Rating: ${businessData?.rating} (${businessData?.totalRatings} reviews)
                Business Status: ${businessData?.businessStatus}
                Categories: ${businessData?.categories}
                Opening Hours: ${businessData?.hours}
                `.trim(),
        };

        // Step 1: Create Knowledge Base
        const formData = new FormData();
        formData.append("knowledge_base_name", knowledgeBaseName?.slice(0, 39));
        formData.append("knowledge_base_urls", JSON.stringify(mergedUrls));
        formData.append("enable_auto_refresh", "true");
        formData.append(
          "knowledge_base_texts",
          JSON.stringify([knowledgeBaseText])
        );

        const createRes = await fetch(
          `https://api.retellai.com/create-knowledge-base`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
            },
            body: formData,
          }
        );

        if (!createRes.ok) {
          const errData = await createRes.json();
          console.error("Knowledge base creation failed:", errData);
          throw new Error("Failed to create knowledge base during activation");
        }

        const createdKB = await createRes.json();
        const knowledgeBaseId = createdKB.knowledge_base_id;
        sessionStorage.setItem("knowledgeBaseId", knowledgeBaseId);

        // Step 2: Update LLM for the agent
        const llmId =
          agentToDeactivate?.llmId ||
          localStorage.getItem("llmId") ||
          sessionStorage.getItem("llmId");

        if (llmId && knowledgeBaseId) {
          const llmPayload = {
            knowledge_base_ids: [knowledgeBaseId],
          };

          try {
            const updateLLMRes = await fetch(
              `https://api.retellai.com/update-retell-llm/${llmId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                },
                body: JSON.stringify(llmPayload),
              }
            );

            if (!updateLLMRes.ok) {
              const err = await updateLLMRes.json();
              console.error("Failed to update LLM:", err);
              throw new Error("LLM update failed");
            }
          } catch (error) {
            console.error("Error updating LLM:", error);
          }
          // Resume subscription
          try {
            const resumeRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/subscription-resume`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                subscriptionId: agentToDeactivate.subscriptionId,
              }),
            });

            if (!resumeRes.ok) {
              const resumeErr = await resumeRes.json();
              console.error("Subscription resume failed:", resumeErr);
              throw new Error("Failed to resume subscription");
            } else {
              console.log("Subscription resumed successfully");
            }
          } catch (resumeError) {
            console.error("Error resuming subscription:", resumeError);
          }
        } else {
          console.warn(
            "LLM ID or Knowledge Base ID missing. LLM update skipped."
          );
        }

        // ✅ Step 3: Update Agent's knowledgeBaseId in DB
        if (agentToDeactivate?.agent_id && knowledgeBaseId) {
          try {
            await updateAgentKnowledgeBaseId(
              agentToDeactivate.agent_id,
              knowledgeBaseId
            );
          } catch (err) {
            console.error(" Failed to update agent's KB ID:", err);
          }
        }
      }

      await toggleAgentActivation(
        agentToDeactivate.agent_id,
        !isCurrentlyDeactivated
      );

      setPopupType("success");
      setPopupMessage(
        isCurrentlyDeactivated
          ? "Agent activated successfully."
          : "Agent deactivated successfully."
      );
      setShowDeactivateConfirm(false);
      setHasFetched(false);
    } catch (error) {
      console.error("Activation/Deactivation Error:", error);
      setPopupType("failed");
      setPopupMessage("Failed to update agent status.");
      setShowDeactivateConfirm(false);
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleUpgradeClick = (agent) => {

    setagentId(agent?.agent_id);
    setsubscriptionId(agent?.subscriptionId);


    navigate("/plan", {
      state: {
        agentID: agent?.agent_id,
        locationPath: locationPath,
        subscriptionID: agent?.subscriptionId
      }
    })
  };

  const fetchPrevAgentDEtails = async (agent_id, businessId) => { };
  const locationPath = location.pathname;


  const getUserReferralCode = async () => {
    try {
      const res = await getUserReferralCodeForDashboard(userId);
      // console.log(res.referralCode)
      setShowDashboardReferral(
        `${window.location.origin}?referral=${encodeURIComponent(
          res?.referralCode
        )}` || ""
      );
    } catch (error) {
      console.log("error occured while fetching user referal code", error);
    }
  };

  const handleCopy = async (referralLink) => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000); // hide after 2 seconds
      })
      .catch((err) => {
        console.error("Copy failed:", err);
      });
  };

  const shareReferralLink = async (referralLink) => {
    if (!referralLink) {
      console.error("No referral code provided");
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          url: referralLink,
        });
        console.log("Share URL:", referralLink); // Debug
      } catch (error) {
        console.error("Error sharing:", error);
        await navigator.clipboard.writeText(referralLink);
      }
    } else {
      try {
        await navigator.clipboard.writeText(referralLink);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  const showConfirmFloatingClose = () => {
    setPopupType2("confirm");
    setPopupMessage2(
      "Are you sure you want to remove the floating icon? You can enable it again later from the profile section."
    );
  };
  const handleChangeStatus = async () => {
    try {
      const res = await updateShowReferralFloatingStatus(
        userId,
        !showreferralfloating
      );
      // console.log(res)
      // setReferralCode(user?.referralCode)
      setShowreferralfloating(res?.data);
      localStorage.setItem("showreferralfloating", res?.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleConnectCal = (agent) => {
    console.log(agent, "agent")
    navigate("/connect-calender")
    sessionStorage.setItem("agentDetails", JSON.stringify(agent))
  }
  const handleCalConnectWithConfirm = async () => {
    try {
      await createCalEvent();  // event creation logic
    } finally {
      setIsConfirming(false);
      setPopupMessage3("");   //  Close the popup after confirm logic completes
    }
  };

  const handleConnectCalApiAlready = (agent) => {

    setAgentDetailsForCal(agent)
    setPopupType3("confirm");
    setPopupMessage3(
      "Your Cal API key is already added. Do you want to continue with this key and automatically create a Cal event?"
    );
  }
  const handleClosePopUp3 = async () => {

    setPopupMessage3("");
    console.log(isConfirming, "isConfirming")
    if (isConfirming) {

      handleConnectCal(agentDetailsForCal);
    }
  }
  const checkRecentPageLocation = location.state?.currentLocation;
  useEffect(() => {
    if (checkRecentPageLocation === "/checkout") fetchAndMergeCalApiKeys();
  }, []);
  return (
    <div>
      <div className={styles.forSticky}>
        <header className={styles.header}>
          <div className={styles.profileSection} ref={profileRef} onClick={handleEditProfile}>
            <div >
              <button className={styles.avatarBtn} >
                <img
                  src={
                    user?.profile ||
                    capturedImage ||
                    uploadedImage ||
                    "/svg/profile-icon.svg"
                  }
                  alt="Profile"
                  className={styles.profilePic}
                  onError={(e) => {
                    e.target.src = "/svg/profile-icon.svg";
                  }}
                />
              </button>
            </div>
            <div>
              <p className={styles.greeting}>Hello!</p>
              <h2 className={styles.name}>
                {formatName(user?.name) || "John Vick"}
              </h2>
            </div>

          </div>
          <div className={styles.notifiMain}>
            <div
              className={styles.notificationIcon}
              onClick={() => setShowModal(true)}
            >
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
            <div className={styles.notificationIcon} onClick={handleLogout}>
              <svg
                width="16"
                height="22"
                viewBox="0 0 16 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2451 14.7432C11.2018 14.7346 11.1592 14.7221 11.1182 14.7051C11.0367 14.6713 10.9628 14.6218 10.9004 14.5596L10.8154 14.457C10.791 14.4205 10.7699 14.3816 10.7529 14.3408C10.719 14.2592 10.7022 14.1714 10.7021 14.083L10.7148 13.9512C10.7235 13.9079 10.7359 13.8652 10.7529 13.8242C10.7699 13.7834 10.791 13.7445 10.8154 13.708L10.9004 13.6055L12.8428 11.6738L6.74316 11.6738C6.5645 11.6738 6.39296 11.6029 6.2666 11.4766C6.14027 11.3502 6.06943 11.1786 6.06934 11C6.06934 10.8214 6.14037 10.6498 6.2666 10.5234C6.39296 10.3971 6.56447 10.3253 6.74316 10.3252L12.8428 10.3252L10.9004 8.39355L10.8994 8.39355L10.8154 8.29004C10.7422 8.18004 10.7021 8.05011 10.7021 7.91602C10.7022 7.737 10.7737 7.565 10.9004 7.43848C11.027 7.31205 11.199 7.24113 11.3779 7.24121C11.5568 7.24141 11.7281 7.31291 11.8545 7.43945L11.8545 7.43848L14.9512 10.5225C15.0141 10.5849 15.0645 10.6593 15.0986 10.7412C15.1327 10.8231 15.1504 10.9113 15.1504 11C15.1503 11.0885 15.1326 11.1761 15.0986 11.2578C15.0815 11.2989 15.0599 11.3383 15.0352 11.375L14.9512 11.4775L11.8525 14.5596C11.7901 14.622 11.7154 14.6712 11.6338 14.7051C11.5521 14.7389 11.4644 14.7568 11.376 14.7568L11.2451 14.7432Z"
                  fill="#222222"
                  stroke="#222222"
                  stroke-width="0.3"
                />
                <path
                  d="M5.41602 21.457L5.18945 21.4512C4.06174 21.3954 2.99122 20.9227 2.18848 20.1211C1.33243 19.2661 0.850217 18.1064 0.848633 16.8965L0.848634 5.11426L0.854494 4.88769C0.911831 3.75841 1.38613 2.68712 2.18945 1.88379C2.993 1.08037 4.06483 0.605939 5.19434 0.548827L5.4209 0.542968L10.5869 0.542968C11.7964 0.543775 12.956 1.02494 13.8115 1.87988C14.667 2.73482 15.1488 3.8941 15.1504 5.10352L15.1504 5.10449L15.1465 6.10059L15.1338 6.23242C15.1079 6.36202 15.044 6.48232 14.9492 6.57715C14.8229 6.70349 14.6513 6.77436 14.4727 6.77441C14.294 6.77441 14.1225 6.70341 13.9961 6.57715C13.8697 6.4508 13.7989 6.27926 13.7988 6.10059L13.7988 5.10449L13.7939 4.94531C13.7536 4.15165 13.421 3.39863 12.8564 2.83398C12.2544 2.23179 11.4375 1.89301 10.5859 1.8916L5.42676 1.8916L5.26758 1.89551C4.47112 1.93575 3.71506 2.27041 3.14844 2.83691C2.54444 3.44103 2.20427 4.25998 2.20313 5.11426L2.20313 16.8955L2.20801 17.0547C2.2482 17.8484 2.58093 18.6013 3.14551 19.166C3.71012 19.7306 4.46313 20.0642 5.25684 20.1045L5.41602 20.1084L10.5781 20.1084C11.4326 20.1075 12.2521 19.7681 12.8564 19.1641C13.4608 18.56 13.8005 17.7402 13.8018 16.8857L13.8018 15.8994L13.8145 15.7676C13.8403 15.638 13.9042 15.5177 13.999 15.4229C14.1254 15.2965 14.2969 15.2257 14.4756 15.2256C14.6542 15.2256 14.8258 15.2966 14.9521 15.4229C15.0785 15.5492 15.1503 15.7207 15.1504 15.8994L15.1504 16.8867L15.1445 17.1133C15.0873 18.2423 14.6127 19.313 13.8096 20.1162C12.9528 20.9729 11.7917 21.4556 10.5801 21.457L5.41602 21.457Z"
                  fill="#222222"
                  stroke="#222222"
                  stroke-width="0.3"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Ankush Code Start */}

        <section className={styles.agentCard}>
          <div className={styles.agentInfo} onClick={handleTotalCallClick}>
            <h2
              className={`${styles.agentHeading} ${isSmallFont ? styles.smallFont : ""
                }`}
            >
              {totalCalls || 0}
            </h2>
            <img src="svg/total-call.svg" alt="total-call" />
          </div>

          <hr />

          <div className={styles.agentInfo2} onClick={handleCalender}>
            <h2
              className={`${styles.agentHeading} ${isSmallFont ? styles.smallFont : ""
                }`}
            >
              {bookingCount}
            </h2>
            <img src="svg/calender-booking.svg" alt="calender-booking" />
          </div>
        </section>

        {/* Ankush code end */}
      </div>

      <div className={styles.main}>
        {show ? (
          <Modal isOpen={show} onClose={handleCLose}>
            <></>
            <h2 className={styles.apologyHead}>Comming Soon</h2>

            <p className={styles.apologyHeadText} apologyHeadText>
              We apologise, But our paid plans are being tested to pass our
              "Rigorous QA Process" For now, If your sign-up for a "Free
              Account", We promise to send you Upgradation Options in your email
              within next 2 weeks.
            </p>

            <div className={styles.zz}>
              {/* <button className={styles.closeBTN} onClick={handleNaviagte}>Continue with Free</button> */}
            </div>
          </Modal>
        ) : null}

        {localAgents?.map((agent) => {
          const planStyles = ["MiniPlan", "ProPlan", "Maxplan"];
          const randomPlan = `${agent?.subscription?.plan_name}Plan`;

          let assignedNumbers = [];
          if (agent.voip_numbers) {
            try {
              assignedNumbers = JSON.parse(agent?.voip_numbers);
            } catch {
              assignedNumbers = [];
            }
          }
          return (
            <div
              key={agent.agent_id}
              className={`${styles.LangStyle} ${styles[randomPlan]}`}
              onClick={() => handleCardClick(agent)}
            >
              <div className={styles?.PlanPriceMain}>
                <h3 className={styles?.PlanPrice}>
                  {agent?.subscription?.plan_name || "Free"}
                  {" Plan"}
                </h3>
              </div>
              <div className={styles.Lang}>
                <div className={styles.LangItem}>
                  <div className={styles.LangIcon}>
                    <div className={styles.agentAvatarContainer}>
                      <img
                        src={agent?.avatar || "images/SofiaAgent.png"}
                        alt="English"
                      />
                    </div>
                    {/* <img src={"images/SofiaAgent.png"}alt="English" /> */}
                  </div>
                  <div className={styles.LangText}>
                    <h3 className={styles.agentName}>
                      {formatAgentName(agent?.agentName)}
                      <span
                        className={
                          agent.isDeactivated === 1
                            ? styles.InactiveText
                            : styles.activeText
                        }
                      >
                        {agent.isDeactivated === 1 ? "Inactive" : "Active"}
                      </span>
                    </h3>

                    <p className={styles.agentAccent}>
                      {agent?.agentLanguage} •{agent?.agentAccent}
                    </p>
                  </div>
                </div>

                <div
                  className={styles.FilterIcon}
                  onClick={(e) => toggleDropdown(e, agent.agent_id)}
                  ref={dropdownRef}
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="30" height="30" rx="5" fill="white" />
                    <circle cx="8" cy="15" r="2" fill="#24252C" />
                    <circle cx="15" cy="15" r="2" fill="#24252C" />
                    <circle cx="22" cy="15" r="2" fill="#24252C" />
                  </svg>

                  {openDropdown === agent?.agent_id && (
                    <div className={styles.OptionsDropdown}>
                      <div
                        className={styles.OptionItem}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          if (agent?.isDeactivated === 1) {
                            handleInactiveAgentAlert();
                          } else {
                            handleOpenCallModal(agent);
                          }
                        }}
                      >
                        Test Agent
                      </div>
                      <div
                        className={styles.OptionItem}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          if (agent?.isDeactivated === 1) {
                            handleInactiveAgentAlert();
                          } else {
                            navigate("/integrate-agent", {
                              state: {
                                agentDetails: agent,
                                // refreshFuntion: handleRefresh,
                                // alertPopUp: handleAlertPopUp,
                              },
                            });
                          }
                        }}
                      >
                        Integrate
                      </div>

                      {/* <div className={styles.OptionItem} onClick={() => ""}>
                        Call Settings
                      </div> */}
                      <div
                        className={styles.OptionItem}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          if (agent?.isDeactivated === 1) {
                            handleInactiveAgentAlert();
                          } else {
                            handleEditAgent(agent);
                          }
                        }}
                      >
                        {/* <div className={styles.OptionItem} onClick={() => ""}> */}
                        Edit Agent
                      </div>
                      <div
                        className={styles.OptionItem}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleUpgradeClick(agent);
                        }}
                      >
                        Upgrade
                      </div>
                      <div key={agent.agent_id}>
                        <div
                          className={styles.OptionItem}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setAgentToDelete(agent);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          Delete Agent
                        </div>
                      </div>
                      <div
                        className={styles.OptionItem}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setAgentToDeactivate(agent);
                          setShowDeactivateConfirm(true);
                        }}
                      >
                        {agent.isDeactivated === 1
                          ? "Activate Agent"
                          : "Deactivate Agent"}
                      </div>
                      {agent?.subscription && agent?.subscription?.plan_name?.toLowerCase() !== "free" && (
                        <div>
                          <div
                            className={styles.OptionItem}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setAgentToCancel(agent);
                              setShowCancelConfirm(true);
                            }}
                          >
                            Cancel Subscription
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              </div>
              <hr className={styles.agentLine} />

              <div className={styles.LangPara}>
                <p className={styles.agentPara}>
                  For:{" "}
                  <strong>
                    {formatBusinessName(
                      agent?.business?.businessName ||
                      agent?.business?.knowledge_base_texts?.name ||
                      agent?.business?.googleBusinessName
                    )}
                  </strong>
                </p>
                <div className={styles.VIA}>
                  {agent.calApiKey ? (
                    <img
                      src="svg/cal-svg.svg"
                      alt="cal-svg"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (agent?.isDeactivated === 1) {
                          handleInactiveAgentAlert();
                        } else {

                          handleConnectCal(agent)

                        }
                      }}
                    />
                  ) : (
                    <img
                      src="svg/call-cross.svg"
                      alt="No API Key"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (agent?.isDeactivated === 1) {
                          handleInactiveAgentAlert();
                        } else {
                          if (userCalApiKey) {
                            handleConnectCalApiAlready(agent)
                          }
                          else {
                            handleConnectCal(agent)
                          }
                        }
                      }}
                      title="Cal API Key not set"
                    />
                  )}
                </div>
              </div>

              <div className={styles.LangButton}>
                { agent?.subscriptionId === null ?
                  <div className={styles.AssignNumText}>
                  </div> 
                  :
                assignedNumbers.length > 0 ? (
                  <div className={styles.AssignNumText}>
                    Assigned Number
                    <p className={styles.NumberCaller}>
                      {assignedNumbers.length > 1 ? "s" : ""}{" "}
                      {assignedNumbers.join(", ")}
                    </p>
                  </div>
                ) : (
                  <div
                    className={styles.AssignNum}
                    onClick={(e) => handleAssignNumberClick(agent, e)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src="/svg/assign-number.svg" />
                  </div>
                )}

                <div className={styles.minLeft}>
                  <span className={styles.MinL}>Min Left</span>{" "}
                  {agent?.callSummary?.remaining?.minutes}
                </div>
              </div>
            </div>
          );
        })}

        {/* Cal API Modal */}
        {isCalModalOpen && (
          <div
            className={styles.modalBackdrop}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                e.stopPropagation();
              }
            }}
          >
            <div
              className={styles.modalContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Connect with Cal</h2>
              <p>
                Click on the link to connect with Cal:{" "}
                <a
                  href="https://refer.cal.com/designersx"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click to connect with cal
                </a>
              </p>

              <p>
                {" "}
                Need a hand connecting with Cal.com?{" "}
                <a href="/calinfo" target="_blank" rel="noopener noreferrer">
                  See quick setup guide
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
                  {calapiloading ? (
                    <button
                      className={`${styles.modalButton} ${styles.submit}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      Updating <Loader size={18} />
                    </button>
                  ) : (
                    <button
                      className={`${styles.modalButton} ${styles.submit}`}
                      onClick={handleApiKeySubmit}
                      disabled={!isValidCalApiKey(apiKey.trim())}
                    >
                      {apiKey && !isApiKeyEditable ? "Update" : "Submit"}
                    </button>
                  )}
                  {/* <button
                    className={`${styles.modalButton} ${styles.submit}`}
                    onClick={handleApiKeySubmit}
                    disabled={!isValidCalApiKey(apiKey.trim())}
                  >
                    {apiKey && !isApiKeyEditable ? "Update" : "Submit"}
                  </button> */}
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
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value <= 999) {
                            setEventLength(value);
                          }
                        }}
                        max="999"
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
                    {calloading ? (
                      <button
                        className={`${styles.modalButton} ${styles.submit}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        Add Event <Loader size={18} />
                      </button>
                    ) : (
                      <button
                        className={`${styles.modalButton} ${styles.submit}`}
                        onClick={createCalEvent}
                        disabled={
                          !isApiKeySubmitted ||
                          !eventName.trim() ||
                          !eventSlug.trim() ||
                          !eventLength.trim()
                        }
                      >
                        Add Event
                      </button>
                    )}
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
        {showDeleteConfirm && agentToDelete && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              className={styles.modalContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Are you sure?</h2>
              <p>
                Do you want to delete agent{" "}
                <strong>{agentToDelete.agentName}</strong>?
              </p>
              <div className={styles.modalButtons}>
                <button
                  className={`${styles.modalButton} ${styles.cancel}`}
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  No
                </button>
                {deleteloading ? (
                  <button
                    className={`${styles.modalButton} ${styles.submit}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    Deleting <Loader size={18} />
                  </button>
                ) : (
                  <button
                    className={`${styles.modalButton} ${styles.submit}`}
                    onClick={async () => {
                      try {
                        await handleDelete(agentToDelete);
                        setShowDeleteConfirm(false);
                        setAgentToDelete(null);
                      } catch (error) {
                        setPopupMessage(
                          `Failed to delete agent: ${error.message}`
                        );
                        setPopupType("failed");
                        setShowDeleteConfirm(false);
                      }
                    }}
                  >
                    Yes
                  </button>
                )}
                {/* <button
                  className={`${styles.modalButton} ${styles.submit}`}
                  onClick={async () => {
                    try {
                      await handleDelete(agentToDelete.agent_id);
                      setShowDeleteConfirm(false);
                      setAgentToDelete(null);
                    } catch (error) {
                      setPopupMessage(
                        `Failed to delete agent: ${error.message}`
                      );
                      setPopupType("failed");
                      setShowDeleteConfirm(false);
                    }
                  }}
                >
                  Yes
                </button> */}
              </div>
            </div>
          </div>
        )}

        {showCancelConfirm && agentToCancel && (() => {
          const totalMins = agentToCancel?.subscription?.totalMinutes || 0;
          const minsLeft = agentToCancel?.mins_left || 0;
          const plan_mins = totalMins;
          const usedPercentage = ((plan_mins - minsLeft) / plan_mins) * 100;
          const current_period_start = agentToCancel?.subscription?.current_period_start;
          const current_period_end = agentToCancel?.subscription?.current_period_end;
          const subscriptionAgeDays = dayjs().diff(dayjs(current_period_start), 'day');

          const isRefundEligible = usedPercentage < 5 && subscriptionAgeDays <= 2;

          return (
            <div className={styles.modalBackdrop} onClick={() => setShowCancelConfirm(false)}>
              <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <h2>Are you sure?</h2>
                <p>
                  {isRefundEligible ? (
                    <>
                      Since you're canceling within 2 days of purchasing and have used less than 5% of your minutes, you're eligible for a refund! We'll process a refund of your subscription amount, minus a 3% payment gateway fee, back to your original payment method. You should see it in your account within 5-7 business days.
                    </>
                  ) : (
                    <>
                      It's been more than 2 days since your subscription started, or you've used a significant portion of your minutes. Due to our cancellation & refund policy, you're not eligible for a refund. Your subscription will be canceled on <strong>{dayjs(current_period_end).format('MMMM D, YYYY')}</strong>, and you can continue to use all features until then.
                    </>
                  )}
                </p>

                <p style={{ marginTop: '16px' }}>
                  Are you sure you want to cancel?
                </p>

                <div className={styles.modalButtons}>
                  <button
                    className={`${styles.modalButton} ${styles.cancel}`}
                    onClick={() => setShowCancelConfirm(false)}
                  >
                    No
                  </button>
                  {deleteloading ? (
                    <button
                      className={`${styles.modalButton} ${styles.submit}`}
                      style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      Cancelling <Loader size={18} />
                    </button>
                  ) : (
                    <button
                      className={`${styles.modalButton} ${styles.submit}`}
                      onClick={async () => {
                        try {
                          await handleCancelSubscription(agentToCancel);
                          setShowCancelConfirm(false);
                          setAgentToCancel(null);
                        } catch (error) {
                          setPopupMessage(
                            `Failed to Cancel subscription: ${error.message}`
                          );
                          setPopupType("failed");
                          setShowCancelConfirm(false);
                        }
                      }}
                    >
                      Yes
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}


        {/* Call Test Modal */}
        {openCallModal && (
          <Modal3 isOpen={openCallModal} onClose={handleCloseCallModal} isEndingRef={isEndingRef} isCallInProgress={isCallInProgress}>
            <CallTest
              isCallActive={isCallActive}
              onStartCall={handleStartCall}
              onEndCall={handleEndCall}
              callLoading={callLoading}
              setCallLoading={setCallLoading}
              isliveTranscript={liveTranscript}
              agentName={agentDetails?.agentName}
              agentAvatar={agentDetails?.avatar}
              businessName={agentDetails?.business?.businessName}
              isEndingRef={isEndingRef}
            />
          </Modal3>
        )}

        {/* WidgetModal */}
        {openWidgetModal && (
          <Modal2 isOpen={openWidgetModal} onClose={handleCloseWidgetModal}>
            <WidgetScript
              isAgentDetails={agentDetails}
              onClose={handleCloseWidgetModal}
              refreshFuntion={handleRefresh}
              alertPopUp={handleAlertPopUp}
            />
          </Modal2>
        )}
      </div>
      {isAssignNumberModalOpen && (
        <div className={styles.modalBackdrop} onClick={closeAssignNumberModal}>
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Coming Soon!</h2>
            <p style={{ fontSize: "1.1rem", color: "#444", margin: "16px 0" }}>
              Our exciting plans will be available shortly. You'll be able to
              select the best one to suit your needs!
            </p>
            <button
              className={`${styles.modalButton} ${styles.submit}`}
              onClick={closeAssignNumberModal}
              style={{ width: "100%" }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Modals for capturing/uploading profile picture */}
      {/* {isCaptureModalOpen && (
        <CaptureProfile onClose={closeCaptureModal} onCapture={handleCapture} />
      )} */}
      {showDeactivateConfirm && agentToDeactivate && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setShowDeactivateConfirm(false)}
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>
              {agentToDeactivate?.isDeactivated === 1
                ? "Activate Agent"
                : "Deactivate Agent"}
            </h2>
            <p>
          {agentToDeactivate?.isDeactivated === 1
  ? 'Are you sure you want to activate this agent?'
  : "If you pause your voice agent service, your monthly minutes will stop immediately. Don't worry—when you reactivate, your billing cycle will resume from that day, so you’ll still get all your paid time."
}
              <strong>
                {agentToDeactivate?.isDeactivated === 1
                  ? "activate"
                  : "deactivate"}
              </strong>{" "}
              <strong>{formatName(agentToDeactivate?.agentName)}</strong>?
            </p>

            <div className={styles.modalButtons}>
              <button
                className={`${styles.modalButton} ${styles.cancel}`}
                onClick={() => setShowDeactivateConfirm(false)}
              >
                {agentToDeactivate?.isDeactivated === 1
  ? "No"
  : "Keep Active"
}
              </button>
              <button
                className={`${styles.modalButton} ${styles.submit}`}
                onClick={handleDeactivateAgent}
              >
                {deactivateLoading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    Updating <Loader size={18} />
                  </span>
                ) : (
                 <>
                 {agentToDeactivate?.isDeactivated === 1
  ? 'Yes'
  : "Yes, Pause"
}
                 </> 
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploadModalOpen && (
        <UploadProfile onClose={closeUploadModal} onUpload={handleUpload} />
      )}
      {/* Floating Button */}
      {showreferralfloating == "true" && (
        <div
          className={styles.floating}
          onClick={async () => {
            await getUserReferralCode();
          }}
        >
          <div className={styles.Cross} onClick={showConfirmFloatingClose}>
            x
          </div>
          <div className={styles.imageWrapper} onClick={() => setIsModalOpen(true)}>
            <img src="/svg/floating-svg2.svg" alt="floating-svg" />
            <p className={styles.imageLabel}>10<span className={styles.percentag}>%</span></p>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.Refferalinfo}>
          <div className={styles.headerPart}>
            <h3>Earn 10% Referral Commission</h3>
          </div>
          <div className={styles.card}>
            {/* <label className={styles.checkboxLabel}>
              Show Referral link on Dashboard
              <input type="checkbox" className={styles.customCheckbox} />
            </label> */}

            <div className={styles.linkSection}>
              <p className={styles.label}>Referral Link</p>
              <div className={styles.linkDiv}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={showDashboardReferral}
                    readOnly
                    className={styles.input}
                  />
                </div>
                <div className={styles.copyWrapper}>
                  <button
                    className={styles.copyButton}
                    onClick={async () => handleCopy(showDashboardReferral)}
                  >
                    <img src="/svg/copy-icon.svg" alt="Copy" />
                  </button>
                  {copied && <span className={styles.tooltip}>Copied!</span>}
                </div>
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.infoSection}>
              <div className={styles.Linkdec}>
                <img src="/svg/earn-icon.svg" alt="earn-icon" />
                <p>
                  Share your referral link and <b>earn 10% commission</b> of
                  your friends’ spending.
                </p>
              </div>
              <div className={styles.Linkdec}>
                <img src="/svg/commission-icon.svg" alt="commission-icon" />
                <p>
                  You will earn “Commission” every month for upto{" "}
                  <b>12 months</b> or Customer Lifespan(Whichever is lower){" "}
                </p>
              </div>
              <div className={styles.Linkdec}>
                <img src="/svg/commission2.svg" alt="commission-icon" />
                <p>
                  We pay “Referral Commission” to our affiliate partners on{" "}
                  <b>1st Day of every following month.</b>
                </p>
              </div>
            </div>
            {/* <AnimatedButton label = 'Share Referral Link' onClick={async () => shareReferralLink(showDashboardReferral)}/> */}
            <div
              className={styles.btnTheme}
            // onClick={async () => shareReferralLink(showDashboardReferral)}
            >
              <div className={styles.imageWrapper}>
                <img src="svg/svg-theme2.svg" alt="" />
              </div>
              <AnimatedButton label='Share Referral Link' onClick={async () => shareReferralLink(showDashboardReferral)} />
            </div>
          </div>
        </div>
      </Modal>

      {/* <Footer /> */}
      <Footer2 />
      <Modal isOpen={modelOpen} onClose={() => setModelOpen(false)}>
        <Plan
          agentID={agentId}
          subscriptionID={subscriptionId}
          locationPath={locationPath}
        />
      </Modal>

      <CommingSoon show={showModal} onClose={() => setShowModal(false)} />

      {isAssignModalOpen && selectedAgentForAssign && (
        <AssignNumberModal
          isOpen={isAssignModalOpen}
          agentId={selectedAgentForAssign.agent_id}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedAgentForAssign(null);
          }}
        />
      )}
      {/* nitish */}

      {popupMessage && (
        <Popup
          type={popupType}
          message={popupMessage}
          onClose={() => setPopupMessage("")}
          onConfirm={handleLogoutConfirm}
        />
      )}

      {popupMessage2 && (
        <Popup
          type={popupType2}
          message={popupMessage2}
          onClose={() => setPopupMessage2("")}
          onConfirm={handleChangeStatus}
        />
      )}


      <Popup
        type={popupType3}
        message={popupMessage3}
        onClose={() => {
          if (!isConfirmedRef.current) {
            handleConnectCal(agentDetailsForCal);
          }
          isConfirmedRef.current = false;
          setPopupMessage3("");
        }}
        onConfirm={() => {
          isConfirmedRef.current = true;
          handleCalConnectWithConfirm();
          setPopupMessage3("");

        }}
      />




    </div>
  );
}

export default Dashboard;
