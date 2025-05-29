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
  const [note, setNote] = useState("");

  // Inline error states
  const [businessUrlError, setBusinessUrlError] = useState("");
  const [googleListingError, setGoogleListingError] = useState("");
  const [aboutBusinessError, setAboutBusinessError] = useState("");
  const [filesError, setFilesError] = useState("");

  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      alert("You can only upload a maximum of 5 files.");
      return;
    }

    setFiles(selectedFiles);
    if (filesError) setFilesError("");
  };

  // Simple URL validation regex
  const isValidUrl = (url) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol optional
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // domain
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%@_.~+&:]*)*" + // port and path
      "(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?" + // query string
      "(\\#[-a-zA-Z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(url);
  };

  const validateForm = () => {
    let valid = true;

    if (!businessUrl.trim()) {
      setBusinessUrlError("Business URL is required.");
      valid = false;
    } else if (!isValidUrl(businessUrl.trim())) {
      setBusinessUrlError("Please enter a valid URL.");
      valid = false;
    } else {
      setBusinessUrlError("");
    }

    if (!googleListing.trim()) {
      setGoogleListingError("Google Listing URL is required.");
      valid = false;
    } else if (!isValidUrl(googleListing.trim())) {
      setGoogleListingError("Please enter a valid URL.");
      valid = false;
    } else {
      setGoogleListingError("");
    }

    if (!aboutBusiness.trim()) {
      setAboutBusinessError("Business description is required.");
      valid = false;
    } else {
      setAboutBusinessError("");
    }

    if (files.length === 0) {
      setFilesError("At least one file must be uploaded.");
      valid = false;
    } else {
      setFilesError("");
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const business = JSON.parse(sessionStorage.getItem("businessDetails"));

    const mergedUrls = [businessUrl.trim(), googleListing.trim()];

    const formData = new FormData();
    const today = new Date().toISOString().split("T")[0];
    const knowledgeBaseName = `${business?.businessName || "Business"}-${today}`;

    formData.append("knowledge_base_name", knowledgeBaseName);
    formData.append("knowledge_base_urls", JSON.stringify(mergedUrls));
    // formData.append("knowledge_base_texts", JSON.stringify(aboutBusiness)); // Commented out in original

    files.forEach((file) => {
      formData.append("knowledge_base_files", file);
    });

    try {
      setLoading(true);
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

      sessionStorage.setItem("knowledgeBaseId", response.data.knowledge_base_id);

      setPopupType("success");
      setPopupMessage("Knowledge base created successfully!");
      setShowPopup(true);

      setTimeout(() => navigate("/steps"), 1500);
    } catch (error) {
      console.error("Upload failed:", error.response?.data?.message || error.message);
      setPopupType("failed");
      setPopupMessage(error.response?.data?.message || "Internal Server Error");
      setShowPopup(true);
    } finally {
      setLoading(false);
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
                <label htmlFor="business-url">URL (Website)</label>
                <input
                  id="business-url"
                  type="text"
                  placeholder="https://your website url"
                  value={businessUrl}
                  onChange={(e) => {
                    setBusinessUrl(e.target.value);
                    if (businessUrlError) setBusinessUrlError("");
                  }}
                />
              </div>
               {businessUrlError && <p className={styles.inlineError}>{businessUrlError}</p>}
              <div className={styles.formGroup}>
                <label htmlFor="google-listing">Google Listing</label>
                <input
                  id="google-listing"
                  type="text"
                  placeholder="Url"
                  value={googleListing}
                  onChange={(e) => {
                    setGoogleListing(e.target.value);
                    if (googleListingError) setGoogleListingError("");
                  }}
                /> 
              </div>
                {googleListingError && <p className={styles.inlineError}>{googleListingError}</p>}

              <div className={styles.formGroup}>
                <label htmlFor="about-business">More About your Business</label>
                <input
                  id="about-business"
                  type="text"
                  placeholder="Describe"
                  value={aboutBusiness}
                  onChange={(e) => {
                    setAboutBusiness(e.target.value);
                    if (aboutBusinessError) setAboutBusinessError("");
                  }}
                />   
              </div>
               {aboutBusinessError && <p className={styles.inlineError}>{aboutBusinessError}</p>}

              <div className={styles.formGroup}>
                <label htmlFor="file-upload">File Upload</label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
               {filesError && <p className={styles.inlineError}>{filesError}</p>}

              <div className={styles.formGroup}>
                <label htmlFor="additional-note">Additional Note</label>
                <textarea
                  id="additional-note"
                  placeholder="Note"
                  rows="4"
                  cols="50"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className={styles.btnTheme}
                  disabled={loading}
                >
                  <img src="images/svg-theme.svg" alt="" />
                  {loading ? (
                    <>
                      Add <Loader size={20} />
                    </>
                  ) : (
                    <p>Continue</p>
                  )}
                </button>
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
