import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './Component/Start/Start';
import SignUp from './Component/SignUp/SignUp';
import Details from './Component/Details/Details';
import Step from './Component/Step/Step';
import AboutBusiness from './Component/AboutBusiness/AboutBusiness';


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


        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
