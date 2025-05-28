import React, { useState, useEffect } from 'react';
import styles from './AgentAnalysis.module.css';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getCurrentWeekBookingDates } from '../../../Store/apiStore';

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
    // Generate next 7 days
    const tempDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      tempDates.push(d);
    }
    setDates(tempDates);
    async function fetchBookingDates() {
      try {
        const data = await getCurrentWeekBookingDates();
        setBookingDates(data.bookingDates || []);
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

              // Apply classes based on booking and selection
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
