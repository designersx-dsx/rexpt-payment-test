import { useCallback, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL, listAgents, updateAgent } from "../Store/apiStore";
import decodeToken from "../lib/decodeToken";
import { getAgentPrompt, useAgentPrompt } from "./useAgentPrompt";
import getTimezoneFromState from "../lib/timeZone";
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
  const sessionBusinessiD = sessionStorage.getItem("bId");
  const state = sessionStorage.getItem("state")
  console.log(state,"state")
  const decodeTokenData = decodeToken(token);
  const [userId, setUserId] = useState(decodeTokenData?.id || "");
  const isUpdating = localStorage.getItem("UpdationMode") == "ON";
  // const sessionBusinessiD=JSON.parse(sessionStorage.getItem("businessId"))
  // const businessId = sessionBusinessiD|| sessionBusinessiD?.businessId ;
  const [agentCount, setAgentCount] = useState(0);

  const fetchAgentCountFromUser = async () => {
    try {
      const response = await listAgents();
      const filterAgents = await response.filter(
        (res) => res.userId === userId
      );
      setAgentCount(filterAgents.length);
    } catch (error) {
      console.log(error);
    }
  };

  const removeSpaces = (phone) => {
    if (!phone) return null;
    return phone.replace(/\s+/g, "");
  };

  useEffect(() => {
    fetchAgentCountFromUser();
  }, []);
  ///extractPromptVariables
  function extractPromptVariables(template) {
    const matches = [...template.matchAll(/{{(.*?)}}/g)];
    const uniqueVars = new Set(matches.map((m) => m[1].trim()));

    return Array.from(uniqueVars).map((variable) => ({
      name: variable,
      status: true,
    }));
  }

  const handleCreateAgent = useCallback(async () => {
 
    const isValid = stepValidator();
    if (!isValid) return;
    console.log("Creating agent...", isValid);

    const packageMap = {
      Free: 1,
      Starter: 2,
      Scaler: 3,
      Growth: 4,
      Corporate: 5,
      Enterprise: 6,
    };

    const Buisness = JSON.parse(sessionStorage.getItem("businessDetails"));
    const businessType =
      Buisness?.businessType === "Other"
        ? Buisness?.customBuisness
        : Buisness?.businessType;
    const role_title =
      sessionStorage.getItem("agentRole") || "General Receptionist";
    const business =
      JSON.parse(sessionStorage.getItem("businessDetails")) ||
      "Your Business Name";
    const getBusinessNameFormCustom = sessionStorage.getItem(
      "displayBusinessName"
    );
    const getBusinessNameFromGoogleListing = JSON.parse(
      sessionStorage.getItem("placeDetailsExtract")
    );
    const agentNote = sessionStorage.getItem("agentNote") || "";
    const rawCustomServices =
      JSON.parse(sessionStorage.getItem("selectedCustomServices")) || [];
    const cleanedCustomServices = rawCustomServices
      .map((item) => item?.service?.trim())
      .filter(Boolean)
      .map((service) => ({ service }));
    const SelectedServices =
      JSON.parse(sessionStorage.getItem("businesServices")) ||
      "Your Business Name";
    const BusinessLocation =
      JSON.parse(sessionStorage.getItem("businessLocation")) ||
      "Your Business Services";
    const aboutBusinessForm =
      JSON.parse(sessionStorage.getItem("aboutBusinessForm")) ||
      "Your Business Services";
    const CallRecording = sessionStorage.getItem("callRecording") === "true";

    const agentGender = sessionStorage.getItem("agentGender");
    const languageSelect = sessionStorage?.getItem("agentLanguage");
    const plan = sessionStorage.getItem("plan");
    const languageAccToPlan = ["Scaler", "Growth", "Corporate"].includes(plan)
      ? "multi"
      : sessionStorage.getItem("agentLanguageCode");
    const agentName = sessionStorage.getItem("agentName") || "";
    const packageName = sessionStorage.getItem("package") || "Free";
    const sanitize = (str) =>
      String(str || "")
        .trim()
        .replace(/\s+/g, "_");
    const packageValue = packageMap[packageName] || 1;
    const businessServices = SelectedServices?.selectedService || [];
    const customServices =
      cleanedCustomServices?.map((item) =>
        typeof item === "string" ? item : item?.service
      ) || [];

    const businessServiceNames = businessServices?.map((item) => item);
    const allServices = [...customServices, ...businessServices];

    const commaSeparatedServices = allServices;
    console.log(allServices);

    const dynamicAgentName = `${sanitize(businessType)}_${sanitize(
      getBusinessNameFromGoogleListing?.businessName ||
      getBusinessNameFormCustom
    )}_${sanitize(role_title)}_${packageValue}#${agentCount}`;

    const CustomservicesArray =
      cleanedCustomServices?.map((item) => item.service) || [];
    const businessPhone = removeSpaces(getBusinessNameFromGoogleListing?.phone);
    const timeZone = await getTimezoneFromState(getBusinessNameFromGoogleListing?.state);
    const rawPromptTemplate = getAgentPrompt({
      industryKey:
        business?.businessType == "Other"
          ? business?.customBuisness
          : business?.businessType,
      roleTitle: sessionStorage.getItem("agentRole"),
      agentName: "{{AGENT NAME}}",
      agentGender: "{{MALE or FEMALE}}",
      business: {
        businessName: "{{BUSINESS NAME}}",
        email: "{{BUSINESS EMAIL ID}}",
        aboutBusiness: "{{MORE ABOUT YOUR BUSINESS}}",
        address: "{{ CITY}},{{ STATE}}, {{COUNTRY}}",
      },
      languageSelect: "{{LANGUAGE}}",
      businessType: "{{BUSINESSTYPE}}",
      aboutBusinessForm: "{{}}",
      commaSeparatedServices: "{{SERVICES}}",
      agentNote: "{{AGENTNOTE}}",
      timeZone: "{{TIMEZONE}}",
    });

    const filledPrompt = getAgentPrompt({
      industryKey: business?.businessType,
      roleTitle: role_title,
      agentName: agentName,
      agentGender: agentGender,
      business: {
        businessName:
          getBusinessNameFromGoogleListing?.businessName ||
          getBusinessNameFormCustom,
        email: getBusinessNameFromGoogleListing?.email || "",
        aboutBusiness:
          getBusinessNameFromGoogleListing?.aboutBusiness ||
          getBusinessNameFromGoogleListing?.aboutBussiness,
        address: getBusinessNameFromGoogleListing?.address || "",
      },
      languageSelect: languageSelect,
      businessType,
      aboutBusinessForm,
      commaSeparatedServices,
      agentNote,
      timeZone: timeZone?.timezoneId,
      languageAccToPlan,
      plan,
      CallRecording,
    });

    const getLeadTypeChoices = () => {
      const fixedChoices = [
        "Spam Caller",
        "Irrelvant Call",
        "Angry Old Customer",
      ];
      const allServices = [...customServices, ...businessServiceNames];
      const cleanedServices = allServices
        .map((service) => service?.trim())
        .filter((service) => service && service?.toLowerCase() !== "other")
        .map((service) => {
          const normalized = service?.replace(/\s+/g, " ")?.trim();
          return `Customer for ${normalized}`;
        });
      const combinedChoices = Array.from(
        new Set([...fixedChoices, ...cleanedServices])
      );
      return combinedChoices;
    };

    //updation here
    if (isValid && localStorage.getItem("UpdationMode") == "ON") {
      setLoading(true);
      if (
        isValid == "EditBusinessType" ||
        isValid == "EditServicesOffered" ||
        isValid == "BusinessLocation"
      ) {
        const businessDetails = JSON.parse(
          sessionStorage.getItem("businessDetails")
        );
        const locationData = JSON.parse(
          sessionStorage.getItem("businessLocation")
        );
        const buisenessServices = JSON.parse(
          sessionStorage.getItem("businesServices")
        );
        const rawCustomServices =
          JSON.parse(sessionStorage.getItem("selectedCustomServices")) || [];
        const cleanedCustomServices = rawCustomServices
          .map((item) => item?.service?.trim())
          .filter(Boolean)
          .map((service) => ({ service }));
         
        try {
          const response = await axios.patch(
            `${API_BASE_URL}/businessDetails/updateBusinessDetailsByUserIDandBuisnessID/${userId}?businessId=${sessionBusinessiD}`,
            {
              businessName:
                getBusinessNameFromGoogleListing?.businessName ||
                getBusinessNameFormCustom,
              businessSize: businessDetails.businessSize,
              businessType: businessDetails.businessType,
              buisnessEmail: buisenessServices?.email,
              buisnessService: buisenessServices?.selectedService,
              customBuisness: businessDetails?.customBuisness || "",
              customServices: cleanedCustomServices,
            }
          );
       
          if (sessionStorage.getItem("prevBuisnessType")) {
            sessionStorage.removeItem("prevBuisnessType");
          }
          // console.log('updation response', response)
        } catch (error) {
          console.log("error while buinsess details updated");
          // setLoading(false)
          return;
        }
      }

      const storedKnowledgeBaseId = sessionStorage.getItem("knowledgeBaseId");
      const llm_id =
        localStorage.getItem("llmId") || sessionStorage.getItem("llmId");
    
      const agentConfig = {
        version: 0,
        model: "gemini-2.0-flash",
        model_temperature: 0,
        model_high_priority: true,
        tool_call_strict_mode: true,
        general_prompt: filledPrompt,
        starting_state: "information_collection",
        default_dynamic_variables: {
          customer_name: "John Doe",
          timeZone: timeZone?.timezoneId          ,
          business_Phone: businessPhone,
          business_email: business.email,
          email: "",
        },
      };
      console.log(agentConfig, "agentConfigagentConfig")
      if (isValid == "BusinessListing") {
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
        if (
          isValid == "EditBusinessType" ||
          isValid == "EditServicesOffered" ||
          isValid == "EditLanguage" ||
          isValid == "EditGender" ||
          isValid == "EditNameAvtar"
        ) {
          const finalAgentData = {
            voice_id: sessionStorage.getItem("agentVoice") || "11labs-Adrian",
            language: sessionStorage.getItem("agentLanguageCode") || "en-US",
            agent_name: dynamicAgentName || sessionStorage.getItem("agentName"),
            language: languageAccToPlan,
            post_call_analysis_model: "gpt-4o-mini",
            responsiveness: 1,
            enable_backchannel: true,
            interruption_sensitivity: 0.91,
            backchannel_frequency: 0.7,
            backchannel_words: [
              "Got it",
              "Yeah",
              "Uh-huh",
              "Understand",
              "Ok",
              "hmmm",
            ],
            post_call_analysis_data: [
              {
                type: "enum",
                name: "lead_type",
                description: "Feedback given by the customer about the call.",
                choices: getLeadTypeChoices(),
              },
              {
                type: "string",
                name: "name",
                description: "Extract the user's name from the conversation",
                examples: [
                  "Ajay Sood",
                  "John Wick",
                  "Adam Zampa",
                  "Jane Doe",
                  "Nitish Kumar",
                  "Ravi Shukla",
                ],
              },
              {
                type: "string",
                name: "email",
                description: "Extract the user's email from the conversation",
                examples: [
                  "john.doe@example.com",
                  "nitish@company.in",
                  "12@gmail.com",
                ],
              },
              {
                type: "string",
                name: "reason",
                description:
                  "The reason the user is calling or their inquiry. If provided in Hindi, translate to English. Summarize if it's long.",
                examples: [
                  "Schedule an appointment",
                  "Ask about services",
                  "Request for accounting help",
                ],
              },
              {
                type: "string",
                name: "address",
                description:
                  "The user's address or business location. If spoken in Hindi, translate to English. Format it for use in CRM or contact forms.",
                examples: [
                  "123 Main St, Delhi",
                  "42 Wallaby Way, Sydney",
                  "1490 Aandhar Eleven",
                ],
              },
              {
                type: "number",
                name: "phone_number",
                description:
                  "The user's phone number in numeric format. If digits are spoken in words (e.g., 'seven eight seven six one two'), convert them to digits (e.g., '787612'). Ensure it's a valid number when possible.",
              },
            ],
            webhook_url: `${API_BASE_URL}/agent/updateAgentCall_And_Mins_WebHook`,

            // webhook_url: `  https://18a4251b9d16.ngrok-free.app/api/agent/updateAgentCall_And_Mins_WebHook`,
            // webhook_url: `https://191f6af2ef0d.ngrok-free.app/api/agent/updateAgentCall_And_Mins_WebHook`,

            normalize_for_speech: true,
          };
          const agent_id =
            sessionStorage.getItem("agent_id") ||
            localStorage.getItem("agentId");
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
            const promptVariablesList =
              extractPromptVariables(rawPromptTemplate);
            // Now access the actual ID
            const agentData = {
              userId: userId,
              agent_id: agentId || sessionStorage.getItem("agentId"),
              knowledgeBaseId: sessionStorage.getItem("knowledgeBaseId"),
              llmId: sessionStorage.getItem("llmId"),
              avatar: sessionStorage.getItem("avatar") || "",
              agentVoice:
                sessionStorage.getItem("agentVoice") || "11labs-Adrian",
              agentAccent:
                sessionStorage.getItem("agentVoiceAccent") || "American",
              agentRole:
                sessionStorage.getItem("agentRole") || "Genral Receptionist",
              agentName: sessionStorage.getItem("agentName") || "",
              agentLanguageCode:
                sessionStorage.getItem("agentLanguageCode") || "en-US",
              agentLanguage:
                sessionStorage.getItem("agentLanguage") || "English (US)",
              agentGender: sessionStorage.getItem("agentGender") || "female",
              agentStatus: true,
              dynamicPromptTemplate: filledPrompt,
              rawPromptTemplate: rawPromptTemplate,
              promptVariablesList: JSON.stringify(promptVariablesList),
            };
            //update agent in DB
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
                setLoading(false);
              } else {
                console.error("Agent Updation failed:", error);
                setPopupType("failed");
                setPopupMessage(
                  "Agent Updation failed while saving data in Database. Please try again."
                );
                setShowPopup(true);
                setLoading(false);
              }
            }
          } catch (err) {
            console.error("Agent Updation failed:", err);
            setPopupType("failed");
            setPopupMessage("Agent Updation failed.");
            setShowPopup(true);
            setLoading(false);
          }
        }

        setPopupType("success");
        const screenLabels = {
          EditBusinessType: "Business Type",
          EditServicesOffered: "Services Offered",
          EditNameAvtar: "Name & Avtar",
          EditLanguage: "Agent Language",
          EditGender: "Agent Gender / Voice ",
          EditBusinessDetail: "Business Detail",
        };
        // console.log('isValidjsdjajdja',isValid)
        setPopupMessage(`${screenLabels[isValid]} Updated Succesfully`);
        setShowPopup(true);
        if (sessionStorage.getItem("naviateFrom") == "callRecording") {
        } else {
          setTimeout(() => {
            navigate("/edit-agent", { replace: true });
          }, 1500);
        }

        setHasFetched(false);
      } catch (error) {
        console.error("LLM updation failed:", error);
        setPopupType("failed");
        setPopupMessage("LLM updation failed. Please try again.");
        setShowPopup(true);
      } finally {
        setLoading(false);
      }

      setLoading(false);
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
    let raw;
    if (localStorage.getItem("UpdationMode") != "ON") {
      raw = sessionStorage.getItem("businessDetails");
    } else {
      raw = raw = sessionStorage.getItem("businessDetails");
    }
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.selectedService)) {
      return parsed.selectedService;
    } else if (
      typeof parsed?.selectedService === "object" &&
      Array.isArray(parsed.selectedService.selectedService)
    ) {
      return parsed.selectedService.selectedService;
    }
    return [];
  } catch {
    return [];
  }
};
