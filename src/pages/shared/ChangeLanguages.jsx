import React from "react"; // Ensure React is imported for type usage
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../component/constants/Language";

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const onChangeLang = (e) => {
    const selectedLanguage = e.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <div className="text-black">
      <select defaultValue={i18n.language} onChange={onChangeLang}>
        {LANGUAGES.map((lng) => (
          <option key={lng.code} value={lng.code}>
            {t(lng.label)}
          </option>
        ))}
      </select>
    </div>
  );
};
