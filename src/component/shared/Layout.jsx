import { Outlet } from "react-router-dom";
import { HeaderAuthenticated, HeaderUnauthenticated } from "../layout/Header";
import { Sidebar } from "../layout/Sidebar";
import { FooterUnathoirzed } from "../layout/Footer";
import "../../style/Layout.scss";
import HomePage from "../../pages/guest/HomePage";
import ServicePage from "../../pages/guest/ServicePage";
import ContactPage from "../../pages/guest/ContactPage";
import CustomerPage from "../../pages/guest/CustomerPage";
import FeaturePage from "../../pages/guest/FeaturePage";
import PackagePage from "../../pages/guest/PackagePage";

import "../../style/Animation.scss";

export function LayoutGuest() {
  return (
    <div className="max-w-[100vw] overflow-hidden landingPage">
      <HeaderUnauthenticated />
      <div>
        <div id="about" className="section">
          <HomePage />
        </div>
        <div id="service" className="section">
          <ServicePage />
        </div>
        <div id="contact" className="section">
          <ContactPage />
        </div>
        {/*
        <div id="package" className="section">
          <PackagePage />
        </div> */}
      </div>
    </div>
  );
}
export function LayoutLogined() {
  return (
    <div className="flex h-screen layout">
      <div className="w-fit h-full border-0 border-r-2 border-[var(--line-main-color)] sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="h-full w-full body-wrapper overflow-auto">
        <HeaderAuthenticated />
        <div className="w-full  min-h-[calc(100vh-6.75rem)] max-h-[89vh] p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
