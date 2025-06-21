import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../BusinessListing/BusinessListing.module.css";
import { API_BASE_URL } from "../../Store/apiStore";

const BusinessListing = () => {
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [aboutBusiness, setAboutBusiness] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedDetails = sessionStorage.getItem("placeDetailsExtract");
    if (storedDetails) {
      const details = JSON.parse(storedDetails);
      setBusinessName(details.name || "");
      setPhoneNumber(details.phone || details.internationalPhone || "");
      setAddress(details.address || "");
      setEmail(details.email || "");
      setAboutBusiness(details.aboutBusiness || "");
    }
  }, []);

  const handleInputChange = (field, value) => {
    const currentData = JSON.parse(
      sessionStorage.getItem("placeDetailsExtract") || "{}"
    );
    const updatedData = { ...currentData, [field]: value };
    sessionStorage.setItem("placeDetailsExtract", JSON.stringify(updatedData));

    switch (field) {
      case "name":
        setBusinessName(value);
        break;
      case "phone":
      case "internationalPhone":
        setPhoneNumber(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "aboutBusiness":
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
    e.preventDefault();
    try {
      setLoading(true);
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
      const packageName = sessionStorage.getItem("package") || "Free";
      const stepEditingMode = localStorage.getItem("UpdationModeStepWise");
      const agentCount = 0;

      if (!businessName || !address || !phoneNumber) {
        alert("Please fill all required fields.");
        return;
      }
      const updatedPlaceDetails = {
        ...placeDetails,
        name: businessName,
        phone: phoneNumber,
        address: address,
        email: email,
        aboutBusiness: aboutBusiness,
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

      const matchedBusiness = businessTypes.find(
        (item) => item.name === business?.businessType
      );
      const businessCode = matchedBusiness ? matchedBusiness.code : "unknown";
      const shortBusinessName = sanitize(business?.businessName)?.slice(0, 10);
      const knowledgeBaseName = `${sanitize(
        businessCode
      )}_${shortBusinessName}_${packageValue}_#${agentCount}`;

      const businessData = {
        name: placeDetails.name || businessName,
        address: placeDetails.address || address,
        phone: placeDetails.phone || phoneNumber,
        website: placeDetails.website || aboutBusinessForm.businessUrl,
        rating: placeDetails.rating || "",
        totalRatings: placeDetails.totalRatings || "",
        hours: (placeDetails.hours || []).join(" | ") || "",
        businessStatus: placeDetails.businessStatus || "",
        categories: (placeDetails.categories || []).join(", ") || "",
      };

      const placeDetailsForKBT = JSON.parse(
        sessionStorage.getItem("placeDetailsExtract") || "{}"
      );

      const readableDetails = Object.entries(placeDetailsForKBT)
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
      const mergedUrls = rawUrl ? [rawUrl] : [];

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
      formData2.append(
        "knowledge_base_texts",
        JSON.stringify(knowledgeBaseText)
      );
      formData3.append(
        "knowledge_base_texts",
        JSON.stringify(knowledgeBaseText)
      );
      formData2.append("googleUrl", aboutBusinessForm.googleListing);
      formData2.append("webUrl", aboutBusinessForm.businessUrl.trim());
      formData2.append("aboutBusiness", aboutBusiness);
      formData2.append("additionalInstruction", aboutBusinessForm.note || "");
      formData2.append("knowledge_base_name", knowledgeBaseName);
      formData2.append("agentId", localStorage.getItem("agent_id"));
      formData2.append("googleBusinessName", businessData.name);
      formData2.append("address1", businessData.address);
      formData2.append("businessEmail", email);
      formData2.append("businessName", businessName);
      formData2.append("phoneNumber", phoneNumber);

      let knowledge_Base_ID = knowledgeBaseId;

      if (knowledge_Base_ID) {
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
        formData2.append("knowledge_base_id", response.data.knowledge_base_id);
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
        const llmId =
          localStorage.getItem("llmId") || sessionStorage.getItem("llmId");
        const agentConfig = { knowledge_base_ids: [knowledge_Base_ID] };
        await axios.patch(
          `https://api.retellai.com/update-retell-llm/${llmId}`,
          agentConfig,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (stepEditingMode !== "ON") {
        alert("Knowledge base created successfully!");
        navigate("/steps");
      } else {
        alert("Knowledge base updated successfully!");
        navigate("/agent-detail", {
          state: {
            agentId: localStorage.getItem("agent_id"),
            bussinesId: sessionBusinessiD,
          },
        });
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        alert("Knowledge base is currently updating. Try again later.");
      } else {
        console.error("Submission failed:", error);
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Your Business Listing</h1>
      </div>

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
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your Business Name"
                required
              />{" "}
            </div>

            <div className={styles.formGroup}>
              <label>
                Phone Number <span className={styles.requiredStar1}>*</span>
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="88XX 77X 6XX"
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
              />
            </div>

            <div className={styles.formGroup}>
              <label>Business Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Business Email Address"
              />
            </div>

            <div className={styles.formGroup}>
              <label>About My Business</label>
              <textarea
                rows="5"
                value={aboutBusiness}
                onChange={(e) =>
                  handleInputChange("aboutBusiness", e.target.value)
                }
                placeholder="Describe"
              />
            </div>
          </div>

          <div className={styles.fixedBtn}>
            <button
              type="submit"
              className={styles.btnTheme}
              disabled={loading}
            >
              <img alt="" src="svg/svg-theme.svg" />
              <p>{loading ? "Submitting..." : "Submit"}</p>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BusinessListing;
