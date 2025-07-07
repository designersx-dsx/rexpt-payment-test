import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import HeaderBar from "../HeaderBar/HeaderBar";
import "react-calendar/dist/Calendar.css";
import styles from "./Clender.module.css";
import Footer2 from "../AgentDetails/Footer/Footer2";
import decodeToken from "../../lib/decodeToken";
import { API_BASE_URL, fetchDashboardDetails, getAllAgentCalls } from "../../Store/apiStore";
import axios from "axios";

function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

const AgentAnalysis = () => {
  const [agents, setAgents] = useState([]);
  const [calApiKey, setCalApiKey] = useState(null);
  const [bookingDates, setBookingDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingsForSelectedDate, setBookingsForSelectedDate] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [callHistory, setCallHistory] = useState([]);
  const bookingsRef = useRef(null);

  const token = localStorage.getItem("token") || "";
  const decodeTokenData = decodeToken(token);
  const userId = decodeTokenData?.id || "";
  const [selectedAgentEventId, setSelectedAgentEventId] = useState("");

  useEffect(() => {
    const foundAgent = agents.find((a) => a.agent_id === selectedAgentId);
    setSelectedAgentEventId(foundAgent?.eventId || "");
  }, [selectedAgentId, agents]);

  const fetchUserAgents = async () => {
    if (!userId) return;
    try {
      const res = await fetchDashboardDetails(userId);
      setAgents(res?.agents);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    const sessionData = sessionStorage.getItem("dashboard-session-storage");
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        const agents = parsed?.state?.agents || [];
        const foundKey = agents.find((a) => a.calApiKey)?.calApiKey;
        if (foundKey) setCalApiKey(foundKey);
      } catch (e) {
        console.error("Failed to parse session storage:", e);
      }
    }
  }, []);

 const fetchCallHistory = async () => {
  try {
    if (selectedAgentId === "") {
      const res = await getAllAgentCalls(userId);
      const allCalls = res.calls || [];
      setCallHistory(allCalls);
    } else {
      const response = await axios.get(
        `${API_BASE_URL}/agent/getAgentCallHistory/${selectedAgentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const agentCalls = response.data.filteredCalls || [];
      setCallHistory(agentCalls);
    }
  } catch (error) {
    console.error("Error fetching call history:", error);
    setCallHistory([]);
  }
};



  useEffect(() => {
    fetchUserAgents();
  }, []);

  useEffect(() => {
    fetchCallHistory();
  }, [selectedAgentId]);

  useEffect(() => {
    const fetchBookingDates = async () => {
      const bookingsMap = {};

      // 1. Add Calls
      callHistory.forEach((call) => {
        const callDate = formatDateISO(new Date(call.start_timestamp));
        if (!bookingsMap[callDate]) bookingsMap[callDate] = [];
        bookingsMap[callDate].push({ ...call, type: "call" });
      });

      // 2. Fetch Cal bookings
      if (calApiKey) {
        try {
          const response = await fetch(
            `https://api.cal.com/v1/bookings?apiKey=${encodeURIComponent(
              calApiKey
            )}`
          );
          const bookingsData = await response.json();

          const selectedAgent = agents.find(
            (a) => String(a.agent_id) === String(selectedAgentId)
          );
          const selectedEventId = selectedAgent?.eventId;

          bookingsData.bookings?.forEach((booking) => {
            const date = new Date(booking.startTime);
            const formattedDate = formatDateISO(date);

            const match =
              selectedEventId &&
              Number(booking.eventTypeId) === Number(selectedEventId);
            const shouldInclude = !selectedAgentId || match;

            if (shouldInclude) {
              if (!bookingsMap[formattedDate]) bookingsMap[formattedDate] = [];
              bookingsMap[formattedDate].push({ ...booking, type: "meeting" });
            }
          });
        } catch (error) {
          console.error("Cal.com API fetch failed:", error);
        }
      }

      setBookingDates(bookingsMap);
      setBookingsForSelectedDate(
        bookingsMap[formatDateISO(selectedDate)] || []
      );
    };
    fetchBookingDates();
  }, [calApiKey, selectedDate, selectedAgentId, callHistory, agents]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setBookingsForSelectedDate(bookingDates[formatDateISO(date)] || []);
    if (bookingsRef.current) {
      bookingsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dateStr = formatDateISO(date);
    const items = bookingDates[dateStr] || [];
    const meetingCount = items.filter((i) => i.type === "meeting").length;
    const callCount = items.filter((i) => i.type === "call").length;

    const formatCount = (count) => (count > 99 ? "99+" : count);


    return (
      <div className={styles.bookingDotContainer}>
        {meetingCount > 0 && (
          <div className={`${styles.dot} ${styles.greenDot}`}>
            {formatCount(meetingCount)}
          </div>
        )}
        {callCount > 0 && (
          <div className={`${styles.dot} ${styles.orangeDot}`}>
            {formatCount(callCount)}
          </div>
        )}
      </div>
    );
  };
  return (
    <div className={styles.container}>
      <div className={styles.HeaderFlex}>
        <HeaderBar title="Calendar" backgroundColor="#0000" color="#ffff" />

        <div className={styles.DateSecT}>
          <p>Agent</p>
          <div className={styles.selectedValue}>
            <select
              className={styles.agentSelect1}
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
            >
              <option value="">All</option>
              {agents.map((agent) => (
                <option key={agent.agent_id} value={agent.agent_id}>
                  {agent.agentName.length > 7
                    ? agent.agentName.slice(0, 12) + "..."
                    : agent.agentName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.calendarSection}>
        <div className={styles.DotINfo}>
          <div className={styles.DotOrange}>
            <div className={styles.dot1}></div>
            <span>Calls Received</span>
          </div>
          <hr />
          <div className={styles.DotGreen}>
            <div className={styles.dot}></div>
            <span>Meetings Booked</span>
          </div>
        </div>
        {/* gg */}
        <Calendar
          onChange={handleDateClick}
          value={selectedDate}
          tileContent={tileContent}
          calendarType="gregory"
          className={styles.reactCalendar}
        />
      </div>

      {bookingsForSelectedDate.length > 0 && (
        <div className={styles.bookingsList} ref={bookingsRef}>
          <h3>{selectedDate.toDateString()}</h3>
          <ul>
            {bookingsForSelectedDate.map((item, index) => {
              const isMeeting = item.type === "meeting";
              const isCall = item.type === "call";
              const dotColorClass = isMeeting
                ? styles.greenBar
                : isCall
                ? styles.orangeBar
                : styles.greenBar;

              return (
                <li key={index} className={styles.bookingItem}>
                  <div className={styles.timeColumn}>
                    <span className={styles.timeLabel}>
                      {formatTime(item.startTime || item.start_timestamp)}
                    </span>
                  </div>
                  <span
                    className={`${styles.verticalBar} ${dotColorClass}`}
                  ></span>
                  <div className={styles.detailColumn}>
                    <div className={styles.line}>
                      <span className={styles.titleText}>
                        <b>{isCall ? "Caller:" : "Title:"}</b>{" "}
                        {item.title ||
                          item.custom_analysis_data?.[
                            "_detailed _call _summery"
                          ] ||
                          "N/A"}
                      </span>
                    </div>
                    <div className={styles.timeRange}>
                      <b>Phone:</b> {item.call_type}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Footer2 />
    </div>
  );
};

export default AgentAnalysis;
