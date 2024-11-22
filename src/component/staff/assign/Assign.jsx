import React, { useState, useEffect } from "react";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Drawer, Input } from "antd";
import { Avatar } from "antd";
import useAxios from "../../../services/CustomizeAxios";

const Assign = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const { fetchDataBearer } = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataBearer({
          url: `/order/get-orders`,
          method: "GET",
        });
        setOrders(response.data.items);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const filterOrdersByStatus = (status) =>
    orders.filter((order) => order.status === status);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const onClose = () => setOpen(false);

  return (
    <div className="bg-white p-6">
      {/* Drawer để hiển thị chi tiết */}
      <Drawer
        title="Order Detail"
        placement="right"
        closable={true}
        onClose={onClose}
        open={open}
      >
        {selectedOrder && (
          <>
            <div className="flex justify-center">
              <Avatar
                shape="square"
                src={selectedOrder.image || "default-image.jpg"}
                size={96}
              />
            </div>
            <h3 className="text-center font-bold mt-4">
              {selectedOrder.productName}
            </h3>
            <p className="text-center text-gray-500">
              ${selectedOrder.productPrice}
            </p>
          </>
        )}
      </Drawer>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-3xl">Today's Orders</h1>
        <Input
          size="large"
          placeholder="Search for order"
          prefix={<SearchOutlined />}
          className="w-96"
        />
      </div>

      <div>
        <div className="overflow-x-auto ">
          <div className="flex space-x-4 w-max">
            <OrderColumn
              title="Unassigned"
              orders={filterOrdersByStatus("Unassigned")}
              color="gray"
              onDetailClick={handleOrderClick}
            />
            <OrderColumn
              title="Assigned"
              orders={filterOrdersByStatus("Assigned")}
              color="blue"
              onDetailClick={handleOrderClick}
            />
            <OrderColumn
              title="Processing"
              orders={filterOrdersByStatus("Processing")}
              color="green"
              onDetailClick={handleOrderClick}
            />
            <OrderColumn
              title="Pending"
              orders={filterOrdersByStatus("Pending")}
              color="yellow"
              onDetailClick={handleOrderClick}
            />
            <OrderColumn
              title="Canceled"
              orders={filterOrdersByStatus("Canceled")}
              color={getColorByStatus("Canceled")}
              onDetailClick={handleOrderClick}
            />
            <OrderColumn
              title="Deliveried"
              orders={filterOrdersByStatus("Deliveried")}
              color={getColorByStatus("Deliveried")}
              onDetailClick={handleOrderClick}
            />
            <OrderColumn
              title="Failed"
              orders={filterOrdersByStatus("Failed")}
              color={getColorByStatus("Failed")}
              onDetailClick={handleOrderClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assign;

const getColorByStatus = (status) => {
  switch (status) {
    case "Pending":
      return "yellow";
    case "Shipping":
      return "blue";
    case "Processing":
      return "green";
    case "Draft":
      return "gray";
    case "Completed":
      return "green";
    case "Refunded":
      return "red";
    case "Canceled":
      return "red";
    default:
      return "gray";
  }
};

const OrderColumn = ({ title, orders, color, onDetailClick }) => (
  <div
    className={`w-[344px] rounded-lg shadow overflow-hidden bg-${color}-50 p-4 mb-4`}
  >
    <h2 className={`text-${color}-800 font-bold text-lg mb-4`}>
      {title} <span className={`text-${color}-500`}>{orders.length}</span>
    </h2>
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onDetailClick={onDetailClick} />
      ))}
    </div>
  </div>
);

const OrderCard = ({ order, onDetailClick }) => (
  <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
    <Avatar shape="square" src={order.image || "default-image.jpg"} size={64} />
    <div className="flex-1">
      <h3 className="font-semibold text-gray-700">{order.receiverAddress}</h3>
      <p className="text-sm text-gray-500">${order.productPrice}</p>
      <p className="text-xs text-gray-400">{order.shipper || "Unknown"}</p>
    </div>
    <InfoCircleOutlined
      className="text-gray-400 hover:text-gray-600 cursor-pointer"
      onClick={() => onDetailClick(order)}
    />
  </div>
);