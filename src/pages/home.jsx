import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {/* Call to Action */}
      <div className="bg-primary text-white text-center p-8 mt-12 rounded-xl w-full max-w-3xl">
        <h2 className="text-3xl font-semibold">Get Started with Us Today!</h2>

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

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 shadow-md rounded-xl text-center">
      <div className="flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HomePage;
