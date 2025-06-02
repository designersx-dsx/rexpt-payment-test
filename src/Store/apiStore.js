import axios from 'axios';
// Centralized API base URL
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'
console.log(API_BASE_URL)
const token = localStorage.getItem('token')||"";
// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
     Authorization: `Bearer ${token}`,
  },
});

// ========== Auth APIs ==========

// Get all knowledge bases
export const LoginWithEmailOTP = async (email) => {
  const res = await api.post('/auth/LoginWithEmailOTP', {email});
  return res;
};

export const verifyEmailOTP = async (email,otp) => {
  const res = await api.post('/auth/verifyEmailOTP', {email,otp});
  return res;
};

export const getRetellVoices = async () => {
  const res = await axios.get('https://api.retellai.com/list-voices',{
  headers: {
      Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
    },
  });
  return res;
};

export const createAgent = async (data) => {
  console.log(token)
  const res = await api.post('/agent/createAgent',data,{
  headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};
export const fetchDashboardDetails = async (userId) => {
  const res = await api.get(`${API_BASE_URL}/agent/getUserAgentsDetails/${userId}`,{
  headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchAgentDetailById=async(data)=>{
  const res=await api.post('/agent/fetchAgentDetailsById',data,{
      headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data;
}

export const EndWebCallUpdateAgentMinutesLeft=async(data)=>{
  const res=await api.patch(`/agent/updateAgentMinutesLeft`,data,{
      headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res;
}
export const SendScriptToDeveloper=async(data)=>{
  const res=await api.post(`/agent/sendScriptToEmail`,data,{
      headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res;
}
export const listAgents=async()=>{
   const res = await api.get(`${API_BASE_URL}/agent/listAgents`,{

  });
  return res.data;
}

export const updateProfilePicture=async(userId,data)=>{
   const res = await api.patch(`${API_BASE_URL}/endusers/user/update_profile_picture/${userId}`,data,{
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
// export const 
// export const createKnowledgeBase = async (formData) => {
//   const res = await api.post('/knowledge-base', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return res.data;
// };
export const updateAgent = async (agentId, updateData) => {
  const res = await api.put(`/agent/updateAgent/${agentId}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export default api;
