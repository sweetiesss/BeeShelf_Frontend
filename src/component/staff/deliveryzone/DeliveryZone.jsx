import React, { useEffect, useState } from "react";
import { Table, message, Spin, Button, Modal, Form, Select } from "antd";
import { useAuth } from "../../../context/AuthContext";
import useAxios from "../../../services/CustomizeAxios";

const { Option } = Select;

const DeliveryZone = () => {
  const { userInfor } = useAuth();
  const { fetchDataBearer } = useAxios();
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [loadingShippers, setLoadingShippers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch Delivery Zones
  const fetchDeliveryZones = async () => {
    try {
      setLoading(true);
      const warehouseId = userInfor?.workAtWarehouseId;

      if (!warehouseId) {
        message.error("Warehouse ID is not available. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetchDataBearer({
        url: `/warehouse/get-warehouse/${warehouseId}`,
        method: "GET",
      });

      if (response && response.data && response.data.deliveryZones) {
        setDeliveryZones(response.data.deliveryZones);
        message.success("Delivery Zones loaded successfully!");
      } else {
        message.error("No delivery zones returned from the server.");
      }
    } catch (error) {
      console.error("Error fetching Delivery Zones:", error);
      message.error("Error fetching delivery zones from the server.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Shippers
  const fetchShippers = async () => {
    try {
      setLoadingShippers(true);
      const warehouseId = userInfor?.workAtWarehouseId;

      if (!warehouseId) {
        message.error("Warehouse ID is not available. Please log in again.");
        return;
      }

      const response = await fetchDataBearer({
        url: "/warehouse/get-warehouse-shippers",
        method: "GET",
        params: {
          filterBy: "WarehouseId",
          filterQuery: warehouseId,
          pageIndex: 0,
          pageSize: 10,
        },
      });

      if (response && response.data && Array.isArray(response.data.items)) {
        setShippers(response.data.items);
        message.success("Shippers loaded successfully!");
      } else {
        setShippers([]);
        message.error("No shippers returned from the server.");
      }
    } catch (error) {
      console.error("Error fetching Shippers:", error);
      message.error("Error fetching the shipper list.");
      setShippers([]);
    } finally {
      setLoadingShippers(false);
    }
  };

  // Initial Fetch for Delivery Zones and Shippers
  useEffect(() => {
    if (userInfor?.workAtWarehouseId && !hasFetched) {
      fetchDeliveryZones();
      fetchShippers();
      setHasFetched(true);
    }
  }, [userInfor, hasFetched]);

  // Show Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle Modal Cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle Submit Form
  const handleAssign = async (values) => {
    const { shipperId, deliveryZoneId } = values;

    try {
      const response = await fetchDataBearer({
        url: `/warehouse/assign-shipper-to-delivery-zone/${shipperId}/${deliveryZoneId}`,
        method: "POST",
      });

      if (response) {
        message.success("Shipper assigned to Delivery Zone successfully!");
        setIsModalVisible(false);
        form.resetFields();
        fetchShippers(); // Refresh the shipper list after assignment
      } else {
        message.error("Failed to assign Shipper to Delivery Zone.");
      }
    } catch (error) {
      console.error("Error assigning Shipper to Delivery Zone:", error);
      message.error(
        `Error: ${
          error.response?.statusText || "An unexpected error occurred."
        }`
      );
    }
  };

  // Shippers Table Columns
  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      align: "center",
    },
    {
      title: "Shipper Name",
      dataIndex: "shipperName",
      key: "shipperName",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => text || "N/A",
    },
    {
      title: "Delivery Zone ID",
      dataIndex: "deliveryZoneId",
      key: "deliveryZoneId",
      align: "center",
    },
    {
      title: "Delivery Zone Name",
      dataIndex: "deliveryZoneName",
      key: "deliveryZoneName",
      align: "center",
    },
    {
      title: "Warehouse ID",
      dataIndex: "warehouseId",
      key: "warehouseId",
      align: "center",
    },
    {
      title: "Warehouse Name",
      dataIndex: "warehouseName",
      key: "warehouseName",
      align: "center",
    },
  ];

  return (
    <div className="p-[20px] overflow-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">DeliveryZone Management</h1>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Vehicle List</h1>
        <div className="flex gap-4">
          <Button
            type="primary"
            onClick={showModal}
            style={{ marginBottom: 20 }}
          >
            Assign Shipper To DeliveryZone
          </Button>
        </div>
      </div>

      {loadingShippers ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : (
        <Table
          dataSource={shippers}
          columns={columns}
          rowKey="employeeId"
          pagination={{ pageSize: 10 }}
          bordered={false}
          className="custom-table"
        />
      )}

      <Modal
        title="Assign Shipper To Delivery Zone"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAssign}>
          <Form.Item
            name="shipperId"
            label="Shipper"
            rules={[{ required: true, message: "Please select a Shipper!" }]}
          >
            <Select placeholder="Select a Shipper" loading={loadingShippers}>
              {shippers.map((shipper) => (
                <Option key={shipper.employeeId} value={shipper.employeeId}>
                  {`${shipper.shipperName} (ID: ${shipper.employeeId})`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="deliveryZoneId"
            label="Delivery Zone"
            rules={[
              { required: true, message: "Please select a Delivery Zone!" },
            ]}
          >
            <Select placeholder="Select a Delivery Zone" loading={loading}>
              {deliveryZones.map((zone) => (
                <Option key={zone.id} value={zone.id}>
                  {`${zone.name} (ID: ${zone.id})`}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeliveryZone;
