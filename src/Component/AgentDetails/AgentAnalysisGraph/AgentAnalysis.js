import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./AgentAnalysis.module.css";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Helper function to format date
function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Helper function to format time
function formatTime(isoDate) {
  const date = new Date(isoDate);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}

const AgentAnalysis = ({ data, calApiKey }) => {
  const callVolume = data?.reduce((acc, day) => acc + day.calls, 0);
  const [bookingDates, setBookingDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingsForSelectedDate, setBookingsForSelectedDate] = useState([]);
  const bookingsRef = useRef(null); 

  useEffect(() => {
    async function fetchBookingDates() {
      try {
        if (!calApiKey) {
          console.warn("No Cal API Key provided to AgentAnalysis");
          return;
        }

        const response = await fetch(
          `https://api.cal.com/v1/bookings?apiKey=${encodeURIComponent(calApiKey)}`
        );
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const bookingsData = await response.json();
        const bookingsMap = {}; 
        bookingsData.bookings?.forEach((booking) => {
          if (booking.startTime) {
            const date = new Date(booking.startTime);
            const formattedDate = formatDateISO(date);
            if (!bookingsMap[formattedDate]) {
              bookingsMap[formattedDate] = [];
            }
            bookingsMap[formattedDate].push(booking); 
          }
        });

        setBookingDates(bookingsMap);
        setBookingsForSelectedDate(bookingsMap[formatDateISO(selectedDate)] || []);
      } catch (error) {
        console.error("Failed to fetch booking dates:", error);
      }
    }

    fetchBookingDates();
  }, [calApiKey, selectedDate]);

  const handleDateClick = (date) => {
    setSelectedDate(date); // Set the selected date
    setBookingsForSelectedDate(bookingDates[formatDateISO(date)] || []);
    // Scroll to the bookings list after selecting a date
    if (bookingsRef.current) {
      bookingsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateStr = formatDateISO(date);
      const bookingsCount = bookingDates[dateStr] ? bookingDates[dateStr].length : 0;
      if (bookingsCount > 0) {
        const dots = [];
        for (let i = 0; i < bookingsCount; i++) {
          dots.push(
            <div key={i} className={`${styles.bookingDot} ${bookingsCount === 2 ? styles.two : bookingsCount === 3 ? styles.three : ""}`}></div>
          );
        }
        return <div className={styles.bookingDotContainer}>{dots}</div>;
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
        {/* <div className={styles.trend}>
          Last 7 Days <span className={styles.positive}>+15%</span>
        </div> */}
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
            filter="url(#shadow)"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className={styles.calendarSection}>
        <h1>{selectedDate.toDateString()}</h1>
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
          <h3>Bookings for {selectedDate.toDateString()}:</h3>
          <ul>
            {bookingsForSelectedDate.map((booking, index) => (
              <li key={index} className={styles.bookingCard}>
                <div className={styles.bookingCard}>
                  <div className={styles.time}>
                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </div>
                  <div className={styles.title}>
                    {booking.title}
                  </div>
                  <div className={styles.status}>
                    {booking.status === "ACCEPTED" ? "Accepted" : "Pending"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AgentAnalysis;
