import { Route, Routes } from "react-router-dom";
import { LayoutLogined } from "../component/shared/Layout";
import ProfilePage from "../pages/shared/ProfilePage";
import EditProfilePage from "../pages/shared/EditProfilePage";
import { PartnerRouterInfor } from "../component/constants/Router";

export default function PartnerRoutes() {
  console.log(PartnerRouterInfor);
  
  return (
    <Routes>
      <Route path="/*" element={<LayoutLogined />}>
        {PartnerRouterInfor.map((item, key) =>
          item.index ? (
            <Route key={key} index element={<item.element />} />
          ) : (
            <Route key={key} path={item.path} element={<item.element />} />
          )
        )}
        {/* <Route path="product" element={<ProductPage />} /> */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="editProfile" element={<EditProfilePage />} />
      </Route>
    </Routes>
  );
}
