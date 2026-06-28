import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Features from "./pages/Features.jsx";
import Pricing from "./pages/Pricing.jsx";
import Authentication from "./pages/Authentication.jsx";
import VideoMeet from "./pages/VideoMeet.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./App.css";

const Home = () => (
  <>
    <LandingPage />
    <Features />
    <Pricing />
  </>
);

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/meet" element={<VideoMeet />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
