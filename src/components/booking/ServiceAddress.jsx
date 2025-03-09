import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ServiceAddress({ form, nextStep }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // Function to fetch address suggestions from OpenStreetMap
  const fetchAddressSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      return data.map((item) => ({
        display_name: item.display_name,
        address: item.address,
      }));
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return [];
    }
  };

  // Debounced search effect
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

  // Clear error when address is selected
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

      <div className="flex gap-4">
        <div className="relative flex-grow">
          <Input
            id="street"
            placeholder="Street Address"
            {...form.register("streetAddress", { required: true })}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSelected(false);
            }}
            className="w-full py-[28px] rounded-xl transition-colors"
          />
          {loading && (
            <div className="absolute right-3 top-[20px]">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
          {!isSelected && suggestions.length > 0 && (
            <div className="absolute z-50 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
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
          {form.formState.errors.streetAddress && (
            <p className="text-red-500 text-sm mt-1">
              Street address is required
            </p>
          )}
        </div>

        {/* Unit Number Container */}
        <div className="w-1/4 min-w-[120px]">
          <Input
            id="unit"
            placeholder="Apt, Unit, Floor"
            {...form.register("unitNumber")}
            className="w-full py-[28px] rounded-xl transition-colors"
          />
        </div>
      </div>
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
