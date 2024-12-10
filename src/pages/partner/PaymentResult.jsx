import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AxiosPayment from "../../services/Payment";

export default function PaymentResult() {
  const [status, setStatus] = useState("failure");

  const nav = useNavigate();
  const location = useLocation();
  const { confirmPayment } = AxiosPayment();
  console.table(location);
  useEffect(() => {
    submitPayment();
  }, []);

  const submitPayment = async () => {
    const params = new URLSearchParams(location.search);
    const form = {};
    for (const [key, value] of params.entries()) {
      form[key] = value;
    }
    console.log(form);
    const submitForm = { ...form, cancel: form.cancel === "true" };
    console.log(submitForm);
    setStatus(submitForm.status);
    const confirming = await confirmPayment(submitForm);
    console.log(confirming);
  };

  const statusStyles = {
    success: "bg-green-100 text-green-700 border-green-300",
    failure: "bg-red-100 text-red-700 border-red-300",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  const statusMessages = {
    PAID: "Payment Successful!",
    CANCELLED: "Payment Failed",
  };

  return (
    <div className="w-full h-[50vh] flex justify-center items-center">
      <div
        className={`w-[80vw] max-w-[600px] bg-white rounded-lg shadow-lg border p-6 flex flex-col items-center text-center ${statusStyles[status]}`}
      >
        {/* Status Icon */}
        <div className="text-6xl mb-4">
          {status === "PAID" && "✅"}
          {status === "CANCELLED" && "❌"}
        </div>

        {/* Status Message */}
        <h2 className="text-2xl font-bold mb-2">{statusMessages[status]}</h2>

        {/* Details Section */}
        <p className="text-sm text-gray-600">
          {status === "PAID" && "Thank you for believing in our services."}
          {status === "CANCELLED" && "The payment was canceled."}
        </p>

        {/* Actions */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => (window.location.href = "/partner/payment")}
          >
            Go to Payment page
          </button>
          {status === "CANCELLED" && (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={() => nav("../payment")}
            >
              Retry Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
