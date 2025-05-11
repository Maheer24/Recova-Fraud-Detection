import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from './Pages/SignUpPage/SignupPage';
import LoginPage from './Pages/LoginPage/LoginPage';
import HomePage from './Pages/Homepage/HomePage';
import MainPage from './Pages/MainPage/MainPage';
import PricingPage from './Pages/PricingPage/PricingPage';
import Success from './Pages/PricingPage/components/Success';
import Cancel from './Pages/PricingPage/components/Cancel';
import AiPage from './Pages/AI/AiPage';
import HelpPage from './Pages/Help/HelpPage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<MainPage></MainPage>}>  </Route>
        <Route path="/" element={<HomePage></HomePage>}>  </Route>
        <Route path="/login" element={<LoginPage></LoginPage>}>  </Route>
        <Route path="/signup" element={<SignupPage></SignupPage>}>  </Route>
        <Route path="/pricing" element={<PricingPage></PricingPage>}>  </Route>
        <Route path="/success" element={<Success></Success>}>  </Route>
        <Route path="/cancel" element={<Cancel></Cancel>}>  </Route>
        <Route path="/ai" element={<AiPage></AiPage>}>  </Route>
        <Route path="/help" element={<HelpPage></HelpPage>}>  </Route>
     
     
        <Route path="*" element={<h1>404 Not Found</h1>} />




      </Routes>



    </Router>
  )
}

export default App
