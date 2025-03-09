import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import emailjs from "emailjs-com";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Spinner Icon
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const USER_ID = import.meta.env.VITE_USER_ID;
const ADMIN_TEMPLATE_ID = import.meta.env.VITE_ADMIN_TEMPLATE_ID;
const USER_TEMPLATE_ID = import.meta.env.VITE_USER_TEMPLATE_ID;

export default function ContactInfo({ form, currentStep, setCurrentStep }) {
  const navigate = useNavigate();
  const formData = form.watch();
  const [sendNotifications, setSendNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(true);

  useEffect(() => {
    const validateForm = () => {
      const isValid = formData.name && formData.phone && formData.email;
      setErrors(!isValid);
    };

    validateForm();
  }, [formData.name, formData.phone, formData.email]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
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
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime.join(", "),
        totalPrice: formData.totalPrice,
      };

      await emailjs.send(
        SERVICE_ID,
        ADMIN_TEMPLATE_ID,
        { ...emailData, admin_email: ADMIN_EMAIL },
        USER_ID
      );

      if (sendNotifications) {
        await emailjs.send(
          SERVICE_ID,
          USER_TEMPLATE_ID,
          {
            preferredDate: formData.preferredDate,
            preferredTime: formData.preferredTime.join(", "),
            user_email: formData.email,
          },
          USER_ID
        );
      }
      setCurrentStep(currentStep + 1);
      form.reset();
      navigate("/home");
    } catch (error) {
      console.error("Failed to send email:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-1">
        Contact Information
      </h2>
      <p className="text-[16px] text-gray-600 mb-6 text-justify">
        Please provide your contact details so we can reach you to confirm your
        booking
      </p>
      <div className="flex ">
        <div className="w-full">
          <Input
            id="name"
            placeholder="Your Full Name"
            {...form.register("name")}
            className="w-full py-[24px] rounded-xl transition-colors"
          />
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="w-[49%]">
          <Input
            id="phone"
            placeholder="Phone Number"
            {...form.register("phone")}
            className="w-full py-[24px] rounded-xl transition-colors"
          />
        </div>
        <div className="w-[49%]">
          <Input
            id="email"
            placeholder="Email Address"
            {...form.register("email")}
            className="w-full py-[24px] rounded-xl transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Checkbox
          id="notifications"
          checked={sendNotifications}
          onCheckedChange={(checked) => setSendNotifications(checked)}
        />
        <label htmlFor="notifications" className="text-gray-700 text-sm">
          Send me notifications about this service request via text message
        </label>
      </div>
      <div className="mt-8 flex justify-start">
        <Button
          onClick={handleSubmit}
          type="button"
          disabled={errors || loading}
          className={`px-16 py-6 w-full text-white text-lg ${
            errors || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primaryHover"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
              Processing...
            </>
          ) : (
            "Request Appointment"
          )}
        </Button>
      </div>
    </div>
  );
}
