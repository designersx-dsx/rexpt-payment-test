import React, { useEffect, useState } from "react";
import styles from "../Card2/Card2.module.css";

const Card2 = ({ agentKnowledge }) => {
  const [agentDetails, setAgentDetails] = useState("");
  useEffect(() => {
  setAgentDetails(agentKnowledge)
  }, [agentKnowledge]);

  if (!agentDetails) {
    return (
      <div className={styles.CardMain}>
        <p>Loading agent details...</p>
      </div>
    );
  }
   function formatBusinessName(name) {
  if (!name) return "";

  if (name.length > 30) {
    return name.substring(0, 30) + "...";
  }

  return name;
}

  const parsedKnowledge=agentDetails?.business?.knowledge_base_texts
  return (
    <div className={styles.CardMain}>
      <h2 className={styles.title}>Knowledge Base</h2>
      <div className={styles.MoreDetails}>
        <h3>More Details</h3>

        <div className={styles.details}>
          <p className={styles.Ptext}>Google My Business</p>
          <div className={styles.rightpart}>
            <strong>{formatBusinessName(parsedKnowledge?.name || agentDetails.business?.googleBusinessName||agentDetails?.business?.businessName)||"Not Available"}</strong>
          </div>
        </div>

        <div className={styles.details}>
          <p className={styles.Ptext}>Phone Number</p>
          <div className={styles.rightpart}>
            <strong>{parsedKnowledge?.phone || "Not Available"}</strong>
          </div>
        </div>

        <div className={styles.details}>
          <p className={styles.Ptext}>Address </p>
          <div className={styles.rightpart}>
            <strong>
              {parsedKnowledge?.address1 || parsedKnowledge?.address || "Not Available"}
            </strong>
          </div>
        </div>

        <div className={styles.details}>
          <p className={styles.Ptext}>Email</p>
          <div className={styles.rightpart}>
            <strong>{parsedKnowledge?.email || "Not Available"}</strong>
          </div>
        </div>

        {/* <div className={styles.details}>
          <p className={styles.Ptext}>Address 2</p>
          <div className={styles.rightpart}>
            <strong>{business.address2 || "NA"}</strong>
          </div>
        </div> */}

        <div className={styles.About}>
          <h3>About My business</h3>
          <p>
            <strong>
              {parsedKnowledge?.aboutBusiness ||
                parsedKnowledge?.aboutBussiness ||
                "No description available"}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card2;
