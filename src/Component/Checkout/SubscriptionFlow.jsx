import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginWithEmailOTP, verifyEmailOTP } from "../../Store/apiStore";
import CustomCheckout from './Checkout';
import styles from './checkout.module.css';

export default function SubscriptionFlow() {
  const location = useLocation();
  const navigate = useNavigate();

  const priceId = location.state?.priceId;
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [customerId, setCustomerId] = useState('');
  const [userId, setUserId] = useState('');

  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  

  // Auto redirect after payment success
  useEffect(() => {
    if (subscriptionSuccess) navigate('/business-details');
  }, [subscriptionSuccess, navigate]);

  // Check subscription after OTP verified
  useEffect(() => {
    if (!otpVerified || !customerId) return;

    const checkSubscription = async () => {
   
      try {
        const res = await fetch(`${API_BASE}/subscription/${customerId}`);
        const data = await res.json();

        const isActive =
          (data?.status === 'active' || data?.status === 'trialing') &&
          data?.price.id === priceId;

        setHasActiveSubscription(isActive);
      } catch (err) {
        console.error('❌ Subscription check failed:', err);
      } finally {
   
      }
    };

    checkSubscription();
  }, [otpVerified, customerId, priceId]);

  // Handlers
  const sendOtp = async () => {
    if (!email) return setMessage('⚠️ Enter email first');
    setMessage('Sending OTP...');
    setLoading(true);
    try {
      const res = await LoginWithEmailOTP(email);
      if (res.error) {
        setMessage(`❌ ${res.error}`);
      } else {
        setOtpSent(true);
        setMessage('✅ OTP sent!');
      }
    } catch {
      setMessage('❌ Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return setMessage('⚠️ Enter OTP');
    setMessage('Verifying...');
    setLoading(true);
    try {
      const verifyRes = await verifyEmailOTP(email, otp);

      const verifiedUserId = verifyRes?.data?.user?.id;
      if (verifiedUserId) {
        setUserId(verifiedUserId);
        localStorage.setItem("token", verifyRes.data.token);

        const customerRes = await fetch(`${API_BASE}/customer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const customerData = await customerRes.json();

        if (!customerData.customerId) {
          return setMessage('❌ Could not get customer ID');
        }

        setCustomerId(customerData.customerId);
        setOtpVerified(true);
        setMessage('OTP verified! ');
      } else {
        setMessage('Invalid OTP');
      }
    } catch (err) {
      setMessage('❌ Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmail = () => {
    // Reset flow
    setOtpSent(false);
    setOtp('');
    setOtpVerified(false);
    setCustomerId('');
    setUserId('');
    setMessage('');
  };

  // Render
  return (
    <div className={styles.container}>
      <h2>Complete Your Payment</h2>

      {/* Email Input with Edit button */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          disabled={otpSent}
        />
        {otpSent && !otpVerified && (
          <button onClick={handleEditEmail} className={styles.button} style={{ padding: '6px 10px', fontSize: '0.9rem' }}>
            Edit
          </button>
        )}
      </div>

      {/* OTP Input */}
      {otpSent && !otpVerified && (
        <div style={{ marginBottom: '1rem' }}>
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
        </div>
      )}

      {/* Send OTP button */}
      {!otpSent && (
        <button onClick={sendOtp} className={styles.button} disabled={loading}>
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      )}

      {/* Message */}
      {message && <p className={styles.message}>{message}</p>}

      {/* Subscription check loading */}
     

      {/* Already subscribed */}
    
     
        <div style={{ marginTop: '2rem' }}>
          <CustomCheckout
            email={email}
            customerId={customerId}
            priceId={priceId}
            userId={userId}
            onSubscriptionSuccess={() => {
              setSubscriptionSuccess(true);
            }}
            disabled={!otpVerified}  // Submit button disabled until OTP verified
          />
        </div>
    
    </div>
  );
}
