import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  API_BASE_URL,
  LoginWithEmailOTP,
  verifyEmailOTP,
} from "../../Store/apiStore";
import CustomCheckout from "./Checkout";
import styles from "./checkout.module.css";
import axios from "axios";
import useUser from "../../Store/Context/UserContext";
import decodeToken from "../../lib/decodeToken";
export default function SubscriptionFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  // const priceId = location.state?.priceId;
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const priceId = location.state?.priceId;
  const agentId = location.state?.agentId || null;
  const locationPath = location.state?.locationPath1 || null;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [userId, setUserId] = useState("");

  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  let token = localStorage.getItem("token");
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    if (!token) return;
    const result = decodeToken(token);
    setUserDetails(result);
    console.log({ result });
    setUserId(result.id);
    if (result?.email) setEmail(result.email);
  }, []);

  useEffect(() => {
    if (subscriptionSuccess) navigate("/business-details");
  }, [subscriptionSuccess, navigate]);

  // Check subscription after OTP verified
  useEffect(() => {
    if (!otpVerified || !customerId) return;

    const checkSubscription = async () => {
      try {
        const res = await fetch(`${API_BASE}/subscription/${customerId}`);
        const data = await res.json();

        const isActive =
          (data?.status === "active" || data?.status === "trialing") &&
          data?.price.id === priceId;

        setHasActiveSubscription(isActive);
      } catch (err) {
        console.error("❌ Subscription check failed:", err);
      } finally {
      }
    };

    checkSubscription();
  }, [otpVerified, customerId, priceId]);

  // Handlers
  const sendOtp = async () => {
    if (!email) return setMessage("⚠️ Enter email first");
    setMessage("Sending OTP...");
    setLoading(true);
    try {
      const res = await LoginWithEmailOTP(email);
      if (res.error) {
        setMessage(`❌ ${res.error}`);
      } else {
        setOtpSent(true);
        setMessage("✅ OTP sent!");
      }
    } catch {
      setMessage("❌ Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      if (locationPath !== "/dashboard" && locationPath !== "/dsbd") {
        if (!otp) return setMessage("⚠️ Enter OTP");
        setMessage("Verifying...");
        setLoading(true);
        const verifyRes = await verifyEmailOTP(email, otp);

        const verifiedUserId = verifyRes?.data?.user?.id;
        console.log(verifiedUserId, "berfied use ");
        if (verifiedUserId) {
          setUserId(verifiedUserId);
          localStorage.setItem("token", verifyRes.data.token);
          handleUpdateUserProfile(verifiedUserId);

          const customerRes = await fetch(`${API_BASE}/customer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const customerData = await customerRes.json();

          if (!customerData.customerId) {
            return setMessage("❌ Could not get customer ID");
          }

          setCustomerId(customerData.customerId);
          setOtpVerified(true);
          setMessage("OTP verified! ");
        } else {
          setMessage("Invalid OTP");
        }
      } else {
        const customerRes = await fetch(`${API_BASE}/customer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const customerData = await customerRes.json();

        if (!customerData.customerId) {
          return setMessage("❌ Could not get customer ID");
        }
        setUserVerified(true);
        setMessage("Customer verified");
        setCustomerId(customerData.customerId);
      }
    } catch (err) {
      setMessage("❌ Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmail = () => {
    // Reset flow
    setOtpSent(false);
    setOtp("");
    setOtpVerified(false);
    setCustomerId("");
    setUserId("");
    setMessage("");
  };
  const handleUpdateUserProfile = async (userId) => {
    console.log(userId, name, phone);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/endusers/users/${userId}`,
        {
          name: name.trim(),
          phone,
        }
      );
      console.log(response);
      if (response.status === 200) {
        setUser({
          name: response.data.user?.name,
        });
        sessionStorage.setItem(
          "OwnerDetails",
          JSON.stringify({ name: name.trim(), phone })
        );
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Render
  return (
    <div className={styles.container}>
      <h2>Complete Your Payment</h2>

      {/* Email Input with Edit button */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          disabled={otpSent}
        />
        {otpSent && !otpVerified && (
          <button
            onClick={handleEditEmail}
            className={styles.button}
            style={{ padding: "6px 10px", fontSize: "0.9rem" }}
          >
            Edit
          </button>
        )}
      </div>
      {otpSent ? "" : <div></div>}

      {/* OTP Input */}
      {otpSent && !otpVerified && (
        <div style={{ marginBottom: "1rem", maxWidth: 400 }}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={styles.input}
            disabled={otpVerified} // Disable OTP input once verified
          />
          <button
            onClick={verifyOtp}
            className={styles.button}
            disabled={otpVerified}
          >
            {loading ? "Verifying..." : otpVerified ? "Verified" : "Verify OTP"}
          </button>
        </div>
      )}

      {/* Send OTP button */}
      {!otpSent && (
        <button
          onClick={
            locationPath === "/dashboard" || locationPath === "/dsbd"
              ? verifyOtp
              : sendOtp
          }
          className={styles.button}
          disabled={loading || !email || otpVerified || userVerified}
        >
          {loading
            ? "Sending..."
            : locationPath === "/dashboard" || locationPath === "/dsbd"
            ? "Verify Customer"
            : "Send Otp"}
        </button>
      )}

      {/* Message */}
      {message && <p className={styles.message}>{message}</p>}

      {/* Subscription check loading */}

      {/* Already subscribed */}

      <div style={{ marginTop: "2rem" }}>
        <CustomCheckout
          email={email}
          customerId={customerId}
          priceId={priceId}
          userId={userId}
          onSubscriptionSuccess={() => {
            setSubscriptionSuccess(true);
          }}
          disabled={!otpVerified} // Submit button disabled until OTP verified
          agentId={agentId}
          locationPath={locationPath}
        />
      </div>
    </div>
  );
}
