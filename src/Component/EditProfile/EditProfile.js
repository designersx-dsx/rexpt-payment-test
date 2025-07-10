import React, { useRef, useState, useEffect } from "react";
import styles from "../EditProfile/EditProfile.module.css";
import Refferal from "../Refferal/Refferal";
import MySubscription from "../MySubscription/MySubscription";
import BillingInvoices from "../BillingInvoices/BillingInvoices";
import {
  API_BASE_URL,
  deleteUser,
  getUserDetails,
  LoginWithEmailOTP,
  updateEmailSendOtp,
  updateUserDetails,
  verifyEmailOTP,
} from "../../Store/apiStore";
import UploadProfile from "../Popup/profilePictureUpdater/UploadProfile";
import decodeToken from "../../lib/decodeToken";
import PopUp from "../Popup/Popup";
import useUser from "../../Store/Context/UserContext";
import { useNavigate } from "react-router-dom";
import Loader2 from "../Loader2/Loader2";

import Loader from "../Loader/Loader";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";

const EditProfile = () => {
  const fileInputRef = useRef(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const token = localStorage.getItem("token");
  const decodeTokenData = decodeToken(token);
  const userId = decodeTokenData?.id;
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addLoading, addSetLoading] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [showDashboardReferral, setShowDashboardReferral] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);
  const [otpEmail, setOtpEmail] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const isOtpFilled = otp.every((digit) => digit !== "");

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleUpload = (imageUrl) => {
    setUploadedImage(imageUrl);
    setFormData((prev) => ({
      ...prev,
      profilePicture: imageUrl,
    }));
  };

  const isDataChanged = () => {
    if (!initialData) return false;

    const { name, email, phone, address } = formData;
    const {
      name: initialName,
      email: initialEmail,
      phone: initialPhone,
      address: initialAddress,
    } = initialData;

    return (
      name !== initialName ||
      email !== initialEmail ||
      phone !== initialPhone ||
      address !== initialAddress
    );
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await getUserDetails(userId);
        setReferralCode(user?.referralCode);
        setShowDashboardReferral(user?.showreferralfloating);
        localStorage.setItem(
          "showreferralfloating",
          user?.showreferralfloating
        );
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          profilePicture: `${API_BASE_URL?.split("/api")[0]}${
            user?.profilePicture?.split("public")[1]
          }`,
        });
        setInitialData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          profilePicture: `${API_BASE_URL?.split("/api")[0]}${
            user?.profilePicture?.split("public")[1]
          }`,
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email" && value !== initialData?.email) {
      setEmailVerified(false);
      setOtpSent(false);
      setOtp(["", "", "", "", "", ""]);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSendOTP = async () => {
    try {
      setSendOtpLoading(true);
      await updateEmailSendOtp(formData.email, userId); 
      setOtpSent(true);
      setOtpEmail(formData.email);
      setResendTimer(60);
      setIsResendDisabled(true);
      setShowPopup(true);
      setPopupType("success");
      setPopupMessage("One Time Password sent successfully!");
      const timerInterval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      // alert("Failed to send OTP. Please try again.");
      if (error.status == 409) {
        // setEmailVerified(true);
        setOtpSent(false);
        setShowPopup(true);
        setPopupType("failed");
        setPopupMessage(
          error?.response?.data.error || "Failed to send OTP. Please try again."
        );
        setOtpSent(true);
      } else {
        setOtpSent(false);
        setShowPopup(true);
        setPopupType("failed");
        setPopupMessage(
          error?.response?.data.error || "Failed to send OTP. Please try again."
        );
      }
    } finally {
      setSendOtpLoading(false);
    }
  };
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleVerifyOtp = async () => {
    try {
      setIsVerifyingOtp(true);
      const code = otp.join("");

      // API to verify
      const verified = await verifyEmailOTP(otpEmail, code); // <-- create this API

      if (verified) {
        setEmailVerified(true);
        setShowPopup(true);
        setPopupType("success");
        setPopupMessage("Email verified successfully!");
      } else {
        setShowPopup(true);
        setPopupType("failed");
        setPopupMessage("Incorrect OTP. Try again.");
      }
    } catch (err) {
      setShowPopup(true);
      setPopupType("failed");
      setPopupMessage("Verification failed.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Optional Name Validation
    if (!formData.name) {
      newErrors.name = "Name is required.";
    }
    // Conditional Email & Phone validation
    if (!formData.email && !formData.phone) {
      newErrors.email = "Email is required if phone is not provided.";
      newErrors.phone = "Phone is required if email is not provided.";
    } else {
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        newErrors.email = "Invalid email format.";
      }

      if (formData.phone && !/^\+?\d{12,15}$/.test(formData.phone)) {
        newErrors.phone = "Enter a valid phone number with country code.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      addSetLoading(true);

      const response = await updateUserDetails(userId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });
      console.log(response.user.profilePicture, "response42343243242");
      setUser({ name: formData?.name, profile: formData?.profilePicture });

      setInitialData({ ...formData });
      setShowPopup(true);
      setPopupType("success");
      setPopupMessage("Profile updated successfully!");
      setTimeout(() => {
        handleClosePopup();
      }, 2000);
    } catch (error) {
      console.error(error);
      setShowPopup(true);
      setPopupType("failed");
      setPopupMessage("Failed to update profile.");
    } finally {
      addSetLoading(false);
    }
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleBack = () => {
    navigate(-1);
  };
  const handleDeleteProfile = async () => {
  try {
setLoading(true);
    await deleteUser(userId);
    setShowDeleteModal(false);
    setShowPopup(true);
    setPopupType("success");
    setPopupMessage("Your account has been deleted successfully.");

    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    }, 2000);
  } catch (error) {
    console.error(error);
    setShowPopup(true);
    setPopupType("failed");
    setPopupMessage("Failed to delete account. Please try again.");
  } finally {
    setLoading(false);
  }
};

  // console.log('showDashboardReferral',showDashboardReferral)

  return (
    <>
      {loading ? (
        <Loader2 />
      ) : (
        <>
          <div className={styles.card}>
            <div className={styles.profileBack}>
              <div className={styles.backIcon}>
                <img
                  src="svg/Notification.svg"
                  alt="Back-icon"
                  className={styles.imageIcon}
                  onClick={handleBack}
                />
                <p>My Account</p>
              </div>

              <div className={styles.profilePic}>
                <button
                  onClick={openUploadModal}
                  style={{ all: "unset", cursor: "pointer" }}
                >
                  {formData?.profilePicture ? (
                    <img
                      src={uploadedImage || formData.profilePicture}
                      onError={(e) => {
                        e.target.src = "/svg/profile-icon.svg";
                      }}
                      alt="Profile"
                    />
                  ) : (
                    <img
                      src={"/svg/profile-icon.svg"}
                      onError={(e) => {
                        e.target.src = "/svg/profile-icon.svg";
                      }}
                      alt="Profile"
                    />
                  )}

                  <span className={styles.editIcon}>
                    <img src="svg/edit-icon.svg" alt="edit" />
                  </span>
                </button>
              </div>
            </div>

            <div className={styles.allsectionDiv}>
              <div className={styles.infoSection}>
                <div className={styles.header}>
                  <h3>Personal Info</h3>
                  <span className={styles.editText}>
                    <img
                      src="/svg/edit-icon2.svg"
                      className={styles.PurpolIcon}
                    />
                    Edit
                  </span>
                </div>

                <div className={styles.Part}>
                  <img src="svg/line-Profile.svg" />
                  <div className={styles.infoItem}>
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      maxLength={100}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <p className={styles.error}>{errors.name}</p>
                    )}
                    <hr className={styles.hrLine} />
                  </div>
                </div>
                <div className={styles.Part}>
                  <img src="svg/line-email.svg" />
                  <div className={styles.infoItem}>
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className={styles.error}>{errors.email}</p>
                    )}
                    <hr className={styles.hrLine} />
                  </div>
                </div>

                {!emailVerified && formData.email !== initialData?.email && (
                  <>
                    {/* Show Send OTP Button */}
                    {!otpSent && (
                      <div
                        className={styles.Btn}
                        onClick={() => {
                          if (
                            !formData.email ||
                            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                          ) {
                            setShowPopup(true);
                            setPopupType("failed");
                            setPopupMessage(
                              "Please enter a valid email before sending OTP."
                            );
                            return;
                          }
                          handleSendOTP();
                        }}
                      >
                        <div className={styles.btnTheme}>
                          <img src="svg/svg-theme.svg" alt="" />
                          <p>
                            {sendOtpLoading ? <Loader size={18} /> : "Send OTP"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Show OTP Input UI if OTP sent */}
                    {otpSent && (
                      <>
                        {/* {formData.email && (
                        <p className={styles.codeText}>
                          Email has been sent to <strong>{formData.email}</strong>
                        </p>
                      )} */}
                        <p className={styles.codeText}>
                          Enter the code sent to your email
                        </p>
                        <br />
                        <div className={styles.otpContainer}>
                          {[...Array(6)].map((_, i) => (
                            <input
                              key={i}
                              maxLength="1"
                              value={otp[i]}
                              onChange={(e) =>
                                handleOtpChange(e.target.value, i)
                              }
                              className={styles.otpInput}
                              onKeyDown={(e) => handleKeyDown(e, i)}
                              ref={(el) => (inputRefs.current[i] = el)}
                              inputMode="numeric"
                              type="tel"
                            />
                          ))}
                        </div>

                        {/* Resend OTP */}
                        <div className={styles.resendContainer}>
                          <button
                            type="button"
                            onClick={handleSendOTP}
                            disabled={isResendDisabled}
                            style={{
                              cursor: isResendDisabled
                                ? "not-allowed"
                                : "pointer",
                              opacity: isResendDisabled ? 0.5 : 1,
                              background: "none",
                              border: "none",
                              color: "#6524EB",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            {isResendDisabled
                              ? `Resend OTP in ${String(
                                  Math.floor(resendTimer / 60)
                                ).padStart(2, "0")}:${String(
                                  resendTimer % 60
                                ).padStart(2, "0")}`
                              : "Resend OTP"}
                          </button>
                        </div>
                        {/* Verify Button */}
                        <div
                          className={styles.Btn}
                          onClick={
                            isOtpFilled && !isVerifyingOtp
                              ? handleVerifyOtp
                              : undefined
                          }
                          style={{
                            opacity: isOtpFilled && !isVerifyingOtp ? 1 : 0.5,
                            pointerEvents:
                              isOtpFilled && !isVerifyingOtp ? "auto" : "none",
                            cursor:
                              isOtpFilled && !isVerifyingOtp
                                ? "pointer"
                                : "not-allowed",
                          }}
                        >
                          <div type="submit">
                            <div className={styles.btnTheme}>
                              <img src="svg/svg-theme.svg" alt="" />
                              <p>
                                {isVerifyingOtp ? (
                                  <Loader size={17} />
                                ) : (
                                  "Verify Email"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
                <div className={styles.Part}>
                  <img src="svg/line-Call.svg" />
                  <div className={styles.infoItem}>
                    <label>Phone Number</label>
                    <PhoneInput
                      country={"in"}
                      value={formData.phone}
                      className={styles.phoneInput}
                      onChange={(val) => {
                        setFormData((prev) => ({
                          ...prev,
                          phone: val,
                        }));
                        if (errors.phone) {
                          setErrors((prev) => ({ ...prev, phone: "" }));
                        }
                      }}
                      inputClass={errors.phone ? styles.inputError : ""}
                      inputProps={{
                        name: "phone",
                        required: true,
                        autoFocus: false,
                      }}
                    />
                    {errors.phone && (
                      <p className={styles.error}>{errors.phone}</p>
                    )}
                    <hr className={styles.hrLine} />
                  </div>
                </div>
                <div className={styles.Part}>
                  <img src="svg/line-address.svg" />
                  <div className={styles.infoItem}>
                    <label>Home address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      maxLength={10000}
                    />

                    {isUploadModalOpen && (
                      <UploadProfile
                        onClose={closeUploadModal}
                        onUpload={handleUpload}
                        currentProfile={
                          uploadedImage ||
                          formData.profilePicture ||
                          "Images/editProfile.png"
                        }
                      />
                    )}
                  </div>
                </div>
                <div
                  type="submit"
                  onClick={
                    isDataChanged() && !addLoading
                      ? formData.email === initialData?.email || emailVerified
                        ? handleSubmit
                        : () => {
                            setShowPopup(true);
                            setPopupType("failed");
                            setPopupMessage(
                              "Please verify your new email before saving."
                            );
                          }
                      : undefined
                  }
                  // style={{
                  //   opacity:
                  //     isDataChanged() &&
                  //       (formData.email === initialData?.email || (emailVerified && !otpSent))
                  //       ? 1
                  //       : 0.5,
                  //   pointerEvents:
                  //     isDataChanged() &&
                  //       (formData.email === initialData?.email || (emailVerified && !otpSent)) &&
                  //       !addLoading
                  //       ? "auto"
                  //       : "none",
                  //   cursor:
                  //     isDataChanged() &&
                  //       (formData.email === initialData?.email || (emailVerified && !otpSent)) &&
                  //       !addLoading
                  //       ? "pointer"
                  //       : "not-allowed",
                  // }}
                  style={{
                    opacity:
                      isDataChanged() &&
                      (formData.email === initialData?.email || // email not changed
                        (formData.email !== initialData?.email &&
                          emailVerified)) // email changed & verified
                        ? 1
                        : 0.5,
                    pointerEvents:
                      isDataChanged() &&
                      (formData.email === initialData?.email ||
                        (formData.email !== initialData?.email &&
                          emailVerified)) &&
                      !addLoading
                        ? "auto"
                        : "none",
                    cursor:
                      isDataChanged() &&
                      (formData.email === initialData?.email ||
                        (formData.email !== initialData?.email &&
                          emailVerified)) &&
                      !addLoading
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  <div className={styles.btnTheme}>
                    <img src="svg/svg-theme.svg" alt="" />
                    <p>
                      {addLoading ? (
                        <>
                          Saving... &nbsp; <Loader size={18} />
                        </>
                      ) : (
                        "Save"
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.RefferalMain}>
                <Refferal
                  referralCode={referralCode}
                  setShowDashboardReferral={setShowDashboardReferral}
                  showDashboardReferral={showDashboardReferral}
                  userId={userId}
                />
              </div>
              <div className={styles.mySubscription}>
                <MySubscription />
              </div>
              <div className={styles.billingInvoice}>
                <BillingInvoices />
              </div>
            </div>
            {/* <div className={styles.deleteSection}>
              <button
                className={styles.deleteButton}
                onClick={() => setShowDeleteModal(true)}
              >
                <img src="/svg/delete-icon.svg" alt="delete" />
                Delete Profile
              </button>
            </div>
            {showDeleteModal && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h3>Delete Your Profile?</h3>
                  <p>
                    Deleting your profile will permanently remove all your data
                    including agents, business information, and usage history.{" "}
                    <br />
                    <strong>
                      This action is irreversible and no refunds will be
                      provided.
                    </strong>
                  </p>
                  <div className={styles.modalButtons}>
                    <button
                      className={styles.deleteConfirmButton}
                     onClick={handleDeleteProfile}
                    >
                      {addLoading ? <Loader size={18} /> : "Delete Profile"}
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </>
      )}
      {showPopup && (
        <PopUp
          type={popupType}
          onClose={() => handleClosePopup()}
          message={popupMessage}
        />
      )}
    </>
  );
};

export default EditProfile;
