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

const UploadProfile = ({ onClose, onUpload }) => {
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        onUpload(reader.result); // Send uploaded image to parent

        // Placeholder: Call the function to save the image to the server
        // saveImageToServer(file); // Send the raw file for FormData
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to send image data via FormData to the server
//   const saveImageToServer = (imageFile) => {
//     // Create a new FormData instance to hold the image file
//     const formData = new FormData();
//     formData.append("image", imageFile); // "image" is the key for the uploaded file

//     // Example of sending the FormData to the server via fetch
//     // Replace the URL with your actual API endpoint
//     fetch("https://your-api-endpoint.com/upload", {
//       method: "POST",
//       body: formData, // Send the FormData
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Image uploaded successfully", data);
//       })
//       .catch((error) => {
//         console.error("Error uploading image:", error);
//       });
//   };

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
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default UploadProfile;
