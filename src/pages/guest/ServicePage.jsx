import { useTranslation } from "react-i18next";
import { Check } from "@phosphor-icons/react";
import Landing from "../../assets/img/Landing.jpg";

export default function ServicePage() {
  const { t } = useTranslation();
  return (
    <div className=" pb-[88px] flex-col justify-start items-start gap-[80px] inline-flex w-[100vw] overflow-hidden">
      <div className="h-[209px] w-[100vw] px-[300px] py-[72px] bg-[#0db977] justify-between items-center inline-flex"></div>

      <div className="self-stretch px-[300px] h-[434px] flex-col justify-start items-start gap-8 flex">
        <div className="h-[78px] flex-col justify-start items-start gap-2 flex mb-4">
          <div className="self-stretch text-[#0db977] text-xl font-semibold font-['Lexend']">
            {t("Ourservice")}
          </div>
          <div className="self-stretch text-black text-3xl font-semibold font-['Lexend']">
            {t("Whychooseus")}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[5rem]">
          <div className=" px-5 py-[2rem] bg-white rounded-[15px] shadow border border-[#f4f5f7] justify-start items-center gap-8 flex">
            <div className="w-[100px] h-[100px] relative bg-[#f4f5f7] rounded-[60px]">
              <Check
                className="w-[57px] h-[57px] left-[22px] top-[21px] absolute text-green-500"
                weight="bold"
              />
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <div className="self-stretch text-[#091540] text-2xl font-normal font-['Lexend']">
                {t("EasyManagement")}
              </div>
              <div className="self-stretch text-[#adb1bf] text-lg font-normal font-['Lexend']">
                {t("EffortlessManagement")}
              </div>
            </div>
          </div>
          <div className=" px-5 py-[2rem] bg-white rounded-[15px] shadow border border-[#f4f5f7] justify-start items-center gap-8 flex">
            <div className="w-[100px] h-[100px] relative bg-[#f4f5f7] rounded-[60px]">
              <Check
                className="w-[57px] h-[57px] left-[22px] top-[21px] absolute text-green-500"
                weight="bold"
              />
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <div className="self-stretch text-[#091540] text-2xl font-normal font-['Lexend']">
                {t("QuickOperation")}
              </div>
              <div className="self-stretch text-[#adb1bf] text-lg font-normal font-['Lexend']">
                {t("QuickOperations")}
              </div>
            </div>
          </div>
          <div className=" px-5 py-[2rem] bg-white rounded-[15px] shadow border border-[#f4f5f7] justify-start items-center gap-8 flex">
            <div className="w-[100px] h-[100px] relative bg-[#f4f5f7] rounded-[60px]">
              <Check
                className="w-[57px] h-[57px] left-[22px] top-[21px] absolute text-green-500"
                weight="bold"
              />
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <div className="self-stretch text-[#091540] text-2xl font-normal font-['Lexend']">
                {t("UserFriendlyInterface")}
              </div>
              <div className="self-stretch text-[#adb1bf] text-lg font-normal font-['Lexend']">
                {t("UserFriendlyInterfaces")}
              </div>
            </div>
          </div>
          <div className=" px-5 py-[2rem] bg-white rounded-[15px] shadow border border-[#f4f5f7] justify-start items-center gap-8 flex">
            <div className="w-[100px] h-[100px] relative bg-[#f4f5f7] rounded-[60px]">
              <Check
                className="w-[57px] h-[57px] left-[22px] top-[21px] absolute text-green-500"
                weight="bold"
              />
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <div className="self-stretch text-[#091540] text-2xl font-normal font-['Lexend']">
                {t("ReasonablePrice")}
              </div>
              <div className="self-stretch text-[#adb1bf] text-lg font-normal font-['Lexend']">
                {t("AffordablePricing")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="justify-start items-start gap-20 inline-flex px-[300px] mt-[10rem]">
        <div className="w-[648px] h-[657.83px] relative">
          <div className="w-[491.40px] h-[464.53px] left-[245.70px] top-[657.83px] absolute origin-top-left rotate-[-120deg] bg-[#86dcbb]" />
          <img
            className="w-[544px] h-[514px] left-[55px] top-[65px] absolute object-cover "
            style={{ objectPosition: "85% center" }}
            src={Landing}
          />
        </div>
        <div className="w-[592px] flex-col justify-start items-start gap-11 inline-flex mt-20">
          <div className="self-stretch h-[197px] flex-col justify-start items-start gap-8 flex">
            <div className="self-stretch text-[#091540] text-4xl font-medium font-['Lexend']">
              {t("Getthebestpackageforyourbusiness")}
            </div>
            <div className="self-stretch text-[#848a9f] text-xl font-normal font-['Lexend']">
              {t("servicesDesciption")}
            </div>

            <div className="self-stretch flex-col justify-start items-start gap-8 flex">
              <div className="self-stretch justify-start items-center gap-6 inline-flex">
                <Check
                  className="text-4xl text-[var(--Xanh-Base)]"
                  weight="bold"
                />
                <div className="grow shrink basis-0 text-[#091540] text-xl font-normal font-['Lexend']">
                  {t("servicesBenefit01")}
                </div>
              </div>
              <div className="self-stretch justify-start items-center gap-6 inline-flex">
                <Check
                  className="text-4xl text-[var(--Xanh-Base)]"
                  weight="bold"
                />
                <div className="grow shrink basis-0 text-[#091540] text-xl font-normal font-['Lexend']">
                  {t("servicesBenefit02")}
                </div>
              </div>
              <div className="self-stretch justify-start items-center gap-6 inline-flex">
                <Check
                  className="text-4xl text-[var(--Xanh-Base)]"
                  weight="bold"
                />
                <div className="grow shrink basis-0 text-[#091540] text-xl font-normal font-['Lexend']">
                  {t("servicesBenefit03")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
