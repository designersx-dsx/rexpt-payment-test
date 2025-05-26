import React, { useState } from 'react';
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
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dates = ['01', '02', '03', '04', '05', '06', '07'];

const AgentAnalysis = () => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(3);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Agent Analysis</h1>
      <div className={styles.CallFlex}>
      <div className={styles.callVolume}>120 <span>Call Volume</span></div>
      <div className={styles.trend}>Last 7 Days <span className={styles.positive}>+15%</span></div>
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

      <div className={styles.daySection}>
        <div className={styles.dayLabel}>{fullDays[selectedDateIndex]}</div>
        <div className={styles.date}>{dates[selectedDateIndex]} {fullDays[selectedDateIndex]} 2025</div>
        <div className={styles.calendar}>
          {dates.map((date, index) => (
            <div
              key={index}
              className={index === selectedDateIndex ? styles.selectedDate : styles.dateBox}
              onClick={() => setSelectedDateIndex(index)}>
              <div className={styles.dayName}>{weekDays[index]}</div>
              <div className={styles.dateName}>{date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentAnalysis;
