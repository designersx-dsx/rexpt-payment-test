import React, { useState, useEffect } from "react";
import styles from "../AboutBusiness/AboutBusiness.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PopUp from "../Popup/Popup";
import Loader from "../Loader/Loader";
import { listAgents } from "../../Store/apiStore";
import decodeToken from "../../lib/decodeToken";

// Convert File → base64 data URL
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.readAsDataURL(file);
    r.onload = () => resolve(r.result);
    r.onerror = reject;
  });

// Convert data URL → File (used when re-hydrating)
const dataURLtoFile = (dataUrl, fileName = "file") => {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const bytes = atob(base64);
  const buf = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i);
  return new File([buf], fileName, { type: mime });
}

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

  // Submission flags
  const [businessUrlSubmitted, setBusinessUrlSubmitted] = useState(false);
  const [googleListingSubmitted, setGoogleListingSubmitted] = useState(false);
  const [aboutBusinessSubmitted, setAboutBusinessSubmitted] = useState(false);
  const [filesSubmitted, setFilesSubmitted] = useState(false);

  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agentCount, setAgentCount] = useState(0);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const HTTPS_PREFIX = "https://";
  const PREFIX_LEN = HTTPS_PREFIX.length;
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const decodeTokenData = decodeToken(token)
  const [userId, setUserId] = useState(decodeTokenData?.id || "");
  useEffect(() => {
    if (token) {
      setUserId(decodeTokenData.id || "");
    }
  }, [token]);
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem("aboutBusinessForm") || "{}");
    if (saved.businessUrl) setBusinessUrl(saved.businessUrl);
    if (saved.googleListing) setGoogleListing(saved.googleListing);
    if (saved.aboutBusiness) setAboutBusiness(saved.aboutBusiness);
    if (saved.note) setNote(saved.note);

    // rebuild File objects
    if (Array.isArray(saved.files) && saved.files.length) {
      const rebuilt = saved.files.map((d, i) => dataURLtoFile(d, `file${i + 1}`));
      setFiles(rebuilt);
    }
  }, []);

  useEffect(() => {
    // Try to get previously stored files
    const existing = sessionStorage.getItem("aboutBusinessForm");
    let previousFiles = [];

    if (existing) {
      try {
        previousFiles = JSON.parse(existing).files || [];
      } catch (e) {
        previousFiles = [];
      }
    }

    // Save updated form with preserved files
    sessionStorage.setItem(
      "aboutBusinessForm",
      JSON.stringify({
        businessUrl,
        googleListing,
        aboutBusiness,
        note,
        files: previousFiles
      })
    );
  }, [businessUrl, googleListing, aboutBusiness, note]);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    // block disallowed file types
    const ALLOWED = ["application/pdf", "text/plain", "text/csv", "application/json", "text/markdown"];
    const invalid = selectedFiles.filter(f => !ALLOWED.includes(f.type));
    if (invalid.length) {
      alert(`Only PDF or text files are allowed.\nBlocked: ${invalid.map(i => i.name).join(", ")}`);
      return;
    }
    //allow files


    if (selectedFiles.length > 5) {
      alert("You can only upload a maximum of 5 files.");
      return;
    }

    setFiles(selectedFiles);
    if (filesSubmitted) setFilesError(validateFiles(selectedFiles));

    // ⬇️  convert to base64 and cache
    const base64 = await Promise.all(selectedFiles.map(fileToBase64));
    sessionStorage.setItem(
      "aboutBusinessForm",
      JSON.stringify({
        businessUrl,
        googleListing,
        aboutBusiness,
        note,
        files: base64,
      })
    );
  };


  const isValidUrl = (url) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" +
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%@_.~+&:]*)*" +
      "(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?" +
      "(\\#[-a-zA-Z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(url);
  };

  const validateBusinessUrl = (urlPath) => {
    const fullUrl = urlPath.trim();
    if (!urlPath.trim()) return "Business URL is required.";
    if (!isValidUrl(fullUrl)) return "Please enter a valid URL.";

    return "";
  };

  const validateGoogleListing = (urlPath) => {
    const fullUrl = urlPath.trim();
    if (!urlPath.trim()) return "Google Listing URL is required.";
    if (!isValidUrl(fullUrl)) return "Please enter a valid URL.";
    return "";
  };

  const validateAboutBusiness = (text) => {
    if (!text.trim()) return "Business description is required.";
    return "";
  };

  const validateFiles = (filesArray) => {
    if (filesArray.length === 0) return "At least one file must be uploaded.";
    return "";
  };

  const validateForm = () => {
    const urlError = validateBusinessUrl(businessUrl);
    // const listingError = validateGoogleListing(googleListing);
    // const aboutError = validateAboutBusiness(aboutBusiness);
    // const fileErr = validateFiles(files);

    setBusinessUrlError(urlError);
    // setGoogleListingError(listingError);
    // setAboutBusinessError(aboutError);
    // setFilesError(fileErr);

    return !urlError
    // && !listingError && !aboutError && !fileErr;
  };
  const fetchAgentCountFromUser = async () => {
    try {
      const response = await listAgents()
      const filterAgents = await response.filter(res => res.userId === userId)
      setAgentCount(filterAgents.length)
    } catch (error) {
      console.log(error)
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusinessUrlSubmitted(true);
    setGoogleListingSubmitted(true);
    setAboutBusinessSubmitted(true);
    setFilesSubmitted(true);

    if (!validateForm()) return;

    const business = JSON.parse(sessionStorage.getItem("businessDetails"));

    const mergedUrls = [businessUrl.trim()];

    const formData = new FormData();
    const packageName = sessionStorage.getItem("package") || "Free";

    const packageMap = {
      "Free": 1,
      "Starter": 2,
      "Scaler": 3,
      "Growth": 4,
      "Corporate": 5,
      "Enterprise": 6
    };

    const packageValue = packageMap[packageName] || 1; 
    const sanitize = (str) => String(str || "").trim().replace(/\s+/g, "_");
    const knowledgeBaseName = `${sanitize(business?.businessType)}_${sanitize(business?.businessName)}_${sanitize(packageValue)}_#${agentCount}`;
    formData.append("knowledge_base_name", knowledgeBaseName);
    formData.append("knowledge_base_urls", JSON.stringify(mergedUrls));
    // let knowledgeTexts = [];

    // if (aboutBusiness?.trim()) {
    //   knowledgeTexts.push({
    //     title: "More Business Details",
    //     text: aboutBusiness
    //   });
    // } else if (note?.trim()) {
    //   knowledgeTexts.push({
    //     title: "Additional Note",
    //     text: note
    //   });
    // }


    // formData.append("knowledge_base_texts", knowledgeTexts)
    // formData.append("knowledge_base_texts", JSON.stringify(aboutBusiness)); // Optional
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
      console.log(response, "response")
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
  const handleSkip = () => {
    setPopupType("confirm");
    setPopupMessage(
      "This step is essential for your agent to understand your business context. You can always update these settings later as needed."
    );
    setShowPopup(true);
  };

  const confirmSkip = () => {
    setShowPopup(false);
    navigate("/steps");
  };

  const cancelSkip = () => {
    setShowPopup(false);
  };
  useEffect(() => {
    fetchAgentCountFromUser()
  }, [])
  return (
    <>
      <div>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>About Your Business</h1>
          </div>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.form}>
              <div className={styles.labReq} >
                <div className={styles.formGroup}>

                  <div className={styles.Dblock} >
                    <label htmlFor="business-url">URL (Website)</label>
                    {/* <span className={styles.prefix}>https://</span> */}
                    <input
                      id="https://your website url"
                      type="url"
                      placeholder="https://your website url"
                      value={businessUrl}
                      inputMode="url"
                      autoComplete="url"
                      onKeyDown={(e) => {
                        const { key, target } = e;
                        if (key !== "Backspace" && key !== "Delete") return;

                        const { selectionStart, selectionEnd, value } = target;
                        const fullSelection = selectionStart === 0 && selectionEnd === value.length;

                        if (fullSelection) {
                          // They wiped everything — leave only the prefix
                          e.preventDefault();
                          setBusinessUrl(HTTPS_PREFIX);
                          // Put caret after the prefix
                          requestAnimationFrame(() =>
                            target.setSelectionRange(PREFIX_LEN, PREFIX_LEN)
                          );
                          return;
                        }

                        // Block any removal that touches the prefix
                        if (selectionStart <= PREFIX_LEN) e.preventDefault();
                      }}

                      /* 2️⃣  Clean every keystroke or paste */
                      onInput={(e) => {
                        let v = e.target.value;

                        // Strip *every* http:// or https:// that appears anywhere
                        v = v.replace(/https?:\/\//gi, "");

                        // Kill spaces and force lowercase
                        v = v.replace(/\s+/g, "").toLowerCase();

                        const final = HTTPS_PREFIX + v;
                        setBusinessUrl(final);

                        if (businessUrlSubmitted) {
                          setBusinessUrlError(validateBusinessUrl(final));
                        }
                      }}
                    />
                  </div>
                </div>
                {businessUrlSubmitted && businessUrlError && (
                  <p className={styles.inlineError}>{businessUrlError}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="google-listing">Google Listing</label>
                <input
                  id="google-listing"
                  type="url"
                  placeholder="https://g.co/kgs/zrLgvY9"
                  value={googleListing}
                  inputMode="url"
                  autoComplete="url"

                  onKeyDown={(e) => {
                    const { key, target } = e;
                    if (key !== "Backspace" && key !== "Delete") return;

                    const { selectionStart, selectionEnd, value } = target;
                    const fullSelection = selectionStart === 0 && selectionEnd === value.length;

                    if (fullSelection) {
                      // They wiped everything — leave only the prefix
                      e.preventDefault();
                      setGoogleListing(HTTPS_PREFIX);
                      // Put caret after the prefix
                      requestAnimationFrame(() => target.setSelectionRange(PREFIX_LEN, PREFIX_LEN));
                      return;
                    }

                    // Block any removal/editing that touches the prefix
                    if (selectionStart <= PREFIX_LEN) e.preventDefault();
                  }}

                  onInput={(e) => {
                    let v = e.target.value;

                    // Strip *every* http:// or https:// that appears anywhere
                    v = v.replace(/https?:\/\//gi, "");

                    // Remove spaces and convert to lowercase
                    v = v.replace(/\s+/g, "").toLowerCase();

                    const final = HTTPS_PREFIX + v;
                    setGoogleListing(final);

                    if (googleListingSubmitted) {
                      setGoogleListingError(validateGoogleListing(final));
                    }
                  }}
                />
              </div>
              {googleListingSubmitted && googleListingError && (
                <p className={styles.inlineError}>{googleListingError}</p>
              )}
              <div className={styles.formGroup}>
                <label htmlFor="about-business">More About your Business</label>
                <textarea rows="4" cols="50"
                  id="about-business"
                  type="text"
                  placeholder="Use text for describing business Describe something about your business which is not defined or listed on Google My Business or your website."
                  value={aboutBusiness}
                  onChange={(e) => {
                    setAboutBusiness(e.target.value);
                    if (aboutBusinessSubmitted)
                      setAboutBusinessError(validateAboutBusiness(e.target.value));
                  }}
                />

              </div>
              {aboutBusinessSubmitted && aboutBusinessError && (
                <p className={styles.inlineError}>{aboutBusinessError}</p>
              )}
              <div className={styles.formGroup}>
                <label htmlFor="file-upload">File Upload <span className={styles.filesAllowed}>(allowd only .pdf,.txt,.csv,.json,.md)</span></label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.txt,.csv,.json,.md"
                  onChange={handleFileChange}
                />

              </div>
              {filesSubmitted && filesError && (
                <p className={styles.inlineError}>{filesError}</p>
              )}
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
              <div onClick={handleSkip} className={styles.skipButton}>
                <button>Skip for now</button>
              </div>
              <div>
                <button type="submit" className={styles.btnTheme} disabled={loading}>
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
            onConfirm={() => confirmSkip}
          />
        )}
      </div>
    </>
  );
}

export default AboutBusiness;
