import React, { useEffect, useRef, useState, useMemo } from "react";
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
const Step = () => {
    const timestamp = Date.now();
    const [isRoleTitleChanged, setIsRoleTitleChanged] = useState(false);
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedLang, setSelectedLang] = useState();
    const [selectedLangCode, setSelectedLangCode] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const [loading, setLoading] = useState(false)
    const [agentCount, setAgentCount] = useState(0);
    const step2Ref = useRef();
    const step3Ref = useRef();
    const step4Ref = useRef();
    const token = localStorage.getItem("token") || "";
    const decodeTokenData = decodeToken(token)
    const [userId, setUserId] = useState(decodeTokenData?.id || "");
    const { setHasFetched } = useDashboardStore();
    const EditingMode = localStorage.getItem("UpdationMode");
    const stepEditingMode = localStorage.getItem("UpdationModeStepWise");
    const { isLimitExceeded, CheckingUserLimit } = useCheckAgentCreationLimit(userId);
    const [isContinueClicked, setIsContinueClicked] = useState(false);
    useEffect(() => {
        if (localStorage.getItem('UpdationMode') == "ON") {
            setSelectedLang(localStorage.getItem("agentLanguage"))
            setSelectedLangCode(localStorage.getItem("agentLanguageCode"))
        }
    }, [])

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


    useEffect(() => {
        sessionStorage.setItem("agentLanguage", selectedLang);
        sessionStorage.setItem("agentLanguageCode", selectedLangCode);
    }, [selectedLang]);

    const totalSlides = 4;

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
    const commaSeparatedServices = allServices?.join(", ");
    const agentGender = (sessionStorage.getItem("agentGender"))
    const aboutBusinessForm = JSON.parse(sessionStorage.getItem("aboutBusinessForm")) || "Your Business Services";
    const agentName = sessionStorage.getItem("agentName") || "";
    const packageName = sessionStorage.getItem("package") || "Free";
    const packageMap = {
        "Free": 1,
        "Starter": 2,
        "Scaler": 3,
        "Growth": 4,
        "Corporate": 5,
        "Enterprise": 6
    };
    const packageValue = packageMap[packageName] || 1;
    const languages = [
        /* English family */
        {
            name: "English (US)",
            locale: "en-US",
            flag: "/images/en-US.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "English (India)",
            locale: "en-IN",
            flag: "/images/en-IN.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "English (UK)",
            locale: "en-GB",
            flag: "/images/en-GB.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "English (Australia)",
            locale: "en-AU",
            flag: "/images/en-AU.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "English (New Zealand)",
            locale: "en-NZ",
            flag: "/images/en-NZ.png",
            percentage: "—",
            stats: "—",
        },

        /* Germanic & Nordic */
        {
            name: "German",
            locale: "de-DE",
            flag: "/images/de-DE.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Dutch",
            locale: "nl-NL",
            flag: "/images/nl-NL.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Danish",
            locale: "da-DK",
            flag: "/images/da-DK.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Finnish",
            locale: "fi-FI",
            flag: "/images/fi-FI.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Norwegian",
            locale: "no-NO",
            flag: "/images/no-NO.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Swedish",
            locale: "sv-SE",
            flag: "/images/sv-SE.png",
            percentage: "—",
            stats: "—",
        },

        /* Romance */
        {
            name: "Spanish (Spain)",
            locale: "es-ES",
            flag: "/images/es-ES.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Spanish (LatAm)",
            locale: "es-419",
            flag: "/images/es-ES.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "French (France)",
            locale: "fr-FR",
            flag: "/images/fr-FR.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "French (Canada)",
            locale: "fr-CA",
            flag: "/images/fr-CA.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Italian",
            locale: "it-IT",
            flag: "/images/it-IT.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Portuguese (Portugal)",
            locale: "pt-PT",
            flag: "/images/pt-PT.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Portuguese (Brazil)",
            locale: "pt-BR",
            flag: "/images/pt-BR.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Catalan",
            locale: "ca-ES",
            flag: "/images/ca-ES.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Romanian",
            locale: "ro-RO",
            flag: "/images/ro-RO.png",
            percentage: "—",
            stats: "—",
        },

        /* Slavic & Baltic */
        {
            name: "Polish",
            locale: "pl-PL",
            flag: "/images/pl-PL.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Russian",
            locale: "ru-RU",
            flag: "/images/ru-RU.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Bulgarian",
            locale: "bg-BG",
            flag: "/images/bg-BG.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Slovak",
            locale: "sk-SK",
            flag: "/images/sk-SK.png",
            percentage: "—",
            stats: "—",
        },

        /* Hellenic & Uralic */
        {
            name: "Greek",
            locale: "el-GR",
            flag: "/images/el-GR.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Hungarian",
            locale: "hu-HU",
            flag: "/images/hu-HU.png",
            percentage: "—",
            stats: "—",
        },

        /* Asian */
        {
            name: "Hindi",
            locale: "hi-IN",
            flag: "/images/hi-IN.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Japanese",
            locale: "ja-JP",
            flag: "/images/ja-JP.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Korean",
            locale: "ko-KR",
            flag: "/images/ko-KR.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Chinese (Mandarin)",
            locale: "zh-CN",
            flag: "/images/zh-CN.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Vietnamese",
            locale: "vi-VN",
            flag: "/images/vi-VN.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Indonesian",
            locale: "id-ID",
            flag: "/images/id-ID.png",
            percentage: "—",
            stats: "—",
        },

        /* Turkic */
        {
            name: "Turkish",
            locale: "tr-TR",
            flag: "/images/tr-TR.png",
            percentage: "—",
            stats: "—",
        },

        /* Universal / Mixed set */
        {
            name: "Multilingual",
            locale: "multi",
            flag: "/images/multi.png",
            percentage: "—",
            stats: "—",
        },
    ];
    const handleNext = () => {
        if (currentStep === 1 && step2Ref.current && !step2Ref.current.validate()) {
            return;
        }
        if (currentStep === 2 && step3Ref.current && !step3Ref.current.validate()) {
            return;
        }
        if (currentStep === 3 && step4Ref.current && !step4Ref.current.validate()) {
            return;
        }

        if (currentStep === 0 && !selectedLang) {
            setShowPopup(true);
            setPopupType("failed");
            setPopupMessage("Please select a language first.");
            return;
        }
        if (currentStep === 1 && step2Ref.current && !step2Ref.current.validate()) {

            return;
        }
        if (currentStep === 2 && step3Ref.current && !step3Ref.current.validate()) {
            return;
        }

        if (currentStep < totalSlides - 1) {
            sliderRef.current.slickNext();
            scrollToTop();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            sliderRef.current.slickPrev();
        }
    };
    const isAdaptiveHeight = currentStep !== 3 || currentStep !== 2
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        adaptiveHeight: isAdaptiveHeight,
        slidesToScroll: 1,
        arrows: false,
        swipe: false,
        beforeChange: (_, next) => {
            setCurrentStep(next);
        },
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
    const detectRoleTypeChange = (roleTitle) => {
        setIsRoleTitleChanged((prev) => !prev);
    }
    const getBusinessNameFormCustom = sessionStorage.getItem("displayBusinessName");
    const getBusinessNameFromGoogleListing = JSON.parse(sessionStorage.getItem("placeDetailsExtract"))
    const sanitize = (str) => String(str || "").trim().replace(/\s+/g, "_");
    const dynamicAgentName = `${sanitize(businessType)}_${sanitize(getBusinessNameFromGoogleListing?.businessName ||getBusinessNameFormCustom) }_${sanitize(role_title)}_${packageValue}#${agentCount}`

    const handleContinue = async () => {
        if (step4Ref.current) {
            setIsContinueClicked(true);
            const agentNote = sessionStorage.getItem("agentNote");
            const filledPrompt =
                getAgentPrompt({
                    industryKey: business?.businessType == "Other" ? business?.customBuisness : business?.businessType,   // ← dynamic from businessType
                    roleTitle: sessionStorage.getItem("agentRole"),
                    agentName: agentName,
                    agentGender: agentGender,
                    business: {
                        businessName: getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom ,
                        email: getBusinessNameFromGoogleListing?.email || "",

                    },
                    languageSelect: languageSelect,
                    businessType,
                    aboutBusinessForm,
                    commaSeparatedServices,
                    agentNote
                });
            const isValid = step4Ref.current.validate();
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
                            tools: [
                                {
                                    type: "book_appointment_cal",
                                    name: "book_appointment",
                                    description: "Book an annual check up.",
                                    cal_api_key: "cal_live_447bd92f96b6fc71e427e51cdc40e2cf",
                                    event_type_id: 2508223,
                                    timezone: "America/Los_Angeles",
                                },
                            ],
                        },
                    ],
                    starting_state: "information_collection",
                    begin_message: `Hey I am a virtual assistant ${agentName}, calling from ${getBusinessNameFromGoogleListing?.businessName ||getBusinessNameFormCustom }.`,
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
                            additionalNote:agentNote||"",

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
                    begin_message: `Hey I am a virtual assistant ${agentName}, calling from ${getBusinessNameFromGoogleListing?.businessName ||getBusinessNameFormCustom }.`,

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
                            additionalNote:agentNote||"",
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
    };
    const stepTitles = [
        EditingMode ? "Edit: Agent Language " : "Agent Language Supported",
        EditingMode ? "Edit: Agent Gender" : "Agent Gender",
        "",
        EditingMode ? "Edit: Receptionist Type" : "Receptionist Type",
    ];
    // function lock
    useEffect(() => {
        fetchAgentCountFromUser()
    }, [])

    // useEffect(() => {
    //     if (!CheckingUserLimit && isLimitExceeded && !EditingMode) {
    //         setShowPopup(true);
    //         setPopupType('failed');
    //         setPopupMessage("Agent creation limit exceeded. Please upgrade your plan!");
    //     }
    // }, [CheckingUserLimit, isLimitExceeded]);

    // if (CheckingUserLimit) return <p></p>;

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

    return (
        <div className={styles.container}>
            <StepHeader title={stepTitles[currentStep]} />
            <Slider ref={sliderRef} {...settings}>
                {/* Step 1 */}
                <div>
                    <div className={styles.slideContent}>
                        <div className={styles.grid}>
                            {languages.map((lang, index) => (
                                <label
                                    key={index}
                                    className={`${styles.card} ${selectedLang === lang.name ? styles.active : ""
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="language"
                                        value={lang.name}
                                        checked={selectedLang === lang.name}
                                        onChange={() => {
                                            setSelectedLangCode(lang.locale);
                                            setSelectedLang(lang.name);
                                        }}
                                        className={styles.radioInput}
                                    />
                                    <div className={styles.flagWrapper}>
                                        <img
                                            src={`https://flagcdn.com/w80/${lang.locale
                                                ?.split("-")[1]
                                                ?.toLowerCase()}.png`}
                                            alt={lang.name}
                                            className={styles.flag}
                                            onError={(e) => {
                                                if(lang.locale === "multi") {
                                                    e.target.src = "/images/multi.png"; // Fallback for multi-language
                                                } 
                                                if (lang.locale === "es-419") {
                                                    e.target.src = "https://flagcdn.com/w80/es.png"; // Fallback for other languages
                                                }
                                               }
                                            }
                                        />
                                    </div>

                                    <p className={styles.langName}>{lang.name}</p>
                                    {selectedLang === lang.name && (
                                        <span className={styles.langDot}></span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div>
                    <Step2
                        ref={step2Ref}
                        onNext={handleNext}
                        onBack={handleBack}
                        onValidationError={handleValidationError}
                    />
                </div>
                {/* Step 3 */}
                <div className={styles.Step3Container}>
                    <Step3
                        ref={step3Ref}
                        onNext={handleNext}
                        onBack={handleBack}
                        onValidationError={handleValidationError}
                    />
                </div>
                {/* Step 4 */}

                <div  className={styles.Step4Container}>
                    <Step4
                        ref={step4Ref}
                        onNext={handleNext}
                        onBack={handleBack}
                        onValidationError={handleValidationError}
                        loading={loading}
                        setLoading={setLoading}
                        detectRoleTypeChange={detectRoleTypeChange}
                    />
                </div>


            </Slider>

            {/* === Footer Fixed Pagination === */}
            <div className={styles.footerFixed}>
                {/* Step dots */}
                <div className={styles.stepsIndicator}>
                    {[...Array(totalSlides)].map((_, idx) => (
                        <span
                            key={idx}
                            className={`${styles.stepDot} ${currentStep === idx ? styles.activeDot : ''}`}
                            onClick={async () => {
                                if (isContinueClicked) return;
                                // Step 0 validation (language)
                                if (currentStep === 0 && !selectedLang) {
                                    setShowPopup(true);
                                    setPopupType("failed");
                                    setPopupMessage("Please select a language first.");
                                    return;
                                }

                                // Step 1 validation (gender + voice)
                                if (currentStep === 1 && step2Ref.current && !step2Ref.current.validate()) {
                                    return;
                                }

                                // Step 2 validation
                                if (currentStep === 2 && step3Ref.current && !step3Ref.current.validate()) {
                                    return;
                                }

                                // Step 3 validation
                                if (currentStep === 3 && step4Ref.current && !step4Ref.current.validate()) {
                                    return;
                                }

                                // Allow dot click to change slide
                                sliderRef.current?.slickGoTo(idx);
                            }}
                        />
                    ))}
                </div>
                {currentStep < totalSlides - 1 && (
                    <button className={styles.navBtn} onClick={handleNext}>
                        <img src="svg/arrow.svg" alt="arrow" className={styles.arrowIcon} />
                    </button>
                )}
                {currentStep === totalSlides - 1 && (
                    <button className={styles.navBtn} onClick={handleContinue}>
                        {
                            loading ? <><Loader size={20} /></> : <img src="svg/arrow.svg" alt="arrow" className={styles.arrowIcon} />
                        }
                    </button>
                )}

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