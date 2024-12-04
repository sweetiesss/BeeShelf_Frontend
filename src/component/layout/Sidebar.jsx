import React, { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  House,
  Warehouse,
  Package,
  Bag,
  AddressBook,
  Archive,
  Aperture,
  CreditCard,
  CarProfile,
  TreasureChest,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import { use } from "i18next";
export function Sidebar() {
  const [isSlideOut, setSlideOut] = useState(false);
  const { t } = useTranslation();
  const { userInfor } = useContext(AuthContext);
  const location = useLocation();
  return (
    <div
      className={`${
        !isSlideOut && "slide-out"
      } h-full bg-[var(--Xanh-Base)] text-[var(--en-vu-200)] flex flex-col sidebar relative`}
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
      <div className="flex justify-center items-center w-full h-20 text-4xl font-bold">
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
      <nav className="flex flex-col flex-grow items-center text-[var(--en-vu-200)] sidebar-navigate space-y-4">
        {userInfor?.roleName === "Partner" && (
          <>
            <NavLink to="dashboard" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <House className="icon" weight="bold" />
                <p className="label">{t("Dashboard")}</p>
              </div>
            </NavLink>

            <NavLink to="inventory" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <Package className="icon" weight="bold" />
                <p className="label">{t("Inventory")}</p>
              </div>
            </NavLink>

            <NavLink to="product" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <Bag className="icon" weight="bold" />
                <p className="label">{t("Product")}</p>
              </div>
            </NavLink>

            <NavLink to="order" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <AddressBook className="icon" weight="bold" />
                <p className="label">{t("Order")}</p>
              </div>
            </NavLink>

            <NavLink to="request" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <AddressBook className="icon" weight="bold" />
                <p className="label">{t("Request")}</p>
              </div>
            </NavLink>
          </>
        )}
        {userInfor?.roleName === "Manager" && (
          <>
            <NavLink
              to={
                location.pathname.toLocaleLowerCase() === "/manager"
                  ? ""
                  : "dashboard"
              }
              className="flex navigate-menu"
            >
              <div className="sidebar-menu-container">
                <House className="icon" />
                <p className="label">{t("Dashboard")}</p>
              </div>
            </NavLink>

            <NavLink to="warehouse" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <Bag className="icon" />
                <p className="label">{t("Warehouse")}</p>
              </div>
            </NavLink>

            <NavLink to="employee" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <AddressBook className="icon" />
                <p className="label">{t("Employee")}</p>
              </div>
            </NavLink>
          </>
        )}

        {userInfor?.roleName === "Staff" && (
          <>
            {/* <NavLink to="dashboardstaff" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <House className="icon" weight="fill" />
                <p className="label">{t("Dashboard")}</p>
              </div>
            </NavLink> */}
        
            <NavLink to="payment" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <CreditCard className="icon" weight="fill" />
                <p className="label">{t("Transfer Money")}</p>
              </div>
            </NavLink>
            <NavLink to="batchflow" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <Package className="icon" weight="fill" />
                <p className="label">{t("Batch")}</p>
              </div>
            </NavLink>
            <NavLink to="vehicle" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <CarProfile className="icon" weight="fill" />
                <p className="label">{t("Vehicle")}</p>
              </div>
            </NavLink>
            <NavLink to="ordermanage" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <Bag className="icon" weight="fill" />
                <p className="label">{t("Order Manage")}</p>
              </div>
            </NavLink>

            <NavLink to="requestmanage" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <AddressBook className="icon" weight="fill" />
                <p className="label">{t("Request Manage")}</p>
              </div>
            </NavLink>

            <NavLink to="inventory" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <TreasureChest className="icon" weight="fill" />
                <p className="label">{t("Inventory")}</p>
              </div>
            </NavLink>
          </>
        )}

        {userInfor?.roleName !== "Partner" &&
          userInfor?.roleName !== "Staff" &&
          userInfor?.roleName !== "Admin" &&
          userInfor?.roleName !== "Manager" && (
            <>
              <NavLink to="dashboard" className="flex navigate-menu">
                <div className="sidebar-menu-container">
                  <House className="icon" weight="bold" />
                  <p className="label">{t("Dashboard")}</p>
                </div>
              </NavLink>

              <NavLink to="warehouse" className="flex navigate-menu">
                <div className="sidebar-menu-container">
                  <Warehouse className="icon" weight="bold" />
                  <p className="label">{t("Warehouse")}</p>
                </div>
              </NavLink>

              <NavLink to="inventory" className="flex navigate-menu">
                <div className="sidebar-menu-container">
                  <Package className="icon" weight="bold" />
                  <p className="label">{t("Inventory")}</p>
                </div>
              </NavLink>

              <NavLink to="product" className="flex navigate-menu">
                <div className="sidebar-menu-container">
                  <Bag className="icon" weight="bold" />
                  <p className="label">{t("Product")}</p>
                </div>
              </NavLink>

              <NavLink to="order" className="flex navigate-menu">
                <div className="sidebar-menu-container">
                  <AddressBook className="icon" weight="bold" />
                  <p className="label">{t("Order")}</p>
                </div>
              </NavLink>

              <NavLink to="request" className="flex navigate-menu">
                <div className="sidebar-menu-container">
                  <AddressBook className="icon" weight="bold" />
                  <p className="label">{t("Request")}</p>
                </div>
              </NavLink>
            </>
          )}
      </nav>
    </div>
  );
}
