import { Route, Routes } from "react-router-dom";
import { LayoutLogined } from "../component/shared/Layout";
import DetailSlide from "../pages/shared/DetailSlide";
import { useDetail } from "../context/DetailContext";

import PaymentResult from "../pages/partner/PaymentResult";

export default function PartnerRoutes() {
  const { dataDetail, typeDetail } = useDetail();

  return (
    <div className="relative">
      {typeDetail && <DetailSlide />}
      <Routes>
        <Route path="/*" element={<LayoutLogined />}>
          
          <Route path="payment/result" element={<PaymentResult />} />
        </Route>
      </Routes>
    </div>
  );
}
