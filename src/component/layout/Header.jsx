import { useContext, useEffect, useRef, useState } from "react";
import { message } from "antd";

import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/img/defaultAvatar.jpg";
import { Bell } from "@phosphor-icons/react";
import { SettingContext } from "../../context/SettingContext";

import { LanguageSelector } from "../shared/ChangeLanguages";
import { useTranslation } from "react-i18next";
import { useDetail } from "../../context/DetailContext";
import axios from "axios";

import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";

export function HeaderUnauthenticated() {
  const nav = useNavigate();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center h-20 px-6 lg:px-20 max-w-screen-xl mx-auto">
        {/* Logo */}
        <div
          className="text-3xl font-bold text-blue-600 cursor-pointer"
          onClick={() => nav("/")}
        >
          BeShelf
        </div>
  
        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-10">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              [
                "text-lg font-medium transition-colors duration-200 hover:text-blue-600",
                isActive ? "text-blue-600 underline decoration-2" : "text-gray-700",
              ].join(" ")
            }
          >
            ABOUT
          </NavLink>
          <NavLink
            to="/service"
            className={({ isActive }) =>
              [
                "text-lg font-medium transition-colors duration-200 hover:text-blue-600",
                isActive ? "text-blue-600 underline decoration-2" : "text-gray-700",
              ].join(" ")
            }
          >
            SERVICE
          </NavLink>
          <NavLink
            to="/package"
            className={({ isActive }) =>
              [
                "text-lg font-medium transition-colors duration-200 hover:text-blue-600",
                isActive ? "text-blue-600 underline decoration-2" : "text-gray-700",
              ].join(" ")
            }
          >
            PACKAGE
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              [
                "text-lg font-medium transition-colors duration-200 hover:text-blue-600",
                isActive ? "text-blue-600 underline decoration-2" : "text-gray-700",
              ].join(" ")
            }
          >
            CONTACT
          </NavLink>
        </nav>
  
        {/* Auth Buttons */}
        <div className="flex space-x-5">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition-all duration-200"
            onClick={() => nav("/authorize/signin")}
          >
            Sign In
          </button>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition-all duration-200"
            onClick={() => nav("/authorize/signup")}
          >
            Sign Up
          </button>
        </div>
  
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            className="text-gray-700 focus:outline-none"
            onClick={() => console.log("Toggle mobile menu")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
  
}



export function HeaderAuthenticated() {
  const [openNotification, setOpenNotification] = useState(false);
  const {
    userInfor,
    setUserInfor,
    setIsAuthenticated,
    handleLogout,
    authWallet,
    setAuthWallet,
    isAuthenticated,
    refrestAuthWallet,
    setRefrestAuthWallet,
  } = useContext(AuthContext);
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
    getAuthWalletMoney();
    return () => {
      document.removeEventListener("mousedown", mouseDownEvent);
    };
  }, []);
  useEffect(() => {
    getAuthWalletMoney();
  }, [refrestAuthWallet]);

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
    updateTypeDetail("profile");
    console.log(typeDetail);
  };

  const handleAddingCoinsButton = () => {
    nav("payment");
  };

  const getAuthWalletMoney = async () => {
    try {
      if (userInfor?.roleName === "Partner" && userInfor?.roleId == 2) {
        if (userInfor && isAuthenticated) {
          console.log("check tokeen", isAuthenticated);

          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL_API}partner/get-wallet/${userInfor?.id}`,
            {
              headers: {
                Authorization: `Bearer ${isAuthenticated}`,
              },
            }
          );
          console.log(response);

          setAuthWallet(response.data);
        }
      } else {
        return;
      }
    } catch (error) {
      console.error(
        "Error fetching wallet:",
        error.response?.data || error.message
      );
    } finally {
    }
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
        {authWallet && (
          <div
            className="w-[10rem] cursor-pointer"
            onClick={handleAddingCoinsButton}
          >
            {authWallet?.totalAmount}
          </div>
        )}
        <button
          className="bg-white text-blue-500 border rounded-full overflow-hidden h-fit hover:bg-blue-600 hover:text-white transition duration-200"
          onClick={handleProfileDetail}
        >
          <img
            src={userInfor?.pictureLink || defaultAvatar}
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
