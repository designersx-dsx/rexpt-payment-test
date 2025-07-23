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
import SubscriptionPlan from "./Component/SubscriptionPlan/SubscriptionPlan";
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
import Delete from "./Component/Delete/Delete";
import SubscriptionFlow from "./Component/Checkout/SubscriptionFlow";
import Calendar from "./Component/Celender/Calendar";
import BusinessServices from "./Component/BusinessServices/BusinessServices";
import TotalsCallsList from "./Component/TotalsCallsList/TotalsCallsList";
import CallTransfer from "./Component/CallTransfer/CallTransfer";
import CallDetails from "./Component/CallDetails/CallDetails";
import BusinessServicesNEXT from "./Component/BusinessServices/BusinessServicesNEXT"
import CalInfo from "./Component/Dashboard/CalInfo";
import EditProfile from "./Component/EditProfile/EditProfile";
//... Edit Screen Start ....//
import EditAgentNew from "./Component/EditAgentNew/EditAgentNew";
import EditBusinessType from "./Component/EditBusinessType/EditBusinessType";
import EditServicesOffered from "./Component/EditServicesOffered/EditServicesOffered";
import EditPublic from "./Component/EditPublic/EditPublic";
import EditBusinessDetail from "./Component/EditBusinessDetail/EditBusinessDetail"
import EditLanguage from "./Component/EditLanguage/EditLanguage"
import EditGender from "./Component/EditGender/EditGender"
import EditNameAvtar from "./Component/EditNameAvtar/EditNameAvtar"
//... Edit Screen End ....//
import { useEffect, useState } from "react";
import RoutePersistence from "./Component/RoutePersistence/RoutePersistence";
import WidgetGuidePage from "./Component/WidgetGuidePage/WidgetGuidePage";
import BusinessListing from "./Component/BusinessListing/BusinessListing";
import Test from "./utils/Test";
import CallSetting from "./Component/CallSetting/CallSetting";
import ConnectCalenderAPI from "./Component/ConnectCalenderAPI/ConnectCalanderAPI";
import AssignNumber from "./Component/AssignNumber/AssignNumber";
import Thankyou from "./Component/ThankyouPage/Thankyou";
import CancelPage from "./Component/CancelPage/CancelPage";
import IntegrateAgent from "./Component/Integrate-agent/Integrate-agent"
import AgentSetupHelp from "./Component/AgentSetupHelp/AgentSetupHelp"
import Plan from "./Component/Plans/Plans";
import Planss from "./Component/Plan/Plan";
import Documentation from "./Component/Documentation/Documentation";
import RedirectHandler from "./utils/RedirectHandler ";
import PreventPullToRefresh from "./Component/PreventPullToRefresh/PreventPullToRefresh";
import Thankyou2 from "./Component/ThankyouPage2/Thankyou2";
import Number from "./Component/assign/Number";
import CallRecording from "./Component/CallRecording/CallRecording";
import RaiseTickets from "./Component/Tickets/RaiseTickets";
import CreateTicketModal from "./Component/Tickets/CreateTicketModal";
import CreateTicket from "./Component/Tickets/CreateTicket";
// import Test from "./utils/Test";
function App() {
  const [refreshKey, setRefreshKey] = useState(0);
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

          <PreventPullToRefresh setRefreshKey={setRefreshKey}>

            <BrowserRouter>
              <div className="App" key={refreshKey}>
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
                  <Route path="/edit-agent" element={<EditAgentNew />} />
                  <Route path="/edit-business-type" element={<EditBusinessType />} />
                  <Route path="/edit-services-offered" element={<EditServicesOffered />} />

                  <Route path="/edit-public-listing" element={<EditPublic />} />

                  <Route path="/edit-public" element={<EditPublic />} />
                  <Route path="/edit-business-detail" element={<EditBusinessDetail />} />
                  <Route path="/edit-language" element={<EditLanguage />} />
                  <Route path="/edit-gender" element={<EditGender />} />
                  <Route path="/edit-name-avtar" element={<EditNameAvtar />} />
                  <Route path="/plans" element={<SecureRoute><SubscriptionPlan /></SecureRoute>} />
                  <Route path="/plan" element={<SecureRoute><Planss /></SecureRoute>} />
                  <Route path="/assign-number" element={<SecureRoute><AssignNumber /></SecureRoute>} />
                  <Route
                    path="/details"
                    element={
                      <SecureRoute>
                        <Details />
                      </SecureRoute>
                    }
                  />
                  <Route path="/steps" element={<SecureRoute><Step /></SecureRoute>} />
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
                  <Route path="/call-setting" element={<SecureRoute><CallSetting /></SecureRoute>} />
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
                  {/* <Route path="/plans" element={<Plans />} /> */}
                  <Route path="/checkout" element={<SecureRoute><SubscriptionFlow /></SecureRoute>} />
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
                  {/* <Route path="/plans" element={<Plans />} /> */}
                  <Route path="/checkout" element={<SubscriptionFlow />} />
                  <Route
                    path="/calendar"
                    element={
                      <SecureRoute>
                        <Calendar />
                      </SecureRoute>
                    }
                  />
                  <Route path="/edit-profile" element={<SecureRoute><EditProfile /></SecureRoute>} />
                  <Route path="/your-business-Listing" element={<SecureRoute><BusinessListing /></SecureRoute>} />
                  <Route path="/widget-guide" element={<SecureRoute><WidgetGuidePage /></SecureRoute>} />
                  <Route path="/connect-calender" element={<SecureRoute><ConnectCalenderAPI /></SecureRoute>} />
                  <Route path="/integrate-agent" element={<SecureRoute><IntegrateAgent /></SecureRoute>} />
                  <Route path="/test-other" element={<Test />} />
                  <Route path="/edit-profile" element={<SecureRoute><EditProfile /></SecureRoute>} />
                  <Route path="/your-business-Listing" element={<SecureRoute><BusinessListing /></SecureRoute>} />
                  <Route path="/widget-guide" element={<SecureRoute><WidgetGuidePage /></SecureRoute>} />
                  <Route path="/connect-calender" element={<SecureRoute><ConnectCalenderAPI /></SecureRoute>} />
                  <Route path="/agent-setup" element={<SecureRoute><AgentSetupHelp /></SecureRoute>} />
                  <Route path="/documentation" element={<SecureRoute><Documentation /></SecureRoute>} />
                  <Route path="/raise-tickets" element={<SecureRoute><RaiseTickets/></SecureRoute>} />  
                  <Route path="/create-ticket" element={<SecureRoute><CreateTicket/></SecureRoute>} />  
                  <Route path="/integrate-agent" element={<SecureRoute><IntegrateAgent /></SecureRoute>} />
                  <Route path="/call-recording" element={<SecureRoute><CallRecording /></SecureRoute>} />
                  <Route path="/test-other" element={<Test />} />
                  <Route path="/thankyou/:id" element={<Thankyou />} />
                  <Route path="/cancel-payment" element={<CancelPage />} />
                  <Route path="/*" element={<RedirectHandler />} />
                  <Route path="/thankyou2" element={<Thankyou2 />} />
                  <Route path="/number" element={< Number />} />
                  <Route path="/delete-account" element={<Delete />} />
                </Routes>
              </div>
            </BrowserRouter>

          </PreventPullToRefresh>

        </div>
      </div>

    </>
  );
}
export default App; 