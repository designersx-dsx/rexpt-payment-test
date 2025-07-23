import React, { useState, useEffect } from "react";
import styles from "./CallSetting.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../Store/apiStore";

export default function ListeningAffirmations() {
  const [interruptionSensitivity, setInterruptionSensitivity] = useState(0.7);
  const [responsiveness, setResponsiveness] = useState(2.5);

  // Fetch agent details from API
  useEffect(() => {
    const selectedAgentId = sessionStorage.getItem("SelectAgentId");

    if (selectedAgentId) {
      const fetchAgentDetails = async () => {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/agent/getAgent/${selectedAgentId}`
          );
          console.log("Fetched agent details:", res.data);
          const { interruption_sensitivity, responsiveness } = res.data;
          setInterruptionSensitivity(interruption_sensitivity || 0.7);
          setResponsiveness(responsiveness || 2.5);
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
              min="0.1"
              max="1"
              step="0.1"
              value={interruptionSensitivity}
              onChange={(e) =>
                setInterruptionSensitivity(parseFloat(e.target.value))
              }
              className={styles.sliderRange}
              style={{
                background: `linear-gradient(to right, #693bff ${
                  interruptionSensitivity * 100
                }%, #fff ${interruptionSensitivity * 100}%)`,
                cursor: "not-allowed",
                pointerEvents: "none",
              }}
            />
            <span className={styles.sliderValue}>
              {interruptionSensitivity.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* 2 */}
      <div className={` ${styles.toggleRow} ${styles.toggleRow1} `}>
        <label className={styles.label}>Responsiveness</label>
      </div>
      <p className={styles.description}>
        Control how fast the agent responds after users finish speaking.{" "}
      </p>

      <div className={styles.sliderTop}>
        <div className={styles.sliderContainer}>
          <label className={styles.sliderLabel}>Interruption Sensitivity</label>
          <div className={styles.sliderWrapper}>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={responsiveness}
              onChange={(e) => setResponsiveness(parseFloat(e.target.value))}
              className={styles.sliderRange}
              style={{
                background: `linear-gradient(to right, #693bff ${
                  ((responsiveness - 0.5) / 4.5) * 100
                }%, #fff ${((responsiveness - 0.5) / 4.5) * 100}%)`,
                cursor: "not-allowed",
                pointerEvents: "none",
              }}
            />
            <span className={styles.sliderValue}>
              {responsiveness.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
