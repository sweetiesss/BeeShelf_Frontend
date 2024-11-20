import { Route, Routes } from "react-router-dom";
import { LayoutLogined } from "../component/shared/Layout";
import { LayoutStaff } from "../component/shared/Layout";


import ManageRequest from "../component/staff/managerequest/ManageRequest";
import Warehouseinventory from "../component/staff/warehouseinventory/Managedelivery";
import Managedelivery from "../component/staff/managedelivery/Managedelivery";

import RequestPage from "../pages/staff/RequestPage";
import ProfilePage from "../pages/shared/ProfilePage";
import EditProfilePage from "../pages/shared/EditProfilePage";
import DetailSlide from "../pages/shared/DetailSlide";
import { useDetail } from "../context/DetailContext";
import { Layout } from "@phosphor-icons/react";
import { Dashboard } from "../pages/partner/HomePage";

export default function StaffRoutes() {
  const { dataDetail, typeDetail } = useDetail();  
  return (
    <div className="relative">
      {typeDetail && <DetailSlide />}
      <Routes>
        <Route path="/*" element={<LayoutLogined />}>
          <Route index element={<DashboardStaff/> } /> 
          <Route path={"dashboardstaff"} element={<DashboardStaff/>} />
          <Route path={"assign"} element={<WarehouseInventory />} />
          <Route path={"managedelivery"} element={<ManageDelivery />} />
          

          <Route path={"request"} element={<RequestPage />} />

          <Route path={"assignshipper"} element={<AssignShipper/>} />
        

          <Route path="editProfile" element={<EditProfilePage />} />
        </Route>
      </Routes>
    </div>
  );
}