import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NotFound from "@/pages/not-found";
import Booking from "@/pages/booking";
import Home from "@/pages/home";
import ReactGA from 'react-ga4';

ReactGA.initialize('G-8W7WSSFNC6');

// ScrollToTop component to reset scroll position on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function GAListener() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
  return null;
}

useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-6ZB89H49SD';
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', 'G-6ZB89H49SD'); // GA4
  gtag('config', 'AW-17067419398'); // Optional: your Google Ads account ID
}, []);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
