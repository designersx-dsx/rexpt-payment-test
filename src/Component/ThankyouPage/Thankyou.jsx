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
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  const currentLocation = "/update";

  const [agentName, setAgentName] = useState("Agent");
  const [agentCode, setAgentCode] = useState("XXXXXX");
  const [businessName, setBusinessName] = useState("Your Business");

  useEffect(() => {
    const storedDashboard = sessionStorage.getItem("dashboard-session-storage");
    const storedBusinessDetails = sessionStorage.getItem("businessDetails");
    const storedPlaceDetails = sessionStorage.getItem("placeDetailsExtract");

    try {
      if (key === "update" && storedDashboard) {
        const parsed = JSON.parse(storedDashboard);
        const agents = parsed?.state?.agents || [];
        const matchedAgent = agents.find((a) => a.agent_id === agentId);

        if (matchedAgent) {
          setAgentName(matchedAgent.agentName || "Agent");
          setAgentCode(matchedAgent.agentCode || "XXXXXX");
          setBusinessName(
            matchedAgent.business?.businessName || "Your Business"
          );
        } else {
          console.warn("No matching agent found for agentId:", agentId);
        }
      }

      if (key === "create") {
        let businessNameVal = "";

        const businessData = storedBusinessDetails
          ? JSON.parse(storedBusinessDetails)
          : null;
        const placeData = storedPlaceDetails
          ? JSON.parse(storedPlaceDetails)
          : null;

        setAgentCode(sessionStorage.getItem("AgentCode") || "XXXXXX");
        setAgentName(sessionStorage.getItem("agentName") || "Agent");



        // 1. From businessDetails first
        if (businessData) {
          // setAgentCode(businessData.AgentCode || "XXXXXX");
          // setAgentName(businessData.agentName || "Agent");

          businessNameVal = businessData.businessName;
        }

        // 2. If missing, fallback to placeDetailsExtract
        if (!businessNameVal && placeData?.businessName) {
          businessNameVal = placeData.businessName;
        }

        setBusinessName(businessNameVal || "Your Business");
        // ✅ Load plan details from localStorage
        const selectedPlanRaw = localStorage.getItem("selectedPlanData");
        if (selectedPlanRaw) {
          try {
            const plan = JSON.parse(selectedPlanRaw);

            setSubscriptionInfo({
              planName: plan.planName || "N/A",
              planAmount: plan.price || 0,
              planMins: plan.minutes || "N/A",
              interval: plan.interval || "month",
              nextRenewalDate: plan.nextBillingDate || null,
            });
          } catch (err) {
            console.warn("Failed to parse selected plan data from localStorage:", err);
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse session storage values:", e);
    }
  }, [agentId, key]);

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

        // setTimeout(() => {
        //   navigate("/dashboard", {
        //     state: { currentLocation },
        //   });
        // }, 2000);
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


  const fetchSubscriptionInfo = async () => {
    if (!agentId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/subscription-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });

      const data = await res.json();
      if (data && !data.error) {
        setSubscriptionInfo(data);
      } else {
        console.warn("No subscription found, falling back to static info.");
      }
    } catch (error) {
      console.error("Failed to fetch subscription info:", error);
    }
  };

  useEffect(() => {
    const shouldRunUpdateAgent = key === "update" && agentId && userId;
    const shouldRunWithStripeFlow = subscriptionId && agentId && userId;

    const run = async () => {
      if (shouldRunWithStripeFlow || shouldRunUpdateAgent) {
        await callNextApiAndRedirect(); // handles update + cancellation
        await fetchSubscriptionInfo(); // fetch updated subscription data
      } else {
        const fallback = setTimeout(() => {
          if (key === "create") {
            localStorage.removeItem("selectedPlanData");
            navigate("/steps", {
              state: { locationPath: "/checkout" },
            });
          }
          // Removed the "else if (key === 'update')" dashboard navigation
        }, 3000);

        return () => clearTimeout(fallback);
      }
    };

    run();
  }, [navigate, key, subscriptionId, agentId, userId, subsid]);


  return (
    // <div className={styles.container}>
    //   <div className={styles.card}>
    //     <h1 className={styles.heading}>🎉 Thank You!</h1>
    //     {/* <p className={styles.subtext}>Redirecting for agent creation...</p> */}
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
            <span>Business Name:</span>{" "}
            <div className={styles.Right50}>
              {businessName || "ACME Construction Services"}
            </div>
          </div>
          <div className={styles.row}>
            <span>Agent Name & ID:</span>
            <div className={styles.Right50}>
              {agentName && agentCode
                ? `${agentName} (${agentCode})`
                : "Oliver (HS23D4)"}
            </div>
          </div>
          <div className={styles.row}>
            <span>Plan Activated:</span>
            <div className={styles.Right50}>
              {subscriptionInfo?.planName || "Growth"} -{" "}
              {subscriptionInfo?.planMins || "1500"} minutes
            </div>
          </div>
          <div className={styles.row}>
            <span>Frequency & Price:</span>
            <div className={styles.Right50}>
              {subscriptionInfo
                ? `US $${Number(
                  subscriptionInfo.planAmount
                ).toLocaleString()} / month`
                : "US $499 / month"}
            </div>
          </div>
          <div className={styles.row}>
            <span>Discount Applied:</span>
            <div className={styles.Right50}>N/A</div>
          </div>
          <div className={styles.row}>
            <span>Billed Today:</span>
            <div className={styles.Right50}>
              {subscriptionInfo
                ? subscriptionInfo.interval === "month"
                  ? `$${Number(subscriptionInfo.planAmount).toFixed(
                    2
                  )} per month`
                  : `$${(
                    Number(subscriptionInfo.planAmount) *
                    12 *
                    0.95
                  ).toFixed(2)} for 12 months`
                : "$5,688.60 for 12 months"}
            </div>
          </div>
          <div className={styles.row}>
            <span>Next Billing Date:</span>
            <div className={styles.Right50}>
              <a href="#">
                {subscriptionInfo
                  ? new Date(
                    subscriptionInfo.nextRenewalDate
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  : "06 July 2026"}
              </a>
            </div>
          </div>
          <div className={styles.ButtonTakeME}>
            <button
              onClick={() => {
                if (key !== "create") {
                  localStorage.removeItem("selectedPlanData");
                  navigate("/dashboard", {
                    state: { currentLocation },
                  });
                }
              }}
              className={styles.dashboardBtn}
              disabled={key === "create" ? true : false}
            >
              {key === "create" ? "Redirecting.." : "Take me to Dashboard"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Thankyou;
