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
// import React, { useState } from "react";
// import styles from "./UploadProfile.module.css";
// import { API_BASE_URL, updateProfilePicture } from "../../../Store/apiStore";
// import decodeToken from "../../../lib/decodeToken";
// import useUser from "../../../Store/Context/UserContext";

// const UploadProfile = ({ onClose, onUpload }) => {
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const token = localStorage.getItem("token") || "";
//   const decodeTokenData = decodeToken(token)
//   const [userId, setUserId] = useState(decodeTokenData?.id || "");
//   const [profile,setProFile]=useState(null)
//   const {user,setUser}=useUser();
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProFile(file)
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setUploadedImage(reader.result); // Set image for preview
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Function to send image data via FormData to the server
//   const saveImageToServer = async(imageFile) => {
//     // Create a new FormData instance to hold the image file
//     const formData = new FormData();
//     formData.append("profilePicture", profile); // "image" is the key for the uploaded file

//     // Placeholder API call to store the image at your server
//     // fetch("https://your-api-endpoint.com/upload", {
//     //   method: "POST",
//     //   body: formData, // Send the FormData
//     // })
//     //   .then((response) => response.json())
//     //   .then((data) => {
//     //     console.log("Image uploaded successfully", data);
//     //     onUpload(uploadedImage); // Update parent component with the image
//     //     onClose(); // Close the modal after successful upload
//     //   })
//     //   .catch((error) => {
//     //     console.error("Error uploading image:", error);
//     //   });

//     try {
//         const response=await updateProfilePicture(userId,formData)
//         // console.log('profile picture updated',response)
//          setUser({
//            profile:`${API_BASE_URL?.split('/api')[0]}${response?.profilePicture?.split('/public')[1]}` 
//         })
//     } catch (error) {
//         console.log(error,'error while updating profile')
//     }

//     // Placeholder success simulation
//     console.log("Image uploaded successfully (placeholder)");
//     onUpload(uploadedImage); // Update parent component with the image
//     onClose(); // Close the modal
//   };

//   const handleSave = () => {
//     if (uploadedImage) {
//       // Convert base64 back to a Blob for the API call
//       const byteString = atob(uploadedImage.split(",")[1]);
//       const mimeString = uploadedImage.split(",")[0].split(":")[1].split(";")[0];
//       const ab = new ArrayBuffer(byteString.length);
//       const ia = new Uint8Array(ab);
//       for (let i = 0; i < byteString.length; i++) {
//         ia[i] = byteString.charCodeAt(i);
//       }
//       const blob = new Blob([ab], { type: mimeString });

//       saveImageToServer(blob); // Call the API with the Blob
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
//           <button
//             onClick={handleSave}
//             disabled={!uploadedImage} // Enable only when image is uploaded
//             className={uploadedImage ? styles.saveButton : styles.disabledButton}
//           >
//             Save Profile
//           </button>
//           <button onClick={onClose} className={styles.closeButton}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadProfile;

// import React, { useState, useRef, useEffect } from "react";
// import Webcam from "react-webcam";
// import styles from "./UploadProfile.module.css";
// import { API_BASE_URL, updateProfilePicture } from "../../../Store/apiStore";
// import decodeToken from "../../../lib/decodeToken";
// import useUser from "../../../Store/Context/UserContext";

// const UploadProfile = ({ onClose, onUpload }) => {
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [isWebcamOpen, setIsWebcamOpen] = useState(false);
//   const [cameraError, setCameraError] = useState(null); // Track camera errors
//   const webcamRef = useRef(null);
//   const token = localStorage.getItem("token") || "";
//   const decodeTokenData = decodeToken(token);
//   const [userId] = useState(decodeTokenData?.id || "");
//   const [profile, setProfile] = useState(null);
//   const { user, setUser } = useUser();

//   // Handle file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProfile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setUploadedImage(reader.result);
//         setCapturedImage(null);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Capture image from webcam
//   const captureImage = () => {
//     const imageSrc = webcamRef.current?.getScreenshot();
//     if (imageSrc) {
//       setCapturedImage(imageSrc);
//       setUploadedImage(null);
//       const byteString = atob(imageSrc.split(",")[1]);
//       const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
//       const ab = new ArrayBuffer(byteString.length);
//       const ia = new Uint8Array(ab);
//       for (let i = 0; i < byteString.length; i++) {
//         ia[i] = byteString.charCodeAt(i);
//       }
//       const blob = new Blob([ab], { type: mimeString });
//       setProfile(blob);
//     }
//   };

