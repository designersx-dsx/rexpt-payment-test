import React, { useEffect, useState } from "react";
import styles from "./Thankyou2.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import Loader2 from "../Loader2/Loader2";
import {
  API_BASE_URL,
  verifyEmailOTP,
  verifyOrCreateUser,
} from "../../Store/apiStore";
import axios from "axios";

function Thankyou2() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);

  const sessionId = new URLSearchParams(location.search).get("session_id");
  const [subcriptionId, setsubcriptionId] = useState();
  const [setSubscriptionDetails, setsetSubscriptionDetails] = useState();

  useEffect(() => {
    if (!sessionId) return;

    const fetchSessionDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/session-details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await res.json();

        if (data.success && data.session) {
          setsubcriptionId(data.session?.subscription?.id);
          setSessionData(data.session);
        }
      } catch (err) {
        console.error("Failed to fetch session info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  useEffect(() => {
    if (!subcriptionId) return;

    const fetchSubscriptionDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/subscription-details-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription_id: subcriptionId }),
        });

        const data = await res.json();
        console.log("dataa", data);

        if (!data?.error) {
          setsetSubscriptionDetails(data);
        } else {
          console.warn("No additional subscription data found.");
        }
      } catch (err) {
        console.error("Failed to fetch subscription details:", err);
      }
    };

    fetchSubscriptionDetails();
  }, [subcriptionId]);

  const formatCurrency = (amount, currency) => {
    if (!amount || !currency) return "N/A";
    const currencySymbols = {
      USD: "$",
      INR: "₹",
      EUR: "€",
      GBP: "£",
      AUD: "A$",
      CAD: "C$",
    };
    const symbol = currencySymbols[currency.toUpperCase()] || "";
    return `${currency.toUpperCase()} ${symbol}${(
      amount / 100
    ).toLocaleString()}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatISODate = (iso) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const customer = sessionData?.customer_details;
  const subscription = sessionData?.subscription;
  const plan = subscription?.items?.data?.[0]?.plan;
  const price = plan?.amount;
  const currency = plan?.currency;
  const invoiceLink = sessionData?.invoice
    ? `https://dashboard.stripe.com/test/invoices/${sessionData.invoice}`
    : null;

  const handleClick = async () => {
    try {
      // These values should ideally come from the session or URL
      const email = sessionData?.customer_details?.email;
      const customerId = sessionData?.customer?.id;
      const fullOtp = "notRequired"; // since you're skipping OTP

      if (!email || !customerId) {
        console.warn("Missing required info to verify.");
        return;
      }

      const response = await verifyOrCreateUser(email, fullOtp, customerId);

      const data = await response;

      if (response.status === 200) {
        localStorage.setItem("token", data.data?.token);
        localStorage.setItem("onboardComplete", false);
        localStorage.setItem("paymentDone", true);
        localStorage.setItem("subcriptionIdUrl", subcriptionId);

        sessionStorage.clear();

        // Navigate to Agent Creation page
        navigate("/details"); // or any valid path
      } else {
        console.error("Verification failed:", data.data?.error);
        alert(data.error);
      }
    } catch (err) {
      console.error("Error during OTP verification:", err);
      alert("Something went wrong while verifying.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.Logo}>
        <img src="/svg/Rexpt-Logo.svg" alt="Rexpt-Logo" />
      </div>

      <div className={styles.ThankyouMsg}>
        <div className={styles.title}>Thanks!</div>
        <div className={styles.subtitle}>for your Purchase</div>
        <p className={styles.description}>
          Your payment was successful. We’ve sent you a confirmation email with
          all the details you need.
        </p>
      </div>

      {/* {loading ? (
        <Loader2 />
      ) : ( */}
      <div className={styles.infoBox}>
        <p>Below is some Quick Info for your Reference:</p>

        <div className={styles.row}>
          <span>Name:</span>
          <div className={styles.Right50}>{customer?.name || "N/A"}</div>
        </div>

        <div className={styles.row}>
          <span>Email:</span>
          <div className={styles.Right50}>{customer?.email || "N/A"}</div>
        </div>

        {/* <div className={styles.row}>
          <span>Subscription ID:</span>
          <div className={styles.Right50}>{subscription?.id || "N/A"}</div>
        </div> */}

        {/* <div className={styles.row}>
          <span>Plan ID:</span>
          <div className={styles.Right50}>{plan?.id || "N/A"}</div>
        </div> */}

        <div className={styles.row}>
          <span>Price & Frequency:</span>
          <div className={styles.Right50}>
            {formatCurrency(price, currency)} / {plan?.interval || "N/A"}
          </div>
        </div>

        <div className={styles.row}>
          <span>Status:</span>
          <div className={styles.Right50}>{subscription?.status || "N/A"}</div>
        </div>

        <div className={styles.row}>
          <span>Start Date:</span>
          <div className={styles.Right50}>
            {formatDate(subscription?.start_date)}
          </div>
        </div>

        <div className={styles.row}>
          <span>Next Billing:</span>
          <div className={styles.Right50}>
            {formatISODate(setSubscriptionDetails?.nextRenewalDate)}
          </div>
        </div>

        {setSubscriptionDetails?.invoiceUrl && (
          <div className={styles.row}>
            <span>Invoice:</span>
            <div className={styles.Right50}>
              <a
                href={setSubscriptionDetails?.invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadButton}
                style={{ color: "purple", textDecoration: "none" }}
              >
                Download
              </a>
            </div>
          </div>
        )}

        <div className={styles.ButtonTakeME}>
          <button onClick={handleClick} className={styles.dashboardBtn}>
            Take me to Agent Creation
          </button>
        </div>
      </div>
      {/* )} */}
    </div>
  );
}

export default Thankyou2;
