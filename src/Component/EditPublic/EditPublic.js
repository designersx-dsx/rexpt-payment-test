import React, { useEffect, useState, useRef } from 'react';
import styles from '../EditPublic/EditPublic.module.css';
import EditHeader from '../EditHeader/EditHeader';
import SectionHeader from '../SectionHeader/SectionHeader';
import AnimatedButton from '../AnimatedButton/AnimatedButton';
import { useNavigate } from 'react-router-dom';
import { validateWebsite } from '../../Store/apiStore';
import Loader from '../Loader/Loader';

const HTTPS_PREFIX = 'https://';
const PREFIX_LEN = HTTPS_PREFIX.length;

const EditPublic = () => {
  const navigate = useNavigate();

  const fetchPublic = JSON.parse(sessionStorage.getItem("aboutBusinessForm") || "{}");

  const [googleListing, setGoogleListing] = useState(fetchPublic?.googleListing || "");
  const [businessUrl, setBusinessUrl] = useState(fetchPublic?.businessUrl || HTTPS_PREFIX);
  const [displayBusinessName, setDisplayBusinessName] = useState(fetchPublic?.displayBusinessName || "");
  const [noGoogleListing, setNoGoogleListing] = useState(fetchPublic?.isGoogleListing === 0);
  const [noBusinessWebsite, setNoBusinessWebsite] = useState(fetchPublic?.isWebsiteUrl === 0);
  const [businessUrlError, setBusinessUrlError] = useState("");

  const [isVerified, setIsVerified] = useState(false);
  const [verificationInProgress, setVerificationInProgress] = useState(false);

  const initialNoGoogleListing = useRef(fetchPublic?.isGoogleListing === 0);
  const initialNoBusinessWebsite = useRef(fetchPublic?.isWebsiteUrl === 0);

  useEffect(() => {
    const updated = {
      ...fetchPublic,
      googleListing,
      displayBusinessName,
      businessUrl,
      noGoogleListing,
      noBusinessWebsite,
    };
    sessionStorage.setItem("aboutBusinessForm", JSON.stringify(updated));
  }, [googleListing, displayBusinessName, businessUrl, noGoogleListing, noBusinessWebsite]);
  const fetchPlaceDetails = (placeId) => {
    // setLoading(true);
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails({ placeId }, (result, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      
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
     
      } else {
        console.error("Place details fetch failed:", status);
      }
      // setLoading(false);
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
  const initAutocomplete = () => {
    const input = document.getElementById("google-autocomplete");
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ["establishment"],
      fields: ["place_id", "name", "url"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.place_id) {
        setGoogleListing(place.url);
        setDisplayBusinessName(place.name);

        sessionStorage.setItem("googleListing", place.url);
        sessionStorage.setItem("displayBusinessName", place.name);
        sessionStorage.setItem("googlePlaceDetails", JSON.stringify(place));
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

 const handleUrlInput = (e) => {
  let value = e.target.value;

  // Remove all occurrences of http:// or https:// from anywhere in the string
  value = value.replace(/(https?:\/\/)+/gi, '');

  // Remove all whitespace
  value = value.replace(/\s+/g, '');

  // Add single correct prefix
  const finalUrl = HTTPS_PREFIX + value;

  setBusinessUrl(finalUrl);

  if (businessUrlError) setBusinessUrlError('');
};


  const handleUrlBlur = () => {
    if (!noBusinessWebsite && businessUrl) {
      const urlPattern = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
      if (!urlPattern.test(businessUrl)) {
        setBusinessUrlError("Please enter a valid URL starting with https:// and a valid domain.");
      } else {
        setBusinessUrlError('');
      }
    }
  };

  useEffect(() => {
    if (noBusinessWebsite || !businessUrl || businessUrl === HTTPS_PREFIX) return;

    const delayDebounce = setTimeout(async () => {
      setVerificationInProgress(true);
      try {
        const result = await validateWebsite(businessUrl);
        setIsVerified(result?.valid || false);
      } catch (err) {
        setIsVerified(false);
      } finally {
        setVerificationInProgress(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [businessUrl]);

  const handleSave = () => {
    let hasError = false;

    if (!googleListing && !noGoogleListing) {
      alert("Please provide a Google Listing or check the box.");
      hasError = true;
    }

    if ((!businessUrl || businessUrlError) && !noBusinessWebsite) {
      alert("Please provide a valid Website URL or check the box.");
      hasError = true;
    }

    if (hasError) return;

    const updatedForm = {
      ...fetchPublic,
      googleListing,
      displayBusinessName,
      businessUrl,
      noGoogleListing,
      noBusinessWebsite,
      isGoogleListing: noGoogleListing ? 0 : 1,
      isWebsiteUrl: noBusinessWebsite ? 0 : 1,
    };
    sessionStorage.setItem("aboutBusinessForm", JSON.stringify(updatedForm));

    const isListingChanged = noGoogleListing !== initialNoGoogleListing.current;
    const isWebsiteChanged = noBusinessWebsite !== initialNoBusinessWebsite.current;

    if (isListingChanged || isWebsiteChanged) {
      navigate("/edit-business-detail");
    } else {
      alert("No changes detected.");
    }
  };

  return (
    <>
      <EditHeader title="Edit Agent" agentName="Sofia" />
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
            onChange={(e) => setDisplayBusinessName(e.target.value)}
            disabled={noGoogleListing}
          />
        </div>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={noGoogleListing}
            onChange={(e) => {
              const checked = e.target.checked;
              setNoGoogleListing(checked);
              if (checked) {
                setGoogleListing("");
                setDisplayBusinessName("");
                sessionStorage.removeItem("googleListing");
                sessionStorage.removeItem("displayBusinessName");
                sessionStorage.removeItem("googlePlaceDetails");
              }
            }}
          />
          <span className={styles.customCheckbox}></span>
          I do not have Google My Business Listing
        </label>

        <hr className={styles.separator} />

        <div className={styles.inputSection}>
          <label className={styles.label}>Website (URL)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              className={styles.input}
              placeholder="https://example.com"
              value={businessUrl}
              onInput={handleUrlInput}
              onBlur={handleUrlBlur}
              disabled={noBusinessWebsite}
            />
            {verificationInProgress ? (
              <Loader size={20} />
            ) : !noBusinessWebsite && businessUrl.length > HTTPS_PREFIX.length ? (
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
              const form = JSON.parse(sessionStorage.getItem("aboutBusinessForm") || "{}");
              form.isWebsiteUrl = checked ? 0 : 1;
              sessionStorage.setItem("aboutBusinessForm", JSON.stringify(form));
              if (checked) {
                setBusinessUrl(HTTPS_PREFIX);
                setBusinessUrlError("");
              }
            }}
          />
          <span className={styles.customCheckbox}></span>
          I do not have a business website
        </label>

        <div className={styles.stickyWrapper} onClick={handleSave}>
          <AnimatedButton label="Save" />
        </div>
      </div>
    </>
  );
};

export default EditPublic;
