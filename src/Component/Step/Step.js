import React, { useEffect, useRef, useState, useMemo, createContext } from "react";
import Slider from "react-slick";
import styles from "./Step.module.css";
import Step2 from "../Step2/Step2";
import Step3 from "../Step3/Step3";
import Step4 from "../Step4/Step4";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PopUp from "../Popup/Popup";
import StepHeader from "../StepHeader/StepHeader";
import axios from "axios";
import Loader from "../Loader/Loader";
import decodeToken from "../../lib/decodeToken";
import { createAgent, listAgents, updateAgent } from "../../Store/apiStore";
import { useDashboardStore } from "../../Store/agentZustandStore";
import useCheckAgentCreationLimit from "../../hooks/useCheckAgentCreationLimit";
import { getAgentPrompt } from "../../hooks/useAgentPrompt";
import BusinessDetails from "../BusinessDetails/BusinessDetails";
import BusinessServices from "../BusinessServices/BusinessServices";
import AboutBusinessNext from "../BusinessServices/BusinessServicesNEXT";
import AboutBusiness from "../AboutBusiness/AboutBusiness";
import BusinessListing from "../BusinessListing/BusinessListing";
import Step1 from "../Step1/Step1";
const Step = () => {
    const timestamp = Date.now();
    const [isRoleTitleChanged, setIsRoleTitleChanged] = useState(false);
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(() => {
        const savedStep = sessionStorage.getItem("currentStep");
        return savedStep !== null ? parseInt(savedStep, 10) : 0;
    });
    const [selectedLang, setSelectedLang] = useState();
    const [selectedLangCode, setSelectedLangCode] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const [loading, setLoading] = useState(false)
    const [agentCount, setAgentCount] = useState(0);
    const token = localStorage.getItem("token") || "";
    const decodeTokenData = decodeToken(token)
    const [userId, setUserId] = useState(decodeTokenData?.id || "");
    const { setHasFetched } = useDashboardStore();
    const EditingMode = localStorage.getItem("UpdationMode");
    const stepEditingMode = localStorage.getItem("UpdationModeStepWise");
    const { isLimitExceeded, CheckingUserLimit } = useCheckAgentCreationLimit(userId);
    const [isContinueClicked, setIsContinueClicked] = useState(false);
    const [visibleStep, setVisibleStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(() => {
        const saved = localStorage.getItem('completedSteps');
        return saved ? JSON.parse(saved) : [];
    });
    //Step REF 
    //Business Details
    const step1Ref = useRef(null)
    //Business Services
    // const step2Ref = useRef(null);
    const step3Ref = useRef(null);
    const step4Ref = useRef(null);
    const step5Ref = useRef(null);
    const step6Ref = useRef(null)
    const step7Ref = useRef(null)
    const step8Ref = useRef(null)
    const step9Ref = useRef(null)

    useEffect(() => {
        if (token) {
            setUserId(decodeTokenData.id || "");
        }
    }, [token]);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    const Buisness = JSON.parse(sessionStorage.getItem("businessDetails"))
    const businessType = Buisness?.businessType === "Other" ? Buisness?.customBuisness : Buisness?.businessType;
    const totalSlides = 9;

    const role_title =
        sessionStorage.getItem("agentRole") || "General Receptionist";
    const business =
        JSON.parse(sessionStorage.getItem("businessDetails")) ||
        "Your Business Name";
    const BusinessLocation =
        JSON.parse(sessionStorage.getItem("businessLocation")) ||
        "Your Business Services";
    const languageSelect = (sessionStorage?.getItem("agentLanguage"))
    const rawCustomServices = JSON.parse(sessionStorage.getItem('selectedCustomServices')) || [];
    const cleanedCustomServices = rawCustomServices
        .map(item => item?.service?.trim())
        .filter(Boolean)
        .map(service => ({ service }));

    const businessServices = business?.selectedService || [];
    const customServices = cleanedCustomServices?.map(item =>
        typeof item === 'string' ? item : item.service
    );
    const businessServiceNames = businessServices?.map(item => item);
    const allServices = [...customServices, ...businessServiceNames];
    const commaSeparatedServices = allServices?.join(", ")?.replace("Other", "") || "Your Business Services";
    const agentGender = (sessionStorage.getItem("agentGender"))
    const aboutBusinessForm = JSON.parse(sessionStorage.getItem("aboutBusinessForm")) || "Your Business Services";
    const agentName = sessionStorage.getItem("agentName") || "";
    const packageName = sessionStorage.getItem("package") || "Free";
    const selectedServices = sessionStorage.getItem("businessDetails");
    const services = selectedServices ? JSON.parse(selectedServices).businessType : [];
    const customServicesSelected = sessionStorage.getItem("businesServices");
    const checkCustomServicesSelected = customServicesSelected?.includes("Other")
    const [shouldShowAboutBusinessNext, setShouldShowAboutBusinessNext] = useState(false);
    const [isContiue, seIsContinue] = useState(false)
    const packageMap = {
        "Free": 1,
        "Starter": 2,
        "Scaler": 3,
        "Growth": 4,
        "Corporate": 5,
        "Enterprise": 6
    };
    const detectRoleTypeChange = (roleTitle) => {
        setIsRoleTitleChanged((prev) => !prev);
    }
    const packageValue = packageMap[packageName] || 1;
    const addCompletedStep = (step) => {
        setCompletedSteps((prev) => {
            const updated = [...new Set([...prev, step])]; // ensure uniqueness

            return updated;
        });
    };
    const handleNext = async () => {
        const validations = {
            0: step1Ref,
            1: step3Ref,
            3: step4Ref,
            4: step5Ref,
            5: step6Ref,
            6: step7Ref,
            7: step8Ref,
            8: step9Ref
        };
        const isValid = await validation(currentStep);
        if (!isValid) return;
        const currentRef = validations[currentStep];
        // Check if current step has a ref and validate
        if (currentRef?.current) {
            const isValid = currentRef?.current?.validate();
            if (!isValid) {
                console.warn(`Validation failed at step ${currentStep}`);
                return;
            }
            if (currentRef.current.save) {
                await currentRef.current.save(); // 👈 Calls handleContinue only on Next
            }
            // Add this step to completed steps
            addCompletedStep(currentStep);
        }
        scrollToTop();




    };

    const handleBack = () => {
        if (currentStep > 0) {
            const prevStep = currentStep - 1 === 2 ? 1 : currentStep - 1; // Skip 2 if needed
            setCurrentStep(prevStep);
            setVisibleStep(prevStep);
            sliderRef.current?.slickGoTo(prevStep);
        }
    };
    const isAdaptiveHeight = currentStep !== 3
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        adaptiveHeight: isAdaptiveHeight,
        slidesToScroll: 1,
        arrows: false,
        swipe: false,
        afterChange: (index) => {
            setVisibleStep(index);

        }
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
    const getBusinessNameFormCustom = sessionStorage.getItem("displayBusinessName");
    const getBusinessNameFromGoogleListing = JSON.parse(sessionStorage.getItem("placeDetailsExtract"))
    const sanitize = (str) => String(str || "").trim().replace(/\s+/g, "_");
    const dynamicAgentName = `${sanitize(businessType)}_${sanitize(getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom)}_${sanitize(role_title)}_${packageValue}#${agentCount}`

    const handleContinue = async () => {
        if (step9Ref.current) {
            setIsContinueClicked(true);
            const agentNote = sessionStorage.getItem("agentNote");
            const filledPrompt =
                getAgentPrompt({
                    industryKey: business?.businessType == "Other" ? business?.customBuisness : business?.businessType,   // ← dynamic from businessType
                    roleTitle: sessionStorage.getItem("agentRole"),
                    agentName: agentName,
                    agentGender: agentGender,
                    business: {
                        businessName: getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom,
                        email: getBusinessNameFromGoogleListing?.email || "",
                        aboutBusiness: getBusinessNameFromGoogleListing?.aboutBusiness || getBusinessNameFromGoogleListing?.aboutBussiness,
                        address: getBusinessNameFromGoogleListing?.address || ""
                    },
                    languageSelect: languageSelect,
                    businessType,
                    aboutBusinessForm,
                    commaSeparatedServices,
                    agentNote
                });
            const isValid = step9Ref.current.validate()
            localStorage.removeItem("completedSteps")
            //creation here
            if (isValid && localStorage.getItem("UpdationMode") != "ON") {
                setLoading(true)
                const agentConfig = {
                    version: 0,
                    model: "gemini-2.0-flash-lite",
                    model_temperature: 0,
                    model_high_priority: true,
                    tool_call_strict_mode: true,
                    general_prompt: filledPrompt,
                    general_tools: [
                        {
                            type: "end_call",
                            name: "end_call",
                            description: "End the call with user.",
                        },


                    ],
                    states: [
                        {
                            name: "information_collection",
                            state_prompt:
                                "You will follow the steps below to collect information...",
                            edges: [
                                {
                                    destination_state_name: "appointment_booking",
                                    description: "Transition to book an appointment.",
                                },
                            ],
                            tools: [
                                {
                                    type: "transfer_call",
                                    name: "transfer_to_support",
                                    description: "Transfer to the support team.",
                                    transfer_destination: {
                                        type: "predefined",
                                        number: "+918054226461", // Replace with actual number
                                    },
                                },
                            ],
                        },
                        {
                            name: "appointment_booking",
                            state_prompt:
                                "You will follow the steps below to book an appointment...",
                        },
                    ],
                    starting_state: "information_collection",
                    begin_message: `Hey I am a virtual assistant ${agentName}, calling from ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}.`,
                    default_dynamic_variables: {
                        customer_name: "John Doe",
                    },
                };
                const knowledgeBaseId = sessionStorage.getItem("knowledgeBaseId");
                if (knowledgeBaseId) {
                    agentConfig.knowledge_base_ids = [knowledgeBaseId];
                }
                //Create LLm 
                try {
                    const llmResponse = await axios.post(
                        "https://api.retellai.com/create-retell-llm",
                        agentConfig,
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    sessionStorage.setItem("llmId", llmResponse.data.llm_id);
                    const llmId = llmResponse.data.llm_id;

                    const response_engine = {
                        type: "retell-llm",
                        llm_id: llmId,
                    };
                    const finalAgentData = {
                        response_engine,
                        voice_id: sessionStorage.getItem("agentVoice") || "11labs-Adrian",
                        language: sessionStorage.getItem("agentLanguageCode") || "en-US",
                        agent_name: dynamicAgentName || sessionStorage.getItem("agentName"),
                        language: "multi",
                        post_call_analysis_model: "gpt-4o-mini",
                        responsiveness: 1,
                        enable_backchannel: true,
                        interruption_sensitivity: 0.7,
                        backchannel_frequency: 0.7,
                        backchannel_words: ["Got it", "Yeah", "Uh-huh", "Understand", "Ok", "hmmm"],
                        post_call_analysis_data: [
                            {
                                type: "string",
                                name: "Detailed Call Summery",
                                description: "The name of the customer.",
                                examples: [
                                    "John Doe",
                                    "Jane Smith"
                                ]
                            },
                            {
                                type: "enum",
                                name: "lead_type",
                                description: "Feedback given by the customer about the call.",
                                choices: ["positive", "neutral", "negative"]
                            }
                        ],
                    };
                    // Create Agent Creation
                    try {
                        const response = await axios.post(
                            "https://api.retellai.com/create-agent",
                            finalAgentData,
                            {
                                headers: {
                                    Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                                },
                            }
                        );
                        const agentId = response.data.agent_id;
                        // Get businessId from sessionStorage
                        const businessIdString = sessionStorage.getItem("businessId") || '{"businessId":1}';
                        // Convert string to object
                        const businessIdObj = JSON.parse(businessIdString);
                        // Now access the actual ID
                        const agentData = {
                            userId: userId,
                            agent_id: agentId || sessionStorage.getItem("agentId"),
                            knowledgeBaseId: sessionStorage.getItem("knowledgeBaseId"),
                            llmId: sessionStorage.getItem("llmId"),
                            avatar: sessionStorage.getItem("avatar") || "",
                            agentVoice: sessionStorage.getItem("agentVoice") || "11labs-Adrian",
                            agentAccent: sessionStorage.getItem("agentVoiceAccent") || "American",
                            agentRole: sessionStorage.getItem('agentRole') || "Genral Receptionist",
                            agentName: sessionStorage.getItem('agentName') || "",
                            agentLanguageCode: sessionStorage.getItem('agentLanguageCode') || "en-US",
                            agentLanguage: sessionStorage.getItem('agentLanguage') || "English (US)",
                            agentGender: sessionStorage.getItem('agentGender') || "female",
                            agentPlan: "free" || "Plus",
                            agentStatus: true,
                            businessId: businessIdObj.businessId,
                            responsiveness: 1,
                            enable_backchannel: true,
                            interruption_sensitivity: 0.7,
                            backchannel_frequency: 0.7,
                            backchannel_words: ["Got it", "Yeah", "Uh-huh", "Understand", "Ok", "hmmm"],
                            additionalNote: agentNote || "",

                        }
                        try {
                            const response = await createAgent(agentData);
                            if (response.status === 200 || response.status === 201) {
                                sessionStorage.setItem("agentId", response.data.agent_id);
                                sessionStorage.setItem("agentStatus", true);
                                sessionStorage.removeItem("avatar")
                                setPopupType("success");
                                setPopupMessage("Agent created successfully!");
                                setShowPopup(true);
                                setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
                                setHasFetched(false)
                                setLoading(false)
                                sessionStorage.clear()

                            }
                        } catch (error) {
                            // console.log(error,error.status)
                            if (error?.status == 400) {
                                // console.log('errorinside',error)
                                setPopupType("failed");
                                setPopupMessage(error?.response?.data?.message);
                                setShowPopup(true);
                                setLoading(false)
                            } else {
                                console.error("Agent creation failed:", error);
                                setPopupType("failed");
                                setPopupMessage("Agent creation failed while saving data in Database. Please try again.");
                                setShowPopup(true);
                                setLoading(false)
                            }


                        }
                    } catch (err) {
                        console.error("Upload failed:", err);
                        setPopupType("failed");
                        setPopupMessage("Agent creation failed.");
                        setShowPopup(true);
                        setLoading(false)
                    }
                } catch (error) {
                    console.error("LLM creation failed:", error);
                    setPopupType("failed");
                    setPopupMessage("LLM creation failed. Please try again.");
                    setShowPopup(true);
                    setLoading(false)
                }
                setLoading(false)
            }
            //updation Agent here
            if (isValid && localStorage.getItem("UpdationMode") == "ON") {
                setLoading(true)
                const agentConfig = {
                    general_prompt: filledPrompt,
                    begin_message: `Hey I am a virtual assistant ${agentName}, calling from ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}.`,

                };
                const llm_id = localStorage.getItem('llmId')

                //Create LLm 
                try {
                    const llmResponse = await axios.patch(
                        `https://api.retellai.com/update-retell-llm/${llm_id} `,
                        agentConfig,
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    sessionStorage.setItem("llmId", llmResponse.data.llm_id);
                    const llmId = llmResponse.data.llm_id;

                    const finalAgentData = {
                        voice_id: sessionStorage.getItem("agentVoice") || "11labs-Adrian",
                        language: sessionStorage.getItem("agentLanguageCode") || "en-US",
                        agent_name: dynamicAgentName || sessionStorage.getItem("agentName"),
                        language: sessionStorage.getItem("agentLanguageCode") || "en-US",
                        normalize_for_speech: true,
                        post_call_analysis_model: "gpt-4o-mini",
                        post_call_analysis_data: [
                            {
                                type: "string",
                                name: "Detailed Call Summery",
                                description: "The name of the customer.",
                                examples: [
                                    "John Doe",
                                    "Jane Smith"
                                ]
                            },
                            {
                                type: "enum",
                                name: "lead_type",
                                description: "Feedback given by the customer about the call.",
                                choices: ["positive", "neutral", "negative"]
                            }
                        ],
                    };
                    // update Agent Creation
                    const agent_id = localStorage.getItem('agent_id')
                    try {
                        const response = await axios.patch(
                            `https://api.retellai.com/update-agent/${agent_id}`,
                            finalAgentData,
                            {
                                headers: {
                                    Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                                },
                            }
                        );

                        const agentId = response.data.agent_id;
                        // Get businessId from sessionStorage
                        const businessIdString = sessionStorage.getItem("businessId");

                        // Convert string to object
                        const businessIdObj = JSON.parse(businessIdString);

                        // Now access the actual ID
                        const agentData = {
                            userId: userId,
                            agent_id: agentId || sessionStorage.getItem("agentId"),
                            knowledgeBaseId: sessionStorage.getItem("knowledgeBaseId"),
                            llmId: sessionStorage.getItem("llmId"),
                            avatar: sessionStorage.getItem("avatar") || "",
                            agentVoice: sessionStorage.getItem("agentVoice") || "11labs-Adrian",
                            agentAccent: sessionStorage.getItem("agentVoiceAccent") || "American",
                            agentRole: sessionStorage.getItem('agentRole') || "Genral Receptionist",
                            agentName: sessionStorage.getItem('agentName') || "",
                            agentLanguageCode: sessionStorage.getItem('agentLanguageCode') || "en-US",
                            agentLanguage: sessionStorage.getItem('agentLanguage') || "English (US)",
                            agentGender: sessionStorage.getItem('agentGender') || "female",
                            agentStatus: true,
                            businessId: businessIdObj.businessId,
                            additionalNote: agentNote || "",
                        }
                        try {
                            const response = await updateAgent(agentId, agentData);
                            if (response.status === 200 || response.status === 201) {
                                setPopupType("success");
                                setPopupMessage("Agent Updated successfully!");
                                setShowPopup(true);
                                setTimeout(() => {
                                    if (stepEditingMode) {
                                        navigate("/agent-detail", {
                                            state: {
                                                agentId: agentId || sessionStorage.getItem("agentId"),
                                                bussinesId: businessIdObj.businessId || sessionStorage.getItem('businessId'),
                                            },
                                        })
                                    } else {

                                        setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
                                        setLoading(false)
                                        sessionStorage.clear()
                                        localStorage.removeItem('UpdationMode')
                                        localStorage.removeItem('agentName')
                                        localStorage.removeItem('agentGender')
                                        localStorage.removeItem('agentLanguageCode')
                                        localStorage.removeItem('agentLanguage')
                                        localStorage.removeItem('llmId')
                                        localStorage.removeItem('agent_id')
                                        localStorage.removeItem('knowledgeBaseId')
                                        localStorage.removeItem('agentRole')
                                        localStorage.removeItem('agentVoice')
                                        localStorage.removeItem('agentVoiceAccent')
                                        localStorage.removeItem('avatar')

                                        setHasFetched(false)
                                    }

                                }, 1000)



                            }

                        } catch (error) {
                            // console.log(error,error.status)
                            if (error?.status == 400) {
                                // console.log('errorinside',error)
                                setPopupType("failed");
                                setPopupMessage(error?.response?.data?.message);
                                setShowPopup(true);
                                setLoading(false)
                            } else {
                                console.error("Agent Updation failed:", error);
                                setPopupType("failed");
                                setPopupMessage("Agent Updation failed while saving data in Database. Please try again.");
                                setShowPopup(true);
                                setLoading(false)
                            }


                        }


                    } catch (err) {
                        console.error("Upload failed:", err);
                        setPopupType("failed");
                        setPopupMessage("Agent creation failed.");
                        setShowPopup(true);
                        setLoading(false)
                    }
                } catch (error) {
                    console.error("LLM updation failed:", error);
                    setPopupType("failed");
                    setPopupMessage("LLM updation failed. Please try again.");
                    setShowPopup(true);
                    setLoading(false)
                }



                setLoading(false)
            }
        }
    };
    const handleValidationError = ({ type, message }) => {
        setPopupType(type);
        setPopupMessage(message);
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };
    const getStepTitle = () => {
        if (currentStep === 0) {
            return EditingMode ? "Edit: Business Details" : "Business Details";
        } else if (currentStep === 1) {
            if ((services.includes("Other")) || checkCustomServicesSelected) {
                return EditingMode ? "Edit: Add More Services" : "Add More Services";
            }
            else {
                return EditingMode ? "Edit: Business Services" : "Business Services";
            }

        }

        else if (currentStep === 3) {
            return EditingMode ? "Edit: About Your Business" : "About Your Business";
        }
        else if (currentStep === 4) {
            return EditingMode ? "Edit: Your Business Listing" : "Your Business Listing";
        }
        else if (currentStep === 5) {
            return EditingMode ? "Edit: Agent Language Supported" : "Agent Language Supported";
        }
        else if (currentStep === 6) {
            return EditingMode ? "Edit: Agent Gender" : "Agent Gender";
        }
        else if (currentStep === 8) {
            return EditingMode ? "Edit: Receptionist Type" : "Receptionist Type";
        }
    };
    useEffect(() => {
        if (!CheckingUserLimit && isLimitExceeded && !EditingMode) {
            setShowPopup(true);
            setPopupType('failed');
            setPopupMessage("Agent creation limit exceeded. Please upgrade your plan!");
        }
    }, [CheckingUserLimit, isLimitExceeded]);
    const handleClosePopup = () => {
        if (!CheckingUserLimit && isLimitExceeded && !EditingMode) {
            navigate('/dashboard');
            setShowPopup(false);
        } else {
            setShowPopup(false);
        }
    }
    const validation = async (currentStep) => {
        const validations = {
            0: step1Ref,
            1: step3Ref,
            3: step4Ref,
            4: step5Ref,
            5: step6Ref,
            6: step7Ref,
            7: step8Ref,
            8: step9Ref
        };
        // Skip validation if already completed

        if (completedSteps.includes(currentStep)) {
            return true;
        }
        console.log(completedSteps, "completedSteps")
        const currentRef = validations[currentStep];
        if (currentRef?.current?.validate) {
            const isValid = await currentRef.current.validate();
            if (!isValid) {
                console.warn(`Validation failed at step ${currentStep}`);
                return false;
            }
            // Mark this step as completed
            addCompletedStep(currentStep);
        }

        return true;
    };

    console.log(currentStep, "currentStep")

    // function lock
    useEffect(() => {
        fetchAgentCountFromUser()
    }, [])
    useEffect(() => {
        const savedStep = sessionStorage.getItem("currentStep");
        if (savedStep !== null) {
            const parsedStep = parseInt(savedStep, 10);
            setCurrentStep(parsedStep);
            sliderRef.current?.slickGoTo(parsedStep);
        }
    }, []);
    useEffect(() => {
        sessionStorage.setItem("currentStep", currentStep.toString());
    }, [currentStep])
    useEffect(() => {
        sessionStorage.setItem("completedSteps", JSON.stringify(completedSteps));
    }, [completedSteps]);
    useEffect(() => {
        const savedSteps = JSON.parse(sessionStorage.getItem("completedSteps")) || [];
        setCompletedSteps(savedSteps);
    }, []);
    return (
        <div className={styles.container}>
            <StepHeader title={getStepTitle()} />
            <Slider ref={sliderRef} {...settings}>
                {/* business-details */}  {/* Step 1 */}
                {currentStep === 0 && <div>
                    <BusinessDetails
                        ref={step1Ref}
                        onNext={handleNext}
                        onBack={handleBack}
                        onValidationError={handleValidationError}
                        isActive={currentStep === 0}
                        onSuccess={(data) => {

                            setShowPopup(true);
                            setPopupType("success");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}

                        onFailed={(data) => {

                            setShowPopup(true);
                            setPopupType("failed");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}
                        loading={loading}
                        setLoading={setLoading}
                        onStepChange={(step) => {
                            setCurrentStep(step);
                            setVisibleStep(step);
                            sliderRef.current?.slickGoTo(step);
                        }}


                    />
                </div>}
                {currentStep === 1 &&

                    <div>
                        {(services.includes("Other")) || checkCustomServicesSelected ?
                            <AboutBusinessNext
                                ref={step3Ref}
                                onNext={handleNext}
                                onBack={handleBack}
                                onValidationError={handleValidationError}
                                // isActive={currentStep === 1}
                                onSuccess={(data) => {

                                    setShowPopup(true);
                                    setPopupType("success");
                                    setPopupMessage(data.message);
                                    setTimeout(() => {
                                        setShowPopup(false);
                                    }, 2000);
                                }}

                                onFailed={(data) => {

                                    setShowPopup(true);
                                    setPopupType("failed");
                                    setPopupMessage(data.message);
                                    setTimeout(() => {
                                        setShowPopup(false);
                                    }, 2000);
                                }}
                                loading={loading}
                                setLoading={setLoading}
                                onStepChange={(step) => {
                                    setCurrentStep(step);
                                    setVisibleStep(step);
                                    sliderRef.current?.slickGoTo(step);
                                }}
                            />
                            :
                            <BusinessServices
                                ref={step3Ref}
                                onNext={handleNext}
                                onBack={handleBack}
                                onValidationError={handleValidationError}
                                // isActive={currentStep === 1}
                                onSuccess={(data) => {

                                    setShowPopup(true);
                                    setPopupType("success");
                                    setPopupMessage(data.message);
                                    setTimeout(() => {
                                        setShowPopup(false);
                                    }, 2000);
                                }}

                                onFailed={(data) => {

                                    setShowPopup(true);
                                    setPopupType("failed");
                                    setPopupMessage(data.message);
                                    setTimeout(() => {
                                        setShowPopup(false);
                                    }, 2000);
                                }}
                                loading={loading}
                                setLoading={setLoading}
                                onStepChange={(step) => {
                                    setCurrentStep(step);
                                    setVisibleStep(step);
                                    sliderRef.current?.slickGoTo(step);
                                }}


                            />
                        }
                    </div>}
                {currentStep === 3 && <div>
                    <AboutBusiness
                        ref={step4Ref}
                        onNext={handleNext}
                        onBack={handleBack}
                        onValidationError={handleValidationError}
                        isActive={currentStep === 3}
                        onSuccess={(data) => {

                            setShowPopup(true);
                            setPopupType("success");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}
                        onFailed={(data) => {

                            setShowPopup(true);
                            setPopupType("failed");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}
                        loading={loading}
                        setLoading={setLoading}
                        onStepChange={(step) => {
                            setCurrentStep(step);
                            setVisibleStep(step);
                            sliderRef.current?.slickGoTo(step);
                        }}
                    />
                </div>}
                {currentStep === 4 && <div>
                    <BusinessListing
                        ref={step5Ref}
                        onNext={handleNext}
                        onBack={handleBack}
                        onValidationError={handleValidationError}
                        isActive={currentStep === 4}
                        onSuccess={(data) => {

                            setShowPopup(true);
                            setPopupType("success");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}

                        onFailed={(data) => {

                            setShowPopup(true);
                            setPopupType("failed");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}
                        loading={loading}
                        setLoading={setLoading}
                        onStepChange={(step) => {
                            setCurrentStep(step);
                            setVisibleStep(step);
                            sliderRef.current?.slickGoTo(step);
                        }}
                    />
                </div>}
                {currentStep === 5 && <div>
                    <Step1
                        ref={step6Ref}
                        onNext={handleNext}
                        onBack={handleBack}
                        onValidationError={handleValidationError}
                        isActive={currentStep === 5}
                        onSuccess={(data) => {

                            setShowPopup(true);
                            setPopupType("success");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}

                        onFailed={(data) => {

                            setShowPopup(true);
                            setPopupType("failed");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}
                        loading={loading}
                        setLoading={setLoading}
                        onStepChange={(step) => {
                            setCurrentStep(step);
                            setVisibleStep(step);
                            sliderRef.current?.slickGoTo(step);
                        }}
                    />
                </div>}
                {currentStep === 6 && <div>
                    <Step2
                        ref={step7Ref}
                        onNext={handleNext}
                        onBack={handleBack}
                        onValidationError={handleValidationError}
                        isActive={currentStep === 6}
                        onSuccess={(data) => {

                            setShowPopup(true);
                            setPopupType("success");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}

                        onFailed={(data) => {

                            setShowPopup(true);
                            setPopupType("failed");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}
                        loading={loading}
                        setLoading={setLoading}
                        onStepChange={(step) => {
                            setCurrentStep(step);
                            setVisibleStep(step);
                            sliderRef.current?.slickGoTo(step);
                        }}
                    />
                </div>}
                {currentStep === 7 && <div>
                    <Step3
                        ref={step8Ref}
                        onNext={handleNext}
                        onBack={handleBack}
                        onValidationError={handleValidationError}
                        isActive={currentStep === 7}
                        onSuccess={(data) => {

                            setShowPopup(true);
                            setPopupType("success");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}

                        onFailed={(data) => {

                            setShowPopup(true);
                            setPopupType("failed");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}
                        loading={loading}
                        setLoading={setLoading}
                        onStepChange={(step) => {
                            setCurrentStep(step);
                            setVisibleStep(step);
                            sliderRef.current?.slickGoTo(step);
                        }}
                    />
                </div>}
                {currentStep === 8 && <div>
                    <Step4
                        ref={step9Ref}
                        onNext={handleNext}
                        onBack={handleBack}
                        onValidationError={handleValidationError}
                        isActive={currentStep === 8}
                        onSuccess={(data) => {
                            setShowPopup(true);
                            setPopupType("success");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}

                        onFailed={(data) => {

                            setShowPopup(true);
                            setPopupType("failed");
                            setPopupMessage(data.message);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 2000);
                        }}
                        loading={loading}
                        setLoading={setLoading}
                        onStepChange={(step) => setCurrentStep(step)}
                        detectRoleTypeChange={detectRoleTypeChange}


                    />
                </div>}
            </Slider>
            {/* === Footer Fixed Pagination === */}
            <div className={styles.footerFixed}>
                <div className={styles.stepsIndicator}>
                    {
                        [...Array(totalSlides)].reduce((acc, _, idx) => {
                            if (idx === 2) return acc; // Skip step 2
                            const isClickable = idx <= currentStep || completedSteps.includes(idx);

                            acc.push(
                                <button
                                    key={idx}
                                    disabled={!isClickable}
                                    className={`${styles.stepNumber} ${currentStep === idx ? styles.activeStepNumber : ''}`}
                                    onClick={async () => {
                                        if (!isClickable || isContinueClicked) return;


                                        const validations = {
                                            0: step1Ref,
                                            1: step3Ref,
                                            3: step4Ref,
                                            4: step5Ref,
                                            5: step6Ref,
                                            6: step7Ref,
                                            7: step8Ref,
                                            8: step9Ref
                                        };

                                        //  If moving forward, validate + save intermediate steps
                                        if (idx > currentStep) {
                                            for (let i = currentStep; i < idx; i++) {
                                                if (completedSteps.includes(i)) continue; //  Skip already completed steps

                                                const ref = validations[i];
                                                if (ref?.current?.validate) {
                                                    const isValid = await ref.current.validate();
                                                    if (!isValid) return;

                                                    if (ref?.current?.save) {
                                                        await ref.current.save();
                                                    }

                                                    addCompletedStep(i);
                                                }
                                            }
                                        }


                                        // ✅ Now move to the clicked step
                                        setCurrentStep(idx);
                                        setVisibleStep(idx);
                                        sliderRef.current?.slickGoTo(idx);
                                    }}

                                >
                                    {acc.length + 1} {/* Step number shown to the user */}
                                </button>
                            );

                            return acc;
                        }, [])
                    }

                </div>

                {currentStep === 8 ? <button className={styles.navBtn} onClick={handleContinue}>
                    {
                        loading ? <><Loader size={20} /></> : <img src="svg/arrow.svg" alt="arrow" className={styles.arrowIcon} />
                    }
                </button> : <button className={styles.navBtn} onClick={handleNext}>
                    {
                        loading ? <><Loader size={20} /></> : <img src="svg/arrow.svg" alt="arrow" className={styles.arrowIcon} />
                    }
                </button>
                }



            </div>
            {showPopup && (
                <PopUp
                    type={popupType}
                    onClose={() => handleClosePopup()}
                    message={popupMessage}
                />
            )}
        </div>
    );
};

export default Step;