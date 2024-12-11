import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react";

export default function ContactPage() {
  return (
    <>
      <div className="w-[1920px] h-[55vh] px-[300px] pt-16 pb-[130px] justify-start items-start gap-6 inline-flex">
        <div className="w-[648px] flex-col justify-start items-start gap-12 inline-flex mt-[4rem]">
          <div className="self-stretch h-40 flex-col justify-start items-start gap-8 flex">
            <div className="self-stretch h-[78px] flex-col justify-start items-start gap-2 flex">
              <div className="self-stretch text-[#0db977] text-xl font-semibold font-['Lexend']">
                FAQ
              </div>
              <div className="self-stretch text-[#091540] text-4xl font-medium font-['Lexend']">
                Got any questions for BeeShelf?
              </div>
            </div>
            <div className="w-[381px] text-[#848a9f] text-xl font-normal font-['Lexend']">
              If there are questions you want to ask, we will answer all your
              questions
            </div>
          </div>
          <div className="w-[424px] h-[47px] relative">
            <div className="w-[424px] pl-[18px] pr-[10px] py-3 left-0 top-0 absolute rounded-[15px] border border-[#848a9f] justify-between items-center gap-2 inline-flex">
              <div className="text-[#adb1bf] text-lg font-normal font-['Lexend']">
                Enter your email
              </div>
              <div className="px-14 h-[48px] w-[4rem] py-2 bg-[#0db977] rounded-[15px] justify-center items-center gap-2 flex">
                <div className="text-white text-lg font-normal font-['Lexend']">
                  Submit
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[648px] pt-11 flex-col justify-start items-start gap-12 inline-flex mt-[4rem]">
          <div className="self-stretch text-[#091540] text-xl font-semibold font-['Lexend']">
            Maybe your question is have been answer, check this out.
          </div>
          <div className="self-stretch h-[165px] flex-col justify-start items-start gap-6 flex">
            <div className="self-stretch justify-between items-start inline-flex">
              <div className="text-[#091540] text-lg font-normal font-['Lexend']">
                What is BeeShelf?
              </div>
              <div className="w-5 h-5 relative" />
            </div>
            <div className="self-stretch h-[0px] border border-[#c6c9d8]"></div>
            <div className="self-stretch justify-between items-start inline-flex">
              <div className="text-[#091540] text-lg font-normal font-['Lexend']">
                How to send product to warehouse?
              </div>
              <div className="w-5 h-5 relative" />
            </div>
            <div className="self-stretch h-[0px] border border-[#c6c9d8]"></div>
            <div className="self-stretch justify-between items-start inline-flex">
              <div className="text-[#091540] text-lg font-normal font-['Lexend']">
                Can I track order?
              </div>
              <div className="w-5 h-5 relative" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1920px] h-[400px] px-[300px] pt-16 pb-12 bg-[#0db977] flex-col justify-start items-start gap-16 inline-flex">
        <div className="self-stretch justify-between items-start inline-flex">
          <div className="flex-col justify-start items-start gap-8 inline-flex">
            <div className="justify-start items-center gap-0.5 inline-flex">
              <div className="w-[64.14px] h-[78.72px] relative">
                <div className="w-[49.27px] h-[76.80px] left-0 top-[0.87px] absolute">
                  <div className="w-[31.78px] h-[14.58px] left-[8.45px] top-0 absolute"></div>
                </div>
              </div>
              <div className="w-[133.82px] text-white text-[35.17px] font-black font-['SVN-Neue Helvetica']">
                BeeShelf
              </div>
            </div>
            <div className="w-[400px] text-[#aee7d1] text-lg font-normal font-['Lexend']">
              Một dịch vụ cung cấp các công cụ để người dùng quản lý sản phẩm,
              đơn hàng.
            </div>
          </div>
          <div className=" flex-col justify-center items-start gap-8 inline-flex">
            <div className="text-white text-xl font-semibold font-['Lexend']">
              Contact information
            </div>
            <div className="self-stretch h-[140px] flex-col justify-start items-start gap-6 flex">
              <div className="self-stretch justify-start items-center gap-2 inline-flex">
                <Phone className="text-[#aee7d1] text-3xl" />
                <div className="text-right text-[#aee7d1] text-lg font-normal font-['Lexend']">
                  0123 312 234
                </div>
              </div>
              <div className="self-stretch justify-start items-center gap-2 inline-flex">
                <EnvelopeSimple className="text-[#aee7d1] text-3xl" />
                <div className="text-right text-[#aee7d1] text-lg font-normal font-['Lexend']">
                  beeshelf@example.com
                </div>
              </div>
              <div className="self-stretch justify-start items-start gap-2 inline-flex">
                <MapPin className="text-[#aee7d1] text-3xl" />
                <div className="grow shrink basis-0 text-[#aee7d1] text-lg font-normal font-['Lexend']">
                  Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thủ Đức, TP.HCM
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-[#86dcbb] text-lg font-normal leading-[27px] items-center text-center">
         <span className="text-2xl"> ©</span> 2024 BeeShelf. All rights reserved.
        </div>
      </div>
    </>
  );
}
