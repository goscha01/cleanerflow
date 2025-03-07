import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import StepIndicator from "@/components/booking/StepIndicator";
import ServiceCards from "@/components/booking/ServiceCards";
import PropertyDetails from "@/components/booking/PropertyDetails";
import PreferredTimes from "@/components/booking/PreferredTimes";
import PricingCard from "@/components/booking/PricingCard";
import ServiceAddress from "@/components/booking/ServiceAddress";
// import RecurringPlan from "@/components/booking/RecurringPlan";
import ContactInfo from "@/components/booking/ContactInfo";
import Detail from "@/components/booking/Detail";

const TOTAL_STEPS = 4;

export default function Booking() {
  const [showBookingSteps, setShowBookingSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm({
    defaultValues: {
      serviceType: "",
      bedrooms: null,
      bathrooms: null,
      extras: [],
      propertyCondition: "",
      hasPets: false,
      accessMethod: "",
      specialNotes: "",
      totalPrice: 0,
      preferredDate: null,
      preferredTime: "",
      streetAddress: "",
      contactInfo: "",
      // recurringPlan: "",
    },
  });

  const onSubmit = () => {
    console.log("submitted");
  };

  const handleServiceSelect = (serviceType) => {
    form.setValue("serviceType", serviceType);
    setShowBookingSteps(true);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          form.getValues("bedrooms") &&
          form.getValues("bathrooms") &&
          form.getValues("extras") &&
          form.getValues("propertyCondition")
        );
      case 1:
        return (
          form.getValues("preferredDate") &&
          form.getValues("preferredTime")?.length > 0
        );
      case 2:
        return form.getValues("streetAddress");
      case 3:
        // return form.getValues("recurringPlan");
        return form.getValues("contactInfo");
      default:
        return false;
    }
  };

  const nextStep = async () => {
    if (!validateCurrentStep()) {
      form.trigger();
      return;
    }

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowBookingSteps(false);
    }
  };

  if (!showBookingSteps) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <ServiceCards onServiceSelect={handleServiceSelect} />
        </div>
      </div>
    );
  }

  return (
    <>
      {showBookingSteps && (
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          prevStep={prevStep}
          form={form}
        />
      )}
      <div className="min-h-screen p-2">
        <div className="max-w-7xl mx-auto">
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 md:mx-32 mx-4">
            <div className="lg:col-span-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {!showBookingSteps && (
                        <ServiceCards onServiceSelect={handleServiceSelect} />
                      )}
                      {showBookingSteps && (
                        <>
                          {currentStep === 0 && <PropertyDetails form={form} />}
                          {currentStep === 1 && <PreferredTimes form={form} />}
                          {currentStep === 2 && <ServiceAddress form={form} />}
                          {/* {currentStep === 3 && <RecurringPlan form={form} />} */}
                          {currentStep === 3 && <ContactInfo form={form} />}
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {showBookingSteps && currentStep !== 3 && (
                    <div className="mt-8 flex justify-start">
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-[#2196F3] text-white px-16 py-6 hover:bg-[#0d6e9c]"
                      >
                        {currentStep === TOTAL_STEPS - 1
                          ? "Book Appointment"
                          : "Continue"}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </div>

            {showBookingSteps && (
              <div className="lg:col-span-1">
                <PricingCard form={form} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 mt-20">
        <Detail />
      </div>
    </>
  );
}
