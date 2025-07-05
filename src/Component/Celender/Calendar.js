// import React, { useState, useEffect, useRef } from "react";
// import Calendar from "react-calendar";
// import HeaderBar from "../HeaderBar/HeaderBar";
// import "react-calendar/dist/Calendar.css";
// import styles from "./Clender.module.css";
// import Footer2 from "../AgentDetails/Footer/Footer2";
// import decodeToken from "../../lib/decodeToken";
// import { API_BASE_URL, fetchDashboardDetails } from "../../Store/apiStore";
// import axios from "axios"
// // Helper: Format date as YYYY-MM-DD
// function formatDateISO(date) {
//   const y = date.getFullYear();
//   const m = String(date.getMonth() + 1).padStart(2, "0");
//   const d = String(date.getDate()).padStart(2, "0");
//   return `${y}-${m}-${d}`;
// }

// // Helper: Format time as HH:MM
// function formatTime(isoDate) {
//   const date = new Date(isoDate);
//   return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
// }
// const AgentAnalysis = () => {
//   const [agents, setAgents] = useState([])
//   const [calApiKey, setCalApiKey] = useState(null);
//   const [bookingDates, setBookingDates] = useState({});
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [bookingsForSelectedDate, setBookingsForSelectedDate] = useState([]);
//   const [selectedAgentId, setSelectedAgentId] = useState("")
//   const bookingsRef = useRef(null);
//   // UserId decoded from token
//   const token = localStorage.getItem("token") || "";
//   const decodeTokenData = decodeToken(token);
//   const userId = decodeTokenData?.id || "";
//   const fetchUserAgents = async () => {
//     if (!userId) return;
//     try {
//       const res = await fetchDashboardDetails(userId);
//       console.log(res.agents)
//       setAgents(res?.agents)
//         ;
//     } catch (error) {
//       console.error("Error fetching dashboard data or Cal API keys:", error);
//     }
//   };

//   // Load calApiKey from sessionStorage
//   useEffect(() => {
//     const sessionData = sessionStorage.getItem("dashboard-session-storage");

//     if (sessionData) {
//       try {
//         const parsed = JSON.parse(sessionData);
//         const agents = parsed?.state?.agents || [];

//         // Pick the first agent with a calApiKey
//         const foundKey = agents.find((a) => a.calApiKey)?.calApiKey;

//         if (foundKey) {
//           setCalApiKey(foundKey);
//         } else {
//           console.warn("No calApiKey found in agents list.");
//         }
//       } catch (e) {
//         console.error("Failed to parse session storage:", e);
//       }
//     } else {
//       console.warn("No 'dashboard-session-storage' found in sessionStorage.");
//     }
//   }, []);
//   // Fetch bookings when calApiKey or selectedDate changes
//   useEffect(() => {
//     async function fetchBookingDates() {
//       if (!calApiKey) return;
//       try {
//         const response = await fetch(
//           `https://api.cal.com/v1/bookings?apiKey=${encodeURIComponent(calApiKey)}`
//         );

//         if (!response.ok) {
//           const err = await response.text();
//           throw new Error(`Failed to fetch bookings: ${err}`);
//         }

//         const bookingsData = await response.json();
//         const bookingsMap = {};
//   console.log(bookingsMap,"hello")
//         bookingsData.bookings?.forEach((booking) => {
//           if (booking.startTime) {
//             const date = new Date(booking.startTime);
//             const formattedDate = formatDateISO(date);
//             if (!bookingsMap[formattedDate]) {
//               bookingsMap[formattedDate] = [];
//             }
//             bookingsMap[formattedDate].push(booking);
//           }
//         });

//         setBookingDates(bookingsMap);
//         setBookingsForSelectedDate(bookingsMap[formatDateISO(selectedDate)] || []);
//       } catch (error) {
//         console.error("Failed to fetch booking dates:", error);
//       }
//     }

