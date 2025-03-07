function SuccessModal({ setShowSuccess }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-gray-800">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600 mt-2">
          Thank you for booking an appointment. We will contact you soon!
        </p>
        <button
          onClick={() => setShowSuccess(false)}
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
