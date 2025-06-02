import './App.css';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Start from './Component/Start/Start';
import SignUp from './Component/SignUp/SignUp';
import Details from './Component/Details/Details';
import Step from './Component/Step/Step';
import AboutBusiness from './Component/AboutBusiness/AboutBusiness';
import BusinessDetails from './Component/BusinessDetails/BusinessDetails';
import 'react-toastify/dist/ReactToastify.css';
import AgentDetail from './Component/AgentDetails/AgentDetail'
import AiAssistant from './Component/AiAssistant/AiAssistant';
import BusinessLocation from './Component/BusinessLocation/BusinessLocation';
import SecureRoute from './Pages/SecureRoute'
import Dashboard from './Component/Dashboard/Dashboard';
import RexAgent from './Component/RexAgent/RexAgent';

function App() {
  const token = localStorage.getItem('token');
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>

          <Route
            path="/signup"
            element={
              token ? <Navigate to="/dashboard" /> : <SignUp />
            }
          />
          <Route
            path="/"
            element={
              token ? <Navigate to="/dashboard" /> : <Start />
            }
          />
          <Route path="/" element={<Start />} />
          <Route path="/signup" element={<SecureRoute><SignUp /></SecureRoute>} />
          <Route path="/details" element={<Details />} />
          <Route path="/steps" element={<Step />} />
          <Route path="/about-business" element={<AboutBusiness />} />
          <Route path="/business-details" element={<BusinessDetails />} />
          <Route path="/agent-detail" element={<AgentDetail />} />
          <Route path="/business-locations" element={<BusinessLocation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<AgentDetail />} />
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/ai-assistant" element={<SecureRoute><AiAssistant /></SecureRoute>} />
          <Route path="/rex-agent" element={<RexAgent />} />


        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
