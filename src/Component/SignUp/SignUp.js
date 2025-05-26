import React from 'react';
import styles from "../SignUp/SignUp.module.css";
import { useNavigate } from 'react-router-dom';
import { LoginWithEmailOTP, verifyEmailOTP } from '../../Store/apiStore';
import { toast } from 'react-toastify';

const SignUp = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);


 const handleLoginClick = async() => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
        const response=await verifyEmailOTP(email,fullOtp)
        console.log("response", response);
        if (response?.status === 200) {
          console.log("OTP Verified successfully");
          // alert('OTP Verified successfully!');
          toast.success("OTP Verified successfully!")
          navigate('/steps');
        } else {
        console.error("Failed to send OTP");
        toast.error('Failed to send OTP. Please try again.');

        }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error?.response?.data.error ||'Internal Server Error');
    }
        
  };

    const handleSendOTP = async() => {
    // Simulate sending OTP
    
    try {
        const response=await LoginWithEmailOTP(email)
        console.log("response", response);
        if (response?.status === 200) {
          console.log("OTP sent successfully");
          // alert('OTP sent successfully!');
          toast.success("OTP sent successfully!")
          setOtpSent(true);
        } else {
        console.error("Failed to send OTP");
        toast.error('Failed to send OTP. Please try again.');
        }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error?.response?.data.error ||'Internal Server Error');
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


  return (
    <div className={styles.pageEnterAnimation}>
      <div className={styles.mask}>
        <img src='images/Mask.png' alt='Mask.png' />
      </div>
      <div className={styles.logimg}>
        <img className={styles.logo} src='images/Rexpt-Logo.png' alt='Rexpt-Logo' />
      </div>
      <div className={styles.Maincontent}>
        <div className={styles.welcomeTitle}>
          <h1>Welcome Back!</h1>
        </div>
      </div>
      <div className={styles.container}>
        <input
          type="email"
          className={styles.emailInput}
          placeholder="Johnvick@gmail.com"
          onChange={(e => setEmail(e.target.value))}
        />
      <span className={styles.Otp} onClick={handleSendOTP}>Send OTP</span>

        <p className={styles.codeText}>Enter the send code</p>

            <div className={styles.otpContainer}>
          {[...Array(6)].map((_, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            maxLength="1"
            value={otp[i]}
            onChange={(e) => handleOtpChange(e.target.value, i)}
            className={styles.otpInput}
          />          
          ))}
        </div>

        <div className={styles.Btn} onClick={handleLoginClick}>
          <button type="submit">Continue
            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.3379 20.0391C13.9955 20.0391 13.6682 19.9595 13.3564 19.8027C12.9671 19.583 12.6561 19.2358 12.4844 18.8271C12.375 18.5441 12.2041 17.6951 12.2041 17.6797C12.0466 16.8233 11.9545 15.4716 11.9414 13.957L11.9404 13.5752C11.9404 11.9884 12.0329 10.5418 12.1729 9.59863L12.2959 9.01172C12.3641 8.70119 12.4534 8.34754 12.5469 8.16699C12.8892 7.50651 13.5589 7.09766 14.2754 7.09766H14.3379C14.803 7.11311 15.7779 7.5196 15.7861 7.53711C17.3649 8.19953 20.4105 10.1987 21.8174 11.624L22.2266 12.0527C22.3335 12.1686 22.4537 12.3062 22.5283 12.4131C22.7776 12.7433 22.9023 13.152 22.9023 13.5605C22.9023 14.0164 22.7625 14.4404 22.498 14.7871L22.0781 15.2402L21.9834 15.3369C20.707 16.7208 17.3744 18.9841 15.6309 19.6768L15.3672 19.7773C15.0505 19.8909 14.607 20.0265 14.3379 20.0391ZM5.11133 15.2051C4.21635 15.2049 3.49043 14.4721 3.49023 13.5684C3.49023 12.6645 4.21623 11.9309 5.11133 11.9307L9.10156 12.2842C9.80369 12.2844 10.373 12.8593 10.373 13.5684C10.3729 14.2784 9.80358 14.8523 9.10156 14.8525L5.11133 15.2051Z" fill="white" />
            </svg>
          </button>

        </div>





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
    </div >
  );
}

export default SignUp;
