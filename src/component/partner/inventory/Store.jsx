import React from "react";
import ReactFlow, { Background, Controls, MiniMap } from "react-flow-renderer";

const Store = () => {
  const roomData = [
    { id: "1", name: "Phòng Bán Hàng", position: { x: 100, y: 100 } },
    { id: "2", name: "Kho Hàng", position: { x: 300, y: 100 } },
    { id: "3", name: "Phòng Quản Lý", position: { x: 100, y: 300 } },
    { id: "4", name: "Phòng Nghỉ", position: { x: 300, y: 300 } },
  ];
  const nodes = roomData.map((room) => ({
    id: room.id,
    type: "default",
    position: room.position,
    data: {
      label: (
        <div
          style={{
            textAlign: "center",
            padding: "10px",
            border: "1px solid #000",
            borderRadius: "8px",
            backgroundColor: "#f5f5f5",
            cursor: "pointer",
          }}
          onClick={() => alert(`You clicked on: ${room.name}`)}
        >
          {room.name}
        </div>
      ),
    },
  }));
  const edges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      label: "Kho -> Bán",
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      animated: true,
      label: "Quản Lý -> Nghỉ",
    },
  ];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        style={{ background: "#e0e0e0" }}
      >
        <Background
          color="#aaa"
          gap={16}
          variant="dots"
          style={{ opacity: 0.5 }}
        />
        <MiniMap
          nodeColor={(node) =>
            node.id === "1" ? "green" : node.id === "2" ? "blue" : "gray"
          }
          nodeBorderRadius={4}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Store;
