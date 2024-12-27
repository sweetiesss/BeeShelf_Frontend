import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const RoomMapping = () => {
  const storeData = {
    name: "storeA",
    width: 500,
    length: 900,
    cols: 12,
    rooms: [
      {
        name: "room2",
        width: "6.00",
        length: "5.00",
        x: "6.00",
        y: "0.00",
      },

      {
        name: "room4",
        width: "6.00",
        length: "3.00",
        x: "0.00",
        y: "2.00",
      },
    ],
  };

  const cols = storeData.cols;
  const gridWidth = storeData.width;

  // Convert room data to GridLayout format
  const layout = storeData.rooms.map((room) => ({
    i: room.name,
    x: parseFloat(room.x),
    y: parseFloat(room.y),
    w: parseFloat(room.width),
    h: parseFloat(room.length),
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
