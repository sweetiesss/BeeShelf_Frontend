import React, {  useState } from "react"; // Ensure React is imported for type usage
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../constants/Language";
import { GlobeHemisphereWest } from "@phosphor-icons/react";

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const onChangeLang = (e) => {
    const selectedLanguage = e.target.value;
    i18n.changeLanguage(selectedLanguage);

    console.log(selectedLanguage);
  };

  

  return (
    <div className="text-black flex">
      <GlobeHemisphereWest
        weight="duotone"
        className="text-3xl"
    
      />
      <select
        id="languageSelect"
        defaultValue={i18n.language}
        onChange={onChangeLang}
        className="outline-none border-b-2 border-black w-fit cursor-pointer"
      >
        {LANGUAGES.map((lng) => (
          <option key={lng.code} value={lng.code}>
            {t(lng.label)}
          </option>
        ))}
      </select>
    </div>
  );
};
