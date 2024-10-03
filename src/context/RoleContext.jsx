import { createContext, useContext, useState } from "react";
import useAxios from "../services/customizeAxios";

export const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [userRole, setUserRole] = useState(null);
  const { loading } = useAxios();
  return (
    <RoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </RoleContext.Provider>
  );
}
