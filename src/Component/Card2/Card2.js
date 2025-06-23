import React, { useEffect, useState } from "react";
import styles from "../Card2/Card2.module.css";

const Card2 = ({ agentKnowledge }) => {
  const [agentDetails, setAgentDetails] = useState("");
  console.log(agentDetails)
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

  const parsedKnowledge=agentDetails?.knowledge_base_texts
console.log(parsedKnowledge,"parsedKnowledge")
  return (
    <div className={styles.CardMain}>
      <h2 className={styles.title}>Knowledge Base</h2>
      <div className={styles.MoreDetails}>
        <h3>More Details</h3>

        <div className={styles.details}>
          <p className={styles.Ptext}>Google My Business</p>
          <div className={styles.rightpart}>
            <strong>{parsedKnowledge?.name || agentDetails.business?.googleBusinessName||agentDetails?.businessName||"NA"}</strong>
          </div>
        </div>

        <div className={styles.details}>
          <p className={styles.Ptext}>Phone Number</p>
          <div className={styles.rightpart}>
            <strong>{parsedKnowledge?.phone || "NA"}</strong>
          </div>
        </div>

        <div className={styles.details}>
          <p className={styles.Ptext}>Address </p>
          <div className={styles.rightpart}>
            <strong>
              {parsedKnowledge?.address1 || parsedKnowledge?.address || "NA"}
            </strong>
          </div>
        </div>

        <div className={styles.details}>
          <p className={styles.Ptext}>Email</p>
          <div className={styles.rightpart}>
            <strong>{parsedKnowledge?.email || "NA"}</strong>
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
