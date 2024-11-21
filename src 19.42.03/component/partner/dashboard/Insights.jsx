import React from "react";

export default function Insights({ inventories, requests, orders }) {
  const data = [
    { label: "Total Shipment", data: inventories?.length, compare: "+10% vs last month" },
    { label: "Total Shipment", data: inventories?.length, compare: "+10% vs last month" },
    { label: "Total Shipment", data: inventories?.length, compare: "+10% vs last month" },
    { label: "Total Shipment", data: inventories?.length, compare: "+10% vs last month" },
  ];
  const CardComponent = ({ label, data, compare }) => {
    return (
      <div className="bg-[var(--main-color)] p-4 rounded-lg shadow-xl space-y-1">
        <h3 className="text-lg font-bold">{label}</h3>
        <div>
          <p className="text-4xl">{data}</p>
        </div>
        <p>{compare}</p>
      </div>
    );
  };

  return (
    <div className="grid grid-rows-2 md:grid-cols-2 gap-6 text-[var(--main-text-color)]">
      {data.map((card) => (
        <CardComponent
          label={card.label}
          data={card.data}
          compare={card.compare}
        />
      ))}
    </div>
  );
}
