import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NotFound from "@/pages/not-found";
import Booking from "@/pages/booking";
import Home from "@/pages/home";
import ReactGA from 'react-ga4';
import GoogleTag from "./GoogleTag";

ReactGA.initialize('G-8W7WSSFNC6');

// ScrollToTop component disabled - removed automatic scroll to top

function GAListener() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
  return null;
}


function App() {
  return (
    <BrowserRouter>
      <GoogleTag />
      <GAListener /> {/* Track GA4 page views */}
      <Routes>
        <Route path="/" element={<Booking />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
