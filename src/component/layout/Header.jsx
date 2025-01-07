import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/img/defaultAvatar.jpg";
import { CreditCard } from "@phosphor-icons/react";
import { SettingContext } from "../../context/SettingContext";
import { LanguageSelector } from "../shared/ChangeLanguages";
import { useTranslation } from "react-i18next";
import { useDetail } from "../../context/DetailContext";
import axios from "axios";

export function HeaderUnauthenticated() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("about");

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
      <div className="flex items-center gap-[20px]">
        <div
          className="text-[#0db977] text-[25px] font-bold cursor-pointer  relative"
          onClick={() => handleScroll("home")}
        >
          <img
            src="../../../beeShelf.png"
            className="h-[5rem] w-fit absolute top-[-25px] left-[-85px]"
          />
          <p>BeeShelf</p>
        </div>
      </div>
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
            activeSection === "contact"
              ? "font-bold border-b-4 border-[#0db977] text-[#0db977]"
              : ""
          }`}
          onClick={() => handleScroll("contact")}
        >
          {t("Contact")}
        </button>
      </div>
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
  const { t } = useTranslation();
  const {
    userInfor,
    handleLogout,
    authWallet,
    setAuthWallet,
    isAuthenticated,
    refrestAuthWallet,
  } = useContext(AuthContext);
  const { updateTypeDetail } = useDetail();

  const [openNotification, setOpenNotification] = useState(false);

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
  const nav = useNavigate();

  const logout = () => {
    handleLogout();
    nav("/");
  };

  const notificationDropwDown = useRef();
  const mouseDownEvent = (event) => {
    if (
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
  };

  const handleAddingCoinsButton = () => {
    nav("payment");
  };

  const getAuthWalletMoney = async () => {
    try {
      if (userInfor?.roleName === "Partner" && userInfor?.roleId == 2) {
        if (userInfor && isAuthenticated) {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL_API}partner/get-wallet/${userInfor?.id}`,
            {
              headers: {
                Authorization: `Bearer ${isAuthenticated}`,
              },
            }
          );
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
      <div className="flex gap-10 items-center">
        <LanguageSelector />
        {authWallet && userInfor?.roleName === "Partner" && (
          <div
            className="w-fit cursor-pointer flex gap-4 items-center"
            onClick={handleAddingCoinsButton}
          >
            <CreditCard weight="duotone" className="text-3xl" />
            <span className="border-b-2 border-black">
              {new Intl.NumberFormat().format(authWallet?.totalAmount)} vnd
            </span>
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