//     fetchBookingDates();
//   }, [calApiKey, selectedDate,selectedAgentId]);
//   // Handle date selection
//   const handleDateClick = (date) => {
//     setSelectedDate(date);
//     setBookingsForSelectedDate(bookingDates[formatDateISO(date)] || []);
//     if (bookingsRef.current) {
//       bookingsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };
//   // Render booking indicators in calendar
//   const tileContent = ({ date, view }) => {
//     if (view !== "month") return null;

//     const dateStr = formatDateISO(date);
//     const bookings = bookingDates[dateStr] || [];

//     if (bookings.length > 0) {
//       return (
//         <div className={styles.bookingDotContainer}>
//           <div className={`${styles.dot} ${styles.greenDot}`} >09+</div>
//           <div className={`${styles.dot} ${styles.orangeDot}`} >13</div>
//         </div>
//       );
//     }

//     return null;
//   };
//   const fetchCallHistory = async () => {
//     try {
//       // setLoading(true);
//       if (selectedAgentId) {
//         const response = await axios.get(
//           `${API_BASE_URL}/agent/getAgentCallHistory/${selectedAgentId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const calls = (response.data.filteredCalls || []).map((call) => ({
//           ...call,
//           call_id:
//             call.call_id
//         }));
//         console.log(calls, "callscalls")
//         // setData(calls);
//       } else {
//         // setData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching call history:", error);
//       // setData([]);
//     } finally {
//       // setLoading(false);
//     }
//   };
//   useEffect(() => {

//     fetchUserAgents()
//   }, [])
//   useEffect(() => {
//     fetchCallHistory()
//   }, [selectedAgentId,calApiKey])
//   return (
//     <div className={styles.container}>
//       <div className={styles.HeaderFlex}>
//         <HeaderBar title="Calendar" backgroundColor="#0000" color="#ffff" />

//         <div className={styles.DateSecT}>
//           <p>Agent</p>

//           <div className={styles.displayedAgentName}>
//             {/* {selectedAgentId === "all"
//               ? "All"
//               : (() => {
//                 const agent = agents.find(
//                   (agent) => agent.agent_id === selectedAgentId
//                 );
//                 return agent ? agent.agentName : "";
//               })()} */}
//           </div>

//           <div className={styles.selectedValue}>
//             <select
//               className={styles.agentSelect1}
//               value={selectedAgentId}
//               onChange={(e) => setSelectedAgentId(e.target.value)}
//             >
//               <option value="all">All</option>
//               {agents?.map((agent) => (
//                 <option key={agent.agent_id} value={agent.agent_id}>
//                   {(agent.agentName.length > 7
//                     ? agent.agentName.slice(0, 5) + "..."
//                     : agent.agentName) + ` (${agent.agentCode})`}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>



//       </div>

//       <div className={styles.calendarSection}>
//         <div className={styles.DotINfo}>
//           <div className={styles.DotOrange}>
//             <div className={styles.dot1}></div>
//             <span>Calls Received</span>
//           </div>
//           <hr />
//           <div className={styles.DotGreen}>
//             <div className={styles.dot}></div>
//             <span>Meetings Booked</span>
//           </div>
//         </div>

//         <Calendar
//           onChange={handleDateClick}
//           value={selectedDate}
//           tileContent={tileContent}
//           calendarType="gregory"
//           className={styles.reactCalendar}
//         />
//       </div>

//       {bookingsForSelectedDate.length > 0 && (
//         <div className={styles.bookingsList} ref={bookingsRef}>
//           <h3>{selectedDate.toDateString()}</h3>
//           <ul>
//             {bookingsForSelectedDate.map((booking, index) => {
//               const isMeeting =
//                 booking.type === "meeting" ||
//                 booking.title?.toLowerCase().includes("meeting");
//               const isCall =
//                 booking.type === "call" ||
//                 booking.title?.toLowerCase().includes("call");

//               const dotColorClass = isMeeting
//                 ? styles.greenBar
//                 : isCall
//                   ? styles.orangeBar
//                   : styles.greenBar;

