import { Outlet } from "react-router-dom";
import { HeaderAuthenticated, HeaderUnauthenticated } from "../layout/Header";
import { Sidebar } from "../layout/Sidebar";

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
      <div className="absolute w-full h-fit">
        <HeaderAuthenticated />
      </div>
      <div className="pt-[5rem]">
        <div className="absolute w-fit h-[calc(100%-5rem)]">
          {/* <Sidebar /> */}
        </div>
        <Outlet />
      </div>
    </div>
  );
}
