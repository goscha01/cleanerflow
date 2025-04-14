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
const VITE_COUPON_CODE = import.meta.env.VITE_COUPON_CODE;

export default function ContactInfo({ form, currentStep, setCurrentStep }) {
  const navigate = useNavigate();
  const formData = form.watch();
  const [sendNotifications, setSendNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

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
            ...emailData,
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

  const handleModalOpen = () => {
    setShowModal(true);
    form.setValue("recurringPlan", 0);
  };
  const handleCouponApply = () => {
    if (coupon === VITE_COUPON_CODE) {
      form.setValue("recurringPlan", Number(coupon));
      setShowModal(false);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Please try again.");
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
      <div className="mt-4">
        <Button
          onClick={handleModalOpen}
          className="bg-transparent hover:bg-transparent hover:text-primaryHover text-primary text-lg font-extrabold"
        >
          Apply Coupon
        </Button>
      </div>
      <div className="mt-4 flex justify-start">
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
      {/* Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Enter Coupon Code</h2>

            <Input
              placeholder="Enter your coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg mb-4"
            />
            {couponError && (
              <p className="text-red-500 text-sm mb-4">{couponError}</p>
            )}

            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setShowModal(false)}
                className="bg-trasparent border border-primary hover:text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </Button>

              <Button
                onClick={handleCouponApply}
                disabled={!coupon}
                className={`px-6 py-2 rounded-lg ${
                  coupon
                    ? "bg-primary hover:bg-primaryHover text-white"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
