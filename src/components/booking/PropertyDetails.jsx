import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const bedrooms = Array.from({ length: 6 }, (_, i) => i + 1);
const bathrooms = Array.from({ length: 5 }, (_, i) => i + 1);

const extras = [
  {
    id: "cabinet",
    label: "Inside Cabinet",
    price: 30,
    image: "/extras/cabinets.png",
    description: "Kitchen cabinets",
  },
  {
    id: "fridge",
    label: "Inside Fridge",
    price: 40,
    image: "/extras/fridge.png",
    description: "Removing all the shelves",
  },
  {
    id: "oven",
    label: "Inside Oven",
    price: 40,
    image: "/extras/oven.png",
    description: "Oven",
  },
  {
    id: "laundry",
    label: "Laundry Wash & Dry",
    price: 20,
    image: "/extras/laundry.png",
    description: "1 load included",
  },
  {
    id: "window",
    label: "Interior Windows Inside",
    price: 20,
    image: "/extras/windows.png",
    description: "4 windows included, Price for every additional",
  },
  {
    id: "dish",
    label: "Dish",
    price: 20,
  },
  {
    id: "door",
    label: "Patio Door",
    price: 50,
    description: "inside and outside",
  },
  {
    id: "garage",
    label: "Garage",
    price: 50,
  },
];

const conditions = [
  { id: "Well maintained", label: "Well maintained", description: "7-9" },
  { id: "Fair", label: "Fair", description: "4-6" },
  { id: "Need attention", label: "Need attention", description: "1-3" },
];

const pets = [
  { id: "Yes", label: "Yes" },
  { id: "No", label: "No" },
];

const requirements = [
  { id: "home", label: "Someone is Home" },
  { id: "code", label: "Access Code" },
  { id: "key", label: "Hidden Key" },
  { id: "other", label: "Other" },
];

