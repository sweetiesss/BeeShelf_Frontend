import { Route, Routes } from "react-router-dom";
import { LayoutLogined } from "../component/shared/Layout";

import { HomePage } from "../pages/partner/HomePage";
import ProductPage from "../pages/partner/ProductPage";
import OrderDashboard from "../component/partner/dashboard/OrderDashboard";
import InventoryPage from "../pages/partner/InventoryPage";
import OrderPage from "../pages/partner/OrderPage";
import RequestPage from "../pages/partner/RequestPage";
import ImportProductExcel from "../pages/partner/ImportProductExcel";
import AddProductPage from "../pages/partner/AddProductPage";
import ProfilePage from "../pages/shared/ProfilePage";
import EditProfilePage from "../pages/shared/EditProfilePage";
import DetailSlide from "../pages/shared/DetailSlide";
import { useDetail } from "../context/DetailContext";
import { PaymentPage } from "../pages/partner/PaymentPage";
import PaymentResult from "../pages/partner/PaymentResult";
import CreateOrderPage from "../pages/partner/CreateOrder";
import CreateRequestPage from "../pages/partner/CreateRequestPage";
import LotsPage from "../pages/partner/LotsPage";
import UpdateOrderPage from "../pages/partner/UpdateOrder";
import UpdateRequestPage from "../pages/partner/UpdateRequestPage";
export default function PartnerRoutes() {
  const { dataDetail, typeDetail } = useDetail();

  return (
    <div className="relative">
      {typeDetail && <DetailSlide />}
      <Routes>
        <Route path="/*" element={<LayoutLogined />}>
          <Route index element={<OrderDashboard />} />
          <Route path={"dashboard"} element={<OrderDashboard />} />
          <Route path={"inventory"} element={<InventoryPage />} />
          <Route path={"lots"} element={<LotsPage />} />
          <Route path={"product"} element={<ProductPage />} />
          <Route path={"order"} element={<OrderPage />} />
          <Route path={"order/create-order"} element={<CreateOrderPage />} />
          <Route path={"order/update-order"} element={<UpdateOrderPage />} />

          <Route path={"request"} element={<RequestPage />} />
          <Route
            path={"request/create-request"}
            element={<CreateRequestPage />}
          />
          <Route
            path={"request/update-request"}
            element={<UpdateRequestPage />}
          />

          <Route
            path="product/import_product"
            element={<ImportProductExcel />}
          />
          <Route path="product/add_product" element={<AddProductPage />} />
          {/* <Route path="profile" element={<ProfilePage />} /> */}
          <Route path="editProfile" element={<EditProfilePage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="payment/result" element={<PaymentResult />} />
        </Route>
      </Routes>
    </div>
  );
}
