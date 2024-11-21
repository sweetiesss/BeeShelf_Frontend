import React from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, ArcElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

export function InventoryChart({ chartData }) {
  const data = {
    labels: chartData?.labels || [], 
    datasets: [
      {
        label: 'Inventory Stock Levels',
        data: chartData?.data || [],
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Inventory Stock Trends' },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Inventory Overview</h2>
      <Line data={data} options={options} />
    </div>
  );
}

export function OrderChart({ orderData }) {
  const data = {
    labels: orderData?.labels || [], 
    datasets: [
      {
        label: 'Orders',
        data: orderData?.data || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Order Trend' },
    },
  };

  return <Bar data={data} options={options} />;
}

export function ProductChart({ productData }) {
  const data = {
    labels: productData?.labels || [],
    datasets: [
      {
        label: 'Product Quantities',
        data: productData?.data || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Product Distribution' },
    },
  };

  return <Doughnut data={data} options={options} />;
}
