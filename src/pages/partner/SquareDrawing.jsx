import { X } from "@phosphor-icons/react";
import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosInventory from "../../services/Inventory";

const SquareWithResizableBoxes = () => {
  const location = useLocation();
  const { createInventory } = AxiosInventory();
  const nav = useNavigate();
  
  const [layout, setLayout] = useState([]);
  const [error, setError] = useState([]);
  const [fieldError, setFieldError] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const storeInfor = location?.state;
  const gridWidth = storeInfor?.width; 
  const gridHeight = storeInfor?.length; 
  const gridCols = storeInfor?.cols; 

  const pixelToMeterRatio = gridWidth / gridCols;

  const aRemStyle = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  const scaleSize = Math.min(
    (30 * aRemStyle) / gridHeight,
    (30 * aRemStyle) / gridWidth
  );
  const maxRows = Math.floor(gridHeight / (gridWidth / gridCols));
  const addRectangle = () => {
    if (error?.length > 0) {
      toast.warning("Please fix or remove the error room first.");
      return;
    }
    const newItem = {
      i: `${layout.length + 1}`,
      x: 0,
      y: maxRows, 
      w: 1, 
      h: 1, 
      isCold: 0,
      roomCode: `A${layout.length + 1}`,
      maxWeight:
        storeInfor?.capacity * (1 / Number(maxRows * gridCols)).toFixed(2),
      price: 10000,
    };
    setError((prev) => [...prev, newItem]);
    setLayout((prevLayout) => [...prevLayout, newItem]);
  };

  const saveData = async () => {
    try {
      const rooms = layout.map((box) => ({
        roomCode: box.roomCode,
        isCold: box.isCold,
        maxWeight: box.maxWeight.toFixed(2),
        price: box.price,
        width: (box.w * pixelToMeterRatio).toFixed(2),
        length: (box.h * pixelToMeterRatio).toFixed(2),
        x: box.x,
        y: box.y,
      }));

      const storeData = {
        storeId: storeInfor?.id,
        data: rooms,
      };
      const result = await createInventory(storeData);
      if (result?.status === 200) {
        nav("../store");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResizeStop = (currentLayout, oldItem, newItem) => {
    const realOldRoom = layout.find((item) => item.i === newItem.i);
    setError((prev) => prev.filter((errorItem) => errorItem.i !== newRoom.i));
    let newLayout = layout;
    let newRoom = {
      ...realOldRoom,
      x: newItem.x,
      y: newItem.y,
      w: newItem.w,
      h: newItem.h,
      maxWeight:
        storeInfor?.capacity *
        ((newItem?.w * newItem.h) / Number(maxRows * gridCols)).toFixed(2),
    };
    if (newRoom.y + newRoom.h > maxRows) {
      setError((prev) => [...prev, newRoom]);
    }
    newLayout = [...newLayout.filter((item) => item.i != newRoom.i), newRoom];
    setLayout(newLayout);
  };

  const handleDragStop = (currentLayout, oldItem, newItem) => {
    let newLayout = layout;
    setError((prev) => prev.filter((errorItem) => errorItem?.i !== newItem?.i));
    const realOldRoom = layout.find((item) => item.i === newItem.i);
    let newRoom = {
      ...realOldRoom,
      x: newItem.x,
      y: newItem.y,
      w: newItem.w,
      h: newItem.h,
    };
    newLayout = [...newLayout.filter((item) => item.i != newRoom.i), newRoom];

    if (newRoom.y + newRoom.h > maxRows) {
      setError((prev) => [...prev, newRoom]);
    }
    setLayout(newLayout);
  };

  const handleChange = (e, item) => {
    const { name, value } = e.target;
    let validationErrors = [];
    if (name === "roomCode") {
      if (!value || value.trim() === "") {
        validationErrors.push({
          i: item.i,
          errorField: "roomCode",
          messError: "Room code cannot be empty.",
        });
      }
      if (
        layout.some(
          (layoutItem) =>
            layoutItem.roomCode === value.trim() && layoutItem.i !== item.i
        )
      ) {
        validationErrors.push({
          i: item.i,
          errorField: "roomCode",
          messError: "Room code must be unique.",
        });
      }
    } else if (name === "price") {
      if (isNaN(value) || Number(value) <= 0) {
        validationErrors.push({
          i: item.i,
          errorField: "price",
          messError: "Price must be a positive number.",
        });
      }
    }
    setLayout((prev) =>
      prev.map((layoutItem) =>
        layoutItem.i === item.i ? { ...layoutItem, [name]: value } : layoutItem
      )
    );

    setFieldError((prevErrors) => {
      const filteredErrors = prevErrors.filter(
        (errorItem) =>
          !(errorItem.i === item.i && errorItem.errorField === name)
      );
      return [...filteredErrors, ...validationErrors];
    });
  };
  return (
    <div className="flex gap-10 overflow-hidden">
      <div className="px-10 border-2 rounded-lg shadow-xl">
        <p className="mt-4 text-xl font-medium w-full text-center">
          {storeInfor?.name}
        </p>
        <p className="mt-1 w-full text-center">
          {storeInfor?.width}m x {storeInfor?.length}m
        </p>
        <div className={`w-[50rem] h-[50rem]  flex items-center`}>
          <div
            className="relative"
            style={{
              width: `${gridWidth * scaleSize}px`,
              height: `${gridHeight * scaleSize}px`,
              margin: "auto",
              boxSizing:"content-box",
              border: "5px double black",
            }}
          >
            <div className="absolute w-[30%]  max-w-[82px] z-[100]  overflow-hidden border-2 border-black bg-white flex items-center justify-center bottom-0 left-[50%] text-center -translate-x-[50%] translate-y-[60%]">
              <p>Entrance</p>
            </div>
            <GridLayout
              className="layout"
              layout={layout}
              cols={gridCols}
              rowHeight={(gridWidth / gridCols) * scaleSize}
              width={gridWidth * scaleSize}
              isResizable
              isDraggable
              margin={[0, 0]}
              onResize={handleResizeStop} 
              onDrag={handleDragStop}
              compactType={null}
              preventCollision={true} 
            >
              {layout.map((box) => (
                <div
                  className="relative cursor-move"
                  key={box.i}
                  style={{
                    backgroundColor:
                      error?.find((errorI) => errorI.i === box.i) ||
                      fieldError?.find((errorI) => errorI.i === box.i)
                        ? "#ef4444"
                        : "rgba(0, 128, 255, 0.8)",
                    border: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p>{box.roomCode}</p>
                </div>
              ))}
            </GridLayout>
          </div>
        </div>
      </div>
      <div className="p-10 border-2 rounded-lg shadow-xl w-full">
        <div className="grid-cols-2 grid  gap-4 overflow-auto max-h-[70vh]">
          {layout

            ?.sort((a, b) => parseInt(a.i) - parseInt(b.i))
            ?.map((item) => {
              const isError = [
                ...error?.filter((errorI) => errorI.i === item.i),
                ...fieldError?.filter((errorI) => errorI.i === item.i),
              ];
              return (
                <div
                  className="grid grid-cols-2 gap-1  border-2 rounded-lg px-4 py-6 relative "
                  style={{
                    borderColor: isError.length > 0 && "#ef4444",
                  }}
                >
                  <div
                    className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/3  cursor-pointer hover:text-black text-gray-400"
                    onClick={(e) => {
                      setError((prev) =>
                        prev.filter((errorItem) => errorItem?.i !== item?.i)
                      );
                      setFieldError((prev) =>
                        prev.filter((errorItem) => errorItem?.i !== item?.i)
                      );
                      setLayout(
                        layout.filter((itemLayout) => itemLayout.i !== item.i)
                      );
                    }}
                  >
                    <X weight="bold" />
                  </div>
                  <p className={`w-full text-nowrap `}>Room Code:</p>
                  <input
                    value={item.roomCode}
                    onChange={(e) => handleChange(e, item)}
                    name="roomCode"
                    className="w-full px-1 border-2"
                  />
                  {isError?.find((item) => item.errorField === "roomCode") && (
                    <p className="text-red-500 font-medium col-span-2 mt-2">
                      {
                        isError?.find((item) => item.errorField === "roomCode")
                          ?.messError
                      }
                    </p>
                  )}
                  <p className={`w-full text-nowrap `}>Max Weight (kg):</p>

                  <input
                    value={item.maxWeight}
                    onChange={(e) => handleChange(e, item)}
                    name="maxWeight"
                    type="number"
                    className="w-full px-1 border-2"
                  />
                  {isError?.find((item) => item.errorField === "maxWeight") && (
                    <p className="text-red-500 font-medium col-span-2 mt-2">
                      {
                        isError?.find((item) => item.errorField === "maxWeight")
                          ?.messError
                      }
                    </p>
                  )}
                  <p className={`w-full text-nowrap `}>Price (vnd):</p>

                  <input
                    value={item.price}
                    onChange={(e) => handleChange(e, item)}
                    name="price"
                    type="number"
                    className="w-full px-1 border-2"
                  />
                  {isError?.find((item) => item.errorField === "price") && (
                    <p className="text-red-500 font-medium col-span-2 mt-2">
                      {
                        isError?.find((item) => item.errorField === "price")
                          ?.messError
                      }
                    </p>
                  )}
                  <p className="w-full text-nowrap">Room Type:</p>                  <select
                    value={item?.isCold}
                    onChange={(e) => handleChange(e, item)}
                    name="isCold"
                    className="w-full px-1 border-2"
                  >
                    <option value={0}>Normal</option>
                    <option value={1}>Frozen</option>
                  </select>
                </div>
              );
            })}
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={addRectangle}
            style={{
              marginRight: "10px",
              padding: "10px 20px",
              backgroundColor: error?.length > 0 ? "#d1d5db" : "#0db977",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              borderRadius: "5px",
            }}
            disabled={error?.length > 0}
          >
            Add Rectangle
          </button>
          <button
            onClick={saveData}
            style={{
              padding: "10px 20px",
              backgroundColor: error?.length > 0 ? "#d1d5db" : "#007bff",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              borderRadius: "5px",
            }}
            disabled={error?.length > 0}
          >
            Save Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SquareWithResizableBoxes;
