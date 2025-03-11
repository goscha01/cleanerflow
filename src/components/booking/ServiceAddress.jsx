import { Input } from "@/components/ui/input";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X as CloseIcon, Search as SearchIcon } from "lucide-react";

export default function ServiceAddress({ form, nextStep }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const inputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (showOverlay && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showOverlay]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    form.setValue("streetAddress", "");
    setSearchTerm("");
    setIsSelected(false);
  }, []);

  useEffect(() => {
    const streetAddress = form.watch("streetAddress");
    if (streetAddress?.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [form.watch("streetAddress")]);

  const formatUSAddress = (address) => {
    const { house_number, road, city, state } = address;

    // Primary line: house number + road
    const primaryLine =
      house_number && road ? `${house_number} ${road}` : road || "";

    // Secondary line: city + state
    const secondaryLine = city && state ? `${city}, ${state}` : state || "";

    // Return array of non-empty lines
    return [primaryLine, secondaryLine].filter(Boolean);
  };

  const fetchAddressSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=us&limit=5&addressdetails=1`
      );
      const data = await response.json();

      return data
        .filter(
          (item) =>
            item.address.country === "United States" ||
            item.address.country_code === "us"
        )
        .map((item) => {
          const formattedLines = formatUSAddress(item.address);
          return {
            display_name: formattedLines.join(" • "),
            full_address: item.display_name,
            lines: formattedLines,
          };
        })
        .filter((suggestion) => suggestion.lines.length > 0);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return [];
    }
  };

  useEffect(() => {
    if (isSelected) {
      setIsButtonDisabled(false);
    }
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

  const SuggestionsList = ({ suggestions, onSelect, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="p-4 bg-white rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion.lines.map((line, lineIndex) => (
            <p
              key={lineIndex}
              className={`${
                lineIndex === 0
                  ? "text-base font-medium"
                  : "text-sm text-gray-600"
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Service Address
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow w-full">
          <Input
            id="street"
            placeholder="Enter your service address"
            {...form.register("streetAddress", { required: true })}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSelected(false);
            }}
            onClick={() => isMobile && setShowOverlay(true)}
            className="w-full py-6 px-4 rounded-xl transition-colors text-lg"
          />

          {!isMobile && !isSelected && suggestions.length > 0 && (
            <div className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 z-10 max-h-80 overflow-y-auto p-2">
              <SuggestionsList
                suggestions={suggestions}
                onSelect={(suggestion) => {
                  form.setValue("streetAddress", suggestion.full_address);
                  setSearchTerm(suggestion.display_name);
                  setSuggestions([]);
                  setIsSelected(true);
                  form.clearErrors("streetAddress");
                }}
              />
            </div>
          )}
        </div>

        <div className="w-full md:w-1/4 min-w-[120px]">
          <Input
            id="unit"
            placeholder="Apt, Unit, Floor"
            {...form.register("unitNumber")}
            className="w-full py-6 px-4 rounded-xl transition-colors"
          />
        </div>
      </div>

      {showOverlay && isMobile && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="sticky top-0 bg-white border-b p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Search Address</h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowOverlay(false)}
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="street-mobile"
                ref={inputRef}
                placeholder="Enter your service address"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSelected(false);
                }}
                className="w-full py-6 pl-12 pr-4 rounded-xl transition-colors text-lg"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading && (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            )}

            {!isSelected && suggestions.length > 0 && (
              <SuggestionsList
                suggestions={suggestions}
                onSelect={(suggestion) => {
                  form.setValue("streetAddress", suggestion.full_address);
                  setSearchTerm(suggestion.display_name);
                  setSuggestions([]);
                  setIsSelected(true);
                  form.clearErrors("streetAddress");
                  setShowOverlay(false);
                }}
              />
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-start">
        <Button
          type="button"
          onClick={nextStep}
          disabled={isButtonDisabled}
          className={`px-16 py-6 text-white ${
            isButtonDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
