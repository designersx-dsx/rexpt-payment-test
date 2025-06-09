import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Store/apiStore';
import Loader2 from '../Component/Loader2/Loader2';
const SecureRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('token');
  const onboardComplete = localStorage.getItem('onboardComplete');
  const onboardAgentComplete = localStorage.getItem("onboardAgentComplete")
  const location = useLocation()
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.post(`${API_BASE_URL}/endusers/verifyToken`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsValid(res.data.valid);
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

  // This useEffect handles redirect when token is invalid
  useEffect(() => {
    if (isValid === false) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/signup";
    }
  }, [isValid]);
  //  Prevent access to restricted routes if onboarding is incomplete
  if (
    isValid === true &&
    onboardComplete !== 'true' &&
    ["/dashboard"].includes(location.pathname)
  ) {
    return <Navigate to="/details" replace />;
  }
  if (isValid === true) {
    return children;
  }

  // While redirecting, return null
  return null;
};
export default SecureRoute