import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Features from "./pages/Features.jsx";
import Pricing from "./pages/Pricing.jsx";
import Authentication from "./pages/Authentication.jsx";
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Authentication />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
