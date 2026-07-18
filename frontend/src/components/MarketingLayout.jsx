import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Aurora from "./Aurora.jsx";
import useReveal from "../hooks/useReveal.js";
import { useSpotlight } from "../hooks/useInteractive.js";

export default function MarketingLayout({ children }) {
  useReveal();
  useSpotlight();
  return (
    <div className="relative min-h-screen">
      <Aurora floor />
      <div className="noise-overlay" aria-hidden />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
