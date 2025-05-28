import React, { useState, useRef } from 'react';
import styles from "../SignUp/SignUp.module.css";
import { useNavigate } from 'react-router-dom';
import { LoginWithEmailOTP, verifyEmailOTP } from '../../Store/apiStore';
import { toast } from 'react-toastify';
import PopUp from '../Popup/Popup';
import Loader from '../Loader/Loader';
import Modal from '../Modal/Modal';
import Plan from '../Plan/Plan';

const SignUp = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const inputRefs = useRef([]);

  const handleLoginClick = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setShowPopup(true);
      setPopupType("failed");
      setPopupMessage("Please enter a valid 6-digit OTP.")

      return;
    }
    setIsVerifyingOtp(true)
    try {
      const response = await verifyEmailOTP(email, fullOtp)

      if (response?.status === 200) {
        localStorage.setItem("token", response.data.token)
        sessionStorage.clear();
        setPopupType("success");
        setShowPopup(true);
        setPopupMessage("OTP Verified successfully!")
        navigate('/details');
      } else {
        console.error("Failed to send OTP");

        setPopupType("failed");
        setShowPopup(true);
        setPopupMessage("Failed to send OTP. Please try again." || 'Internal Server Error')
      }
    } catch (error) {
      setPopupType("failed");
      setShowPopup(true);
      setPopupMessage(error?.response?.data.error || 'Internal Server Error')
      console.error("Error sending OTP:", error);

    } finally {
      setIsVerifyingOtp(false)
    }

  };
  const handleSendOTP = async () => {
    // Simulate sending OTP
    setIsVerifyingOtp(true);
    try {
      const response = await LoginWithEmailOTP(email)
      if (response?.status === 200) {
        setShowPopup(true);
        setPopupType("success");
        setPopupMessage("OTP sent successfully!")
        setOtpSent(true);
      } else {

        console.error("Failed to send OTP");
        setShowPopup(true);
        setPopupType("failed");
        setPopupMessage("Failed to send OTP. Please try again.")
      }
    } catch (error) {
      setShowPopup(true);
      setPopupType("failed");
      setPopupMessage(error?.response?.data.error || 'Internal Server Error')
      console.error("Error sending OTP:", error);

    } finally {
      setIsVerifyingOtp(false);
    }
  }

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };


  return (
    <>

    <div className={styles.StartMain}>
                    <div>
                        {/* floating ellipses */}
                        <img src='images/Ellipse 1.png' alt='Ellipse 1' />
                        <img src='images/Ellipse 2.png' alt='Ellipse 2' />
                        <img src='images/Ellipse 5.png' alt='Ellipse 5' />
                        <img src='images/Ellipse 3.png' alt='Ellipse 3' />
                        <img src='images/Ellipse 4.png' alt='Ellipse 4' />
                        <img src='images/Ellipse 6.png' alt='Ellipse 6' />
                        <img src='images/Ellipse 7.png' alt='Ellipse 7' />
                        <img src='images/Ellipse 8.png' alt='Ellipse 8' />
                        <img src='images/Ellipse 9.png' alt='Ellipse 9' />
                        <img src='images/Ellipse 10.png' alt='Ellipse 10' />
                        <img src='images/Ellipse 11.png' alt='Ellipse 11' />
                    </div>
                </div>
      <div className={styles.pageEnterAnimation}>
        <div className={styles.mask}>
          <img src='images/Mask.png' alt='Mask.png' />
        </div>
        <div className={styles.logimg}>
          <img className={styles.logo} src='images/Rexpt-Logo.png' alt='Rexpt-Logo' />
        </div>
        <div className={styles.Maincontent}>
          <div className={styles.welcomeTitle}>
            <h1>Log In to your Account</h1>
          </div>
        </div>
        <div className={styles.container}>
          {/* Email Input Field */}
          {!otpSent && (
            <>
              <input
                type="email"
                className={styles.emailInput}
                placeholder="Johnvick@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />


              <div className={styles.btnTheme} onClick={handleSendOTP}>
                <img src='svg/svg-theme2.svg' alt='' />
                <p>   {isVerifyingOtp ? (<><Loader size={17} /></>) : "Send OTP"}</p>
              </div>
            </>
          )}

          {/* OTP Input Fields & Continue Button */}
          {otpSent && (
            <>
              <p className={styles.codeText}>Enter the code sent to your email</p>

              <div className={styles.otpContainer}>
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    maxLength="1"
                    value={otp[i]}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    className={styles.otpInput}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    ref={(el) => (inputRefs.current[i] = el)}
                    onInput={(e) => {
                      const target = e.target;
                      target.value = target.value.replace(/[^0-9]/g, "");
                    }}

                  />
                ))}
              </div>

              <div className={styles.Btn} onClick={handleLoginClick}>
                <div type="submit">

                  <div className={styles.btnTheme}>
                    <img src='images/svg-theme.svg' alt='' />
                    <p>{isVerifyingOtp ? (<><Loader size={17} /></>) : 'Continue'}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Divider & Social Media Icons */}
          <div className={styles.divider}>
            <hr className={styles.line} />
            <span className={styles.text}>Or continue with</span>
            <hr className={styles.line} />
          </div>

          <div className={styles.socialMedia}>
            <img src='images/facbook.png' alt='' />
            <img src='images/google.png' alt='' />
            <img src='images/apple.png' alt='' />
          </div>


        </div>

        {showPopup && !isLoading && (
          <PopUp type={popupType} onClose={() => setShowPopup(false)} message={popupMessage} />
        )}
      </div >
    </>


  );
}

export default SignUp;
