import { Outlet } from "react-router-dom";
import { HeaderAuthenticated, HeaderUnauthenticated } from "../layout/Header";
import { Sidebar } from "../layout/Sidebar";
import "../../style/Layout.scss";

export function LayoutGuest() {
  return (
    <div>
      <div>
        <HeaderUnauthenticated />
      </div>
      <div>
        <Outlet />
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
        <div className="w-full  min-h-[calc(100vh-6.7rem)] max-h-[90vh] p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
