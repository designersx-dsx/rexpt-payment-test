import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { API_BASE_URL } from '../Store/apiStore';
const SecureRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('token');
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.post(`${API_BASE_URL}/endusers/verifyToken`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsValid(res.data.valid); // assuming backend returns { valid: true/false }
      } catch (err) {
        setIsValid(false);
      }
    };
    if (token) {
      verifyToken();
    } else {
      setIsValid(false);
    }
  }, [token]);

  if (isValid === null) return <div>Loading...</div>;
  if (isValid === false) return <Navigate to="/" />;
  return children;
};
export default SecureRoute