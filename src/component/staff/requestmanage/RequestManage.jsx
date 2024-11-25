import React, { useState } from "react";
import { Table, Tag, Select, Input, Space, Button, Form, message } from "antd";
import useAxios from "../../../services/CustomizeAxios";

const { Option } = Select;

const RequestManagement = () => {
  const [userId, setUserId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const { fetchDataBearer } = useAxios();

  // Fetch requests by userId
  const fetchRequests = async (id) => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: `/request/get-requests/${id}`,
        method: "GET",
      });
      console.log("API Response:", response); // Debugging log for the response

      if (response && response.data) {
        const formattedRequests = response.data.map((req) => ({
          key: req.id,
          id: req.id,
          name: req.name,
          description: req.description,
          status: req.status,
          productName: req.productName,
          productImage: req.productImage || "https://via.placeholder.com/40",
          createDate: req.createDate,
          warehouseName: req.warehouseName,
        }));
        setRequests(formattedRequests);
        message.success("Data loaded successfully!");
      } else {
        message.error("No data returned from the server.");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      message.error("Failed to fetch requests. Please check the user ID.");
    } finally {
      setLoading(false);
    }
  };

  // Validate userId
  const checkUserId = (id) => {
    if (!id) {
      message.error("User ID is required!");
      return false;
    }
    if (isNaN(id)) {
      message.error("User ID must be a number!");
      return false;
    }
    if (id <= 0) {
      message.error("User ID must be a positive number!");
      return false;
    }
    return true;
  };

  const handleUserIdSubmit = (values) => {
    const { userId: enteredUserId } = values;

    if (checkUserId(enteredUserId)) {
      setUserId(enteredUserId);
      fetchRequests(enteredUserId);
    }
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const renderStatusTag = (status) => {
    const colorMap = {
      Pending: "orange",
      Accept: "green",
      Delivered: "cyan",
      Canceled: "red",
      Completed: "blue",
    };
    return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
  };

  const filteredRequests = requests.filter(
    (req) =>
      (!statusFilter || req.status === statusFilter) &&
      req.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Request Management</h1>
      {/* User ID Input Form */}
      <Form
        layout="inline"
        onFinish={handleUserIdSubmit}
        style={{ marginBottom: "20px" }}
      >
        <Form.Item
          name="userId"
          rules={[{ required: true, message: "Please enter a User ID" }]}
        >
          <Input
            placeholder="Enter User ID"
            style={{ width: 300 }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Load Requests
          </Button>
        </Form.Item>
      </Form>

      {/* Filters and Actions */}
      <Space style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Space>
          <Select
            placeholder="Filter by status"
            style={{ width: 200 }}
            onChange={handleFilterChange}
            allowClear
          >
            <Option value="Pending">Pending</Option>
            <Option value="Accept">Accept</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Canceled">Canceled</Option>
            <Option value="Completed">Completed</Option>
          </Select>
          <Input
            placeholder="Search for request"
            style={{ width: 300 }}
            value={searchText}
            onChange={handleSearch}
          />
        </Space>
        <Button type="primary" onClick={() => message.info("Add new functionality here")}>
          Add New Request
        </Button>
      </Space>

      {/* Request Table */}
      <Table
        dataSource={filteredRequests}
        columns={[
          {
            title: "",
            dataIndex: "productImage",
            key: "productImage",
            render: (url) => (
              <img
                src={url}
                alt="Request"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            ),
          },
          { title: "Request Name", dataIndex: "name", key: "name" },
          { title: "Description", dataIndex: "description", key: "description" },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: renderStatusTag,
          },
          { title: "Product Name", dataIndex: "productName", key: "productName" },
          { title: "Warehouse", dataIndex: "warehouseName", key: "warehouseName" },
          { title: "Create Date", dataIndex: "createDate", key: "createDate" },
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <Button
                icon={<i className="fas fa-info-circle" />}
                onClick={() => message.info(`Viewing details for ${record.name}`)}
              >
                Info
              </Button>
            ),
          },
        ]}
        loading={loading}
        pagination={{ pageSize: 10, position: ["bottomCenter"] }}
        rowSelection={{
          onChange: (selectedRowKeys) => {
            console.log("Selected rows: ", selectedRowKeys);
          },
        }}
      />
    </div>
  );
};

export default RequestManagement;
