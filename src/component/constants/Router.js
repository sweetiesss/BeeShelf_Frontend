import {
  AddressBook,
  Bag,
  House,
  Package,
  Warehouse,
} from "@phosphor-icons/react";
import HomePage from "../../pages/guest/HomePage";
import ProductPage from "../../pages/partner/ProductPage";
import ImportProductExcel from "../../pages/shared/ImportProductExcel";
import AddProductPage from "../../pages/partner/AddProductPage";
import ProfilePage from "../../pages/shared/ProfilePage";
import EditProfilePage from "../../pages/shared/EditProfilePage";

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
export const PartnerRouterNoneSider=[
  {
    path: "product/import_product",
    index: false,
    element: ImportProductExcel,
    label: "Import Product Excel",
  },
  {
    path: "product/add_product",
    index: false,
    element: AddProductPage,
    label: "Add Product",
  },
  {
    path: "profile",
    index: false,
    element: ProfilePage,
    label: "Profile",
  },
  {
    path: "editProfile",
    index: false,
    element: EditProfilePage,
    label: "Edit Profile",
  }
]