//   // Toggle webcam
//   const toggleWebcam = () => {
//     setIsWebcamOpen(!isWebcamOpen);
//     setUploadedImage(null);
//     setCapturedImage(null);
//     setCameraError(null); // Reset error on toggle
//   };

//   // Save image to server
//   const saveImageToServer = async () => {
//     if (!profile) return;
//     const formData = new FormData();
//     formData.append("profilePicture", profile);

//     try {
//       const response = await updateProfilePicture(userId, formData);
//       const newProfilePicture = `${API_BASE_URL?.split("/api")[0]}${
//         response?.profilePicture?.split("/public")[1]
//       }`;
//       setUser({ ...user, profile: newProfilePicture });
//       onUpload(capturedImage || uploadedImage);
//       onClose();
//     } catch (error) {
//       console.error("Error updating profile picture:", error);
//     }
//   };

//   // Handle save button click
//   const handleSave = () => {
//     if (uploadedImage || capturedImage) {
//       saveImageToServer();
//     }
//   };

//   // Check camera permissions
//   useEffect(() => {
//     if (isWebcamOpen) {
//       navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then(() => {
//           setCameraError(null);
//         })
//         .catch((err) => {
//           setCameraError("Camera access denied or unavailable. Please allow camera permissions.");
//           console.error("Camera error:", err);
//         });
//     }
//   }, [isWebcamOpen]);

//   return (
//     <div className={styles.modalBackdrop} onClick={onClose}>
//       <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
//         <h2 className={styles.modalTitle}>Update Profile Picture</h2>

//         {/* Camera Error Message */}
//         {cameraError && <div className={styles.errorMessage}>{cameraError}</div>}

//         {/* Image Preview */}
//         {(uploadedImage || capturedImage) && (
//           <div className={styles.imagePreview}>
//             <img
//               src={uploadedImage || capturedImage}
//               alt="Preview"
//               className={styles.previewImage}
//             />
//           </div>
//         )}

//         {/* Webcam or Upload Options */}
//         <div className={styles.optionsContainer}>
//           {isWebcamOpen ? (
//             <div className={styles.webcamContainer}>
//               <Webcam
//                 audio={false}
//                 ref={webcamRef}
//                 screenshotFormat="image/jpeg"
//                 className={styles.webcam}
//                 videoConstraints={{ facingMode: "user" }} // Use front-facing camera
//                 onUserMediaError={(err) => {
//                   setCameraError("Failed to access camera: " + err.message);
//                 }}
//               />
//               <div className={styles.webcamButtons}>
//                 <button onClick={captureImage} className={styles.captureButton}>
//                   Capture
//                 </button>
//                 <button onClick={toggleWebcam} className={styles.closeWebcamButton}>
//                   Close Webcam
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className={styles.uploadContainer}>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileUpload}
//                 className={styles.fileInput}
//               />
//               <button onClick={toggleWebcam} className={styles.webcamButton}>
//                 Capture with Webcam
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Buttons */}
//         <div className={styles.buttons}>
//           <button
//             onClick={handleSave}
//             disabled={!uploadedImage && !capturedImage}
//             className={
//               uploadedImage || capturedImage
//                 ? styles.saveButton
//                 : styles.disabledButton
//             }
//           >
//             Save Profile
//           </button>
//           <button onClick={onClose} className={styles.closeButton}>
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadProfile;

import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import styles from "./UploadProfile.module.css";
import { API_BASE_URL, updateProfilePicture } from "../../../Store/apiStore";
import decodeToken from "../../../lib/decodeToken";
import useUser from "../../../Store/Context/UserContext";
import imageCompression from "browser-image-compression";

const compressImage = async (imageFile) => {
  const options = {
    maxSizeMB: 0.1,           // Target size in MB (200 KB)
    maxWidthOrHeight: 800,    // Resize if larger
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  } catch (error) {
    console.error("Compression error:", error);
    return imageFile;
  }
};

