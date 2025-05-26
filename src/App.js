import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './Component/Start/Start';
import SignUp from './Component/SignUp/SignUp';
import Details from './Component/Details/Details';
import Step from './Component/Step/Step';
import AboutBusiness from './Component/AboutBusiness/AboutBusiness';
import BusinessDetails from './Component/BusinessDetails/BusinessDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/details" element={<Details />} />
          <Route path="/steps" element={<Step />} />
          <Route path="/about-business" element={<AboutBusiness/>} />
          <Route path="/business-details" element={<BusinessDetails/>} />



        </Routes>
        <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      </div>
    </BrowserRouter>
  );
}

export default App;
