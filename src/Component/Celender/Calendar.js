import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import HeaderBar from '../HeaderBar/HeaderBar';
import "react-calendar/dist/Calendar.css";
import styles from "./Clender.module.css";
import Footer2 from "../AgentDetails/Footer/Footer2";
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
  const bookingsRef = useRef(null); // Ref for booking details section

  useEffect(() => {
    const bookingsMap = {

      "2025-06-27": [
        {
          type: "meeting",
          title: "Team toor",
          startTime: "2025-06-27T10:00:00Z",
          endTime: "2025-06-27T11:00:00Z",
          status: "ACCEPTED"
        }
      ],

      "2025-06-28": [
        {
          type: "meeting",
          title: "Team Sync",
          startTime: "2025-06-28T10:00:00Z",
          endTime: "2025-06-28T11:00:00Z",
          status: "ACCEPTED"
        }
      ],
      "2025-06-29": [
        {
          type: "meeting",
          title: "Project Kickoff",
          startTime: "2025-06-29T09:00:00Z",
          endTime: "2025-06-29T10:00:00Z",
          status: "ACCEPTED"
        },
        {
          type: "call",
          title: "Client Call",
          startTime: "2025-06-29T11:30:00Z",
          endTime: "2025-06-29T12:00:00Z",
          status: "ACCEPTED"
        }


      ]
    };

    setBookingDates(bookingsMap);
    setBookingsForSelectedDate(bookingsMap[formatDateISO(selectedDate)] || []);
  }, [selectedDate]);



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
      const bookings = bookingDates[dateStr] || [];

      const hasMeeting = bookings.some(b => b.type === "meeting");
      const hasCall = bookings.some(b => b.type === "call");

      const dots = [];
      if (hasCall) {
        dots.push(<div key="call" className={`${styles.dot} ${styles.orangeDot}`} />);
      }
      if (hasMeeting) {
        dots.push(<div key="meeting" className={`${styles.dot} ${styles.greenDot}`} />);
      }

      return <div className={styles.bookingDotContainer}>{dots}</div>;
    }

    return null;
  };



  return (

    <div className={styles.container}>
      <HeaderBar title="Calendar" />

      <div className={styles.calendarSection}>

        <div className={styles.DotINfo}>
          <div className={styles.DotOrange}>
            <div className={styles.dot1} ></div>
            <span>Call Received</span>


          </div>
          <hr></hr>
          <div className={styles.DotGreen}>
            <div className={styles.dot} ></div>
            <span>Meeting Booked</span>


          </div>

        </div>



        {/* <h1>{selectedDate.toDateString()}</h1> */}
        <Calendar
          onChange={handleDateClick}
          value={selectedDate}
          tileContent={tileContent} // Insert the dots
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
                booking.type === "meeting" || booking.title?.toLowerCase().includes("development");
              const isCall =
                booking.type === "call" || booking.title?.toLowerCase().includes("issue");

              const dotColorClass = isMeeting
                ? styles.greenBar
                : isCall
                  ? styles.orangeBar
                  : styles.grayBar;

              return (
                <li key={index} className={styles.bookingItem}>
                  <div className={styles.timeColumn}>
                    <span className={styles.timeLabel}>{formatTime(booking.startTime)}</span>
                  </div>
                  <span className={`${styles.verticalBar} ${dotColorClass}`}></span>
                  <div className={styles.detailColumn}>
                    <div className={styles.line}>
                      <span className={styles.titleText}>{booking.title}</span>
                    </div>
                    <div className={styles.timeRange}>
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </div>
                    {/* <div className={styles.statusText}>
                {booking.status === "ACCEPTED" ? "Accepted" : "Pending"}
              </div> */}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
<Footer2/>
    </div>
  );
};

export default AgentAnalysis;