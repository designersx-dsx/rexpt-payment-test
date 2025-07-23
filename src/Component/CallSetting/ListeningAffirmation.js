import React, { useState, useEffect } from "react";
import styles from "./CallSetting.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../Store/apiStore";

export default function ListeningAffirmations() {
  const [enabled, setEnabled] = useState(true);
  const [frequency, setFrequency] = useState(0.7);
  const [affirmations, setAffirmations] = useState([
    "Yeah",
    "uh-huh",
    "Okay",
    "Got it",
  ]);
  const [backchannelWords, setBackchannelWords] = useState([]);
  const [isBackchannelEnabled, setIsBackchannelEnabled] = useState(false);

  useEffect(() => {
    const selectedAgentId = sessionStorage.getItem("SelectAgentId");

    if (selectedAgentId) {
      const fetchAgentDetails = async () => {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/agent/getAgent/${selectedAgentId}`
          );
          const {
            enable_backchannel,
            backchannel_frequency,
            backchannel_words,
          } = res.data;

          if (enable_backchannel) {
            setIsBackchannelEnabled(true);
            setEnabled(true);
            const mappedFrequency = Math.min(
              Math.max(backchannel_frequency, 0.1),
              1
            );
            setFrequency(mappedFrequency);
            const parsedWords = JSON.parse(backchannel_words || "[]");
            setBackchannelWords(parsedWords);
          } else {
            setIsBackchannelEnabled(false);
            setEnabled(false);
          }
        } catch (error) {
          console.error("Error fetching agent details:", error);
        }
      };

      fetchAgentDetails();
    }
  }, []);

  return (
    <div>
      <div className={styles.toggleRow}>
        <label className={styles.label}>Listening Affirmations</label>
        <label
          className={styles.switch}
        >
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
            disabled
             style={{
                    cursor: "not-allowed",
                    pointerEvents: "none",
                  }} 
          />
          <span className={styles.slider}></span>
        </label>
      </div>
      <p className={styles.description}>
        Enables the agent to use affirmations like 'yeah' or 'uh-huh' during
        conversations, indicating active listening and engagement.
      </p>

      {enabled && (
        <div className={styles.sliderTop}>
          <div className={styles.sliderContainer}>
            <label className={styles.sliderLabel}>Affirmations Frequency</label>
            <div className={styles.sliderWrapper}>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className={styles.sliderRange}
                style={{
                  background: `linear-gradient(to right, #693bff ${
                    frequency * 100
                  }%, #fff ${frequency * 100}%)`,
                  cursor: "not-allowed",
                    pointerEvents: "none",
                }}
                disabled={!isBackchannelEnabled}
              />
              <span className={styles.sliderValue}>{frequency.toFixed(1)}</span>
            </div>
          </div>

          <div className={styles.wordsContainer}>
            <label className={styles.wordsLabel}>Affirmations Words</label>
            <div className={styles.wordsList}>
              {Array.isArray(backchannelWords) &&
                backchannelWords.map((word) => (
                  <div key={word} className={styles.word}>
                    {word}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
