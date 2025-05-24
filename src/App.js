import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './Component/Start/Start';
import SignUp from './Component/SignUp/SignUp';
import Details from './Component/Details/Details';
import Step from './Component/Step/Step';
import AboutBusiness from './Component/AboutBusiness/AboutBusiness';
import BusinessDetails from './Component/BusinessDetails/BusinessDetails';


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
      </div>
    </BrowserRouter>
  );
}

export default App;
