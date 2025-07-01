import React, { useState } from 'react';
import styles from './CalendarConnect.module.css';
import HeaderBar from '../HeaderBar/HeaderBar';

const CalendarConnect = () => {
  const [hasCalAccount, setHasCalAccount] = useState(true);
  const [enabled, setEnabled] = useState(true);
 const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle the API key submission logic here
    alert(`API Key submitted: ${apiKey}`);
  };
  return (
    <div>
  <HeaderBar title="Connect Calendar" />
    <div className={styles.container}>



      <p className={styles.TopPara}>
        You can easily <strong>Connect your personal or business Calendar</strong> with your{' '}
        <a href="#">Rexptin Agent</a> to receive calendar Meetings.
      </p>

      <div className={styles.supportSection}>
        {/* <p>We Support</p> */}
        <div className={styles.icons}>
          <img src="/images/CalcSupport.png" alt="Outlook" />
        </div>
        <p className={styles.apiNote}>via Cal.com API Key Integration</p>
      </div>

      <div className={styles.toggleSection}>
        <label>
          I have <a href="#">Cal.com Account</a> to connect
        </label>


        <label className={styles.switch}>
  <input
    type="checkbox"
    checked={enabled}
    onChange={() => setEnabled(!enabled)}
  />
  <span className={styles.slider}></span>
</label>
 </div>

{enabled && (
  <div className={styles.ONSwitch}>
    <form onSubmit={handleSubmit}>
        <div className={styles.labelRow}>
          <label htmlFor="apiKey">Enter your API Key below:</label>
          <a href="https://app.cal.com/settings/developer/api-keys" className={styles.link}>Where is my Key?</a>
        </div>

        <input
          type="text"
          id="apiKey"
          placeholder="Cal.com API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className={styles.input}
        />

        <p className={styles.description}>
          We will use your <strong>API Key</strong>, to create a custom meeting in your Cal.com profile for your agent to book meetings for you.
        </p>

        <button  type="submit" className={styles.submitButton}>
          <img src='/svg/CalSubmit.svg'/>
        </button>
      </form>

      <div className={styles.helpLink}>
        <a href="#">Need Help to Find the API Key?</a>
      </div>
  </div>
)}


     

 {!enabled && (
<div className={styles.offSwitch}>
    
  <a href='https://cal.com/?via=designersx&dub_id=kTPL5nvpvLqoLhE2'>    <div className={styles.recommendation}>
        <img  src="/images/CalCOm.png"/>
      </div>
      </a>
        <p className={styles.patnerCal}>
          We have partnered with <strong>Cal.com</strong> to connect all your calendars to your AI
          Receptionist’s smooth operations.
        </p> 

      {/* <hr /> */}

      <div className={styles.guideSection}>
        <p>
          <strong><a href="#">Why Cal.com Account</a></strong> for Calendar Connection?
        </p>

        <button className={styles.guideButton}>
            <div>
          <h6>Guide to Connect</h6>
          
          <p className={styles.paraTest}>your agent to Cal.com Account</p>
          </div>
          <div className={styles.playIcon}>
            {/* <img src='/images/PlayBox.png'/> */}
 <svg width="55" height="55" viewBox="0 0 67 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="2" width="65" height="65" rx="16" fill="#5F33E1"/>
<path d="M25.1855 21.8388C25.1855 16.4934 31.6484 13.8164 35.4282 17.5962L46.1284 28.2964C48.4716 30.6396 48.4716 34.4385 46.1284 36.7817L35.4282 47.4819C31.6484 51.2617 25.1855 48.5847 25.1855 43.2393V32.5391V21.8388Z" fill="#E0E5F2"/>
</svg>


            </div>
          
        </button>
      </div>
    </div>
     )}
    </div>
    </div>
  );
};

export default CalendarConnect;
