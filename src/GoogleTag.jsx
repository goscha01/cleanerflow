// src/GoogleTag.jsx
import { useEffect } from "react";

const GoogleTag = () => {
  useEffect(() => {
    // Load gtag script
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-6ZB89H49SD";
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", "G-6ZB89H49SD"); // Google Analytics 4
    gtag("config", "AW-17067419398"); // Your Google Ads conversion ID (optional)

  }, []);

  return null;
};

export default GoogleTag;
