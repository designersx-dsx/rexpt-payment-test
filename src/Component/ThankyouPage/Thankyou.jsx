import React, { useEffect, useState } from "react";
import styles from "./Thankyou.module.css";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { API_BASE_URL } from "../../Store/apiStore";

function Thankyou({ onSubmit }) {
  const navigate = useNavigate();
  const { id: paramMode } = useParams();
  const [searchParams] = useSearchParams();
  const queryMode = searchParams.get("mode");

  // Prefer query param if available, else fallback to URL param
  const key = queryMode || paramMode;
  const location = useLocation();

  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [message, setMessage] = useState("");

  const [invoiceLink, setInvoiceLink] = useState("");

  // Get query params
  const getQueryParam = (name) =>
    new URLSearchParams(location.search).get(name);

  const subscriptionId = getQueryParam("subscriptionId");
  const agentId = getQueryParam("agentId");
  const userId = getQueryParam("userId");
  const subsid = getQueryParam("subscriptionId"); // 👈 Old subscription to cancel
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  // console.log("subscriptionInfo", subscriptionInfo);
  const [currencySymbol, setCurrencySymbol] = useState("");

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
              planMins: plan.planMins || "N/A",
              interval: plan.interval || "month",
              currentPeriodStart:
                plan.currentPeriodStart || new Date().toISOString(),
              nextRenewalDate: plan.nextBillingDate || null,
              invoiceUrl: plan.invoiceUrl || null,
            });
          } catch (err) {
            console.warn(
              "Failed to parse selected plan data from localStorage:",
              err
            );
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse session storage values:", e);
    }
  }, [agentId, key]);

  useEffect(() => {
    const priceIdFromSession = sessionStorage.getItem("priceId");
    if (!priceIdFromSession) return;

    const fetchPlanFromAPI = async () => {
      try {
        const res = await fetch("http://localhost:2512/api/products");
        const products = await res.json();

        for (const plan of products) {
          const price = plan.prices.find((p) => p.id === priceIdFromSession);
          if (price) {
            const today = new Date();
            const nextDate =
              price.interval === "month"
                ? new Date(today.setMonth(today.getMonth() + 1))
                : new Date(today.setFullYear(today.getFullYear() + 1));
            setSubscriptionInfo((prev) => ({
              ...prev,
              planName: plan.name,
              planAmount: (price.unit_amount / 100).toFixed(2),
              interval: price.interval,
              planMins: price.metadata || plan.metadata?.minutes || "N/A",
              nextRenewalDate: nextDate.toISOString(),
              currentPeriodStart:
                plan.currentPeriodStart || new Date().toISOString(),
            }));
            break;
          }
        }
      } catch (err) {
        console.error("Error loading plan from API:", err);
      }
    };

    fetchPlanFromAPI();
  }, []);

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
    if (!agentId && !userId) return; // Ensure at least one ID exists

    try {
      const res = await fetch(`${API_BASE_URL}/subscription-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          agentId ? { agentId } : { userId } // Send only one key based on availability
        ),
      });

      const data = await res.json();
      console.log("Subscription Info:", data);

      if (data && !data.error) {
        const { planAmount, ...rest } = data; // ignore planAmount
        setSubscriptionInfo((prev) => ({
          ...prev,
          ...rest, // keep existing planAmount
        }));
        // Extract currency symbol
        const currencyMap = {
          USD: "$",
          INR: "₹",
          EUR: "€",
          GBP: "£",
          AUD: "A$",
          CAD: "C$",
        };
        const upperCurrency = data.currency?.toUpperCase() || "USD";
        const symbol = currencyMap[upperCurrency] || "$";
        setCurrencySymbol(`${upperCurrency} ${symbol}`);
        // Save invoice link
        if (data.invoiceUrl) {
          setInvoiceLink(data.invoiceUrl);
        }
      } else {
        console.warn("No subscription found, falling back to static info.");
      }
    } catch (error) {
      console.error("Failed to fetch subscription info:", error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  useEffect(() => {
    const shouldRunUpdateAgent = key === "update" && agentId && userId;
    const shouldRunWithStripeFlow = subscriptionId && agentId && userId;
    const shouldRunCreateFlow = key === "create" && userId;

    const run = async () => {
      if (shouldRunWithStripeFlow || shouldRunUpdateAgent) {
        await callNextApiAndRedirect(); // handles update + cancellation
        setTimeout(async () => {
          await fetchSubscriptionInfo();
        }, 1500); // fetch updated subscription data
      } else if (shouldRunCreateFlow) {
        console.log("")
        setTimeout(async () => {
          await fetchSubscriptionInfo();
          onSubmit()
        }, 1500); // or 1500ms, your call
      }
    };

    run();
  }, [navigate, key, subscriptionId, agentId, userId, subsid]);
  const formatCurrency = (amount, currency) => {
    const upperCurrency = currency?.toUpperCase() || "USD";

    const symbolMap = {
      USD: "$",
      INR: "₹",
      EUR: "€",
      GBP: "£",
      AUD: "A$",
      CAD: "C$",
      // Add more if needed
    };

    const symbol = symbolMap[upperCurrency] || "";

    return `${upperCurrency} ${symbol}${Number(amount).toLocaleString()}`;
  };

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
                ? `${currencySymbol}${formatPrice(
                  subscriptionInfo.planAmount
                )} / ${subscriptionInfo.interval}`
                : "US $499 / month"}
            </div>
          </div>
          {/* <div className={styles.row}>
            <span>Discount Applied:</span>
            <div className={styles.Right50}>N/A</div>
          </div> */}
          <div className={styles.row}>
            <span>Billed Today:</span>
            <div className={styles.Right50}>
              {subscriptionInfo ? (
                <>
                  {`${currencySymbol}${formatPrice(
                    subscriptionInfo.planAmount
                  )} on `}
                  {new Date(
                    subscriptionInfo.currentPeriodStart
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </>
              ) : (
                "$5,688.60 on July 12, 2025"
              )}
            </div>
          </div>

          <div className={styles.row}>
            <span>Next Billing Date:</span>
            <div className={styles.Right50}>
              {subscriptionInfo
                ? new Date(subscriptionInfo.nextRenewalDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )
                : "06 July 2026"}
            </div>
          </div>
          {invoiceLink && (
            <div className={styles.row}>
              <span>Invoice Link:</span>
              <div className={styles.Right50}>
                <a
                  href={invoiceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadButton}
                  style={{
                    color: "purple",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  download
                >
                  Download
                </a>
              </div>
            </div>
          )}

          <div className={styles.ButtonTakeME}>
            <button
              onClick={() => {
                if (key !== "create") {
                  localStorage.removeItem("selectedPlanData");
                  localStorage.removeItem("allPlans");
                  navigate("/dashboard", {
                    state: { currentLocation },
                  });
                } else {
                  localStorage.removeItem("selectedPlanData");
                  localStorage.removeItem("allPlans");
                  // navigate("/steps", {
                  //   state: { locationPath: "/checkout" },
                  // });
                  navigate("/dashboard", { replace: true })
                }
              }}
              className={styles.dashboardBtn}
            // disabled={key === "create" ? true : false}
            >
              {key === "create"
                ? "Take me to Dashboard"
                : "Take me to Dashboard"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Thankyou;
