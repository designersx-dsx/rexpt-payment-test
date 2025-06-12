import React from 'react';
import styles from "./CalInfo.module.css";

const CalInfo = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Getting started with Cal.com is easy! Follow these steps to set up your account and integrate it with your tools:</h1>
      {/* <h3>Getting started with Cal.com is easy! Follow these steps to set up your account and integrate it with your tools</h3> */}
      <div className={styles.step}>
        <h4 className={styles.stepTitle}>1. Click Here to start the <a href="https://refer.cal.com/designersx" target="_blank" rel="noopener noreferrer"> Cal.com 
        </a> Setup Process.</h4>


      </div>
      <div className={styles.step}>
        <h4 className={styles.stepTitle}>2. Start Here:</h4>
        <p>Find and click the <b>"Get Started"</b> button, usually located at the top-right of the page.
        </p>
        <img className={styles.image} src="/images/first.png" alt="cal step 1" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>3. Create Your Account:</h4>
        <h5 className={styles.stepTitle2}>Choose how you'd like to sign up:</h5>
        <p className={styles.stepSubtitle}>(a) Use your Google account:** Click "Continue With Google.</p>
        <p className={styles.stepSubtitle}>(b) Use your email address:** Click "Continue With Email" and follow the prompts.</p>
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>4. Set Up Your Profile:</h4>
        <p>(a) Your Details: Enter your <b>full name</b> and select your correct time zone.</p>
        <img className={styles.image} src="/images/Second.png" alt="cal step 2" />
        <p>(b) Connect Your Calendar: Link your <b>Google Calendar</b> so Cal.com knows when you're busy.</p>
        <img className={styles.image} src="/images/third.png" alt="cal step 3" />
        <p>Set Up Video Calls: Connect with <b>Google Meet</b> for easy online meetings.</p>
        <img className={styles.image} src="/images/Fourth.png" alt="cal step 4" />
        <p>(d) Tell Us When You're Available: Set the times you want to be bookable for events.</p>
        <p>(e) Finish Up: You can add more details about yourself now, or simply skip this part and finish setting up.</p>
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>5. Open settings (bottom-left corner)</h4>
        <p> Look for "Settings" in the bottom-left corner and click it.</p>

        <img className={styles.image} src="/images/fifth.png" alt="cal step 5" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>6. Find Your API Key (It's simpler than it sounds!):</h4>
        <p> In the settings menu, click on <b>"API Keys"</b>.</p>
        {/* <p>(b) Click the <b>"Add"</b> button to create a new key.</p> */}
        {/* <p>(c) Give your API key a name <b>(e.g., "Rexptin Connection")</b>.</p> */}
        {/* <p>(d) Important: Check the box next to "Never expires" and then click <b>"Save."</b></p> */}

        <img className={styles.image} src="/images/sixth.png" alt="cal step 6" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>7. Click the <b>"Add"</b> button to create a new key.</h4>
        <img className={styles.image} src="/images/seventh.png" alt="cal step 7" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>8. Give your API key a name <b>(e.g., "Rexptin Connection")</b>.</h4>
        <p> Important: Check the box next to "Never expires" and then click <b>"Save."</b></p>

        <img className={styles.image} src="/images/eight.png" alt="cal step 8" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>9. Copy Your Key:</h4>
        <p>Your new API key will appear. Click the "Copy" button next to it.</p>
        <img className={styles.image} src="/images/nine.png" alt="cal step 9" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>10. Paste into Rexpt Dashboard:</h4>
        <p>Go to your Rexpt dashboard.</p>
        <p>Find the place to paste your API key and do so.</p>
        <p>Click <b>"Submit."</b></p>

        <img className={styles.image} src="/images/ten.png" alt="cal step 10" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>11. Create Your First Event:</h4>
        <p>Enter a name for your event.</p>
        <p>Add a brief description of the event.</p>
        <p>Set how long the event will last (in minutes).</p>
        <p>Click <b>"Add Event."</b></p>

        <img className={styles.image} src="/images/eleven.png" alt="cal step 11" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>12. You're All Set!</h4>
        <p>Your event is now live and ready to be booked! You can see it in your Cal.com dashboard.</p>
      </div>
    </div>
  );
};

export default CalInfo;
