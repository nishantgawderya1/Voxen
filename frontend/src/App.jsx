import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Features from "./pages/Features.jsx";
import Pricing from "./pages/Pricing.jsx";
import MarketingLayout from "./components/MarketingLayout.jsx";
import Loader from "./components/Loader.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./App.css";

// Heavy / secondary routes are code-split so the first paint stays fast.
const Authentication = lazy(() => import("./pages/Authentication.jsx"));
const HomePage = lazy(() => import("./pages/home.jsx"));
const History = lazy(() => import("./pages/History.jsx"));
const VideoMeet = lazy(() => import("./pages/VideoMeet.jsx"));

const Home = () => (
  <MarketingLayout>
    <LandingPage />
    <Features />
    <Pricing />
  </MarketingLayout>
);

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Suspense fallback={<Loader label="Loading Voxen…" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Home />} />
              <Route path="/pricing" element={<Home />} />
              <Route path="/auth" element={<Authentication />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/history" element={<History />} />
              <Route path="/meet" element={<VideoMeet />} />
              <Route path="/:url" element={<VideoMeet />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
