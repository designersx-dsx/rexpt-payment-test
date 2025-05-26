import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import styles from './Step.module.css';
import Step2 from '../Step2/Step2';
import Step3 from '../Step3/Step3';
import Step4 from '../Step4/Step4'
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { toast } from 'react-toastify';
import PopUp from '../Popup/Popup';
import StepHeader from '../StepHeader/StepHeader';
import axios from 'axios';


const Step = () => {
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedLang, setSelectedLang] = useState('');
    const [selectedLangCode, setSelectedLangCode] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    console.log('selectedLan,', selectedLang)
    const step2Ref = useRef();
    const step3Ref = useRef();
    const step4Ref = useRef();
    useEffect(() => {
        sessionStorage.setItem("agentLanguage", selectedLang);
        sessionStorage.setItem("agentLanguageCode", selectedLangCode);
    }, [selectedLang])

    const totalSlides = 4;
    const role_title= sessionStorage.getItem("agentRole") || "General Receptionist";
    const business = JSON.parse(sessionStorage.getItem("businessDetails") )|| "Your Business Name";
    const BusinessLocation = JSON.parse(sessionStorage.getItem("businessLocation") )|| "Your Business Services";
    const agentName = sessionStorage.getItem("agentName") || "";
    const prompt=`You are an AI Receptionist ${agentName}, working as a ${role_title} for ${business?.businessName}.
Your main goal is to professionally greet, assist, and guide callers or visitors. Use a helpful, polite, and clear tone. Tailor your conversation based on your role and the context.
Here is your profile:
- Role:  ${role_title}
- Role Description: ${role_title}
- Business Name:  ${business?.businessName}
- Business Services:  ${business?.businessType}
- Business Location: ${BusinessLocation?.country}}

Responsibilities:
1. Greet customers warmly and identify their needs.
2. Answer basic questions about the business, services, or hours.
3. Direct them to the correct person, department, or provide contact info.
4. Collect necessary details like name, issue type, and contact number if required.
5. Politely handle situations you can't resolve and offer alternatives (like escalation or support request).
6. Stay in character based on your receptionist role.

If you’re unsure of something, respond with:  
**"I’ll connect you to someone who can better assist with that."**

Always maintain a tone that matches the following persona:  
**${role_title}**

---

Let’s begin assisting the customer!
`

    const languages = [
        /* English family */
        { name: 'English (US)', locale: 'en-US', flag: '/images/en-US.png', percentage: '—', stats: '—' },
        { name: 'English (India)', locale: 'en-IN', flag: '/images/en-IN.png', percentage: '—', stats: '—' },
        { name: 'English (UK)', locale: 'en-GB', flag: '/images/en-GB.png', percentage: '—', stats: '—' },
        { name: 'English (Australia)', locale: 'en-AU', flag: '/images/en-AU.png', percentage: '—', stats: '—' },
        { name: 'English (New Zealand)', locale: 'en-NZ', flag: '/images/en-NZ.png', percentage: '—', stats: '—' },

        /* Germanic & Nordic */
        { name: 'German', locale: 'de-DE', flag: '/images/de-DE.png', percentage: '—', stats: '—' },
        { name: 'Dutch', locale: 'nl-NL', flag: '/images/nl-NL.png', percentage: '—', stats: '—' },
        { name: 'Danish', locale: 'da-DK', flag: '/images/da-DK.png', percentage: '—', stats: '—' },
        { name: 'Finnish', locale: 'fi-FI', flag: '/images/fi-FI.png', percentage: '—', stats: '—' },
        { name: 'Norwegian', locale: 'no-NO', flag: '/images/no-NO.png', percentage: '—', stats: '—' },
        { name: 'Swedish', locale: 'sv-SE', flag: '/images/sv-SE.png', percentage: '—', stats: '—' },

        /* Romance */
        { name: 'Spanish (Spain)', locale: 'es-ES', flag: '/images/es-ES.png', percentage: '—', stats: '—' },
        { name: 'Spanish (LatAm)', locale: 'es-419', flag: '/images/es-419.png', percentage: '—', stats: '—' },
        { name: 'French (France)', locale: 'fr-FR', flag: '/images/fr-FR.png', percentage: '—', stats: '—' },
        { name: 'French (Canada)', locale: 'fr-CA', flag: '/images/fr-CA.png', percentage: '—', stats: '—' },
        { name: 'Italian', locale: 'it-IT', flag: '/images/it-IT.png', percentage: '—', stats: '—' },
        { name: 'Portuguese (Portugal)', locale: 'pt-PT', flag: '/images/pt-PT.png', percentage: '—', stats: '—' },
        { name: 'Portuguese (Brazil)', locale: 'pt-BR', flag: '/images/pt-BR.png', percentage: '—', stats: '—' },
        { name: 'Catalan', locale: 'ca-ES', flag: '/images/ca-ES.png', percentage: '—', stats: '—' },
        { name: 'Romanian', locale: 'ro-RO', flag: '/images/ro-RO.png', percentage: '—', stats: '—' },

        /* Slavic & Baltic */
        { name: 'Polish', locale: 'pl-PL', flag: '/images/pl-PL.png', percentage: '—', stats: '—' },
        { name: 'Russian', locale: 'ru-RU', flag: '/images/ru-RU.png', percentage: '—', stats: '—' },
        { name: 'Bulgarian', locale: 'bg-BG', flag: '/images/bg-BG.png', percentage: '—', stats: '—' },
        { name: 'Slovak', locale: 'sk-SK', flag: '/images/sk-SK.png', percentage: '—', stats: '—' },

        /* Hellenic & Uralic */
        { name: 'Greek', locale: 'el-GR', flag: '/images/el-GR.png', percentage: '—', stats: '—' },
        { name: 'Hungarian', locale: 'hu-HU', flag: '/images/hu-HU.png', percentage: '—', stats: '—' },

        /* Asian */
        { name: 'Hindi', locale: 'hi-IN', flag: '/images/hi-IN.png', percentage: '—', stats: '—' },
        { name: 'Japanese', locale: 'ja-JP', flag: '/images/ja-JP.png', percentage: '—', stats: '—' },
        { name: 'Korean', locale: 'ko-KR', flag: '/images/ko-KR.png', percentage: '—', stats: '—' },
        { name: 'Chinese (Mandarin)', locale: 'zh-CN', flag: '/images/zh-CN.png', percentage: '—', stats: '—' },
        { name: 'Vietnamese', locale: 'vi-VN', flag: '/images/vi-VN.png', percentage: '—', stats: '—' },
        { name: 'Indonesian', locale: 'id-ID', flag: '/images/id-ID.png', percentage: '—', stats: '—' },

        /* Turkic */
        { name: 'Turkish', locale: 'tr-TR', flag: '/images/tr-TR.png', percentage: '—', stats: '—' },

        /* Universal / Mixed set */
        { name: 'Multilingual', locale: 'multi', flag: '/images/multi.png', percentage: '—', stats: '—' },
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
            setShowPopup(true)
            setPopupType("failed")
            setPopupMessage("Please select a language first.")
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
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            sliderRef.current.slickPrev();
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
        beforeChange: (_, next) => setCurrentStep(next),
    };
    const handleContinue = async() => {
        if (step4Ref.current) {
            const isValid = step4Ref.current.validate();
            if (isValid) {

                const agentConfig = {
                version: 0,
                model: "gemini-2.0-flash-lite",
                //   s2s_model: "gpt-4o-realtime",
                model_temperature: 0,
                model_high_priority: true,
                tool_call_strict_mode: true,

                general_prompt: prompt,

                general_tools: [
                    {
                    type: "end_call",
                    name: "end_call",
                    description: "End the call with user.",
                    },
                ],

                //   states: [
                //     {
                //       name: "information_collection",
                //       state_prompt:
                //         "You will follow the steps below to collect information...",
                //       edges: [
                //         {
                //           destination_state_name: "appointment_booking",
                //           description: "Transition to book an appointment.",
                //         },
                //       ],
                //       tools: [
                //         {
                //           type: "transfer_call",
                //           name: "transfer_to_support",
                //           description: "Transfer to the support team.",
                //           transfer_destination: {
                //             type: "predefined",
                //             number: "+918054226467", // Replace with actual number
                //           },
                //         },
                //       ],
                //     },
                //     {
                //       name: "appointment_booking",
                //       state_prompt:
                //         "You will follow the steps below to book an appointment...",
                //       tools: [
                //         {
                //           type: "book_appointment_cal",
                //           name: "book_appointment",
                //           description: "Book an annual check up.",
                //           cal_api_key: process.env.REACT_APP_API_CAL_API ||sessionStorage.getItem(cal_api_key), // Replace with actual API key
                //           event_type_id: 2508158 ||sessionStorage.getItem(cal_event_id),                 // Replace with actual event type ID
                //           timezone: "America/Los_Angeles",      // Replace with actual timezone
                //         },
                //       ],
                //     },
                //   ],

                //   starting_state: "information_collection",

                begin_message: `Hey I am a virtual assistant ${agentName}, calling from ${business?.businessName}.`,

                default_dynamic_variables: {
                    customer_name: "John Doe",
                },
                knowledge_base_ids: [sessionStorage.getItem("knowledgeBaseId")],
                };
                try {
                    const llmResponse = await axios.post(
                    'https://api.retellai.com/create-retell-llm',
                    agentConfig,
                    {
                        headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                        'Content-Type': 'application/json',
                        },
                    }
                    );
                    console.log("LLM creation success:", llmResponse);
                    sessionStorage.setItem("llmId", llmResponse.data.llm_id);
                    const llmId= llmResponse.data.llm_id;

                         const response_engine={
                        type: "retell-llm",
                        llm_id: llmId ,
                        }
                        const finalAgentData={
                            response_engine,
                            // ...otherAgentSpecifications
                            voice_id: sessionStorage.getItem("agentVoice") || "11labs-Adrian",
                            language: sessionStorage.getItem('agentLanguageCode')||"en-US",
                            agent_name: sessionStorage.getItem("agentName"),
                            language: sessionStorage.getItem('agentLanguageCode')||"en-US",
                        }

                            try {
                              const response = await axios.post(
                                'https://api.retellai.com/create-agent',
                                finalAgentData,
                                {
                                  headers: {
                                    Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                                  },
                                }
                              );

                              console.log("Upload success:", response);
                               setPopupType('success');
                                setPopupMessage("Agent created successfully!");
                                setShowPopup(true);
                                setTimeout(() => navigate('/agent-detail'), 1500);
                            } catch (err) {
                              console.error("Upload failed:", err);
                                setPopupType('failed');
                                setPopupMessage("Agent creation failed.");
                                setShowPopup(true);
                            }

                }
                catch (error) {
                    console.error("LLM creation failed:", error);
                         setPopupType('failed');
                     setPopupMessage("LLM creation failed. Please try again.");
                     setShowPopup(true);
                    // alert("LLM creation failed. Please try again.");
                }
                
            }

        }
    };
    const handleValidationError = ({ type, message }) => {
        setPopupType(type);
        setPopupMessage(message);
        setShowPopup(true);
    };
  const stepTitles = [
    'Agent Language Supported',
    'Agent Gender',
    'Agent Name',
    'Receptionist Type',
  ];
    return (
        <div className={styles.container}>
                <StepHeader title={stepTitles[currentStep]} />
            <Slider ref={sliderRef} {...settings}>
                {/* Step 1 */}
                <div>
                    <div className={styles.slideContent}>
                        {/* <StepHeader title="Agent Language Supported" /> */}

                        <div className={styles.grid}>
                            {languages.map((lang, index) => (
                                <label
                                    key={index}
                                    className={`${styles.card} ${selectedLang === lang.name ? styles.active : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="language"
                                        value={lang.name}
                                        checked={selectedLang === lang.name}
                                        onChange={() => {
                                            setSelectedLangCode(lang.locale)
                                            setSelectedLang(lang.name)
                                        }
                                        }
                                        className={styles.radioInput}
                                    />
                                    <div className={styles.flagWrapper}>
                                        <img
                                            src={`https://flagcdn.com/w80/${lang.locale?.split('-')[1]?.toLowerCase()}.png`}
                                            alt={lang.name}
                                            className={styles.flag}
                                        />
                                    </div>

                                    <p className={styles.langName}>{lang.name}</p>
                                    {/* <p className={styles.stats}>{lang.percentage} · {lang.stats}</p> */}
                                    {selectedLang === lang.name && <span className={styles.langDot}></span>}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div>
                    <Step2 ref={step2Ref} onNext={handleNext} onBack={handleBack} onValidationError={handleValidationError} />
                </div>

                {/* Step 3 */}
                <div >
                    <Step3 ref={step3Ref} onNext={handleNext} onBack={handleBack} onValidationError={handleValidationError} />
                </div>
                {/* Step 4 */}

                <div >
                    <Step4 ref={step4Ref} onNext={handleNext} onBack={handleBack} onValidationError={handleValidationError} />
                </div>
            </Slider>

            {/* === Footer Fixed Pagination === */}
            <div className={styles.footerFixed}>
                {currentStep > 0 && (
                    <button className={styles.navBtn} onClick={handleBack}>
                        Back
                    </button>
                )}
                {currentStep < totalSlides - 1 && (
                    <button className={styles.navBtn} onClick={handleNext}>
                        Next
                    </button>
                )}
                {currentStep === totalSlides - 1 && (
                    <button
                        className={styles.navBtn}
                        onClick={handleContinue}
                    >
                        Continue
                    </button>
                )}
            </div>
            {showPopup && (
                <PopUp type={popupType} onClose={() => setShowPopup(false)} message={popupMessage} />
            )}

        </div>
    );
};

export default Step;
