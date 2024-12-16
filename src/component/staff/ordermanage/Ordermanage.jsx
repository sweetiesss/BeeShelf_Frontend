// export default Ordermanage;
import {
  Button,
  Card,
  Image,
  Input,
  Modal,
  Select,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import useAxios from "../../../services/CustomizeAxios"; // Giả sử bạn đang sử dụng Axios hook

const { Option } = Select;

const { Title, Paragraph } = Typography;

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
  const [cancellationReason, setCancellationReason] = useState("");
  const [newStatus, setNewStatus] = useState(undefined);

  // Hàm gọi API để lấy danh sách đơn hàng theo warehouseId
  const GetOrderWarehouse = async (pageIndex, pageSize) => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: "/order/get-warehouse-orders",
        method: "GET",
        params: {
          warehouseId: userInfor?.workAtWarehouseId, // Lấy warehouseId từ thông tin người dùng
          pageIndex: pageIndex,
          pageSize: pageSize,
        },
      });

      if (response && response.data) {
        const { totalItemsCount, pageSize, totalPagesCount, pageIndex, items } =
          response.data;
        // const filteredItems = items.filter((item) => item.status !== "Draft");
        const filteredItems = items.filter((item) => item.status !== "Draft");

        // Cập nhật dữ liệu vào state
        setData(filteredItems);
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
  const updateRequestStatus = async (id) => {
    setLoading(true);
    try {
      const currentOrder = data.find((order) => order.id === id);
      const validTransitions = getValidStatusTransitions(currentOrder.status);

      if (!validTransitions.includes(newStatus)) {
        message.error(
          `Invalid status transition from ${currentOrder.status} to ${newStatus}`
        );
        return;
      }

      const response = await fetchDataBearer({
        url: `/order/update-order-status/${id}`,
        method: "PUT",
        params: {
          orderStatus: newStatus,
          cancellationReason: cancellationReason,
        },
      });

      if (response && response.status === 200) {
        message.success("Status updated successfully!");
        GetOrderWarehouse(); // Refresh order list
        if (selectedOrder?.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus }); // Update modal if open
        }
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
      setIsModalVisible(false);
      setNewStatus(undefined);
      setCancellationReason("");
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
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Order Code",
      dataIndex: "orderCode",
      key: "orderCode",
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
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div className="p-2">
          <Select
            className="w-[120px]"
            value={selectedKeys[0]}
            onChange={(value) => {
              setSelectedKeys(value ? [value] : []);
              confirm();
            }}
            allowClear
          >
            <Option value="Pending">Pending</Option>
            <Option value="Canceled">Canceled</Option>
            <Option value="Processing">Processing</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Shipping">Shipping</Option>
            <Option value="Returned">Returned</Option>
            <Option value="Refunded">Refunded</Option>
            <Option value="Approved">Approved</Option>
            <Option value="Rejected">Rejected</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </div>
      ),
      onFilter: (value, record) => record.status === value,
      render: (status) => renderStatusTag(status),
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
      title: "Create Date",
      dataIndex: "createDate",
      key: "createDate",
      sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        if (!text) return "";
        const date = new Date(text);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() bắt đầu từ 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      },
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      sortDirections: ["descend", "ascend"],
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text), // Định dạng theo tiền tệ VNĐ
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
        </div>
      ),
    },
  ];

  // Add this function to check valid status transitions
  const getValidStatusTransitions = (currentStatus) => {
    switch (currentStatus) {
      case "Draft":
        return ["Pending"];
      case "Pending":
        return ["Processing"]; // Staff confirmed or OCOP Partner Cancelled
      case "Processing":
        return ["Canceled"]; // Shipper delivery or Out of stock
      case "Shipping":
        return ["Delivered", "Canceled"]; // Shipping Finish delivery or OCOP Partner Cancelled
      case "Delivered":
        return ["Completed"]; // Receiver returns or Return window expire
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
    GetOrderWarehouse(0, pagination.pageSize);
  }, []); // Chạy một lần khi component mount

  return (
    <>
      <div>
        <h1>Order Management</h1>
        <Table
          className="overflow-auto min-w-[800px] w-full"
          dataSource={data}
          columns={columns}
          loading={loading}
          pagination={{
            current: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
            total: pagination.totalItemsCount,
            onChange: (page) => {
              console.log("Current page:", page);
              setPagination((prev) => ({
                ...prev,
                pageIndex: page - 1, // Chuyển trang (index bắt đầu từ 0)
              }));
              GetOrderWarehouse(page - 1, pagination.pageSize);
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
              <div>
                <Image
                  src={selectedOrder.pictureLink}
                  alt="Order Image"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="statusSelect" className="font-bold">
                  Status:
                </label>
                <Select
                  id="statusSelect"
                  className="w-full"
                  value={newStatus}
                  onChange={(newStatus) =>
                    // updateRequestStatus(selectedOrder.id, newStatus)
                    setNewStatus(newStatus)
                  }
                  placeholder="Select a status"
                  disabled={
                    getValidStatusTransitions(selectedOrder.status).length === 0
                  }
                >
                  {getValidStatusTransitions(selectedOrder.status).map(
                    (status) => (
                      <Option key={status} value={status}>
                        {status}
                      </Option>
                    )
                  )}
                </Select>
                {newStatus === "Canceled" && (
                  <div>
                    <label htmlFor="cancellationReason" className="font-bold">
                      Cancellation Reason:
                    </label>
                    <Input
                      id="cancellationReason"
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                    />
                  </div>
                )}
                <Button
                  className="px-4 py-2 mt-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                  onClick={() => updateRequestStatus(selectedOrder.id)}
                  disabled={
                    !newStatus ||
                    (newStatus === "Canceled" && !cancellationReason)
                  }
                >
                  Update Status
                </Button>
              </div>
              <div>
                {selectedOrder?.orderDetails?.map((item, index) => (
                  <Card className="mt-2" key={index}>
                    <Typography>
                      <Title level={5}>Detail</Title>
                      <Paragraph>Name: {item.productName}</Paragraph>
                      <Paragraph>Price: {item.productPrice}</Paragraph>
                      <Paragraph>Amount: {item.productAmount}</Paragraph>
                      <Paragraph>Weight: {item.weight}</Paragraph>
                      <Paragraph>Unit: {item.unit}</Paragraph>
                      <Paragraph>Lot ID: {item.lotId}</Paragraph>
                    </Typography>
                  </Card>
                ))}
              </div>
              <div>
                {selectedOrder?.orderFees?.map((item, idx) => (
                  <Card className="mt-2" key={idx}>
                    <Typography>
                      <Title level={5}>Fee</Title>
                      <Paragraph>Storage Fee: {item.storageFee}</Paragraph>
                      <Paragraph>Delivery Fee: {item.deliveryFee}</Paragraph>
                      <Paragraph>
                        Additional Fee: {item.additionalFee}
                      </Paragraph>
                    </Typography>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="font-bold">Order ID:</p>
                  <p>{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="font-bold">Order Code:</p>
                  <p>{selectedOrder.orderCode}</p>
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
                {/* Create Date */}
                <div>
                  <p className="font-bold">Create Date:</p>
                  <p>
                    {(() => {
                      if (!selectedOrder.createDate) return "";
                      const date = new Date(selectedOrder.createDate);
                      return (
                        date.toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }) +
                        "\n" +
                        date.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })
                      );
                    })()}
                  </p>
                </div>
                {/* Delivery Start Date */}
                <div>
                  <p className="font-bold">Delivery Start Date:</p>
                  <p>
                    {(() => {
                      const date = new Date(selectedOrder.deliverStartDate);
                      return (
                        date.toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }) +
                        "\n" +
                        date.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })
                      );
                    })()}
                  </p>
                </div>

                {/* Delivery Finish Date */}
                <div>
                  <p className="font-bold">Delivery Finish Date:</p>
                  <p>
                    {(() => {
                      const date = new Date(selectedOrder.deliverFinishDate);
                      return (
                        date.toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }) +
                        "\n" +
                        date.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })
                      );
                    })()}
                  </p>
                </div>

                {/* Completion Date */}
                <div>
                  <p className="font-bold">Completion Date:</p>
                  <p>
                    {(() => {
                      const date = new Date(selectedOrder.completeDate);
                      return (
                        date.toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }) +
                        "\n" +
                        date.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })
                      );
                    })()}
                  </p>
                </div>

                {/* Return Date */}
                <div>
                  <p className="font-bold">Return Date:</p>
                  <p>
                    {(() => {
                      const date = new Date(selectedOrder.returnDate);
                      return (
                        date.toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }) +
                        "\n" +
                        date.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })
                      );
                    })()}
                  </p>
                </div>

                {/* Cancellation Date */}
                <div>
                  <p className="font-bold">Cancellation Date:</p>
                  <p>
                    {(() => {
                      const date = new Date(selectedOrder.cancelDate);
                      return (
                        date.toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }) +
                        "\n" +
                        date.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })
                      );
                    })()}
                  </p>
                </div>

                {/* Reason For Cancellation */}
                <div>
                  <p className="font-bold">Reason For Cancellation:</p>
                  <p className="text-gray-700">
                    {selectedOrder.cancellationReason || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="font-bold">Total Price:</p>
                  <p>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedOrder.totalPrice)}
                  </p>
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
