import React, { useEffect, useState } from "react";
import styles from "./AgentSetupHelp.module.css";
import EditHeader from "../EditHeader/EditHeader";
import AnimatedButton from "../AnimatedButton/AnimatedButton";
import decodeToken from "../../lib/decodeToken";
import { getAgentScheduleByUserId, saveAgentSchedule } from "../../Store/apiStore";
import PopUp from "../Popup/Popup";
import Loader from "../Loader/Loader";
function generateTimeSlots(start = "09:00", end = "18:30", interval = 30) {
  const slots = [];
  let [startHour, startMin] = start.split(":").map(Number);
  let [endHour, endMin] = end.split(":").map(Number);

  const current = new Date();
  current.setHours(startHour, startMin, 0, 0);

  const endTime = new Date();
  endTime.setHours(endHour, endMin, 0, 0);

  while (current < endTime) {
    const slotStart = new Date(current);
    const slotEnd = new Date(current.getTime() + interval * 60000); // Add interval to get end of slot

    // ❌ Exclude slots starting from 1:00 PM to before 2:00 PM
    const isInLunchBreak = slotStart.getHours() === 13;

    if (!isInLunchBreak && slotEnd <= endTime) {
      const formattedTime = slotStart.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      slots.push(formattedTime);
    }

    current.setMinutes(current.getMinutes() + interval);
  }

  return slots;
}




const timeSlots = generateTimeSlots();
// function getNext7Days(startDate = new Date(), skipFromDate = null) {
//   const days = [];
//   const options = { weekday: "short" };

//   let i = 0;
//   while (days.length < 7) {
//     const date = new Date(startDate);
//     date.setDate(startDate.getDate() + i);

//     let shouldSkip = false;

//     // Skip 2 days after the scheduled date
//     if (skipFromDate) {
//       const skip1 = new Date(skipFromDate);
//       const skip2 = new Date(skipFromDate);
//       const skip3 = new Date(skipFromDate);

//       skip1.setDate(skip1.getDate() + 1);
//       skip2.setDate(skip2.getDate() + 2);
//       skip3.setDate(skip3.getDate() + 3); // start from here

//       // If date is before skip3, skip it
//       if (date < skip3) {
//         shouldSkip = true;
//       }
//     }

//     if (!shouldSkip) {
//       days.push({
//         date,
//         label: date.toLocaleDateString(undefined, { day: "2-digit" }),
//         day: date.toLocaleDateString(undefined, options),
//       });
//     }

//     i++;
//   }

//   return days;
// }
function getNext7Days(startDate = new Date(), skipFromDate = null) {
  const days = [];
  const options = { weekday: "short" };

  let i = 0;
  while (days.length < 7) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const isSunday = date.getDay() === 0;

    let shouldSkip = isSunday;

    // Skip 2 days after the scheduled date
    if (skipFromDate) {
      const skip1 = new Date(skipFromDate);
      const skip2 = new Date(skipFromDate);
      const skip3 = new Date(skipFromDate);

      skip1.setDate(skip1.getDate() + 1);
      skip2.setDate(skip2.getDate() + 2);
      skip3.setDate(skipFromDate.getDate() + 3); // Only allow from here

      if (date < skip3) {
        shouldSkip = true;
      }
    }

    if (!shouldSkip) {
      days.push({
        date,
        label: date.toLocaleDateString(undefined, { day: "2-digit" }),
        day: date.toLocaleDateString(undefined, options),
      });
    }

    i++;
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
  const [existingSchedule, setExistingSchedule] = useState(null);
  const [formDisabled, setFormDisabled] = useState(false);
  const fetchData = async () => {
    try {
      const res = await getAgentScheduleByUserId(userIdFromToken);
      let schedule = null;

      if (res?.data?.length > 0) {
        schedule = res.data[0];
        setExistingSchedule(schedule);
        setFormDisabled(true);
      }

      const baseDate = new Date();
      const skipFrom = schedule ? new Date(schedule.scheduledDate) : null;
      const upcomingDays = getNext7Days(baseDate, skipFrom);

      setDays(upcomingDays);
      setSelectedDate(upcomingDays[0].date);
    } catch (error) {
      console.error("Error fetching agent schedule:", error.message);
    }
  };
  useEffect(() => {
    fetchData();
    const storedSession = sessionStorage.getItem("dashboard-session-storage");
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        const sessionAgents = sessionData?.state?.agents || [];
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

      setPopup({ type: "success", message: "Slot booked successfully!" });
      setTimeout(() => {
        setPopup({ type: "", message: "" });
      }, 2500);
      // Reset form
      setSelectedAgent("");
      setBusinessName("");
      setBusinessCategory("");
      setSelectedDate(days[0].date);
      setSelectedTime(null);
      setCustomAgentName("");
      setTimeout(() => {
        fetchData()
      }, 3000);

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
      {formDisabled && (
        <p className={styles.warning}>
           <strong style={{ color: "#5a20d8" }}>Disclaimer:</strong> You have already booked a slot. You cannot schedule another until this one is completed. To know your ticket status, kindly <a href="mailto:support@rxpt.us"  target="_blank" rel="noopener noreferrer" style={{ color: "purple", fontWeight: 600 }}>Contact Support</a>.
        </p>
      )}

      {existingSchedule && (
        <div className={styles.scheduleInfo}>
          <h3>📅 Scheduled Slot</h3>
          <p>
            <strong>Date & Time:</strong>{" "}
            {new Date(existingSchedule.scheduledDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })},{" "}
            {existingSchedule.scheduledTime}
          </p>
        </div>
      )}

      <div className={`${styles.container} ${formDisabled ? styles.disabledContainer : ""}`} >
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
                className={`${styles.dayItem} ${selectedDate?.toDateString() === dayObj.date.toDateString()
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
                className={`${styles.timeButton} ${selectedTime === slot ? styles.selectedTime : ""
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
            disabled={loading || formDisabled}
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
      {/* {existingSchedule && (
        <div className={styles.scheduleInfo}>
          <h3>Already Scheduled</h3>
          <p><strong>Agent:</strong> {existingSchedule.agentName}</p>
          <p><strong>Business:</strong> {existingSchedule.businessName}</p>
          <p><strong>Category:</strong> {existingSchedule.businessType}</p>
          <p><strong>Date:</strong> {existingSchedule.scheduledDate}</p>
          <p><strong>Time:</strong> {existingSchedule.scheduledTime}</p>
        </div>
      )} */}

    </div>
  );
}
