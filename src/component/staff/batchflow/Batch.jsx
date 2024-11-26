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
import useAxios from "../../../services/CustomizeAxios";
import { useAuth } from "../../../context/AuthContext";

const { Option } = Select;

const BatchManage = () => {
  const [batches, setBatches] = useState([]); // All batch data
  const [orders, setOrders] = useState([]); // Orders data for Order IDs field
  const [shippers, setShippers] = useState([]); // Shippers data
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedBatch, setSelectedBatch] = useState(null); // Selected batch for the drawer
  const [selectedBatchIds, setSelectedBatchIds] = useState([]); // Selected batch IDs for deletion
  const [createBatchModalVisible, setCreateBatchModalVisible] = useState(false); // Modal visibility
  const { fetchDataBearer } = useAxios(); // Custom Axios hook
  const { userInfor } = useAuth();
  const [form] = Form.useForm();

  // Fetch batches data from API
  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      try {
        const response = await fetchDataBearer({
          url: `/batch/get-batches?pageIndex=0&pageSize=100`,
          method: "GET",
        });
        const formattedBatches = response.data.items.map((batch) => ({
          key: batch.id,
          id: batch.id,
          name: batch.name,
          status: batch.status,
          completeDate: batch.completeDate || "Not Completed",
          assignTo: batch.assignTo,
          deliveryZoneId: batch.deliveryZoneId,
          orders: batch.orders,
        }));
        setBatches(formattedBatches);
      } catch (error) {
        console.error("Error fetching batches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  //fetchDeliveryZones
  const [deliveryZones, setDeliveryZones] = useState([]);
  useEffect(() => {
    // Hàm gọi API để lấy danh sách delivery zones
    const fetchDeliveryZones = async () => {
      try {
        console.log(userInfor?.workAtWarehouseId);
        setLoading(true);
        const warehouseId = userInfor?.workAtWarehouseId;

        if (!warehouseId) {
          console.error("Warehouse ID is not available");
          setLoading(false);
          return;
        }
        const response = await fetchDataBearer({
          url: `/warehouse/get-warehouse/${warehouseId}`,
          method: "GET",
        });

        if (response.status === 200 && response.data) {
          setDeliveryZones(response.data.deliveryZones || []); // Giả sử API trả về mảng deliveryZones
        } else {
          console.error("Failed to fetch delivery zones");
        }
      } catch (error) {
        console.error("Error fetching delivery zones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryZones();
  }, [userInfor]);

  // Fetch orders for Order IDs field
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetchDataBearer({
          url: `/order/get-orders?descending=false&pageIndex=0&pageSize=1000`,
          method: "GET",
        });
        const formattedOrders = response.data.items.map((order) => ({
          id: order.id,
          partnerEmail: order.partner_email,
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // const [shippers, setShippers] = useState([]);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hàm gọi API để lấy thông tin shippers
    const fetchShipperWarehouse = async () => {
      try {
        console.log(
          "Fetching shippers for Warehouse ID:",
          userInfor?.workAtWarehouseId
        );
        setLoading(true);

        const warehouseId = userInfor?.workAtWarehouseId;

        if (!warehouseId) {
          console.error("Warehouse ID is not available");
          setLoading(false);
          return;
        }

        // Gọi API với axios
        // const response = await axios.get(`/warehouse/get-warehouse-shippers`, {
        //   params: { filterBy: warehouseId },
        // });
        // const response = await fetchDataBearer({
        //   url: `/warehouse/get-warehouse/${warehouseId}`,
        //   method: "GET",
        // });
        const response = await fetchDataBearer({
          url: `/warehouse/get-warehouse-shippers${warehouseId}`,
          method: "GET",
          // params: { filterBy: warehouseId }, // Gửi warehouseId dưới dạng query param
        });
        

        if (response.status === 200 && response.data) {
          console.log("Fetched Shipper Warehouse Data:", response.data);
          setShippers(response.data.deliveryZones || []); // Giả sử API trả về danh sách trong `deliveryZones`
        } else {
          console.error("Failed to fetch shipper warehouse data");
        }
      } catch (error) {
        console.error("Error fetching shipper warehouse data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Gọi hàm khi component render
    fetchShipperWarehouse();
  }, [userInfor]);

  // // Fetch shippers for Shipper ID field
  // useEffect(() => {
  //   const fetchShippers = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetchDataBearer({
  //         url: `/warehouse/get-warehouse-shippers?pageIndex=0&pageSize=100000`,
  //         method: "GET",
  //       });
  //       const formattedShippers = response.data.items.map((shipper) => ({
  //         employeeId: shipper.employeeId,
  //         email: shipper.email,
  //       }));
  //       setShippers(formattedShippers); // Update the shippers state
  //     } catch (error) {
  //       console.error("Error fetching shippers:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchShippers();
  // }, []);

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
      const response = await fetchDataBearer({
        url: `/batch/create-batch`,
        method: "POST",
        data: payload,
      });

      if (response.status === 200 || response.status === 201) {
        message.success("Batch created successfully.");
        setBatches((prev) => [...prev, { ...payload, id: response.data.id }]);
        form.resetFields();
        setCreateBatchModalVisible(false);
      } else {
        throw new Error("Failed to create batch.");
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      message.error("Failed to create batch.");
    } finally {
      setLoading(false);
    }
  };

  // Render the "Status" tag
  const renderStatusTag = (status) => {
    let color;
    switch (status) {
      case "Pending":
        color = "orange";
        break;
      case "Completed":
        color = "green";
        break;
      default:
        color = "default";
    }
    return <Tag color={color}>{status}</Tag>;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Batch Management</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setCreateBatchModalVisible(true)}>
          Create Batch
        </Button>
        <Button
          type="danger"
          onClick={handleDelete}
          disabled={selectedBatchIds.length === 0}
        >
          Delete Selected Batches
        </Button>
      </Space>
      <Table
        dataSource={batches}
        columns={[
          {
            title: "Select",
            dataIndex: "select",
            key: "select",
            render: (_, record) => (
              <input
                type="checkbox"
                checked={selectedBatchIds.includes(record.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBatchIds((prev) => [...prev, record.id]);
                  } else {
                    setSelectedBatchIds((prev) =>
                      prev.filter((id) => id !== record.id)
                    );
                  }
                }}
              />
            ),
          },
          { title: "Batch ID", dataIndex: "id", key: "id" },
          { title: "Batch Name", dataIndex: "name", key: "name" },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: renderStatusTag,
          },
          {
            title: "Completion Date",
            dataIndex: "completeDate",
            key: "completeDate",
          },
          { title: "Assign To", dataIndex: "assignTo", key: "assignTo" },
          {
            title: "Delivery Zone ID",
            dataIndex: "deliveryZoneId",
            key: "deliveryZoneId",
          },
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <Button onClick={() => setSelectedBatch(record)}>
                View Details
              </Button>
            ),
          },
        ]}
        loading={loading}
        pagination={{ pageSize: 10, position: ["bottomCenter"] }}
      />
      {selectedBatch && (
        <BatchDetailDrawer
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
        />
      )}
      <Modal
        title="Create Batch"
        visible={createBatchModalVisible}
        onCancel={() => setCreateBatchModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateBatch} layout="vertical">
          <Form.Item
            label="Batch Name"
            name="name"
            rules={[{ required: true, message: "Please enter a batch name!" }]}
          >
            <Input placeholder="Enter batch name" />
          </Form.Item>
          <Form.Item
            label="Shipper ID"
            name="shipperId"
            rules={[{ required: true, message: "Please select a shipper!" }]}
          >
            <Select placeholder="Select a shipper" loading={loading} allowClear>
              {shippers.map((shipper) => (
                <Option key={shipper.employeeId} value={shipper.employeeId}>
                  {`ID: ${shipper.employeeId} - Email: ${shipper.email}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* <Form.Item
            label="Delivery Zone ID"
            name="deliveryZoneId"
            rules={[{ required: true, message: "Please enter a delivery zone ID!" }]}
          >
            <Input type="number" placeholder="Enter delivery zone ID" />
          </Form.Item> */}
          <Form.Item
            label="Delivery Zone ID"
            name="deliveryZoneId"
            rules={[
              { required: true, message: "Please select a delivery zone ID!" },
            ]}
          >
            <Select
              placeholder="Select a delivery zone ID"
              loading={loading}
              allowClear
            >
              {deliveryZones.map((zone) => (
                <Option key={zone.id} value={zone.id}>
                  {/* Hiển thị tên hoặc thông tin zone */}
                  {`ID: ${zone.id} - ZoneName: ${zone.name}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Order IDs"
            name="orders"
            rules={[
              { required: true, message: "Please select at least one order!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select orders"
              loading={loading}
            >
              {orders.map((order) => (
                <Option key={order.id} value={order.id}>
                  {`ID: ${order.id} - Email: ${order.partnerEmail}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const BatchDetailDrawer = ({ batch, onClose }) => (
  <Drawer
    title={`Batch Details - ${batch.name}`}
    width={600}
    onClose={onClose}
    open={!!batch}
    bodyStyle={{ overflowY: "auto", paddingBottom: "20px" }}
  >
    {/* Drawer details */}
  </Drawer>
);

export default BatchManage;
