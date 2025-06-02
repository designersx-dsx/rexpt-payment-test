import React, { useState } from 'react';
import styles from './checkout.module.css';
import { LoginWithEmailOTP, verifyEmailOTP } from "../../Store/apiStore";

const API_BASE = 'http://localhost:5000';

export default function EmailVerification({ onVerified }) {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
const [userId  , setUserId]  = useState()
  const sendOtp = async () => {
    if (!email) return setMessage('⚠️ Enter email first');
    setMessage('Sending OTP...');
    try {
      const res = await LoginWithEmailOTP(email);
      if (res.error) return setMessage(`❌ ${res.error}`);
      setOtpSent(true);
      setMessage('✅ OTP sent!');
    } catch {
      setMessage('❌ Failed to send OTP');
    }
  };

const verifyOtp = async () => {
  if (!otp) return setMessage('⚠️ Enter OTP');
  setLoading(true);
  setMessage('Verifying...');
  try {
    const verifyRes = await verifyEmailOTP(email, otp);

    // Ensure that userId is correctly set
    const verifiedUserId = verifyRes?.data?.user?.id;

    if (verifiedUserId) {
      setUserId(verifiedUserId); // Set the correct userId

      // Save the token
      localStorage.setItem("token", verifyRes.data.token);

      // Proceed to fetch the customer details
      const customerRes = await fetch(`${API_BASE}/customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const customerData = await customerRes.json();

      if (!customerData.customerId) {
        return setMessage('❌ Could not get customer ID');
      }

      // Send both email + customerId + userId to parent component
      onVerified({
        email,
        customerId: customerData.customerId,
        userId: verifiedUserId, // Pass the correct userId to parent
      });
    } else {
      return setMessage('Invalid OTP');
    }
  } catch (err) {
    setMessage('❌ Verification failed');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={styles.container}>
      {!otpSent ? (
        <>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <button onClick={sendOtp} className={styles.button} disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={styles.input}
          />
          <button onClick={verifyOtp} className={styles.button} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
