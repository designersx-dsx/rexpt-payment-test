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
import Loader2 from "../Loader2/Loader2";
export default function SubscriptionFlow() {
  const location = useLocation();
  console.log("location",location)
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  // const priceId = location.state?.priceId;
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const priceId = location.state?.priceId || sessionStorage.getItem("priceId") ;
  // console.log("priceId",priceId)
  const agentId = location.state?.agentId || sessionStorage.getItem("agentId");
  const price = location.state?.price ||  sessionStorage.getItem("price");
  const subscriptionId = location.state?.subscriptionId || sessionStorage.getItem("subscriptionId")
  const locationPath = location.state?.locationPath1 || null;
  const [paymentConfirmed,setPaymentConfirmed]=useState(false)
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
    setUserId(result.id);
    setCustomerId(result.customerId)
    if (result?.email) setEmail(result.email);
    console.log(result)
  }, []);

  useEffect(() => {
    if (subscriptionSuccess) {
       if(locationPath !== "/update"){
        navigate("/steps" , {state:{
          locationPath : "/checkout"
          
        }}); 
       }
       else{
         navigate("/dashboard"); 

       }
       
       
    }
  }, [subscriptionSuccess, navigate]);

  // Check subscription after OTP verified
  useEffect(() => {
    if (!customerId) return;

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
  }, [ customerId, priceId]);

  // const checkPage = sessionStorage.getItem("checkPage");
  // useEffect(() => {
  //     if (checkPage === "checkout") {
  //       navigate("/cancel-payment");
  //     }
  //   }, [checkPage]);

  // Handlers
  // const sendOtp = async () => {
  //   if (!email) return setMessage("⚠️ Enter email first");
  //   setMessage("Sending OTP...");
  //   setLoading(true);
  //   try {
  //     const res = await LoginWithEmailOTP(email);
  //     if (res.error) {
  //       setMessage(`❌ ${res.error}`);
  //     } else {
  //       setOtpSent(true);
  //       setMessage("✅ OTP sent!");
  //     }
  //   } catch {
  //     setMessage("❌ Failed to send OTP");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const verifyOtp = async () => {
  //   try {
  //     setLoading(true);
  //     if (locationPath !== "/dashboard" && locationPath !== "/dsbd") {
  //       if (!otp) return setMessage("⚠️ Enter OTP");
  //       setMessage("Verifying...");
  //       setLoading(true);
  //       const verifyRes = await verifyEmailOTP(email, otp);

  //       const verifiedUserId = verifyRes?.data?.user?.id;
  //       console.log(verifiedUserId, "berfied use ");
  //       if (verifiedUserId) {
  //         setUserId(verifiedUserId);
  //         localStorage.setItem("token", verifyRes.data.token);
  //         handleUpdateUserProfile(verifiedUserId);

  //         const customerRes = await fetch(`${API_BASE}/customer`, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ email }),
  //         });

  //         const customerData = await customerRes.json();

  //         if (!customerData.customerId) {
  //           return setMessage("❌ Could not get customer ID");
  //         }

  //         setCustomerId(customerData.customerId);
  //         setOtpVerified(true);
  //         setMessage("OTP verified! ");
  //       } else {
  //         setMessage("Invalid OTP");
  //       }
  //     } else {
  //       const customerRes = await fetch(`${API_BASE}/customer`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email }),
  //       });

  //       const customerData = await customerRes.json();

  //       if (!customerData.customerId) {
  //         return setMessage("❌ Could not get customer ID");
  //       }
  //       setUserVerified(true);
  //       setMessage("Customer verified");
  //       setCustomerId(customerData.customerId);
  //     }
  //   } catch (err) {
  //     setMessage("❌ Verification failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const handlePaymentConfirm = () => {
    setPaymentConfirmed(true);
    console.log("Payment was confirmed");
  };
  // Render
  return (
    <div className={styles.container}>
      {/* <h2>Complete Your Payment</h2> */}

      {/* {loading && !popupMessage && !message && ( */}
              <div className={styles.loaderWrapper}>
                <Loader2 />
              </div>
            {/* )} */}

      {/* Email Input with Edit button */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "20px 0 0 0",
        }}
      >
        {/* <input
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
            className={styles.buttonmai}
            style={{ padding: "6px 10px", fontSize: "0.9rem" }}
          >
            <svg
              width="82"
              height="82"
              viewBox="0 0 82 82"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.3366 44.2117L51.3756 15.1727L66.0866 29.8837L37.0396 58.9147C36.7506 59.2116 36.3521 59.3756 35.938 59.3756H23.438C22.5787 59.3756 21.8755 58.6725 21.8755 57.8131V45.3131C21.8755 44.8991 22.0398 44.5008 22.3366 44.2117ZM78.4616 17.5007C79.3757 16.5866 79.8835 15.3601 79.8835 14.0632C79.8835 12.7663 79.3757 11.5476 78.4616 10.6257L70.6257 2.7898C69.7117 1.87574 68.4851 1.3679 67.1882 1.3679C65.8913 1.3679 64.6726 1.87571 63.7507 2.7898L55.7898 10.7507L70.5008 25.4617L78.4616 17.5007ZM78.1257 32.8127C76.3991 32.8127 75.0007 34.2111 75.0007 35.9377V70.3207C75.0007 72.8988 72.8991 75.0004 70.321 75.0004H10.93C8.3519 75.0004 6.2503 72.8988 6.2503 70.3207V10.9297C6.2503 8.3516 8.3519 6.25 10.93 6.25H45.313C47.0396 6.25 48.438 4.8516 48.438 3.125C48.438 1.3984 47.0396 0 45.313 0H10.93C4.9066 0 0 4.9062 0 10.93V70.321C0 76.3444 4.9062 81.251 10.93 81.251H70.321C76.3444 81.251 81.251 76.3448 81.251 70.321V35.938C81.251 34.2114 79.8523 32.8127 78.1257 32.8127Z"
                fill="black"
              />
            </svg>
          </button>
        )} */}
      </div>
      {otpSent ? "" : <div></div>}

      {/* OTP Input */}
      {/* {!otpVerified && (
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
      )} */}

      {/* Send OTP button */}
      {/* {!otpSent && (
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
      )} */}

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
          price={price}
          onSubscriptionSuccess={() => {
            setSubscriptionSuccess(true);
          }}
          disabled={!otpVerified} // Submit button disabled until OTP verified
          agentId={agentId}
          locationPath={locationPath}
          subscriptionId={subscriptionId}
          onPaymentConfrim={handlePaymentConfirm}
        />
      </div>
    </div>
  );
}
