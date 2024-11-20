import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/guest/HomePage";
import { LayoutGuest } from "../component/shared/Layout";
import ServicePage from "../pages/guest/ServicePage";
import PackagePage from "../pages/guest/PackagePage";
import ContactPage from "../pages/guest/ContactPage";
import LoginAndSignInPage from "../pages/guest/LoginAndSignInPage";

export default function GuestRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<LayoutGuest />}>
        <Route index path="about" element={<HomePage />} />
        <Route path="service" element={<ServicePage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="package" element={<PackagePage />} />
      </Route>
      <Route path="/authorize/*" element={<LoginAndSignInPage />} />

    </Routes>
  );
}
