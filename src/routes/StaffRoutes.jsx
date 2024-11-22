import { Route, Routes } from "react-router-dom";
import { LayoutLogined } from "../component/shared/Layout";

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


        <Route path="assign" element={<Assign />} />
        

         
        </Route>
      </Routes>
    </div>
  );
}