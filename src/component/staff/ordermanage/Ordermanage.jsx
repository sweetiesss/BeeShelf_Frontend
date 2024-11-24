import React, { useState, useEffect } from "react";
import { Table, Tag, Input, Dropdown, Button, Menu, Space, Drawer, Typography, Divider, List } from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import useAxios from "../../../services/CustomizeAxios";

const Ordermanage = () => {
  const [filter, setFilter] = useState("All"); // Default filter is "All"
  const [data, setData] = useState([]); // State to hold API data
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for drawer
  const { fetchDataBearer } = useAxios(); // Custom Axios hook

  // Fetch data from API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetchDataBearer({
          url: `/order/get-orders?descending=false&pageIndex=0&pageSize=1000`,
          method: "GET",
        });
        const formattedData = response.data.items.map((item) => ({
          key: item.id, // Unique key for table row
          order: item, // Store full order data
          orderName: item.partner_email, // Use partner email as the "order name"
          status: item.status,
          receiverPhone: item.receiverPhone,
          receiverAddress: item.receiverAddress,
          date: item.createDate.split("T")[0], // Extract date from ISO format
          totalPrice: `$${item.totalPrice}`, // Format total price
        }));
        setData(formattedData);
        setFilteredData(formattedData); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchOrders();
  }, []);

  // Filter data based on selected status
  useEffect(() => {
    if (filter === "All") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((item) => item.status === filter));
    }
  }, [filter, data]);

  // Render function for "Status" column in the table
  const renderStatusTag = (status) => {
    let color;
    switch (status) {
      case "Pending":
        color = "orange";
        break;
      case "Canceled":
        color = "red";
        break;
      case "Processing":
        color = "purple";
        break;
      case "Delivered":
        color = "green";
        break;
      case "Shipping":
        color = "blue";
        break;
      case "Draft":
        color = "gray";
        break;
      case "Returned":
        color = "magenta";
        break;
      case "Refunded":
        color = "gold";
        break;
      case "Completed":
        color = "cyan";
        break;
      default:
        color = "default";
    }
    return <Tag color={color}>{status}</Tag>;
  };

  // Table columns
  const columns = [
    {
      title: "Order Code",
      dataIndex: "key",
      key: "key",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Partner Email",
      dataIndex: "orderName",
      key: "orderName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderStatusTag,
    },
    {
      title: "Receiver Phone",
      dataIndex: "receiverPhone",
      key: "receiverPhone",
    },
    {
      title: "Receiver Address",
      dataIndex: "receiverAddress",
      key: "receiverAddress",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => setSelectedOrder(record.order)}>View Details</Button>
      ),
    },
  ];

  // Dropdown menu for filtering by status
  const statusMenu = (
    <Menu
      onClick={(e) => {
        setFilter(e.key); // Update selected filter
      }}
    >
      <Menu.Item key="All">All</Menu.Item>
      <Menu.Item key="Pending">Pending</Menu.Item>
      <Menu.Item key="Processing">Processing</Menu.Item>
      <Menu.Item key="Delivered">Delivered</Menu.Item>
      <Menu.Item key="Canceled">Canceled</Menu.Item>
      <Menu.Item key="Shipping">Shipping</Menu.Item>
      <Menu.Item key="Draft">Draft</Menu.Item>
      <Menu.Item key="Returned">Returned</Menu.Item>
      <Menu.Item key="Refunded">Refunded</Menu.Item>
      <Menu.Item key="Completed">Completed</Menu.Item>
    </Menu>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Order Management</h1>
      <Space style={{ marginBottom: 16 }}>
        <Dropdown overlay={statusMenu}>
          <Button>
            Filter by: {filter} <DownOutlined />
          </Button>
        </Dropdown>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search for order"
          style={{ width: 300 }}
        />
      </Space>
      <Table
        dataSource={filteredData}
        columns={columns}
        loading={loading} // Show loading spinner while fetching data
        pagination={{
          pageSize: 10,
          position: ["bottomCenter"],
        }}
        rowSelection={{
          type: "checkbox",
        }}
      />
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

// Drawer Component for Order Details
const OrderDetailDrawer = ({ order, onClose }) => (
  <Drawer
    title={`Order Details - ID: ${order.id}`}
    width={400}
    onClose={onClose}
    open={!!order}
  >
    <Typography.Title level={5}>Order Information</Typography.Title>
    <Divider />
    <p>
      <strong>Status:</strong> {order.status}
    </p>
    <p>
      <strong>Partner Email:</strong> {order.partner_email}
    </p>
    <p>
      <strong>Receiver Phone:</strong> {order.receiverPhone}
    </p>
    <p>
      <strong>Receiver Address:</strong> {order.receiverAddress}
    </p>
    <p>
      <strong>Total Price:</strong> ${order.totalPrice.toLocaleString()}
    </p>
    <Divider />
    <Typography.Title level={5}>Order Items</Typography.Title>
    <List
      dataSource={order.orderDetails}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={`${item.productName} (x${item.productAmount})`}
            description={`Price: $${item.productPrice}`}
          />
        </List.Item>
      )}
    />
    <Divider />
    <Typography.Title level={5}>Fees</Typography.Title>
    <p>
      <strong>Delivery Fee:</strong> ${order.orderFees[0]?.deliveryFee || 0}
    </p>
    <p>
      <strong>Storage Fee:</strong> ${order.orderFees[0]?.storageFee || 0}
    </p>
    <p>
      <strong>Additional Fee:</strong> ${order.orderFees[0]?.additionalFee || 0}
    </p>
  </Drawer>
);

export default Ordermanage;
