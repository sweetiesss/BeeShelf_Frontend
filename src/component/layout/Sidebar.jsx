import { Moon, SunDim } from "@phosphor-icons/react";
import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";

// const routePartner = [
//   { icon: House, link: "dashboard", label: "Dashboard" },
// ];
import { PartnerRouterInfor } from "../constants/Router";
import { SettingContext } from "../../context/SettingContext";
import { useTranslation } from "react-i18next";
export function Sidebar() {
  const [isSlideOut, setSlideOut] = useState(false);
  const { t } = useTranslation();

  // const { settingInfor, setSettingInfor } = useContext(SettingContext);
  // const [theme, setTheme] = useState(settingInfor.theme);

  // const changeTheme = () => {
  //   const newTheme = theme === "light" ? "dark" : "light";
  //   setTheme(newTheme);
  //   setSettingInfor((prev) => ({
  //     ...prev,
  //     theme: newTheme,
  //   }));
  // };
  return (
    <div
      className={`${
        !isSlideOut && "slide-out"
      } h-full bg-[var(--main-color)] text-[var(--text-main-color)] flex flex-col sidebar relative`}
    >
      <button
        className="absolute -right-[0.625rem] top-20 bg-[var(--text-second-color)] w-5 flex justify-center items-center h-5"
        onClick={() => setSlideOut((prev) => !prev)}
      >
        <div
          className={`bg-white w-4 h-4 flex ${isSlideOut && "justify-end"} `}
        >
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
      <nav className="flex flex-col flex-grow items-center text-[var(--text-second-color)] sidebar-navigate space-y-4">
        {PartnerRouterInfor.map((item, num) => (
          <NavLink
            to={item.path}
            key={num}
            className={`flex navigate-menu  ${({
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
            <div className="sidebar-menu-container">
              <item.icon className="icon" weight="fill" />
              <p className="label">{t(item.label)}</p>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* <div className="p-4 relative">
        <div
          className={` bg-theme-change ${
            theme === "light" ? "light-mode" : "dark-mode"
          }`}
          onClick={changeTheme}
        >
          <div className="theme-button ">
            {theme === "light" ? (
              <>
                <SunDim weight="fill" className="rounded-full bg-white text-yellow-400  " />
                <p className="text-left pl-2 text-black">Light</p>
              </>
            ) : (
              <>
                <p className="text-right pr-2">Dark</p>
                <Moon weight="fill" className="rounded-full bg-white text-gray-400 p-[0.25rem]" />
              </>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
}
