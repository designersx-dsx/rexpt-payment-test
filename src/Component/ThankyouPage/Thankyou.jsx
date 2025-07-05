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

  // useEffect(() => {
  //   const shouldRunUpdateAgent = key === "update" && agentId && userId;

  //   const shouldRunWithStripeFlow = subscriptionId && agentId && userId;

  //   if (shouldRunWithStripeFlow || shouldRunUpdateAgent) {
  //     callNextApiAndRedirect();
  //   } else {
  //     const fallback = setTimeout(() => {
  //       if (key === "create") {
  //         navigate("/steps", {
  //           state: { locationPath: "/checkout" },
  //         });
  //       } else if (key === "update") {
  //         navigate("/dashboard");
  //       }
  //     }, 3000);

  //     return () => clearTimeout(fallback);
  //   }
  // }, [navigate, key, subscriptionId, agentId, userId, subsid]);

  return (
    // <div className={styles.container}>
    //   <div className={styles.card}>
    //     <h1 className={styles.heading}>🎉 Thank You!</h1>
    //     {popupMessage && <p className={styles.popup}>{popupMessage}</p>}
    //   </div>
    // </div>
    <div>
      <div className={styles.container}>
        <div className={styles.Logo}>
          <img src="/svg/Rexpt-Logo.svg" alt="Rexpt-Logo" />
        </div>

        <div className={styles.ThankyouMsg}>
          <div className={styles.title}>Thanks!</div>
          <div className={styles.subtitle}>for your Purchase</div>
          <p className={styles.description}>
            Your payment was successful. We’ve sent you a confirmation email
            with all the details you need.
          </p>
        </div>

        <div className={styles.infoBox}>
          <p>Below is some Quick Info for your Reference:</p>
          <div className={styles.row}>
            <span>Business Name:</span> <div className={styles.Right50}>ACME Construction Services</div>
          </div>
          <div className={styles.row}>
            <span>Agent Name & ID:</span><div className={styles.Right50}>Oliver (HS23D4)</div> 
          </div>
          <div className={styles.row}>
            <span>Plan Activated:</span> <div className={styles.Right50}>Growth - 1500 minutes</div> 
          </div>
          <div className={styles.row}>
            <span>Frequency & Price:</span><div className={styles.Right50}>US $5,988 / year</div> 
          </div>
          <div className={styles.row}>
            <span>Discount Applied:</span><div className={styles.Right50}>Yearly 17% OFF + 5% Coupon</div> 
          </div>
          <div className={styles.row}>
            <span>Billed Today:</span> <div className={styles.Right50}>$5,688.60 for 12 months</div>
          </div>
          <div className={styles.row}>
            <span>Next Billing Date:</span> <div className={styles.Right50}><a href="#">06 July 2026</a></div> 
          </div>
          <div className={styles.ButtonTakeME}>
            <button className={styles.dashboardBtn}>
              Take me to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Thankyou;
