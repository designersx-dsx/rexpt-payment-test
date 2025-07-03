import React, { useEffect, useRef, useState, useMemo, createContext } from "react";
import Slider from "react-slick";
import styles from "./Step.module.css";
import Step2 from "../Step2/Step2";
import Step3 from "../Step3/Step3";
import Step4 from "../Step4/Step4";
import { useLocation, useNavigate } from "react-router-dom";
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
import Tooltip from "../TooltipSteps/Tooltip";
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
    const [avtarChecked, setAvtarChecked] = useState(false)
    const [completedSteps, setCompletedSteps] = useState(() => {
        const saved = sessionStorage.getItem('completedSteps');
        return saved ? JSON.parse(saved) : [];
    });
    const location = useLocation()
    const locationPath = location?.state?.locationPath;
    const step1Ref = useRef(null)

    const step3Ref = useRef(null);
    const step4Ref = useRef(null);
    const step5Ref = useRef(null);
    const step6Ref = useRef(null)
    const step7Ref = useRef(null)
    const step8ARef = useRef(null)
    const step8BRef = useRef(null);
    // const step9Ref = useRef(null)

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
    const totalSlides = 8;

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
            7: [step8ARef, step8BRef],
            // 8: step9Ref
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
            const prevStep = currentStep - 1 === 2 ? 1 : currentStep - 1;
            setCurrentStep(prevStep);
            setVisibleStep(prevStep);
            sliderRef.current?.slickGoTo(prevStep);
        }
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
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
    //  1. Create the function that returns the choices array
    const getLeadTypeChoices = () => {
        const fixedChoices = ["Spam Caller", "Irrelvant Call", "Angry Old Customer"];
        const allServices = [...customServices, ...businessServiceNames];
        const cleanedServices = allServices
            .map(service => service?.trim()) // remove extra whitespace
            .filter(service => service && service?.toLowerCase() !== "other")
            .map(service => {
                const normalized = service?.replace(/\s+/g, " ")?.trim();
                return `Customer for ${normalized}`;
            });
        const combinedChoices = Array.from(new Set([...fixedChoices, ...cleanedServices]));
        return combinedChoices;
    }
    const handleContinue = async () => {
        if (step8ARef.current) {
            setIsContinueClicked(true);
            const agentNote = sessionStorage.getItem("agentNote");
            const filledPrompt =
                getAgentPrompt({
                    industryKey: business?.businessType == "Other" ? business?.customBuisness : business?.businessType,   // ← dynamic from businessType
                    roleTitle: sessionStorage.getItem("agentRole"),
                    agentName: agentName?.split(" ")[0],
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
            // const isValid = step8BRef.current.validate()

            //creation here
            if (localStorage.getItem("UpdationMode") != "ON") {

                setLoading(true)
                const agentConfig = {
                    version: 0,
                    model: "gemini-2.0-flash",
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

                    begin_message: `Hi I am ${agentName?.split(" ")[0]}, calling from ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}. How may i help you`,

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
                        interruption_sensitivity: 0.91,
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
                                choices: getLeadTypeChoices()
                            }
                        ],
                        normalize_for_speech: true
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
            if (localStorage.getItem("UpdationMode") == "ON") {
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
        const steps = {
            0: {
                title: EditingMode ? "Edit: Business Type" : "Business Type",
                subTitle: "Select category which best describes your business type",
                // icon: "business-type-icon.svg",
                tooltip: <Tooltip />,
            },
            1: {
                title: EditingMode ? "Edit: Services Offered" : "Services Offered",
                subTitle: "Select the “Services You Offer” for your Restaurant Business",
                // icon: "services-icon.svg",
                tooltip: <Tooltip />,
            },
            3: {
                title: EditingMode ? "Edit: Public Listing" : "Public Listing",
                subTitle: "Enter your Google My Business Listing & Website",
                // icon: "listing-icon.svg",
                tooltip: <Tooltip />,
            },
            4: {
                title: EditingMode ? "Edit: Business Details" : "Business Details",
                subTitle: "Verify or Update your Business Details we got from your public listings",
                // icon: "details-icon.svg",
                tooltip: <Tooltip />,
            },
            5: {
                title: EditingMode ? "Edit: Select Language" : "Select Language",
                subTitle: "Select the Primary Language, You want your agent to speak",
                // icon: "language-icon.svg",
                tooltip: <Tooltip />,
            },
            6: {
                title: EditingMode ? "Edit: Select Voice" : "Select Voice",
                subTitle: "Select a voice for your agent as per your liking",
                // icon: "voice-icon.svg",
                tooltip: <Tooltip />,
            },
            7: {
                title: EditingMode ? "Edit: Name & Avatar" : "Name & Avatar",
                subTitle: "Select the gender of your AI receptionist for your Business",
                // icon: "gender-icon.svg",
                tooltip: <Tooltip />,
            },
        };

        return steps[currentStep] || {
            title: "Step Not Found",
            subTitle: "",
            icon: "default-icon.svg",
        };
    };


    useEffect(() => {
        if (!CheckingUserLimit && isLimitExceeded && !EditingMode) {
            setShowPopup(true);
            setPopupType('failed');
            setPopupMessage("Agent creation limit exceeded. Please upgrade your plan!");
        }
    }, [CheckingUserLimit, isLimitExceeded]);

    const handleClosePopup = () => {
        // if (!CheckingUserLimit && isLimitExceeded && !EditingMode) {
        //     navigate('/dashboard');
        //     setShowPopup(false);
        // } else {
        //     setShowPopup(false);
        // }
        // if (!CheckingUserLimit && !EditingMode) {
        //     navigate('/dashboard');
        //     setShowPopup(false);
        // } else {
        //     setShowPopup(false);
        // }
        setShowPopup(false);
    }
    const validation = async (currentStep) => {
        const validations = {
            0: step1Ref,
            1: step3Ref,
            3: step4Ref,
            4: step5Ref,
            5: step6Ref,
            6: step7Ref,
            7: [step8ARef, step8BRef], // both Step3 and Step4
        };

        const refs = validations[currentStep];

        if (Array.isArray(refs)) {
            for (let ref of refs) {
                if (ref?.current?.validate) {
                    const isValid = await ref.current.validate();
                    if (!isValid) return false;

                    if (ref?.current?.save) {
                        await ref.current.save();
                    }
                }
            }
        } else {
            if (refs?.current?.validate) {
                const isValid = await refs.current.validate();
                if (!isValid) return false;

                if (refs?.current?.save) {
                    await refs.current.save();
                }
            }
        }

        addCompletedStep(currentStep);
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


    const handleSubmit = () => {
        let priceId = sessionStorage.getItem("priceId")
        let freeTrail = location?.state?.freeTrial
        if (locationPath === "/checkout") {
            handleContinue()
        }
        else if (locationPath !== "/checkout" && priceId) {
            if (currentStep === 7) {
                const isStep3Valid = step8ARef.current?.validate?.();
                const isStep4Valid = step8BRef.current?.validate?.();
                if (!isStep3Valid || !isStep4Valid) return;
                navigate("/checkout")
            }

        }
        else if (locationPath !== "/checkout" && !priceId) {
            console.log("hy")
            if (currentStep === 7) {
                const isStep3Valid = step8ARef.current?.validate?.();
                const isStep4Valid = step8BRef.current?.validate?.();
                if (!isStep3Valid || !isStep4Valid) return;
                navigate('/plans')
                addCompletedStep(currentStep);
            }


        }
        else if (locationPath !== "/checkout" && !priceId) {
            if (currentStep === 7) {
                const isStep3Valid = step8ARef.current?.validate?.();
                const isStep4Valid = step8BRef.current?.validate?.();
                if (!isStep3Valid || !isStep4Valid) return;
                navigate('/plans')
                addCompletedStep(currentStep);
            }


        }

    }
    let freeTrail = location?.state?.freeTrial
    console.log(freeTrail)
    const isContinueCalled = useRef(false);
    useEffect(() => {
        if (freeTrail && currentStep === 7 && !isContinueCalled.current) {
            handleContinue();
            isContinueCalled.current = true;
        }
        else if (locationPath === "/checkout" && currentStep === 7 && !isContinueCalled.current) {
            handleContinue();
            isContinueCalled.current = true;
        }
    }, [freeTrail, currentStep, locationPath]);
    const step = getStepTitle();
    useEffect(() => {
        const storedValue = sessionStorage?.getItem("avtarChecked");
        if (storedValue !== null) {
            setAvtarChecked(JSON?.parse(storedValue));
        }
    }, []);
    console.log(step, "step")
    const tooltipContentMap = {
        0: "Please select the category that best describes your business and indicate its size. This information helps us ensure you get the right tools and insights.",
        1: "Select the services your business offers, or click Add more Services to include any unique offerings. Understanding your services allows us to personalize your dashboard and recommendations.",
        3: "Add your Google My Business URL and website link. These links help us deeply understand your business and are used to build a smart knowledge base for your voice agent, ensuring it answers questions accurately.",
        4: "This section shows your main business details: name, address, phone number, email, and a description of your business. These are important for both your customers and our system. Feel free to add or edit any of these fields to ensure all your information is current and correct.",
        5: "This is the main language your agent will use for all its interactions. Choosing the correct language ensures the best communication experience. We Support 25+ Languages.",
        6: "Select the gender you prefer for your AI agent, then listen to the available voice options to pick the one that best represents your business.",
        7: "Pcik an avatar for your agent, feel free to edit their name, and then decide their core function by selecting an agent type – either a helpful General Receptionist or an efficient Inbound Lead Qualifier."
    };
    return (
        <div className={styles.container}>
            <StepHeader title={step?.title}
                subTitle={step?.subTitle}
                // icon={step.icon} 
                tooltip={<Tooltip content={tooltipContentMap[currentStep]} />}
            />
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
                {currentStep === 7 &&

                    <div>

                        <Step3
                            ref={step8ARef}
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
                            setAvtarChecked={setAvtarChecked}
                        />
                        {avtarChecked &&
                            <Step4
                                ref={step8BRef}
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
                                onStepChange={(step) => setCurrentStep(step)}
                                detectRoleTypeChange={detectRoleTypeChange}
                            />}

                    </div>}
            </Slider>
            {/* === Footer Fixed Pagination === */}
            {/* <div className={styles.footerFixed}>
                <div className={styles.stepsIndicator}>
                    {
                        [...Array(totalSlides)].reduce((acc, _, idx) => {
                            if (idx === 2) return acc;
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
                                            7: [step8ARef, step8BRef],

                                        };

                                        if (idx > currentStep) {
                                            for (let i = currentStep; i < idx; i++) {
                                                if (completedSteps.includes(i)) continue;
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



                                        setCurrentStep(idx);
                                        setVisibleStep(idx);
                                        sliderRef.current?.slickGoTo(idx);
                                    }}

                                >
                                    {acc.length + 1}
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



            </div> */}

            {/* Nitish code */}
            <div className={styles.footerFixed}>
                <div className={styles.stepsIndicator}>
                    {
                        [...Array(totalSlides)].reduce((acc, _, idx) => {
                            if (idx === 2) return acc;

                            const isClickable = idx <= currentStep || completedSteps.includes(idx);
                            const isCompleted = completedSteps.includes(idx);
                            const isCurrent = currentStep === idx;
                            const isUpcoming = !isCompleted && !isCurrent;

                            let stepClass = styles.stepNumber;
                            if (isCompleted && !isCurrent) stepClass += ` ${styles.completedStep}`;
                            if (isCurrent) stepClass += ` ${styles.activeStepNumber}`;
                            if (isUpcoming) stepClass += ` ${styles.upcomingStep}`;

                            acc.push(
                                <button
                                    key={idx}
                                    disabled={!isClickable}
                                    className={stepClass}
                                    onClick={async () => {
                                        if (!isClickable || isContinueClicked) return;

                                        const validations = {
                                            0: step1Ref,
                                            1: step3Ref,
                                            3: step4Ref,
                                            4: step5Ref,
                                            5: step6Ref,
                                            6: step7Ref,
                                            7: [step8ARef, step8BRef],
                                        };

                                        if (idx > currentStep) {
                                            for (let i = currentStep; i < idx; i++) {
                                                if (completedSteps.includes(i)) continue;

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

                                        setCurrentStep(idx);
                                        setVisibleStep(idx);
                                        sliderRef.current?.slickGoTo(idx);
                                    }}
                                >
                                    {isCompleted && !isCurrent ? (
                                        <span />
                                    ) : (
                                        acc.length + 1
                                    )}
                                </button>
                            );

                            return acc;
                        }, [])

                    }

                </div>
                {/* //Button */}
                {currentStep === 7 ? <button className={styles.navBtn} onClick={handleSubmit}>
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