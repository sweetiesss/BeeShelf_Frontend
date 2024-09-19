import { House } from "@phosphor-icons/react";
import React from "react";
import { NavLink } from "react-router-dom";

// const routePartner = [
//   { icon: House, link: "dashboard", label: "Dashboard" },
// ];
import { PartnerRouterInfor } from "../../routes/PartnerRoutes";
export function Sidebar() {
  return (
    <div className="w-64 h-full bg-[var(--main-color)] text-black flex flex-col border-0 border-r-2 border-[var(--line-main-color)]">
      <div className="w-full flex items-center justify-center text-4xl font-bold h-20">
        <p>
          <span className="text-[var(--main-project-color)]">Bee</span>Shelf
        </p>
      </div>
      <nav className="flex flex-col flex-grow px-4 text-[var(--text-second-color)] sidebar-navigate space-y-4">
        {PartnerRouterInfor.map((item) => (
          <NavLink
            to={item.path}
            className={`flex items-start navigate-menu p-2 rounded-lg  ${({
              isActive,
              isPending,
              isTransitioning,
            }) =>
              [
                isPending ? "pending" : "",
                isActive ? "active" : "",
                isTransitioning ? "transitioning" : "",
              ].join("")}`}
          >
            <item.icon className="icon"size={24} weight="fill" />
            <p className="px-2 transition-colors text-lg">{item.label}</p>
          </NavLink>
        ))}
      </nav>
      <div className="p-4">© 2024 My Company</div>
    </div>
  );
}
