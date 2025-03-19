import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { pricingData } from "@/constants/price";

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
      basePrice += 0;
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
    if (formData.extras.includes("glass-door")) basePrice += 20;
    if (formData.extras.includes("door")) basePrice += 50;
    if (formData.extras.includes("garage")) basePrice += 50;
  }

  if (formData.hasPets) basePrice += 20;

  let discount = 0;
  if (formData.recurringPlan > 0) {
    discount = 0.15;
  }

  const discountAmount = basePrice * discount;
  basePrice -= discountAmount;

  return {
    subtotal: Math.round(basePrice + discountAmount),
    discount: Math.round(discountAmount),
    total: Math.round(basePrice),
  };
};

export default function PricingCard({ form }) {
  const formData = form.watch();
  useEffect(() => {
    const { total } = calculatePrice(formData);
    form.setValue("totalPrice", total);
  }, []);

  const { subtotal, discount, total } = calculatePrice(formData);
  // const { total } = calculatePrice(formData);
  return (
    <Card className="sticky top-24 hidden lg:block">
      <CardContent className="p-6 px-0 pb-0">
        <h3 className="text-xl font-semibold mb-4 px-6 text-gray-700">
          {formData.serviceType === "regular"
            ? "Regular Cleaning"
            : formData.serviceType === "deep"
            ? "Deep Cleaning"
            : formData.serviceType === "move"
            ? "Move In/Out Cleaning"
            : "Airbnb Cleaning"}
        </h3>
        <div className="space-y-1">
          {formData.bedrooms > 0 && (
            <div className="flex justify-between text-md px-6 text-gray-600">
              <span>{`${formData.bedrooms} ${
                formData.bedrooms === 1 ? "bedroom" : "bedrooms"
              }`}</span>
            </div>
          )}
          {formData.bathrooms > 0 && (
            <div className="flex justify-between text-md text-gray-600 px-6">
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
            <div className="flex justify-between text-md text-gray-600 px-6">
              <span>
                {formData.extras.map((extra, index) => (
                  <div key={index}>{extra}</div>
                ))}
              </span>
            </div>
          )}

          {formData.propertyCondition && (
            <div className="flex justify-between text-md text-gray-600 px-6">
              <span>{formData.propertyCondition}</span>
            </div>
          )}
          {formData.hasPets && (
            <div className="flex justify-between text-md text-gray-600 px-6">
              <span>{formData.hasPets}</span>
            </div>
          )}
          {formData.preferredDates && formData.preferredDates.length > 0 && (
            <>
              <div className="pt-4 px-6 text-xs text-gray-700 flex items-center">
                <span className="pr-1">REQUESTED TIME</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {formData.preferredDates.map((date) => {
                const times = formData.preferredTimes[date] || [];
                return (
                  <div key={date} className="text-sm text-gray-600 px-6 pb-2">
                    <div className="flex justify-between font-semibold">
                      <span>{format(new Date(date), "PPP")}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {times.map((time, index) => (
                        <span
                          key={index}
                          className="border-[1px] border-gray-200 rounded-md px-2 py-1 text-gray-500"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
          {formData.streetAddress && (
            <div className="pt-8 pb-2 border-t text-lg text-gray-600 px-6">
              <div className="flex justify-between">
                {/* <IoLocationOutline /> */}
                <span className="text-right">{formData.streetAddress}</span>
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
          {discount > 0 && (
            <div className="pt-4 border-t px-6 pb-2">
              <div className="flex justify-between text-md font-semibold">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Recurring Plan Discount (15%)</span>
                <span>-${discount}</span>
              </div>
            </div>
          )}
          <div className="pt-4 border-t px-6 pb-2">
            <motion.div
              className="flex justify-between text-md font-semibold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
            >
              <span>Today's Total</span>
              <span className="text-primary font-bold text-xl">${total}</span>
            </motion.div>
          </div>
          <div className="pt-4 border-t px-6 pb-6 bg-gray-50 ">
            <div>
              <h3 className="font-bold">Service Request</h3>
              <p className="text-md text-gray-600">
                This is a service request. We’ll review your selected times and
                confirm availability as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
