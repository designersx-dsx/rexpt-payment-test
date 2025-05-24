import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './Component/Start/Start';
import SignUp from './Component/SignUp/SignUp';
import Step from './Component/Step/Step';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/steps" element={<Step />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