export default function PropertyDetails({ form }) {
  const bedroomsRef = useRef(null);
  const bathroomsRef = useRef(null);
  const extrasRef = useRef(null);
  const conditionRef = useRef(null);
  const petRef = useRef(null);
  const requirementsRef = useRef(null);
  const noteRef = useRef(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (form.watch("bedrooms")) {
      scrollToSection(bathroomsRef);
    }
  }, [form.watch("bedrooms")]);

  useEffect(() => {
    if (form.watch("bathrooms")) {
      scrollToSection(extrasRef);
    }
  }, [form.watch("bathrooms")]);

  useEffect(() => {
    if (form.watch("propertyCondition")) {
      scrollToSection(petRef);
    }
  }, [form.watch("propertyCondition")]);

  useEffect(() => {
    if (form.watch("hasPets")) {
      scrollToSection(requirementsRef);
    }
  }, [form.watch("hasPets")]);

  useEffect(() => {
    if (form.watch("accessMethod")) {
      scrollToSection(noteRef);
    }
  }, [form.watch("accessMethod")]);

  return (
    <div className="space-y-8">
      <section ref={bedroomsRef}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Number of Bedrooms
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          {bedrooms.map((num) => (
            <motion.div
              key={num}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => form.setValue("bedrooms", num)}
            >
              <Card
                className={`cursor-pointer transition-colors ${
                  form.watch("bedrooms") === num
                    ? "border-[#2196F3] border-2 text-[#2196F3] bg-blue-50 font-bold"
                    : ""
                }`}
              >
                <CardContent className="p-6 text-center">
                  <span className="text-lg">
                    {num} {num === 1 ? "Bedroom" : "Bedrooms"}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      <section ref={bathroomsRef}>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 mt-16">
          Number of Bathrooms
        </h2>
        <p className="text-[16px] text-gray-600 mb-6 text-justify">
          For our service, a "bathroom " can be a full-sized bathroom (with a
          tub and/or shower) or a half-bathroom (with just a toilet and basin).
          Therefore, if you have 1 full-sized bathroom and 1 half-bathroom, it
          will be considered as 2 bathrooms in total.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 md:gap-2 gap-1">
          {bathrooms.map((num) => (
            <motion.div
              key={num}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => form.setValue("bathrooms", num)}
            >
              <Card
                className={`cursor-pointer transition-colors ${
                  form.watch("bathrooms") === num
                    ? "border-[#2196F3] border-2 text-[#2196F3] bg-blue-50 font-bold"
                    : ""
                }`}
              >
                <CardContent className="p-6 text-center">
                  <span className="text-lg">
                    {num} {num === 1 ? "Bathroom" : "Bathrooms"}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      <section ref={extrasRef}>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 mt-16">
          Extras
        </h2>
        <p className="text-[16px] text-gray-600 mb-6">
          Add on extras for a cleaning upgrade.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          {extras.map((extra, index) => {
            const isChecked = (form.watch("extras") || []).includes(extra.id);
            return (
              <Card
                key={extra.id}
                className={`cursor-pointer border border-gray-300 transition-all flex items-center p-4 rounded-lg shadow-sm ${
                  isChecked ? "border-[#2196F3] border-2 bg-blue-50" : ""
                }`}
              >
                <CardContent className="flex flex-1 items-center space-x-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={extra.id}
                      checked={isChecked}
                      onChange={(e) => {
                        const currentExtras = form.watch("extras") || [];
                        const newExtras = e.target.checked
                          ? [...currentExtras, extra.id]
                          : currentExtras.filter((id) => id !== extra.id);
                        form.setValue("extras", newExtras);
                      }}
                      className="peer hidden"
                    />
                    <label
                      htmlFor={extra.id}
                      className={`w-6 h-6 flex items-center justify-center border-2 rounded-md transition cursor-pointer ${
                        isChecked
                          ? "border-[#2196F3] bg-[#2196F3] text-white font-bold"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isChecked && "✓"}
                    </label>
                  </div>

                  <Label htmlFor={extra.id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <span
                          className={`text-lg ${
                            isChecked ? "text-[#2196F3] font-bold" : ""
                          }`}
                        >
                          {extra.label}
                        </span>
                        <p className="text-sm text-gray-600">
                          {extra.description}
                        </p>
                      </div>
                    </div>
                  </Label>
                </CardContent>

                {/* Display Image if available */}
                {index < 5 && extra.image && (
                  <div className="flex flex-col items-center">
                    <img
                      src={extra.image}
                      alt={extra.label}
                      className="w-[40px] h-[45px] object-cover rounded-md mb-2"
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <section ref={conditionRef}>
        <h2 className="text-xl font-semibold text-gray-900 mt-16 mb-2">
          Property Condition
        </h2>
        <p className="text-[16px] text-gray-600 mb-6">
          How would you rate your property condition int the rate from 1 dirty
          to 10 clean?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          {conditions.map((condition) => (
            <motion.div
              key={condition.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => form.setValue("propertyCondition", condition.id)}
            >
              <Card
                className={`cursor-pointer transition-colors ${
                  form.watch("propertyCondition") === condition.id
                    ? "border-[#2196F3] border-2 text-[#2196F3] font-bold bg-blue-50"
                    : ""
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-lg">{condition.label}</div>
                  <div className="text-sm text-gray-600">
                    {condition.description}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      <section ref={petRef}>
        <h2 className="text-xl font-semibold text-gray-900 mt-16 mb-6">
          Any pets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {pets.map((pet) => (
            <motion.div
              key={pet.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => form.setValue("hasPets", pet.id)}
            >
              <Card
                className={`cursor-pointer transition-colors ${
                  form.watch("hasPets") === pet.id
                    ? "border-[#2196F3] border-2 text-[#2196F3] font-bold bg-blue-50"
                    : ""
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-lg">{pet.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section ref={requirementsRef}>
        <h2 className="text-xl font-semibold text-gray-900 mt-16 mb-6">
          How do we get in?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          {requirements.map((req) => (
            <Card
              key={req.id}
              className={`cursor-pointer transition-colors ${
                selectedRequirement === req.id
                  ? "border-[#2196F3] border-2 text-[#2196F3] font-bold bg-blue-50"
                  : ""
              }`}
              onClick={() => {
                setSelectedRequirement(req.id);
                if (req.id === "home") {
                  form.setValue("accessMethod", {});
                }
              }}
            >
              <CardContent className="p-6">
                <div className="text-lg">{req.label}</div>
                {selectedRequirement === req.id && req.id !== "home" && (
                  <Input
                    className="mt-4"
                    placeholder={`Enter your ${req.label.toLowerCase()}`}
                    value={form.watch(`accessMethod.${req.id}`) || ""}
                    onChange={(e) => {
                      const current = form.watch("accessMethod") || {};
                      form.setValue("accessMethod", {
                        ...current,
                        [req.id]: e.target.value,
                      });
                    }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* <section ref={noteRef}> */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mt-16 mb-2">
          Special Notes or Instructions
        </h2>
        <p className="text-[15px] text-gray-500 mb-6">
          If there is anything we should know before arriving, please let us
          know in advance. For example:
          <br /> ✅ How to get through a gate.
          <br /> ✅ Parking requirements.
          <br /> ✅ How to access the house (someone will open the door, or you
          would like us to use a key, etc.).
          <br /> ✅ Preferences for cleaning products - please let us know if
          you have any allergies.
          <br /> ✅ Do you have surfaces that require specific care? For
          example, marble, natural stone, hardwood, etc.
        </p>
        <Textarea
          placeholder="Add any special instructions or notes for the cleaning team..."
          className="min-h-[100px]"
          {...form.register("specialNotes")}
        />
      </section>
    </div>
  );
}
