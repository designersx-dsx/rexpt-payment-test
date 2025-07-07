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
    console.log("Creating agent...",isValid);

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
    const agentNote = sessionStorage.getItem("agentNote")||"";
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

    const dynamicAgentName = `${sanitize(businessType)}_${sanitize(getBusinessNameFromGoogleListing?.businessName ||getBusinessNameFormCustom)}_${sanitize(role_title)}_${packageValue}#${agentCount}`

    const CustomservicesArray = cleanedCustomServices?.map(item => item.service) || [];
    const businessPhone=removeSpaces(getBusinessNameFromGoogleListing?.phone)

    const filledPrompt = getAgentPrompt({
      industryKey: business?.businessType,   // ← dynamic from businessType
      roleTitle: role_title, // ← dynamic from sessionStorage or UI
      agentName: agentName,
      agentGender: agentGender,
      business: {
        businessName: getBusinessNameFromGoogleListing?.businessName ||getBusinessNameFormCustom,
        email:  getBusinessNameFromGoogleListing?.email || "",
        aboutBusiness:getBusinessNameFromGoogleListing?.aboutBusiness || getBusinessNameFromGoogleListing?.aboutBussiness,
        address:getBusinessNameFromGoogleListing?.address||""
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
            businessName: getBusinessNameFromGoogleListing?.businessName ||getBusinessNameFormCustom,
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
          if(sessionStorage.getItem('prevBuisnessType')){
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
  //     const agentConfig = {
  //       general_prompt: filledPrompt,
  //       general_tools: [
  //                       // {
  //                       //     type: "end_call",
  //                       //     name: "end_call",
  //                       //     description: "End the call with user.",
  //                       // },


  //                   ],
  //        states: [
  //   {
  //     name: "information_collection",
  //     state_prompt: `
  //       You are ${agentName?.split(" ")[0]}, a virtual assistant for ${
  //       getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom
  //     }. Greet the user with the begin_message and assist with their query.
  //       If the user expresses dissatisfaction (e.g., "not satisfied", "unhappy", "talk to someone else", "human agent", "waste of time"), transition to the dissatisfaction_handling state.
  //       If the user asks for an appointment (e.g., "appointment", "book", "schedule"), transition to appointment_booking.
  //       For other queries, respond helpfully based on the business context.
  //       If the user is silent or unclear, say: "I'm sorry, I didn't catch that. Could you please repeat?"
  //     `,
  //     edges: [
  //       {
  //         destination_state_name: "appointment_booking",
  //         description: "Transition to book an appointment.",
  //         condition: {
  //           type: "text_contains",
  //           value: ["appointment", "book", "schedule"],
  //         },
  //       },
  //       {
  //         destination_state_name: "dissatisfaction_handling",
  //         description: "Handle user dissatisfaction and confirm transfer.",
  //         condition: {
  //           type: "text_contains",
  //           value: ["not satisfied", "unhappy", "talk to someone else", "human agent", "waste of time", "transfer"],
  //         },
  //       },
  //       {
  //         destination_state_name: "information_collection",
  //         description: "Handle unclear or unrelated input by staying in the same state.",
  //         condition: {
  //           type: "text_contains",
  //           value: [""], // Handle empty or unclear input
  //         },
  //       },
  //     ],
  //     tools: [],
  //   },
  //   {
  //     name: "dissatisfaction_handling",
  //     state_prompt: `
  //       Say: "I'm sorry you're not satisfied. Would you like to speak to a human agent? Please say yes or no."
  //       If the user says "yes" or similar (e.g., "yeah", "okay", "sure"), transfer the call to the business's official number.
  //       If the user says "no" or is unclear, end the call with: "Okay, thank you for calling. Goodbye."
  //     `,
  //     edges: [
  //       {
  //         destination_state_name: "end_call_state",
  //         description: "End the call if user declines transfer.",
  //         condition: {
  //           type: "text_contains",
  //           value: ["no", "nope", "not really"],
  //         },
  //       },
  //     ],
  //     tools: [
  //       {
  //         type: "transfer_call",
  //         name: "transfer_to_business",
  //         description: "Transfer the call to the business’s official number.",
  //         pre_transfer_message: "I’m sorry you’re not satisfied. I’ll now connect you to our team.",
  //         transfer_destination: {
  //           type: "predefined",
  //           number: businessPhone,
  //         },
  //         condition: {
  //           type: "text_contains",
  //           value: ["yes", "yeah", "okay", "sure"],
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     name: "appointment_booking",
  //     state_prompt: `
  //       Assist the user in booking an appointment. Ask for details like date, time, and service type.
  //       If the user provides sufficient information, confirm the appointment.
  //       If the user is unclear, say: "Could you please provide more details about your appointment request?"
  //     `,
  //     edges: [],
  //     tools: [],
  //   },
  //   {
  //     name: "end_call_state",
  //     state_prompt: `
  //       Say: "Okay, thank you for calling. Goodbye." and end the call.
  //     `,
  //     tools: [
  //       {
  //         type: "end_call",
  //         name: "end_call",
  //         description: "End the call with user.",
  //       },
  //     ],
  //     edges: [],
  //   },
  // ],
  //       begin_message: `Hi I am ${agentName?.split(" ")[0]}, calling from ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}. How may i help you`,
  //     };

//   const agentConfig = {
//   version: 0,
//   model: "gemini-2.0-flash",
//   model_temperature: 0,
//   model_high_priority: true,
//   tool_call_strict_mode: true,
//   general_prompt: filledPrompt,
//   general_tools: [
//     {
//       type: "transfer_call",
//       name: `dissatisfaction_handling`,
//       transfer_destination: {
//         type: "inferred",
//         prompt: `Say: "I'm sorry you're not satisfied. Would you like to speak to a human agent? Please say yes or no."
//             If the user says "yes", transfer the call to the {{business_Phone}}.
//             If the user says "no", use end_call_state tool to end the call with: "Okay, thank you for calling`,
//       },
//       transfer_option: {
//         type: "cold_transfer",
//         public_handoff_option: {
//           message: "Please hold while I transfer your call to the requested department.",
//         },
//       },
//       speak_during_execution: true,
//       speak_after_execution: true,
//     failure_message: "I'm sorry, I'm unable to connect you at the moment. Please contact us at {{business_email}} or call {{business_Phone}} directly.",
//     },
//     // {
//     //   type: "end_call",
//     //   name: "end_call",
//     //   description: "End the call with user.",
//     // },
//   ],
//   states: [
//     {
//       name: "information_collection",
//       state_prompt: `
//         You are ${agentName?.split(" ")[0]}, a virtual assistant for ${
//         getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}.
//         Greet the user with the begin_message and assist with their query.
//         Only If the user expresses dissatisfaction (e.g., "not satisfied", "unhappy", "waste of time","looks angry"), and have negative sentiments,use the dissatisfaction_handling tool to transfer to the {{business_Phone}}.
//         If the user asks for an appointment (e.g., "appointment", "book", "schedule"), transition to appointment_booking.
//         If the user is silent or unclear, say in the current language: "I'm sorry, I didn't catch that. Could you please repeat?"
//       `,
//       edges: [
//         {
//           destination_state_name: "appointment_booking",
//           description: "Transition to book an appointment.",
//           condition: {
//             type: "text_contains",
//             value: ["appointment", "book", "schedule", "prenotazione", "appuntamento"],
//           },
//         },
//         {
//           destination_state_name: "information_collection",
//           description: "Handle unclear or unrelated input by staying in the same state.",
//           condition: {
//             type: "text_contains",
//             value: [""],
//           },
//         },
//       ],
//       tools: [],
//     },
//        {
//       name: "appointment_booking",
//       state_prompt: `
//         Assist the user in booking an appointment. Ask for details like date, time, and service type.
//         If the user provides sufficient information, confirm the appointment.
//         If the user is unclear, say: "Could you please provide more details about your appointment request?"
//       `,
//       edges: [],
//       tools: [],
//     },
//     {
//       name: "end_call_state",
//       state_prompt: `
//         if user ask to End the then greet then end the call.
//       `,
//       tools: [
//         {
//           type: "end_call",
//           name: "end_call",
//           description: "End the call with user.",
//         },
//       ],
//       edges: [],
//     },
//   ],
//   starting_state: "information_collection",
//   begin_message: `Hi I am ${agentName?.split(" ")[0]}, calling from ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}. How may i help you`,
//   default_dynamic_variables: {
//     customer_name: "John Doe",
//     timeZone: "Asia/Kolkata",
//     sales_number: "", // Will be set by CallTransfer
//     billing_number: "",
//     business_Phone: businessPhone, // Default for dissatisfaction
//     business_email:business.email
//   },
//   knowledge_base_ids: ["knowledge_base_4c8aed88c4ad5a67"],
// };

//working 1
//   const agentConfig = {
//   version: 0,
//   model: "gemini-2.0-flash",
//   model_temperature: 0,
//   model_high_priority: true,
//   tool_call_strict_mode: true,
//   general_prompt: filledPrompt,
//   general_tools: [
//     {
//       type: "transfer_call",
//       name: `dissatisfaction_handling`,
//       transfer_destination: {
//         type: "inferred",
//         prompt:`Say: "I'm sorry you're not satisfied. Would you like to speak to a team member? Please say yes or no."
//             If the user says "yes", transfer the call to the {{business_Phone}}.
//             If the user says "no", use the end_call tool to end the call with: "Thank you for calling. Have a great day!"`,
//       },
//       transfer_option: {
//         type: "cold_transfer",
//         public_handoff_option: {
//           message: "Please hold while I transfer your call to the requested department.",
//         },
//       },
//       speak_during_execution: true,
//       speak_after_execution: true,
//     failure_message: "I'm sorry, I'm unable to connect you at the moment. Please contact us at {{business_email}} or call {{business_Phone}} directly.",
//     },
//     // {
//     //   type: "end_call",
//     //   name: "end_call",
//     //   description: "End the call with user.",
//     // },
//   ],
//   states: [
//     {
//       name: "information_collection",
//       state_prompt:  `
//         You are ${agentName?.split(" ")[0]}, a virtual assistant for ${
//         getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}.
//         Greet the user with the begin_message and assist with their query.
//         If the user expresses dissatisfaction through tone (e.g., angry, frustrated) or specific words (e.g., "not satisfied", "unhappy", "disappointed", "waste of time", "terrible", "awful", "bad service"), say: "I'm sorry to hear that. Could you please tell me about your concern?"
//         If the concern is related to service (e.g., "poor service", "bad experience", "staff issue", "service problem"), use the dissatisfaction_handling tool to suggest connecting to a team member.
//         If the concern is unrelated to service or unclear, say: "Thank you for sharing. Would you like to discuss this further with a team member? Please say yes or no."
//         If the user asks for an appointment (e.g., "appointment", "book", "schedule"), transition to appointment_booking.
//         If the user is silent or unclear, say in the current language: "I'm sorry, I didn't catch that. Could you please repeat?"`,
//       edges: [
//         {
//           destination_state_name: "appointment_booking",
//           description: "Transition to book an appointment.",
//           condition: {
//             type: "text_contains",
//             value: ["appointment", "book", "schedule", "prenotazione", "appuntamento"],
//           },
//         },
//         {
//           destination_state_name: "information_collection",
//           description: "Handle unclear or unrelated input by staying in the same state.",
//           condition: {
//             type: "text_contains",
//             value: [""],
//           },
//         },
//       ],
//       tools: [],
//     },
//        {
//       name: "appointment_booking",
//       state_prompt: `
//         Assist the user in booking an appointment. Ask for details like date, time, and service type.
//         If the user provides sufficient information, confirm the appointment.
//         If the user is unclear, say: "Could you please provide more details about your appointment request?"
//       `,
//       edges: [],
//       tools: [],
//     },
//     {
//       name: "end_call_state",
//       state_prompt: `
//         if user ask to End the then greet then end the call.
//       `,
//       tools: [
//         {
//           type: "end_call",
//           name: "end_call",
//           description: "End the call with user.",
//         },
//       ],
//       edges: [],
//     },
//   ],
//   starting_state: "information_collection",
//   begin_message: `Hi I am ${agentName?.split(" ")[0]}, calling from ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}. How may i help you`,
//   default_dynamic_variables: {
//     customer_name: "John Doe",
//     timeZone: "Asia/Kolkata",
//     sales_number: "", // Will be set by CallTransfer
//     billing_number: "",
//     business_Phone: businessPhone, // Default for dissatisfaction
//     business_email:business.email
//   },
// };

// working2 
const agentConfig = {
  version: 0,
  model: "gemini-2.0-flash",
  model_temperature: 0,
  model_high_priority: true,
  tool_call_strict_mode: true,
  general_prompt: filledPrompt,
  general_tools: [],
  states: [
    // 🌟 State: Information Collection
    {
      name: "information_collection",
      state_prompt: `
        You are ${agentName?.split(" ")[0]}, a virtual assistant for ${
        getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}.
        Greet the user with the begin_message and assist with their query.

        If the user sounds dissatisfied (angry, frustrated, upset) or uses negative words (like "bad service", "unhappy", "terrible"), 
        transition to dissatisfaction_confirmation.

        If the user asks for an appointment (e.g., "appointment", "book", "schedule"),
        transition to appointment_booking.

        If the user is silent or unclear, say: "Sorry, I didn’t catch that. Could you please repeat?"
      `,
      edges: [
        {
          destination_state_name: "appointment_booking",
          description: "User wants to book an appointment."
        },
        {
          destination_state_name: "dissatisfaction_confirmation",
          description: "User sounds angry or expresses dissatisfaction."
        }
      ],
      tools: []
    },

    // 🌟 State: Dissatisfaction Confirmation
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

    // 🌟 State: Call Transfer
    {
      name: "call_transfer",
      state_prompt: `
        Connecting you to a team member now. Please hold.
      `,
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

    // 🌟 State: Appointment Booking
    {
      name: "appointment_booking",
      state_prompt: `
        Help the user book an appointment by asking date, time, and service details.
        Confirm once all details are provided.
      `,
      edges: [],
      tools: []
    },

    // 🌟 State: End Call
    {
      name: "end_call_state",
      state_prompt: `
        Politely end the call by saying: "Thank you for calling. Have a great day!"
      `,
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
    business_email: business.email
  }
};
// working 3 but undefined if departnment other
// const agentConfig = {
//   version: 0,
//   model: "gemini-2.0-flash",
//   model_temperature: 0,
//   model_high_priority: true,
//   tool_call_strict_mode: true,
//   general_prompt: filledPrompt,
//   general_tools: [],
//   states: [
//     // 🌟 State: Information Collection
//     {
//       name: "information_collection",
//       state_prompt: `
//         You are ${agentName?.split(" ")[0]}, a virtual assistant for ${
//         getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}.
//         Greet the user with the begin_message and assist with their query.

//         If the user sounds dissatisfied (angry, frustrated, upset) or uses negative words 
//         (like "bad service", "unhappy", "terrible", "poor experience"), 
//         transition to dissatisfaction_confirmation.

//         If the user asks for an appointment (e.g., "appointment", "book", "schedule"),
//         transition to appointment_booking.

//         If the user is silent or unclear, say: "Sorry, I didn’t catch that. Could you please repeat?"
//       `,
//       edges: [
//         {
//           destination_state_name: "appointment_booking",
//           description: "User wants to book an appointment."
//         },
//         {
//           destination_state_name: "dissatisfaction_confirmation",
//           description: "User sounds angry or expresses dissatisfaction."
//         }
//       ],
//       tools: []
//     },

//     // 🌟 State: Dissatisfaction Confirmation
//     {
//       name: "dissatisfaction_confirmation",
//       state_prompt: `
//         Say: "I'm sorry to hear that. Could you please tell me about your concern?"

//         Wait for user's response and analyze:
//         - If the concern is **service-related** (e.g., staff issue, poor service, delay),
//           ask: "Would you like me to connect you to a team member? Please say yes or no."

//         - If the concern is unrelated to service (e.g., general query, spam, request for info),
//           handle it yourself and do NOT suggest transfer.

//         If the user says yes to transfer, transition to call_transfer.
//         If the user says no, transition to end_call_state.
//         If response is unclear, repeat the question once politely.
//       `,
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
//         Before transferring, check if {{business_Phone}} is available.
//         - If available: Say "Connecting you to a team member now. Please hold."
//         - If not available: Say "I’m sorry, I don’t have a number to connect you right now. Can I assist you with something else?"
//       `,
//       tools: [
//         {
//           type: "transfer_call",
//           name: "transfer_to_team",
//           description: "Transfer the call to the team member if business_Phone exists.",
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
//         Help the user book an appointment by asking for details like date, time, and service type.
//         Confirm once all details are provided.
//       `,
//       edges: [],
//       tools: []
//     },

//     // 🌟 State: End Call
//     {
//       name: "end_call_state",
//       state_prompt: `
//         Politely end the call by saying: "Thank you for calling. Have a great day!"
//       `,
//       tools: [
//         {
//           type: "end_call",
//           name: "end_call",
//           description: "End the call with the user."
//         }
//       ],
//       edges: []
//     }
//   ],
//   starting_state: "information_collection",
//   begin_message: `Hi I am ${agentName?.split(" ")[0]}, calling from ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}. How may I help you?`,
//   default_dynamic_variables: {
//     customer_name: "John Doe",
//     timeZone: "Asia/Kolkata",
//     business_Phone: businessPhone,
//     business_email: business.email
//   }
// };



      if(isValid=='BusinessListing'){
        agentConfig.knowledge_base_ids = [storedKnowledgeBaseId] ;
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
     
        // setLoading(false)
        // console.log(localStorage.getItem("agent_id") ,localStorage.getItem("bussinesId"))
        // window.history.pushState(null, "", "/agent-detail");
        // setTimeout(() =>
        //   navigate("/edit-agent", {
        //     state: {
        //       agentId: sessionStorage.getItem("agent_id") || localStorage.getItem("agentId"),
        //       bussinesId: sessionStorage.getItem("bId") || localStorage.getItem("bussinesId"),
        //     },
        //   }), 1000);

                  //agent updation 
                if (isValid == 'EditBusinessType' || isValid == 'EditServicesOffered' || isValid == 'EditLanguage' || isValid == 'EditGender' || isValid=='EditNameAvtar') {
                  const finalAgentData = {
                        voice_id: sessionStorage.getItem("agentVoice") || "11labs-Adrian",
                        language: sessionStorage.getItem("agentLanguageCode") || "en-US",
                        agent_name: dynamicAgentName || sessionStorage.getItem("agentName"),
                        language: "multi",
                        post_call_analysis_model: "gpt-4o-mini",
                        responsiveness: 1,
                        enable_backchannel: true,
                        interruption_sensitivity:  0.91,
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
          EditNameAvtar:"Name & Avtar",
          EditLanguage :"Agent Language",
          EditGender:"Agent Gender / Voice ",
          EditBusinessDetail:"Business Detail"
        };
        // console.log('isValidjsdjajdja',isValid)
        setPopupMessage(`${screenLabels[isValid]} Updated Succesfully`);
        setShowPopup(true);
        setTimeout(()=>{
          navigate('/edit-agent', { replace: true })
        },1000)
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