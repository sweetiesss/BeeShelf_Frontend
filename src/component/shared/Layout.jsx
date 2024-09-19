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
    <div>
      <div className="absolute w-fit h-full">
        <Sidebar />
      </div>
      <div className="h-full bg-[var(--second-color)]">
        <HeaderAuthenticated />
        <div className="w-full h-full min-h-[calc(100vh-5rem)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
