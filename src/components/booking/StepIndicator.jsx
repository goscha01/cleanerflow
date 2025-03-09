import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { pricingData } from "@/constants/price";
import { format } from "date-fns";

const calculatePrice = (formData) => {
  let basePrice = 0;

  function getBasePrice(serviceType, bedrooms, bathrooms) {
    const foundPrice = pricingData.find(
      (item) => item.bedrooms == bedrooms && item.bathrooms == bathrooms
    );
    if (foundPrice) {
      formData.square_feet = foundPrice.square_feet;
      return {
        price: Number(foundPrice[serviceType]) || 0,
        square_feet: foundPrice.square_feet,
      };
    }
    return { price: 0, square_feet: "N/A" };
  }

  const initialBasePrice = (() => {
    switch (formData.serviceType) {
      case "regular":
        return 119;
      case "deep":
        return 149;
      case "move":
        return 149;
      case "airbnb":
        return 129;
      default:
        return 0;
    }
  })();

  const { price } =
    getBasePrice(formData.serviceType, formData.bedrooms, formData.bathrooms) ||
    0;

  basePrice = Math.max(initialBasePrice, price);

  switch (formData.propertyCondition) {
    case "Well maintained":
      basePrice += 20;
      break;
    case "Fair":
      basePrice += 100;
      break;
    case "Need attention":
      basePrice += 200;
      break;
  }

  if (formData.extras) {
    if (formData.extras.includes("cabinet")) basePrice += 30;
    if (formData.extras.includes("fridge")) basePrice += 40;
    if (formData.extras.includes("oven")) basePrice += 40;
    if (formData.extras.includes("laundry")) basePrice += 20;
    if (formData.extras.includes("window")) basePrice += 20;
    if (formData.extras.includes("dish")) basePrice += 20;
    if (formData.extras.includes("door")) basePrice += 50;
    if (formData.extras.includes("garage")) basePrice += 50;
  }

  if (formData.hasPets) basePrice += 20;
  return {
    total: Math.round(basePrice),
  };
};

export default function StepIndicator({
  currentStep,
  totalSteps,
  prevStep,
  form,
}) {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const formData = form.watch();

  useEffect(() => {
    const { total } = calculatePrice(formData);
    form.setValue("totalPrice", total);
  }, []);

  const { total } = calculatePrice(formData);

  return (
    <div className="sticky top-0 left-0 w-full bg-white z-50">
      <div className="flex items-center sm:justify-between w-full">
        <Button
          type="button"
          onClick={prevStep}
          className="mb-1 flex items-center gap-2 md:mx-32 mx-4 bg-transparent hover:bg-transparent"
        >
          <ArrowLeft
            className="text-primary"
            style={{ width: "30px", height: "25px" }}
          />
        </Button>
        <div>
          <img
            src="/logo/LogoUp2.png"
            alt=""
            className="sm:w-[300px] w-[200px]"
          />
        </div>
        <div />
        <div />
        <div />
      </div>

      <div className="w-full h-[6px] bg-gray-200 overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {/* Service Request Section */}
      <div
        className="px-4 py-2 border-b-2 lg:hidden flex-col cursor-pointer"
        onClick={() => setSheetOpen(true)}
      >
        <p className="text-lg text-gray-600">Service Request</p>
        <div className="flex justify-between">
          <p className="text-xl text-gray-600 font-semibold mt-1">
            {formData.serviceType === "regular"
              ? "Regular Cleaning"
              : formData.serviceType === "deep"
              ? "Deep Cleaning"
              : formData.serviceType === "move"
              ? "Move In/Out Cleaning"
              : "Airbnb Cleaning"}
          </p>
          <p className="text-2xl text-primary font-semibold">${total}</p>
        </div>
      </div>

      {/* Bottom Sheet */}
      {isSheetOpen && (
        <div className="fixed inset-0 flex items-end bg-black bg-opacity-50 z-50">
          <div className="w-full bg-white rounded-t-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5">
              <h3 className="text-xl font-semibold">Summary</h3>
              <button onClick={() => setSheetOpen(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="pt-2 border-t px-4 pb-6 bg-gray-50 ">
                <h3 className="font-bold text-xl">Service Request</h3>
                <p className="text-lg text-gray-600">
                  This is a service request. We’ll review your selected times
                  and confirm availability as soon as possible.
                </p>
              </div>
              <p className="text-lg text-gray-700 font-bold px-4">
                {formData.serviceType.charAt(0).toUpperCase() +
                  formData.serviceType.slice(1)}{" "}
                Cleaning
              </p>
              <div className="space-y-1 ">
                {formData.bedrooms > 0 && (
                  <div className="flex justify-between text-lg px-6 text-gray-600">
                    <span>{`${formData.bedrooms} ${
                      formData.bedrooms === 1 ? "bedroom" : "bedrooms"
                    }`}</span>
                  </div>
                )}
                {formData.bathrooms > 0 && (
                  <div className="flex justify-between text-lg text-gray-600 px-6">
                    <span>{`${formData.bathrooms} ${
                      formData.bathrooms === 1 ? "bathroom" : "bathrooms"
                    }`}</span>{" "}
                  </div>
                )}
                {formData.square_feet != null && (
                  <div className="flex justify-between text-md text-gray-600 px-6">
                    <span>{`${formData.square_feet} Sq. Feet`}</span>{" "}
                  </div>
                )}
                {formData.extras?.length > 0 && (
                  <div className="flex justify-between text-lg text-gray-600 px-6">
                    <span>
                      {formData.extras.map((extra, index) => (
                        <div key={index}>{extra}</div>
                      ))}
                    </span>
                  </div>
                )}

                {formData.propertyCondition && (
                  <div className="flex justify-between text-lg text-gray-600 px-6">
                    <span>{formData.propertyCondition}</span>
                  </div>
                )}
                {formData.hasPets && (
                  <div className="flex justify-between text-lg text-gray-600 px-6">
                    <span>{formData.hasPets}</span>
                  </div>
                )}
                {formData.preferredDate &&
                  formData.preferredTime.length > 0 && (
                    <>
                      <div className="pt-4 px-6 text-md text-gray-700 flex items-center">
                        <span className="pr-1">REQUESTED TIME</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                      </div>

                      <div className="text-sm text-gray-600 px-6 pb-2">
                        <div className="flex justify-between font-semibold">
                          <span>{format(formData.preferredDate, "PPP")}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formData.preferredTime.map((time, index) => (
                            <span
                              key={index}
                              className="border-[1px] border-gray-200 rounded-md px-2 py-1 text-gray-500"
                            >
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                {formData.streetAddress && (
                  <div className="pt-8 pb-2 border-t text-lg text-gray-600 px-6">
                    <div className="flex justify-between">
                      {/* <IoLocationOutline /> */}
                      <span className="text-right">
                        {formData.streetAddress}
                      </span>
                    </div>
                  </div>
                )}
                {formData.unitNumber && (
                  <div className="text-lg text-gray-600 px-6 pb-4">
                    <div className="flex justify-between">
                      <span className="text-right">{formData.unitNumber}</span>
                    </div>
                  </div>
                )}
                <div className="pt-4 border-t px-6 pb-8">
                  <motion.div
                    className="flex justify-between text-lg font-semibold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    <span>Today's Total</span>
                    <span className="text-primary font-bold text-2xl">
                      ${total}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
