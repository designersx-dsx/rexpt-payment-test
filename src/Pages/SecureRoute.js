


import { Navigate } from 'react-router-dom';

const SecureRoute = ({ children }) => {
 const token = localStorage.getItem('token')||null;
 console.log(token)
  if (!token) {
    
    return <Navigate to="/signup" />;
  }

 
  return children;
};

export default SecureRoute