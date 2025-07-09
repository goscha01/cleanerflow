import { useState, useRef } from "react";
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
import emailjs from "emailjs-com";
import { calculatePrice } from "@/lib/calculatePrice";

const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const USER_ID = import.meta.env.VITE_USER_ID;
const ADMIN_TEMPLATE_ID = import.meta.env.VITE_ADMIN_TEMPLATE_ID;
const USER_TEMPLATE_ID = import.meta.env.VITE_USER_TEMPLATE_ID;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

const TOTAL_STEPS = 5;

export default function Booking() {
  const [showBookingSteps, setShowBookingSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const formRef = useRef(null);

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
      preferredDates: [],
      preferredTimes: [],
      streetAddress: "",
      contactInfo: "",
      recurringPlan: null,
      name: "",
      phone: "",
      email: "",
      sendNotifications: true,
    },
  });

    const onSubmit = () => {
      console.log("from", form);
      console.log("submitted");

      // ✅ Fire GA4 custom event
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", {
          value: 1,
          currency: "USD"
        });
      } else {
        console.warn("gtag not available");
      }
    };

    const formattedTimes = Object.entries(formData.preferredTimes)
      .map(([dateStr, timeStr]) => {
        const date = new Date(dateStr);
        const options = { weekday: "long", month: "long", day: "numeric" };
        const formattedDate = date.toLocaleDateString("en-US", options);
        return ` ${formattedDate}: \n${timeStr} `;
      })
      .join("\n\n");

    const emailData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      streetAddress: formData.streetAddress,
      serviceType: formData.serviceType,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      extras: formData.extras.join(", "),
      propertyCondition: formData.propertyCondition,
      hasPets: formData.hasPets,
      accessMethod: formData.accessMethod.code,
      specialNotes: formData.specialNotes,
      totalPrice: total,
      date: formData.preferredDates.join(", "),
      time: formattedTimes,
    };

    try {
      await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, { ...emailData, admin_email: ADMIN_EMAIL }, USER_ID);

      if (formData.sendNotifications) {
        await emailjs.send(SERVICE_ID, USER_TEMPLATE_ID, {
          ...emailData,
          user_email: formData.email,
        }, USER_ID);
      }

      form.reset();
      setCurrentStep(0);
      setShowBookingSteps(false);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const handleServiceSelect = (serviceType) => {
    form.reset();
    form.setValue("serviceType", serviceType);
    setShowBookingSteps(true);
    window.scrollTo({ top: 0, behavior: "instant" });
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
          form.getValues("preferredDates") &&
          form.getValues("preferredTimes")
        );
      case 2:
        return form.getValues("streetAddress");
      case 3:
        return (
          form.getValues("name") &&
          form.getValues("phone") &&
          form.getValues("email")
        );
      default:
        return false;
    }
  };

  const nextStep = async () => {
    if (!validateCurrentStep()) {
      await form.trigger();
      return;
    }

    if (window.gtag) {
      window.gtag("event", `booking_step_${currentStep + 1}`, {
        event_category: "Booking Funnel",
        event_label: `Step ${currentStep + 1}`,
        value: 1,
      });
    }

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      formRef.current?.requestSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowBookingSteps(false);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  if (!showBookingSteps) {
    return (
      <div className="p-4 md:p-8">
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
      <div className="p-2">
        <div className="max-w-7xl mx-auto">
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 md:mx-32 mx-4">
            <div className="lg:col-span-2">
              <Form {...form}>
                <form
                  ref={formRef}
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
                    </motion.div>
                  </AnimatePresence>
                </form>
              </Form>
            </div>

            <div className="lg:col-span-1">
              <PricingCard form={form} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
