import { House } from "@phosphor-icons/react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// const routePartner = [
//   { icon: House, link: "dashboard", label: "Dashboard" },
// ];
import { PartnerRouterInfor } from "../../routes/PartnerRoutes";
export function Sidebar() {
  const [isSlideOut, setSlideOut] = useState(false);
  return (
    <div
      className={`${
        !isSlideOut && "slide-out"
      } h-full bg-[var(--main-color)] text-black flex flex-col sidebar relative`}
    >
      <button
        className="absolute -right-[0.625rem] top-20 bg-[var(--text-second-color)] w-5 flex justify-center items-center h-5"
        onClick={() => setSlideOut((prev) => !prev)}
      >
        <div className={`bg-white w-4 h-4 flex ${isSlideOut&&"justify-end"} `}>
          <div className="bg-[var(--main-project-color)] w-2 h-4 "></div>
        </div>
      </button>
      <div className="w-full flex items-center justify-center text-4xl font-bold h-20">
        {isSlideOut ? (
          <p>
            <span className="text-[var(--main-project-color)]">Bee</span>Shelf
          </p>
        ) : (
          <p>
            <span className="text-[var(--main-project-color)]">B</span>S
          </p>
        )}
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
            <item.icon className="icon" size={24} weight="fill" />
            {isSlideOut && (
              <p className="px-2 transition-colors text-lg">{item.label}</p>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4">© 2024 My Company</div>
    </div>
  );
}
