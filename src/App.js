import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Start from "./Component/Start/Start";
import SignUp from "./Component/SignUp/SignUp";
import Details from "./Component/Details/Details";
import Step from "./Component/Step/Step";
import AboutBusiness from "./Component/AboutBusiness/AboutBusiness";
import BusinessDetails from "./Component/BusinessDetails/BusinessDetails";
import "react-toastify/dist/ReactToastify.css";
import AgentDetail from "./Component/AgentDetails/AgentDetail";
import AiAssistant from "./Component/AiAssistant/AiAssistant";
import BusinessLocation from "./Component/BusinessLocation/BusinessLocation";
import SecureRoute from "./Pages/SecureRoute";
import Dashboard from "./Component/Dashboard/Dashboard";
import RexAgent from "./Component/RexAgent/RexAgent";
import Plans from "./Component/Plans/Plans";
import SubscriptionFlow from "./Component/Checkout/SubscriptionFlow";
import Calendar from "./Component/Celender/Calendar";
import BusinessServices from "./Component/BusinessServices/BusinessServices";
import TotalsCallsList from "./Component/TotalsCallsList/TotalsCallsList";
import CallTransfer from "./Component/CallTransfer/CallTransfer";
import CallDetails from "./Component/CallDetails/CallDetails";
import BusinessServicesNEXT from "./Component/BusinessServices/BusinessServicesNEXT"
import CalInfo from "./Component/Dashboard/CalInfo";
import EditProfile from "./Component/EditProfile/EditProfile";
import { useEffect } from "react";
import RoutePersistence from "./Component/RoutePersistence/RoutePersistence";
import WidgetGuidePage from "./Component/WidgetGuidePage/WidgetGuidePage";
import BusinessListing from "./Component/BusinessListing/BusinessListing";
function App() {
  const token = localStorage.getItem("token");
  const lastRoute = localStorage.getItem("lastVisitedRoute");

  return (
    <>
      <div className="DesktopPlusMobile">
        <div className="ForDesktop">
          <img src="svg/Rexpt-Logo.svg" />
          <h1>

            Launch Your <b>AI Receptionist</b> with Rexpt.in
          </h1>
          <p>
            Launch Your AI Receptionist with Rexpt.in
          </p>
        </div>
        <div className="ForMobile">
          <BrowserRouter>
            <div className="App">
              {/* <RoutePersistence /> */}
              <Routes>
                <Route
                  path="/signup"
                  element={token ? <SecureRoute><Navigate to={"/dashboard"} /></SecureRoute> : <SignUp />}
                />
                <Route
                  path="/"
                  element={token ? <SecureRoute> <Navigate to={lastRoute || "/dashboard"} /></SecureRoute> : <Start />}
                />
                <Route
                  path="/dashboard"
                  element={
                    <SecureRoute>
                      <Dashboard />
                    </SecureRoute>
                  }
                />
                <Route
                  path="/calinfo"
                  element={
                    <SecureRoute>
                      <CalInfo />
                    </SecureRoute>
                  }   >

                </Route>
                <Route path="/" element={<Start />} />
                <Route path="/signup" element={<SignUp />} />

                <Route
                  path="/details"
                  element={
                    <SecureRoute>
                      <Details />
                    </SecureRoute>
                  }
                />
                <Route path="/steps" element={<Step />} />
                <Route
                  path="/about-business"
                  element={
                    <SecureRoute>
                      <AboutBusiness />
                    </SecureRoute>
                  }
                />
                <Route
                  path="/about-business-next"
                  element={
                    <SecureRoute>
                      <BusinessServicesNEXT />
                    </SecureRoute>
                  }
                />
                <Route path="/business-details" element={<SecureRoute><BusinessDetails /></SecureRoute>} />
                <Route path="/agent-detail" element={<SecureRoute><AgentDetail /></SecureRoute>} />
                <Route
                  path="/business-locations"
                  element={
                    <SecureRoute>
                      <BusinessLocation />
                    </SecureRoute>
                  }
                />


                <Route
                  path="/dashboard"
                  element={
                    <SecureRoute>
                      <Dashboard />
                    </SecureRoute>
                  }
                />


                <Route
                  path="/business-services"
                  element={
                    <SecureRoute>
                      <BusinessServices />
                    </SecureRoute>
                  }
                />


                {/* <Route path="/home" element={<Home />} /> */}
                <Route
                  path="/ai-assistant"
                  element={
                    <SecureRoute>
                      <AiAssistant />
                    </SecureRoute>
                  }
                />
                <Route
                  path="/rex-agent"
                  element={
                    <SecureRoute>
                      <RexAgent />
                    </SecureRoute>
                  }
                />
                <Route path="/plans" element={<Plans />} />
                <Route path="/checkout" element={<SubscriptionFlow />} />
                <Route
                  path="/calendar"
                  element={
                    <SecureRoute>
                      <Calendar />
                    </SecureRoute>
                  }
                />
                <Route path="/totalcall-list" element={<SecureRoute><TotalsCallsList /></SecureRoute>} />
                <Route path="/call-transfer" element={<SecureRoute><CallTransfer /></SecureRoute>} />
               <Route path="/call-details/:callId" element={<SecureRoute><CallDetails /></SecureRoute>} />
                <Route
                  path="/business-services"
                  element={
                    <SecureRoute>
                      <BusinessServices />
                    </SecureRoute>
                  }
                />

                <Route
                  path="/ai-assistant"
                  element={
                    <SecureRoute>
                      <AiAssistant />
                    </SecureRoute>
                  }
                />
                <Route
                  path="/rex-agent"
                  element={
                    <SecureRoute>
                      <RexAgent />
                    </SecureRoute>
                  }
                />
                <Route path="/plans" element={<Plans />} />
                <Route path="/checkout" element={<SubscriptionFlow />} />
                <Route
                  path="/calendar"
                  element={
                    <SecureRoute>
                      <Calendar />
                    </SecureRoute>
                  }
                />
                <Route path="/edit-profile" element={ <SecureRoute><EditProfile /></SecureRoute>} />
                <Route path="/your-business-Listing" element={ <SecureRoute><BusinessListing/></SecureRoute>} />
                <Route path="/widget-guide" element={<SecureRoute><WidgetGuidePage/></SecureRoute>} />
               
              </Routes>
            </div>
          </BrowserRouter>
        </div>
      </div>

    </>
  );
}

export default App; 