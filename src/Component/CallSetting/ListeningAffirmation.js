import React, { useState } from "react";
import styles from "./CallSetting.module.css";

export default function ListeningAffirmations() {
  const [enabled, setEnabled] = useState(true);
  const [frequency, setFrequency] = useState(0.7);
  const [affirmations, setAffirmations] = useState(["Yeah", "uh-huh", "Okay", "Got it"]);

  const removeAffirmation = (word) => {
    setAffirmations(affirmations.filter((w) => w !== word));
  };

  return (
    <div>
      <div className={styles.toggleRow}>
        <label className={styles.label}>Listening Affirmations</label>
         <label className={styles.switch}>
    <input
      type="checkbox"
      checked={enabled}
      onChange={() => setEnabled(!enabled)}
    />
    <span className={styles.slider}></span>
  </label>
        
      </div>
      <p className={styles.description}>
        Enables the agent to use affirmations like 'yeah' or 'uh-huh' during conversations, indicating
        active listening and engagement.
      </p>

     {enabled && (
  <div className={styles.sliderTop}>
    <div className={styles.sliderContainer}>
      <label className={styles.sliderLabel}>Affirmations Frequency</label>
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

    <div className={styles.wordsContainer}>
      <label className={styles.wordsLabel}>
        Affirmations Words
        <button className={styles.addButton}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 0.125C7.47462 0.125 7.85938 0.509755 7.85938 0.984375V6.14062H13.0156C13.4902 6.14062 13.875 6.52538 13.875 7C13.875 7.47462 13.4902 7.85938 13.0156 7.85938H7.85938V13.0156C7.85938 13.4902 7.47462 13.875 7 13.875C6.52538 13.875 6.14062 13.4902 6.14062 13.0156V7.85938H0.984375C0.509755 7.85938 0.125 7.47462 0.125 7C0.125 6.52538 0.509755 6.14062 0.984375 6.14062H6.14062V0.984375C6.14062 0.509755 6.52538 0.125 7 0.125Z"
              fill="white"
            />
          </svg>
        </button>
      </label>
      <div className={styles.wordsList}>
        {affirmations.map((word) => (
          <div key={word} className={styles.word}>
            {word}
            <button className={styles.removeButton} onClick={() => removeAffirmation(word)}>
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.88695 10.0662C9.57678 10.3763 9.07389 10.3763 8.76372 10.0662L5.39402 6.69648L2.02431 10.0662C1.71414 10.3763 1.21125 10.3763 0.901081 10.0662C0.590909 9.756 0.590908 9.25312 0.901081 8.94294L4.27078 5.57324L0.901081 2.20354C0.590908 1.89337 0.590909 1.39048 0.901081 1.08031C1.21125 0.770136 1.71414 0.770135 2.02431 1.08031L5.39402 4.45001L8.76372 1.08031C9.07389 0.770136 9.57678 0.770136 9.88695 1.08031C10.1971 1.39048 10.1971 1.89337 9.88695 2.20354L6.51725 5.57324L9.88695 8.94294C10.1971 9.25311 10.1971 9.756 9.88695 10.0662Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

       </div>
       
       
    
  );
}