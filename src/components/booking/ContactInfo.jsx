import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import SuccessModal from "@/components/ui/successModal";
import emailjs from "emailjs-com";

const ADMIN_EMAIL = "mtalhach008@gmail.com";
const SERVICE_ID = "book_online";
const USER_ID = "pVK3WvgavBmpPr8t-";
const ADMIN_TEMPLATE_ID = "template_1opfsbi";
const USER_TEMPLATE_ID = "template_e3308ey";

export default function ContactInfo({ form }) {
  const formData = form.watch();
  const [sendNotifications, setSendNotifications] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.phone) newErrors.phone = "Phone Number is required";
    if (!formData.email) newErrors.email = "Email Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;
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

      // Send email to admin
      await emailjs.send(
        SERVICE_ID,
        ADMIN_TEMPLATE_ID,
        { ...emailData, admin_email: ADMIN_EMAIL },
        USER_ID
      );

      // Send email to user if they opt-in
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

      // Show success modal after submission
      setShowSuccess(true);

      // Reset form fields
      form.reset();
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
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
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
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
        <div className="w-[49%]">
          <Input
            id="email"
            placeholder="Email Address"
            {...form.register("email")}
            className="w-full py-[24px] rounded-xl transition-colors"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
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
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-8 w-full px-16 py-4 rounded-lg text-white transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#2196F3] hover:bg-[#0d6e9c]"
        }`}
      >
        {loading ? "Loading..." : "Book Appointment"}
      </button>

      {/* Success Modal */}
      {showSuccess && <SuccessModal setShowSuccess={setShowSuccess} />}
    </div>
  );
}
