import { useCallback, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL, listAgents, updateAgent } from '../Store/apiStore';
import decodeToken from '../lib/decodeToken';
import { getAgentPrompt, useAgentPrompt } from './useAgentPrompt';
// import { createAgent, updateAgent } from '../api'; // adjust path

const getFromStorage = (key, fallback = "") =>
  sessionStorage.getItem(key) || localStorage.getItem(key) || fallback;

export const useAgentCreator = ({
  stepValidator = () => true,
  setLoading = () => { },
  setPopupMessage = () => { },
  setPopupType = () => { },
  setShowPopup = () => { },
  navigate = () => { },
  setHasFetched = () => { },
}) => {
  const token = localStorage.getItem("token") || "";
  const sessionBusinessiD = sessionStorage.getItem("bId")
  const decodeTokenData = decodeToken(token);
  const [userId, setUserId] = useState(decodeTokenData?.id || "");
  const isUpdating = localStorage.getItem("UpdationMode") == "ON";
  // const sessionBusinessiD=JSON.parse(sessionStorage.getItem("businessId"))
  // const businessId = sessionBusinessiD|| sessionBusinessiD?.businessId ;
  const [agentCount, setAgentCount] = useState(0);


  const fetchAgentCountFromUser = async () => {
    try {
      const response = await listAgents();
      const filterAgents = await response.filter(res => res.userId === userId)
      setAgentCount(filterAgents.length)
    } catch (error) {
      console.log(error)
    }
  }

  const removeSpaces = (phone) => {
    if (!phone) return null;
    return phone.replace(/\s+/g, "");
  };

  useEffect(() => {
    fetchAgentCountFromUser()
  }, [])
  const handleCreateAgent = useCallback(async () => {
    const isValid = stepValidator();
    if (!isValid) return;
    console.log("Creating agent...", isValid);

    const packageMap = {
      "Free": 1,
      "Starter": 2,
      "Scaler": 3,
      "Growth": 4,
      "Corporate": 5,
      "Enterprise": 6
    };
    const Buisness = JSON.parse(sessionStorage.getItem("businessDetails"))
    const businessType = Buisness?.businessType === "Other" ? Buisness?.customBuisness : Buisness?.businessType;
    const role_title = sessionStorage.getItem("agentRole") || "General Receptionist";
    const business = JSON.parse(sessionStorage.getItem("businessDetails")) || "Your Business Name";
    const getBusinessNameFormCustom = sessionStorage.getItem("displayBusinessName");
    const getBusinessNameFromGoogleListing = JSON.parse(sessionStorage.getItem("placeDetailsExtract"))
    const agentNote = sessionStorage.getItem("agentNote") || "";
    const rawCustomServices = JSON.parse(sessionStorage.getItem('selectedCustomServices')) || [];
    const cleanedCustomServices = rawCustomServices
      .map(item => item?.service?.trim())
      .filter(Boolean)
      .map(service => ({ service }));
    const SelectedServices = JSON.parse(sessionStorage.getItem("businesServices")) || "Your Business Name";
    const BusinessLocation = JSON.parse(sessionStorage.getItem("businessLocation")) || "Your Business Services";
    const aboutBusinessForm = JSON.parse(sessionStorage.getItem("aboutBusinessForm")) || "Your Business Services";

    const agentGender = (sessionStorage.getItem("agentGender"))
    const languageSelect = (sessionStorage?.getItem("agentLanguage"))
    const agentName = sessionStorage.getItem("agentName") || "";
    const packageName = sessionStorage.getItem("package") || "Free";
    const sanitize = (str) => String(str || "").trim().replace(/\s+/g, "_");
    const packageValue = packageMap[packageName] || 1; // default to 1 (Free) if not found
    const businessServices = SelectedServices?.selectedService || [];
    const customServices = cleanedCustomServices?.map(item =>

      typeof item === 'string' ? item : item?.service) || [];

    const businessServiceNames = businessServices?.map(item => item);
    const allServices = [...customServices, ...businessServices];

    const commaSeparatedServices = allServices;
    console.log(allServices)

    const dynamicAgentName = `${sanitize(businessType)}_${sanitize(getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom)}_${sanitize(role_title)}_${packageValue}#${agentCount}`

    const CustomservicesArray = cleanedCustomServices?.map(item => item.service) || [];
    const businessPhone = removeSpaces(getBusinessNameFromGoogleListing?.phone)

    const filledPrompt = getAgentPrompt({
      industryKey: business?.businessType,   // ← dynamic from businessType
      roleTitle: role_title, // ← dynamic from sessionStorage or UI
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


    // console.log('prompt1',filledPrompt)
    // return


    //updation here
    if (isValid && localStorage.getItem("UpdationMode") == "ON") {
      setLoading(true)
      if (isValid == 'EditBusinessType' || isValid == 'EditServicesOffered' || isValid == 'BusinessLocation') {

        const businessDetails = JSON.parse(sessionStorage.getItem('businessDetails'));
        const locationData = JSON.parse(sessionStorage.getItem('businessLocation'));
        const buisenessServices = JSON.parse(sessionStorage.getItem('businesServices'))
        // const customServices = JSON.parse(sessionStorage.getItem('selectedCustomServices')) || []; 
        const rawCustomServices = JSON.parse(sessionStorage.getItem('selectedCustomServices')) || [];
        const cleanedCustomServices = rawCustomServices
          .map(item => item?.service?.trim())
          .filter(Boolean)
          .map(service => ({ service }));
        try {
          const response = await axios.patch(`${API_BASE_URL}/businessDetails/updateBusinessDetailsByUserIDandBuisnessID/${userId}?businessId=${sessionBusinessiD}`, {
            businessName: getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom,
            businessSize: businessDetails.businessSize,
            businessType: businessDetails.businessType,
            buisnessEmail: buisenessServices?.email,
            buisnessService: buisenessServices?.selectedService,
            customBuisness: businessDetails?.customBuisness || "",
            // address1: locationData.address1,
            // address2: locationData.address2,
            // city: locationData.city,
            // state: locationData.state,
            // country: locationData.country,
            // zip: locationData.zip,
            customServices: cleanedCustomServices,
          });
          if (sessionStorage.getItem('prevBuisnessType')) {
            sessionStorage.removeItem('prevBuisnessType')
          }
          // console.log('updation response', response)
        } catch (error) {
          console.log('error while buinsess details updated');
          // setLoading(false)
          return
        }
      }

      const storedKnowledgeBaseId = sessionStorage.getItem('knowledgeBaseId');
      const llm_id = localStorage.getItem('llmId') || sessionStorage.getItem('llmId');
      // working2 
      // const agentConfig = {
      //   version: 0,
      //   model: "gemini-2.0-flash",
      //   model_temperature: 0,
      //   model_high_priority: true,
      //   tool_call_strict_mode: true,
      //   general_prompt: filledPrompt,
      //   general_tools: [
      //     {
      //       type: "extract_dynamic_variable",
      //       name: "extract_user_email",
      //       description: "Extract the user's email address from the conversation.",
      //       variables: [
      //         {
      //           type: "string",
      //           name: "email",
      //           description: "The user's email address.",
      //           examples: ["john.doe@example.com", "nitish@company.in"]
      //         }
      //       ]
      //     },
      //     {
      //       type: "custom",
      //       name: "send_company_address_email",
      //       url: " https://26ed8f12e60d.ngrok-free.app/api/businessDetails/sendEmailToUserViaMakeWebhook",
      //       description: "Send the company address to the user's provided email. Ask the user for their email if it's not already available.",
      //       prerequisites: ["email"], // ✅ Make sure email is extracted
      //       speak_after_execution: true,
      //       method: "POST",
      //       headers: {
      //         "Authorization": "Bearer YOUR_API_KEY",
      //         "Content-Type": "application/json"
      //       },
      //       body: {
      //         email: "{{email}}" // ✅ Use global variable
      //       },
      //       response_variables: {
      //         confirmationMessage: "message",
      //         sentToEmail: "to"
      //       },
      //     },


      //   ]
      //   ,
      //   states: [
      //     // 🌟 State: Information Collection
      //     {
      //       name: "information_collection",
      //       state_prompt: `
      //   You are ${agentName?.split(" ")[0]}, a virtual assistant for ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}.
      //   Greet the user with the begin_message and assist with their query.

      //   If the user sounds dissatisfied (angry, frustrated, upset) or uses negative words (like "bad service", "unhappy", "terrible"), 
      //   transition to dissatisfaction_confirmation.

      //   If the user asks for an appointment (e.g., "appointment", "book", "schedule"),
      //   transition to appointment_booking.

      //   If the user is silent or unclear, say: "Sorry, I didn’t catch that. Could you please repeat?"
      // `,
      //  script: `run_tool("extract_user_email")`,

      //       edges: [
      //         {
      //           destination_state_name: "appointment_booking",
      //           description: "User wants to book an appointment."
      //         },
      //         {
      //           destination_state_name: "dissatisfaction_confirmation",
      //           description: "User sounds angry or expresses dissatisfaction."
      //         },
      //       ],

      //     },

      //     // 🌟 State: Dissatisfaction Confirmation
      //     {
      //       name: "dissatisfaction_confirmation",
      //       state_prompt: `
      //   Say: "I'm sorry you're not satisfied. Would you like me to connect you to a team member? Please say yes or no."
      //   Wait for their response.

      //   If the user says yes, transition to call_transfer.
      //   If the user says no, transition to end_call_state.
      //   If the response is unclear, repeat the question once.
      // `,
      //       edges: [
      //         {
      //           destination_state_name: "call_transfer",
      //           description: "User agreed to speak to team member."
      //         },
      //         {
      //           destination_state_name: "end_call_state",
      //           description: "User declined to speak to team member."
      //         }
      //       ],
      //       tools: []
      //     },

      //     // 🌟 State: Call Transfer
      //     {
      //       name: "call_transfer",
      //       state_prompt: `
      //   Connecting you to a team member now. Please hold.
      // `,
      //       tools: [
      //         {
      //           type: "transfer_call",
      //           name: "transfer_to_team",
      //           description: "Transfer the call to the team member.",
      //           transfer_destination: {
      //             type: "predefined",
      //             number: "{{business_Phone}}"
      //           },
      //           transfer_option: {
      //             type: "cold_transfer",
      //             public_handoff_option: {
      //               message: "Please hold while I transfer your call."
      //             }
      //           },
      //           speak_during_execution: true,
      //           speak_after_execution: true,
      //           failure_message: "Sorry, I couldn't transfer your call. Please contact us at {{business_email}} or call {{business_Phone}} directly."
      //         }
      //       ],
      //       edges: []
      //     },

      //     // 🌟 State: Appointment Booking
      //     {
      //       name: "appointment_booking",
      //       state_prompt: `
      //   Help the user book an appointment by asking date, time, and service details.
      //   Confirm once all details are provided.
      // `,
      //       edges: [],
      //       tools: []
      //     },

      //     // 🌟 State: End Call
      //     {
      //       name: "end_call_state",
      //       state_prompt: `
      //   Politely end the call by saying: "Thank you for calling. Have a great day!"
      // `,
      //       tools: [
      //         {
      //           type: "end_call",
      //           name: "end_call",
      //           description: "End the call with the user."
      //         }
      //       ],
      //       edges: []
      //     },
      //       {
      //       name: "extract_user_email",
      //       state_prompt: `
      //   Politely end the call by saying: "Thank you for calling. Have a great day!"
      // `,
      //       tools: [
      //         {
      //           type: "end_call",
      //           name: "end_call",
      //           description: "End the call with the user."
      //         }
      //       ],
      //       edges: []
      //     },
      //     //           {
      //     //             name: "send_business_address_email",
      //     //             state_prompt: "## Task\nIf the user wants the company address, extract or ask for email and immediately send the address.",
      //     //             script: `
      //     //   run_tool("extract_user_email");

      //     //   let finalEmail = email || user_input?.email;

      //     //   function convertSpokenEmail(raw) {
      //     //     return raw
      //     //       .toLowerCase()
      //     //       .replace(/at the rate|at/g, "@")
      //     //       .replace(/dot/g, ".")
      //     //       .replace(/one/g, "1")
      //     //       .replace(/two/g, "2")
      //     //       .replace(/three/g, "3")
      //     //       .replace(/four/g, "4")
      //     //       .replace(/five/g, "5")
      //     //       .replace(/six/g, "6")
      //     //       .replace(/seven/g, "7")
      //     //       .replace(/eight/g, "8")
      //     //       .replace(/nine/g, "9")
      //     //       .replace(/zero/g, "0")
      //     //       .replace(/\s+/g, "");
      //     //   }

      //     //   function isValidEmail(email) {
      //     //     const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      //     //     return emailRegex.test(email);
      //     //   }

      //     //   if (finalEmail) {
      //     //     finalEmail = convertSpokenEmail(finalEmail);
      //     //   }

      //     //   if (finalEmail && isValidEmail(finalEmail)) {
      //     //     speak("Thank you! I'm sending the company address to your email now.");
      //     //     run_tool("send_company_address_email", { email: finalEmail }); // ✅ ACTUAL EMAIL
      //     //     transition("appointment_booking");
      //     //   } else {
      //     //     speak("Hmm, that doesn't look like a valid email. Could you please spell it out again?");
      //     //     wait_for_user_input({ name: "email", type: "string" });
      //     //   }
      //     // `
      //     //             ,
      //     //             edges: [
      //     //               {
      //     //                 destination_state_name: "send_email",
      //     //                 description: "Once the email is collected or available, move to send email state",
      //     //                 parameters: {
      //     //                   type: "object",
      //     //                   properties: {
      //     //                     email: {
      //     //                       type: "string",
      //     //                       description: "User's email address"
      //     //                     }
      //     //                   },
      //     //                   required: ["email"]
      //     //                 }
      //     //               }
      //     //             ]
      //     //           },

      //     //       {
      //     //         name: "send_email",
      //     //         state_prompt: "## Task\nSend the company address to the user's email.",
      //     //         script: `const finalEmail = user_input.email || email;
      //     //         function isValidEmail(email) {
      //     //   const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      //     //   return emailRegex.test(email);
      //     // }

      //     //       if (finalEmail && isValidEmail(finalEmail)) {
      //     //   speak("Thank you! Sending the company address to your email now.");
      //     //   run_tool("send_company_address_email", { email: finalEmail });
      //     //   transition("appointment_booking");
      //     // } else {
      //     //   speak("Hmm, that doesn't look like a valid email address. Could you please spell it out like 'example at gmail dot com'?");
      //     //   transition("information_collection");
      //     // }
      //     //   `,
      //     //         edges: [
      //     //           {
      //     //             destination_state_name: "appointment_booking",
      //     //             description: "After sending the address, move to booking an appointment"
      //     //           },
      //     //           {
      //     //             destination_state_name: "information_collection",
      //     //             description: "If email was not valid, go back to email collection"
      //     //           }
      //     //         ]
      //     //       }

      //   ],
      //   starting_state: "information_collection",
      //   begin_message: `Hi I am ${agentName?.split(" ")[0]}, calling from ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}. How may I help you?`,
      //   default_dynamic_variables: {
      //     customer_name: "John Doe",
      //     timeZone: "Asia/Kolkata",
      //     business_Phone: businessPhone,
      //     business_email: business.email,
      //     email: "",
      //   }
      // };
      const agentConfig = {
        version: 0,
        model: "gemini-2.0-flash",
        model_temperature: 0,
        model_high_priority: true,
        tool_call_strict_mode: true,
        general_prompt: filledPrompt,
        general_tools: [
          {
            type: "extract_dynamic_variable",
            name: "extract_user_email",
            description: "Extract the user's email address from the conversation.",
            variables: [
              {
                type: "string",
                name: "email",
                description: "The user's email address.",
                examples: ["john.doe@example.com", "nitish@company.in"]
              }
            ]
          }
        ],
        states: [
          {
            name: "information_collection",
            state_prompt: `
        You are ${agentName?.split(" ")[0]}, a virtual assistant for ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}.
        Greet the user with the begin_message and assist with their query.

        If the user sounds dissatisfied (angry, frustrated, upset) or uses negative words (like "bad service", "unhappy", "terrible"), 
        transition to dissatisfaction_confirmation.

        If the user asks for an appointment (e.g., "appointment", "book", "schedule"),
        transition to appointment_booking.

        If the user asks for address or email, transition to send_email.

        If the user is silent or unclear, say: "Sorry, I didn’t catch that. Could you please repeat?"
      `,
            script: `run_tool("extract_user_email")`,
            edges: [
              {
                destination_state_name: "appointment_booking",
                description: "User wants to book an appointment."
              },
              {
                destination_state_name: "dissatisfaction_confirmation",
                description: "User sounds angry or expresses dissatisfaction."
              },
              {
                destination_state_name: "send_email",
                description: "User wants to receive address via email."
              }
            ]
          },
          {
            name: "send_email",
            state_prompt: "Send the company address to the user's email.",
            script: `
        function convertSpokenEmail(raw) {
          return raw
            .toLowerCase()
            .replace(/at the rate|at/g, "@")
            .replace(/dot/g, ".")
            .replace(/one/g, "1")
            .replace(/two/g, "2")
            .replace(/three/g, "3")
            .replace(/four/g, "4")
            .replace(/five/g, "5")
            .replace(/six/g, "6")
            .replace(/seven/g, "7")
            .replace(/eight/g, "8")
            .replace(/nine/g, "9")
            .replace(/zero/g, "0")
            .replace(/\\s+/g, "");
        }

        const finalEmail = convertSpokenEmail(email || user_input?.email || "");
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

        if (finalEmail && emailRegex.test(finalEmail)) {
          speak("Thank you! Sending the company address to your email now.");
          run_tool("send_company_address_email", { email: finalEmail });
          transition("appointment_booking");
        } else {
          speak("That doesn't look like a valid email. Can you please say it again?");
          transition("information_collection");
        }
      `,
            tools: [
              {
                type: "custom",
                name: "send_company_address_email",
                description: "Send company address to the user's email.",
                url: "https://26ed8f12e60d.ngrok-free.app/api/businessDetails/sendEmailToUserViaMakeWebhook",
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: {
                  email: "{{email}}"
                },
                speak_during_execution: true,
                speak_after_execution: true,
                response_variables: {
                  confirmationMessage: "message",
                  sentToEmail: "to"
                }
              }
            ],
            edges: []
          },
          {
            name: "dissatisfaction_confirmation",
            state_prompt: `
        Say: "I'm sorry you're not satisfied. Would you like me to connect you to a team member? Please say yes or no."
        Wait for their response.

        If the user says yes, transition to call_transfer.
        If the user says no, transition to end_call_state.
        If the response is unclear, repeat the question once.
      `,
            edges: [
              {
                destination_state_name: "call_transfer",
                description: "User agreed to speak to team member."
              },
              {
                destination_state_name: "end_call_state",
                description: "User declined to speak to team member."
              }
            ],
            tools: []
          },
          {
            name: "call_transfer",
            state_prompt: `Connecting you to a team member now. Please hold.`,
            tools: [
              {
                type: "transfer_call",
                name: "transfer_to_team",
                description: "Transfer the call to the team member.",
                transfer_destination: {
                  type: "predefined",
                  number: "{{business_Phone}}"
                },
                transfer_option: {
                  type: "cold_transfer",
                  public_handoff_option: {
                    message: "Please hold while I transfer your call."
                  }
                },
                speak_during_execution: true,
                speak_after_execution: true,
                failure_message: "Sorry, I couldn't transfer your call. Please contact us at {{business_email}} or call {{business_Phone}} directly."
              }
            ],
            edges: []
          },
          {
            name: "appointment_booking",
            state_prompt: `
        Help the user book an appointment by asking date, time, and service details.
        Confirm once all details are provided.
      `,
            edges: [],
            tools: []
          },
          {
            name: "end_call_state",
            state_prompt: `Politely end the call by saying: "Thank you for calling. Have a great day!"`,
            tools: [
              {
                type: "end_call",
                name: "end_call",
                description: "End the call with the user."
              }
            ],
            edges: []
          }
        ],
        starting_state: "information_collection",
        begin_message: `Hi I am ${agentName?.split(" ")[0]}, calling from ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}. How may I help you?`,
        default_dynamic_variables: {
          customer_name: "John Doe",
          timeZone: "Asia/Kolkata",
          business_Phone: businessPhone,
          business_email: business.email,
          email: ""
        }
      };

      if (isValid == 'BusinessListing') {
        agentConfig.knowledge_base_ids = [storedKnowledgeBaseId];
      }
      //Create LLm 
      // console.log(llm_id)
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
        // console.log('llmResponseupdate', llmResponse)
        sessionStorage.setItem("llmId", llmResponse.data.llm_id);
        //agent updation 
        if (isValid == 'EditBusinessType' || isValid == 'EditServicesOffered' || isValid == 'EditLanguage' || isValid == 'EditGender' || isValid == 'EditNameAvtar') {
          const finalAgentData = {
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
            webhook_url: "https://d055398962e7.ngrok-free.app/api/agent/updateAgentCallEventsViaWebHook",
            normalize_for_speech: true
          };
          const agent_id = sessionStorage.getItem("agent_id") || localStorage.getItem("agentId")
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
            // console.log('agent response',response)
            const agentId = response?.data?.agent_id;
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
            }
            try {
              const response = await updateAgent(agentId, agentData);
              if (response.status === 200 || response.status === 201) {
                setPopupType("success");
                setPopupMessage("Agent Updated successfully!");
                setShowPopup(true);
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
            console.error("Agent Updation failed:", err);
            setPopupType("failed");
            setPopupMessage("Agent Updation failed.");
            setShowPopup(true);
            setLoading(false)
          }
        }

        setPopupType("success");
        const screenLabels = {
          EditBusinessType: "Business Type",
          EditServicesOffered: "Services Offered",
          EditNameAvtar: "Name & Avtar",
          EditLanguage: "Agent Language",
          EditGender: "Agent Gender / Voice ",
          EditBusinessDetail: "Business Detail"
        };
        // console.log('isValidjsdjajdja',isValid)
        setPopupMessage(`${screenLabels[isValid]} Updated Succesfully`);
        setShowPopup(true);
        setTimeout(() => {
          navigate('/edit-agent', { replace: true })
        }, 1000)
        setHasFetched(false);
      }
      catch (error) {
        console.error("LLM updation failed:", error);
        setPopupType("failed");
        setPopupMessage("LLM updation failed. Please try again.");
        setShowPopup(true);
      } finally {
        setLoading(false)
      }

      setLoading(false)
    }

  }, [
    stepValidator,
    setLoading,
    setPopupMessage,
    setPopupType,
    setShowPopup,
    navigate,
    setHasFetched,
  ]);

  return { handleCreateAgent };
};

const cleanServiceArray = () => {
  try {

    let raw
    if (localStorage.getItem('UpdationMode') != "ON") {
      raw = sessionStorage.getItem('businessDetails')
    } else {
      raw = raw = sessionStorage.getItem('businessDetails')
    }
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.selectedService)) {
      return parsed.selectedService;
    } else if (typeof parsed?.selectedService === 'object' && Array.isArray(parsed.selectedService.selectedService)) {
      return parsed.selectedService.selectedService;
    }
    return [];
  } catch {
    return [];
  }
}