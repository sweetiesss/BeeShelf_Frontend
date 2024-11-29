

// export default Ordermanage;
import React, { useState, useEffect } from "react";
import { Table, Tag, Select, Button, Space, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import useAxios from "../../../services/CustomizeAxios"; // Giả sử bạn đang sử dụng Axios hook
import { useAuth } from "../../../context/AuthContext";

const { Option } = Select;

const Ordermanage = () => {
  const [data, setData] = useState([]); // Dữ liệu đơn hàng
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [pagination, setPagination] = useState({
    totalItemsCount: 0,
    pageSize: 10,
    totalPagesCount: 0,
    pageIndex: 0,
  });
  const { fetchDataBearer } = useAxios(); // Giả sử bạn đã tạo một hook Axios tùy chỉnh
  const { userInfor } = useAuth(); // Giả sử bạn có context để lấy thông tin người dùng

  // Hàm gọi API để lấy danh sách đơn hàng theo warehouseId
  const GetOrderWarehouse = async () => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: "/order/get-warehouse-orders",
        method: "GET",
        params: {
          warehouseId: userInfor?.workAtWarehouseId, // Lấy warehouseId từ thông tin người dùng
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      });

      if (response && response.data) {
        const { totalItemsCount, pageSize, totalPagesCount, pageIndex, items } = response.data;

        // Cập nhật dữ liệu vào state
        setData(items);
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
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trạng thái đơn hàng
  const updateRequestStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: `/order/update-order-status/${id}?orderStatus=${newStatus}`,
        method: "PUT",
      });

      if (response && response.status === 200) {
        message.success("Status updated successfully!");
        GetOrderWarehouse(); // Làm mới danh sách đơn hàng sau khi cập nhật
      } else {
        const errorMessage = response?.data?.message || "Failed to update status.";
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

  // Render function cho status
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

  // Cột trong bảng
  const columns = [
    {
      title: "OrderID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Partner Email",
      dataIndex: "partner_email",
      key: "partner_email",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Space direction="vertical">
          {renderStatusTag(status)} {/* Hiển thị status tag */}
          <Select
            // style={{ width: 120 }}
            style={{ width: 65, padding: 0 }}
            defaultValue={status}
            onChange={(newStatus) => updateRequestStatus(record.id, newStatus)} // Cập nhật trạng thái khi chọn
          >
            <Option value="Pending">Pending</Option>
            <Option value="Processing">Processing</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Canceled">Canceled</Option>
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
      key: "createDate",
      render: (text) => text.split("T")[0], // Chỉ hiển thị ngày
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => `$${text}`,
    },
  ];

  // Sử dụng useEffect để tự động lấy dữ liệu khi component được render
  useEffect(() => {
    GetOrderWarehouse();
  }, []); // Chạy một lần khi component mount

  return (
    <div style={{ padding: "20px" }}>
      <h1>Order Management</h1>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={{
          current: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          total: pagination.totalItemsCount,
          onChange: (page) => {
            setPagination((prev) => ({
              ...prev,
              pageIndex: page - 1,
            }));
            GetOrderWarehouse();
          },
        }}
      />
    </div>
  );
};

export default Ordermanage;

