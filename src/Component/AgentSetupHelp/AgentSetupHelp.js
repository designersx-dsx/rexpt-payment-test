import React, { useEffect, useState } from 'react';
import styles from './AgentSetupHelp.module.css';

import EditHeader from "../EditHeader/EditHeader" 
import AnimatedButton from '../AnimatedButton/AnimatedButton';

const agents = ['Create New', 'Agent 1', 'Agent 2'];
const timeSlots = ['01:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

function getNext7Days() {
  const days = [];
  const options = { weekday: 'short' };

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      date,
      label: date.toLocaleDateString(undefined, { day: '2-digit' }),
      day: date.toLocaleDateString(undefined, options),
    });
  }
  return days;
}

export default function AppointmentScheduler() {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [days, setDays] = useState([]);

  useEffect(() => {
    const upcomingDays = getNext7Days();
    setDays(upcomingDays);
    setSelectedDate(upcomingDays[0].date); // Select today by default
  }, []);

  const handleSubmit = () => {
    if (!selectedAgent || !businessName || !businessCategory || !selectedDate || !selectedTime) {
      alert('Please fill out all fields and select date/time.');
      return;
    }

    const selectedInfo = {
      agent: selectedAgent,
      businessName,
      businessCategory,
      date: selectedDate.toDateString(),
      time: selectedTime,
    };

    console.log('Form Submitted:', selectedInfo);
    alert('Call scheduled successfully!');
  };

  return (
    <div>

<EditHeader title="Agent Setup" />

    <div className={styles.container}>

      <label className={styles.label}>Select Agent</label>
      <div className={styles.selectedValue} >
       <select class={styles.agentSelect1}>
      <option value="all">All</option>
      <option value="">Anthony</option>
      <option value="">Bhhh</option>
      <option value="">Shivam</option>
      <option value="">Samad</option>
      <option value="">Billy</option>
      <option value="">Lily</option>
      </select></div>

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
          <span className={styles.dateHeading}>JULY, {new Date().getFullYear()}</span>
        </div>
        <div className={styles.dayList}>
          {days.map((dayObj, index) => (
            <div
              key={index}
              className={`${styles.dayItem} ${selectedDate?.toDateString() === dayObj.date.toDateString() ? styles.selectedDay : ''}`}
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
              className={`${styles.timeButton} ${selectedTime === slot ? styles.selectedTime : ''}`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

   <AnimatedButton label="Submit"/>
    </div>
    </div>
  );
}
