import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AxiosPayment from "../../services/Payment";

export function PaymentPage() {
  const { userInfor } = useAuth();
  const [option, setOption] = useState("Custom_Amount");
  const [customeAmount, setCustomAmount] = useState();

  const [form, setForm] = useState({
    buyerEmail: userInfor?.email || "",
    cancelUrl: "https://www.beeshelf.com/Partner",
    returnUrl: "https://www.beeshelf.com/Partner",
    description: "test",
  });
//   const [form, setForm] = useState({
//     buyerEmail: userInfor?.email || "",
//     cancelUrl: "/partner/dashboard",
//     returnUrl: "/partner/dashboard",
//     description: `BuyCoins ${
//       userInfor?.email || ""
//     } ${new Date().toISOString()}`,
//   });
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
      if (result.status != 400 && result.status != 500) {
        window.open(
          result?.data?.data?.checkoutUrl,
          "_blank",
          "rel=noopener noreferrer"
        );
      }
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };
  console.log(form);

  return (
    <div>
      <div className="flex gap-10 mb-10">
        <div className="w-full h-[10rem] shadow-xl bg-red-400">10.000</div>
        <div className="w-full h-[10rem] shadow-xl bg-red-400">50.000</div>
        <div className="w-full h-[10rem] shadow-xl bg-red-400">100.000</div>
        <div className="w-full h-[10rem] shadow-xl bg-red-400">200.000</div>
      </div>
      <div>
        <input
          name=""
          type="text"
          min={0}
          max={1000000}
          placeholder="other amount"
          onChange={(e) => setCustomAmount(e.target.value)}
        />
        <button onClick={handleSubmitPayment}>Submit</button>
      </div>
    </div>
  );
}
