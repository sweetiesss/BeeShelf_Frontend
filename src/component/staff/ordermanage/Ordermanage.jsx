// export default Ordermanage;
import { Button, Image, Modal, Select, Table, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import useAxios from "../../../services/CustomizeAxios"; // Giả sử bạn đang sử dụng Axios hook

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
        const { totalItemsCount, pageSize, totalPagesCount, pageIndex, items } =
          response.data;
          const filteredItems = items.filter((item) => item.status !== "Draft");
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
      const currentOrder = data.find(order => order.id === id);
      const validTransitions = getValidStatusTransitions(currentOrder.status);
      
      if (!validTransitions.includes(newStatus)) {
        message.error(`Invalid status transition from ${currentOrder.status} to ${newStatus}`);
        return;
      }
  
      const response = await fetchDataBearer({
        url: `/order/update-order-status/${id}?orderStatus=${newStatus}`,
        method: "PUT",
      });
  
      if (response && response.status === 200) {
        message.success("Status updated successfully!");
        GetOrderWarehouse(); // Refresh order list
        if (selectedOrder?.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus }); // Update modal if open
        }
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
    return (
      <Tag color={color} className="m-0 w-full text-center">
        {status}
      </Tag>
    );
  };

  // Delete order
  const deleteOrder = async (id) => {
    try {
      const response = await fetchDataBearer({
        url: `/order/delete-order/${id}`,
        method: "DELETE",
      });
      if (response && response.status === 200) {
        message.success("Order deleted successfully!");
        GetOrderWarehouse(); // Làm mới danh sách đơn hàng sau khi cập nhật
      } else {
        const errorMessage =
          response?.data?.message || "Failed to delete order.";
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      message.error("Failed to delete order. Please try again.");
    }
  };

  // Show order detail
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
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
        <div className="flex flex-col gap-2 items-center">
          {renderStatusTag(status)} {/* Hiển thị status tag */}
        </div>
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
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <div className="flex flex-col gap-2 items-center">
          <Button
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            onClick={() => showOrderDetail(record)}
          >
            View Details
          </Button>
          <Button
            className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
            onClick={() => deleteOrder(record.id)} // Xóa order
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Add this function to check valid status transitions
const getValidStatusTransitions = (currentStatus) => {
  switch (currentStatus) {
    case "Pending":
      return ["Processing", "Canceled"]; // Staff confirmed or OCOP Partner Cancelled
    case "Processing":
      return ["Canceled"]; // Shipper delivery or Out of stock
    // case "Shipping":
    //   return ["Delivered", "Canceled"]; // Shipping Finish delivery or OCOP Partner Cancelled
    // case "Delivered":
    //   return ["Returned", "Completed"]; // Receiver returns or Return window expire
    case "Returned":
      return ["Refunded"]; // Refund processed
    case "Completed":
    case "Canceled":
    case "Refunded":
      return []; // Final states - no further transitions allowed
    default:
      return [];
  }
};

  // Sử dụng useEffect để tự động lấy dữ liệu khi component được render
  useEffect(() => {
    GetOrderWarehouse();
  }, []); // Chạy một lần khi component mount

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h1>Order Management</h1>
        <Table
          className="overflow-x-scroll min-w-[800px] w-full"
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
      <Modal
        title="Order Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Image
                src={selectedOrder.pictureLink}
                alt="Order Image"
                className="w-full"
              />
              <label htmlFor="statusSelect" className="font-bold">Update Status:</label>
              <Select
  id="statusSelect"
  className="w-full"
  value={selectedOrder.status}
  onChange={(newStatus) => updateRequestStatus(selectedOrder.id, newStatus)}
  disabled={getValidStatusTransitions(selectedOrder.status).length === 0}
>
  {getValidStatusTransitions(selectedOrder.status).map(status => (
    <Option key={status} value={status}>
      {status}
    </Option>
  ))}
</Select>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="font-bold">Order ID:</p>
                  <p>{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="font-bold">Partner Email:</p>
                  <p>{selectedOrder.partner_email}</p>
                </div>
                <div>
                  <p className="font-bold">Status:</p>
                  <p>{renderStatusTag(selectedOrder.status)}</p>
                </div>
                <div>
                  <p className="font-bold">Receiver Phone:</p>
                  <p>{selectedOrder.receiverPhone}</p>
                </div>
                <div>
                  <p className="font-bold">Receiver Address:</p>
                  <p>{selectedOrder.receiverAddress}</p>
                </div>
                <div>
                  <p className="font-bold">Date:</p>
                  <p>{selectedOrder.createDate.split("T")[0]}</p>
                </div>
                <div>
                  <p className="font-bold">Total Price:</p>
                  <p>${selectedOrder.totalPrice}</p>
                </div>
                <div>
                  <p className="font-bold">Warehouse Name:</p>
                  <p>{selectedOrder.warehouseName}</p>
                </div>
                <div>
                  <p className="font-bold">Warehouse Location:</p>
                  <p>{selectedOrder.warehouseLocation}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Ordermanage;
