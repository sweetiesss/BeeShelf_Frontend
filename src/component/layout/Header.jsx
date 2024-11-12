import { useContext, useEffect, useRef, useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/img/defaultAvatar.jpg";
import { Bell } from "@phosphor-icons/react";
import { SettingContext } from "../../context/SettingContext";

import { LanguageSelector } from "../shared/ChangeLanguages";
import { useTranslation } from "react-i18next";
import { useDetail } from "../../context/DetailContext";

export function HeaderUnauthenticated() {
  const nav = useNavigate();
  return (
    <div className="flex items-center justify-between h-20 w-full text-black px-4 font-light text-lg header">
      <div className="flex items-center text-2xl font-bold">
        <p>BeShelf</p>
      </div>
      <div className="flex space-x-24 navigate-menu">
        <NavLink
          to="about"
          className={({ isActive, isPending, isTransitioning }) =>
            [
              "menu-item ",
              isPending ? "pending" : "",
              isActive ? "active" : "",
              isTransitioning ? "transitioning" : "",
            ].join("")
          }
        >
          ABOUT
        </NavLink>
        <NavLink
          to="service"
          className={({ isActive, isPending, isTransitioning }) =>
            [
              "menu-item ",
              isPending ? "pending" : "",
              isActive ? "active" : "",
              isTransitioning ? "transitioning" : "",
            ].join("")
          }
        >
          SERVICE
        </NavLink>
        <NavLink
          to="package"
          className={({ isActive, isPending, isTransitioning }) =>
            [
              "menu-item ",
              isPending ? "pending" : "",
              isActive ? "active" : "",
              isTransitioning ? "transitioning" : "",
            ].join("")
          }
        >
          PACKAGE
        </NavLink>
        <NavLink
          to="contact"
          className={({ isActive, isPending, isTransitioning }) =>
            [
              "menu-item ",
              isPending ? "pending" : "",
              isActive ? "active" : "",
              isTransitioning ? "transitioning" : "",
            ].join("")
          }
        >
          CONTACT
        </NavLink>
      </div>
      <div className="flex space-x-4 font-semibold">
        <button
          className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition duration-200"
          onClick={() => nav("/authorize/signin")}
        >
          Sign In
        </button>
        <button
          className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition duration-200"
          onClick={() => nav("/authorize/signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export function HeaderAuthenticated() {
  const [openNotification, setOpenNotification] = useState(false);
  const { userInfor, setUserInfor, setIsAuthenticated, handleLogout } =
    useContext(AuthContext);
  const {
    dataDetail,
    typeDetail,
    updateDataDetail,
    updateTypeDetail,
    refresh,
    setRefresh,
    createRequest,
    setCreateRequest,
  } = useDetail();

  const { settingInfor, setSettingInfor } = useContext(SettingContext);
  const [theme, setTheme] = useState(settingInfor.theme);
  const { t } = useTranslation();
  useEffect(() => {
    document.addEventListener("mousedown", mouseDownEvent);
    return () => {
      document.removeEventListener("mousedown", mouseDownEvent);
    };
  }, []);

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
    handleLogout();
    nav("/");
  };
  const notificationBell = useRef();
  const notificationDropwDown = useRef();
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
  };

  const handleProfileDetail = () => {
    updateTypeDetail("profile")
    console.log(typeDetail);
    
  };

  return (
    <div className="flex items-center justify-end w-full bg-[var(--main-color)] text-[var(--text-main-color)] px-4 border-0 border-b-2 header">
      <div className="flex space-x-5 items-center">
        <LanguageSelector />
        <div className="p-4 relative">
          <input
            type="checkbox"
            className="theme-input"
            id="toggle_checkbox"
            checked={theme === "dark"}
            onChange={changeTheme}
          />

          <label for="toggle_checkbox" className="background-theme">
            <div id="star">
              <div class="star" id="star-1">
                ★
              </div>
              <div class="star" id="star-2">
                ★
              </div>
            </div>
            <div id="moon"></div>
          </label>
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
          onClick={handleProfileDetail}
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
    </div>
  );
}
