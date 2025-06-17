import React, { useRef, useState, useEffect } from "react";
import styles from "../EditProfile/EditProfile.module.css";
import { API_BASE_URL, getUserDetails, updateUserDetails } from "../../Store/apiStore";
import UploadProfile from "../Popup/profilePictureUpdater/UploadProfile";

const EditProfile = () => {
  const fileInputRef = useRef(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: "Images/editProfile.png",
  });

  const [loading, setLoading] = useState(false);
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


 useEffect(() => {
  const fetchUser = async () => {
    try {
      setLoading(true);
      const user = await getUserDetails();
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        profilePicture: `${API_BASE_URL?.split("/api")[0]}${user?.profilePicture?.split("public")[1]
                      }`  , 
      });
     console.log(user) 
    }
    catch (error) {
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateUserDetails({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.profilePic}>
        <button
          onClick={openUploadModal}
          style={{ all: "unset", cursor: "pointer" }}
        >
          <img
  src={
    uploadedImage ||
    formData.profilePicture || 
    "Images/editProfile.png"
  }
  alt="Profile"
/>

          <span className={styles.editIcon}>
            <img src="Svg/edit-icon.svg" alt="edit" />
          </span>
        </button>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.header}>
          <h3>Personal Info</h3>
          {/* <span className={styles.editText}><img src='Svg/edit-icon2.svg' className={styles.PurpolIcon} />Edit</span> */}
        </div>

        <div className={styles.Part}>
          <img src="Svg/line-Profile.svg" />
          <div className={styles.infoItem}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.Part}>
          <img src="Svg/line-email.svg" />
          <div className={styles.infoItem}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.Part}>
          <img src="Svg/line-Call.svg" />
          <div className={styles.infoItem}>
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.Part}>
          <img src="Svg/line-address.svg" />
          <div className={styles.infoItem}>
            <label>Home address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div type="submit" onClick={handleSubmit}>
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
    </div>
  );
};

export default EditProfile;
