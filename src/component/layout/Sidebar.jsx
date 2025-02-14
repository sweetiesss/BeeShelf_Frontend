import React, { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  House,
  Warehouse,
  Package,
  Bag,
  AddressBook,
  CreditCard,
  CarProfile,
  TreasureChest,
  MapPinArea,
  Note,
  ChartPie,
  UserPlus,
  Scroll,
  Truck,
  Plant,
  UserCheck,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";

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
      <nav className="flex flex-col flex-grow items-center text-[var(--en-vu-200)] sidebar-navigate space-y-4 h-full">
        {userInfor?.roleName === "Partner" && userInfor?.isVerified === 1 ? (
          <>
            <NavLink
              to={
                location.pathname.toLocaleLowerCase() === "/partner"
                  ? ""
                  : "dashboard"
              }
              className="flex navigate-menu"
            >
              <div className="sidebar-menu-container">
                <ChartPie className="icon" weight="bold" />
                <p className="label">{t("Dashboard")}</p>
              </div>
            </NavLink>

            <NavLink to="inventory" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <Warehouse className="icon" weight="bold" />
                <p className="label">{t("Store")}</p>
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
                <Note className="icon" weight="bold" />
                <p className="label">{t("Request")}</p>
              </div>
            </NavLink>
            <NavLink to="lots" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <Package className="icon" weight="bold" />
                <p className="label">{t("Lots")}</p>
              </div>
            </NavLink>
          </>
        ) : (
          userInfor?.roleName === "Partner" && (
            <>
              <NavLink
                to={
                  location.pathname.toLocaleLowerCase() === "/partner"
                    ? ""
                    : "verify"
                }
                className="flex navigate-menu"
              >
                <div className="sidebar-menu-container">
                  <UserPlus className="icon" weight="bold" />
                  <p className="label">{t("Verify")}</p>
                </div>
              </NavLink>
              <NavLink to="verify-list" className="flex navigate-menu">
                <div className="sidebar-menu-container">
                  <Scroll className="icon" weight="bold" />
                  <p className="label">{t("Verify List")}</p>
                </div>
              </NavLink>
            </>
          )
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

            <NavLink to="store" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <Bag className="icon" />
                <p className="label">{t("Store")}</p>
              </div>
            </NavLink>

            <NavLink to="employee" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <AddressBook className="icon" />
                <p className="label">{t("Employee")}</p>
              </div>
            </NavLink>

            <NavLink to="vehicle" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <Truck className="icon" />
                <p className="label">{t("Vehicle")}</p>
              </div>
            </NavLink>
            <NavLink to="category" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <Plant className="icon" />
                <p className="label">{t("Category")}</p>
              </div>
            </NavLink>
            <NavLink to="partner" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <UserCheck className="icon" />
                <p className="label">{t("Partner")}</p>
              </div>
            </NavLink>
          </>
        )}
        {userInfor?.roleName === "Admin" && (
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

            <NavLink to="store" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <Bag className="icon" />
                <p className="label">{t("Store")}</p>
              </div>
            </NavLink>

            <NavLink to="employee" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <AddressBook className="icon" />
                <p className="label">{t("Employee")}</p>
              </div>
            </NavLink>

            <NavLink to="vehicle" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <AddressBook className="icon" />
                <p className="label">{t("Vehicle")}</p>
              </div>
            </NavLink>
            <NavLink to="category" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <AddressBook className="icon" />
                <p className="label">{t("Category")}</p>
              </div>
            </NavLink>
          </>
        )}

        {userInfor?.roleName === "Staff" && (
          <>
            <NavLink to="payment" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <CreditCard className="icon" weight="fill" />
                <p className="label">{t("Transfer")}</p>
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
                <p className="label">{t("Order")}</p>
              </div>
            </NavLink>

            <NavLink to="requestmanage" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <AddressBook className="icon" weight="fill" />
                <p className="label">{t("Request")}</p>
              </div>
            </NavLink>

            <NavLink to="deliveryzone" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <MapPinArea className="icon" weight="fill" />
                <p className="label">{t("DeliveryZone")}</p>
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

        {userInfor?.roleName === "Admin" && (
          <>
            <NavLink to="payment" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <CreditCard className="icon" weight="fill" />
                <p className="label">{t("Transactions")}</p>
              </div>
            </NavLink>
            <NavLink to="batchflow" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <Package className="icon" weight="fill" />
                <p className="label">{t("Batch")}</p>
              </div>
            </NavLink>
            <NavLink to="ordermanage" className="flex navigate-menu">
              <div className="sidebar-menu-container">
                <Bag className="icon" weight="fill" />
                <p className="label">{t("Orders")}</p>
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

              <NavLink to="store" className="flex navigate-menu">
                <div className="sidebar-menu-container">
                  <Warehouse className="icon" weight="bold" />
                  <p className="label">{t("Store")}</p>
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
