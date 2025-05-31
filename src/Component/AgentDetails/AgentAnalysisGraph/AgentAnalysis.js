import React, { useState, useEffect } from 'react';
import styles from './AgentAnalysis.module.css';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', value: 80 },
  { name: 'Tue', value: 60 },
  { name: 'Wed', value: 75 },
  { name: 'Thu', value: 65 },
  { name: 'Fri', value: 30 },
  { name: 'Sat', value: 100 },
  { name: 'Sun', value: 70 }
];

const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weekDaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const AgentAnalysis = () => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [dates, setDates] = useState([]);
  const [bookingDates, setBookingDates] = useState([]);

  useEffect(() => {
    // Generate next 30 days starting today
    const tempDates = [];
    for (let i = 0; i < 28; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      tempDates.push(d);
    }
    setDates(tempDates);

    async function fetchBookingDates() {
      try {
        // Get calApiKey from localStorage agents array (adjust key name if different)
        const agents = JSON.parse(localStorage.getItem('agents')) || [];
        const agentWithCalKey = agents.find(agent => agent.calApiKey);
        if (!agentWithCalKey) {
          console.warn('No Cal API Key found in localStorage agents');
          return;
        }
        const calApiKey = agentWithCalKey.calApiKey;

        // Fetch bookings from Cal API
        const response = await fetch(`https://api.cal.com/v1/bookings?apiKey=${encodeURIComponent(calApiKey)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings from Cal API');
        }
        const bookingsData = await response.json();

        // Extract startTime from each booking and convert to 'YYYY-MM-DD' format
        const bookings = bookingsData.bookings || [];
        const datesSet = new Set();
        bookings.forEach(booking => {
          if (booking.startTime) {
            const startDateOnly = new Date(booking.startTime).toISOString().slice(0, 10);
            datesSet.add(startDateOnly);
          }
        });

        setBookingDates(Array.from(datesSet));
      } catch (error) {
        console.error('Failed to fetch booking dates:', error);
      }
    }

    fetchBookingDates();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.CallFlex}>
        <div className={styles.callVolume}>
          120 <span>Call Volume</span>
        </div>
        <div className={styles.trend}>
          Last 7 Days <span className={styles.positive}>+15%</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data}>
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6A0DAD" floodOpacity="0.4" />
            </filter>
          </defs>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
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

      {dates.length > 0 && (
        <div className={styles.daySection}>
          <div className={styles.dayLabel}>{fullDays[dates[selectedDateIndex].getDay()]}</div>
          <div className={styles.date}>
            {dates[selectedDateIndex].getDate()} {fullDays[dates[selectedDateIndex].getDay()]} {dates[selectedDateIndex].getFullYear()}
          </div>
          <div className={styles.calendar}>
            {dates.map((date, index) => {
              const dateStr = formatDateISO(date);
              const hasBooking = bookingDates.includes(dateStr);
              const isSelected = index === selectedDateIndex;

              // Decide CSS class based on booking and selection
              const className = isSelected
                ? styles.selectedDate
                : hasBooking
                ? styles.hasBooking
                : styles.dateBox;

              return (
                <div
                  key={index}
                  className={className}
                  onClick={() => setSelectedDateIndex(index)}
                  title={hasBooking ? "Booking Exists" : ""}
                >
                  <div className={styles.dayName}>{weekDaysShort[date.getDay()]}</div>
                  <div className={styles.dateName}>{date.getDate()}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentAnalysis;
