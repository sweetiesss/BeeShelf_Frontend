import { useLocation, useNavigate } from "react-router-dom";
import { HeaderUnauthenticated } from "../../component/layout/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { LanguageSelector } from "../../component/shared/ChangeLanguages";
import Mapping from "../../component/shared/Mapping";
import axios from "axios";
import ShowRoomLot from "../partner/ShowRoomLot";
import { add, format } from "date-fns";

export default function LocationRoom() {
  const location = useLocation();

  const { t } = useTranslation();

  console.log("location", location);
  const queryParams = new URLSearchParams(window.location.search);
  const state = JSON.parse(decodeURIComponent(queryParams.get("state")));
  console.log("state", state);
  const [warehouse, setWareHouse] = useState();
  const [inventoriesShowList, setInventoriesShowList] = useState();

  useEffect(() => {
    const fetchBeginData = async () => {
      try {
        if (!state?.additionalInfo || !state?.code) {
          console.warn("Required state data is missing.");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL_API}store/get-store/${state.additionalInfo?.storeId}`,
          {
            headers: {
              Authorization: `Bearer ${state.code}`,
            },
          }
        );
        if (response?.status === 200) {
          setWareHouse(response?.data);
        }

        const response2 = await axios.get(
          `${process.env.REACT_APP_BASE_URL_API}room/get-rooms?filterBy=StoreId&filterQuery=${state.additionalInfo?.storeId}&descending=false&pageIndex=0&pageSize=1000`,
          {
            headers: {
              Authorization: `Bearer ${state.code}`,
            },
          }
        );
        if (response2?.status === 200) {
          setInventoriesShowList(response2?.data?.items);
        }

        console.log("Response2:", response2);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchBeginData();
  }, []);

  const handleOpenGoogleMaps = (location) => {
    const encodedLocation = encodeURIComponent(location);
    const googleMapsUrl = `https://www.google.com/maps?q=${encodedLocation}`;
    window.open(googleMapsUrl, "_blank");
  };

  const mappingProps = useMemo(() => {
    return {
      showLocation: {
        name: "Your Location",
        location: warehouse?.location + ", " + warehouse?.provinceName,
      },
      setLatLng: () => {},
    };
  }, [warehouse?.location + ", " + warehouse?.provinceName]);

  return (
    <>
      <div className="max-w-[100vw] overflow-hidden landingPage">
        <div className="w-full md:px-[300px] md:py-[23px] py-[1rem] fixed bg-white shadow flex justify-between items-center z-10">
          <div className="flex items-center md:gap-[20px]">
            <div className="text-[#0db977] text-5xl md:text-[25px] font-bold cursor-pointer  relative">
              <img
                src="../../../beeShelf.png"
                className="h-[25px] md:h-[5rem] w-fit absolute md:top-[-25px] md:left-[-85px] -top-2 left-3"
              />
              <p className="max-sm:pl-20">BeeShelf</p>
            </div>
          </div>
          <div className="flex items-center gap-[20px] max-sm:text-2xl">
            <LanguageSelector globalSize="text-5xl"/>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className=" md:grid md:grid-cols-5 md:grid-rows-12 mt-16 gap-y-4 gap-x-10 py-10 ">
            <div className="flex flex-col md:col-span-2 md:row-span-11">
              <div className="md:text-2xl text-3xl font-semibold col-span-2">
                <p className="mb-4">Lots Detail</p>
                <div className="grid grid-cols-6 grid-rows-6 gap-x-6">
                  <div className="col-span-3 row-span-4">
                    <img
                      src={state?.additionalInfo?.productPictureLink}
                      alt={state?.additionalInfo?.name}
                      className="w-full h-[fit] object-cover object-center rounded-lg border-2 border-gray-500 mb-[2rem]"
                    />
                  </div>
                    {[
                      {
                        label: "Lot Num:",
                        value: state?.additionalInfo?.lotNumber,
                      },
                      {
                        label: "Product Name:",
                        value: state?.additionalInfo?.productName,
                      },
                      {
                        label: "Create date:",
                        value: format(
                          add(new Date(state?.additionalInfo?.createDate), {
                            hours: 7,
                          }),
                          "dd/MM/yyyy"
                        ),
                      },
                      {
                        label: "Lots amount:",
                        value: state?.additionalInfo?.lotAmount + " lot",
                      },
                      {
                        label: "Total products amount:",
                        value:
                          state?.additionalInfo?.totalProductAmount +
                          " " +
                          state?.additionalInfo?.productUnit,
                      },
                      {
                        label: "Import date:",
                        value: format(
                          add(new Date(state?.additionalInfo?.importDate), {
                            hours: 7,
                          }),
                          "dd/MM/yyyy"
                        ),
                      },
                      {
                        label: "Expiration date:",
                        value: format(
                          add(new Date(state?.additionalInfo?.expirationDate), {
                            hours: 7,
                          }),
                          "dd/MM/yyyy"
                        ),
                      },
                      {
                        label: "Store:",
                        value: state?.additionalInfo?.storeName,
                      },
                    ]?.map((item, index) => (
                      <div key={index} className="flex justify-between md:text-lg text-2xl col-span-3">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="text-black">{item.value}</span>
                      </div>
                    ))}
                  
                </div>
              </div>
              <p className="md:text-2xl text-3xl font-semibold col-span-2 row-span-1 mb-4">
                {t("WarehouseInformation")}
              </p>
              <div className="w-full h-fit max-h-1/3">
                {[
                  { label: t("Name") + ":", value: warehouse?.name },
                  {
                    label: t("Location") + ":",
                    value: warehouse?.location,
                    onClick: () => handleOpenGoogleMaps(warehouse?.location),
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`max-sm:text-2xl grid-cols-4 grid gap-4 mb-4 ${
                      item.onClick ? "cursor-pointer hover:text-blue-600" : ""
                    }`}
                    onClick={item.onClick ? item.onClick : undefined}
                  >
                    <p className="col-span-1 font-medium text-gray-500">
                      {item.label}
                    </p>
                    <p className="col-span-3">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className=" w-full md:h-1/2 h-[40rem] max-sm:mb-8 flex items-center justify-start z-[10] ">
                <Mapping {...mappingProps} />
              </div>
            </div>

            <div className=" col-span-3 row-span-11 ">
              <p className="md:text-2xl text-3xl font-semibold col-span-3 row-span-1 mb-4">
                {t("InventoriesInTheWarehouse")}
              </p>
              <ShowRoomLot
                data={inventoriesShowList}
                storeInfor={warehouse}
                roomShow={state}
                handleBuyClick={() => {
                  console.log("here");
                }}
                handleShowInventoryDetail={() => {
                  console.log("here");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // return (
  //   <>
  //     <div className="max-w-full overflow-hidden landingPage text-3xl">
  //       {/* Header */}
  //       <div className="w-full px-6 md:px-12 lg:px-20 xl:px-[300px] py-4 fixed bg-white shadow flex justify-between items-center z-10 text-4xl">
  //         <div className="flex items-center gap-4">
  //           <div className="text-[#0db977] font-bold cursor-pointer relative">
  //             <img
  //               src="../../../beeShelf.png"
  //               className="h-12 md:h-16 absolute top-[-5px] left-[0]"
  //               alt="BeeShelf"
  //             />
  //             <p className="pl-16">BeeShelf</p>
  //           </div>
  //         </div>
  //         <div className="flex items-center gap-4 ">
  //           <LanguageSelector globalSize={"text-[3.2rem]"} />
  //         </div>
  //       </div>

  //       {/* Main Content */}
  //       <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-6 gap-x-6 mt-20 px-6 md:px-12 lg:px-20 xl:px-[300px] py-8">
  //         {/* Warehouse Information Header */}
  //         <p className="text-4xl font-semibold col-span-1 lg:col-span-2">
  //           {t("WarehouseInformation")}
  //         </p>

  //         {/* Inventory Header */}
  //         <p className="text-4xl font-semibold col-span-1 lg:col-span-3">
  //           {t("InventoriesInTheWarehouse")}
  //         </p>

  //         {/* Warehouse Information */}
  //         <div className="flex flex-col col-span-1 lg:col-span-2 space-y-4">
  //           {/* Warehouse Details */}
  //           <div className="space-y-4">
  //             {[
  //               { label: t("Name") + ":", value: warehouse?.name },
  //               {
  //                 label: t("Location") + ":",
  //                 value: warehouse?.location,
  //                 onClick: () => handleOpenGoogleMaps(warehouse?.location),
  //               },
  //             ].map((item, index) => (
  //               <div
  //                 key={index}
  //                 className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${
  //                   item.onClick ? "cursor-pointer hover:text-blue-600" : ""
  //                 }`}
  //                 onClick={item.onClick ? item.onClick : undefined}
  //               >
  //                 <p className="col-span-1 font-medium text-gray-500">
  //                   {item.label}
  //                 </p>
  //                 <p className="col-span-3">{item.value}</p>
  //               </div>
  //             ))}
  //           </div>
  //           <div className=" w-full h-[50rem] flex items-center justify-start z-[10]" >
  //             <Mapping {...mappingProps} />
  //           </div>
  //         </div>

  //         {/* Inventory List */}
  //         <div className="col-span-1 lg:col-span-3 ml-auto mr-auto">
  //           <ShowRoomLot
  //             data={inventoriesShowList}
  //             storeInfor={warehouse}
  //             roomShow={state}
  //             handleBuyClick={() => {
  //               console.log("here");
  //             }}
  //             handleShowInventoryDetail={() => {
  //               console.log("here");
  //             }}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
}
