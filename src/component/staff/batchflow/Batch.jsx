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

  const handleDeleteBatch = (batchId) => {
    console.log("Batch ID to be deleted:", batchId);

    Modal.confirm({
      title: "Are you sure you want to delete this batch?",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
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
            message.success("Batch deleted successfully.");
            // Làm mới danh sách sau khi xóa
            fetchBatches();
          } else {
            // Hiển thị thông báo lỗi từ server nếu có
            message.error(
              response.data.message ||
                "Failed to delete batch. Please try again."
            );
          }
        } catch (error) {
          console.error("Error deleting batch:", error);

          // Kiểm tra lỗi từ phản hồi của server
          if (error.response && error.response.data) {
            message.error(error.response.data.message);
          } else {
            message.error(
              "An error occurred while deleting the batch. Please try again."
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
        console.error("Failed to fetch batches data");
        return;
      }
      const formattedBatches = response.data.items.map((batch) => ({
        key: batch.id,
        id: batch.id,
        name: batch.name,
        status: batch.status,
        completeDate: batch.completeDate || "Not Completed",
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
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
      message.success("Data loaded successfully!");
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
          console.error("Failed to fetch delivery zones");
        }
      } catch (error) {
        console.error("Error fetching delivery zones:", error);
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
            pageIndex: 0,
            pageSize: 100,
            orderFilterBy: "DeliveryZoneId",
            filterQuery: selectedDeliveryZone,
            filterByStatus: "Processing",
            hasBatch: false,
          },
        });
        console.log("Orders data:", response);
        if (!response || !response.data) {
          console.error("Failed to fetch orders data");
          return;
        }
        const formattedOrders = response.data.items.map((order) => ({
          id: order.id,
          partnerEmail: order.partner_email,
        }));
        console.log("Formatted orders:", formattedOrders);
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
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
          console.error("Warehouse ID is not available");
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

            // vehicleFilter: "notEmpty" // Giả sử API hỗ trợ điều kiện lọc này
          },
        });
        // Kiểm tra và lọc các shipper có vehicles không rỗng
        // const filteredShippers = response.data.filter(
        //   (shipper) => shipper.vehicles && shipper.vehicles.length > 0
        // );
        // console.log(filteredShippers);
        if (response.status === 200 && response.data) {
          console.log("Shippers data:", response.data);
          setShippers(response.data.items || []); // Ensure this is correct
        } else {
          console.error("Failed to fetch shippers data");
        }
      } catch (error) {
        console.error("Error fetching shippers data:", error);
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
      console.log("Payload:", payload);
      const response = await fetchDataBearer({
        url: `/batch/create-batch`,
        method: "POST",
        data: payload,
      });

      if (response.status === 200 || response.status === 201) {
        message.success("Batch created successfully.");
        // setBatches((prev) => [...prev, { ...payload, id: response.data.id }]);
        form.resetFields();
        setCreateBatchModalVisible(false);
        fetchBatches();
      } else {
        throw new Error("Failed to create batch.");
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      message.error(error.response?.data?.message || "Failed to create batch.");
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
    // console.log("Fetching details for order ID:", id);

    try {
      const response = await fetchDataBearer({
        url: `/order/get-order/${id}`,
        method: "GET",
      });

      // console.log("Full Response:", response);

      if (response) {
        console.log("Response Status:", response.status);
        console.log("Response Data:", response.data);
      }

      if (response && response.data) {
        console.log("Order Details:", response.data);
        setSelectedOrderData(response.data);
        setDetailModalVisible(true);
      } else {
        message.error("Failed to fetch order details.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error(
        "An error occurred while fetching order details. Please try again."
      );
    }
  };

  const columns = [
    {
      title: "Batch ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Batch Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
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

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Delivery Zone Name",
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
          >
            {deliveryZones.map((zone) => (
              <Option key={zone.id} value={zone.name}>
                {zone.name}
              </Option>
            ))}
          </Select>
        </div>
      ),
      onFilter: (value, record) => record.deliveryZoneName === value,
      render: (deliveryZoneName) => deliveryZoneName,
    },
    {
      title: "Shipper",
      dataIndex: "shipperName",
      key: "shipperName",
    },
    {
      title: "Shipper Email",
      dataIndex: "shipperEmail",
      key: "shipperEmail",
    },
    {
      title: "Create Date",
      dataIndex: "deliveryStartDate",
      key: "deliveryStartDate",
      render: (date) => {
        if (!date) return "N/A";

        return <div>{formatDateTime(date)}</div>;
      },
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button type="primary" onClick={() => setSelectedBatch(record)}>
            View Details
          </Button>
          <Button
            className="bg-red-500 text-white border-none hover:bg-red-600 focus:bg-red-600"
            onClick={() => handleDeleteBatch(record.id)}
            disabled={record.status !== "Pending"} // Disable nếu status không phải là Pending
            style={{
              backgroundColor:
                record.status === "Pending" ? "#ff4d4f" : "#f5f5f5",
              color: record.status === "Pending" ? "#fff" : "#d9d9d9",
              borderColor: record.status === "Pending" ? "#ff4d4f" : "#d9d9d9",
            }}
          >
            Delete Batch
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Batch Management
      </h1>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Batch List</h1>
        <Button type="primary" onClick={() => setCreateBatchModalVisible(true)}>
          Create Batch
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
        title="Create Batch"
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
            label="Batch Name"
            rules={[
              { required: true, message: "Please enter a batch name" },
              {
                max: 250,
                message: "Batch name must be 250 characters or fewer",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Delivery Zone */}
          <Form.Item
            name="deliveryZoneId"
            label="Delivery Zone"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a delivery zone"
              onChange={(value) => setSelectedDeliveryZone(value)}
            >
              {deliveryZones.map((zone) => (
                <Option key={zone.id} value={zone.id}>
                  DeliveryZoneId: {zone.id} - Name Zone: {zone.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Shipper */}
          <Form.Item
            name="shipperId"
            label="Shipper"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select a shipper">
              {shippers.map(
                (shipper) =>
                  shipper.employeeId &&
                  shipper.warehouseId && (
                    <Option key={shipper.employeeId} value={shipper.employeeId}>
                      EmployeeId: {shipper.employeeId} - WarehouseId:{" "}
                      {shipper.warehouseId}
                    </Option>
                  )
              )}
            </Select>
          </Form.Item>

          {/* Orders */}
          <Form.Item name="orders" label="Orders" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Select orders" allowClear>
              {orders.map((order) => (
                <Option key={order.id} value={order.id}>
                  id: {order.id} - email: {order.partnerEmail}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={
          <>
            <span className="text-gray-600">Batch Details Name: </span>
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
            <span className="font-bold">Shipper Name:</span>{" "}
            <span className="font-normal">{selectedBatch?.shipperName}</span>
          </Typography.Title>
          <Typography.Title level={5} className="mb-4">
            <span className="font-bold">Shipper Email:</span>{" "}
            <span className="font-normal">{selectedBatch?.shipperEmail}</span>
          </Typography.Title>
          <Typography.Title level={5} className="mb-4">
            <span className="font-bold">Delivery Zone:</span>{" "}
            <span className="font-normal">
              {selectedBatch?.deliveryZoneName}
            </span>
          </Typography.Title>

          <div className="flex items-center">
            <strong className="mr-2">Status: </strong>
            <Tag
              color={
                selectedBatch?.status === "Pending"
                  ? "red"
                  : selectedBatch?.status === "Completed"
                  ? "green"
                  : "default"
              }
            >
              {selectedBatch?.status}
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
                          <strong className="text-gray-900">Order Code:</strong>{" "}
                          {order.orderCode}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Warehouse Name:
                          </strong>{" "}
                          {order.warehouseName}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Partner Email:
                          </strong>{" "}
                          {order.partner_email}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Order Status:
                          </strong>{" "}
                          {order.status}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Total Price:
                          </strong>{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.totalPrice)}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Total Price After Fee:
                          </strong>{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.totalPriceAfterFee)}
                        </p>
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Receiver Phone:
                          </strong>{" "}
                          {order.receiverPhone}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Receiver Address:
                          </strong>{" "}
                          {order.receiverAddress}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            DeliveryZone Name:
                          </strong>{" "}
                          {order.deliveryZoneName}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Cancellation Reason:
                          </strong>{" "}
                          {order.cancellationReason}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Order Creation Date:
                          </strong>{" "}
                          {formatDateTime(order.createDate)}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Approval Date:
                          </strong>{" "}
                          {formatDateTime(order.approveDate)}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Delivery Start Date:
                          </strong>{" "}
                          {formatDateTime(order.deliverStartDate)}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Complete Date:
                          </strong>{" "}
                          {formatDateTime(order.completeDate)}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Return Date:
                          </strong>{" "}
                          {formatDateTime(order.returnDate)}
                        </p>

                        <p className="text-gray-700">
                          <strong className="text-gray-900">
                            Cancel Date:
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
                        View Order Details
                      </button>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
          <Modal
            title={<span className="text-2xl font-bold">Detail Order</span>}
            visible={detailModalVisible}
            onCancel={() => setDetailModalVisible(false)}
            footer={null}
          >
            {selectedOrderData && (
              <div className="space-y-8">
                {/* Order Details */}
                <div>
                  <h3 className="text-xl font-bold mb-4 border-b pb-2">
                    Order Details
                  </h3>
                  {selectedOrderData.orderDetails.map((detail) => (
                    <div
                      key={detail.id}
                      className="p-4 border rounded-lg shadow-md mb-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p>
                            <strong className="text-gray-700">Order ID:</strong>{" "}
                            {detail.id}
                          </p>
                          <p>
                            <strong className="text-gray-700">
                              Product Name:
                            </strong>{" "}
                            {detail.productName}
                          </p>
                          <p>
                            <strong className="text-gray-700">Lot ID:</strong>{" "}
                            {detail.lotId}
                          </p>
                          <p>
                            <strong className="text-gray-700">
                              Inventory ID:
                            </strong>{" "}
                            {detail.inventoryId}
                          </p>
                          <p>
                            <strong className="text-gray-700">
                              Inventory Name:
                            </strong>{" "}
                            {detail.inventoryName}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p>
                            <strong className="text-gray-700">Price:</strong>{" "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(detail.productPrice)}
                          </p>
                          <p>
                            <strong className="text-gray-700">Unit:</strong>{" "}
                            {detail.unit}
                          </p>
                          <p>
                            <strong className="text-gray-700">Weight:</strong>{" "}
                            {detail.weight} kg
                          </p>
                          <p>
                            <strong className="text-gray-700">Amount:</strong>{" "}
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
                    Order Fees
                  </h3>
                  {selectedOrderData.orderFees.map((fee, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg shadow-md mb-4 bg-gray-50"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <p>
                          <strong className="text-gray-700">
                            Delivery Fee:
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
                            Storage Fee:
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
                            Additional Fee:
                          </strong>{" "}
                          <span className="text-gray-900">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(fee.additionalFee)}
                          </span>
                        </p>
                        {/* <p>
                          <strong className="text-gray-700">Total Fee:</strong>{" "}
                          <span className="text-green-600 font-bold">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(
                              fee.deliveryFee +
                                fee.storageFee +
                                fee.additionalFee
                            )}
                          </span>
                        </p> */}
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
              Close
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default BatchManage;
