import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const RoomMapping = () => {
  const storeData = {
    name: "storeA",
    width: 500,
    length: 200,
    cols: 12,
    rooms: [
      {
        roomCode: "A1",
        isCold: 0,
        maxWeight: 0,
        price: 0,
        width: "41.67",
        length: "41.67",
        x: 0,
        y: 0,
      },
      {
        roomCode: "A2",
        isCold: 0,
        maxWeight: 0,
        price: 0,
        width: "41.67",
        length: "41.67",
        x: 1,
        y: 0,
      },
      {
        roomCode: "A3",
        isCold: "1",
        maxWeight: 0,
        price: 0,
        width: "41.67",
        length: "41.67",
        x: 0,
        y: 1,
      },
    ],
  };

  const cols = storeData.cols || 1;
  const gridWidth = storeData.width;
  const pixelToMeterRatio = gridWidth / cols;

  // Convert room data to GridLayout format
  const layout = storeData.rooms.map((room) => ({
    i: room.roomCode,
    x: Number(room.x),
    y: Number(room.y),
    w: parseFloat(room.width / pixelToMeterRatio),
    h: parseFloat(room.length / pixelToMeterRatio),
    static: true, // Read-only
  }));

  console.log("layuout", layout);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>{storeData.name} Mapping</h2>
      <div
        style={{
          width: `${storeData.width}px`,
          height: `${storeData.length}px`,
          margin: "auto",
          border: "2px solid black",
        }}
      >
        <GridLayout
          className="layout"
          layout={layout}
          cols={cols}
          rowHeight={gridWidth / cols} // Maintain aspect ratio for grid cells
          width={gridWidth}
          isResizable={false}
          isDraggable={false}
        >
          {layout.map((box) => (
            <div
              key={box.i}
              style={{
                backgroundColor: "rgba(0, 128, 255, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                border: "1px solid black",
              }}
            >
              {box.i}
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};

export default RoomMapping;
