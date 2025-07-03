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
    const businessServices = business?.selectedService || [];
    const customServices = cleanedCustomServices?.map(item =>

      typeof item === 'string' ? item : item?.service) || [];

    const businessServiceNames = businessServices?.map(item => item);
    const allServices = [...customServices, ...businessServiceNames];

    const commaSeparatedServices = allServices?.join(", ")?.replace("Other", "")

    const dynamicAgentName = `${sanitize(businessType)}_${sanitize(getBusinessNameFromGoogleListing?.businessName ||getBusinessNameFormCustom)}_${sanitize(role_title)}_${packageValue}#${agentCount}`

    const CustomservicesArray = cleanedCustomServices?.map(item => item.service) || [];

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
          console.log('updation response', response)
        } catch (error) {
          console.log('error while buinsess details updated');
          // setLoading(false)
          return
        }
      }

      const storedKnowledgeBaseId = sessionStorage.getItem('knowledgeBaseId');
      const llm_id = localStorage.getItem('llmId') || sessionStorage.getItem('llmId');
      const agentConfig = {
        general_prompt: filledPrompt,
        begin_message: `Hi I am ${agentName?.split(" ")[0]}, calling from ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}. How may i help you`,
      };
      if(isValid=='BusinessListing'){
        agentConfig.knowledge_base_ids = [storedKnowledgeBaseId] ;
      }
      //Create LLm 
      console.log(llm_id)
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
        console.log('llmResponseupdate', llmResponse)
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
                        console.log('agent response',response)
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
        };
        setPopupMessage(`${screenLabels[isValid]} Updated Succesfully`);
        setShowPopup(true);

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