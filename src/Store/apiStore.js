import axios from 'axios';
// Centralized API base URL
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
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

//Bookings detailes


// Get total bookings count
export const getTotalBookings = async () => {
  const res = await api.get('/bookings/total', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; 
};

// Get booking dates for current week
export const getCurrentWeekBookingDates = async () => {
  const res = await api.get('/bookings/current-week-dates', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// export const 
// export const createKnowledgeBase = async (formData) => {
//   const res = await api.post('/knowledge-base', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return res.data;
// };

export default api;
