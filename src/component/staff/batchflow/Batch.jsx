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
    pageSize: 10,
    totalPagesCount: 0,
    pageIndex: 0,
  });

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
        shipperName: batch.shipperName,
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

  // Handle delete action
  const handleDelete = async () => {
    if (selectedBatchIds.length === 0) {
      message.warning("Please select at least one batch to delete.");
      return;
    }

    setLoading(true);
    try {
      for (const batchId of selectedBatchIds) {
        await fetchDataBearer({
          url: `/batch/delete-batch/${batchId}`,
          method: "DELETE",
        });
      }

      message.success("Selected batches deleted successfully.");
      setBatches((prev) =>
        prev.filter((batch) => !selectedBatchIds.includes(batch.id))
      );
      setSelectedBatchIds([]);
    } catch (error) {
      console.error("Error deleting batches:", error);
      message.error("Failed to delete selected batches.");
    } finally {
      setLoading(false);
    }
  };
  const formatDateTimeVN = (dateString) => {
    if (!dateString) return { date: "", time: "" };

    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return { date: formattedDate, time: formattedTime };
  };

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

  const columns = [
    // {
    //   title: "Select",
    //   dataIndex: "select",
    //   key: "select",
    //   render: (_, record) => (
    //     <input
    //       type="checkbox"
    //       checked={selectedBatchIds.includes(record.id)}
    //       onChange={(e) => {
    //         const selectedId = record.id;
    //         setSelectedBatchIds((prev) =>
    //           e.target.checked
    //             ? [...prev, selectedId]
    //             : prev.filter((id) => id !== selectedId)
    //         );
    //       }}
    //     />
    //   ),
    // },
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
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "DeliveryZoneName",
      dataIndex: "deliveryZoneName",
      key: "deliveryZoneName",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button onClick={() => setSelectedBatch(record)}>View Details</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Batch Management</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setCreateBatchModalVisible(true)}>
          Create Batch
        </Button>
        {/* <Button
          type="danger"
          onClick={handleDelete}
          disabled={selectedBatchIds.length === 0}
        >
          Delete Selected Batches
        </Button> */}
      </Space>
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

      {/* Batch Details Drawer */}
      {/* <Drawer
        title={`Batch Details - ${selectedBatch?.name}`}
        open={!!selectedBatch}
        onClose={() => setSelectedBatch(null)}
        width={500}
      >
        <Typography.Title level={5}>Orders</Typography.Title>
        <List
          dataSource={selectedBatch?.orders || []}
          renderItem={(order) => (
            <List.Item key={order.id}>
              Order Code: {order.id}
              <Divider />
            </List.Item>
          )}
        />
      </Drawer> */}
      <Drawer
        title={`Batch Details Batch Name: ${selectedBatch?.name}`}
        open={!!selectedBatch}
        onClose={() => setSelectedBatch(null)}
        width={500}
      >
        <div className="px-8 py-4">
          {/* Title */}
          {/* <Typography.Title level={5} className="mb-4">Orders</Typography.Title> */}

          {/* Orders List */}
          <div className="space-y-4">
            <List
              dataSource={selectedBatch?.orders || []}
              renderItem={(order) => (
                <List.Item key={order.id}>
                  {/* <div className="p-4 space-y-3 bg-white rounded-lg shadow-md"> */}
                  <div className="p-6 space-y-4 w-full max-w-xl bg-white rounded-lg shadow-lg">
                    {/* Order Code */}
                    <div className="flex justify-between items-center">
                      <div className="text-base">
                        <span className="font-bold text-gray-10000">
                          Order ID:
                        </span>
                        <span className="text-gray-700"> {order.id}</span>
                      </div>
                    </div>

                    <Divider />

                    {/* Order Details */}
                    <div className="flex justify-between">
                      <div className="w-[80%]">
                        <div className="text-base text-gray-10000">
                          <span className="font-bold">Order Code:</span>
                          <span className="text-gray-700">
                            {" "}
                            {order.orderCode}
                          </span>
                        </div>

                        <div className="text-base text-gray-10000">
                          <span className="font-bold">Warehouse Name:</span>
                          <span className="text-gray-700">
                            {" "}
                            {order.warehouseName}
                          </span>
                        </div>

                        <div className="text-base text-gray-10000">
                          <span className="font-bold">Partner Email:</span>
                          <span className="text-gray-700">
                            {" "}
                            {order.partner_email}
                          </span>
                        </div>

                        <div className="text-base text-gray-10000">
                          <span className="font-bold">Order Status:</span>
                          <span className="text-gray-700"> {order.status}</span>
                        </div>

                        <div className="text-base text-gray-10000">
                          <span className="font-bold">
                            Reason For Cancellation:
                          </span>
                          <span className="text-gray-700">
                            {" "}
                            {order.cancellationReason}
                          </span>
                        </div>

                        <div className="text-base text-gray-1000">
                          <span className="font-bold">
                            Order Creation Date:
                          </span>
                          <span className="text-gray-700">
                            {" "}
                            {formatDateTimeVN(order.createDate).date}{" "}
                            {formatDateTimeVN(order.createDate).time}
                          </span>
                        </div>

                        <div className="text-base text-gray-1000">
                          <span className="font-bold">Approval Date:</span>
                          <span className="text-gray-700">
                            {" "}
                            {formatDateTimeVN(order.approveDate).date}{" "}
                            {formatDateTimeVN(order.approveDate).time}
                          </span>
                        </div>

                        <div className="text-base text-gray-10000">
                          <span className="font-bold">
                            Delivery Start Date:
                          </span>
                          <span className="text-gray-700">
                            {" "}
                            {formatDateTimeVN(order.deliverStartDate).date}{" "}
                            {formatDateTimeVN(order.deliverStartDate).time}
                          </span>
                        </div>

                        <div className="text-base text-gray-10000">
                          <span className="font-bold">
                            Delivery Finish Date:
                          </span>
                          <span className="text-gray-700">
                            {" "}
                            {
                              formatDateTimeVN(order.deliverFinishDate).date
                            }{" "}
                            {formatDateTimeVN(order.deliverFinishDate).time}
                          </span>
                        </div>

                        <div className="text-base text-gray-10000">
                          <span className="font-bold">Completion Date:</span>
                          <span className="text-gray-700">
                            {" "}
                            {formatDateTimeVN(order.completeDate).date}{" "}
                            {formatDateTimeVN(order.completeDate).time}
                          </span>
                        </div>

                        <div className="text-base text-gray-10000">
                          <span className="font-bold">Return Date:</span>
                          <span className="text-gray-700">
                            {" "}
                            {formatDateTimeVN(order.returnDate).date}{" "}
                            {formatDateTimeVN(order.returnDate).time}
                          </span>
                        </div>

                        <div className="text-base text-gray-10000">
                          <span className="font-bold">Cancellation Date:</span>
                          <span className="text-gray-700">
                            {" "}
                            {formatDateTimeVN(order.cancelDate).date}{" "}
                            {formatDateTimeVN(order.cancelDate).time}
                          </span>
                        </div>

                        <div className="text-base text-gray-10000">
                          <span className="font-bold">
                            Recipient Phone Number:
                          </span>
                          <span className="text-gray-700">
                            {" "}
                            {order.receiverPhone}
                          </span>
                        </div>

                        <div className="text-base text-gray-10000">
                          <span className="font-bold">Recipient Address:</span>
                          <span className="text-gray-700">
                            {" "}
                            {order.receiverAddress}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>

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
