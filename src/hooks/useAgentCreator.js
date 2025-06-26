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
    const prompt = `You are an AI Receptionist ${agentName}, working as a ${role_title} for ${business?.businessName}.
Your main goal is to professionally greet, assist, and guide callers or visitors. Use a helpful, polite, and clear tone. Tailor your conversation based on your role and the context.
Here is your profile:
- Role:  ${role_title}
- Role Description: ${role_title}
- Business Name:  ${business?.businessName}
- Business Services:  ${businessType}
- Business Location: ${BusinessLocation?.country}}
-Additional Instructions: ${aboutBusinessForm.note}
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
`;
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



    console.log('prompt1',filledPrompt)
    return


    //updation here
    if (isValid && localStorage.getItem("UpdationMode") == "ON") {
      setLoading(true)
      if (isValid == 'BusinessDetails' || isValid == 'businesServices' || isValid == 'BusinessLocation') {

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
          console.log('updation response', response)
        } catch (error) {
          console.log('error while buinsess details updated');
          setLoading(false)
          return
        }
      }

      const storedKnowledgeBaseId = sessionStorage.getItem('knowledgeBaseId');
      const llm_id = localStorage.getItem('llmId') || sessionStorage.getItem('llmId');
      const agentConfig = {
        general_prompt: filledPrompt,
        begin_message: `Hey I am a virtual assistant ${agentName}, calling from ${ getBusinessNameFromGoogleListing?.businessName ||getBusinessNameFormCustom}.`,
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
        setPopupType("success");

        setPopupMessage(`${isValid} Updated Succesfully`);
        setShowPopup(true);
        setLoading(false)
        // console.log(localStorage.getItem("agent_id") ,localStorage.getItem("bussinesId"))
        window.history.pushState(null, "", "/agent-detail");
        setTimeout(() =>
          navigate("/agent-detail", {
            state: {
              agentId: sessionStorage.getItem("agent_id") || localStorage.getItem("agentId"),
              bussinesId: sessionStorage.getItem("bId") || localStorage.getItem("bussinesId"),
            },
          }), 1000);
      }
      catch (error) {
        console.error("Business Details failed:", error);
        setPopupType("failed");
        setPopupMessage("LLM updation failed. Please try again.");
        setShowPopup(true);
        setLoading(false)
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