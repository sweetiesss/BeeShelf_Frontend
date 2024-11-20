import React from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const OrderDashboard = () => {
  // Dummy data for sales overview
  const salesOverviewData = {
    labels: ['Profit', 'Expense'],
    datasets: [
      {
        label: 'Sales Overview',
        data: [23450, 23450],
        backgroundColor: ['#4bc0c0', '#e5e5e5'],
        hoverOffset: 4,
      },
    ],
  };

  const salesOverviewOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (tooltipItem) => `$${tooltipItem.raw.toLocaleString()}` } },
    },
  };

  // Dummy data for revenue updates
  const revenueUpdateData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [45, 60, 55, 40, 70, 80, 50],
        backgroundColor: '#4c5df1',
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

  // Dummy data for yearly sales
  const yearlySalesData = {
    labels: ['2022', '2023'],
    datasets: [
      {
        label: '2022 Sales',
        data: [4476],
        borderColor: '#b0b3ff',
        backgroundColor: 'rgba(176, 179, 255, 0.5)',
        fill: true,
        tension: 0.4,
      },
      {
        label: '2023 Sales',
        data: [5476],
        borderColor: '#5142fc',
        backgroundColor: 'rgba(81, 66, 252, 0.3)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const yearlySalesOptions = {
    plugins: {
      legend: { position: 'bottom' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  console.log("@@")
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Order Dashboard</h1>

      {/* Top Row for Sales Data */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <p className="text-xl font-bold">$34,343.00</p>
          <p className="text-gray-500">Total Sales</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <p className="text-xl font-bold">$4.5k <span className="text-sm text-gray-500">(40%)</span></p>
          <p className="text-gray-500">By Website</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <p className="text-xl font-bold">$2.8k <span className="text-sm text-gray-500">(25%)</span></p>
          <p className="text-gray-500">By Mobile</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <p className="text-xl font-bold">$2.2k <span className="text-sm text-gray-500">(20%)</span></p>
          <p className="text-gray-500">By Market</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <p className="text-xl font-bold">$1.7k <span className="text-sm text-gray-500">(15%)</span></p>
          <p className="text-gray-500">By Agent</p>
        </div>
      </div>

      {/* Bottom Row for Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Overview */}
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Sales Overview</h2>
          <Doughnut data={salesOverviewData} options={salesOverviewOptions} />
        </div>

        {/* Revenue Updates */}
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Revenue Updates</h2>
          <Bar data={revenueUpdateData} options={revenueUpdateOptions} />
        </div>

        {/* Yearly Sales */}
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Yearly Sales</h2>
          <Line data={yearlySalesData} options={yearlySalesOptions} />
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;
