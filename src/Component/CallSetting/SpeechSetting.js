import React, { useState } from "react";
import styles from "./CallSetting.module.css";

export default function ListeningAffirmations() {
  const [enabled, setEnabled] = useState(true);
  const [frequency, setFrequency] = useState(0.7);
  const [frequency1, setFrequency1] = useState(0.2);
  const [affirmations, setAffirmations] = useState(["Yeah", "uh-huh", "Okay", "Got it"]);

  const removeAffirmation = (word) => {
    setAffirmations(affirmations.filter((w) => w !== word));
  };

  return (
    <div>
      <div className={styles.toggleRow}>
        <label className={styles.label}>Interruption Sensitivity</label>
        
        
      </div>
      <p className={styles.description}>
        Control how sensitively AI can be interrupted by human speech.
      </p>


     
  <div className={styles.sliderTop}>
    <div className={styles.sliderContainer}>
      <label className={styles.sliderLabel}>Interruption Sensitivity</label>
      <div className={styles.sliderWrapper}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={frequency}
          onChange={(e) => setFrequency(parseFloat(e.target.value))}
          className={styles.sliderRange}
          style={{
            background: `linear-gradient(to right, #693bff ${frequency * 100}%, #fff ${frequency * 100}%)`
          }}
        />
        <span className={styles.sliderValue}>{frequency.toFixed(1)}</span>
      </div>
    </div>

    
  </div>

{/* 2 */}
   <div className={` ${styles.toggleRow} ${styles.toggleRow1} `}>
        <label className={styles.label}>Responsiveness</label>
        
        
      </div>
      <p className={styles.description}>
Control how fast the agent responds after users finish speaking.      </p>


     
  <div className={styles.sliderTop}>
    <div className={styles.sliderContainer}>
      <label className={styles.sliderLabel}>Interruption Sensitivity</label>
      <div className={styles.sliderWrapper}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={frequency1}
          onChange={(e) => setFrequency1(parseFloat(e.target.value))}
          className={styles.sliderRange}
          style={{
            background: `linear-gradient(to right, #693bff ${frequency1 * 100}%, #fff ${frequency1 * 100}%)`
          }}
        />
        <span className={styles.sliderValue}>{frequency1.toFixed(1)}</span>
      </div>
    </div>

    
  </div>


       </div>
       
       
    
  );
}