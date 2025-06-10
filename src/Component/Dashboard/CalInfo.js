import React from 'react';
import styles from "./CalInfo.module.css";

const CalInfo = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Instructions to Connect with Cal</h1>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>1. Click on “Get Started” (top-right corner)</h4>
        <img className={styles.image} src="/images/first.png" alt="cal step 1" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>2. Choose an option and create your account</h4>
        <p className={styles.stepSubtitle}>(a) Continue With Google</p>
        <p className={styles.stepSubtitle}>(b) Continue With Email</p>
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>3. Setup your profile</h4>
        <p>(a) Enter your full name and select timezone</p>
        <img className={styles.image} src="/images/Second.png" alt="cal step 2" />
        <p>(b) Connect with Google Calendar</p>
        <img className={styles.image} src="/images/third.png" alt="cal step 3" />
        <p>(c) Connect with Google Meet</p>
        <img className={styles.image} src="/images/Fourth.png" alt="cal step 4" />
        <p>(d) Set your availability</p>
        <p>(e) Optionally, add information about yourself or skip and finish</p>
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>4. Open settings (bottom-left corner)</h4>
        <img className={styles.image} src="/images/fifth.png" alt="cal step 5" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>5. Click on “API Keys”</h4>
        <img className={styles.image} src="/images/sixth.png" alt="cal step 6" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>6. Click the “Add” button</h4>
        <img className={styles.image} src="/images/seventh.png" alt="cal step 7" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>7. Enter an API key name</h4>
        <p>Check “Never expires” and click save</p>
        <img className={styles.image} src="/images/eight.png" alt="cal step 8" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>8. Copy your API key</h4>
        <img className={styles.image} src="/images/nine.png" alt="cal step 9" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>9. Paste the key in Rexpt dashboard & click Submit</h4>
        <img className={styles.image} src="/images/ten.png" alt="cal step 10" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>10. Create your event</h4>
        <p>Enter event name, description, and duration (in minutes). Click “Add Event”.</p>
        <img className={styles.image} src="/images/eleven.png" alt="cal step 11" />
      </div>

      <div className={styles.step}>
        <h4 className={styles.stepTitle}>11. Your event is now live!</h4>
        <p>You can now view it in your Cal dashboard.</p>
      </div>
    </div>
  );
};

export default CalInfo;
