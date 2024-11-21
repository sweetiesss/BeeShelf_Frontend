import { createContext, useEffect, useState } from "react";

export const SettingContext = createContext();
export function SettingProvider({ children }) {
  const [settingInfor, setSettingInfor] = useState(() => {
    const storedData = localStorage.getItem("SettingInfor");
    return storedData
      ? JSON.parse(storedData)
      : { theme: "light", language: "eng" };
  });
  useEffect(() => {
    localStorage.setItem("SettingInfor", JSON.stringify(settingInfor));
  }, [settingInfor]);

  return (
    <SettingContext.Provider
      value={{  settingInfor, setSettingInfor }}
    >
      {children}
    </SettingContext.Provider>
  );
}
