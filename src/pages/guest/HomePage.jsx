import {
  Buildings,
  CaretDown,
  FilePlus,
  Layout,
  Package,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { t } = useTranslation();

  const nav = useNavigate();
  return (
    <div className="w-[100vw] overflow-hidden h-[1080px] relative bg-white ">
      <div className="w-[1920px]  px-[300px] pt-[168px] pb-16 left-0 top-[104px] absolute flex-col justify-start items-center gap-[88px] inline-flex">
        <div className="self-stretch  justify-start items-center gap-[136px] inline-flex">
          <div className="w-[648px] self-stretch flex-col justify-center items-start gap-[88px] inline-flex">
            <div className="self-stretch  flex-col justify-start items-start gap-12 flex">
              <div className="self-stretch  flex-col justify-start items-start gap-6 flex">
                <div
                  className={`self-stretch text-[#091540] text-5xl font-semibold font-['Lexend'] leading-[67.68px]`}
                >
                  {t("aboutHeader")}
                </div>
                <div className="self-stretch text-[#091540] text-xl font-normal font-['Lexend']">
                  {t("aboutDescription")}
                </div>
              </div>
              <div className=" items-start justify-between w-full inline-flex">
                <div className="flex-col justify-start items-start gap-6 inline-flex">
                  <div className="self-stretch justify-start items-center gap-4 inline-flex">
                    <Layout
                      className="text-[25px] h-[25px] w-[25px]"
                      color="#0db977"
                      weight="bold"
                    />

                    <div className="text-[#0db977] text-lg font-medium font-['Lexend']">
                      {t("aboutBenefit01")}
                    </div>
                  </div>
                  <div className="self-stretch justify-start items-center gap-4 inline-flex">
                    <Buildings
                      className="text-[25px] h-[25px] w-[25px]"
                      color="#0db977"
                      weight="bold"
                    />
                    <div className="text-[#0db977] text-lg font-medium font-['Lexend']">
                      {t("aboutBenefit02")}
                    </div>
                  </div>
                </div>
                <div className="flex-col justify-start items-start gap-6 inline-flex">
                  <div className="self-stretch justify-start items-center gap-4 inline-flex">
                    <Package
                      className="text-[25px] h-[25px] w-[25px]"
                      color="#0db977"
                      weight="bold"
                    />
                    <div className="text-[#0db977] text-lg font-medium font-['Lexend']">
                      {t("aboutBenefit03")}
                    </div>
                  </div>
                  <div className="self-stretch justify-start items-center gap-4 inline-flex">
                    <FilePlus
                      className="text-[25px] h-[25px] w-[25px]"
                      color="#0db977"
                      weight="bold"
                    />
                    <div className="text-[#0db977] text-lg font-medium font-['Lexend']">
                      {t("aboutBenefit04")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="justify-start items-center gap-6 inline-flex">
              <div className="h-[47px] justify-start items-start flex">
                <div
                  className="grow hover:bg-[--Xanh-700] cursor-pointer shrink basis-0 h-[47px] px-[18px] py-3 bg-[#0db977] rounded-[15px] justify-center items-center gap-2 flex"
                  onClick={() => nav("/authorize/signin")}
                >
                  <div className="text-white text-lg font-normal font-['Lexend'] px-10">
                    {t("Getstarted")}
                  </div>
                </div>
              </div>
              <div className="h-[47px] justify-start items-start flex">
                <div className="grow hover:bg-gray-100 hover:font-semibold cursor-pointer shrink basis-0 h-[47px] px-[18px] py-3 rounded-[15px] border border-[#adb1bf] justify-center items-center gap-2 flex">
                  <div className="text-[#091540] text-lg font-normal font-['Lexend'] px-5">
                    {t("Viewpreview")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[1492px] h-[1199px] left-[1105px] top-[-23px] absolute">
          <div className="w-[1199px] h-[1199px] left-[293px] top-0 absolute">
            <div className="w-[1199px] h-[1199px] left-0 top-0 absolute opacity-20 rounded-full border-2 border-[#0db977]" />
            <div className="w-[958px] h-[958px] left-[120px] top-[120px] absolute opacity-20 bg-[#0db977] rounded-full" />
            <div className="w-[564px] h-[567px] left-[317px] top-[316px] absolute opacity-10 bg-[#0db977] rounded-full" />
          </div>
          <div className="w-[462.97px] h-[334.19px] left-0 top-[242px] absolute">
            <div className="w-[160.78px] h-[120.88px] left-[37.92px] top-[17.38px] absolute shadow">
              <div className="w-[160.78px] h-[120.88px] left-0 top-0 absolute">
                <div className="w-[71.10px] h-[71.10px] left-0 top-0 absolute">
                  <div className="w-[71.10px] h-[71.10px] left-0 top-0 absolute bg-[#5dd0a4] rounded-full" />
                  <div className="w-[61.62px] h-[61.62px] left-[4.74px] top-[4.74px] absolute bg-[#f4f5f7] rounded-full" />
                  <div className="w-[33.97px] h-[33.97px] left-[18.17px] top-[18.17px] absolute" />
                </div>
              </div>
            </div>
            <div className="w-[196.72px] h-[71.10px] left-[1.58px] top-[143.79px] absolute shadow">
              <div className="w-[196.72px] h-[71.10px] left-0 top-0 absolute">
                <div className="w-[71.10px] h-[71.10px] left-0 top-0 absolute">
                  <div className="w-[71.10px] h-[71.10px] left-0 top-0 absolute bg-[#5dd0a4] rounded-full" />
                  <div className="w-[61.62px] h-[61.62px] left-[4.74px] top-[4.74px] absolute bg-[#f4f5f7] rounded-full" />
                  <div className="w-[33.97px] h-[33.97px] left-[18.17px] top-[18.17px] absolute">
                    <img
                      className="w-[15.50px] h-[11.78px] left-[12.74px] top-[2.12px] absolute"
                      src="https://via.placeholder.com/15x12"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[160.38px] h-[113.77px] left-[37.92px] top-[219.63px] absolute shadow">
              <div className="w-[160.38px] h-[113.77px] left-0 top-0 absolute">
                <div className="w-[71.10px] h-[71.10px] left-0 top-[42.66px] absolute">
                  <div className="w-[71.10px] h-[71.10px] left-0 top-0 absolute bg-[#5dd0a4] rounded-full" />
                  <div className="w-[61.62px] h-[61.62px] left-[4.74px] top-[4.74px] absolute bg-[#f4f5f7] rounded-full" />
                  <div className="w-[33.97px] h-[33.97px] left-[18.17px] top-[18.17px] absolute">
                    <div className="w-[27.82px] h-[27.83px] left-[3.18px] top-[3.18px] absolute"></div>
                    <img
                      className="w-[10.83px] h-[10.83px] left-[12.32px] top-[12.31px] absolute"
                      src="https://via.placeholder.com/11x11"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[309.70px] left-[199.12px] top-[24.49px] absolute shadow flex-col justify-start items-start inline-flex">
              <div className="self-stretch h-[38.71px] p-[15.80px] bg-white rounded-tl-xl rounded-tr-xl flex-col justify-start items-start gap-[7.90px] flex">
                <div className="self-stretch justify-between items-center inline-flex">
                  <div className="justify-start items-center gap-[6.32px] flex">
                    <div className="w-[7.11px] h-[7.11px] bg-[#f02656] rounded-full" />
                    <div className="w-[7.11px] h-[7.11px] bg-[#fa941d] rounded-full" />
                    <div className="w-[7.11px] h-[7.11px] bg-[#0db977] rounded-full" />
                  </div>
                  <div className="w-[60.83px] self-stretch bg-[#c6c9d8] rounded-3xl" />
                </div>
              </div>
              <div className="self-stretch h-[270.99px] px-[15.80px] pt-[11.85px] pb-[15.80px] bg-[#eaebf2] rounded-bl-xl rounded-br-xl flex-col justify-start items-start gap-[14.22px] flex">
                <div className="self-stretch justify-start items-start gap-[7.90px] inline-flex">
                  <div className="grow shrink basis-0 py-[6.32px] bg-[#f4f5f7] rounded flex-col justify-center items-center gap-[7.90px] inline-flex">
                    <div className="w-[60.83px] h-[7.11px] bg-[#d5d7df] rounded-3xl" />
                  </div>
                  <div className="grow shrink basis-0 py-[6.32px] rounded-xl flex-col justify-center items-center gap-[7.90px] inline-flex">
                    <div className="w-[60.83px] h-[7.11px] bg-[#d5d7df] rounded-3xl" />
                  </div>
                </div>
                <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-[12.64px] flex">
                  <div className="self-stretch grow shrink basis-0 p-[7.90px] bg-white rounded-lg justify-start items-center gap-[12.64px] inline-flex">
                    <div className="w-[31.60px] h-[31.60px] bg-[#eaebf2] rounded" />
                    <div className="w-[99.55px] flex-col justify-start items-start gap-[6.32px] inline-flex">
                      <div className="w-[90.07px] h-[7.11px] bg-[#d5d7df] rounded-3xl" />
                      <div className="w-[60.83px] h-[7.11px] bg-[#eaebf2] rounded-3xl" />
                    </div>
                  </div>
                  <div className="self-stretch grow shrink basis-0 p-[7.90px] bg-white rounded-lg justify-start items-center gap-[12.64px] inline-flex">
                    <div className="w-[31.60px] h-[31.60px] bg-[#eaebf2] rounded" />
                    <div className="w-[99.55px] flex-col justify-start items-start gap-[6.32px] inline-flex">
                      <div className="w-[90.07px] h-[7.11px] bg-[#d5d7df] rounded-3xl" />
                      <div className="w-[60.83px] h-[7.11px] bg-[#eaebf2] rounded-3xl" />
                    </div>
                  </div>
                  <div className="self-stretch grow shrink basis-0 p-[7.90px] bg-white rounded-lg justify-start items-center gap-[12.64px] inline-flex">
                    <div className="w-[31.60px] h-[31.60px] bg-[#eaebf2] rounded" />
                    <div className="w-[99.55px] flex-col justify-start items-start gap-[6.32px] inline-flex">
                      <div className="w-[90.07px] h-[7.11px] bg-[#d5d7df] rounded-3xl" />
                      <div className="w-[60.83px] h-[7.11px] bg-[#eaebf2] rounded-3xl" />
                    </div>
                  </div>
                  <div className="self-stretch grow shrink basis-0 p-[7.90px] bg-white rounded-lg justify-start items-center gap-[12.64px] inline-flex">
                    <div className="w-[31.60px] h-[31.60px] bg-[#eaebf2] rounded" />
                    <div className="w-[99.55px] flex-col justify-start items-start gap-[6.32px] inline-flex">
                      <div className="w-[90.07px] h-[7.11px] bg-[#d5d7df] rounded-3xl" />
                      <div className="w-[60.83px] h-[7.11px] bg-[#eaebf2] rounded-3xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-col justify-start items-center gap-3 flex mouse">
          <div className="w-[38px] h-[50px] relative ">
            <div className="w-[38px] h-[62px] left-0 top-0 absolute rounded-2xl border border-[#86dcbb]" />
            <div className="w-1 h-4 left-[17px] top-[17px] absolute bg-[#0db977] rounded-[14px]" />
          </div>
          <div className="flex-col justify-start items-center gap-[5px] flex">
            <div className="text-[#0db977] text-sm font-semibold font-['Lexend'] mt-4">
              {t("SCROLLTOEXPLORE")}
            </div>
            <div></div>
            <CaretDown weight="fill" className="text-[#0db977]" />
          </div>
        </div>
      </div>
    </div>
  );
}
