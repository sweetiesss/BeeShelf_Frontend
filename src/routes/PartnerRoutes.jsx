import { Route, Routes } from "react-router-dom";
import { LayoutLogined } from "../component/shared/Layout";
import {
  PartnerRouterInfor,
  PartnerRouterNoneSider,
} from "../component/constants/Router";

export default function PartnerRoutes() {
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
        {PartnerRouterNoneSider.map((item, key) => (
          <Route key={key} path={item.path} element={<item.element />} />
        ))}
      </Route>
    </Routes>
  );
}
