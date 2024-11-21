import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function InventoryOverview({ inventories }) {
  const revenueUpdateData = {
    labels: ["last week", "this week", "last week", "this week"],
    datasets: [
      {
        data: [45, 60, 12, 30],
        backgroundColor: "#4c5df1",
      },
    ],
  };
  const revenueUpdateOptions = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg space-y-9">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Popular Warehouse</h2>
        <select className="outline outline-2 outline-gray-200 rounded-md px-2 py-1 focus:outline-black ">
          <option>This week</option>
          <option>This month</option>
          <option>This year</option>
        </select>
      </div>
      <div>
        <div className="flex justify-between ">
          <div className="space-y-1 items-start w-1/3">
            <h2 className="text-lg font-bold">Total Warehouses</h2>
            <p className="text-2xl font-bold">150</p>
            <p className="font-normal text-gray-500">
              <span className="font-semibold text-black">+1%</span> vs last
              month
            </p>
          </div>
          <div className="space-y-1 items-start w-1/3">
            <h2 className="text-lg font-bold">Incomes</h2>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-bold">15%</p>
              <p className="font-normal text-gray-500 text-sm bg-gray-300 rounded-lg px-2">
                month
              </p>
            </div>
          </div>
        </div>
        <div className="pl-32">
          <Bar data={revenueUpdateData} options={revenueUpdateOptions} />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p>Here is the overall delivery ratio in areas</p>
        <button className="bg-[var(--main-project-color)] w-1/4 px-2 py-1 rounded-xl text-amber-900">View Detail</button>
      </div>
    </div>
  );
}
