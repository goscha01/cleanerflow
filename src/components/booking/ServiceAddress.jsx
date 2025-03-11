import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ServiceAddress({ form, nextStep }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Detect screen size for responsive behavior
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to fetch US address suggestions
  const fetchAddressSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1`
      );
      const data = await response.json();

      return data
        .map((item) => {
          const { road, house_number, suburb, city, state, country } =
            item.address;

          // Build a clean address format for USA results
          if (country === "United States") {
            const addressParts = [
              house_number,
              road,
              suburb,
              city,
              state,
            ].filter(Boolean); // Removes empty values

            return { display_name: addressParts.join(", ") };
          }

          // For non-USA addresses, limit to 2 key details
          const nonUSAAddress = item.display_name
            .split(",")
            .filter((part) => part.trim() && part.length > 2) // Remove blanks and short irrelevant parts
            .slice(0, 3)
            .join(", ");

          return { display_name: nonUSAAddress };
        })
        .filter((suggestion) => suggestion.display_name.trim()); // Remove empty entries
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return [];
    }
  };

  useEffect(() => {
    if (isSelected) return;

    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setLoading(true);
        const results = await fetchAddressSuggestions(searchTerm);
        setSuggestions(results);
        setLoading(false);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isSelected]);

  useEffect(() => {
    if (searchTerm && form.formState.errors.streetAddress) {
      form.clearErrors("streetAddress");
    }
  }, [searchTerm, form]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Service Address
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow w-full">
          <Input
            id="street"
            placeholder="Street Address"
            {...form.register("streetAddress", { required: true })}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSelected(false);
            }}
            onClick={() => isMobile && setShowOverlay(true)}
            className="w-full py-[28px] rounded-xl transition-colors"
          />

          {/* Suggestions for larger screens (>= md) */}
          {!isMobile && !isSelected && suggestions.length > 0 && (
            <div className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                  onClick={() => {
                    form.setValue("streetAddress", suggestion.display_name);
                    setSearchTerm(suggestion.display_name);
                    setSuggestions([]);
                    setIsSelected(true);
                    form.clearErrors("streetAddress");
                  }}
                >
                  <p className="text-sm text-gray-700">
                    {suggestion.display_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/4 min-w-[120px]">
          <Input
            id="unit"
            placeholder="Apt, Unit, Floor"
            {...form.register("unitNumber")}
            className="w-full py-[28px] rounded-xl transition-colors"
          />
        </div>
      </div>

      {/* Mobile Address Overlay */}
      {showOverlay && isMobile && (
        <div className="fixed inset-0 bg-white z-50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Search Address</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowOverlay(false)}
            >
              Close
            </button>
          </div>

          <Input
            id="street"
            placeholder="Start typing..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSelected(false);
            }}
            className="w-full py-[28px] rounded-xl transition-colors"
          />

          {loading && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!isSelected && suggestions.length > 0 && (
            <div className="mt-4 max-h-60 overflow-y-auto border rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors truncate"
                  onClick={() => {
                    form.setValue("streetAddress", suggestion.display_name);
                    setSearchTerm(suggestion.display_name);
                    setSuggestions([]);
                    setIsSelected(true);
                    form.clearErrors("streetAddress");
                  }}
                >
                  <p className="text-sm text-gray-700 truncate">
                    {suggestion.display_name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {form.formState.errors.streetAddress && (
            <p className="text-red-500 text-sm mt-1">
              Street address is required
            </p>
          )}
        </div>
      )}

      <div className="mt-8 flex justify-start">
        <Button
          type="button"
          onClick={nextStep}
          className="px-16 py-6 text-white bg-primary hover:bg-primaryHover"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
