import React, { useRef, useState, useEffect } from "react";
import styles from "../EditProfile/EditProfile.module.css";
import {
  API_BASE_URL,
  getUserDetails,
  updateUserDetails,
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
  const [addLoading,addSetLoading]=useState(false)
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone)) {
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
  return (
    <>
      {loading ? (
        <Loader2 />
      ) : (
        <div className={styles.card}>
          <div className={styles.backIcon}>
            <img
              src="svg/Notification.svg"
              alt="Back-icon"
              className={styles.imageIcon}
              onClick={handleBack}
            />
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
                    e.target.src = "images/camera-icon.avif";
                  }}
                  alt="Profile"
                />
              ) : (
                <img
                  src={"/images/camera-icon.avif"}
                  onError={(e) => {
                    e.target.src = "images/camera-icon.avif";
                  }}
                  alt="Profile"
                />
              )}

              <span className={styles.editIcon}>
                <img src="svg/edit-icon.svg" alt="edit" />
              </span>
            </button>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.header}>
              <h3>Personal Info</h3>
              {/* <span className={styles.editText}><img src='Svg/edit-icon2.svg' className={styles.PurpolIcon} />Edit</span> */}
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
                {errors.name && <p className={styles.error}>{errors.name}</p>}
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
                {errors.email && <p className={styles.error}>{errors.email}</p>}
              </div>
            </div>

            <div className={styles.Part}>
              <img src="svg/line-Call.svg" />
              <div className={styles.infoItem}>
                <label>Phone Number</label>
                <PhoneInput
                  country={"in"}
                  value={formData.phone}
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
                {errors.phone && <p className={styles.error}>{errors.phone}</p>}
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
                  maxLength={400}
                />
              </div>
            </div>
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

          <div
            type="submit"
            onClick={isDataChanged() && !loading ? handleSubmit : undefined}
            style={{
              opacity: isDataChanged() ? 1 : 0.5,
              pointerEvents: isDataChanged() ? "auto" : "none",
            }}
          >
            <div className={styles.btnTheme}>
              <img src="svg/svg-theme.svg" alt="" />
              <p>{loading ? "Saving..." : "Save"}</p>
            </div>

          </div>
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
          {showPopup && (
            <PopUp
              type={popupType}
              onClose={() => handleClosePopup()}
              message={popupMessage}
            />
          )}
        </div>

      </div>
      <div type="submit" onClick={isDataChanged() && !addLoading ? handleSubmit : undefined}
        style={{ opacity: isDataChanged() ? 1 : 0.5, pointerEvents: isDataChanged() ? "auto" : "none" }} >
        <div className={styles.btnTheme}>
          <img src="svg/svg-theme.svg" alt="" />
          <p  >{addLoading ? <>Saving... &nbsp; <Loader size={18}/></> : "Save"}</p>
        </div>
      </div>
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
