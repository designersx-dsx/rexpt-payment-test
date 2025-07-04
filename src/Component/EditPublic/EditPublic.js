import React, { useEffect, useState, useRef } from 'react';
import styles from '../EditPublic/EditPublic.module.css';
import EditHeader from '../EditHeader/EditHeader';
import SectionHeader from '../SectionHeader/SectionHeader';
import AnimatedButton from '../AnimatedButton/AnimatedButton';
import { useNavigate ,useLocation} from 'react-router-dom';
import { validateWebsite } from '../../Store/apiStore';
import Loader from '../Loader/Loader';
import decodeToken from '../../lib/decodeToken';
import { useAgentCreator } from '../../hooks/useAgentCreator';
import PopUp from '../Popup/Popup';
import { set } from 'date-fns';

const HTTPS_PREFIX = 'https://';
const PREFIX_LEN = HTTPS_PREFIX?.length;

const EditPublic = () => {
      const agentnm=sessionStorage.getItem("agentName");
        const stepEditingMode = localStorage.getItem("UpdationModeStepWise");
  const EditingMode = localStorage.getItem("UpdationMode");
    const token = localStorage.getItem("token") || "";
  const decodeTokenData = decodeToken(token);
  const [userId, setUserId] = useState(decodeTokenData?.id || "");
  const navigate = useNavigate();
  const location = useLocation();  
  const [placeDetails, setPlaceDetails] = useState(null);
  const [originalForm, setOriginalForm] = useState(null);
  const [currentForm, setcurrentForm] = useState(null);
  

  const [loading, setLoading] = useState(true);
  const [googleListing, setGoogleListing] = useState("");
  const [displayBusinessName, setDisplayBusinessName] = useState(sessionStorage.getItem('displayBusinessName'));
  const [businessUrl, setBusinessUrl] = useState();
  const [noGoogleListing, setNoGoogleListing] = useState(false);
  const [noBusinessWebsite, setNoBusinessWebsite] = useState(false);
  const [businessUrlError, setBusinessUrlError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [urlVerificationInProgress, setUrlVerificationInProgress] =    useState(false);
   const [showPopup, setShowPopup] = useState(false);
      const [popupType, setPopupType] = useState(null);
      const tempPlaceRef = useRef(null);
      const [popupMessage, setPopupMessage] = useState("");
      const setHasFetched=true;
      const { handleCreateAgent } = useAgentCreator({
      stepValidator: () => "EditBusinessType",
      setLoading,
      setPopupMessage,
      setPopupType,
      setShowPopup,
      navigate,
      setHasFetched,
    });

  const agentName = sessionStorage.getItem("agentName") || "Agent";

//      const fetchPlaceDetails = (placeId) => {
//     // setLoading(true);
//     const service = new window.google.maps.places.PlacesService(
//       document.createElement("div")
//     );

//     service.getDetails({ placeId }, (result, status) => {
//       if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      
//         generateGoogleListingUrl(result);

//         const form1 = JSON.parse(sessionStorage.getItem("placeDetailsExtract") || "{}");
//         // Extract important fields from result
//         const businessData = {
//           businessName: result.name || "",
//           address: result.formatted_address || "",
//           phone: result.formatted_phone_number || "",
//           internationalPhone: result.international_phone_number || "",
//           website: result.website || "",
//           rating: result.rating || "",
//           totalRatings: result.user_ratings_total || "",
//           hours: result.opening_hours?.weekday_text || [],
//           businessStatus: result.business_status || "",
//           categories: result.types || [],
//         };
//         const updatedForm = {
//           ...form1,
//           ...businessData,
//         };
//         sessionStorage.setItem(
//           "placeDetailsExtract",
//           JSON.stringify(updatedForm)
//         );
     
//       } else {
//         console.error("Place details fetch failed:", status);
//       }
//       // setLoading(false);
//     });
//   };
//     const generateGoogleListingUrl = (place) => {
//     const address = [
//       place.address_components.find((c) => c.types.includes("street_number"))
//         ?.long_name,
//       place.address_components.find((c) => c.types.includes("route"))
//         ?.long_name,
//       place.address_components.find((c) => c.types.includes("premise"))
//         ?.long_name,
//       place.address_components.find((c) => c.types.includes("subpremise"))
//         ?.long_name,
//       place.address_components.find((c) =>
//         c.types.includes("sublocality_level_1")
//       )?.long_name,
//       place.address_components.find((c) => c.types.includes("locality"))
//         ?.long_name,
//       place.address_components.find((c) =>
//         c.types.includes("administrative_area_level_2")
//       )?.long_name,
//       place.address_components.find((c) =>
//         c.types.includes("administrative_area_level_1")
//       )?.long_name,
//     ]
//       .filter(Boolean)
//       .join(" ");

//     const googleLink = `https://www.google.com/search?q=${encodeURIComponent(
//       place.name + " " + address
//     )}`;
//     setGoogleListing(googleLink);
//   };
//   const initAutocomplete = () => {
//     const input = document.getElementById("google-autocomplete");
//     if (!input) return;

//     const autocomplete = new window.google.maps.places.Autocomplete(input, {
//       types: ["establishment"],
//       fields: ["place_id", "name", "url"],
//     });

//     autocomplete.addListener("place_changed", () => {
//       const place = autocomplete.getPlace();
//       if (place.place_id) {
//         // setGoogleListing(place.url);
//         // setDisplayBusinessName(place.name);
//         tempPlaceRef.current = place;
//         setPopupType("confirm");
//         setPopupMessage("You have changed your Google My Business listing. Do you want to apply these changes in buisness details?");
//         setShowPopup(true);

//         // sessionStorage.setItem("googleListing", place.url);
//         // sessionStorage.setItem("displayBusinessName", place.name);
//         // // sessionStorage.setItem("googlePlaceDetails", JSON.stringify(place));
//         //  fetchPlaceDetails(place.place_id);
//       }
//     });
//   };
//   useEffect(() => {
//   const savedForm = JSON.parse(sessionStorage.getItem("aboutBusinessForm")) || {};
//   const savedForm1 = JSON.parse(sessionStorage.getItem("businessDetails")) || {};
//     console.log(savedForm)
//   // Set initial state from sessionStorage
//   setGoogleListing(savedForm.googleListing || "");
//   setDisplayBusinessName(sessionStorage.getItem('displayBusinessName') || "");
//   setBusinessUrl(savedForm.businessUrl || HTTPS_PREFIX);
//   setNoGoogleListing(savedForm.isGoogleListing === 0);
//   setNoBusinessWebsite(savedForm.isWebsiteUrl === 0);

//   if (savedForm.isWebsiteUrl === 0) {
//     setIsVerified(true);
//   }

//   // Wait for Google API to load
//   const interval = setInterval(() => {
//     if (window.google?.maps?.places) {
//       initAutocomplete();
//       clearInterval(interval);
//       setLoading(false); // Hide loader when ready
//     }
//   }, 300);

//   return () => clearInterval(interval);
// }, []);

//   const handleUrlChange = (e) => {
//     let value = e.target.value;
//     value = value.replace(/https?:\/\//gi, "");
//     value = value.replace(/\s+/g, "");
//     setBusinessUrl(HTTPS_PREFIX + value);
//     if (businessUrlError) setBusinessUrlError("");
//   };

//   const handleUrlBlur = () => {
//     const urlPattern = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
//     if (!noBusinessWebsite && businessUrl && !urlPattern.test(businessUrl)) {
//       setBusinessUrlError(
//         "Please enter a valid URL starting with https:// and a valid domain."
//       );
//       setIsVerified(false);
//     } else {
//       setBusinessUrlError("");
//       setIsVerified(true); // Assume verified for now
//     }
//   };

//   const handleSave = () => {
//     if (
//       (!googleListing && !noGoogleListing) ||
//       (!businessUrl && !noBusinessWebsite && !isVerified)
//     ) {
//       alert("Please fill in all required fields or check the boxes.");
//       return;
//     }

//     const updatedForm = {
//       googleListing,
//       displayBusinessName,
//       businessUrl,
//       isGoogleListing: noGoogleListing ? 0 : 1,
//       isWebsiteUrl: noBusinessWebsite ? 0 : 1,
//     };

//     sessionStorage.setItem("aboutBusinessForm", JSON.stringify(updatedForm));
//     alert("Changes saved!");
//     navigate(-1); // Go back to previous page
//   };

//   const handleCloseConfirmation=()=>{
//     const place=tempPlaceRef.current;
//     if(place){
//      setGoogleListing(place.url);
//     setDisplayBusinessName(place.name);

//     sessionStorage.setItem("googleListing", place.url);
//     sessionStorage.setItem("displayBusinessName", place.name);
//     tempPlaceRef.current = null;

//     }
//   }
// const handleConfirmGMBChange = () => {
//   const place = tempPlaceRef.current;

//   if (place) {
//     setGoogleListing(place.url);
//     setDisplayBusinessName(place.name);

//     sessionStorage.setItem("googleListing", place.url);
//     sessionStorage.setItem("displayBusinessName", place.name);

//     fetchPlaceDetails(place.place_id); // Fetch details AFTER user confirms
    
//     tempPlaceRef.current = null;
//     setTimeout(()=>{
//           navigate('/edit-business-detail')

//     },700)
//   }

//   setShowPopup(false);
// };
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
    if (businessUrl?.trim()) {
      handleUrlVerification(businessUrl);
    }
  };
  const handleInputChange = (e) => {
    let v = e.target.value;
    v = v.replace(/https?:\/\//gi, "");
    v = v.replace(/\s+/g, "").toLowerCase();
    const final = HTTPS_PREFIX + v;
    setBusinessUrl(final);
      setcurrentForm(prev => ({
    ...prev,
    businessUrl: final
  }));
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
        setOriginalForm({
        googleListing: savedData.googleListing || "",
        businessUrl: savedData.businessUrl || "",
        isWebsiteUrl:savedData.isWebsiteUrl,
        isGoogleListing:savedData.isGoogleListing,

      });
        setcurrentForm({
        googleListing: savedData.googleListing || "",
        businessUrl: savedData.businessUrl || "",
        isWebsiteUrl:savedData.isWebsiteUrl,
        isGoogleListing:savedData.isGoogleListing,
 
      });

      if (savedData.businessUrl) setBusinessUrl(savedData.businessUrl);

      if (savedData.googleListing) {
        setGoogleListing(savedData.googleListing);
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
        // if (savedData.aboutBusiness) setAboutBusiness(savedData.aboutBusiness);
        // if (savedData.note) setNote(savedData.note);
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


 const handleContinue = (e) => {
    e.preventDefault();

    const isWebsiteValid = businessUrl && isVerified;
    const isGoogleListingValid = googleListing.trim();
    if (!isGoogleListingValid && !noGoogleListing) {
      setPopupType("failed");
      setPopupMessage(
        "Please provide a Google Listing or check the box if you don't have one."
      );
      setShowPopup(true);
      return;
    }
    if (!isWebsiteValid && !noBusinessWebsite) {
      setPopupType("failed");
      setPopupMessage(
        "Please provide a valid website or check the box if you don't have one."
      );
      setShowPopup(true);
      return;
    }


    sessionStorage.setItem(
      "aboutBusinessForm",
      JSON.stringify({
        businessUrl,
        googleListing,
        noGoogleListing,
        noBusinessWebsite

      })
    );
    navigate("/edit-business-detail");
  };
const isFormChanged = JSON.stringify(originalForm) !== JSON.stringify(currentForm);
return (
    <>
            <EditHeader title='Edit Agent ' agentName={agentnm} />
      <div className={styles.Maindiv}>
        <SectionHeader
          heading="Public Listing"
          subheading="Enter your Google My Business Listing & Website"
        />
      </div>

      <div className={styles.container}>
        <div className={styles.inputSection}>
          <label className={styles.label}>Google My Business</label>
       <input
            type="text"
            id="google-autocomplete"
            className={styles.input}
            placeholder="Type the name of your Business to Search"
            value={displayBusinessName}
            onChange={(e) => {
              setDisplayBusinessName(e.target.value);
                setcurrentForm(prev => ({
                ...prev,
                displayBusinessName: e.target.value
              }));
            }}
            disabled={noGoogleListing}
          />
        </div>
        <label className={styles.checkboxContainer}>
            {/* <input
            type="checkbox"
            checked={noGoogleListing}
            onChange={(e) => {
              setNoGoogleListing(e.target.checked);
              console.log('dsdsdsdsddsd')
              if (e.target.checked) {
                const checked = e.target.checked;
                setNoGoogleListing(checked)
                setGoogleListing("");
                setDisplayBusinessName("");
                const form = JSON.parse(sessionStorage.getItem("aboutBusinessForm") || "{}");
                sessionStorage.removeItem("googleListing");
                sessionStorage.removeItem("displayBusinessName");
                form.isGoogleListing = checked ? 0 : 1;
                console.log('dsdsdsdsds',form)
                sessionStorage.setItem("aboutBusinessForm", JSON.stringify(form));
              }
            }}
          /> */}
          <input
            type="checkbox"
            checked={noGoogleListing}
            onChange={(e) => {
              const checked = e.target.checked;
              setNoGoogleListing(checked);
              setcurrentForm(prev => ({
              ...prev,
              isGoogleListing: checked ? 1 : 0,}))

              const form = JSON.parse(sessionStorage.getItem("aboutBusinessForm") || "{}");
              form.isGoogleListing = checked ? 0 : 1;

              if (checked) {
                // Clear values if user says they don’t have Google Listing
                setGoogleListing("");
                setDisplayBusinessName("");
                sessionStorage.removeItem("googleListing");
                sessionStorage.removeItem("displayBusinessName");
                form.googleListing = "";
                form.displayBusinessName = "";
              } else {
                // Restore previous values if user unticks
                const prevGoogleListing = sessionStorage.getItem("googleListing");
                const prevDisplayName = sessionStorage.getItem("displayBusinessName");

                if (prevGoogleListing) {
                  setGoogleListing(prevGoogleListing);
                  form.googleListing = prevGoogleListing;
                }
                if (prevDisplayName) {
                  setDisplayBusinessName(prevDisplayName);
                  form.displayBusinessName = prevDisplayName;
                }
              }

              sessionStorage.setItem("aboutBusinessForm", JSON.stringify(form));
            }}
/>

          <span className={styles.customCheckbox}></span>
          I do not have Google My Business Listing
        </label>

        <hr className={styles.separator} />

        <div className={styles.inputSection}>
          <label className={styles.label}>Website (URL)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 {/* <input
              type="text"
              className={styles.input}
              placeholder="https://example.com"
              value={businessUrl}
              onChange={handleUrlChange}
              onBlur={handleUrlBlur}
              disabled={noBusinessWebsite}
            /> */}
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
                            selectionEnd === value?.length;

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
            {urlVerificationInProgress ? (
              <Loader size={20} />
            ) : !noBusinessWebsite && businessUrl?.length > HTTPS_PREFIX?.length ? (
              isVerified ? (
                <span style={{ color: 'green', fontSize: '20px' }}>✔️</span>
              ) : (
                <span style={{ color: 'red', fontSize: '20px' }}>❌</span>
              )
            ) : null}
          </div>
          {businessUrlError && (
            <div style={{ color: 'red', marginTop: '4px' }}>{businessUrlError}</div>
          )}
        </div>

        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={noBusinessWebsite}
            onChange={(e) => {
              const checked = e.target.checked;
              setNoBusinessWebsite(checked);
               setcurrentForm(prev => ({
              ...prev,
              isWebsiteUrl: checked ? 0 : 1,}))
              const form = JSON.parse(sessionStorage.getItem("aboutBusinessForm") || "{}");
              form.isWebsiteUrl = checked ? 0 : 1;
              if (checked) {
                setBusinessUrl('');
                setBusinessUrlError("");
                 setNoBusinessWebsite(checked);
               setcurrentForm(prev => ({
              ...prev,
              businessUrl:""}))
              }
              sessionStorage.setItem("aboutBusinessForm", JSON.stringify(form));

            }}
          />
          <span className={styles.customCheckbox}></span>
          I do not have a business website
        </label>

        <div className={styles.stickyWrapper} onClick={handleContinue}   style={{
    pointerEvents: isFormChanged ? "auto" : "none",
    opacity: isFormChanged ? 1 : 0.5, // Optional visual effect
  }}>
          <AnimatedButton label="Save" disabled={!isFormChanged}  />
        </div>
           {showPopup && (
                    <PopUp
                    type={popupType}
                    // onClose={handleCloseConfirmation}
                    message={popupMessage}
                    // onConfirm={handleConfirmGMBChange}
                    />
                )}
      </div>
    </>
  );
};

export default EditPublic;
