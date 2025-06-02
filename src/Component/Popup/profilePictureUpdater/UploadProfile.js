// import React, { useState } from "react";
// import styles from "./UploadProfile.module.css";

// const UploadProfile = ({ onClose, onUpload }) => {
//   const [uploadedImage, setUploadedImage] = useState(null);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setUploadedImage(reader.result);
//         onUpload(reader.result); // Send uploaded image to parent
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className={styles.modalBackdrop} onClick={onClose}>
//       <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
//         <h2>Upload Profile Picture</h2>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileUpload}
//           className={styles.fileInput}
//         />
//         {uploadedImage && (
//           <div className={styles.imagePreview}>
//             <img src={uploadedImage} alt="Preview" />
//           </div>
//         )}
//         <div className={styles.buttons}>
//           <button onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadProfile;
import React, { useState } from "react";
import styles from "./UploadProfile.module.css";
import { updateProfilePicture } from "../../../Store/apiStore";
import decodeToken from "../../../lib/decodeToken";
import useUser from "../../../Store/Context/UserContext";

const UploadProfile = ({ onClose, onUpload }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const token = localStorage.getItem("token") || "";
  const decodeTokenData = decodeToken(token)
  const [userId, setUserId] = useState(decodeTokenData?.id || "");
  const [profile,setProFile]=useState(null)
  const {user,setUser}=useUser();
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProFile(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result); // Set image for preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to send image data via FormData to the server
  const saveImageToServer = async(imageFile) => {
    // Create a new FormData instance to hold the image file
    const formData = new FormData();
    formData.append("profilePicture", profile); // "image" is the key for the uploaded file

    // Placeholder API call to store the image at your server
    // fetch("https://your-api-endpoint.com/upload", {
    //   method: "POST",
    //   body: formData, // Send the FormData
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Image uploaded successfully", data);
    //     onUpload(uploadedImage); // Update parent component with the image
    //     onClose(); // Close the modal after successful upload
    //   })
    //   .catch((error) => {
    //     console.error("Error uploading image:", error);
    //   });

    try {
        const response=await updateProfilePicture(userId,formData)
        console.log('profile picture updated',response)
         setUser({
           profile:`${API_BASE_URL?.split('/api')[0]}${response?.profilePicture?.split('public')[1]}` 
        })
    } catch (error) {
        console.log(error,'error while updating profile')
    }

    // Placeholder success simulation
    console.log("Image uploaded successfully (placeholder)");
    onUpload(uploadedImage); // Update parent component with the image
    onClose(); // Close the modal
  };

  const handleSave = () => {
    if (uploadedImage) {
      // Convert base64 back to a Blob for the API call
      const byteString = atob(uploadedImage.split(",")[1]);
      const mimeString = uploadedImage.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      saveImageToServer(blob); // Call the API with the Blob
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <h2>Upload Profile Picture</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className={styles.fileInput}
        />
        {uploadedImage && (
          <div className={styles.imagePreview}>
            <img src={uploadedImage} alt="Preview" />
          </div>
        )}
        <div className={styles.buttons}>
          <button
            onClick={handleSave}
            disabled={!uploadedImage} // Enable only when image is uploaded
            className={uploadedImage ? styles.saveButton : styles.disabledButton}
          >
            Save Profile
          </button>
          <button onClick={onClose} className={styles.closeButton}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default UploadProfile;