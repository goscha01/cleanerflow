import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "@/components/ui/form";
import StepIndicator from "@/components/booking/StepIndicator";
import ServiceCards from "@/components/booking/ServiceCards";
import PropertyDetails from "@/components/booking/PropertyDetails";
import PreferredTimes from "@/components/booking/PreferredTimes";
import PricingCard from "@/components/booking/PricingCard";
import ServiceAddress from "@/components/booking/ServiceAddress";
import ContactInfo from "@/components/booking/ContactInfo";
import Detail from "@/components/booking/Detail";
const TOTAL_STEPS = 5;

export default function Booking() {
  const [showBookingSteps, setShowBookingSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm({
    defaultValues: {
      serviceType: "",
      bedrooms: null,
      bathrooms: null,
      square_feet: null,
      extras: [],
      propertyCondition: null,
      hasPets: false,
      accessMethod: "",
      specialNotes: "",
      totalPrice: 0,
      preferredDate: null,
      preferredTime: "",
      streetAddress: "",
      contactInfo: "",
      recurringPlan: null,
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
        return form.getValues("contactInfo");
      default:
        return false;
    }
  };

  const nextStep = async () => {
    if (!validateCurrentStep()) {
      form.trigger();
      const result = await form.trigger();
      if (result) {
        if (form.getValues("bedrooms") == null) {
          form.setError("bedrooms", {
            type: "required",
            message: "Please select number of bedrooms",
          });
        }
        if (form.getValues("bathrooms") == null) {
          form.setError("bathrooms", {
            type: "required",
            message: "Please select number of bathrooms",
          });
        }

        if (form.getValues("propertyCondition") == null) {
          form.setError("propertyCondition", {
            type: "required",
            message: "Please select property condition",
          });
        }
      }
      return;
    }

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "instant" });
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
                          {currentStep === 0 && (
                            <PropertyDetails form={form} nextStep={nextStep} />
                          )}
                          {currentStep === 1 && (
                            <PreferredTimes form={form} nextStep={nextStep} />
                          )}
                          {currentStep === 2 && (
                            <ServiceAddress form={form} nextStep={nextStep} />
                          )}
                          {currentStep === 3 && (
                            <ContactInfo
                              form={form}
                              setCurrentStep={setCurrentStep}
                              currentStep={currentStep}
                            />
                          )}
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
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
      <div className="bg-gray-50 mt-12">
        <Detail />
      </div>
    </>
  );
}
