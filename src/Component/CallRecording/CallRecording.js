import React, { useEffect, useState } from "react";
import HeaderBar from "../HeaderBar/HeaderBar";
import styles from "./CallRecording.module.css";
import {
  API_BASE_URL,
  getUserAgentMergedDataForAgentUpdate,
  updateAgent,
} from "../../Store/apiStore";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";
import { useAgentCreator } from "../../hooks/useAgentCreator";
import { useDashboardStore } from "../../Store/agentZustandStore";

const CallRecording = ({ agentId, businessId }) => {
  const [callRecording, setCallRecording] = useState(true);
  const [loading, setLoading] = useState(false);
  const [Id, setAgentId] = useState(null);
  const [openDisclaimer, setOpenDisclaimer] = useState(false);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // const { agentId, businessId } = location.state || {};
  const [editAgentId, setEditAgentID] = useState(
    sessionStorage.getItem("SelectAgentId") || null
  );
  const [editBusinessId, setBusinessId] = useState(
    sessionStorage.getItem("SelectAgentBusinessId") || null
  );
  const [agentName, setAgentName] = useState(
    sessionStorage.getItem("agentName") || ""
  );
  const agentnm = sessionStorage.getItem("agentName");
  const [popupType, setPopupType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const { setHasFetched } = useDashboardStore();
  // console.log('agentnm',agentnm,agentId, businessId)

  useEffect(() => {
    setAgentName(agentnm);
  }, [agentnm]);
  const fetchPrevAgentDEtails = async (agent_id, businessId) => {
    try {
      const response = await getUserAgentMergedDataForAgentUpdate(
        agent_id,
        businessId
      );
      // console.log('response',response.data)
      const agent = response?.data?.agent;
      const business = response?.data?.business;
      sessionStorage.setItem("UpdationModeStepWise", "ON");
      sessionStorage.setItem("agentName", agent.agentName);
      sessionStorage.setItem("agentGender", agent.agentGender);
      sessionStorage.setItem("agentLanguageCode", agent.agentLanguageCode);
      sessionStorage.setItem("agentLanguage", agent.agentLanguage);
      sessionStorage.setItem("llmId", agent.llmId);
      sessionStorage.setItem("agent_id", agent.agent_id);
      sessionStorage.setItem("knowledgeBaseId", agent.knowledgeBaseId);
      sessionStorage.setItem("agentCode", agent?.agentCode);

      //need to clear later
      localStorage.setItem("UpdationMode", "ON");
      localStorage.setItem("UpdationModeStepWise", "ON");
      localStorage.setItem("agentName", agent.agentName);
      localStorage.setItem("agentGender", agent.agentGender);
      localStorage.setItem("agentLanguageCode", agent.agentLanguageCode);
      localStorage.setItem("agentLanguage", agent.agentLanguage);
      localStorage.setItem("llmId", agent.llmId);
      localStorage.setItem("agent_id", agent.agent_id);
      localStorage.setItem("knowledgeBaseId", agent.knowledgeBaseId);
      localStorage.setItem("agentRole", agent.agentRole);
      localStorage.setItem("agentVoice", agent.agentVoice);
      localStorage.setItem("agentVoiceAccent", agent.agentAccent);
      localStorage.setItem("avatar", agent.avatar);
      sessionStorage.setItem("googleListing", business.googleUrl);
      sessionStorage.getItem("displayBusinessName");
      localStorage.setItem("googleUrl", business.googleUrl);
      localStorage.setItem("webUrl", business.webUrl);
      localStorage.setItem("aboutBusiness", business.aboutBusiness);
      localStorage.setItem(
        "additionalInstruction",
        business.additionalInstruction
      );
      localStorage.setItem("knowledge_base_name", business.knowledge_base_name);
      localStorage.setItem("knowledge_base_id", business.knowledge_base_id);
      //need to clear above

      sessionStorage.setItem(
        "aboutBusinessForm",
        JSON.stringify({
          businessUrl: business.webUrl,
          googleListing: business.googleUrl,
          aboutBusiness: business.aboutBusiness,
          note: business.additionalInstruction,
          isGoogleListing: business.isGoogleListing,
          isWebsiteUrl: business.isWebsiteUrl,
        })
      );

      sessionStorage.setItem("agentRole", agent.agentRole);
      sessionStorage.setItem("agentVoice", agent.agentVoice);
      sessionStorage.setItem("agentVoiceAccent", agent.agentAccent);
      sessionStorage.setItem("avatar", agent.avatar);
      sessionStorage.setItem("businessDetails", agent.business);
      sessionStorage.setItem("businessId", agent.businessId);
      sessionStorage.setItem("bId", agent.businessId);
      sessionStorage.setItem(
        "displayBusinessName",
        business.googleBusinessName
      );

      sessionStorage.setItem("agentRole", agent.agentRole);
      sessionStorage.setItem("agentVoice", agent.agentVoice);
      sessionStorage.setItem("agentVoiceAccent", agent.agentAccent);
      sessionStorage.setItem("avatar", agent.avatar);
      sessionStorage.setItem("businessDetails", agent.business);
      sessionStorage.setItem("businessId", agent.businessId);
      sessionStorage.setItem("bId", agent.businessId);

      const businessData = {
        userId: business.userId,
        businessType: business.businessType,
        businessName: business.businessName.trim(),
        businessSize: business.businessSize,
        customBuisness: business.customBuisness,
      };
      let parsedServices = safeParse(business.buisnessService, []);
      sessionStorage.setItem(
        "businesServices",
        JSON.stringify({
          selectedService: parsedServices,
          email: business.buisnessEmail,
        })
      );
      //custome servce filter and save

      let rawCustomServices = business?.customServices || [];

      if (typeof rawCustomServices === "string") {
        try {
          rawCustomServices = JSON.parse(rawCustomServices);
        } catch (err) {
          console.error("Failed to parse customServices:", rawCustomServices);
          rawCustomServices = [];
        }
      }

      const cleanedCustomServices = Array.isArray(rawCustomServices)
        ? rawCustomServices
          .map((item) => item?.service?.trim())
          .filter(Boolean)
          .map((service) => ({ service }))
        : [];

      sessionStorage.setItem(
        "selectedCustomServices",
        JSON.stringify(cleanedCustomServices)
      );

      sessionStorage.setItem("businessDetails", JSON.stringify(businessData));
      let raw_knowledge_base_texts = business?.knowledge_base_texts || [];

      if (typeof raw_knowledge_base_texts === "string") {
        try {
          raw_knowledge_base_texts = JSON.parse(raw_knowledge_base_texts);
        } catch (err) {
          console.error(
            "Failed to parse customServices:",
            raw_knowledge_base_texts
          );
          raw_knowledge_base_texts = [];
        }
      }

      sessionStorage.setItem(
        "placeDetailsExtract",
        JSON.stringify(raw_knowledge_base_texts)
      );
      sessionStorage.setItem("agentNote", agent?.additionalNote);
    } catch (error) {
      console.log("An Error Occured while fetching Agent Data for ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((agentId || editAgentId) && (businessId || editBusinessId)) {
      fetchPrevAgentDEtails(
        agentId || editAgentId,
        businessId || editBusinessId
      );
    }
  }, [editAgentId, editBusinessId]);

  useEffect(() => {
    const storedAgentId = sessionStorage.getItem("SelectAgentId");
    setAgentId(storedAgentId);
    if (storedAgentId) {
      loadAgentStatus(storedAgentId);
    }
  }, []);
  const { handleCreateAgent } = useAgentCreator({
    stepValidator: () => "CallRecording",
    setLoading,
    setPopupMessage,
    setPopupType,
    setShowPopup,
    navigate,
    setHasFetched,
  });
  const loadAgentStatus = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/agent/getAgent/${id}`);
      setCallRecording(res.data.callRecording);
      sessionStorage.setItem("callRecording", res.data.callRecording);
    } catch (error) {
      console.error("Failed to fetch agent details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (callRecording) {
      setOpenDisclaimer(true);
    } else {
      updateRecordingStatus(true);
    }
  };

  const updateRecordingStatus = async (newValue) => {
    try {
      setLoading(true);
      await updateAgent(agentId, { callRecording: newValue });
      setCallRecording(newValue);
      sessionStorage.setItem("callRecording", newValue);
      handleCreateAgent();
    } catch (error) {
      console.error("Failed to update call recording", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDisclaimer = () => {
    if (disclaimerChecked) {
      setOpenDisclaimer(false);
      setDisclaimerChecked(false);
      updateRecordingStatus(false);
    }
  };
  useEffect(() => {
    if (agentId) {
      loadAgentStatus(agentId);
    }
  }, [agentId]);

  return (
    <div className={styles.callRecordingContainer}>
      <div className={styles.toggleWrapper}>
        <label className={styles.toggleLabel}>
          <p className={styles.Ptag}> "Would you like your agent to announce the 'Call Recording
            Declaration'?"</p>
          {loading ? (
            <CircularProgress size={20} style={{ marginLeft: 10 }} />
          ) : (
            <>

              {/* <Switch
                type="checkbox"
                checked={callRecording}
                onChange={handleToggle}
                color="primary"
                style={{ marginLeft: 10 }}
              /> */}
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={callRecording}
                  onChange={handleToggle}

                />
                <span className={styles.slider}></span>
              </label>

            </>
          )}
        </label>
      </div>

      {/* Disclaimer Modal */}
      <Modal open={openDisclaimer} onClose={() => setOpenDisclaimer(false)}>
        <Box className={styles.modalBox}>
          <Typography variant="h6" gutterBottom>
            Disclaimer
          </Typography>
          <Typography variant="body1" gutterBottom>
            As per your state's law, A declaration to the caller about call
            recording is required for caller's consent. Turning off, This
            declaration may impact compliance with applicable laws, regulations,
            or internal policies.
            <br>
            </br>
            By disabling this feature, you acknowledge
            that you are solely responsible for ensuring the other means of
            declaration including but not limited to written notice, written
            consent or announcement to your callers.
          </Typography>

          <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
            <Checkbox
              checked={disclaimerChecked}
              onChange={(e) => setDisclaimerChecked(e.target.checked)}
              sx={{
                '&.Mui-checked': {
                  color: '#5F33E1',
                }
              }}
            />
            <Typography variant="body2">
              I have read and understood the implications of turning off call
              recording.
            </Typography>
          </div>
          <div className={styles.BtnDiv}
            style={{

            }}
          >
            <Button
              variant="outlined"
              onClick={() => setOpenDisclaimer(false)}
              sx={{
                borderColor: '#999',     
                color: '#24252C',           
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={!disclaimerChecked}
              onClick={() => console.log("Confirmed")}
              sx={{
                backgroundColor: disclaimerChecked ? '#5F33E1' : undefined,
                color: disclaimerChecked ? '#fff' : undefined
              }}
            >
              Confirm
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CallRecording;
const safeParse = (value, fallback = null) => {
  try {
    if (typeof value === "string") {
      const cleaned = value.trim();
      if (
        (cleaned.startsWith("[") && cleaned.endsWith("]")) ||
        (cleaned.startsWith("{") && cleaned.endsWith("}")) ||
        (cleaned.startsWith('"') && cleaned.endsWith('"'))
      ) {
        return JSON.parse(cleaned);
      }
    }
    return value;
  } catch {
    return fallback;
  }
};