const UploadProfile = ({ onClose, onUpload }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const webcamRef = useRef(null);
  const token = localStorage.getItem("token") || "";
  const decodeTokenData = decodeToken(token);
  const [userId] = useState(decodeTokenData?.id || "");
  const [profile, setProfile] = useState(null);
  const { user, setUser } = useUser();

  // Helper to stop webcam stream
  const stopWebcamStream = () => {
    const stream = webcamRef.current?.video?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Handle file upload
  const handleFileUpload = async(event) => {
    event.stopPropagation();
    const file = event.target.files[0];
    if (file) {
       const compressed = await compressImage(file);
      setProfile(compressed);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setCapturedImage(null);
        stopWebcamStream(); // stop if uploading while webcam is open
        setIsWebcamOpen(false);
      };
      reader.readAsDataURL(compressed);
    }
  };

  // Capture image from webcam
  const captureImage = async(e) => {
    e.stopPropagation();
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setUploadedImage(null);

      // Convert to Blob
      const byteString = atob(imageSrc.split(",")[1]);
      const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "webcam.jpg", { type: mimeString });

      const compressed = await compressImage(file);

      setProfile(compressed);

      stopWebcamStream();
      setIsWebcamOpen(false);
    }
  };

  // Toggle webcam
  const toggleWebcam = (e) => {
    e.stopPropagation();
    if (isWebcamOpen) stopWebcamStream();
    setIsWebcamOpen(!isWebcamOpen);
    setUploadedImage(null);
    setCapturedImage(null);
    setCameraError(null);
  };

  // Save image to server
  const saveImageToServer = async (e) => {
    if (!profile) return;
    const formData = new FormData();
    formData.append("profilePicture", profile);

    try {
      const response = await updateProfilePicture(userId, formData);
      const newProfilePicture = `${API_BASE_URL?.split("/api")[0]}${
        response?.profilePicture?.split("/public")[1]
      }`;
      setUser({ ...user, profile: newProfilePicture });
      onUpload(capturedImage || uploadedImage);
      onClose();
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const handleSave = (e) => {
    if (uploadedImage || capturedImage) {
      saveImageToServer();
      stopWebcamStream();
    }
  };

  // Handle camera permission errors
  useEffect(() => {
    if (isWebcamOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => setCameraError(null))
        .catch((err) => {
          setCameraError("Camera access denied or unavailable.");
          console.error("Camera error:", err);
        });
    }
  }, [isWebcamOpen]);

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Update Profile Picture</h2>

        {/* Error */}
        {cameraError && <div className={styles.errorMessage}>{cameraError}</div>}

        {/* Preview */}
        {(uploadedImage || capturedImage) && (
          <div className={styles.imagePreview}>
            <img
              src={uploadedImage || capturedImage}
              alt="Preview"
              className={styles.previewImage}
            />
          </div>
        )}

        {/* Webcam or Upload */}
        <div className={styles.optionsContainer}>
          {isWebcamOpen ? (
            <div className={styles.webcamContainer}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className={styles.webcam}
                videoConstraints={{ facingMode: "user" }}
                onUserMediaError={(err) =>
                  setCameraError("Failed to access camera: " + err.message)
                }
              />
              <div className={styles.webcamButtons}>
                <button onClick={captureImage} className={styles.captureButton}>
                  Capture
                </button>
                <button onClick={toggleWebcam} className={styles.closeWebcamButton}>
                  Close Camera
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.uploadContainer}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className={styles.fileInput}
              />
              {!uploadedImage && !capturedImage && (
                <button onClick={toggleWebcam} className={styles.webcamButton}>
                  Capture with Camera
                </button>
              )}
            </div>
          )}
        </div>

        {/* Re-upload or Re-capture */}
        {(capturedImage) && !isWebcamOpen && (
          <div className={styles.retryButtonContainer}>
            <button onClick={toggleWebcam} className={styles.webcamButton}>
              {uploadedImage ? "Re-upload" : "Re-capture"}
            </button>
          </div>
        )}

        {/* Save and Close */}
        <div className={styles.buttons}>
          <button
            onClick={handleSave}
            disabled={!uploadedImage && !capturedImage}
            className={
              uploadedImage || capturedImage
                ? styles.saveButton
                : styles.disabledButton
            }
          >
            Save Profile
          </button>
          <button
            onClick={() => {
              stopWebcamStream(); // stop stream on close
              onClose();
            }}
            className={styles.closeButton}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadProfile;