//               return (
//                 <li key={index} className={styles.bookingItem}>
//                   <div className={styles.timeColumn}>
//                     <span className={styles.timeLabel}>
//                       {formatTime(booking.startTime)}
//                     </span>
//                   </div>
//                   <span className={`${styles.verticalBar} ${dotColorClass}`}></span>
//                   <div className={styles.detailColumn}>
//                     <div className={styles.line}>
//                       <span className={styles.titleText}><b>Caller:</b> {booking.title}</span>
//                     </div>
//                     <div className={styles.timeRange}>
//                       <b>Meeting on:</b> <span>{formatTime(booking.startTime)}</span> - {formatTime(booking.endTime)}
//                     </div>
//                   </div>
//                 </li>


//               );
//             })}
//           </ul>
//         </div>
//       )}

//       <Footer2 />
//     </div>
//   );
// };

// export default AgentAnalysis;
import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import HeaderBar from "../HeaderBar/HeaderBar";
import "react-calendar/dist/Calendar.css";
import styles from "./Clender.module.css";
import Footer2 from "../AgentDetails/Footer/Footer2";
import decodeToken from "../../lib/decodeToken";
import { API_BASE_URL, fetchDashboardDetails } from "../../Store/apiStore";
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
      if (selectedAgentId) {
        const response = await axios.get(`${API_BASE_URL}/agent/getAgentCallHistory/${selectedAgentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const filtered = (response.data.filteredCalls || []).filter(
          (call) => call.call_type === "web_call"
        );
        console.log(filtered,"filtered")
        setCallHistory(filtered);
      } else {
        setCallHistory([]);
      }
    } catch (error) {
      console.error("Error fetching call history:", error);
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
      if (!calApiKey) return;
      try {
        const response = await fetch(`https://api.cal.com/v1/bookings?apiKey=${encodeURIComponent(calApiKey)}`);
        const bookingsData = await response.json();
        const bookingsMap = {};

        bookingsData.bookings?.forEach((booking) => {
          const date = new Date(booking.startTime);
          const formattedDate = formatDateISO(date);
          if (!bookingsMap[formattedDate]) bookingsMap[formattedDate] = [];
          bookingsMap[formattedDate].push({ ...booking, type: "meeting" });
        });

        callHistory.forEach((call) => {
          if (call.call_type === "web_call") {

            const callDate = formatDateISO(new Date(call.start_timestamp));
            console.log(callDate)
            if (!bookingsMap[callDate]) bookingsMap[callDate] = [];
            bookingsMap[callDate].push({ ...call, type: "call" });
          }
        });

        setBookingDates(bookingsMap);
        setBookingsForSelectedDate(bookingsMap[formatDateISO(selectedDate)] || []);
      } catch (error) {
        console.error("Failed to fetch booking dates:", error);
      }
    };

    fetchBookingDates();
  }, [calApiKey, selectedDate, selectedAgentId, callHistory]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setBookingsForSelectedDate(bookingDates[formatDateISO(date)] || []);
    if (bookingsRef.current) {
      bookingsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dateStr = formatDateISO(date);
    const items = bookingDates[dateStr] || [];
    const hasMeetings = items.some(i => i.type === "meeting");
    const hasCalls = items.some(i => i.type === "call");

    return (
      <div className={styles.bookingDotContainer}>
        {hasMeetings && <div className={`${styles.dot} ${styles.greenDot}`} />}
        {hasCalls && <div className={`${styles.dot} ${styles.orangeDot}`} />}
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
                  {(agent.agentName.length > 7
                    ? agent.agentName.slice(0, 5) + "..."
                    : agent.agentName) + ` (${agent.agentCode})`}
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
                  <span className={`${styles.verticalBar} ${dotColorClass}`}></span>
                  <div className={styles.detailColumn}>
                    <div className={styles.line}>
                      <span className={styles.titleText}>
                        <b>{isCall ? "Caller:" : "Title:"}</b> {item.title || item.custom_analysis_data?.["_detailed _call _summery"] || "N/A"}
                      </span>
                    </div>
                    <div className={styles.timeRange}>
                      <b>Time:</b> <span>{formatTime(item.startTime || item.start_timestamp)}</span> - {formatTime(item.endTime || item.end_timestamp)}
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
