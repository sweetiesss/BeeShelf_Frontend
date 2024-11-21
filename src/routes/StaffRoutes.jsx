import { Route, Routes } from "react-router-dom";
import { LayoutLogined, LayoutStaff } from "../component/shared/Layout";
import EditProfilePage from "../pages/shared/EditProfilePage";
import DetailSlide from "../pages/shared/DetailSlide";
import { useDetail } from "../context/DetailContext";
import Assign from "../component/staff/assign/Assign";

export default function StaffRoutes() {
  const { dataDetail, typeDetail } = useDetail();

  return (
    <div className="relative">
      {typeDetail && <DetailSlide />}
      <Routes>
        <Route path="/*" element={<LayoutLogined />}>

          {/* <Route index element={<DashboardStaff />} /> */}
          {/* <Route path={"dashboardstaff"} element={<DashboardStaff />} /> */}
          <Route path="assign" element={<Assign />} />
          {/* <Route path={"managedelivery"} element={<ManageDelivery />} /> */}

          {/* <Route path={"request"} element={<RequestPage />} /> */}

          {/* <Route path={"assignshipper"} element={<AssignShipper />} /> */}

          {/* <Route path="editProfile" element={<EditProfilePage />} /> */}

        </Route>
      </Routes>
    </div>
  );
}