import { X } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosInventory from "../../services/Inventory";
import { useTranslation } from "react-i18next";

const ShowRoomLot = ({
  data,
  storeInfor,
  roomShow,
  handleBuyClick,
  handleShowInventoryDetail,
}) => {
  const { t } = useTranslation();
  const [layout, setLayout] = useState(data);

  const gridWidth = storeInfor?.width; // Width of the grid in pixels
  const gridHeight = storeInfor?.length; // Width of the grid in pixels
  const gridCols = storeInfor?.cols; // Number of columns in the grid

  const pixelToMeterRatio = gridWidth / gridCols;

  const aRemStyle = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  const scaleSize = Math.min(
    (47 * aRemStyle) / gridHeight,
    (47 * aRemStyle) / gridWidth
  );

  useEffect(() => {
    const takeingData = data?.map((room) => ({
      ...room,
      i: room.roomCode,
      x: Number(room.x),
      y: Number(room.y),
      w: Math.round(room.width / pixelToMeterRatio),
      h: Math.round(room.length / pixelToMeterRatio),
      static: true,
    }));
    setLayout(takeingData || undefined);
  }, [data]);
  return (
    <div className="flex gap-10 overflow-hidden">
      <div className="px-10 border-2 rounded-lg shadow-xl">
        <p className="mt-4 max-sm:text-3xl text-xl font-medium w-full text-center">
          Room map
        </p>
        <p className="mt-1 w-full text-center max-sm:text-3xl">
          {storeInfor?.width}m x {storeInfor?.length}m
        </p>
        <div className={`w-[50rem] h-[50rem]  flex items-center`}>
          <div
            className="relative"
            style={{
              width: `${gridWidth * scaleSize}px`,
              height: `${gridHeight * scaleSize}px`,
              margin: "auto",
              border: "5px double black",
              boxSizing: "content-box",
            }}
          >
            <div className="absolute w-[30%]  max-w-[82px]  overflow-hidden border-2 border-black bg-white flex items-center justify-center bottom-0 left-[50%] text-center -translate-x-[50%] translate-y-[60%]">
              <p>{t("Entrance")}</p>
            </div>
            {layout && (
              <GridLayout
                className="layout"
                layout={layout}
                cols={gridCols}
                rowHeight={(gridWidth / gridCols) * scaleSize}
                width={gridWidth * scaleSize}
                margin={[0, 0]}
              >
                {layout?.map((box) => (
                  <div
                    className={`relative ${
                      box?.id !== roomShow?.roomId
                        ? "bg-gray-300 "
                        : "bg-green-400 "
                    } flex justify-center items-center overflow-hidden`}
                    key={box.i}
                    style={{
                      border: "1px solid black",
                    }}
                  >
                    <p>{box.roomCode}</p>
                  </div>
                ))}
              </GridLayout>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowRoomLot;
