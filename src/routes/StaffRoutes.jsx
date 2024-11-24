import { Route, Routes } from "react-router-dom";
import { LayoutLogined } from "../component/shared/Layout";

import DetailSlide from "../pages/shared/DetailSlide";
import { useDetail } from "../context/DetailContext";
import Assign from "../component/staff/assign/Assign";
import Inventory from "../pages/staff/InventoryStaff";
import Ordermanage from "../component/staff/ordermanage/Ordermanage";
// import Orderdetail from "../component/staff/assign/Orderdetail"; 

export default function StaffRoutes() {
  const { dataDetail, typeDetail } = useDetail();  
  return (
    <div className="relative">
      {typeDetail && <DetailSlide />}
      <Routes>
        <Route path="/*" element={<LayoutLogined />}>


        <Route path="assign" element={<Assign />} />
        <Route path="warehouseinventory" element={<Inventory/>}/>
        <Route path="ordermanage" element={<Ordermanage/>} />
         {/* <Route path="assign/Orderdetail" element={<Orderdetail/>}/> */}
        </Route>
      </Routes>
    </div>
  );
}