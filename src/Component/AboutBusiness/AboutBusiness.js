import React, { useState } from "react";
import styles from "../AboutBusiness/AboutBusiness.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PopUp from "../Popup/Popup";
import Loader from "../Loader/Loader";
function AboutBusiness() {
  const [files, setFiles] = useState([]);
  const [businessUrl, setBusinessUrl] = useState("");
  const [googleListing, setGoogleListing] = useState("");
  const [aboutBusiness, setAboutBusiness] = useState("");
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      alert("You can only upload a maximum of 5 files.");
      return;
    }

    setFiles(selectedFiles);
  };

  console.log("files", files);

  const validateForm = () => {
    if (!businessUrl.trim()) {
      setPopupType("failed");
      setPopupMessage("Business URL is required.");
      setShowPopup(true);
      return false;
    }

    if (!googleListing.trim()) {
      setPopupType("failed");
      setPopupMessage("Google Listing URL is required.");
      setShowPopup(true);
      return false;
    }

    if (!aboutBusiness.trim()) {
      setPopupType("failed");
      setPopupMessage("Business description is required.");
      setShowPopup(true);
      return false;
    }

    if (files.length === 0) {
      setPopupType("failed");
      setPopupMessage("At least one file must be uploaded.");
      setShowPopup(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const business = JSON.parse(sessionStorage.getItem("businessDetails"));
    console.log("businessName", business);

    if (!validateForm()) return;

    const mergedUrls = [businessUrl, googleListing];

    const formData = new FormData();
    const today = new Date().toISOString().split("T")[0];
    const knowledgeBaseName = `${business?.businessName || 'Business'}-${today}`;

    formData.append("knowledge_base_name", knowledgeBaseName);
    const texts = [
      {
        text: "Hello, how are you?",
        title: "Sample Question",
      },
    ];
    const urls = ["https://www.retellai.com", "https://docs.retellai.com"];
    formData.append("knowledge_base_urls", JSON.stringify(mergedUrls));
    // formData.append("knowledge_base_texts", JSON.stringify(aboutBusiness));
    files.forEach((file) => {
      formData.append("knowledge_base_files", file);
    });
    //create knowledge base
    try {
      setLoading(true)
      console.log(process.env.REACT_APP_API_RETELL_API)
      const response = await axios.post(
        "https://api.retellai.com/create-knowledge-base",
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload success:", response);
      sessionStorage.setItem(
        "knowledgeBaseId",
        response.data.knowledge_base_id
      );
      setPopupType("success");
      setPopupMessage("Knowledge base created successfully!");
      setShowPopup(true);
      setTimeout(() => navigate("/steps"), 1500);
      setLoading(false)
    } catch (error) {
      console.error("Upload failed:", error.response.data.message);
      setPopupType("failed");
      setPopupMessage(error.response.data.message || "Internal Server Error");
      setShowPopup(true);
      setLoading(false)
    } finally {
      setLoading(false)
    }


  };

  return (
    <>
      <div>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>About Your Business</h1>
          </div>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="business-name">URL (Website)</label>
                <input
                  type="text"
                  placeholder="https://your website url"
                  onChange={(e) => setBusinessUrl(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="business-name">Google Listing</label>
                <input
                  type="text"
                  placeholder="Url"
                  onChange={(e) => setGoogleListing(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="business-name">More About your Business</label>
                <input
                  type="text"
                  placeholder="Describe"
                  onChange={(e) => setAboutBusiness(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="business-name">File Upload</label>
                <input
                  type="file"
                  placeholder="Attached file"
                  multiple
                  onChange={handleFileChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="business-name">Additional Note</label>
                <textarea
                  placeholder="Note"
                  rows="4"
                  cols="50"
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>
              <div >
                <div type="submit">


                  {loading ? <>Add <Loader size={20} /></> : <>
                    <div className={styles.btnTheme}>
                                  <img src='images/svg-theme.svg' alt='' />
                                  <p>Continue</p>
                              </div>
                    </>}
                </div>
              </div>
            </div>
          </form>
        </div>
        {showPopup && (
          <PopUp
            type={popupType}
            onClose={() => setShowPopup(false)}
            message={popupMessage}
          />
        )}
      </div>
    </>
  );
}

export default AboutBusiness;
