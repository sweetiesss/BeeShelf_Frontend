import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const SquareWithResizableBoxes = () => {
  const [layout, setLayout] = useState([]);

  const gridWidth = 500; // Width of the grid in pixels
  const gridCols = 12; // Number of columns in the grid
  const storeWidthMeters = 500; // Store width in meters
  const storeLengthMeters = 900; // Store length in meters
  const pixelToMeterRatio = storeWidthMeters / gridWidth;

  const addRectangle = () => {
    const newItem = {
      i: `room${layout.length + 1}`,
      x: 0,
      y: Infinity, // Places it at the bottom
      w: 2, // Default width (in grid units)
      h: 2, // Default height (in grid units)
    };
    setLayout((prevLayout) => [...prevLayout, newItem]);
  };

  const saveData = () => {
    const rooms = layout.map((box) => ({
      name: box.i,
      width: (box.w * pixelToMeterRatio).toFixed(2),
      length: (box.h * pixelToMeterRatio).toFixed(2),
      x: (box.x * pixelToMeterRatio).toFixed(2),
      y: (box.y * pixelToMeterRatio).toFixed(2),
    }));

    const storeData = {
      name: "storeA",
      width: storeWidthMeters,
      length: storeLengthMeters,
      cols: gridCols,
      rooms,
    };

    console.log("Saved Data:", storeData);
    alert("Data saved. Check the console for output.");
  };
  console.log("layout", layout);

  return (
    <div>
      <div
        style={{
          width: `${storeWidthMeters}px`,
          height: `${storeLengthMeters}px`,
          margin: "auto",
          border: "2px solid black",
        }}
      >
        <GridLayout
          className="layout"
          layout={layout}
          cols={gridCols}
          rowHeight={gridWidth / gridCols} // Square cells
          width={gridWidth}
          onLayoutChange={(newLayout) => setLayout(newLayout)}
          isResizable
          isDraggable
          compactType={null} // Prevents items from auto-moving up
          preventCollision={true} // Avoids unwanted overlapping
        >
          {layout.map((box) => (
            <div
              key={box.i}
              style={{
                backgroundColor: "rgba(0, 128, 255, 0.8)",
                border: "1px solid black",
              }}
            >
              {box.i}
            </div>
          ))}
        </GridLayout>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={addRectangle}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: "#0db977",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Add Rectangle
        </button>
        <button
          onClick={saveData}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Save Data
        </button>
      </div>
    </div>
  );
};

export default SquareWithResizableBoxes;
