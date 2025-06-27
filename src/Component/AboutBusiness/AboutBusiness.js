import React, {
  useState, useEffect, useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "../AboutBusiness/AboutBusiness.module.css";
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

// Convert data URL → File (used when re-hydrating)
const dataURLtoFile = (dataUrl, fileName = "file") => {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const bytes = atob(base64);
  const buf = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i);
  return new File([buf], fileName, { type: mime });
};

const AboutBusiness = forwardRef(({ onNext, onBack, onValidationError, onSuccess, onFailed, setLoading, onStepChange }, ref) => {
  const aboutBusinessForm1 = JSON.parse(sessionStorage.getItem("aboutBusinessForm") || "{}");

  const [noGoogleListing, setNoGoogleListing] = useState(aboutBusinessForm1?.noGoogleListing || false);

  const [noBusinessWebsite, setNoBusinessWebsite] = useState(aboutBusinessForm1?.noBusinessWebsite || false);
  const [files, setFiles] = useState([]);
  const [businessUrl, setBusinessUrl] = useState("");
  const [googleListing, setGoogleListing] = useState("");
  const [aboutBusiness, setAboutBusiness] = useState("");
  const [note, setNote] = useState("");
  const [placeDetails, setPlaceDetails] = useState(null);
  // Inline error states
  const [businessUrlError, setBusinessUrlError] = useState("");
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  // const [loading, setLoading] = useState(false);
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
  const { isLimitExceeded, CheckingUserLimit } =
    useCheckAgentCreationLimit(userId);

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

  useEffect(() => {
    if (EditingMode === "ON" && !noBusinessWebsite) {
      handleBlur();
    }
  }, [EditingMode, noBusinessWebsite]);

  // useEffect(() => {
  //   const storedName = sessionStorage.getItem("displayBusinessName");
  //   if (storedName) {
  //     setDisplayBusinessName(storedName);

  //     // Slight delay to let input mount
  //     setTimeout(() => {
  //       const input = document.getElementById("google-autocomplete");
  //       if (input) {
  //         input.focus();

  //         // Simulate key press to trigger suggestion dropdown
  //         const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  //           window.HTMLInputElement.prototype,
  //           "value"
  //         )?.set;

  //         nativeInputValueSetter?.call(input, storedName);

  //         const ev2 = new Event("input", { bubbles: true });
  //         input.dispatchEvent(ev2);
  //       }
  //     }, 500);
  //   }
  // }, []);

  const fetchPlaceDetails = (placeId) => {
    setLoading(true);
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails({ placeId }, (result, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaceDetails(result);
        generateGoogleListingUrl(result);

        const form1 = JSON.parse(sessionStorage.getItem("placeDetailsExtract") || "{}");
        // Extract important fields from result
        const businessData = {
          businessName: result.name || "",
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
        const updatedForm = {
          ...form1,
          ...businessData,
        };
        sessionStorage.setItem(
          "placeDetailsExtract",
          JSON.stringify(updatedForm)
        );
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
      setNoGoogleListing(false)
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
    setNoBusinessWebsite(false)
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
      if (typeof savedData.noGoogleListing === "boolean") {
        setNoGoogleListing(savedData.noGoogleListing);
      } if (typeof savedData.noBusinessWebsite === "boolean") {
        setNoBusinessWebsite(savedData.noBusinessWebsite);
      }

    } else {
      const savedData = JSON.parse(
        sessionStorage.getItem("aboutBusinessForm") || "{}"
      );
      if (savedData) {

        if (savedData.businessUrl) setBusinessUrl(savedData.businessUrl);
        if (savedData.aboutBusiness) setAboutBusiness(savedData.aboutBusiness);
        if (savedData.note) setNote(savedData.note);
        if (typeof savedData.noBusinessWebsite === "boolean") {
          setNoBusinessWebsite(savedData.noBusinessWebsite);
        }
      }
    }
  }, []);

  useEffect(() => {
    const aboutBusinessForm = JSON.parse(sessionStorage.getItem("aboutBusinessForm") || "{}");
    if (EditingMode == "ON") {
      const noListing = !aboutBusinessForm.googleListing?.trim() && !googleListing?.trim();
      const noWebsite = !aboutBusinessForm.businessUrl?.trim() && !businessUrl?.trim();

      if (noListing) {
        setNoGoogleListing(true);
        aboutBusinessForm.noGoogleListing = true;
        sessionStorage.setItem("aboutBusinessForm", JSON.stringify(aboutBusinessForm));
      }

      if (noWebsite) {
        setNoBusinessWebsite(true);
        setIsVerified(true); // assume valid when intentionally skipped
        aboutBusinessForm.noBusinessWebsite = true;
        sessionStorage.setItem("aboutBusinessForm", JSON.stringify(aboutBusinessForm));
      }


    }
    else {
      if (aboutBusinessForm.noGoogleListing === true) {
        setNoGoogleListing(true);
      } else {
        setNoGoogleListing(false); // explicitly false by default
      }

      if (aboutBusinessForm.noBusinessWebsite === true) {
        setNoBusinessWebsite(true);
        setIsVerified(true);
      } else {
        setNoBusinessWebsite(false); // explicitly false by default
      }
    }
  }, [googleListing, businessUrl]);

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
  const handleContinue = (e) => {
    // e.preventDefault();

    // const isWebsiteValid = businessUrl && isVerified;
    // const isGoogleListingValid = googleListing.trim();
    // if (!isGoogleListingValid && !noGoogleListing) {
    //   setPopupType("failed");
    //   setPopupMessage(
    //     "Please provide a Google Listing or check the box if you don't have one."
    //   );
    //   setShowPopup(true);
    //   return;
    // }
    // if (!isWebsiteValid && !noBusinessWebsite) {
    //   setPopupType("failed");
    //   setPopupMessage(
    //     "Please provide a valid website or check the box if you don't have one."
    //   );
    //   setShowPopup(true);
    //   return;
    // }

    sessionStorage.setItem(
      "aboutBusinessForm",
      JSON.stringify({
        businessUrl,
        googleListing,
        aboutBusiness,
        note,
        noGoogleListing,
        noBusinessWebsite

      })
    );
    onStepChange?.(4);
    // navigate("/your-business-Listing");
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
      setPopupType("failed");
      setPopupMessage(
        "Agent creation limit exceeded. Please upgrade your plan!"
      );
    }
  }, [CheckingUserLimit, isLimitExceeded]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google?.maps?.places) {
        const input = document.getElementById("google-autocomplete");
        if (input) {
          initAutocomplete();
          clearInterval(interval);
        }
      }
    }, 300);
  }, []);
  // if (CheckingUserLimit) return;
  const handleClosePopup = () => {
    if (!CheckingUserLimit && isLimitExceeded && !EditingMode) {
      navigate("/dashboard");
      setShowPopup(false);
    } else {
      setShowPopup(false);
    }
  };
  //Using Error Handling
  useImperativeHandle(ref, () => ({
    validate: () => {
      let hasError = false;
      const isWebsiteValid = businessUrl && isVerified;
      const isGoogleListingValid = googleListing.trim();

      // Google Listing validation
      if (!isGoogleListingValid && !noGoogleListing) {
        onValidationError?.({
          type: "failed",
          message: "Please provide a Google Listing or check the box if you don't have one.",
        });
        hasError = true;
      }

      // Website validation
      if (!isWebsiteValid && !noBusinessWebsite) {
        onValidationError?.({
          type: "failed",
          message: "Please provide a valid website or check the box if you don't have one.",
        });
        hasError = true;
      }
      if (!hasError) {
        handleContinue();
      }
      return !hasError;
    }
  }));

  return (
    <>
      <div>
        <div className={styles.container}>
          <div className={styles.header}>
            {/* <h1>
              {EditingMode
                ? "Edit: Your business Listing"
                : "Your business Listing"}
            </h1> */}
          </div>
          <form className={styles.formContainer}>
            <div className={styles.form}>
              <div>
                <div className={styles.formGroup}>
                  <label htmlFor="google-autocomplete">
                    Google My Business
                    <span className={styles.requiredStar1}>*</span>
                  </label>
                  <input
                    id="google-autocomplete"
                    type="text"
                    autoComplete="off"
                    placeholder="Type the name of your Business to Search"
                    value={displayBusinessName}
                    // onChange={(e) => setGoogleListing(e.target.value)}
                    onChange={(e) => { setDisplayBusinessName(e.target.value) }}
                    required
                    disabled={noGoogleListing}
                  />
                </div>
                <div className={styles.checkboxRow}>
                  <input
                    id="no-google-listing"
                    type="checkbox"
                    className={styles.customCheckbox}
                    checked={noGoogleListing}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setNoGoogleListing(checked);

                      const form = JSON.parse(sessionStorage.getItem("aboutBusinessForm") || "{}");
                      form.noGoogleListing = checked;
                      sessionStorage.setItem("aboutBusinessForm", JSON.stringify(form));

                      const form1 = JSON.parse(sessionStorage.getItem("placeDetailsExtract") || "{}");

                      if (checked) {
                        setGoogleListing("");
                        setDisplayBusinessName("");
                        sessionStorage.removeItem("googleListing");
                        sessionStorage.removeItem("displayBusinessName");

                        const clearedGoogleData = {
                          name: "",
                          address: "",
                          phone: "",
                          internationalPhone: "",
                          website: "",
                          rating: "",
                          totalRatings: "",
                          hours: [],
                          businessStatus: "",
                          categories: [],
                          aboutBussiness: form1?.aboutBusiness || form1?.aboutBussiness || "",
                          businessName: "",
                        };

                        const updatedForm = {
                          ...form1,
                          ...clearedGoogleData,
                        };

                        sessionStorage.setItem("placeDetailsExtract", JSON.stringify(updatedForm));
                      }
                    }}
                  />
                  <label htmlFor="no-google-listing">
                    I do not have Google My Business Listing
                  </label>
                </div>
              </div>
              <hr className={styles.fieldDivider} />
              <div className={styles.labReq}>
                <div className={styles.formGroup}>
                  <div className={styles.Dblock}>
                    <label htmlFor="business-url">
                      Website (URL)
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
                        style={{ width: "100%" }}
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
                        disabled={noBusinessWebsite}
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
                              {isVerified && !noBusinessWebsite ? "✔️" : "❌"}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.checkboxRow}>
                  <input
                    id="no-business-website"
                    type="checkbox"
                    className={styles.customCheckbox}
                    checked={noBusinessWebsite}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setNoBusinessWebsite(checked);

                      const aboutBusinessForm = JSON.parse(sessionStorage.getItem("aboutBusinessForm") || "{}");
                      aboutBusinessForm.noBusinessWebsite = checked;
                      sessionStorage.setItem("aboutBusinessForm", JSON.stringify(aboutBusinessForm));

                      if (checked) {
                        setBusinessUrl("");
                        setIsVerified(true);
                        setBusinessUrlError("");
                        sessionStorage.removeItem("businessUrl");
                      }
                    }}
                  />
                  <label htmlFor="no-business-website">
                    I do not have a business website
                  </label>
                </div>
              </div>
              {/* <div className={styles.fixedBtn}> */}
              {/* {stepEditingMode != "ON" || knowledgeBaseId ? (*/}
              {/* {stepEditingMode != "ON" ? (
                  <button
                    type="submit"
                    className={styles.btnTheme}
                    disabled={loading}
                    onClick={handleContinue}
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
                    onClick={handleContinue}
                  >
                    <img src="svg/svg-theme.svg" alt="" />
                    {loading ? (
                      <>
                        Add <Loader size={20} />
                      </>
                    ) : (
                      <p>Save Edits  </p>
                    )}
                  </button>
                )} */}
              {/* </div> */}
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
})

export default AboutBusiness;
