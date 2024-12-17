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
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch Delivery Zones
  useEffect(() => {
    const fetchDeliveryZones = async () => {
      if (hasFetched) return;

      try {
        setLoading(true);
        const warehouseId = userInfor?.workAtWarehouseId;

        if (!warehouseId) {
          console.error("Warehouse ID is not available");
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
          setHasFetched(true);
          message.success("Data loaded successfully!");
        } else {
          message.error("No data returned from the server.");
        }
      } catch (error) {
        console.error("Error fetching Delivery Zones:", error);
        message.error("Error fetching data from the server.");
      } finally {
        setLoading(false);
      }
    };

    if (userInfor?.workAtWarehouseId && !hasFetched) {
      fetchDeliveryZones();
      fetchShippers();
    }
  }, [fetchDataBearer, userInfor, hasFetched]);

  const [loadingShippers, setLoadingShippers] = useState(false);

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
  
      // Check if response.data.items is an array
      if (response && response.data && Array.isArray(response.data.items)) {
        setShippers(response.data.items);
        console.log("Shipper List:", response.data.items);
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
    console.log("Assigned Values:", values);
    message.success("Shipper assigned successfully!");
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Zone Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Province/City ID",
      dataIndex: "provinceId",
      key: "provinceId",
      align: "center",
    },
    {
      title: "Province/City Name",
      dataIndex: "provinceName",
      key: "provinceName",
      align: "center",
    },
  ];

  return (
    <div className="p-[20px] overflow-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        DeliveryZone List
      </h1>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 20 }}>
        Assign Shipper To DeliveryZone
      </Button>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : (
        <Table
          dataSource={deliveryZones}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered={false}
        />
      )}

      <Modal
        title="Assign Shipper To DeliveryZone"
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
            <Select placeholder="Select a Shipper">
              {shippers.map((shipper) => (
                <Option key={shipper.employeeId} value={shipper.employeeId}>
                  {shipper.employeeId || `Shipper ID: ${shipper.employeeId}`}
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
            <Select placeholder="Select a Delivery Zone">
              {deliveryZones.map((zone) => (
                <Option key={zone.id} value={zone.id}>
                  {zone.name || `Delivery Zone ID: ${zone.id}`}
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
