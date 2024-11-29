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
  // const [shippers, setShippers] = useState([]); // Shippers data
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedBatch, setSelectedBatch] = useState(null); // Selected batch for the drawer
  const [selectedBatchIds, setSelectedBatchIds] = useState([]); // Selected batch IDs for deletion
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
  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      try {
        const response = await fetchDataBearer({
          url: `/batch/get-batches?pageIndex=0&pageSize=100`,
          method: "GET",
        });
        const formattedBatches = response.items.map((batch) => ({
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

  // Fetch delivery zones
  const [deliveryZones, setDeliveryZones] = useState([]);
  useEffect(() => {
    const fetchDeliveryZones = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    if (userInfor?.workAtWarehouseId) {
      fetchDeliveryZones();
    }
  }, [userInfor]);


  

  // Fetch orders for Order IDs field
  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetchDataBearer({
  //         url: `/order/get-orders?descending=false&pageIndex=0&pageSize=1000`,
  //         method: "GET",
  //       });
  //       const formattedOrders = response.items.map((order) => ({
  //         id: order.id,
  //         partnerEmail: order.partner_email,
  //       }));
  //       setOrders(formattedOrders);
  //     } catch (error) {
  //       console.error("Error fetching orders:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchOrders();
  // }, []);

 
  const [shippers, setShippers] = useState([]);

 

  useEffect(() => {
    console.log("userInfor:", userInfor); // Kiểm tra giá trị của userInfor
  
    const fetchShippers = async () => {
      
      console.log("Fetching shippers...");
      setLoading(true);
      try {
        const warehouseId = userInfor?.workAtWarehouseId;
  
        if (!warehouseId) {
          console.error("Warehouse ID is not available");
          setLoading(false);
          return;
        }
  
        const response = await fetchDataBearer({
     
          url: `/warehouse/get-warehouse-shippers?filterBy=WarehouseId&filterQuery=${warehouseId}`,
          method: "GET",
        });
      
        if (response.status === 200 && response.data) {
          console.log("Shippers data:", response.data);
          setShippers(response.data.items || []); // Ensure this is correct
        } else {
          console.error("Failed to fetch shippers data");
        }
      } catch (error) {
        console.error("Error fetching shippers data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (userInfor?.workAtWarehouseId) {
      fetchShippers();
    }
  }, [userInfor]);
  

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
                  const selectedId = record.id;
                  setSelectedBatchIds((prev) =>
                    e.target.checked
                      ? [...prev, selectedId]
                      : prev.filter((id) => id !== selectedId)
                  );
                }}
              />
            ),
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
              <Tag color={status === "completed" ? "green" : "red"}>
                {status}
              </Tag>
            ),
          },
          {
            title: "Shipper",
            dataIndex: "assignTo",
            key: "assignTo",
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <Button onClick={() => setSelectedBatch(record)}>
                View Details
              </Button>
            ),
          },
        ]}
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
        visible={createBatchModalVisible}
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
          <Form.Item
            name="name"
            label="Batch Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
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

          <Form.Item
            name="deliveryZoneId"
            label="Delivery Zone"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select a delivery zone">
              {deliveryZones.map((zone) => (
                <Option key={zone.id} value={zone.id}>
                  DeliveryZoneId: {zone.id} - Name Zone: {zone.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="orders" label="Orders" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Select orders" allowClear>
              {orders.map((order) => (
                <Option key={order.id} value={order.id}>
                  {order.partnerEmail}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Batch Details Drawer */}
      <Drawer
        title={`Batch Details - ${selectedBatch?.name}`}
        visible={!!selectedBatch}
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
      </Drawer>
    </div>
  );
};

export default BatchManage;
