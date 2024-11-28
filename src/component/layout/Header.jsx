import { useContext, useEffect, useRef, useState } from "react";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/img/defaultAvatar.jpg";
import { Bell } from "@phosphor-icons/react";
import { SettingContext } from "../../context/SettingContext";

import { LanguageSelector } from "../shared/ChangeLanguages";
import { useTranslation } from "react-i18next";
import { useDetail } from "../../context/DetailContext";
import axios from "axios";

export function HeaderUnauthenticated() {
  const nav = useNavigate();
  const [activeSection, setActiveSection] = useState("about");
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "service", "feature", "customer", "contact"];
      let currentSection = "";

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (
          section &&
          window.scrollY >= section.offsetTop - 100 &&
          window.scrollY < section.offsetTop + section.offsetHeight
        ) {
          currentSection = sectionId;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = (sectionId) => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full px-[300px] py-[23px] fixed bg-white shadow flex justify-between items-center z-10">
      {/* Logo */}
      <div className="flex items-center gap-[20px]">
        <div
          className="text-[#0db977] text-[25px] font-bold cursor-pointer"
          onClick={() => handleScroll("home")}
        >
          BeeShelf
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-[20px] pl-[40px]">
        <button
          className={`menu-item px-[15px] h-[40px] text-lg text-[#848a9f] hover:text-[#0db977] ${
            activeSection === "about"
              ? "font-bold border-b-4 border-[#0db977] text-[#0db977]"
              : ""
          }`}
          onClick={() => handleScroll("about")}
        >
          {t("About")}
        </button>
        <button
          className={`menu-item px-[15px] h-[40px] text-lg text-[#848a9f] hover:text-[#0db977] ${
            activeSection === "service"
              ? "font-bold border-b-4 border-[#0db977] text-[#0db977]"
              : ""
          }`}
          onClick={() => handleScroll("service")}
        >
          {t("Service")}
        </button>
        <button
          className={`menu-item px-[15px] h-[40px] text-lg text-[#848a9f] hover:text-[#0db977] ${
            activeSection === "feature"
              ? "font-bold border-b-4 border-[#0db977] text-[#0db977]"
              : ""
          }`}
          onClick={() => handleScroll("feature")}
        >
          {t("Feature")}
        </button>
        <button
          className={`menu-item px-[15px] h-[40px] text-lg text-[#848a9f] hover:text-[#0db977] ${
            activeSection === "customer"
              ? "font-bold border-b-4 border-[#0db977] text-[#0db977]"
              : ""
          }`}
          onClick={() => handleScroll("customer")}
        >
          {t("Customers")}
        </button>
        <button
          className={`menu-item px-[15px] h-[40px] text-lg text-[#848a9f] hover:text-[#0db977] ${
            activeSection === "contact"
              ? "font-bold border-b-4 border-[#0db977] text-[#0db977]"
              : ""
          }`}
          onClick={() => handleScroll("contact")}
        >
          {t("Contact")}
        </button>
      </div>

      {/* Sign In and Sign Up Buttons */}
      <div className="flex items-center gap-[20px]">
        <LanguageSelector />
        <button
          className="text-[#091540] text-lg font-medium px-4 py-2 rounded hover:bg-[--Xanh-Base] hover:text-white transition focus:outline-none"
          onClick={() => nav("/authorize/signin")}
        >
          {t("SignIn")}
        </button>
        <button
          className="bg-[#0db977] text-white px-4 py-2 rounded hover:bg-[--Xanh-700] transition focus:outline-none"
          onClick={() => nav("/authorize/signup")}
        >
          {t("SignUp")}
        </button>
      </div>
    </div>
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
