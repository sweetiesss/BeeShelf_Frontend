import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AxiosPayment from "../../services/Payment";
import { useNavigate } from "react-router-dom";

export function PaymentPage() {
  const { userInfor } = useAuth();
  const [option, setOption] = useState("Custom_Amount");
  const [customeAmount, setCustomAmount] = useState();
  const nav = useNavigate();

  const [form, setForm] = useState({
    buyerEmail: userInfor?.email || "",
    cancelUrl: "https://www.beeshelf.com/Partner",
    returnUrl: "https://www.beeshelf.com/Partner",
    description: "test",
  });
  const { createQrCode } = AxiosPayment();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmitPayment = async () => {
    console.log(option);
    console.log(customeAmount);
    console.log(form);
  
    try {
      const result = await createQrCode(option, customeAmount, form);
  
      if (result.status !== 400 && result.status !== 500) {
        // Navigate directly to the checkout URL
        const checkoutUrl = result?.data?.data?.checkoutUrl;
        if (checkoutUrl) {
          window.location.href = checkoutUrl; // Navigate the current tab
        } else {
          console.error("Checkout URL not found in response");
        }
      } else {
        console.error("Invalid response status:", result.status);
      }
  
      console.log(result);
    } catch (e) {
      console.error("Error during payment creation:", e);
    }
  };
  
  console.log(form);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 shadow-lg rounded-lg bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Choose Your Payment Amount
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {/* Predefined Amount Options */}
        {["10000", "50000", "100000", "200000"].map((amount) => (
          <div
            key={amount}
            className={`p-4 text-center rounded-lg cursor-pointer shadow-md transition-all ${
              customeAmount === amount
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => {
              setCustomAmount(amount);
            }}
          >
            {parseInt(amount).toLocaleString()}₫
          </div>
        ))}
      </div>
      <div className="text-center mb-6 text-gray-500">or</div>
      <div className="flex items-center justify-center gap-4">
        {/* Custom Amount Input */}
        <input
          type="number"
          min={0}
          max={1000000}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-sm"
          placeholder="Enter custom amount"
          value={customeAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
          }}
        />
        <span className="text-gray-500">₫</span>
      </div>
      <div className="mt-8 text-center">
        {/* Submit Button */}
        <button
          onClick={handleSubmitPayment}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all"
        >
          Generate QR Code
        </button>
      </div>
    </div>
  );
}
