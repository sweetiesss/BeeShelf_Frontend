import React, { useState, useEffect } from "react";
import InventoryOverview from "../../component/partner/dashboard/InventoryOverview";
import ProductCreation from "../../component/partner/dashboard/ProductCreation";
import AccountRequests from "../../component/partner/dashboard/AccountRequests";
import OrderManagement from "../../component/partner/dashboard/OrderManagement";
import Insights from "../../component/partner/dashboard/Insights";
import {
  InventoryChart,
  OrderChart,
  ProductChart,
} from "../../component/partner/dashboard/DashboardChart";
import SliderTabs from "../../component/shared/SliderTabs"; // Custom tab/slider component for charts
import OrderDashboard from "../../component/partner/dashboard/OrderDashboard";

export function HomePage() {
  const [inventories, setInventories] = useState([]);
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeChart, setActiveChart] = useState("InventoryChart"); // For chart selection

  const [chartData, setChartData] = useState({
    labels: [],
    data: [],
  });

  const [orderData, setOrderData] = useState({
    labels: [],
    data: [],
  });

  const [productData, setProductData] = useState({
    labels: [],
    data: [],
  });

  // Simulate API fetching using useEffect
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const fetchedInventories = await fetchInventories();
    const fetchedRequests = await fetchAccountRequests();
    const fetchedOrders = await fetchOrders();

    setInventories(fetchedInventories);
    setRequests(fetchedRequests);
    setOrders(fetchedOrders);

    // Update chart data based on mock inventory or order data
    updateChartData(fetchedInventories);
    updateOrderData(fetchedOrders);
    updateProductData(fetchedInventories);
  };

  // Mock function to simulate fetching inventories
  const fetchInventories = async () => {
    return [
      {
        id: 1,
        warehouseName: "Warehouse A",
        products: [
          { id: 1, name: "Product 1", quantity: 100 },
          { id: 2, name: "Product 2", quantity: 50 },
        ],
      },
      {
        id: 2,
        warehouseName: "Warehouse B",
        products: [
          { id: 3, name: "Product 3", quantity: 80 },
          { id: 4, name: "Product 4", quantity: 20 },
        ],
      },
    ];
  };

  // Mock function to simulate fetching account requests
  const fetchAccountRequests = async () => {
    return [
      { id: 1, partnerName: "Partner A", status: "Pending" },
      { id: 2, partnerName: "Partner B", status: "Accepted" },
    ];
  };

  // Mock function to simulate fetching orders
  const fetchOrders = async () => {
    return [
      { id: 1, customerName: "Customer A", status: "Shipped" },
      { id: 2, customerName: "Customer B", status: "Pending" },
    ];
  };

  const updateChartData = (inventories) => {
    const labels = inventories.map((inventory) => inventory.warehouseName);
    const data = inventories.map((inventory) =>
      inventory.products.reduce((acc, product) => acc + product.quantity, 0)
    );

    setChartData({
      labels,
      data,
    });
  };

  const updateOrderData = (orders) => {
    const labels = orders.map((order) => order.customerName);
    const data = orders.map((order) => (order.status === "Shipped" ? 1 : 0)); // Example data logic

    setOrderData({
      labels,
      data,
    });
  };

  const updateProductData = (inventories) => {
    const labels = inventories.flatMap((inventory) =>
      inventory.products.map((p) => p.name)
    );
    const data = inventories.flatMap((inventory) =>
      inventory.products.map((p) => p.quantity)
    );

    setProductData({
      labels,
      data,
    });
  };

  // Function to render the selected chart
  const renderChart = () => {
    switch (activeChart) {
      case "InventoryChart":
        return <InventoryChart chartData={chartData} />;
      case "ProductChart":
        return <ProductChart productData={productData} />;
      case "OrderChart":
        return <OrderDashboard orderData={orderData} />;
      default:
        return <InventoryChart chartData={chartData} />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Partner Dashboard</h1>

      <Insights inventories={inventories} requests={requests} orders={orders} />

      <div className="flex space-x-6 mt-6">
        <div className="w-1/2">
          <SliderTabs
            activeChart={activeChart}
            setActiveChart={setActiveChart}
          />
          {renderChart()}
        </div>

        <div className="w-1/2">
          <InventoryOverview inventories={inventories} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <ProductCreation />
        <AccountRequests requests={requests} />
        <OrderManagement orders={orders} />
      </div>
    </div>
  );
}
export function Dashboard() {
  const [inventories, setInventories] = useState([]);
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeChart, setActiveChart] = useState("InventoryChart"); // For chart selection

  const [chartData, setChartData] = useState({
    labels: [],
    data: [],
  });

  const [orderData, setOrderData] = useState({
    labels: [],
    data: [],
  });

  const [productData, setProductData] = useState({
    labels: [],
    data: [],
  });

  // Simulate API fetching using useEffect
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const fetchedInventories = await fetchInventories();
    const fetchedRequests = await fetchAccountRequests();
    const fetchedOrders = await fetchOrders();

    setInventories(fetchedInventories);
    setRequests(fetchedRequests);
    setOrders(fetchedOrders);

    // Update chart data based on mock inventory or order data
    updateChartData(fetchedInventories);
    updateOrderData(fetchedOrders);
    updateProductData(fetchedInventories);
  };

  // Mock function to simulate fetching inventories
  const fetchInventories = async () => {
    return [
      {
        id: 1,
        warehouseName: "Warehouse A",
        products: [
          { id: 1, name: "Product 1", quantity: 100 },
          { id: 2, name: "Product 2", quantity: 50 },
        ],
      },
      {
        id: 2,
        warehouseName: "Warehouse B",
        products: [
          { id: 3, name: "Product 3", quantity: 80 },
          { id: 4, name: "Product 4", quantity: 20 },
        ],
      },
    ];
  };

  // Mock function to simulate fetching account requests
  const fetchAccountRequests = async () => {
    return [
      { id: 1, partnerName: "Partner A", status: "Pending" },
      { id: 2, partnerName: "Partner B", status: "Accepted" },
    ];
  };

  // Mock function to simulate fetching orders
  const fetchOrders = async () => {
    return [
      { id: 1, customerName: "Customer A", status: "Shipped" },
      { id: 2, customerName: "Customer B", status: "Pending" },
    ];
  };

  const updateChartData = (inventories) => {
    const labels = inventories.map((inventory) => inventory.warehouseName);
    const data = inventories.map((inventory) =>
      inventory.products.reduce((acc, product) => acc + product.quantity, 0)
    );

    setChartData({
      labels,
      data,
    });
  };

  const updateOrderData = (orders) => {
    const labels = orders.map((order) => order.customerName);
    const data = orders.map((order) => (order.status === "Shipped" ? 1 : 0)); // Example data logic

    setOrderData({
      labels,
      data,
    });
  };

  const updateProductData = (inventories) => {
    const labels = inventories.flatMap((inventory) =>
      inventory.products.map((p) => p.name)
    );
    const data = inventories.flatMap((inventory) =>
      inventory.products.map((p) => p.quantity)
    );

    setProductData({
      labels,
      data,
    });
  };

  return (
    <div className="h-full w-full"> 
      <div className="flex justify-between gap-10">
        <div className=" h-full w-1/3 space-y-6">
          <Insights
            inventories={inventories}
            requests={requests}
            orders={orders}
          />
          <InventoryOverview inventories={inventories} />
        </div>
        <div className="bg-blue-400 w-2/3">s</div>
      </div>
    </div>
  );
}
