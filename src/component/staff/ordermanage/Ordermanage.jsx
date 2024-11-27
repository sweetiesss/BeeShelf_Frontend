import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Dropdown,
  Button,
  Menu,
  Space,
  Drawer,
  Typography,
  Divider,
  message,
  List,
  Select,
} from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import useAxios from "../../../services/CustomizeAxios";
import { useAuth } from "../../../context/AuthContext";

const { Option } = Select;

const Ordermanage = () => {
  const [filter, setFilter] = useState("All"); // Default filter is "All"
  const [data, setData] = useState([]); // State to hold API data
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for drawer
  const { fetchDataBearer } = useAxios(); // Custom Axios hook

  const [warehouseId, setWarehouseId] = useState("");
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({
    totalItemsCount: 0,
    pageSize: 10,
    totalPagesCount: 0,
    pageIndex: 0,
  });
  const [email, setEmail] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const { userInfor } = useAuth();
  useEffect(() => {
    fetchRequests(0);
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // Start loading
      try {
        console.log(userInfor?.workAtWarehouseId);
        const response = await fetchDataBearer({
          url: `/order/get-warehouse-orders`,
          method: "GET",
          params: {
            warehouseId: userInfor?.workAtWarehouseId,
            pageIndex: 0,
            pageSize: pagination.pageSize,
          },
        });

        const formattedData = response.data.items
          .filter((item) => item.status !== "Draft") // Lọc bỏ trạng thái Draft
          .map((item) => ({
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

  const updateRequestStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      // Log dữ liệu trước khi gửi
      console.log("Updating status for ID:", id, "to new status:", newStatus);

      const response = await fetchDataBearer({
        url: `/order/update-order-status/${id}?orderStatus=${newStatus}`,
        method: "PUT",
      });

      if (response && response.status === 200) {
        message.success("Status updated successfully!");
        fetchRequests(pagination.pageIndex); // Làm mới bảng sau khi cập nhật
      } else {
        const errorMessage =
          response?.data?.message || "Failed to update status.";
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(
        error.response?.data?.message ||
          "Failed to update status. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
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
      dataIndex: "partner_email",
      key: "orderName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Space direction="vertical">
          {renderStatusTag(status)}
          <Select
            style={{ width: 75, padding: 0 }}
            placeholder="Update Status"
            onChange={(newStatus) => updateRequestStatus(record.id, newStatus)}
            defaultValue={status}
          >
            <Option value="Pending">Pending</Option>
            <Option value="Processing">Processing</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Refunded">Refunded</Option>
          </Select>
        </Space>
      ),
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
      dataIndex: "createDate",
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
        <Button onClick={() => setSelectedOrder(record.order)}>
          View Details
        </Button>
      ),
    },
  ];

  // Fetch requests by warehouseId
  const fetchRequests = async (pageIndex = 0) => {
    // if (!warehouseId) {
    //   message.error("Please enter a Warehouse ID!");
    //   return;
    // }

    setLoading(true);

    try {
      console.log(userInfor?.workAtWarehouseId);
      const response = await fetchDataBearer({
        url: `/order/get-warehouse-orders`,
        method: "GET",
        params: {
          warehouseId: userInfor?.workAtWarehouseId,
          pageIndex,
          pageSize: pagination.pageSize,
        },
      });

      if (response && response.data) {
        const { totalItemsCount, pageSize, totalPagesCount, pageIndex, items } =
          response.data;

        setRequests(
          items.map((item) => ({
            key: item.id,
            ...item,
          }))
        );

        setPagination({
          totalItemsCount,
          pageSize,
          totalPagesCount,
          pageIndex,
        });

        message.success("Data loaded successfully!");
      } else {
        message.error("No data returned from the server.");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      message.error("Failed to fetch requests. Please check the Warehouse ID.");
    } finally {
      setLoading(false);
    }
  };

  // const handleEmailSubmit = async () => {
  //   if (!email) {
  //     message.error("Please enter an email!");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await fetchDataBearer({
  //       url: `/user/get-employee/${email}`,
  //       method: "GET",
  //     });

  //     if (response && response.data) {
  //       const {
  //         workAtWarehouseId,
  //         workAtWarehouseName,
  //         lastName,
  //         email: employeeEmail,
  //       } = response.data;
  //       setEmployeeDetails({
  //         workAtWarehouseId,
  //         workAtWarehouseName,
  //         lastName,
  //         email: employeeEmail,
  //       });
  //       message.success("Employee details fetched successfully!");
  //     } else {
  //       message.error("No data returned from the server.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching employee details:", error);
  //     message.error(
  //       "Failed to fetch employee details. Please check the email."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
      <Menu.Item key="Returned">Returned</Menu.Item>
      <Menu.Item key="Refunded">Refunded</Menu.Item>
      <Menu.Item key="Completed">Completed</Menu.Item>
    </Menu>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Order Management</h1>

      <div className="flex items-center justify-between">
        <Space
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {/* <Input
            placeholder="Enter Email"
            style={{ width: 300 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="primary" onClick={handleEmailSubmit} loading={loading}>
            Submit Email
          </Button> */}
        </Space>
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
      </div>
      {employeeDetails && (
        <Table
          dataSource={[{ key: 1, ...employeeDetails }]}
          columns={[
            {
              title: "Warehouse ID",
              dataIndex: "workAtWarehouseId",
              key: "workAtWarehouseId",
            },
            {
              title: "Warehouse Name",
              dataIndex: "workAtWarehouseName",
              key: "workAtWarehouseName",
            },
            {
              title: "Last Name",
              dataIndex: "lastName",
              key: "lastName",
            },
            {
              title: "Email",
              dataIndex: "email",
              key: "email",
            },
          ]}
          pagination={false}
        />
      )}

      <Space
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      ></Space>
      {/* <Table
        dataSource={requests}
        columns={columns}
        loading={loading} // Show loading spinner while fetching data
        pagination={{
          pageSize: 10,
          position: ["bottomCenter"],
        }}
        rowSelection={{
          type: "checkbox",
        }}
      /> */}
      <Table
        dataSource={data.filter((item) => item.status !== "Draft")} // Lọc bỏ Draft
        columns={columns}
        loading={loading}
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
