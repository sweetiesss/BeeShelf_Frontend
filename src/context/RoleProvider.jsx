import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

export default function RoleProvider({ children, allowedRoles }) {
  const { userInfor, setUserInfor } = useContext(AuthContext);
  const userRole = userInfor?.roleName;
  if (!allowedRoles.includes(userRole)) {
    toast.warning("You don't have permission to access this.");
    setUserInfor(null);
    return <Navigate to="/" replace />;
  }
  return children;
}
