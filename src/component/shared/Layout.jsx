import { Outlet } from "react-router-dom";
import { HeaderAuthenticated, HeaderUnauthenticated } from "../layout/Header";
import { Sidebar } from "../layout/Sidebar";
import "./Layout.scss";

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
      <div className="h-full bg-[var(--second-color)] w-full body-wrapper">
        <HeaderAuthenticated />
        <div className="w-full  min-h-[calc(100vh-5rem)] p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
