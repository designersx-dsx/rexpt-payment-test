import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import HeaderBar from "../HeaderBar/HeaderBar";
import "react-calendar/dist/Calendar.css";
import styles from "./Clender.module.css";
import Footer2 from "../AgentDetails/Footer/Footer2";

// Helper: Format date as YYYY-MM-DD
function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Helper: Format time as HH:MM
function formatTime(isoDate) {
  const date = new Date(isoDate);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

const AgentAnalysis = () => {
  const [calApiKey, setCalApiKey] = useState(null);
  const [bookingDates, setBookingDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingsForSelectedDate, setBookingsForSelectedDate] = useState([]);
  const bookingsRef = useRef(null);

  // Load calApiKey from sessionStorage
  useEffect(() => {
    const sessionData = sessionStorage.getItem("dashboard-session-storage");

    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        const agents = parsed?.state?.agents || [];

        // Pick the first agent with a calApiKey
        const foundKey = agents.find((a) => a.calApiKey)?.calApiKey;

        if (foundKey) {
          setCalApiKey(foundKey);
        } else {
          console.warn("No calApiKey found in agents list.");
        }
      } catch (e) {
        console.error("Failed to parse session storage:", e);
      }
    } else {
      console.warn("No 'dashboard-session-storage' found in sessionStorage.");
    }
  }, []);

  // Fetch bookings when calApiKey or selectedDate changes
  useEffect(() => {
    async function fetchBookingDates() {
      if (!calApiKey) return;

      try {
        const response = await fetch(
          `https://api.cal.com/v1/bookings?apiKey=${encodeURIComponent(calApiKey)}`
        );

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`Failed to fetch bookings: ${err}`);
        }

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

  // Handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setBookingsForSelectedDate(bookingDates[formatDateISO(date)] || []);
    if (bookingsRef.current) {
      bookingsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Render booking indicators in calendar
 const tileContent = ({ date, view }) => {
  if (view !== "month") return null;

  const dateStr = formatDateISO(date);
  const bookings = bookingDates[dateStr] || [];

  if (bookings.length > 0) {
    return (
      <div className={styles.bookingDotContainer}>
        <div className={`${styles.dot} ${styles.greenDot}`} />
      </div>
    );
  }

  return null;
};


  return (
    <div className={styles.container}>
      <HeaderBar title="Calendar" />

      <div className={styles.calendarSection}>
        <div className={styles.DotINfo}>
          <div className={styles.DotOrange}>
            <div className={styles.dot1}></div>
            <span>Call Received</span>
          </div>
          <hr />
          <div className={styles.DotGreen}>
            <div className={styles.dot}></div>
            <span>Meeting Booked</span>
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
          <h3>Bookings for {selectedDate.toDateString()}:</h3>
          <ul>
            {bookingsForSelectedDate.map((booking, index) => {
              const isMeeting =
                booking.type === "meeting" ||
                booking.title?.toLowerCase().includes("meeting");
              const isCall =
                booking.type === "call" ||
                booking.title?.toLowerCase().includes("call");

              const dotColorClass = isMeeting
                ? styles.greenBar
                : isCall
                ? styles.orangeBar
                : styles.grayBar;

              return (
                <li key={index} className={styles.bookingItem}>
                  <div className={styles.timeColumn}>
                    <span className={styles.timeLabel}>
                      {formatTime(booking.startTime)}
                    </span>
                  </div>
                  <span className={`${styles.verticalBar} ${dotColorClass}`}></span>
                  <div className={styles.detailColumn}>
                    <div className={styles.line}>
                      <span className={styles.titleText}>{booking.title}</span>
                    </div>
                    <div className={styles.timeRange}>
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
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
