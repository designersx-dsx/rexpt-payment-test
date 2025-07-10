import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../BusinessListing/BusinessListing.module.css";
import { API_BASE_URL } from "../../Store/apiStore";
import PopUp from "../Popup/Popup";
import Loader from "../Loader/Loader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useAgentCreator } from "../../hooks/useAgentCreator";
import getKnowledgeBaseName from "../../utils/getKnowledgeBaseName";
import decodeToken from "../../lib/decodeToken";

const BusinessListing = forwardRef(
  (
    {
      onNext,
      onBack,
      onValidationError,
      onSuccess,
      onFailed,
      setLoading,
      onStepChange,
    },
    ref
  ) => {
    const [businessName, setBusinessName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [aboutBussiness, setAboutBusiness] = useState("");
    // const [loading, setLoading] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const token = localStorage.getItem("token");
    const decodeTokenData = decodeToken(token);
    const userId = decodeTokenData?.id;
    const agentCode = sessionStorage.getItem("AgentCode");
    const navigate = useNavigate();
    const EditingMode1 = localStorage.getItem("UpdationMode");
    const [selectedCountry, setSelectedCountry] = useState("us");
    const setHasFetched = true;
    const { handleCreateAgent } = useAgentCreator({
      stepValidator: () => "BusinessListing",
      setLoading,
      setPopupMessage,
      setPopupType,
      setShowPopup,
      navigate,
      setHasFetched,
    });
    const containsSpecialChars = (str) => /[!@#$%^&*(),.?":{}|<>]/.test(str);
    const containsEmoji = (str) =>
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g.test(
        str
      );
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    useEffect(() => {
      const storedDetails = sessionStorage.getItem("placeDetailsExtract");
      if (storedDetails) {
        const details = JSON.parse(storedDetails);
        setBusinessName(details?.businessName || "");
        setPhoneNumber(details.internationalPhone || details?.phone);
        setAddress(details?.address || "");
        setEmail(details?.email || "");
        setAboutBusiness(
          details?.aboutBusiness || details?.aboutBussiness || ""
        );
      }
      if (EditingMode1 != "ON") {
        const details = JSON.parse(storedDetails);
        setAboutBusiness(
          details?.aboutBusiness || details?.aboutBussiness || ""
        );
      }
    }, []);

    const handleInputChange = (field, value) => {
      const currentData = JSON.parse(
        sessionStorage.getItem("placeDetailsExtract") || "{}"
      );
      const updatedData = { ...currentData, [field]: value };
      sessionStorage.setItem(
        "placeDetailsExtract",
        JSON.stringify(updatedData)
      );

      switch (field) {
        case "businessName":
          setBusinessName(value);
          break;
        case "phone":
        case "internationalPhone":
          const formattedPhone = value.startsWith("+") ? value : `+${value}`;
          setPhoneNumber(formattedPhone);
          break;

        case "address":
          setAddress(value);
          break;
        case "email":
          setEmail(value);
          break;
        case "aboutBussiness":
          setAboutBusiness(value);
          break;
        default:
          break;
      }
    };
    const formatLabel = (str) =>
      str
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase())
        .replace(/_/g, " ");

    const handleSubmit = async (e) => {
      try {
        setLoading(true);
        const phoneNumberObj = parsePhoneNumberFromString(
          phoneNumber,
          selectedCountry
        );

        if (!phoneNumberObj || !phoneNumberObj.isValid()) {
          setLoading(false);
          setPopupType("failed");
          setPopupMessage("Please enter a valid phone number.");
          setShowPopup(true);

          return;
        }

        const aboutBusinessForm = JSON.parse(
          sessionStorage.getItem("aboutBusinessForm") || "{}"
        );
        const placeDetails = JSON.parse(
          sessionStorage.getItem("placeDetailsExtract") || "{}"
        );
        const business = JSON.parse(
          sessionStorage.getItem("businessDetails") || "{}"
        );
        const sessionBusinessiD = JSON.parse(sessionStorage.getItem("bId"));
        const knowledgeBaseId = sessionStorage.getItem("knowledgeBaseId");
        const displayBusinessName = sessionStorage.getItem(
          "displayBusinessName"
        );
        const packageName = sessionStorage.getItem("package") || "Free";
        const stepEditingMode = localStorage.getItem("UpdationModeStepWise");
        const EditingMode = localStorage.getItem("UpdationMode");
        const agentCount = 0;
        if (!businessName || !address || !phoneNumber) {
          setPopupType("failed");
          setPopupMessage("Please fill all required fields.");
          setShowPopup(true);

          return;
        }
        const updatedPlaceDetails = {
          ...placeDetails,
          businessName: businessName || placeDetails?.businessName,
          phone: phoneNumber,
          address: address,
          email: email,
          aboutBussiness: aboutBussiness,
          // name: businessName || placeDetails?.businessName || "",
        };
        sessionStorage.setItem(
          "placeDetailsExtract",
          JSON.stringify(updatedPlaceDetails)
        );

        const packageMap = {
          Free: 1,
          Starter: 2,
          Scaler: 3,
          Growth: 4,
          Corporate: 5,
          Enterprise: 6,
        };
        const packageValue = packageMap[packageName] || 1;
        const knowledgeBaseName = await getKnowledgeBaseName(
          business,
          userId,
          packageValue,
          agentCode
        );

        const businessData = {
          businessName: businessName || placeDetails?.businessName || "",
          address: placeDetails?.address || address,
          phone: placeDetails?.phone || phoneNumber,
          website: placeDetails?.website || aboutBusinessForm.businessUrl,
          rating: placeDetails?.rating || "",
          totalRatings: placeDetails?.totalRatings || "",
          hours: Array.isArray(placeDetails?.hours)
            ? placeDetails.hours.join(" | ")
            : "",
          businessStatus: placeDetails?.businessStatus || "",
          categories: Array.isArray(placeDetails?.categories)
            ? placeDetails.categories.join(", ")
            : "",
          email: email,
          aboutBussiness: aboutBussiness,
        };
        const placeDetailsForKBT = JSON.parse(
          sessionStorage.getItem("placeDetailsExtract") || "{}"
        );
        const readableDetails = Object?.entries(placeDetailsForKBT)
          .map(
            ([key, value]) =>
              `${formatLabel(key)}: ${
                Array.isArray(value) ? value.join(", ") : value || "N/A"
              }`
          )
          .join("\n");

        const knowledgeBaseText = [
          {
            title: "Business Details",
            text: readableDetails,
          },
        ];

        const rawUrl = aboutBusinessForm.businessUrl?.trim();
        const mergedUrls = [];
        if (rawUrl) {
          mergedUrls.push(rawUrl); // add businessUrl
        }

        if (aboutBusinessForm?.googleListing) {
          mergedUrls.push(aboutBusinessForm?.googleListing); // add googleListing
        }
        // const mergedUrls = rawUrl ? [rawUrl] : [];

        const formData = new FormData();
        const formData2 = new FormData();
        const formData3 = new FormData();
        if (mergedUrls.length > 0) {
          formData.append("knowledge_base_urls", JSON.stringify(mergedUrls));
          formData3.append("knowledge_base_urls", JSON.stringify(mergedUrls));
        }
        formData.append("knowledge_base_name", knowledgeBaseName);
        formData.append("enable_auto_refresh", "true");
        formData.append(
          "knowledge_base_texts",
          JSON.stringify(knowledgeBaseText)
        );
        formData2.append("knowledge_base_texts", JSON.stringify(businessData));
        //Crate Knowledge Base
        formData2.append("googleUrl", aboutBusinessForm.googleListing);
        formData2.append("webUrl", aboutBusinessForm.businessUrl.trim());
        formData2.append("aboutBusiness", aboutBussiness);
        formData2.append("additionalInstruction", aboutBusinessForm.note || "");
        formData2.append("agentId", localStorage.getItem("agent_id"));
        formData2.append("googleBusinessName", displayBusinessName || "");
        formData2.append("address1", businessData.address);
        formData2.append("businessEmail", email);
        formData2.append(
          "businessName",
          placeDetails?.businessName || businessName
        );
        formData2.append("phoneNumber", phoneNumber);
        formData2.append("isGoogleListing", aboutBusinessForm.noGoogleListing);
        formData2.append("isWebsiteUrl", aboutBusinessForm.noBusinessWebsite);

        formData3.append(
          "knowledge_base_texts",
          JSON.stringify(knowledgeBaseText)
        );
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
          formData2.append(
            "knowledge_base_id",
            response?.data?.knowledge_base_id
          );
        } else {
          const response = await axios.post(
            "https://api.retellai.com/create-knowledge-base",
            formData,
            {
              headers: {
                Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
              },
            }
          );
          formData2.append(
            "knowledge_base_id",
            response?.data?.knowledge_base_id
          );
          formData2.append("knowledge_base_name", knowledgeBaseName);

          knowledge_Base_ID = response.data.knowledge_base_id;
          sessionStorage.setItem("knowledgeBaseId", knowledge_Base_ID);
        }

        await axios.patch(
          `${API_BASE_URL}/businessDetails/updateKnowledeBase/${sessionBusinessiD}`,
          formData2,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (stepEditingMode === "ON" && knowledge_Base_ID) {
          handleCreateAgent();
        }

        if (stepEditingMode !== "ON") {
          if (onSuccess) {
            onSuccess({
              message: "Knowledge base created successfully!",
            });
            setTimeout(() => {
              onStepChange?.(5);
            }, 2000);
          }
        } else {
          setShowPopup(true);
          setPopupType("success");
          setPopupMessage("Knowledge base updated successfully!");
          setTimeout(() => {
            navigate("/agent-detail", {
              state: {
                agentId: localStorage.getItem("agent_id"),
                bussinesId: sessionBusinessiD,
              },
            });
          }, 1000);
        }
      } catch (error) {
        console.log(error);

        if (error?.response?.status === 422) {
          if (onFailed) {
            onFailed({
              message: "Knowledge base is currently updating. Try again later.",
            });
          }
        } else {
          if (onFailed) {
            onFailed({
              message: "Knowledge base is currently updating. Try again later.",
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };
    const EditingMode = localStorage.getItem("UpdationMode");
    //Using Error Handling
    useImperativeHandle(ref, () => ({
      validate: () => {
        let hasError = false;

        if (!businessName.trim()) {
          hasError = true;
          onValidationError?.({
            type: "failed",
            message: "Please enter the business name.",
          });
        } else if (containsEmoji(businessName)) {
          hasError = true;
          onValidationError?.({
            type: "failed",
            message:
              "Business name cannot contain special characters or emojis.",
          });
        } else if (!address.trim()) {
          hasError = true;
          onValidationError?.({
            type: "failed",
            message: "Please enter the business address.",
          });
        } else if (containsEmoji(address)) {
          hasError = true;
          onValidationError?.({
            type: "failed",
            message: "Address cannot contain emojis.",
          });
        } else if (!phoneNumber.trim()) {
          hasError = true;
          onValidationError?.({
            type: "failed",
            message: "Please enter a valid phone number.",
          });
        } else if (
          containsSpecialChars(phoneNumber) ||
          containsEmoji(phoneNumber)
        ) {
          hasError = true;
          onValidationError?.({
            type: "failed",
            message:
              "Phone number cannot contain special characters or emojis.",
          });
        } else if (email.trim() && !isValidEmail(email)) {
          hasError = true;
          onValidationError?.({
            type: "failed",
            message: "Please enter a valid email address.",
          });
        } else if (
          aboutBussiness.trim() &&
          (containsSpecialChars(aboutBussiness) ||
            containsEmoji(aboutBussiness))
        ) {
          hasError = true;
          onValidationError?.({
            type: "failed",
            message:
              "About Business cannot contain special characters or emojis.",
          });
        }

        return !hasError;
      },
      save: async () => {
        handleSubmit();
      },
    }));

    return (
      <div className={styles.container}>
        {/* <div className={styles.header}>
        <h1>{EditingMode ? 'Edit: Your Business Listing' : 'Your Business Listing'}</h1>
      </div> */}

        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.labReq}>
              <div className={styles.formGroup}>
                <label>
                  Business Name <span className={styles.requiredStar1}>*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => {
                    const value = e.target.value;
                    const noNumbersOrEmojis = value
                      .replace(/[0-9]/g, "") // remove digits
                      .replace(
                        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
                        ""
                      );
                    handleInputChange("businessName", noNumbersOrEmojis);
                  }}
                  placeholder="Your Business Name"
                  required
                  maxLength={50}
                />{" "}
              </div>

              <div className={styles.formGroup}>
                <label>
                  Phone Number <span className={styles.requiredStar1}>*</span>
                </label>
                <PhoneInput
                  country={selectedCountry}
                  value={phoneNumber}
                  onChange={(phone, countryData) => {
                    const fullPhone = phone.startsWith("+")
                      ? phone
                      : `+${phone}`;
                    setPhoneNumber(fullPhone);
                    setSelectedCountry(countryData?.countryCode || "us");
                    handleInputChange("phone", fullPhone);
                  }}
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    paddingLeft: "45px",
                    borderRadius: "5px",
                  }}
                  placeholder="+1 (123)456-7890"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  Address <span className={styles.requiredStar1}>*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Business Address"
                  required
                  maxLength={200}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Business Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Business Email Address"
                />
              </div>

              <div className={styles.formGroup}>
                <label>About My Business</label>
                <textarea
                  rows="5"
                  value={aboutBussiness}
                  onChange={(e) =>
                    handleInputChange("aboutBussiness", e.target.value)
                  }
                  placeholder="Describe"
                />
              </div>

              {/* <div className={styles.fixedBtn}>
            <button
              type="submit"
              className={styles.btnTheme}
              disabled={loading}       style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.6 : 1 }}
            >
              <img alt="" src="svg/svg-theme.svg" />
              <p  className="subBtn">{loading ? <>Saving &nbsp; <Loader size={18} /></> : "Submit"}</p>
            </button>
          </div> */}
            </div>
          </div>
        </form>
        {showPopup && (
          <PopUp
            type={popupType}
            message={popupMessage}
            onClose={() => setPopupMessage("")}
          />
        )}
      </div>
    );
  }
);

export default BusinessListing;
