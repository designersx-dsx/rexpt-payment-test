import React, { useEffect, useState, useRef } from 'react';
import styles from '../EditPublic/EditPublic.module.css';
import EditHeader from '../EditHeader/EditHeader';
import SectionHeader from '../SectionHeader/SectionHeader';
import AnimatedButton from '../AnimatedButton/AnimatedButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { listSiteMap, validateWebsite } from '../../Store/apiStore';
import Loader from '../Loader/Loader';
import decodeToken from '../../lib/decodeToken';
import { useAgentCreator } from '../../hooks/useAgentCreator';
import PopUp from '../Popup/Popup';
import { set } from 'date-fns';
import { useDashboardStore } from '../../Store/agentZustandStore';
import Modal2 from '../Modal2/Modal2';

const HTTPS_PREFIX = 'https://';
const PREFIX_LEN = HTTPS_PREFIX?.length;

const EditPublic = () => {
  const agentnm = sessionStorage.getItem("agentName");
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
  const [urlVerificationInProgress, setUrlVerificationInProgress] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const tempPlaceRef = useRef(null);
  const [popupMessage, setPopupMessage] = useState("");
  const { setHasFetched } = useDashboardStore();
  const [showSiteMapUrls, setShowSiteMapUrls] = useState([])
  const [showSiteMapModal, setShowSiteMapModal] = useState(false)
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [addOnUrl, setAddOnUrl] = useState("")
    const [debouncedUrl, setDebouncedUrl] = useState(businessUrl);
    const [isInitialLoad, setIsInitialLoad] = useState(true);


  // 🕒 Debounce logic - 2 sec delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUrl(businessUrl);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [businessUrl]);

  useEffect(() => {

      if (isInitialLoad) {
      return; // skip verification on first render
    }
    if (debouncedUrl && debouncedUrl.length > HTTPS_PREFIX.length) {
      handleUrlVerification(debouncedUrl);
    }
  }, [debouncedUrl]);

  const handleInputChanges = (e) => {
    setIsInitialLoad(false);
    let v = e.target.value;
    v = v.replace(/https?:\/\//gi, "");
    v = v.replace(/\s+/g, "").toLowerCase();
    const final = HTTPS_PREFIX + v;

    setBusinessUrl(final);
    setNoBusinessWebsite(false);
    if (businessUrlError) {
      setBusinessUrlError("");
    }
  };

      useEffect(() => {
    // check kare sabhi checkedStatus true hai ya nahi
    const allChecked = showSiteMapUrls.every(item => item.checkedStatus);

    if (allChecked) {
      // sab true hai to selectedUrls me sare urls daal do
      setSelectedUrls(showSiteMapUrls.map(item => item.url));
    } else {
      // warna khali ya jo logic aap chaho
      setSelectedUrls([]);
    }
  }, [showSiteMapUrls]);

  // const setHasFetched=true;
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
              setcurrentForm(prev => ({
          ...prev,
          googleListing: businessUrl
        }));
        sessionStorage.setItem("displayBusinessName", businessName);
        fetchPlaceDetails(place.place_id);
      }
    });
  };
  function extractAddressFields(addressComponents) {
    const getComponent = (primaryType, fallbackType = null, useShort = false) => {
      const comp = addressComponents.find((c) =>
        c.types.includes(primaryType) || (fallbackType && c.types.includes(fallbackType))
      );
      return comp ? (useShort ? comp.short_name : comp.long_name) : "";
    };
    return {
      city: getComponent("locality", "sublocality_level_1"),
      state: getComponent("administrative_area_level_1"),
      country: getComponent("country"),
      postal_code: getComponent("postal_code"),
      street_number: getComponent("street_number"),
      state_code: getComponent("administrative_area_level_1", null, true),
      country_code: getComponent("country", null, true),
    };
  }
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
        const addressFields = extractAddressFields(result?.address_components || []);
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
          street_number: addressFields.street_number || "",
          city: addressFields.city,
          state: addressFields.state,
          country: addressFields.country,
          postal_code: addressFields.postal_code,
          state_code: addressFields.state_code,
          country_code: addressFields.country_code,

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
      const prevUrl = sessionStorage.getItem("businessUrl");
      // if (prevUrl === url) {
      //   setUrlVerificationInProgress(false);
      //   return;
      // }

      setIsVerified(true);
      setBusinessUrlError("");
      sessionStorage.setItem("businessUrl", url);
      localStorage.setItem("isVerified", true);
      // setNoGoogleListing(false)
      const scrapedUrls = JSON.parse(sessionStorage.getItem("scrapedUrls") || "[]");
      if(originalForm.businessUrl != businessUrl || scrapedUrls.length == 0){
      const res = await listSiteMap(url);
      const formattedUrls = res.urls.map((link) => ({
        url: link,
        checkedStatus: false,
      }));
      setShowSiteMapModal(true);
      // update state
      setShowSiteMapUrls(formattedUrls);
      setAddOnUrl(url)
      // update sessionStorage
      sessionStorage.setItem("scrapedUrls", JSON.stringify(formattedUrls));
      }else{
           const urls = JSON.parse(sessionStorage.getItem("scrapedUrls")) || [];
           setShowSiteMapUrls(urls);
      }
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
        isWebsiteUrl: savedData.businessUrl ? 1:0,
        isGoogleListing: savedData.googleListing?1:0,
        siteMapUrls: JSON.parse(sessionStorage.getItem("scrapedUrls") || "[]")
      });
      setcurrentForm({
        googleListing: savedData.googleListing || "",
        businessUrl: savedData.businessUrl || "",
        isWebsiteUrl: savedData.businessUrl ? 1:0,
        isGoogleListing: savedData.googleListing?1:0,
        siteMapUrls: JSON.parse(sessionStorage.getItem("scrapedUrls") || "[]")
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
navigate("/edit-business-detail", { state: { isChanged: true } });
  };
  // const isFormChanged = JSON.stringify(originalForm) !== JSON.stringify(originalForm);
  const isFormChanged = () => {
  if (!originalForm || !currentForm) return false;

  if (originalForm.businessUrl !== currentForm.businessUrl) return true;
  if (originalForm.googleListing !== currentForm.googleListing) return true;
  if (originalForm.displayBusinessName !== currentForm.displayBusinessName) return true;
  if (originalForm.isWebsiteUrl !== currentForm.isWebsiteUrl) return true;
  if (originalForm.isGoogleListing !== currentForm.isGoogleListing) return true;

  // Compare sitemap URLs
  const origUrls = originalForm.siteMapUrls || [];
  const currUrls = currentForm.siteMapUrls || [];
  if (origUrls.length !== currUrls.length) return true;

  for (let i = 0; i < origUrls.length; i++) {
    if (
      origUrls[i].url !== currUrls[i].url ||
      origUrls[i].checkedStatus !== currUrls[i].checkedStatus
    ) return true;
  }

  return false; // nothing changed
};
  // console.log(originalForm,currentForm,isFormChanged)
  const handleViewSelectedUrl = (e) => {
    e.preventDefault();
     if(!isVerified)return;
    setShowSiteMapModal(true);

    //  Agar fresh state hai to wahi dikhao
    if (showSiteMapUrls?.length > 0) {
      return;
    }

    // Agar kuch nahi mila to fallback sessionStorage se
    const urls = JSON.parse(sessionStorage.getItem("scrapedUrls")) || [];
    setShowSiteMapUrls(urls);
  };
  //site map 
  // Select all handler
  const handleSelectAll = () => {
    if (showSiteMapUrls.length > 0) {
      // Check if all URLs are already selected
      const allSelected = showSiteMapUrls.every((u) => u.checkedStatus);

      // Toggle checkedStatus for all
      const updatedUrls = showSiteMapUrls.map((urlItem) => ({
        ...urlItem,
        checkedStatus: !allSelected,  //  toggle status
      }));
      setShowSiteMapUrls(updatedUrls);

      // Update selectedUrls state
      setSelectedUrls(!allSelected ? updatedUrls.map((u) => u.url) : []);

      // Update sessionStorage
      sessionStorage.setItem("scrapedUrls", JSON.stringify(updatedUrls));
      sessionStorage.setItem(
        "selectedUrls",
        JSON.stringify(!allSelected ? updatedUrls.map((u) => u.url) : [])
      );
      setcurrentForm(prev => ({
        ...prev,
        siteMapUrls: updatedUrls,
      }));
    } else {
      // ✅ fallback for single url
      const isChecked = !selectedUrls.includes(addOnUrl);

      // Update selectedUrls state
      setSelectedUrls(isChecked ? [addOnUrl] : []);

      // Update showSiteMapUrls state (for consistency)
      setShowSiteMapUrls([{ url: addOnUrl, checkedStatus: isChecked }]);

      // Update sessionStorage
      sessionStorage.setItem(
        "scrapedUrls",
        JSON.stringify([{ url: addOnUrl, checkedStatus: isChecked }])
      );
      sessionStorage.setItem(
        "selectedUrls",
        JSON.stringify(isChecked ? [addOnUrl] : [])
      );
      setcurrentForm(prev => ({
        ...prev,
        siteMapUrls: addOnUrl,
      }));
    }
  };

  // Single checkbox handler
  const handleCheckboxChange = (item) => {
    let updated;

    if (showSiteMapUrls.length > 0) {
      // FIX 1: Toggle and also update selectedUrls state
      updated = showSiteMapUrls.map((u) =>
        u.url === item.url ? { ...u, checkedStatus: !u.checkedStatus } : u
      );

      setShowSiteMapUrls(updated);

      // update selectedUrls as well
      const selected = updated.filter((u) => u.checkedStatus).map((u) => u.url);
      setSelectedUrls(selected);
      setcurrentForm(prev => ({
        ...prev,
        siteMapUrls: updated,
      }));

    } else {
      // single URL case
      const isChecked = !selectedUrls.includes(item.url);

      //  FIX 2: Keep consistency with checkedStatus + selectedUrls
      updated = [{ url: item.url, checkedStatus: isChecked }];

      setSelectedUrls(isChecked ? [item.url] : []);
      setShowSiteMapUrls(updated);
      setcurrentForm(prev => ({
        ...prev,
        siteMapUrls: updated,
      }));
    }
    sessionStorage.setItem("scrapedUrls", JSON.stringify(updated));

  };
  const isSubmitEnabled = showSiteMapUrls.length > 0
    ? showSiteMapUrls.some((u) => u.checkedStatus)
    : selectedUrls.includes(addOnUrl)

  useEffect(() => {
    const sessionSelected = JSON.parse(sessionStorage.getItem("selectedSiteMapUrls"));

    if (sessionSelected && sessionSelected.length > 0) {
      // Filter only those with checkedStatus: true
      const checkedUrls = sessionSelected
        .filter((item) => item.checkedStatus)
        .map((item) => item.url);

      setSelectedUrls(checkedUrls);
    }
  }, [showSiteMapUrls]);
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
                isGoogleListing: checked ? 0 :1,
              }))

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
            <input className={styles.input}

              id="https://your-website-url"
              type="url"
              placeholder="https://your website url"
              value={businessUrl}
              inputMode="url"
              autoComplete="url"
              // onBlur={handleBlur}
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
              // disabled={noBusinessWebsite || urlVerificationInProgress}
              disabled={noBusinessWebsite }
              onInput={handleInputChanges}
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
          {(!noBusinessWebsite&&businessUrl)&&<button disabled={urlVerificationInProgress} className={styles.modalViewBtn} onClick={handleViewSelectedUrl}>View</button>}
          {businessUrlError && (
            <div style={{ color: 'red', marginTop: '4px' }}>{businessUrlError}</div>
          )}
        </div>

        <label 
        disabled={urlVerificationInProgress} 
        className={styles.checkboxContainer}>
          <input
          className={styles.noBusinessWebsite}
            type="checkbox"
            checked={noBusinessWebsite}
            disabled={urlVerificationInProgress}
            onChange={(e) => {
              const checked = e.target.checked;
              setNoBusinessWebsite(checked);
              setcurrentForm(prev => ({
                ...prev,
                isWebsiteUrl: checked ? 0 : 1,
              }))
              const form = JSON.parse(sessionStorage.getItem("aboutBusinessForm") || "{}");
              form.isWebsiteUrl = checked ? 0 : 1;
              if (checked) {
                setBusinessUrl('');
                setBusinessUrlError("");
                setNoBusinessWebsite(checked);
                setcurrentForm(prev => ({
                  ...prev,
                  businessUrl: ""
                }))
              }
              sessionStorage.setItem("aboutBusinessForm", JSON.stringify(form));

            }}
          />
          <span className={styles.customCheckbox}></span>
          I do not have a business website
        </label>

        <div className={styles.stickyWrapper} onClick={handleContinue} style={{
          pointerEvents: isFormChanged() ? "auto" : "none",
          opacity: isFormChanged() ? 1 : 0.5, // Optional visual effect
        }}>
          <AnimatedButton label="Save" 
          // disabled={!isFormChanged || urlVerificationInProgress} 
          disabled={!isFormChanged() || urlVerificationInProgress} 
          />
        </div>
        {showPopup && (
          <PopUp
            type={popupType}
            onClose={() => { setShowPopup(false) }}
            message={popupMessage}
          // onConfirm={handleConfirmGMBChange}
          />
        )}
        {showSiteMapModal && <Modal2 isOpen={showSiteMapModal} onClose={() => setShowSiteMapModal(false)}>
          <div className={styles.sitemapModal}>
            {/* Select All */}
            <div className={styles.sitemapHeader}>
              <input
                type="checkbox"
                checked={
                  showSiteMapUrls.length > 0
                    ? selectedUrls.length === showSiteMapUrls.length
                    : selectedUrls.includes(addOnUrl)   // 👈 fallback for single url
                }
                onChange={handleSelectAll}
              />
              <label>Select All</label>
            </div>

            {/* URL list */}
            {/* <div className={styles.sitemapList}>
              {showSiteMapUrls.length > 0 ? (
                showSiteMapUrls.map((item, index) => (
                  <label className={styles.sitemapItem} key={index}>
                    <input
                      type="checkbox"
                      checked={item.checkedStatus}   // 👈 use checkedStatus
                      onChange={() => handleCheckboxChange(item)}
                    />
                    <span>{item.url}</span>  
                  </label>
                ))
              ) : (
                <label className={styles.sitemapItem}>
                <input
                  type="checkbox"
                  checked={selectedUrls.includes(addOnUrl)}
                  onChange={() =>
                    handleCheckboxChange({
                      url: addOnUrl,
                      checkedStatus: selectedUrls.includes(addOnUrl),
                    })
                  }
                />
                <span>{addOnUrl||}</span>
              </label>
              )
              }
            </div> */}
            <div className={styles.sitemapList}>
              {showSiteMapUrls.length > 0 ? (
                // Case 1: show all sitemap URLs
                showSiteMapUrls.map((item, index) => (
                  <label className={styles.sitemapItem} key={index}>
                    <input
                      type="checkbox"
                      checked={item.checkedStatus}
                      onChange={() => handleCheckboxChange(item)}
                    />
                    <span>{item.url}</span>
                  </label>
                ))
              ) : addOnUrl ? (
                // Case 2: fallback to addOnUrl
                <label className={styles.sitemapItem}>
                  <input
                    type="checkbox"
                    checked={selectedUrls.includes(addOnUrl)}
                    onChange={() =>
                      handleCheckboxChange({
                        url: addOnUrl,
                        checkedStatus: selectedUrls.includes(addOnUrl),
                      })
                    }
                  />
                  <span>{addOnUrl}</span>
                </label>
              ) : businessUrl ? (
                // Case 3: fallback to businessUrl (checked by default)
                <label className={styles.sitemapItem}>
                  <input
                    type="checkbox"
                    checked={true} // ✅ checked by default
                    onChange={() =>
                      handleCheckboxChange({
                        url: businessUrl,
                        checkedStatus: true,
                      })
                    }
                  />
                  <span>{businessUrl}</span>
                </label>
              ) : null}
            </div>



          </div>
        </Modal2>}
      </div>
    </>
  );
};

export default EditPublic;
