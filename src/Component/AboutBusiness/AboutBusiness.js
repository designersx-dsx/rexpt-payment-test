import React, { useState } from 'react'
import styles from '../AboutBusiness/AboutBusiness.module.css'
import axios from 'axios';
function AboutBusiness() {
  const [files, setFiles] = useState([]);
  const [businessUrl, setBusinessUrl] = useState("");
  const [googleListing, setGoogleListing] = useState("");
  const [aboutBusiness, setAboutBusiness] = useState("");
  const [note, setNote] = useState("");
      const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      alert("You can only upload a maximum of 5 files.");
      return;
    }

    setFiles(selectedFiles);
  };
  console.log('files',files)

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    const mergedUrls=[businessUrl,googleListing]

    const formData = new FormData();
    formData.append("knowledge_base_name", "Sample KB");
    const texts = [
    {
        text: "Hello, how are you?",
        title: "Sample Question",
    },
    ];
    const urls = [
    "https://www.retellai.com",
    "https://docs.retellai.com",
    ];
    formData.append("knowledge_base_urls", JSON.stringify(mergedUrls));
    // formData.append("knowledge_base_texts", JSON.stringify(aboutBusiness));
    files.forEach((file) => {
    formData.append("knowledge_base_files", file);
    });

        try {
        const response = await axios.post(
            'https://api.retellai.com/create-knowledge-base',
            formData,
            {
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                'Content-Type': 'multipart/form-data',
            },
            }
        );

        console.log("Upload success:", response);
        sessionStorage.setItem("knowledgeBaseId", response.data.knowledge_base_id);
        alert("Knowledge base created successfully!");
        } catch (error) {
        console.error("Upload failed:", error);
        alert("Knowledge base creation failed. Please try again.");
        }

  };

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>About Your Business</h1>
                </div>

                <div className={styles.form}>

                    <div className={styles.formGroup}>
                        <label htmlFor="business-name">URL (Website)</label>
                        <input type="text" placeholder='https://your website url' onChange={(e) => setBusinessUrl(e.target.value)}/>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="business-name">Google Listing</label>
                        <input type="text" placeholder='15'   onChange={(e) => setGoogleListing(e.target.value)}/>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="business-name">More About your Business</label>
                        <input type="text" placeholder='Describe' onChange={(e) => setAboutBusiness(e.target.value)}/>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="business-name">File Upload</label>
                        <input type="file" placeholder='Attached file' multiple onChange={handleFileChange}/>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="business-name">Additional Note</label>
                        <textarea placeholder='Note' rows="4" cols="50"  onChange={(e) => setNote(e.target.value)}></textarea>
                    </div>

                    <div className={styles.Btn} >
                        <button type="submit" onClick={handleSubmit}>Continue
                            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.3379 20.0391C13.9955 20.0391 13.6682 19.9595 13.3564 19.8027C12.9671 19.583 12.6561 19.2358 12.4844 18.8271C12.375 18.5441 12.2041 17.6951 12.2041 17.6797C12.0466 16.8233 11.9545 15.4716 11.9414 13.957L11.9404 13.5752C11.9404 11.9884 12.0329 10.5418 12.1729 9.59863L12.2959 9.01172C12.3641 8.70119 12.4534 8.34754 12.5469 8.16699C12.8892 7.50651 13.5589 7.09766 14.2754 7.09766H14.3379C14.803 7.11311 15.7779 7.5196 15.7861 7.53711C17.3649 8.19953 20.4105 10.1987 21.8174 11.624L22.2266 12.0527C22.3335 12.1686 22.4537 12.3062 22.5283 12.4131C22.7776 12.7433 22.9023 13.152 22.9023 13.5605C22.9023 14.0164 22.7625 14.4404 22.498 14.7871L22.0781 15.2402L21.9834 15.3369C20.707 16.7208 17.3744 18.9841 15.6309 19.6768L15.3672 19.7773C15.0505 19.8909 14.607 20.0265 14.3379 20.0391ZM5.11133 15.2051C4.21635 15.2049 3.49043 14.4721 3.49023 13.5684C3.49023 12.6645 4.21623 11.9309 5.11133 11.9307L9.10156 12.2842C9.80369 12.2844 10.373 12.8593 10.373 13.5684C10.3729 14.2784 9.80358 14.8523 9.10156 14.8525L5.11133 15.2051Z" fill="white" />
                            </svg>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutBusiness