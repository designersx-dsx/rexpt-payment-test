import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./AgentAnalysis.module.css";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

// const data = [
//   { name: "Mon", value: 80 },
//   { name: "Tue", value: 60 },
//   { name: "Wed", value: 75 },
//   { name: "Thu", value: 65 },
//   { name: "Fri", value: 30 },
//   { name: "Sat", value: 100 },
//   { name: "Sun", value: 70 },
// ];
// const data = Array.from({ length: 30 }, (_, i) => ({
//   name: `${i + 1}`, // Day of the month as string ("1", "2", ..., "30")
//   value: Math.floor(Math.random() * 100) + 20, // Sample value between 20–119
// }));

function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const AgentAnalysis = ({data}) => {
const callVolume = data?.reduce((acc, day) => acc + day.calls, 0);
 const [bookingDates, setBookingDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // console.log(callVolume)
  useEffect(() => {
    async function fetchBookingDates() {
      try {
        const agents = JSON.parse(localStorage.getItem("agents")) || [];
        const agentWithCalKey = agents.find((agent) => agent.calApiKey);
        if (!agentWithCalKey) {
          console.warn("No Cal API Key found in localStorage agents");
          return;
        }

        const calApiKey = agentWithCalKey.calApiKey;
        const response = await fetch(
          `https://api.cal.com/v1/bookings?apiKey=${encodeURIComponent(
            calApiKey
          )}`
        );
        if (!response.ok)
          throw new Error("Failed to fetch bookings from Cal API");

        const bookingsData = await response.json();
        const datesSet = new Set();
        bookingsData.bookings?.forEach((booking) => {
          if (booking.startTime) {
            const date = new Date(booking.startTime);
            if (date.getFullYear() === new Date().getFullYear()) {
              datesSet.add(date.toISOString().slice(0, 10));
            }
          }
        });

        setBookingDates(Array.from(datesSet));
      } catch (error) {
        console.error("Failed to fetch booking dates:", error);
      }
    }

    fetchBookingDates();
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = formatDateISO(date);
      if (bookingDates.includes(dateStr)) {
        return styles.bookingHighlight;
      }
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.CallFlex}>
        <div className={styles.callVolume}>
          {callVolume} <span>Call Volume</span>
        </div>
        <div className={styles.trend}>
          Last 7 Days <span className={styles.positive}>+15%</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data}>
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#6A0DAD"
                floodOpacity="0.4"
              />
            </filter>
          </defs>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="calls"
            stroke="#6A0DAD"
            strokeWidth={2}
            dot={false}
            strokeLinecap="round"
            strokeOpacity={1}
            isAnimationActive={true}
            className="line-with-shadow"
            filter="url(#shadow)"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className={styles.calendarSection}>
        <h3>{selectedDate.toDateString()}</h3>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={tileClassName}
          calendarType="gregory"
        />
      </div>
    </div>
  );
};

export default AgentAnalysis;
