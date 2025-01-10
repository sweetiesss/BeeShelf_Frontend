import { useLocation, useNavigate } from "react-router-dom";
import { HeaderUnauthenticated } from "../../component/layout/Header";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { LanguageSelector } from "../../component/shared/ChangeLanguages";
import Mapping from "../../component/shared/Mapping";
import axios from "axios";
import ShowRoomLot from "../partner/ShowRoomLot";

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
        <div className="w-full px-[300px] py-[23px] fixed bg-white shadow flex justify-between items-center z-10">
          <div className="flex items-center gap-[20px]">
            <div className="text-[#0db977] text-[25px] font-bold cursor-pointer  relative">
              <img
                src="../../../beeShelf.png"
                className="h-[5rem] w-fit absolute top-[-25px] left-[-85px]"
              />
              <p>BeeShelf</p>
            </div>
          </div>
          <div className="flex items-center gap-[20px]">
            <LanguageSelector />
          </div>
        </div>
        <div className=" grid grid-cols-5 grid-rows-12 mt-10 gap-y-4 gap-x-10 py-10">
          <p className="text-2xl font-semibold col-span-2 row-span-1">
            {t("WarehouseInformation")}
          </p>
          <p className="text-2xl font-semibold col-span-3 row-span-1">
            {t("InventoriesInTheWarehouse")}
          </p>
          <div className="flex flex-col col-span-2 row-span-11">
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
                  className={`grid-cols-4 grid gap-4 mb-4 ${
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
            <div className=" w-full h-1/2 flex items-center justify-start z-[10] ">
              <Mapping {...mappingProps} />
            </div>
          </div>

          <div className=" col-span-3 row-span-11  ">
            <ShowRoomLot
              data={inventoriesShowList}
              storeInfor={warehouse}
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
    </>
  );
}
