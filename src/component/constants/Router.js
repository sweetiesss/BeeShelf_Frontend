import {
  AddressBook,
  Bag,
  House,
  Package,
  Warehouse,
} from "@phosphor-icons/react";
import HomePage from "../../pages/guest/HomePage";
import ProductPage from "../../pages/partner/ProductPage";

export const PartnerRouterInfor = [
  {
    icon: House,
    path: "dashboard",
    index: true,
    element: HomePage,
    label: "Dashboard",
  },
  {
    icon: Warehouse,
    path: "warehouse",
    index: false,
    element: HomePage,
    label: "Warehouse",
  },
  {
    icon: Package,
    path: "inventory",
    index: false,
    element: HomePage,
    label: "Inventory",
  },
  {
    icon: Bag,
    path: "product",
    index: false,
    element: ProductPage,
    label: "Product",
  },
  {
    icon: AddressBook,
    path: "order",
    index: false,
    element: HomePage,
    label: "Order",
  },
];
