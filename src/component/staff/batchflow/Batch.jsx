import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Drawer,
  Typography,
  Divider,
  List,
  Space,
  Row,
  Col,
  message,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import { useTranslation } from "react-i18next";
import useAxios from "../../../services/CustomizeAxios"; // Custom Axios hook
import { useAuth } from "../../../context/AuthContext"; // Auth context
const { Option } = Select;

const BatchManage = () => {
  const [batches, setBatches] = useState([]); // All batch data
  const [orders, setOrders] = useState([]); // Orders data for Order IDs field
  const [shippers, setShippers] = useState([]); // Shippers data
  const [deliveryZones, setDeliveryZones] = useState([]); // Delivery zones
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedBatch, setSelectedBatch] = useState(null); // Selected batch for the drawer
  const [selectedBatchIds, setSelectedBatchIds] = useState([]); // Selected batch IDs for deletion
  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState(null);
  const [createBatchModalVisible, setCreateBatchModalVisible] = useState(false); // Modal visibility
  const { fetchDataBearer } = useAxios(); // Custom Axios hook
  const { userInfor } = useAuth(); // Get user info
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    totalItemsCount: 0,
    pageSize: 8,
    totalPagesCount: 0,
    pageIndex: 0,
  });
  // Hàm xoá bacth
  const { t } = useTranslation();
  const handleDeleteBatch = (batchId) => {
    console.log(t("BatchIDtobedeleted"), batchId);

    Modal.confirm({
      title: t("Areyousureyouwanttodeletethisbatch?"),
      okText: t("Yes,Delete"),
      okType: "danger",
      cancelText: t("Cancel"),
      onOk: async () => {
        try {
          const response = await fetchDataBearer({
            url: `/batch/delete-batch/${batchId}`,
            method: "POST",
          });

          console.log("Response:", response);

          // Kiểm tra nếu response thành công
          if (
            response &&
            response.status === 200 &&
            response.data === "Success."
          ) {
            message.success(t("Batch_deleted_successfully."));
            // Làm mới danh sách sau khi xóa
            fetchBatches();
          } else {
            // Hiển thị thông báo lỗi từ server nếu có
            message.error(
              t(
                response.data.message ||
                  "Failed_to_delete_batch._Please_try_again."
              )
            );
          }
        } catch (error) {
          console.error("Error deleting batch:", error);

          // Kiểm tra lỗi từ phản hồi của server
          if (error.response && error.response.data) {
            message.error(error.response.data.message);
          } else {
            message.error(
              t("An_error_occurred_while_deleting_the_batch._Please_try_again.")
            );
          }
        }
      },
    });
  };

  // Fetch batches data from API
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: `/batch/get-batches`,
        method: "GET",
        params: {
          filterBy: "WarehouseId",
          filterQuery: userInfor.workAtWarehouseId,
          descending: false,
          pageIndex: 0,
          pageSize: 100,
        },
      });
      if (!response || !response.data || !response.data.items) {
        console.error(t("Failed_to_fetch_batches_data"));
        return;
      }
      const formattedBatches = response.data.items.map((batch) => ({
        key: batch.id,
        id: batch.id,
        name: batch.name,
        status: batch.status,
        completeDate: batch.completeDate || t("Not_Completed"),
        assignTo: batch.assignTo,
        deliveryZoneId: batch.deliveryZoneId,
        orders: batch.orders,
        deliveryZoneName: batch.deliveryZoneName,
        shipperId: batch.shipperId,
        shipperName: batch?.shipperName,
        shipperEmail: batch?.shipperEmail,
        deliveryStartDate: batch?.deliveryStartDate,
      }));
      setBatches(formattedBatches);
    } catch (error) {
      console.error(t("Error_fetching_batches"), error);
    } finally {
      setLoading(false);
      message.success(t("Data_loaded_successfully!"));
    }
  };
  useEffect(() => {
    fetchBatches();
  }, []);

  // Fetch delivery zones
  useEffect(() => {
    const fetchDeliveryZones = async () => {
      try {
        const response = await fetchDataBearer({
          url: `/warehouse/get-warehouse/${userInfor?.workAtWarehouseId}`,
          method: "GET",
        });

        if (response.status === 200 && response.data) {
          setDeliveryZones(response.data.deliveryZones || []);
        } else {
          console.error(t("Failed_to_fetch_delivery_zones"));
        }
      } catch (error) {
        console.error(t("Error_fetching_delivery_zones"), error);
      }
    };

    if (userInfor?.workAtWarehouseId) {
      fetchDeliveryZones();
    }
  }, [userInfor]);

  // Fetch orders for Order IDs field
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchDataBearer({
          url: `/order/get-warehouse-orders`,
          method: "GET",
          params: {
            warehouseId: userInfor?.workAtWarehouseId,
            hasBatch: false,
            pageIndex: 0,
            pageSize: 100,
            orderFilterBy: "DeliveryZoneId",
            filterQuery: selectedDeliveryZone,
            filterByStatus: "Processing",
            
          },
        });
        console.log(t("Orders_data:"), response);
        if (!response || !response.data) {
          console.error(t("Failed_to_fetch_orders_data"));
          return;
        }
        const formattedOrders = response.data.items.map((order) => ({
          id: order.id,
          partnerEmail: order.partner_email,
        }));
        console.log(t("Formatted_orders:"), formattedOrders);
        setOrders(formattedOrders);
      } catch (error) {
        console.error(t("Error_fetching_orders:"), error);
      }
    };

    if (userInfor?.workAtWarehouseId && selectedDeliveryZone) {
      fetchOrders();
    }
  }, [userInfor, selectedDeliveryZone]);

  // Fetch shippers
  useEffect(() => {
    const fetchShippers = async () => {
      try {
        const warehouseId = userInfor?.workAtWarehouseId;

        if (!warehouseId) {
          console.error(t("Warehouse_ID_is_not_available"));
          return;
        }

        const response = await fetchDataBearer({
          url: `/warehouse/get-warehouse-shippers/${warehouseId}`,
          method: "GET",
          params: {
            hasVehicle: true,
            pageIndex: 0,
            pageSize: 100,
            filterBy: "DeliveryZoneId",
            filterQuery: selectedDeliveryZone,
          },
        });

        if (response.status === 200 && response.data) {
          console.log(t("Shippers_data:"), response.data);
          setShippers(response.data.items || []); // Ensure this is correct
        } else {
          console.error(t("Failed_to_fetch_shippers_data"));
        }
      } catch (error) {
        console.error(t("Error_fetching_shippers_data:"), error);
      }
    };

    if (userInfor?.workAtWarehouseId && selectedDeliveryZone) {
      fetchShippers();
    }
  }, [userInfor, selectedDeliveryZone]);

  // Handle create batch
  const handleCreateBatch = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        shipperId: values.shipperId,
        deliveryZoneId: values.deliveryZoneId,
        orders: values.orders.map((id) => ({ id })),
      };
      console.log(t("Payload:"), payload);

      const response = await fetchDataBearer({
        url: `/batch/create-batch`,
        method: "POST",
        data: payload,
      });

      if (response.status === 200 || response.status === 201) {
        message.success(t("Batch_created_successfully."));
        form.resetFields();
        setCreateBatchModalVisible(false);
        fetchBatches();
      } else {
        throw new Error(t("Failed_to_create_batch."));
      }
    } catch (error) {
      console.error(t("Error_creating_batch:"), error);
      message.error(
        error.response?.data?.message || t("Failed_to_create_batch.")
      );
    } finally {
      setLoading(false);
    }
  };

  //Hàm xử lí ngày giờ
  const formatDateTime = (dateString) => {
    if (!dateString) return "Null"; // Return "Null" if the input is falsy

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

  const [visible, setVisible] = useState(false);
  //Hàm gọi chi tiết detailorder1
  const [selectedOrderData, setSelectedOrderData] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const DetailOrder1 = async (id) => {
    // console.log(t("Fetching_details_for_order_ID:"), id);

    try {
      const response = await fetchDataBearer({
        url: `/order/get-order/${id}`,
        method: "GET",
      });

      // console.log(t("Full_Response:"), response);

      if (response) {
        console.log(t("Response_Status:"), response.status);
        console.log(t("Response_Data:"), response.data);
      }

      if (response && response.data) {
        console.log(t("Order_Details:"), response.data);
        setSelectedOrderData(response.data);
        setDetailModalVisible(true);
      } else {
        message.error(t("Failed_to_fetch_order_details."));
      }
    } catch (error) {
      console.error(t("Error_fetching_order_details:"), error);
      message.error(
        t("An_error_occurred_while_fetching_order_details._Please_try_again.")
      );
    }
  };

  const columns = [
    {
      title: t("Batch_ID"),
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("Batch_Name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";

        switch (status.toLowerCase()) {
          case "completed":
            color = "green";
            break;
          case "pending":
            color = "red";
            break;
          default:
            color = "default"; // Màu mặc định cho các trạng thái khác
        }

        return <Tag color={color}>{t(status)}</Tag>;
      },
    },
    {
      title: t("Delivery_Zone_Name"),
      dataIndex: "deliveryZoneName",
      key: "deliveryZoneName",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 120 }}
            value={selectedKeys[0]}
            onChange={(value) => {
              setSelectedKeys(value ? [value] : []);
              confirm();
            }}
            allowClear
            placeholder={t("Select_Delivery_Zone")}
          >
            {deliveryZones.map((zone) => (
              <Option key={zone.id} value={zone.name}>
                {t(zone.name)}
              </Option>
            ))}
          </Select>
        </div>
      ),
      onFilter: (value, record) => record.deliveryZoneName === value,
      render: (deliveryZoneName) => t(deliveryZoneName),
    },

    {
      title: t("Shipper"),
      dataIndex: "shipperName",
      key: "shipperName",
    },
    {
      title: t("Shipper_Email"),
      dataIndex: "shipperEmail",
      key: "shipperEmail",
    },
    {
      title: t("Create_Date"),
      dataIndex: "deliveryStartDate",
      key: "deliveryStartDate",
      render: (date) => {
        if (!date) return t("N/A");

        return <div>{formatDateTime(date)}</div>;
      },
    },

    {
      title: t("Actions"),
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button type="primary" onClick={() => setSelectedBatch(record)}>
            {t("View_Details")}
          </Button>
          <Button
            className="bg-red-500 text-white border-none hover:bg-red-600 focus:bg-red-600"
            onClick={() => handleDeleteBatch(record.id)}
            disabled={record.status !== t("Pending")} // Disable nếu status không phải là Pending
            style={{
              backgroundColor:
                record.status === t("Pending") ? "#ff4d4f" : "#f5f5f5",
              color: record.status === t("Pending") ? "#fff" : "#d9d9d9",
              borderColor:
                record.status === t("Pending") ? "#ff4d4f" : "#d9d9d9",
            }}
          >
            {t("Delete_Batch")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        {t("Batch_Management")}
      </h1>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">{t("Batch_List")}</h1>
        <Button type="primary" onClick={() => setCreateBatchModalVisible(true)}>
          {t("Create_Batch")}
        </Button>
      </div>
      <Table
        dataSource={batches}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: pagination.pageSize,
          total: pagination.totalItemsCount,
          onChange: (page) =>
            setPagination({ ...pagination, pageIndex: page - 1 }),
        }}
        loading={loading}
      />

      {/* Create Batch Modal */}
      <Modal
        title={t("Create_Batch")}
        open={createBatchModalVisible}
        onCancel={() => setCreateBatchModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateBatch}
          initialValues={{
            name: "",
            shipperId: null,
            deliveryZoneId: null,
            orders: [],
          }}
        >
          {/* Batch Name */}
          <Form.Item
            name="name"
            label={t("Batch_Name")}
            rules={[
              { required: true, message: t("Please_enter_a_batch_name") },
              {
                max: 250,
                message: t("Batch_name_must_be_250_characters_or_fewer"),
              },
              {
                validator: (_, value) => {
                  if (!value || value.trim() === "") {
                    return Promise.reject(
                      t("Batch_name_cannot_be_empty_or_whitespace")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Delivery Zone */}
          <Form.Item
            name="deliveryZoneId"
            label={t("Delivery_Zone")}
            rules={[
              { required: true, message: t("Please_select_a_delivery_zone") },
            ]}
          >
            <Select
              placeholder={t("Select_a_delivery_zone")}
              onChange={(value) => setSelectedDeliveryZone(value)}
            >
              {deliveryZones.map((zone) => (
                <Option key={zone.id} value={zone.id}>
                  {t("DeliveryZoneId")}: {zone.id} - {t("Name_Zone")}:{" "}
                  {zone.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Shipper */}
          <Form.Item
            name="shipperId"
            label={t("Shipper")}
            rules={[{ required: true, message: t("Please_select_a_shipper") }]}
          >
            <Select placeholder={t("Select_a_shipper")}>
              {shippers.map(
                (shipper) =>
                  shipper.employeeId &&
                  shipper.warehouseId && (
                    <Option key={shipper.employeeId} value={shipper.employeeId}>
                      {/* {t("EmployeeId")}: {shipper.employeeId} -{" "} */}
                      {t("ShipperName")}: {shipper.shipperName} -{" "}
                      {/* {t("WarehouseId")}: {shipper.warehouseId} */}
                      {t("WarehouseName")}: {shipper.warehouseName}
                    </Option>
                  )
              )}
            </Select>
          </Form.Item>

          {/* Orders */}
          <Form.Item
            name="orders"
            label={t("Orders")}
            rules={[{ required: true, message: t("Please_select_orders") }]}
          >
            <Select mode="multiple" placeholder={t("Select_orders")} allowClear>
              {orders.map((order) => (
                <Option key={order.id} value={order.id}>
                  {t("id")}: {order.id} - {t("email")}: {order.partnerEmail}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={
          <>
            <span className="text-gray-600">{t("Batch_Details_Name")}:</span>
            <span className="text-blue-500">{selectedBatch?.name}</span>
          </>
        }
        open={!!selectedBatch}
        onClose={() => setSelectedBatch(null)}
        width={500}
      >
        <div>
          {/* Title */}
          <Typography.Title level={5} className="mb-4">
            <span className="font-bold">{t("Shipper_Name")}:</span>{" "}
            <span className="font-normal">{selectedBatch?.shipperName}</span>
          </Typography.Title>

          <Typography.Title level={5} className="mb-4">
            <span className="font-bold">{t("Shipper_Email")}:</span>{" "}
            <span className="font-normal">{selectedBatch?.shipperEmail}</span>
          </Typography.Title>

          <Typography.Title level={5} className="mb-4">
            <span className="font-bold">{t("Delivery_Zone")}:</span>{" "}
            <span className="font-normal">
              {selectedBatch?.deliveryZoneName}
            </span>
          </Typography.Title>

          <div className="flex items-center">
            <strong className="mr-2">{t("Status")}:</strong>
            <Tag
              color={
                selectedBatch?.status === t("Pending")
                  ? "red"
                  : selectedBatch?.status === t("Completed")
                  ? "green"
                  : "default"
              }
            >
              {t(selectedBatch?.status)}
            </Tag>
          </div>

          {/* Orders List */}
          <div className="mt-4 space-y-6">
            <strong className="text-2xl text-gray-800">Order List:</strong>
            <List
              dataSource={selectedBatch?.orders || []}
              renderItem={(order) => (
                <List.Item key={order.id}>
                  <div className="p-6 w-full max-w-4xl bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    {/* Order Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-lg font-semibold text-gray-700">
                        Order ID:{" "}
                        <span className="text-blue-500">{order.id}</span>
                      </div>
                    </div>

                    <Divider />

                    {/* Order Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Order_Code")}:
                          </strong>{" "}
                          {order.orderCode}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Warehouse_Name")}:
                          </strong>{" "}
                          {order.warehouseName}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Partner_Email")}:
                          </strong>{" "}
                          {order.partner_email}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Order_Status")}:
                          </strong>{" "}
                          {t(order.status)}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Total_Price")}:
                          </strong>{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.totalPrice)}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Total_Price_After_Fee")}:
                          </strong>{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.totalPriceAfterFee)}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Receiver_Phone")}:
                          </strong>{" "}
                          {order.receiverPhone}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Receiver_Address")}:
                          </strong>{" "}
                          {order.receiverAddress}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Delivery_Zone_Name")}:
                          </strong>{" "}
                          {order.deliveryZoneName}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Cancellation_Reason")}:
                          </strong>{" "}
                          {order.cancellationReason}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Order_Creation_Date")}:
                          </strong>{" "}
                          {formatDateTime(order.createDate)}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Approval_Date")}:
                          </strong>{" "}
                          {formatDateTime(order.approveDate)}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Delivery_Start_Date")}:
                          </strong>{" "}
                          {formatDateTime(order.deliverStartDate)}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Complete_Date")}:
                          </strong>{" "}
                          {formatDateTime(order.completeDate)}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Return_Date")}:
                          </strong>{" "}
                          {formatDateTime(order.returnDate)}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            {t("Cancel_Date")}:
                          </strong>{" "}
                          {formatDateTime(order.cancelDate)}
                        </p>
                      </div>
                    </div>

                    {/* Order Detail Button */}
                    <div className="mt-6 flex justify-end">
                      <button
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                        onClick={() => DetailOrder1(order.id)}
                      >
                        {t("View_Order_Details")}
                      </button>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
          <Modal
            title={
              <span className="text-2xl font-bold">{t("Detail_Order")}</span>
            }
            visible={detailModalVisible}
            onCancel={() => setDetailModalVisible(false)}
            footer={null}
          >
            {selectedOrderData && (
              <div className="space-y-8">
                {/* Order Details */}
                <div>
                  <h3 className="text-xl font-bold mb-4 border-b pb-2">
                    {t("Order_Details")}
                  </h3>
                  {selectedOrderData.orderDetails.map((detail) => (
                    <div
                      key={detail.id}
                      className="p-4 border rounded-lg shadow-md mb-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p>
                            <strong className="text-gray-700">
                              {t("Order_ID")}:
                            </strong>{" "}
                            {detail.id}
                          </p>
                          <p>
                            <strong className="text-gray-700">
                              {t("Product_Name")}:
                            </strong>{" "}
                            {detail.productName}
                          </p>
                          <p>
                            <strong className="text-gray-700">
                              {t("Lot_ID")}:
                            </strong>{" "}
                            {detail.lotId}
                          </p>
                          <p>
                            <strong className="text-gray-700">
                              {t("Inventory_ID")}:
                            </strong>{" "}
                            {detail.inventoryId}
                          </p>
                          <p>
                            <strong className="text-gray-700">
                              {t("Inventory_Name")}:
                            </strong>{" "}
                            {detail.inventoryName}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p>
                            <strong className="text-gray-700">
                              {t("Price")}:
                            </strong>{" "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(detail.productPrice)}
                          </p>
                          <p>
                            <strong className="text-gray-700">
                              {t("Unit")}:
                            </strong>{" "}
                            {detail.unit}
                          </p>
                          <p>
                            <strong className="text-gray-700">
                              {t("Weight")}:
                            </strong>{" "}
                            {detail.weight} kg
                          </p>
                          <p>
                            <strong className="text-gray-700">
                              {t("Amount")}:
                            </strong>{" "}
                            {detail.productAmount}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center mt-4">
                        <img
                          src={detail.productImage}
                          alt={detail.productName}
                          className="w-40 h-40 object-cover rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Fees */}
                <div>
                  <h3 className="text-xl font-bold mb-4 border-b pb-2">
                    {t("Order_Fees")}
                  </h3>
                  {selectedOrderData.orderFees.map((fee, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg shadow-md mb-4 bg-gray-50"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <p>
                          <strong className="text-gray-700">
                            {t("Delivery_Fee")}:
                          </strong>{" "}
                          <span className="text-gray-900">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(fee.deliveryFee)}
                          </span>
                        </p>
                        <p>
                          <strong className="text-gray-700">
                            {t("Storage_Fee")}:
                          </strong>{" "}
                          <span className="text-gray-900">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(fee.storageFee)}
                          </span>
                        </p>
                        <p>
                          <strong className="text-gray-700">
                            {t("Additional_Fee")}:
                          </strong>{" "}
                          <span className="text-gray-900">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(fee.additionalFee)}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Modal>
          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4">
            <button
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
              onClick={() => setSelectedBatch(null)}
            >
              {t("Close")}
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default BatchManage;
