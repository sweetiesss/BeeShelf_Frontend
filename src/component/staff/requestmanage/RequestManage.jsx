import React, { useState } from "react";
import { Table, Tag, Input, Space, Button, message, Select } from "antd";
import useAxios from "../../../services/CustomizeAxios";

const { Option } = Select;

const RequestManagement = () => {
  const [warehouseId, setWarehouseId] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalItemsCount: 0,
    pageSize: 10,
    totalPagesCount: 0,
    pageIndex: 0,
  });
  const [email, setEmail] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const { fetchDataBearer } = useAxios();

  // Fetch requests by warehouseId
  const fetchRequests = async (pageIndex = 0) => {
    if (!warehouseId) {
      message.error("Please enter a Warehouse ID!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: `/request/get-requests`,
        method: "GET",
        params: {
          warehouseId,
          pageIndex,
          pageSize: pagination.pageSize,
        },
      });

      if (response && response.data) {
        const { totalItemsCount, pageSize, totalPagesCount, pageIndex, items } = response.data;

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

  const handlePageChange = (page) => {
    fetchRequests(page - 1);
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      message.error("Please enter an email!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: `/user/get-employee/${email}`,
        method: "GET",
      });

      if (response && response.data) {
        const { workAtWarehouseId, workAtWarehouseName, lastName, email: employeeEmail } =
          response.data;
        setEmployeeDetails({
          workAtWarehouseId,
          workAtWarehouseName,
          lastName,
          email: employeeEmail,
        });
        message.success("Employee details fetched successfully!");
      } else {
        message.error("No data returned from the server.");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      message.error("Failed to fetch employee details. Please check the email.");
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id, newStatus) => {
    if (!newStatus) {
      message.error("Please select a new status!");
      return;
    }

    setLoading(true);
    try {
      // Log dữ liệu trước khi gửi
      console.log("Updating status for ID:", id, "to new status:", newStatus);

      const response = await fetchDataBearer({
        url: `/request/update-request-status/${id}`,
        method: "PUT",
        data: { status: newStatus },
      });

      if (response && response.status === 200) {
        message.success("Status updated successfully!");
        fetchRequests(pagination.pageIndex); // Làm mới bảng sau khi cập nhật
      } else {
        const errorMessage = response?.data?.message || "Failed to update status.";
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(error.response?.data?.message || "Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStatusTag = (status) => {
    const colorMap = {
      Processing: "blue",
      Delivered: "cyan",
      Completed: "green",
      Failed: "red",
      Canceled: "orange",
    };
    return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Request Management</h1>

      {/* Email Input */}
      <Space style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-start" }}>
        <Input
          placeholder="Enter Email"
          style={{ width: 300 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="primary" onClick={handleEmailSubmit} loading={loading}>
          Submit Email
        </Button>
      </Space>

      {/* Display Employee Details */}
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

      {/* Warehouse ID Input */}
      <Space style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-start" }}>
        <Input
          placeholder="Enter Warehouse ID"
          style={{ width: 300 }}
          value={warehouseId}
          onChange={(e) => setWarehouseId(e.target.value)}
        />
        <Button type="primary" onClick={() => fetchRequests(0)} loading={loading}>
          Load Requests
        </Button>
      </Space>

      {/* Request Table */}
      <Table
        dataSource={requests}
        columns={[
          { title: "Request ID", dataIndex: "id", key: "id" },
          { title: "Partner Email", dataIndex: "partner_email", key: "partner_email" },
          { title: "Request Name", dataIndex: "name", key: "name" },
          { title: "Description", dataIndex: "description", key: "description" },
          { title: "Product Name", dataIndex: "productName", key: "productName" },
          { title: "Request Type", dataIndex: "requestType", key: "requestType" },
          { title: "Warehouse Name", dataIndex: "warehouseName", key: "warehouseName" },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
              <Space direction="vertical">
                {renderStatusTag(status)}
                <Select
                  style={{ width: 150 }}
                  placeholder="Update Status"
                  onChange={(newStatus) => updateRequestStatus(record.id, newStatus)}
                  defaultValue={status}
                >
                  <Option value="Processing">Processing</Option>
                  <Option value="Delivered">Delivered</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="Failed">Failed</Option>
                  <Option value="Canceled">Canceled</Option>
                </Select>
              </Space>
            ),
          },
          { title: "Create Date", dataIndex: "createDate", key: "createDate" },
          { title: "Approve Date", dataIndex: "apporveDate", key: "apporveDate" },
          { title: "Deliver Date", dataIndex: "deliverDate", key: "deliverDate" },
        ]}
        loading={loading}
        pagination={{
          current: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          total: pagination.totalItemsCount,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
};

export default RequestManagement;
