import React, { useEffect, useState } from "react";
import styles from "./Thankyou.module.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../Store/apiStore";


function Thankyou() {
  const navigate = useNavigate();
  const { id: key } = useParams(); // 'create' or 'update'
  const location = useLocation();

  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [message, setMessage] = useState("");

  // Get query params
  const getQueryParam = (name) =>
    new URLSearchParams(location.search).get(name);

  const subscriptionId = getQueryParam("subscriptionId");
  const agentId = getQueryParam("agentId");
  const userId = getQueryParam("userId");
  const subsid = getQueryParam("subscriptionId"); // 👈 Old subscription to cancel

  const currentLocation = "/update";

  const cancelOldSubscription = async () => {
    try {

      const res = await fetch(`${API_BASE_URL}/cancel-subscription`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: subsid }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(
          "❌ Failed to cancel subscription:",
          result.error || result.message
        );
      } else {
        console.log("✅ Old subscription cancelled:", result);
      }
    } catch (error) {
      console.error("❌ Error cancelling subscription:", error);
    }
  };

  const callNextApiAndRedirect = async () => {
    console.log("Calling updateFreeAgent API with:", { userId, agentId });

    try {
      const res = await fetch(

        `${API_BASE_URL}/agent/updateFreeAgent`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, agentId }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setPopupType("success");
        setPopupMessage("Agent upgraded successfully!");

        // Cancel old subscription after upgrade
        if (subsid) {
          await cancelOldSubscription();
        }

        setTimeout(() => {
          navigate("/dashboard", {
            state: { currentLocation },
          });
        }, 2000);
      } else {
        setPopupType("failed");
        setPopupMessage("Error completing subscription.");
      }
    } catch (error) {
      console.error("❌ API call failed:", error);
      setPopupType("failed");
      setPopupMessage("Error completing subscription.");
    }
  };

             

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>🎉 Thank You!</h1>
        {/* <p className={styles.subtext}>Redirecting for agent creation...</p> */}
        {popupMessage && <p className={styles.popup}>{popupMessage}</p>}
      </div>
    </div>
  );
}

export default Thankyou;
