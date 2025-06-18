import React, { useState, useEffect } from "react";
import styles from "../AboutBusiness/AboutBusiness.module.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import PopUp from "../Popup/Popup";
import Loader from "../Loader/Loader";
import {
  API_BASE_URL,
  listAgents,
  validateWebsite,
} from "../../Store/apiStore";
import decodeToken from "../../lib/decodeToken";
import { useAgentCreator } from "../../hooks/useAgentCreator";
import useCheckAgentCreationLimit from "../../hooks/useCheckAgentCreationLimit";

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

  const [urlVerificationInProgress, setUrlVerificationInProgress] =
    useState(false);
  const [displayBusinessName, setDisplayBusinessName] = useState("");
  const location = useLocation();
  const sessionBusinessiD = JSON.parse(sessionStorage.getItem("bId"));
  const businessId1 = sessionBusinessiD?.businessId;
  const businessId =
    location.state?.businessId ||
    sessionBusinessiD ||
    sessionBusinessiD?.businessId;
  const stepEditingMode = localStorage.getItem("UpdationModeStepWise");
  const EditingMode = localStorage.getItem("UpdationMode");
  const knowledgeBaseId = sessionStorage.getItem("knowledgeBaseId");
  const [placeInfoText, setPlaceInfoText] = useState("");
  const setHasFetched = true;
  const { handleCreateAgent } = useAgentCreator({
    stepValidator: () => "AboutBusiness",
    setLoading,
    setPopupMessage,
    setPopupType,
    setShowPopup,
    navigate,
    setHasFetched,
  });
  const { isLimitExceeded, CheckingUserLimit } = useCheckAgentCreationLimit(userId);


  const initAutocomplete = () => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("google-autocomplete"),
      {
        types: ["establishment"],
        fields: ["place_id", "name", "url"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.place_id) {
        const businessUrl = place.url;
        const businessName = place.name;
        setGoogleListing(businessUrl);
        setDisplayBusinessName(businessName);
        sessionStorage.setItem("googleListing", businessUrl);
        sessionStorage.setItem("displayBusinessName", businessName);
        fetchPlaceDetails(place.place_id);
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google?.maps?.places) {
        initAutocomplete();
        clearInterval(interval);
      }
    }, 300);
  }, []);

  const fetchPlaceDetails = (placeId) => {
    setLoading(true);
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails({ placeId }, (result, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaceDetails(result);
        generateGoogleListingUrl(result);

        // Extract important fields from result
        const businessData = {
          name: result.name || "",
          address: result.formatted_address || "",
          phone: result.formatted_phone_number || "",
          internationalPhone: result.international_phone_number || "",
          website: result.website || "",
          rating: result.rating || "",
          totalRatings: result.user_ratings_total || "",
          hours: result.opening_hours?.weekday_text || [],
          businessStatus: result.business_status || "",
          categories: result.types || [],
        };
        sessionStorage.setItem(
          "placeDetailsExtract",
          JSON.stringify(businessData)
        );
        console.log("Extracted Business Data:", businessData);
        const fullPlaceInfoText = JSON.stringify(result, null, 2);
        setPlaceInfoText(fullPlaceInfoText);
      } else {
        console.error("Place details fetch failed:", status);
      }
      setLoading(false);
    });
  };

  const generateGoogleListingUrl = (place) => {
    const address = [
      place.address_components.find((c) => c.types.includes("street_number"))
        ?.long_name,
      place.address_components.find((c) => c.types.includes("route"))
        ?.long_name,
      place.address_components.find((c) => c.types.includes("premise"))
        ?.long_name,
      place.address_components.find((c) => c.types.includes("subpremise"))
        ?.long_name,
      place.address_components.find((c) =>
        c.types.includes("sublocality_level_1")
      )?.long_name,
      place.address_components.find((c) => c.types.includes("locality"))
        ?.long_name,
      place.address_components.find((c) =>
        c.types.includes("administrative_area_level_2")
      )?.long_name,
      place.address_components.find((c) =>
        c.types.includes("administrative_area_level_1")
      )?.long_name,
    ]
      .filter(Boolean)
      .join(" ");

    const googleLink = `https://www.google.com/search?q=${encodeURIComponent(
      place.name + " " + address
    )}`;
    setGoogleListing(googleLink);
  };

  const handleUrlVerification = async (url) => {
    setUrlVerificationInProgress(true);
    const result = await validateWebsite(url);
    if (result.valid) {
      setIsVerified(true);
      setBusinessUrlError("");
      sessionStorage.setItem("businessUrl", url);
      localStorage.setItem("isVerified", true);
    } else {
      setIsVerified(false);
      setBusinessUrlError("Invalid URL");
      localStorage.setItem("isVerified", false);
    }
    setUrlVerificationInProgress(false);
  };

  useEffect(() => {
    const savedVerifiedStatus = localStorage.getItem("isVerified");
    if (savedVerifiedStatus !== null) {
      setIsVerified(savedVerifiedStatus === "true");
    }
  }, []);

  const handleBlur = () => {
    if (businessUrl.trim()) {
      handleUrlVerification(businessUrl);
    }
  };
  const handleInputChange = (e) => {
    let v = e.target.value;
    v = v.replace(/https?:\/\//gi, "");
    v = v.replace(/\s+/g, "").toLowerCase();
    const final = HTTPS_PREFIX + v;
    setBusinessUrl(final);
    if (businessUrlError) {
      setBusinessUrlError("");
    }
  };

  useEffect(() => {
    if (token) {
      setUserId(decodeTokenData.id || "");
    }
  }, [token]);

  useEffect(() => {
    if (localStorage.getItem("UpdationMode") == "ON") {
      const savedData = JSON.parse(
        sessionStorage.getItem("aboutBusinessForm") || "{}"
      );
      if (savedData.businessUrl) setBusinessUrl(savedData.businessUrl);
      if (savedData.aboutBusiness) setAboutBusiness(savedData.aboutBusiness);
      if (savedData.note) setNote(savedData.note);
      if (savedData.googleListing) {
        setGoogleListing(savedData.googleListing);
      }
      // rebuild File objects
      if (Array.isArray(savedData.files) && savedData.files.length) {
        const rebuiltFiles = savedData.files.map((d, i) =>
          dataURLtoFile(d, `file${i + 1}`)
        );
        setFiles(rebuiltFiles);
      }
    } else {
      const savedData = JSON.parse(
        sessionStorage.getItem("aboutBusinessForm") || "{}"
      );
      if (savedData.businessUrl) setBusinessUrl(savedData.businessUrl);
      if (savedData.aboutBusiness) setAboutBusiness(savedData.aboutBusiness);
      if (savedData.note) setNote(savedData.note);
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

  const validateAboutBusiness = (text) => {
    if (!text.trim()) return "Business description is required.";
    return "";
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

    if (!businessUrl) {
      setPopupType("failed");
      setPopupMessage("Website URL is required.");
      setShowPopup(true);
      return;
    }

    if (!isVerified) {
      setPopupType("failed");
      setPopupMessage("Business URL must be verified before proceeding.");
      setShowPopup(true);
      return;
    }

    // Ensure Google Listing is provided
    if (!googleListing.trim()) {
      setPopupType("failed");
      setPopupMessage("Google Listing is required.");
      setShowPopup(true);
      return;
    }

    const business = JSON.parse(sessionStorage.getItem("businessDetails"));

    const mergedUrls = [businessUrl.trim()];
    const formData = new FormData();
    const formData2 = new FormData();
    const formData3 = new FormData();
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

    const sanitize = (str) =>
      String(str || "")
        .trim()
        .replace(/\s+/g, "_");

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
      { name: "Other", code: business?.customBuisness?.slice(0, 3) },
    ];

    // Find the business type code

    const matchedBusiness = businessTypes.find(
      (item) => item.name === business?.businessType
    );
    const businessCode = matchedBusiness ? matchedBusiness.code : "unknown";
    const shortBusinessName = sanitize(business?.businessName)?.slice(0, 10);
    const knowledgeBaseName = `${sanitize(businessCode)}_${sanitize(
      shortBusinessName
    )}_${sanitize(packageValue)}_#${agentCount}`;
    const businessDetails = JSON.parse(
      sessionStorage.getItem("businessDetails") || "{}"
    );

    const businessType = businessDetails?.businessType;
    const title =
      businessType === "Other"
        ? businessDetails?.customBuisness || "Business Info"
        : businessType;
    const businessData = {
      name: placeDetails?.name || "",
      address: placeDetails?.formatted_address || "",
      phone:
        placeDetails?.formatted_phone_number ||
        placeDetails?.international_phone_number ||
        "",
      website: placeDetails?.website || "",
      rating: placeDetails?.rating || "",
      totalRatings: placeDetails?.user_ratings_total || "",
      hours: placeDetails?.opening_hours?.weekday_text?.join(" | ") || "",
      businessStatus: placeDetails?.business_status || "",
      categories: placeDetails?.types?.join(", ") || "",
    };

    // Combine them into readable text
    const knowledgeBaseText = {
      title,
      text: `
Business Name: ${businessData.name}
Address: ${businessData.address}
Phone: ${businessData.phone}
Website: ${businessData.website}
Rating: ${businessData.rating} (${businessData.totalRatings} reviews)
Business Status: ${businessData.businessStatus}
Categories: ${businessData.categories}
Opening Hours: ${businessData.hours}
  `.trim(),
    };
    console.log(knowledgeBaseText)

    formData3.append("knowledge_base_texts", JSON.stringify([knowledgeBaseText]));
    formData.append("knowledge_base_name", knowledgeBaseName);
    formData.append("knowledge_base_urls", JSON.stringify(mergedUrls));
    formData.append("enable_auto_refresh", "true");
    formData.append("knowledge_base_texts", JSON.stringify([knowledgeBaseText]));

    formData2.append("googleUrl", googleListing);
    formData2.append("webUrl", businessUrl.trim());
    formData2.append("aboutBusiness", aboutBusiness);
    formData2.append("additionalInstruction", note);
    formData2.append("knowledge_base_name", knowledgeBaseName);
    formData2.append("agentId", localStorage.getItem("agent_id"));
    formData2.append("googleBusinessName", displayBusinessName);
    formData3.append("knowledge_base_urls", JSON.stringify(mergedUrls));
    formData2.append("address1", businessData.address || "")
    // let textContent = "";
    // let moreAbout = null;
    // moreAbout = {
    //   title: business.businessType || "Business Info",
    //   // text: textContent,
    // };
    // if (businessLocation) {
    //   textContent = `
    //   Country: ${businessLocation.country || ""}
    //   State: ${businessLocation.state || ""}
    //   City: ${businessLocation.city || ""}
    //   Address No. 1: ${businessLocation.address1 || ""}
    //   Address No. 2: ${businessLocation.address2 || ""}
    // `.trim(); // Optional: remove leading/trailing whitespace
    //   moreAbout = {
    //     title: business.businessType || "Business Info",
    //     // text: textContent,
    //   };
    // }

    // Append the business description to form data
    // formData.append("knowledge_base_texts", JSON.stringify([moreAbout]));
    // formData3.append("knowledge_base_texts", JSON.stringify([moreAbout]));
    // files.forEach((file) => {
    //   formData.append("knowledge_base_files", file);
    // });
    // Submit the form data to the serve

    try {
      setLoading(true);
      let knowledge_Base_ID = knowledgeBaseId;
      if (
        knowledge_Base_ID !== null &&
        knowledge_Base_ID !== undefined &&
        knowledge_Base_ID !== "null" &&
        knowledge_Base_ID !== "undefined" &&
        knowledge_Base_ID !== ""
      ) {
        const response = await axios.post(
          `https://api.retellai.com/add-knowledge-base-sources/${knowledge_Base_ID}`,
          formData3,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        formData2.append("knowledge_base_id", response.data.knowledge_base_id);
      }
      else {
        const response = await axios.post(
          "https://api.retellai.com/create-knowledge-base",
          formData,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
              // "Content-Type": "multipart/form-data",
            },
          }
        );
        formData2.append("knowledge_base_id", response.data.knowledge_base_id);
        knowledge_Base_ID = response.data.knowledge_base_id;
        sessionStorage.setItem(
          "knowledgeBaseId",
          response.data.knowledge_base_id
        );
      }
      try {
        const response = await axios.patch(
          `${API_BASE_URL}/businessDetails/updateKnowledeBase/${sessionBusinessiD}`,
          formData2,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        formData2.append("knowledge_base_id", response.data.knowledge_base_id);
      } catch (error) {
        console.log("error while saving knowledge bas in Database", error);
      }

      // if knowledgeBase  created at edit
      if (stepEditingMode == "ON" && knowledge_Base_ID) {
        const llm_id =
          localStorage.getItem("llmId") || sessionStorage.getItem("llmId");
        const agentConfig = {};
        if (knowledge_Base_ID) {
          agentConfig.knowledge_base_ids = [knowledge_Base_ID];
        }
        try {
          const llmResponse = await axios.patch(
            `https://api.retellai.com/update-retell-llm/${llm_id}`,
            agentConfig,
            {
              headers: {
                Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                "Content-Type": "application/json",
              },
            }
          );
        } catch (error) {
          console.log("failed to update llm while adding knowledgeBaseId");
        }
      }

      if (stepEditingMode != "ON") {
        setPopupType("success");
        setPopupMessage("Knowledge base created successfully!");
        setShowPopup(true);
        setTimeout(() => navigate("/steps"), 1000);
      } else {
        setPopupType("success");
        setPopupMessage("Knowledge base Updated successfully!");
        setShowPopup(true);
        setTimeout(
          () =>
            navigate("/agent-detail", {
              state: {
                agentId: localStorage.getItem("agent_id"),
                bussinesId: sessionBusinessiD,
              },
            }),
          1000
        );
      }
    } catch (error) {
      if (error?.status == 422) {
        setPopupType("failed");
        setPopupMessage(
          "We’re currently updating your knowledge base. Editing is temporarily disabled. Please try again in a little while."
        );
        setShowPopup(true);
      }
    } finally {
      setLoading(false);
    }
  };

  //     setPopupType("success");
  //     setPopupMessage("Knowledge base created successfully!");
  //     setShowPopup(true);

  //     setTimeout(() => navigate("/steps"), 1500);
  //   } catch (error) {
  //     console.error(
  //       "Upload failed:",
  //       error.response?.data?.message || error.message
  //     );
  //     setPopupType("failed");
  //     setPopupMessage(error.response?.data?.message || "Internal Server Error");
  //     setShowPopup(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
    const savedGoogleListing = sessionStorage.getItem("googleListing");
    const savedDisplayBusinessName = sessionStorage.getItem(
      "displayBusinessName"
    );

    if (savedGoogleListing) {
      setGoogleListing(savedGoogleListing);
    }

    if (savedDisplayBusinessName) {
      setDisplayBusinessName(savedDisplayBusinessName);
    }
  }, []);

  useEffect(() => {
    fetchAgentCountFromUser();
  }, []);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    sessionStorage.setItem(
      "aboutBusinessForm",
      JSON.stringify({
        businessUrl,
        googleListing,
        aboutBusiness,
        note,
      })
    );
    setTimeout(() => {
      handleCreateAgent();
    }, 800);
  };

  useEffect(() => {
    if (!CheckingUserLimit && isLimitExceeded && !EditingMode) {
      setShowPopup(true);
      setPopupType('failed');
      setPopupMessage("Agent creation limit exceeded. Please upgrade your plan!");
    }
  }, [CheckingUserLimit, isLimitExceeded]);
  useEffect(() => {
  const interval = setInterval(() => {
    if (window.google?.maps?.places) {
      console.log("Google Places library loaded");
      const input = document.getElementById("google-autocomplete");
      if (input) {
        initAutocomplete();
        clearInterval(interval);
      }
    }
  }, 300);
}, []);
  if (CheckingUserLimit) return;
  const handleClosePopup = () => {
    if (!CheckingUserLimit && isLimitExceeded && !EditingMode) {
      navigate('/dashboard');
      setShowPopup(false);
    } else {
      setShowPopup(false);
    }
  }

  return (
    <>
      <div>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>
              {EditingMode
                ? "Edit: About Your Business"
                : "About Your Business"}
            </h1>
          </div>
          <form className={styles.formContainer}>
            <div className={styles.form}>
              <div className={styles.labReq}>
                <div className={styles.formGroup}>
                  <div className={styles.Dblock}>
                    <label htmlFor="business-url">
                      URL (Website){" "}
                      <span className={styles.requiredStar}>*</span>{" "}
                    </label>
                    <div className={styles.inputFlex}>
                      <input
                        id="https://your-website-url"
                        type="url"
                        placeholder="https://your website url"
                        value={businessUrl}
                        inputMode="url"
                        autoComplete="url"
                        onBlur={handleBlur}
                        list="url-suggestions"
                        onKeyDown={(e) => {
                          const { key, target } = e;
                          if (key !== "Backspace" && key !== "Delete") return;
                          const { selectionStart, selectionEnd, value } =
                            target;
                          const fullSelection =
                            selectionStart === 0 &&
                            selectionEnd === value.length;

                          if (fullSelection) {
                            e.preventDefault();
                            setBusinessUrl(HTTPS_PREFIX);
                            // Put caret after the prefix
                            requestAnimationFrame(() =>
                              target.setSelectionRange(PREFIX_LEN, PREFIX_LEN)
                            );
                            return;
                          }
                          if (selectionStart <= PREFIX_LEN) e.preventDefault();
                        }}
                        onInput={handleInputChange}
                      />
                      <div className={styles.verifyStatus}>
                        {urlVerificationInProgress ? (
                          <Loader size={20} />
                        ) : (
                          isVerified !== null && (
                            <span
                              className={
                                isVerified
                                  ? styles.validIcon
                                  : styles.invalidIcon
                              }
                            >
                              {isVerified ? "✔️" : "❌"}
                            </span>
                          )
                        )}
                      </div>
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
                  <label htmlFor="google-autocomplete">
                    Google Listing (Business Name){" "}
                    <span className={styles.requiredStar1}>*</span>
                  </label>
                  <input
                    id="google-autocomplete"
                    type="text"
                      autoComplete="off"

                    placeholder="Search for your business"
                    value={displayBusinessName}
                    onChange={(e) => setDisplayBusinessName(e.target.value)}
                    required
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
                {stepEditingMode ? "" : <button>Skip for now</button>}
              </div>

              <div className={styles.fixedBtn}>
                {/* {stepEditingMode != "ON" || knowledgeBaseId ? (*/}
                {stepEditingMode != "ON" ? (
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
                ) : (
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
                      <p>Save Edits</p>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        {showPopup && (
          <PopUp
            type={popupType}
            onClose={() => handleClosePopup()}
            message={popupMessage}
            onConfirm={confirmSkip}
          />
        )}
      </div>
    </>
  );
}

export default AboutBusiness;
