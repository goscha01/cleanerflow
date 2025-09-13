import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "@/components/ui/form";
import StepIndicator from "@/components/booking/StepIndicator";
import ServiceCards from "@/components/booking/ServiceCards";
import BedroomsBathrooms from "@/components/booking/BedroomsBathrooms";
import PropertyConditionPets from "@/components/booking/PropertyConditionPets";
import ExtrasSelection from "@/components/booking/ExtrasSelection";
import PreferredTimes from "@/components/booking/PreferredTimes";
import PricingCard from "@/components/booking/PricingCard";
import AddressContactInfo from "@/components/booking/AddressContactInfo";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
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
      isEstimateOnly: false,
    },
  });

  const onSubmit = async (formData) => {
    const { total } = calculatePrice(formData);
    console.log("from", form);
    console.log("submitted");

    if (window.gtag) {
      window.gtag("event", "generate_lead", {
        send_to: "G-8W7WSSFNC6", // GA4 tag
        event_category: "Booking",
        event_label: "Booking Wizard Complete",
        value: total,
        currency: "USD",
      });
    }

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
      await emailjs.send(
        SERVICE_ID,
        ADMIN_TEMPLATE_ID,
        { ...emailData, admin_email: ADMIN_EMAIL },
        USER_ID
      );

      if (formData.sendNotifications) {
        await emailjs.send(
          SERVICE_ID,
          USER_TEMPLATE_ID,
          {
            ...emailData,
            user_email: formData.email,
          },
          USER_ID
        );
      }

      // Store submitted data and show confirmation
      setSubmittedData({ ...formData, totalPrice: total });
      setShowConfirmation(true);
      setShowBookingSteps(false);
      setCurrentStep(0);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const handleServiceSelect = (serviceType) => {
    form.reset();
    form.setValue("serviceType", serviceType);
    setShowBookingSteps(true);
    setShowConfirmation(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleEditBooking = () => {
    if (submittedData) {
      // Restore the form with previous data
      Object.keys(submittedData).forEach(key => {
        form.setValue(key, submittedData[key]);
      });
      setShowBookingSteps(true);
      setShowConfirmation(false);
      setCurrentStep(4); // Go to last step (Contact/Submit step)
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const handleCancelBooking = () => {
    // Reset form and go back to service selection
    form.reset();
    setShowBookingSteps(false);
    setShowConfirmation(false);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return form.getValues("bedrooms") && form.getValues("bathrooms");
      case 1:
        return form.getValues("propertyCondition");
      case 2:
        return true; // Extras are optional
      case 3:
        return (
          form.getValues("preferredDates") && form.getValues("preferredTimes")
        );
      case 4:
        return (
          form.getValues("streetAddress") &&
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

  if (!showBookingSteps && !showConfirmation) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <ServiceCards onServiceSelect={handleServiceSelect} />
          {showConfirmation && submittedData && (
            <div className="mt-8">
              <BookingConfirmation 
                bookingData={submittedData} 
                onEdit={handleEditBooking}
                onClose={handleCancelBooking}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showConfirmation && submittedData) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <ServiceCards onServiceSelect={handleServiceSelect} />
          <div className="mt-8">
            <BookingConfirmation 
              bookingData={submittedData} 
              onEdit={handleEditBooking}
              onClose={handleCancelBooking}
            />
          </div>
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
          onCancel={handleCancelBooking}
        />
      )}
      <div className="p-2 lg:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mt-2 lg:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 md:mx-8 lg:mx-32 mx-2 min-h-[calc(100vh-120px)] lg:min-h-0 lg:items-start">
            <div className="lg:col-span-2 flex flex-col lg:min-h-[580px]">
              <Form {...form}>
                <form
                  ref={formRef}
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 lg:space-y-0"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      {currentStep === 0 && (
                        <BedroomsBathrooms form={form} nextStep={nextStep} />
                      )}
                      {currentStep === 1 && (
                        <PropertyConditionPets form={form} nextStep={nextStep} />
                      )}
                      {currentStep === 2 && (
                        <ExtrasSelection form={form} nextStep={nextStep} />
                      )}
                      {currentStep === 3 && (
                        <PreferredTimes form={form} nextStep={nextStep} />
                      )}
                      {currentStep === 4 && (
                        <AddressContactInfo
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
              <PricingCard form={form} currentStep={currentStep} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
