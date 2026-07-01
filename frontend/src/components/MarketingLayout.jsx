import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Aurora from "./Aurora.jsx";
import useReveal from "../hooks/useReveal.js";

export default function MarketingLayout({ children }) {
  useReveal();
  return (
    <div className="relative min-h-screen">
      <Aurora />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
