import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/partner/HomePage";
import { LayoutLogined } from "../component/shared/Layout";
import ProfilePage from "../pages/shared/ProfilePage";
import ProductPage from "../pages/partner/ProductPage"
import EditProfilePage from "../pages/shared/EditProfilePage";
import { AddressBook, Bag, House, Package, Warehouse } from "@phosphor-icons/react";

export const PartnerRouterInfor = [
  {icon: House,path: "dashboard",index: true,element: HomePage,label: "Dashboard"},
  {icon: Warehouse,path: "warehouse",index: false,element: HomePage,label: "Warehouse"},
  {icon: Package,path: "inventory",index: false,element: HomePage,label: "Inventory"},
  {icon: Bag,path: "product",index: false,element: ProductPage,label: "Product"},
  {icon: AddressBook ,path: "order",index: false,element: HomePage,label: "Order"},
];
export default function PartnerRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<LayoutLogined />}>
      {PartnerRouterInfor.map((item, key) => (
          item.index ? (
            <Route key={key} index element={<item.element />} />
          ) : (
            <Route key={key} path={item.path} element={<item.element />} />
          )
        ))}
        {/* <Route path="product" element={<ProductPage />} /> */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="editProfile" element={<EditProfilePage />} />
      </Route>
    </Routes>
  );
}
