
import { useTranslation } from "react-i18next";

export default function ProductOverview() {
  const { t } = useTranslation();

  return (
    <div className="bg-[var(--main-color)] w-fit flex-grow p-10 rounded-xl shadow-xl border-2 border-[var(--line-main-color)] h-fit">
      <div className="font-semibold text-xl mb-5">{t("OVERVIEW")}</div>
      <div className="mb-3">
        <div className="text-[var(--text-second-color)]">{t("Skutotal")}</div>
        <div className="text-2xl font-semibold">12,312</div>
      </div>
      <div className="mb-3">
        <div className="text-[var(--text-second-color)]">
          {t("ProductReserved")}
        </div>
        <div className="text-2xl font-semibold">122</div>
      </div>
      <div className="mb-3">
        <div className="text-[var(--text-second-color)]">{t("StockIssue")}</div>
        <div className="text-2xl font-semibold">1</div>
      </div>
    </div>
  );
}
