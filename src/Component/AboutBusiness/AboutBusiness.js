import React, { useState, useEffect } from "react";
import styles from "../AboutBusiness/AboutBusiness.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PopUp from "../Popup/Popup";
import Loader from "../Loader/Loader";
import { listAgents, validateWebsite } from "../../Store/apiStore";
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
};

function AboutBusiness() {
  const [files, setFiles] = useState([]);
  const [businessUrl, setBusinessUrl] = useState("");
  const [googleListing, setGoogleListing] = useState("");
  const [aboutBusiness, setAboutBusiness] = useState("");
  const [note, setNote] = useState("");
  const [placeDetails, setPlaceDetails] = useState(null);
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
  const HTTPS_PREFIX = "https://";
  const PREFIX_LEN = HTTPS_PREFIX.length;
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const decodeTokenData = decodeToken(token);
  const [userId, setUserId] = useState(decodeTokenData?.id || "");
  const [isVerified, setIsVerified] = useState(false);
 
 const initAutocomplete = () => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("google-autocomplete"),
      {
        types: ["establishment"],
        fields: ["place_id", "name", "url", "formatted_address", "formatted_phone_number", "address_components"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.place_id) {
        fetchPlaceDetails(place.place_id);
      }
    });
  };

const fetchPlaceDetails = (placeId) => {
    setLoading(true);
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    
    service.getDetails({ placeId }, (result, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaceDetails(result);
        generateGoogleListingUrl(result); // Generate and set the Google Listing URL
        setLoading(false);
      } else {
        console.error("Place details fetch failed:", status);
        setLoading(false);
      }
    });
  };

  // Generate the Google Listing URL but don't show it in the UI
  const generateGoogleListingUrl = (place) => {
    const address = [
      place.address_components.find(c => c.types.includes("street_number"))?.long_name,
      place.address_components.find(c => c.types.includes("route"))?.long_name,
      place.address_components.find(c => c.types.includes("premise"))?.long_name,
      place.address_components.find(c => c.types.includes("subpremise"))?.long_name,
      place.address_components.find(c => c.types.includes("sublocality_level_1"))?.long_name,
      place.address_components.find(c => c.types.includes("locality"))?.long_name,
      place.address_components.find(c => c.types.includes("administrative_area_level_2"))?.long_name,
      place.address_components.find(c => c.types.includes("administrative_area_level_1"))?.long_name
    ].filter(Boolean).join(" ");

    const googleLink = `https://www.google.com/search?q=${encodeURIComponent(place.name + " " + address)}`;
    setGoogleListing(googleLink); // Save Google Listing URL but don't display it
  };




  const handleVerifyUrl = async () => {
    const result = await validateWebsite(businessUrl);
    if (result.valid) {
      setPopupType("success");
      setPopupMessage("Valid website URL!");
      setIsVerified(true);
      setShowPopup(true);
    } else {
      setPopupType("failed");
      setPopupMessage(`Invalid website URL!`);
      setShowPopup(true);
    }
  };

  const handleInputChange = (e) => {
    let v = e.target.value;
    v = v.replace(/https?:\/\//gi, "");
    v = v.replace(/\s+/g, "").toLowerCase();
    const final = HTTPS_PREFIX + v;
    setBusinessUrl(final);
    if (businessUrlSubmitted) {
      setBusinessUrlError(validateBusinessUrl(final));
    }
  };
  
  useEffect(() => {
    if (token) {
      setUserId(decodeTokenData.id || "");
    }
  }, [token]);
  useEffect(() => {
    const saved = JSON.parse(
      sessionStorage.getItem("aboutBusinessForm") || "{}"
    );
    if (saved.businessUrl) setBusinessUrl(saved.businessUrl);
    if (saved.googleListing) setGoogleListing(saved.googleListing);
    if (saved.aboutBusiness) setAboutBusiness(saved.aboutBusiness);
    if (saved.note) setNote(saved.note);

    // rebuild File objects
    if (Array.isArray(saved.files) && saved.files.length) {
      const rebuilt = saved.files.map((d, i) =>
        dataURLtoFile(d, `file${i + 1}`)
      );
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

    sessionStorage.setItem(
      "aboutBusinessForm",
      JSON.stringify({
        businessUrl,
        googleListing,
        aboutBusiness,
        note,
        files: previousFiles,
      })
    );
  }, [businessUrl, googleListing, aboutBusiness, note]);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    // block disallowed file types
    const ALLOWED = [
      "application/pdf",
      "text/plain",
      "text/csv",
      "application/json",
      "text/markdown",
    ];
    const invalid = selectedFiles.filter((f) => !ALLOWED.includes(f.type));
    if (invalid.length) {
      alert(
        `Only PDF or text files are allowed.\nBlocked: ${invalid
          .map((i) => i.name)
          .join(", ")}`
      );
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
    const listingError = validateGoogleListing(googleListing);
    // const aboutError = validateAboutBusiness(aboutBusiness);
    // const fileErr = validateFiles(files);

    setBusinessUrlError(urlError);
    setGoogleListingError(listingError);
    // setAboutBusinessError(aboutError);
    // setFilesError(fileErr);

    return !urlError;
    // && !listingError && !aboutError && !fileErr;
  };
  const fetchAgentCountFromUser = async () => {
    try {
      const response = await listAgents();
      const filterAgents = await response.filter(
        (res) => res.userId === userId
      );
      setAgentCount(filterAgents.length);
    } catch (error) {
      console.log(error);
    }
  };
 const handleSubmit = async (e) => {
  e.preventDefault();
  setBusinessUrlSubmitted(true);
  setGoogleListingSubmitted(true);
  setAboutBusinessSubmitted(true);
  setFilesSubmitted(true);

  // Validate form inputs before proceeding
  if (!validateForm()) return;

  // Get the business details and location from sessionStorage
  const business = JSON.parse(sessionStorage.getItem("businessDetails"));
  const businessLocation = JSON.parse(sessionStorage.getItem("businessLocation"));

  // Create an array of URLs, including the business URL and Google Listing URL
  const mergedUrls = [businessUrl.trim(), googleListing]; // Add Google Listing URL here

  // Prepare form data to send to the server
  const formData = new FormData();
  
  // Get the package name and use it to determine the package value
  const packageName = sessionStorage.getItem("package") || "Free";
  const packageMap = {
    Free: 1,
    Starter: 2,
    Scaler: 3,
    Growth: 4,
    Corporate: 5,
    Enterprise: 6,
  };
  const packageValue = packageMap[packageName] || 1;

  // Sanitize and format business details
  const sanitize = (str) => String(str || "").trim().replace(/\s+/g, "_");
  const businessTypes = [
    { name: "Restaurant", code: "rest" },
    { name: "Real Estate Broker", code: "rea_est_bro" },
    { name: "Saloon", code: "sal" },
    { name: "Doctor's Clinic", code: "doct_cli" },
    { name: "Dentist Office", code: "dent_off" },
    { name: "Dry Cleaner", code: "dry_cle" },
    { name: "Web Design Agency", code: "web_des_age" },
    { name: "Marketing Agency", code: "mkt_age" },
    { name: "Gym & Fitness Center", code: "gym_fit" },
    { name: "Personal Trainer", code: "per_tra" },
    { name: "Architect", code: "arch" },
    { name: "Interior Designer", code: "int_des" },
    { name: "Construction Services", code: "con_ser" },
    { name: "Cleaning/Janitorial Service", code: "clea_jan_ser" },
    { name: "Transport Company", code: "tra_com" },
    { name: "Landscaping Company", code: "land_com" },
    { name: "Insurance Agency", code: "ins_age" },
    { name: "Financial Services", code: "fin_ser" },
    { name: "Accounting Services", code: "acc_ser" },
    { name: "Car Repair & Garage", code: "car_rep" },
    { name: "Boat Repair & Maintenance", code: "boa_rep" },
    { name: "Property Rental & Leasing Service", code: "prop_ren_lea" },
    { name: "Other Local Business", code: "oth_loc_bus" },
  ];

  // Find the business type code
  const matchedBusiness = businessTypes.find((item) => item.name === business?.businessType);
  const businessCode = matchedBusiness ? matchedBusiness.code : "unknown";
  const shortBusinessName = sanitize(business?.businessName)?.slice(0, 10);

  // Create the knowledge base name
  const knowledgeBaseName = `${sanitize(businessCode)}_${sanitize(shortBusinessName)}_${sanitize(packageValue)}_#${agentCount}`;

  // Append the knowledge base name and URLs to form data
  formData.append("knowledge_base_name", knowledgeBaseName);
  formData.append("knowledge_base_urls", JSON.stringify(mergedUrls));

  // Prepare business location and description
  let knowledgeTexts = [];
  let textContent = "";
  let moreAbout = null;
  if (businessLocation) {
    textContent = `
      Country: ${businessLocation.country || ""}
      State: ${businessLocation.state || ""}
      City: ${businessLocation.city || ""}
      Address No. 1: ${businessLocation.address1 || ""}
      Address No. 2: ${businessLocation.address2 || ""}
    `.trim(); // Optional: remove leading/trailing whitespace
    moreAbout = {
      title: business.businessType || "Business Info",
      text: textContent,
    };
  }

  // Append the business description to form data
  formData.append("knowledge_base_texts", JSON.stringify([moreAbout]));

  // Append any files to form data
  files.forEach((file) => {
    formData.append("knowledge_base_files", file);
  });

  // Submit the form data to the server
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

    // Handle the successful response
    console.log(response, "response");
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

  const handleSkip = (e) => {
    e.preventDefault(); 
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

 useEffect(() => {
    const interval = setInterval(() => {
      if (window.google?.maps?.places) {
        initAutocomplete();
        clearInterval(interval);
      }
    }, 300);
  }, []);

  useEffect(() => {
    fetchAgentCountFromUser();
  }, []);
  return (
    <>
      <div>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>About Your Business</h1>
          </div>
          <form className={styles.formContainer}>
            <div className={styles.form}>
              <div className={styles.labReq}>
                <div className={styles.formGroup}>
                  <div className={styles.Dblock}>
                    <label htmlFor="business-url">URL (Website)</label>
                    {/* <span className={styles.prefix}>https://</span> */}
                    <input
                      id="https://your-website-url"
                      type="url"
                      placeholder="https://your website url"
                      value={businessUrl}
                      inputMode="url"
                      autoComplete="url"
                      list="url-suggestions"
                      onKeyDown={(e) => {
                        const { key, target } = e;
                        if (key !== "Backspace" && key !== "Delete") return;
                        const { selectionStart, selectionEnd, value } = target;
                        const fullSelection =
                          selectionStart === 0 && selectionEnd === value.length;

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
                      onInput={handleInputChange}
                    />
                     <div className={styles.verifyButtonContainer}>
                {!isVerified && (
                  <button
                    type="button"
                    className={styles.verifyButton}
                    onClick={handleVerifyUrl}
                  >
                    Verify
                  </button>
                )}
              </div>
                  </div>
                </div>
                {/* {businessUrlSubmitted && businessUrlError && (
                  <p className={styles.inlineError}>{businessUrlError}</p>
                )} */}
              </div>
              {/* Verify Button */}
             

              <div>
            <div className={styles.formGroup}>
              <label htmlFor="google-autocomplete">Google Listing (Business Name)</label>
              <input
                id="google-autocomplete"
                type="text"
                placeholder="Search for your business"
              />
            </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="about-business">More About your Business</label>
                <textarea
                  rows="4"
                  cols="50"
                  id="about-business"
                  type="text"
                  placeholder="Use text for describing your business. Describe something about your business which is not defined or listed on Google My Business or Your website."
                  value={aboutBusiness}
                  onChange={(e) => {
                    setAboutBusiness(e.target.value);
                    if (aboutBusinessSubmitted)
                      setAboutBusinessError(
                        validateAboutBusiness(e.target.value)
                      );
                  }}
                />
              </div>
              {/* {aboutBusinessSubmitted && aboutBusinessError && (
                <p className={styles.inlineError}>{aboutBusinessError}</p>
              )} */}
              {/* <div className={styles.formGroup}>
                <label htmlFor="file-upload">File Upload <span className={styles.filesAllowed}>(allowd only .pdf,.txt,.csv,.json,.md)</span></label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.txt,.csv,.json,.md"
                  onChange={handleFileChange}
                />

              </div> */}
              {/* {filesSubmitted && filesError && (
                <p className={styles.inlineError}>{filesError}</p>
              )} */}
              <div className={styles.formGroup}>
                <label htmlFor="additional-note">
                  Additional Agent Instructions{" "}
                </label>
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
                <button
                  type="submit"
                  className={styles.btnTheme}
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  <img src="svg/svg-theme.svg" alt="" />
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
            onConfirm={confirmSkip}
          />
        )}
      </div>
    </>
  );
}

export default AboutBusiness;
