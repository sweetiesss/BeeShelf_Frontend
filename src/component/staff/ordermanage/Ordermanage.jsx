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
import { useTranslation } from "react-i18next";
const { Option } = Select;

const { Title, Paragraph } = Typography;

const Ordermanage = () => {
  const [data, setData] = useState([]); // Dữ liệu đơn hàng
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [pagination, setPagination] = useState({
    totalItemsCount: 0,
    pageSize: 8,
    totalPagesCount: 0,
    pageIndex: 0,
  });
  const { fetchDataBearer } = useAxios(); // Giả sử bạn đã tạo một hook Axios tùy chỉnh
  const { userInfor } = useAuth(); // Giả sử bạn có context để lấy thông tin người dùng
  const [cancellationReason, setCancellationReason] = useState("");
  const [newStatus, setNewStatus] = useState(undefined);
  const { t } = useTranslation();
  // Hàm gọi API để lấy danh sách đơn hàng theo warehouseId
  const GetOrderWarehouse = async (pageIndex, pageSize) => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: "/order/get-store-orders",
        method: "GET",
        params: {
          storeId: userInfor?.workAtWarehouseId, // Lấy warehouseId từ thông tin người dùng
          pageIndex: pageIndex,
          pageSize: pageSize,
        },
      });

      if (response && response.data) {
        const { totalItemsCount, pageSize, totalPagesCount, pageIndex, items } =
          response.data;

        // Lọc các đơn hàng có status khác "Draft"
        const filteredItems = items.filter((item) => item.status !== "Draft");

        // Cập nhật dữ liệu vào state
        setData(filteredItems);
        setPagination({
          totalItemsCount,
          pageSize,
          totalPagesCount,
          pageIndex,
        });

        message.success(t("Data_loaded_successfully"));
      } else {
        message.error(t("No_data_returned_from_server"));
      }
    } catch (error) {
      console.error(t("Error_fetching_orders"), error);
      message.error(t("Failed_to_fetch_orders"));
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A"; // Return "Null" if the input is falsy

    // Tạo một đối tượng Date với múi giờ Asia/Bangkok (UTC+7)
    const dateInBangkok = new Date(
      new Date(dateString).toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );

    // Cộng thêm 7 tiếng (7 giờ * 60 phút * 60 giây * 1000 ms)
    const dateWithExtra7Hours = new Date(
      dateInBangkok.getTime() + 7 * 60 * 60 * 1000
    );

    // Format the date part
    const formattedDate = dateWithExtra7Hours.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Format the time part
    const formattedTime = dateWithExtra7Hours.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      // second: "2-digit",
      hour12: false,
    });

    return `${formattedDate} ${formattedTime}`;
  };

  // Cập nhật trạng thái đơn hàng
  const updateRequestStatus = async (id) => {
    setLoading(true);
    try {
      const currentOrder = data.find((order) => order.id === id);
      const validTransitions = getValidStatusTransitions(currentOrder.status);

      if (!validTransitions.includes(newStatus)) {
        message.error(
          t("Invalid_status_transition", {
            currentStatus: currentOrder.status,
            newStatus: newStatus,
          })
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
        message.success(t("Status_updated_successfully"));
        GetOrderWarehouse(); // Refresh order list
        if (selectedOrder?.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus }); // Update modal if open
        }
      } else {
        const errorMessage =
          response?.data?.message || t("Failed_to_update_status");
        message.error(errorMessage);
      }
    } catch (error) {
      console.error(t("Error_updating_status"), error);
      message.error(
        error.response?.data?.message || t("Failed_to_update_status_try_again")
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
      case t("Pending"):
        color = "orange";
        break;
      case t("Canceled"):
        color = "red";
        break;
      case t("Processing"):
        color = "purple";
        break;
      case t("Delivered"):
        color = "green";
        break;
      case t("Shipping"):
        color = "blue";
        break;
      case t("Returned"):
        color = "magenta";
        break;
      case t("Refunded"):
        color = "gold";
        break;
      case t("Completed"):
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
      title: t("Order_ID"),
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: t("Order_Code"),
      dataIndex: "orderCode",
      key: "orderCode",
    },
    {
      title: t("Partner_Email"),
      dataIndex: "partner_email",
      key: "partner_email",
      render: (text) => <span>{text}</span>,
    },
    {
      title: t("Status"),
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
            <Option value={t("Pending")}>{t("Pending")}</Option>
            <Option value={t("Canceled")}>{t("Canceled")}</Option>
            <Option value={t("Processing")}>{t("Processing")}</Option>
            <Option value={t("Delivered")}>{t("Delivered")}</Option>
            <Option value={t("Shipping")}>{t("Shipping")}</Option>
            <Option value={t("Returned")}>{t("Returned")}</Option>
            <Option value={t("Refunded")}>{t("Refunded")}</Option>
            <Option value={t("Approved")}>{t("Approved")}</Option>
            <Option value={t("Rejected")}>{t("Rejected")}</Option>
            <Option value={t("Completed")}>{t("Completed")}</Option>
          </Select>
        </div>
      ),
      onFilter: (value, record) => record.status === value,
      render: (status) => renderStatusTag(status),
    },
    {
      title: t("ReceiverName"),
      dataIndex: "receiverName",
      key: "receiverName",
      render: (text) => text || "N/A",
    },
    {
      title: t("Receiver_Phone"),
      dataIndex: "receiverPhone",
      key: "receiverPhone",
    },
    {
      title: t("Receiver_Address"),
      dataIndex: "receiverAddress",
      key: "receiverAddress",
    },
    {
      title: t("Create_Date"),
      dataIndex: "createDate",
      key: "createDate",
      sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        if (!text) return "";
        return formatDateTime(text);
      },
    },
    {
      title: t("Total_Price"),
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      sortDirections: ["descend", "ascend"],
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
    },
    {
      title: t("Action"),
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <div className="flex flex-col gap-2 items-center">
          <Button
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            onClick={() => showOrderDetail(record)}
          >
            {t("View_Details")}
          </Button>
        </div>
      ),
    },
  ];

  // Add this function to check valid status transitions
  const getValidStatusTransitions = (currentStatus) => {
    switch (currentStatus) {
      case t("Draft"):
        return [t("Pending")];
      case t("Pending"):
        return [t("Processing")]; // Staff confirmed or OCOP Partner Cancelled
      case t("Processing"):
        return [t("Canceled")]; // Shipper delivery or Out of stock
      case t("Shipping"):
        return [t("Delivered"), t("Canceled")]; // Shipping Finish delivery or OCOP Partner Cancelled
      case t("Delivered"):
        return [t("Completed")]; // Receiver returns or Return window expire
      case t("Returned"):
        return [t("Refunded")]; // Refund processed
      case t("Completed"):
      case t("Canceled"):
      case t("Refunded"):
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
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {t("Order_Management")}
        </h1>
        <h1 className="text-lg font-bold">{t("Order_List")}</h1>
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
              console.log(t("Current_Page"), page);
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
        title={t("Order_Details")}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            {t("Close")}
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div>
                <Image
                  src={selectedOrder.pictureLink}
                  alt={t("Order_Image")}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="statusSelect" className="font-bold">
                  {t("Status")}:
                </label>
                <Select
                  id="statusSelect"
                  className="w-full"
                  value={newStatus}
                  onChange={(newStatus) => setNewStatus(newStatus)}
                  placeholder={t("Select_Status")}
                  disabled={
                    getValidStatusTransitions(selectedOrder.status).length === 0
                  }
                >
                  {getValidStatusTransitions(selectedOrder.status).map(
                    (status) => (
                      <Option key={status} value={status}>
                        {t(status)}
                      </Option>
                    )
                  )}
                </Select>
                {newStatus === t("Canceled") && (
                  <div>
                    <label htmlFor="cancellationReason" className="font-bold">
                      {t("Cancellation_Reason")}:
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
                    (newStatus === t("Canceled") && !cancellationReason)
                  }
                >
                  {t("Update_Status")}
                </Button>
              </div>
              <div>
                {selectedOrder?.orderDetails?.map((item, index) => (
                  <Card className="mt-2" key={index}>
                    <Typography>
                      <Title level={5}>{t("Detail")}</Title>
                      <Paragraph>
                        <strong>{t("Name")}:</strong> {item.productName}
                      </Paragraph>
                      <Paragraph>
                        <strong>{t("Price")}:</strong>{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.productPrice)}
                      </Paragraph>
                      <Paragraph>
                        <strong>{t("Amount")}:</strong> {item.productAmount}
                      </Paragraph>
                      <Paragraph>
                        <strong>{t("Weight")}:</strong> {item.weight} kg
                      </Paragraph>
                      <Paragraph>
                        <strong>{t("Unit")}:</strong> {item.unit}
                      </Paragraph>
                      <Paragraph>
                        <strong>{t("Inventory_ID")}:</strong> {item.roomId}
                      </Paragraph>
                      <Paragraph>
                        <strong>{t("Inventory_Name")}:</strong>{" "}
                        {item.roomCode}
                      </Paragraph>
                      <Paragraph>
                        <strong>{t("Lot_ID")}:</strong> {item.lotId}
                      </Paragraph>
                    </Typography>
                  </Card>
                ))}
              </div>

              <div>
                {selectedOrder?.orderFees?.map((item, idx) => (
                  <Card className="mt-2" key={idx}>
                    <Typography>
                      <Title level={5}>{t("Fee")}</Title>

                      <Paragraph>
                        <strong>{t("Storage_Fee")}:</strong>{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.storageFee)}
                      </Paragraph>

                      <Paragraph>
                        <strong>{t("Delivery_Fee")}:</strong>{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.deliveryFee)}
                      </Paragraph>

                      <Paragraph>
                        <strong>{t("Additional_Fee")}:</strong>{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.additionalFee)}
                      </Paragraph>
                      {/* <Paragraph>
                        <strong className="text-gray-700">Total Fee:</strong>{" "}
                        <span className="text-green-600 font-bold">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(
                            item.storageFee +
                              item.deliveryFee +
                              item.additionalFee
                          )}
                        </span>
                      </Paragraph> */}
                    </Typography>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="font-bold">{t("Order_ID")}:</p>
                  <p>{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Order_Code")}:</p>
                  <p>{selectedOrder.orderCode}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Partner_Email")}:</p>
                  <p>{selectedOrder.partner_email}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Status")}:</p>
                  <p>{renderStatusTag(selectedOrder.status)}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Receiver_Phone")}:</p>
                  <p>{selectedOrder.receiverPhone}</p>
                </div>
                <div>
                  <p className="font-bold">{t("ReceiverName")}:</p>
                 
                  <p>{selectedOrder.receiverName || "N/A"}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Receiver_Address")}:</p>
                  <p>{selectedOrder.receiverAddress}</p>
                </div>
                {/* Create Date */}
                <div>
                  <p className="font-bold">{t("Create_Date")}:</p>
                  <p>{formatDateTime(selectedOrder.createDate)}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Approve_Date")}:</p>
                  <p>{formatDateTime(selectedOrder.approveDate)}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Delivery_Start_Date")}:</p>
                  <p>{formatDateTime(selectedOrder.deliverStartDate)}</p>
                </div>

                <div>
                  <p className="font-bold">{t("Delivery_Finish_Date")}:</p>
                  <p>{formatDateTime(selectedOrder.deliverFinishDate)}</p>
                </div>

                <div>
                  <p className="font-bold">{t("Completion_Date")}:</p>
                  <p>{formatDateTime(selectedOrder.completeDate)}</p>
                </div>

                <div>
                  <p className="font-bold">{t("Return_Date")}:</p>
                  <p>{formatDateTime(selectedOrder.returnDate)}</p>
                </div>

                <div>
                  <p className="font-bold">{t("Cancellation_Date")}:</p>
                  <p>{formatDateTime(selectedOrder.cancelDate)}</p>
                </div>

                {/* Reason For Cancellation */}
                <div>
                  <p className="font-bold">{t("Reason_For_Cancellation")}:</p>
                  <p className="text-gray-700">
                    {selectedOrder.cancellationReason || t("N/A")}
                  </p>
                </div>

                <div>
                  <p className="font-bold">{t("Total_Price")}:</p>
                  <p>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedOrder.totalPrice)}
                  </p>
                </div>
                <div>
                  <p className="font-bold">{t("Total_Price_After_Fee")}:</p>
                  <p>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedOrder.totalPriceAfterFee)}
                  </p>
                </div>
                <div>
                  <p className="font-bold">{t("Warehouse_Name")}:</p>
                  <p>{selectedOrder.warehouseName}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Warehouse_Location")}:</p>
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
