import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/guest/HomePage";
import { LayoutGuest } from "../component/shared/Layout";

import SignUp from "../component/guest/SignUp";
import SignIn from "../component/guest/SignIn";
import ForgotPassword from "../component/guest/ForgotPassword";
import ServicePage from "../pages/guest/ServicePage";
import PackagePage from "../pages/guest/PackagePage";
import ContactPage from "../pages/guest/ContactPage";

export default function GuestRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<LayoutGuest />}>
        <Route index path="about" element={<HomePage />} />
        <Route path="service" element={<ServicePage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="package" element={<PackagePage />} />
      </Route>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
    </Routes>
  );
}
