import React, { useEffect, useState } from "react";
import styles from "./AgentSetupHelp.module.css";
import EditHeader from "../EditHeader/EditHeader";
import AnimatedButton from "../AnimatedButton/AnimatedButton";
import decodeToken from "../../lib/decodeToken";
import { saveAgentSchedule } from "../../Store/apiStore";
import PopUp from "../Popup/Popup";
import Loader from "../Loader/Loader";

const timeSlots = [
  "9:00 AM",
  "11:00 AM",
  "01:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

function getNext7Days() {
  const days = [];
  const options = { weekday: "short" };

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      date,
      label: date.toLocaleDateString(undefined, { day: "2-digit" }),
      day: date.toLocaleDateString(undefined, options),
    });
  }
  return days;
}

export default function AppointmentScheduler() {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [days, setDays] = useState([]);
  const token = localStorage.getItem("token") || "";
  const decodeTokenData = decodeToken(token);
  const userIdFromToken = decodeTokenData?.id || "";
  const [userId, setUserId] = useState(userIdFromToken);
  const [agentsList, setAgentsList] = useState([]);
  const [customAgentName, setCustomAgentName] = useState("");
  const [popup, setPopup] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const upcomingDays = getNext7Days();
    setDays(upcomingDays);
    setSelectedDate(upcomingDays[0].date);

    const storedSession = sessionStorage.getItem("dashboard-session-storage");
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        const sessionAgents = sessionData?.state?.agents || [];
        // Save full agent data
        setAgentsList([{ agentName: "New Agent" }, ...sessionAgents]);
      } catch (err) {
        console.error("Error parsing agents from sessionStorage:", err);
      }
    }
  }, []);
  useEffect(() => {
    if (selectedAgent && selectedAgent !== "New Agent") {
      const selectedAgentObj = agentsList.find(
        (a) => a.agentName === selectedAgent
      );

      if (selectedAgentObj?.business) {
        setBusinessName(selectedAgentObj.business.businessName || "");
        setBusinessCategory(selectedAgentObj.business.businessType || "");
      }
    } else {
      // Clear if "New Agent"
      setBusinessName("");
      setBusinessCategory("");
    }
  }, [selectedAgent, agentsList]);

  const handleSubmit = async () => {
    if (!businessName || !businessCategory || !selectedDate || !selectedTime) {
      setPopup({
        type: "failed",
        message: "Please fill out all fields and select date/time.",
      });
      return;
    }

    if (!userId) {
      setPopup({
        type: "failed",
        message: "User ID not found in token. Please login again.",
      });
      return;
    }

    const payload = {
      userId,
      agent_id: "",
      agentName: selectedAgent === "New Agent" ? "New Agent" : selectedAgent,
      businessName,
      businessType: businessCategory,
      scheduledDate: selectedDate.toISOString().split("T")[0],
      scheduledTime: selectedTime,
      notes: "Scheduled via UI",
    };

    setLoading(true);
    try {
      await saveAgentSchedule(payload);

      setPopup({ type: "success", message: "Information Sent Successfully" });

      // Reset form
      setSelectedAgent("");
      setBusinessName("");
      setBusinessCategory("");
      setSelectedDate(days[0].date);
      setSelectedTime(null);
      setCustomAgentName("");
    } catch (err) {
      console.error("API error:", err.message);
      setPopup({
        type: "failed",
        message: "Failed to save schedule. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <EditHeader title="Agent Setup" />

      <div className={styles.container}>
        <label className={styles.label}>Select Agent</label>
        <div className={styles.selectedValue}>
          <select
            className={styles.agentSelect1}
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            <option value="">Select Agent</option>
            {agentsList.map((agent, idx) => (
              <option key={idx} value={agent.agentName}>
                {agent.agentName}
              </option>
            ))}
          </select>
        </div>

        <label className={styles.label}>Business Name</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter your business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />

        <label className={styles.label}>Business Category</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Select your Business Category"
          value={businessCategory}
          onChange={(e) => setBusinessCategory(e.target.value)}
        />

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span>Suitable Slot for Call</span>
            <span className={styles.dateHeading}>
              JULY, {new Date().getFullYear()}
            </span>
          </div>
          <div className={styles.dayList}>
            {days.map((dayObj, index) => (
              <div
                key={index}
                className={`${styles.dayItem} ${
                  selectedDate?.toDateString() === dayObj.date.toDateString()
                    ? styles.selectedDay
                    : ""
                }`}
                onClick={() => setSelectedDate(dayObj.date)}
              >
                <div className={styles.DateNumber}>{dayObj.label}</div>
                <div className={styles.dayText}>{dayObj.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.label}>Select Time Slot</div>
          <div className={styles.timeList}>
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`${styles.timeButton} ${
                  selectedTime === slot ? styles.selectedTime : ""
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: "150px", height: "48px", position: "relative" }}>
         
          
            <AnimatedButton
              label="Submit"
              onClick={handleSubmit}
              disabled={loading}
              isLoading={loading}
            />
       
        </div>

        {popup.message && (
          <PopUp
            type={popup.type}
            message={popup.message}
            onClose={() => setPopup({ type: "", message: "" })}
          />
        )}
      </div>
    </div>
  );
}
