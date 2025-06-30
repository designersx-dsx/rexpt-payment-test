import React, {
  useState, useEffect, useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "../BusinessServices/BusinessServices.module.css";
import { useNavigate } from "react-router-dom";
import { validateEmail as validateEmailAPI } from "../../Store/apiStore";
import PopUp from "../Popup/Popup";
import { useAgentCreator } from "../../hooks/useAgentCreator";
import axios from "axios";
import { API_BASE_URL } from "../../Store/apiStore";
import decodeToken from "../../lib/decodeToken";
import Loader from "../Loader/Loader";
const BusinessServices = forwardRef(({ onNext, onBack, onValidationError, onSuccess, onFailed, setLoading, onStepChange }, ref) => {
  const navigate = useNavigate();
  const [businessType, setBusinessType] = useState("Restaurant");
  const [selectedService, setSelectedService] = useState([]);
  const [businessName, setBusinessName] = useState("");
  const [businessSize, setBusinessSize] = useState("");
  const [email, setEmail] = useState("");
  // Error states
  const [serviceError, setServiceError] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");

  // const [Loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const EditingMode = localStorage.getItem("UpdationMode");
  const [customServiceSelected, setCustomServiceSelected] = useState(false);
  const stepEditingMode = localStorage.getItem("UpdationModeStepWise");

  const setHasFetched = true;
  const { handleCreateAgent } = useAgentCreator({
    stepValidator: () => "businesServices",
    setLoading,
    setPopupMessage,
    setPopupType,
    setShowPopup,
    navigate,
    setHasFetched,
  });
  useEffect(() => {

  }, [])
  const businessServices = [
    {
      type: "Restaurant",
      subtype: "Your Journey Begins Here",
      icon: "svg/Restaurant-icon.svg",
      services: [
        "Dine-in Service",
        "Takeaway Orders",
        "Home Delivery",
        "Event Catering",
        "Online Ordering",
        "Other"
      ],
    },
    {
      type: "Real Estate Broker",
      subtype: "Your Journey Begins Here",
      icon: "svg/Estate-icon.svg",
      services: [
        "Property Sales",
        "Property Rentals",
        "Property Viewings",
        "Price Valuation",
        "Legal Help",
        "Other"
      ],
    },
    {
      type: "Saloon",
      subtype: "Your Journey Begins Here",
      icon: "svg/Saloon-icon.svg",
      services: [
        "Haircuts",
        "Hair Spa Treatments",
        "Hair Straightening",
        "Nail Extensions",
        "Facials",
        "Other"
      ],
    },
    {
      type: "Doctor's Clinic",
      subtype: "Your Journey Begins Here",
      icon: "svg/Doctor-clinic-icon.svg",
      services: [
        "General Checkups",
        "Specialist Consultations",
        "Vaccinations",
        "Blood Tests",
        "Health Screenings",
        "Other"
      ],
    },
    {
      type: "Dry Cleaner",
      subtype: "Your Journey Begins Here",
      icon: "svg/Dry -Cleaner-icon.svg",
      services: [
        "Garment Cleaning",
        "Stain Removal",
        "Clothing Alterations",
        "Leather & Suede Cleaning",
        "Other"
      ],
    },
    {
      type: "Web Design Agency",
      subtype: "Your Journey Begins Here",
      icon: "svg/Web-Design-Agency-icon.svg",
      services: [
        "Website Creation",
        "Responsive Design",
        "SEO Services",
        "Website Maintenance",
        "E-commerce Setup",
        "Other"
      ],
    },
    {
      type: "Gym & Fitness Center",
      subtype: "Your Journey Begins Here",
      icon: "svg/Gym-icon.svg",
      services: [
        "Group Fitness Classes",
        "Weight Training Equipment",
        "Cardio Workouts",
        "Personal Training Sessions",
        "Other"
      ],
    },
    {
      type: "Marketing Agency",
      subtype: "Your Journey Begins Here",
      icon: "svg/Marketing Agency.svg",
      services: [
        "Social Media Advertising",
        "Content Creation",
        "Email Marketing",
        "PPC Ads",
        "Branding Strategy",
        "Other"
      ],
    },
    {
      type: "Personal Trainer",
      subtype: "Your Journey Begins Here",
      icon: "images/other.png",
      services: [
        "Personalized Workout Plans",
        "One-on-One Training",
        "Nutrition Guidance",
        "Fitness Assessments",
        "Other"
      ],
    },
    {
      type: "Architect",
      subtype: "Your Journey Begins Here",
      icon: "svg/Architect-icon.svg",
      services: [
        "Residential Building Design",
        "Commercial Building Plans",
        "Renovation Planning",
        "Permit Drawings",
        "Site Planning",
        "Project Management",
        "Other"
      ],
    },
    {
      type: "Interior Designer",
      subtype: "Your Journey Begins Here",
      icon: "images/other.png",
      services: [
        "Space Planning",
        "Furniture Selection",
        "Color Consultation",
        "Lighting Design",
        "Home Makeovers",
        "Other"
      ],
    },
    {
      type: "Construction Services",
      subtype: "Your Journey Begins Here",
      icon: "svg/Construction Services.svg",
      services: [
        "New Building Construction",
        "Home Renovations",
        "Project Supervision",
        "Structural Repairs",
        "Other"
      ],
    },
    {
      type: "Cleaning/Janitorial Service",
      subtype: "Your Journey Begins Here",
      icon: "images/other.png",
      services: [
        "Office Cleaning",
        "Deep Carpet Cleaning",
        "Window Washing",
        "Floor Polishing",
        "Regular Maintenance",
        "Other"
      ],
    },
    {
      type: "Transport Company",
      subtype: "Your Journey Begins Here",
      icon: "images/other.png",
      services: [
        "Freight Shipping",
        "Passenger Transport",
        "Courier Services",
        "Vehicle Rentals",
        "Logistics Management",
        "Other"
      ],
    },
    {
      type: "Landscaping Company",
      subtype: "Your Journey Begins Here",
      icon: "images/other.png",
      services: [
        "Lawn Mowing & Maintenance",
        "Garden Design",
        "Tree Pruning & Removal",
        "Irrigation Installation",
        "Other"
      ],
    },
    {
      type: "Insurance Agency",
      subtype: "Your Journey Begins Here",
      icon: "svg/Insurance Agency.svg",
      services: [
        "Life Insurance",
        "Health Insurance",
        "Car Insurance",
        "Home Insurance",
        "Business Insurance",
        "Other"
      ],
    },
    {
      type: "Financial Services",
      subtype: "Your Journey Begins Here",
      icon: "images/other.png",
      services: [
        "Investment Planning",
        "Tax Preparation",
        "Retirement Planning",
        "Wealth Management",
        "Loan Consulting",
        "Other"
      ],
    },
    {
      type: "Accounting Services",
      subtype: "Your Journey Begins Here",
      icon: "svg/Accounting Services.svg",
      services: [
        "Bookkeeping",
        "Tax Filing",
        "Payroll Services",
        "Financial Auditing",
        "Business Financial Reports",
        "Other"
      ],
    },
    {
      type: "Car Repair & Garage",
      subtype: "Your Journey Begins Here",
      icon: "images/other.png",
      services: [
        "Oil & Filter Change",
        "Brake Repairs",
        "Engine Diagnostics",
        "Tire Replacement",
        "Battery Service",
        "Other"
      ],
    },
    {
      type: "Boat Repair & Maintenance",
      subtype: "Your Journey Begins Here",
      icon: "images/other.png",
      services: [
        "Hull Repair",
        "Engine Maintenance",
        "Electrical System Repairs",
        "Boat Cleaning",
        "Winterizing Services",
        "Other"
      ],
    },
    {
      type: "Dentist",
      subtype: "Your Journey Begins Here",
      icon: "images/other.png",
      services: [
        "Teeth",
        "Cleaning",
        "Teeth Whitening",
        "Braces & Aligners",
        "Root Canal",
        "Tooth Extraction",
        "Other"
      ],
    },
    {
      type: "Property Rental & Leasing Service",
      subtype: "Your Journey Begins Here",
      icon: "svg/Property Rental & Leasing Service.svg",
      services: [
        "Tenant Screening",
        "Lease Agreement Preparation",
        "Rent Collection",
        "Property Maintenance Coordination",
        "Other"
      ],
    },
    {
      type: "Old Age Home",
      subtype: "Your Journey Begins Here",
      icon: "svg/Old Age Home.svg",
      services: [
        "Assisted Living",
        "Meal Services",
        "Housekeeping & Laundry",
        "Recreational Activities",
        "Physiotherapy",
        "Emergency Support",
        "Other"
      ],
    },
    {
      type: "Travel Agency",
      subtype: "Your Journey Begins Here",
      icon: "svg/Travel Agency.svg",
      services: [
        "Flight Booking",
        "Hotel Reservations",
        "Holiday Packages",
        "Visa Assistance",
        "Travel Insurance",
        "Customized Itineraries",
        "Cruise Bookings",
        "Local Tours & Sightseeing",
        "Car Rentals",
        "Other"
      ],
    },
    {
      type: "Ticket Booking",
      subtype: "Your Journey Begins Here",
      icon: "svg/Ticket Booking.svg",
      services: [
        "Flight Tickets",
        "Train Tickets",
        "Bus Tickets",
        "Movie Tickets",
        "Event Tickets",
        "Amusement Park Tickets",
        "Concert & Show Tickets",
        "Sports Tickets",
        "Other"
      ],
    }
    ,
    {
      type: "Financial Planners",
      subtype: "Your Journey Begins Here",
      icon: "svg/Financial Planners.svg",
      services: [
        "Retirement Planning",
        "Investment Portfolio Management",
        "Tax Planning",
        "Budgeting & Expense Management",
        "Estate Planning",
        "Insurance Planning",
        "Education Planning",
        "Debt Management",
        "Other"
      ],
    },
    {
      type: "Beauty Parlour",
      subtype: "Your Journey Begins Here",
      icon: "svg/Beauty Parlour.svg",
      services: [
        "Hair Cutting & Styling",
        "Facials & Cleanups",
        "Manicure & Pedicure",
        "Bridal Makeup",
        "Hair Coloring & Highlights",
        "Waxing & Threading",
        "Skin Treatments",
        "Makeup for Events",
        "Spa & Massage Services",
        "Other"
      ],
    },
    {
      type: "Nail Salon",
      subtype: "Your Journey Begins Here",
      icon: "svg/Nail Saloon.svg",
      services: [
        "Manicure",
        "Pedicure",
        "Nail Art",
        "Gel Nails",
        "Acrylic Nails",
        "Nail Extensions",
        "Cuticle Care",
        "Nail Repair & Removal",
        "Hand & Foot Spa",
        "Other"
      ],
    }
    ,
    {
      type: "Barber Studio/Shop",
      subtype: "Your Journey Begins Here",
      icon: "svg/Barber.svg",
      services: [
        "Haircut",
        "Beard Trimming & Styling",
        "Shaving & Grooming",
        "Hair Coloring",
        "Head Massage",
        "Facial for Men",
        "Scalp Treatment",
        "Hair Wash & Styling",
        "Kids Haircut",
        "Other"
      ],
    }
    ,
    {
      type: "Hair Stylist",
      subtype: "Your Journey Begins Here",
      icon: "svg/Hair Stylist.svg",
      services: [
        "Hair Cutting & Trimming",
        "Hair Styling",
        "Blow Dry & Ironing",
        "Hair Coloring & Highlights",
        "Hair Spa",
        "Keratin & Smoothening Treatments",
        "Hair Extensions",
        "Scalp Treatments",
        "Bridal & Occasion Hairstyles",
        "Other"
      ],
    }
    ,
    {
      type: "Bakery",
      subtype: "Your Journey Begins Here",
      icon: "svg/Bakery.svg",
      services: [
        "Custom Cakes",
        "Birthday & Wedding Cakes",
        "Pastries & Cupcakes",
        "Cookies & Biscuits",
        "Bread & Buns",
        "Chocolates & Desserts",
        "Eggless & Sugar-Free Items",
        "Bulk & Party Orders",
        "Online Ordering & Delivery",
        "Other"
      ],
    },
    {
      type: "Cleaning Janitorial Service",
      subtype: "Your Journey Begins Here",
      icon: "svg/Cleaning Janitorial Service.svg",
      services: [
        "Residential Cleaning",
        "Commercial Office Cleaning",
        "Deep Cleaning Services",
        "Move-In/Move-Out Cleaning",
        "Carpet & Upholstery Cleaning",
        "Window Cleaning",
        "Disinfection & Sanitization",
        "Post-Construction Cleaning",
        "Restroom Cleaning & Maintenance",
        "Other"
      ],
    }
    ,
    ,
    {
      type: "Other Local Business",
      subtype: "Your Journey Begins Here",
      icon: "images/other.png",
      services: [
        "Custom Services – Please Specify Your Business Type and Needs",
      ],
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const selectedBusiness = businessServices?.find(
    (biz) => biz.type === businessType
  );
  console.log(selectedBusiness,"selectedBusiness")
  const selectedServices = selectedBusiness?.services || [];
  const filteredServices = selectedServices.filter((service) =>
    service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateService = (value) => {
    if (!value) {
      setServiceError("Please select a service.");
      return false;
    }
    setServiceError("");
    return true;
  };
  const checkIfBusinessIdExist = Boolean(sessionStorage.getItem("bId"))
  const handleContinue = async () => {
    const containsOther = selectedService.includes("Other");
    console.log(containsOther,"containsOthercontainsOthercontainsOthercontainsOther")
    const raw = sessionStorage.getItem("businesServices");
    let previous = {};
    try {
      previous = raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error("Failed to parse businesServices:", err);
    }

    const updatedBusinessServices = {
      ...previous,
      selectedService,
      email,
    };

    sessionStorage.setItem("businesServices", JSON.stringify(updatedBusinessServices));
    const businessDetailsRaw = sessionStorage.getItem("businessDetails");
    const businessDetails = businessDetailsRaw
      ? JSON.parse(businessDetailsRaw)
      : {};

    const finalBusinessDetails = {
      ...businessDetails,
      selectedService,
      email,
    };

    sessionStorage.setItem("businessDetails", JSON.stringify(finalBusinessDetails));
    sessionStorage.setItem("selectedServices", JSON.stringify(selectedService));
    if (containsOther) {
      console.log("CUSTOM")
      onStepChange?.(1);
      
    }
    else {
         console.log("NOT CUSTOM")
      try {
        setLoading(true);
        const API_URL = checkIfBusinessIdExist
          ? `${API_BASE_URL}/businessDetails/updateBusinessDetailsByUserIDandBuisnessID/${decodeToken(localStorage.getItem("token")).id}?businessId=${sessionStorage.getItem("bId")}`
          : `${API_BASE_URL}/businessDetails/create`;
        const response = await axios({
          method: checkIfBusinessIdExist ? "PATCH" : "POST",
          url: API_URL,
          data: {
            userId: decodeToken(localStorage.getItem("token")).id,
            businessName: finalBusinessDetails.businessName,
            businessSize: finalBusinessDetails.businessSize,
            businessType: finalBusinessDetails.businessType,
            customBuisness: finalBusinessDetails.customBuisness || "",
            buisnessEmail: email,
            buisnessService: selectedService,
            customServices: [],
          },
        });

        const id = response.data.businessId;
        sessionStorage.setItem("bId", id);
        sessionStorage.setItem("businessId", JSON.stringify({ businessId: id }));
        if (onSuccess) {
          if (checkIfBusinessIdExist) {

          }
          else {
            onSuccess({
              message: "Business details saved successfully"
            })
          }

          setTimeout(() => {
            onStepChange?.(3);
          }, 2000);

        }
        // setPopupType("success");
        // setPopupMessage("Business details saved successfully");
        // setShowPopup(true);
        // setTimeout(() => {
        //   navigate("/about-business");
        // }, 1000);

      } catch (error) {
        console.error("❌ Error saving business details:", error);
        // setPopupType("failed");
        // setPopupMessage("Failed to save business details.");
        // setShowPopup(true);
        if (onFailed) {
          onFailed({
            message: "Failed to save business details.",
          })
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    try {
      const isUpdateMode = localStorage.getItem("UpdationMode") === "ON";

      const rawBusinessDetails = sessionStorage.getItem("businessDetails");
      const rawBusinessServices = sessionStorage.getItem("businesServices");
      const businessDetails =
        rawBusinessDetails &&
          rawBusinessDetails !== "null" &&
          rawBusinessDetails !== "undefined"
          ? JSON.parse(rawBusinessDetails)
          : null;

      const businessServices =
        rawBusinessServices &&
          rawBusinessServices !== "null" &&
          rawBusinessServices !== "undefined"
          ? JSON.parse(rawBusinessServices)
          : null;

      if (!isUpdateMode) {
        if (businessDetails) {
          setBusinessType(businessDetails.businessType || "");
          setBusinessName(businessDetails.businessName || "");
          setBusinessSize(businessDetails.businessSize || "");
          if (businessServices?.selectedService) {
            try {
              let finalSelected = [];

              if (typeof businessServices.selectedService === "string") {
                const parsed = JSON.parse(businessServices.selectedService);
                if (Array.isArray(parsed)) {
                  finalSelected = parsed;
                }
              } else if (Array.isArray(businessServices.selectedService)) {
                finalSelected = businessServices.selectedService;
              }

              setSelectedService(finalSelected);
            } catch (err) {
              console.error("❌ Failed to parse selectedService:", err);
            }

            setEmail(businessServices.email || "");
          }
          setEmail(businessDetails.email || "");
        }
      } else {
        if (businessDetails) {
          setBusinessType(businessDetails.businessType || "");
          setBusinessName(businessDetails.businessName || "");
          setBusinessSize(businessDetails.businessSize || "");
        }

        if (businessServices?.selectedService) {
          try {
            let finalSelected = [];

            if (typeof businessServices.selectedService === "string") {
              const parsed = JSON.parse(businessServices.selectedService);
              if (Array.isArray(parsed)) {
                finalSelected = parsed;
              }
            } else if (Array.isArray(businessServices.selectedService)) {
              finalSelected = businessServices.selectedService;
            }

            setSelectedService(finalSelected);
          } catch (err) {
            console.error("❌ Failed to parse selectedService:", err);
          }

          setEmail(businessServices.email || "");
        }
      }
    } catch (error) {
      console.error("Error loading session data:", error);
    }
  }, []);

  const handleServiceToggle = (service) => {
    const updated = selectedService.includes(service)
      ? selectedService.filter((s) => s !== service)
      : [...selectedService, service];

    setSelectedService(updated);
    setServiceError("");
    sessionStorage.setItem("businesServices", JSON.stringify(updated));

    setCustomServiceSelected(updated.includes("Other"));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (selectedService.length === 0) {
      setServiceError("Please select at least one service.");
      return;
    }

    const containsOther = selectedService.includes("Other");

    const raw = sessionStorage.getItem("businesServices");
    let previous = {};
    try {
      previous = raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error("Failed to parse businesServices:", err);
    }

    const updatedBusinessServices = {
      ...previous,
      selectedService,
      email,
    };

    sessionStorage.setItem("businesServices", JSON.stringify(updatedBusinessServices));

    const businessDetailsRaw = sessionStorage.getItem("businessDetails");
    const businessDetails = businessDetailsRaw
      ? JSON.parse(businessDetailsRaw)
      : {};

    sessionStorage.setItem("businessDetails", JSON.stringify({
      ...businessDetails,
      selectedService,
      email,
    }));

    if (containsOther) {
      navigate("/about-business-next");
    } else {
      handleCreateAgent();
    }
  };
  //Using Error Handling
  useImperativeHandle(ref, () => ({
    validate: async () => {
      let hasError = false;
      if (!selectedService || selectedService.length === 0) {
        onValidationError?.({
          type: "failed",
          message: "Please select at least one service.",
        });
        hasError = true
      }
      return !hasError;
    },
    save: async () => { await handleContinue() }
  }));
  useEffect(() => {
    const saved = sessionStorage.getItem("businesServices");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSelectedService(parsed);
          setCustomServiceSelected(parsed.includes("Other"));
        }
      } catch (error) {
        console.error("Error parsing businesServices from sessionStorage:", error);
      }
    }
  }, []);


  return (
    <div className={styles.container} id="servies">
      {/* <h1 className={styles.title}>
        {EditingMode ? "Edit: Business Services" : "Business Services"}
      </h1> */}

      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>
          <img src="svg/Search-Icon.svg" alt="Search icon" />
        </span>
        <input
          type="text"
          placeholder="Quick find Business services"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className={styles.ListDiv}>
        <div className={styles.optionList}>
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <label className={styles.option} key={index}>
                <div className={styles.forflex}>
                  <div className={styles.icon}>
                    <img
                      src={selectedBusiness.icon}
                      alt="service-icon"
                      className={styles.iconImg}
                    />
                  </div>
                  <div className={styles.strongDiv}>
                    <strong>{service}</strong>
                    <p className={styles.subType}>{selectedBusiness.subtype}</p>
                  </div>
                </div>

                <div>
                  <input
                    type="checkbox"
                    name="service"
                    value={service}
                    checked={selectedService.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                  />
                </div>
              </label>
            ))
          ) : (
            <p>No item found</p>
          )}
        </div>
      </div>
      {serviceError && (
        <p style={{ color: "red", marginTop: "5px" }}>{serviceError}</p>
      )}
      {/* {stepEditingMode != 'ON' ?
        <div>
          <div type="submit">
            <div
              className={styles.btnTheme}
              onClick={handleContinue}
              style={{ pointerEvents: Loading ? "none" : "auto", opacity: Loading ? 0.6 : 1 }}
          
            >
              <img src="svg/svg-theme.svg" alt="" type="button" />
              <p>{Loading ? <>Saving &nbsp; &nbsp;<Loader size={20} /></> : "Continue"}</p>
            </div>
          </div>
        </div>
        :
        <div>
          <div type="submit">
            <div
              className={styles.btnTheme}
              onClick={handleSaveEdit}
              style={{ pointerEvents: Loading ? "none" : "auto", opacity: Loading ? 0.6 : 1 }}
    
            >
              <img src="svg/svg-theme.svg" alt="" type="button" />
              {Loading ? <p>Saving &nbsp; &nbsp;<Loader size={20} /></p> : <p>Save Edits</p>}
            </div>
          </div>
        </div>
      } */}
      {/* Show PopUp */}
      <PopUp
        type={popupType}
        message={popupMessage}
        onClose={() => setPopupMessage("")} // Close the popup
      />
    </div>
  );
});

export default BusinessServices;
