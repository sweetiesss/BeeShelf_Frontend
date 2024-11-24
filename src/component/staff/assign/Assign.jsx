import React, { useState, useEffect } from "react";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Drawer, Input, Typography, Divider, List, Spin, Avatar } from "antd";
import useAxios from "../../../services/CustomizeAxios";
import { Button } from "antd";

const Assign = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const { fetchDataBearer } = useAxios();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetchDataBearer({
          url: `/order/get-orders?descending=false&pageIndex=0&pageSize=1000`,
          method: "GET",
        });
        setOrders(response.data.items); // Save the data to state
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // End loading
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
      {/* Drawer for displaying detailed order information */}
      <OrderDetailDrawer order={selectedOrder} onClose={onClose} open={open} />

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
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Spin size="large" tip="Loading orders..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex space-x-4 w-max">
              {["Draft", "Assigned", "Pending", "Processing", "Shipping", "Delivered", "Returned", "Refunded", "Completed", "Canceled"].map((status) => (
                <OrderColumn
                  key={status}
                  title={status}
                  orders={filterOrdersByStatus(status)}
                  color={getColorByStatus(status)}
                  onDetailClick={handleOrderClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assign;

const getColorByStatus = (status) => {
  switch (status) {
    case "Draft":
      return "gray";
    case "Pending":
      return "orange";
    case "Shipping":
      return "blue";
    case "Processing":
      return "purple";
    case "Completed":
      return "cyan";
    case "Delivered":
      return "green";
    case "Returned":
      return "magenta";
    case "Refunded":
      return "gold";
    case "Canceled":
      return "red";
    default:
      return "gray";
  }
};

const OrderColumn = ({ title, orders, color, onDetailClick }) => (
  <div className="w-[344px] rounded-lg shadow-md p-4 bg-white">
    <div
      className={`text-${color}-800 font-bold text-lg flex justify-between items-center mb-4`}
      style={{
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: `${getBackgroundColorByStatus(color)}`,
      }}
    >
      <span>{title}</span>
      <span className={`text-${color}-500`}>{orders.length}</span>
    </div>
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          color={color}
          onDetailClick={onDetailClick}
        />
      ))}
    </div>
  </div>
);

const OrderCard = ({ order, onDetailClick, color }) => (
  <div
    className="flex items-center space-x-4 rounded-lg p-4 shadow-md bg-white"
    style={{
      borderLeft: `4px solid ${getBorderColorByStatus(color)}`,
    }}
  >
    <Avatar
      shape="square"
      size={64}
      src={order.image || "/default-image.png"}
      alt={order.productName || "Product image"}
    />
    <div className="flex-1">
      <h3 className="font-semibold text-gray-700">
        OrderCode:  {order.id || "Order"}       
      </h3>
      <h3 className="font-semibold text-gray-700">
        {order.orderDetails.length - 1} More Type
      </h3>
      <p className="text-gray-500 text-sm">${order.totalPrice}</p>
      <p className="text-gray-400 text-xs">{order.shipper || "Shipper A"}</p>
    </div>
    <InfoCircleOutlined
      className="text-gray-400 hover:text-gray-600 cursor-pointer"
      onClick={() => onDetailClick(order)}
    />
  </div>
);

const getBackgroundColorByStatus = (color) => {
  switch (color) {
    case "gray":
      return "#F5F5F5";
    case "orange":
      return "#FFF2E5";
    case "blue":
      return "#E5F3FF";
    case "purple":
      return "#F3E5FF";
    case "cyan":
      return "#E5FFFF";
    case "green":
      return "#E6FFED";
    case "magenta":
      return "#FFF0F6";
    case "gold":
      return "#FFF7E5";
    case "red":
      return "#FFE5E5";
    default:
      return "#F0F0F0";
  }
};

const getBorderColorByStatus = (color) => {
  switch (color) {
    case "gray":
      return "#BDBDBD";
    case "orange":
      return "#FF9800";
    case "blue":
      return "#2196F3";
    case "purple":
      return "#9C27B0";
    case "cyan":
      return "#00BCD4";
    case "green":
      return "#4CAF50";
    case "magenta":
      return "#F06292";
    case "gold":
      return "#FFC107";
    case "red":
      return "#F44336";
    default:
      return "#BDBDBD";
  }
};

const OrderDetailDrawer = ({ order, onClose, open }) => (
  <Drawer
    title={<Typography.Title level={4} className="mb-0">Order Details</Typography.Title>}
    width={400}
    onClose={onClose}
    open={open}
    bodyStyle={{ padding: '16px' }}
    className="order-detail-drawer"
  >
    {order ? (
      <>
        <div className="flex items-center mb-4">
          <Avatar
            shape="square"
            size={64}
            src={order.orderDetails[0]?.imageUrl || "/default-image.png"}
            alt={order.orderDetails[0]?.productName || "Product image"}
          />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {order.orderDetails[0]?.productName || "Unknown Product"} + {order.orderDetails.length - 1} more
            </h3>
            <span className="text-sm text-gray-500">{order.status || "Unassigned"}</span>
          </div>
        </div>
        <Typography.Title level={5} className="mt-4">
          Receiver details
        </Typography.Title>
        <Divider />
        <p><strong>Receiver address:</strong> {order.receiverAddress}</p>
        <p><strong>Receiver phone:</strong> {order.receiverPhone}</p>
        <p><strong>Create date:</strong> {new Date(order.createDate).toLocaleDateString()}</p>
        <Typography.Title level={5} className="mt-4">
          Order details
        </Typography.Title>
        <Divider />
        <List
          itemLayout="horizontal"
          dataSource={order.orderDetails}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    shape="square"
                    size={48}
                    src={item.imageUrl || "/default-image.png"}
                    alt={item.productName || "Product image"}
                  />
                }
                title={<span>{item.productName}</span>}
                description={
                  <>
                    <span>Price: ${item.productPrice}</span> <br />
                    <span>Quantity: {item.productAmount}</span>
                  </>
                }
              />
              <div>${(item.productPrice * item.productAmount).toFixed(2)}</div>
            </List.Item>
          )}
        />
        <Typography.Title level={5} className="mt-4">
          Order fees
        </Typography.Title>
        <Divider />
        <p><strong>Additional fee:</strong> ${order.orderFees[0]?.additionalFee || 0}</p>
        <p><strong>Delivery fee:</strong> ${order.orderFees[0]?.deliveryFee || 0}</p>
        <p><strong>Storage fee:</strong> ${order.orderFees[0]?.storageFee || 0}</p>
        <div className="flex justify-end mt-6">
          <Button
            type="primary"
            style={{
              backgroundColor: "green",
              borderColor: "green",
            }}
            onClick={() => console.log(`Assigning order ID: ${order.id}`)}
          >
            Assign
          </Button>
        </div>
      </>
    ) : (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" tip="Loading order details..." />
      </div>
    )}
  </Drawer>
);
