import { useContext, useEffect, useRef, useState } from "react";

import BeShelf from "../../assets/icons/BeShelf.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/img/defaultAvatar.jpg";
import { Bell, Moon, SunDim } from "@phosphor-icons/react";
import { SettingContext } from "../../context/SettingContext";
import { LANGUAGES } from "../constants/Language";
import { LanguageSelector } from "../../pages/shared/ChangeLanguages";
import { useTranslation } from "react-i18next";

export function HeaderUnauthenticated() {
  const nav = useNavigate();
  return (
    <div className="flex items-center justify-between h-20 w-full bg-blue-500 text-white px-4">
      <div className="flex items-center">
        <img src={BeShelf} alt="BeShelf Logo" className="h-24 w-auto" />
      </div>
      <div className="flex space-x-4">
        <NavLink
          to="#"
          className={({ isActive, isPending, isTransitioning }) =>
            [
              isPending ? "pending" : "",
              isActive ? "active" : "",
              isTransitioning ? "transitioning" : "",
            ].join("")
          }
        >
          1
        </NavLink>
        <NavLink
          to="#"
          className={({ isActive, isPending, isTransitioning }) =>
            [
              isPending ? "pending" : "",
              isActive ? "active" : "",
              isTransitioning ? "transitioning" : "",
            ].join("")
          }
        >
          2
        </NavLink>
        <NavLink
          to="#"
          className={({ isActive, isPending, isTransitioning }) =>
            [
              isPending ? "pending" : "",
              isActive ? "active" : "",
              isTransitioning ? "transitioning" : "",
            ].join("")
          }
        >
          3
        </NavLink>
        <NavLink
          to="#"
          className={({ isActive, isPending, isTransitioning }) =>
            [
              isPending ? "pending" : "",
              isActive ? "active" : "",
              isTransitioning ? "transitioning" : "",
            ].join("")
          }
        >
          4
        </NavLink>
        <NavLink
          to="#"
          className={({ isActive, isPending, isTransitioning }) =>
            [
              isPending ? "pending" : "",
              isActive ? "active" : "",
              isTransitioning ? "transitioning" : "",
            ].join("")
          }
        >
          5
        </NavLink>
      </div>
      <div className="flex space-x-4">
        <button
          className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition duration-200"
          onClick={() => nav("/signin")}
        >
          Sign In
        </button>
        <button
          className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition duration-200"
          onClick={() => nav("/signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
export function HeaderAuthenticated() {
  const [openUserInfor, setOpenUserInfor] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const { isAuthenticated, setIsAuthenticated, userInfor, setUserInfor } =
    useContext(AuthContext);
  const { settingInfor, setSettingInfor } = useContext(SettingContext);
  const [theme, setTheme] = useState(settingInfor.theme);
  const { t } = useTranslation();

  const changeTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setSettingInfor((prev) => ({
      ...prev,
      theme: newTheme,
    }));
  };
  const nav = useNavigate();

  const logout = () => {
    setIsAuthenticated(false);
    setUserInfor(null);
    nav("/");
  };
  const notificationBell = useRef();
  const notificationDropwDown = useRef();
  const profileAvatar = useRef();
  const profileDropDown = useRef();
  const mouseDownEvent = (event) => {
    if (
      notificationBell.current &&
      notificationBell.current.contains(event.target)
    ) {
      setOpenNotification((prev) => !prev);
    } else if (
      notificationDropwDown.current &&
      notificationDropwDown.current.contains(event.target)
    ) {
      return;
    } else {
      setOpenNotification(false);
    }
    if (profileAvatar.current && profileAvatar.current.contains(event.target)) {
      setOpenUserInfor((prev) => !prev);
    } else if (
      profileDropDown.current &&
      profileDropDown.current.contains(event.target)
    ) {
      return;
    } else {
      setOpenUserInfor(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", mouseDownEvent);
    return () => {
      document.removeEventListener("mousedown", mouseDownEvent);
    };
  }, []);

  return (
    <div className="flex items-center justify-end h-20 w-full bg-[var(--main-color)] text-[var(--text-main-color)] px-4 border-0 border-b-2">
      <div className="flex space-x-5 items-center">
        <LanguageSelector />
        <div className="p-4 relative">
          <div
            className={` bg-theme-change ${
              theme === "light" ? "light-mode" : "dark-mode"
            }`}
            onClick={changeTheme}
          >
            <div className="theme-button ">
              {theme === "light" ? (
                <>
                  <SunDim
                    weight="fill"
                    className="rounded-full bg-white text-yellow-400  "
                  />
                  <p className="text-left pl-2 text-black w-fit text-nowrap">
                    {t("Light")}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-right pr-2 w-fit text-nowrap">
                    {t("Dark")}
                  </p>
                  <Moon
                    weight="fill"
                    className="rounded-full bg-white text-gray-400 p-[0.25rem]"
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <button
          className={
            "rounded-full w-8 h-8 flex justify-center items-center notification-bell"
          }
          ref={notificationBell}
        >
          <Bell size={24} weight="fill" />
        </button>
        <button
          className="bg-white text-blue-500 border rounded-full overflow-hidden h-fit hover:bg-blue-600 hover:text-white transition duration-200"
          ref={profileAvatar}
        >
          <img
            src={userInfor?.picture || defaultAvatar}
            className="relative w-10 h-10"
            alt="User Avatar"
          ></img>
        </button>
      </div>
      {openNotification && (
        <div
          className="absolute right-20 mt-2 w-48  rounded-lg shadow-lg z-10 top-20"
          ref={notificationDropwDown}
        >
          <div className=" text-gray-700 flex flex-col profile">
            <NavLink
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer rounded-t-lg "
              exact="true"
              to="profile"
            >
              {t("Profile")}
            </NavLink>
            <NavLink
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
              exact="true"
              to="setting"
            >
              {t("Settings")}
            </NavLink>
            <NavLink
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
              exact="true"
              to="notification"
            >
              {t("Notification")}
            </NavLink>
            <NavLink
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
              exact="true"
              to="help"
            >
              {t("Help")}
            </NavLink>
            <div
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer rounded-b-lg"
              onClick={logout}
            >
              {t("Logout")}
            </div>
          </div>
        </div>
      )}
      {openUserInfor && (
        <div
          className="absolute right-4 mt-2 w-48  rounded-lg shadow-lg z-10 top-20"
          ref={profileDropDown}
        >
          <div className=" text-gray-700 flex flex-col profile">
            <NavLink
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer rounded-t-lg "
              exact="true"
              to="profile"
            >
              {t("Profile")}
            </NavLink>
            <NavLink
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
              exact="true"
              to="setting"
            >
              {t("Settings")}
            </NavLink>
            <NavLink
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
              exact="true"
              to="notification"
            >
              {t("Notification")}
            </NavLink>
            <NavLink
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
              exact="true"
              to="help"
            >
              {t("Help")}
            </NavLink>
            <div
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer rounded-b-lg"
              onClick={logout}
            >
              {t("Logout")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
