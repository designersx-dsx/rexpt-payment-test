import React from 'react';
import styles from "../SignUp/SignUp.module.css";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/steps');
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
        />

        <p className={styles.codeText}>Enter the send code</p>

        <div className={styles.otpContainer}>
          {[...Array(6)].map((_, i) => (
            <input key={i} maxLength="1" className={styles.otpInput} />
          ))}
        </div>

        <div className={styles.loginBtn} onClick={handleLoginClick}>
          <img src='images/Login-btn.png' alt='' />
        </div>
        <div className={styles.divider}>
          <hr className={styles.line} />
          <span className={styles.text}>Or continue with</span>
          <hr className={styles.line} />
        </div>

        <div className={styles.socialMedia}>
          <img src='images/facbook.png' alt=''/>
          <img src='images/google.png' alt=''/>
          <img src='images/apple.png' alt=''/>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
