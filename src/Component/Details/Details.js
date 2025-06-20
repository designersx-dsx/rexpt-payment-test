import React, { useState, useEffect } from "react";
import styles from "../Details/Details.module.css";
import { useNavigate } from "react-router-dom";
import PopUp from "../Popup/Popup";
import axios from "axios";
import { API_BASE_URL } from "../../Store/apiStore";
import decodeToken from "../../lib/decodeToken";
import Loader from "../Loader/Loader";
import useUser from "../../Store/Context/UserContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Details = () => {
  const navigate = useNavigate();
  const [startExit, setStartExit] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const token = localStorage.getItem("token");
  const decodeTokenData = decodeToken(token);
  const userId = decodeTokenData?.id;
  const { user, setUser } = useUser();
  useEffect(() => {
    if (sessionStorage.getItem("OwnerDetails")) {
      const ownerDetails = JSON.parse(sessionStorage.getItem("OwnerDetails"));
      setName(ownerDetails.name || "");
      setPhone(ownerDetails.phone || "");
    }
  }, []);

  const containsEmoji = (text) => {
    return /[\p{Emoji_Presentation}\u200d]/u.test(text);
  };

  const validateName = (value) => {
    if (!value.trim()) return "Name is required.";
    if (containsEmoji(value)) return "Emojis are not allowed in the name.";
    if (/[^a-zA-Z\s.'-]/.test(value))
      return "Name contains invalid characters.";
    if (value.trim().length < 2) return "Name must be at least 2 characters.";
    return "";
  };

  const validatePhone = (value) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (!digitsOnly.trim()) return "Phone number is required.";
    if (digitsOnly.length < 10) return "Phone number seems too short.";
    if (digitsOnly.length > 15) return "Phone number seems too long.";
    return "";
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);

    // Show error only if submitted once
    if (nameSubmitted) {
      setNameError(validateName(val));
    } else {
      setNameError("");
    }
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    setPhone(val);

    if (phoneSubmitted) {
      setPhoneError(validatePhone(val));
    } else {
      setPhoneError("");
    }
  };

  const handleLoginClick = async () => {
    setNameSubmitted(true);
    setPhoneSubmitted(true);

    const nError = validateName(name);
    const pError = validatePhone(phone);

    setNameError(nError);
    setPhoneError(pError);

    if (nError || pError) return;

    setLoading(true);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/endusers/users/${userId}`,
        {
          name: name.trim(),
          phone,
        }
      );

      if (response.status === 200) {
        setStartExit(true);
        sessionStorage.setItem(
          "OwnerDetails",
          JSON.stringify({ name: name.trim(), phone })
        );
        setUser({ name: name });
        setTimeout(() => {
          localStorage.setItem("onboardComplete", "true");
          navigate("/business-details");
        }, 400);
      } else {
        setPopupType("failed");
        setPopupMessage("Update failed. Please try again.");
        setShowPopup(true);
      }
    } catch (error) {
      setPopupType("failed");
      setPopupMessage("An error occurred during update.");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };
  const [step, setStep] = useState(0);

  useEffect(() => {
    const played = sessionStorage.getItem("personalDetailsAnimationPlayed");

    if (!played) {
      const delays = [150, 300, 450, 550];
      const timers = delays.map((delay, index) =>
        setTimeout(() => setStep(index + 1), delay)
      );

      sessionStorage.setItem("personalDetailsAnimationPlayed", "true");

      return () => timers.forEach(clearTimeout);
    } else {
      setStep(4);
    }
  }, []);
  useEffect(() => {
    // Push an initial state to prevent the back button
    window.history.pushState(null, "", window.location.href);

    // Handle popstate (back button press)
    const handlePopState = (e) => {
      // Prevent back navigation by pushing the current state again
      window.history.pushState(null, "", window.location.href);

      // Trigger the confirmation dialog when back navigation is attempted
      const confirmExit = window.confirm(
        "Are you sure you want to leave? You might lose unsaved changes."
      );
      if (!confirmExit) {
        // If the user clicks "Cancel", close the tab
        window.close(); // This will close the tab (might not work in all browsers)

        // Optional: You can push another state to ensure the URL stays the same.
        // window.history.pushState(null, "", window.location.href); // Reinforce blocking back again
      }
    };

    // Add event listener to block back navigation
    window.addEventListener("popstate", handlePopState);

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  return (
    <>
      <div className={styles.signUpContainer}>
        <div className={styles.StartMain}>
          <div>
            <img src="images/Ellipse 6.png" alt="Ellipse 6" />
            <img src="images/Ellipse 7.png" alt="Ellipse 7" />
            <img src="images/Ellipse 8.png" alt="Ellipse 8" />
            <img src="images/Ellipse 9.png" alt="Ellipse 9" />
            <img src="images/Ellipse 10.png" alt="Ellipse 10" />
            <img src="images/Ellipse 11.png" alt="Ellipse 11" />
          </div>
        </div>
        <div className={styles.pageWrapper}>
          <div className={`${styles.mask} ${styles.maskZoomFadeIn}`}>
            <img src="images/Mask.png" alt="Mask" />
          </div>
          <div className={styles.logimg2}>
            <div
              className={`${styles.logimg} ${styles.animateStep} ${
                step >= 1 ? styles.animateStep1 : ""
              }`}
            >
              <img
                className={styles.logo}
                src="svg/Rexpt-Logo.svg"
                alt="Rexpt-Logo"
              />
            </div>
          </div>

          <div
            className={`${styles.Maincontent} ${styles.animateStep} ${
              step >= 2 ? styles.animateStep2 : ""
            }`}
          >
            <div className={styles.welcomeTitle}>
              <h1>Personal Details</h1>
            </div>
          </div>

          <div
            className={`${styles.container} ${styles.animateStep} ${
              step >= 3 ? styles.animateStep3 : ""
            }`}
          >
            <div className={styles.labReq}>
              <div className={styles.Dblock}>
                <label className={styles.label}>Name</label>
                <input
                  type="text"
                  className={`${styles.input} ${
                    nameError ? styles.inputError : ""
                  }`}
                  placeholder="Your name"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
              {nameError && <p className={styles.inlineError}>{nameError}</p>}
            </div>
            <div className={styles.labReq}>
              <div className={styles.Dblock}>
                <label className={styles.label}>Phone Number</label>
                <PhoneInput
                  country={"in"} 
                  value={phone}
                  onChange={(val) => {
                    setPhone(val);
                    if (phoneSubmitted) {
                      setPhoneError(validatePhone(val));
                    } else {
                      setPhoneError("");
                    }
                  }}
                  inputClass={`${styles.input} ${
                    phoneError ? styles.inputError : ""
                  }`}
                  inputProps={{
                    name: "phone",
                    required: true,
                    autoFocus: false,
                  }}
                />
              </div>
              {phoneError && <p className={styles.inlineError}>{phoneError}</p>}
            </div>
          </div>

          <div
            className={`${styles.Btn} ${styles.animateStep} ${
              step >= 4 ? styles.animateStep4 : ""
            }`}
            onClick={handleLoginClick}
          >
            <div type="submit">
              <div className={styles.btnTheme}>
                <img src="svg/svg-theme.svg" alt="" />
                <p>{loading ? <Loader size={20} /> : "Continue"}</p>
              </div>
            </div>
          </div>

          {showPopup && (
            <PopUp
              type={popupType}
              onClose={() => setShowPopup(false)}
              message={popupMessage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Details;
