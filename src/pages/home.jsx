import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleClick = () => {
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {/* Call to Action */}
      <div className="bg-primary text-white text-center p-8 mt-12 rounded-xl w-full max-w-3xl">
        <h2 className="text-3xl font-semibold">
          We've received your request and will get back to you soon. Looking
          forward to helping you keep your home spotless!
        </h2>

        <Button
          className="mt-4 bg-white text-primary px-6 py-3 rounded-xl hover:bg-gray-200"
          onClick={handleClick}
        >
          Get Quote
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
