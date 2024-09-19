import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/partner/HomePage";
import { LayoutLogined } from "../component/shared/Layout";
import ProfilePage from "../pages/shared/ProfilePage";
import EditProfilePage from "../pages/shared/EditProfilePage";
import { AddressBook, Bag, House, Package, Warehouse } from "@phosphor-icons/react";

export const PartnerRouterInfor = [
  {icon: House,path: "dashboard",index: true,element: HomePage,label: "Dashboard"},
  {icon: Warehouse,path: "warehouse",index: true,element: HomePage,label: "Warehouse"},
  {icon: Package,path: "inventory",index: true,element: HomePage,label: "Inventory"},
  {icon: Bag,path: "product",index: true,element: HomePage,label: "Product"},
  {icon: AddressBook ,path: "order",index: true,element: HomePage,label: "Order"},
];
export default function PartnerRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<LayoutLogined />}>
        {PartnerRouterInfor.map((item, key) => (
          <Route index={item.index} element={<item.element/>} />
        ))}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="editProfile" element={<EditProfilePage />} />
      </Route>
    </Routes>
  );
}
