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
  const [shippersOption, setShippersOption] = useState([]);
  const [shippersOption2, setShippersOption2] = useState([]);
  const [loadingShippers, setLoadingShippers] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChangeModalVisible, setIsChangeModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [formChange] = Form.useForm();

  // Fetch Delivery Zones
  const fetchDeliveryZones = async () => {
    try {
      setLoading(true);
      const warehouseId = userInfor?.workAtWarehouseId;

      if (!warehouseId) {
        message.error("Warehouse ID is not available. Please log in again.");
        return;
      }

      const response = await fetchDataBearer({
        url: `/warehouse/get-warehouse/${warehouseId}`,
        method: "GET",
      });

      if (response?.data?.deliveryZones) {
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

  // Fetch Shippers for the Table
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

      if (response?.data?.items) {
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

  // Fetch Shippers for the Form Dropdown
  const fetchShippersOption = async () => {
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
          hasDeliveryZone: false,
          filterBy: "WarehouseId",
          filterQuery: warehouseId,
          pageIndex: 0,
          pageSize: 10,
        },
      });

      if (response?.data?.items) {
        setShippersOption(response.data.items);
        message.success("Shippers loaded successfully for selection!");
      } else {
        setShippersOption([]);
        message.error("No shippers available for selection.");
      }
    } catch (error) {
      console.error("Error fetching Shippers for options:", error);
      message.error("Error fetching the shipper list for selection.");
      setShippersOption([]);
    } finally {
      setLoadingShippers(false);
    }
  };
  //Set shippetOption2
 
     // Fetch Shippers for Change Modal
  const fetchShippersOption2 = async () => {
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
          hasDeliveryZone: true,
          filterBy: "WarehouseId",
          filterQuery: warehouseId,
          pageIndex: 0,
          pageSize: 10,
        },
      });

      if (response?.data?.items) {
        setShippersOption2(response.data.items);
        message.success("Shippers loaded successfully for changing!");
      } else {
        setShippersOption2([]);
        message.error("No shippers available for changing.");
      }
    } catch (error) {
      console.error("Error fetching Shippers for changing:", error);
      message.error("Error fetching the shipper list for changing.");
      setShippersOption2([]);
    } finally {
      setLoadingShippers(false);
    }
  };
  useEffect(() => {
    if (userInfor?.workAtWarehouseId && !hasFetched) {
      fetchDeliveryZones();
      fetchShippers();
      setHasFetched(true);
    }
  }, [userInfor, hasFetched]);

  // Show Modal
  const showModal = () => {
    fetchShippersOption();
    setIsModalVisible(true);
  };
  const showChangeModal = () => {
    fetchShippersOption2();
    setIsChangeModalVisible(true);
  };

  // Handle Modal Cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
   // Handle Cancel Change Modal
   const handleChangeCancel = () => {
    setIsChangeModalVisible(false);
    formChange.resetFields();
  };

  // Handle Submit Form
 // Handle Submit Form
const handleAssign = async (values) => {
  const { shipperId, deliveryZoneId } = values;

  try {
    const response = await fetchDataBearer({
      url: `/warehouse/assign-shipper-to-delivery-zone/${shipperId}/${deliveryZoneId}`,
      method: "POST",
    });

    if (response) {
      if (isChangeModalVisible) {
        message.success("Shipper changed to Delivery Zone successfully!");
        setIsChangeModalVisible(false);
        formChange.resetFields();
      } else if (isModalVisible) {
        message.success("Shipper assigned to Delivery Zone successfully!");
        setIsModalVisible(false);
        form.resetFields();
      }

      fetchShippers(); // Refresh shipper list
    } else {
      if (isChangeModalVisible) {
        message.error("Failed to change Shipper in Delivery Zone.");
      } else if (isModalVisible) {
        message.error("Failed to assign Shipper to Delivery Zone.");
      }
    }
  } catch (error) {
    console.error("Error assigning Shipper to Delivery Zone:", error);

    if (isChangeModalVisible) {
      message.error(
        `Error changing Shipper: ${error.response?.data?.message || "An unexpected error occurred."}`
      );
    } else if (isModalVisible) {
      message.error(
        `Error assigning Shipper: ${error.response?.data?.message || "An unexpected error occurred."}`
      );
    }
  }
};

  

  return (
    <div className="p-[20px] overflow-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Delivery Zone Management
      </h1>

      <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-700">Shipper List</h2>
      <div className="flex gap-4">
        <Button type="primary" onClick={showModal}>
          Assign Shipper To Delivery Zone
        </Button>
        <Button
          className="bg-green-500 text-white hover:bg-green-600"
          onClick={showChangeModal}
        >
          Change Shipper To Delivery Zone
        </Button>
      </div>
    </div>
   

      <Table
        dataSource={shippers}
        rowKey="employeeId"
        pagination={{ pageSize: 10 }}
        bordered={false} // Đã chỉnh bordered thành false
        loading={loadingShippers}
        columns={[
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
            render: (status) => status || "N/A",
          },
          {
            title: "Delivery Zone",
            dataIndex: "deliveryZoneName",
            key: "deliveryZoneName",
            align: "center",
            filters: deliveryZones.map((zone) => ({
              text: zone.name,
              value: zone.name,
            })),
            onFilter: (value, record) => record.deliveryZoneName === value,
            render: (text) => text || "N/A",
          },
          {
            title: "Warehouse",
            dataIndex: "warehouseName",
            key: "warehouseName",
            align: "center",
            render: (text) => text || "N/A",
          },
        ]}
        locale={{ emptyText: "No Data" }}
      />
{/* Modal Assign */}
      <Modal
        title="Assign Shipper To Delivery Zone"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Assign"
        cancelText="Cancel"
      >
         <Form form={form} layout="vertical" onFinish={handleAssign}>
          <Form.Item
            name="shipperId"
            label="Shipper"
            rules={[{ required: true, message: "Please select a Shipper!" }]}
          >
            <Select placeholder="Select a Shipper" loading={loadingShippers}>
              {shippersOption.map((shipper) => (
                <Option key={shipper.employeeId} value={shipper.employeeId}>
                  {`${shipper.shipperName} (ID: ${shipper.employeeId})`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="deliveryZoneId"
            label="Delivery Zone"
            rules={[{ required: true, message: "Please select a Delivery Zone!" }]}
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


        {/* Change Modal */}
        <Modal
        title="Change Shipper To Delivery Zone"
        visible={isChangeModalVisible}
        onCancel={handleChangeCancel}
        
        // onCancel={handleAssign}
        onOk={() => formChange.submit()}
        okText="Change"
        cancelText="Cancel"
      >
        <Form form={formChange} layout="vertical" onFinish={handleAssign}>
          <Form.Item
            name="shipperId"
            label="Shipper"
            rules={[{ required: true, message: "Please select a Shipper!" }]}
          >
            <Select placeholder="Select a Shipper" loading={loadingShippers}>
              {shippersOption2.map((shipper) => (
                <Option key={shipper.employeeId} value={shipper.employeeId}>
                  {`${shipper.shipperName} (ID: ${shipper.employeeId})`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="deliveryZoneId"
            label="Delivery Zone"
            rules={[{ required: true, message: "Please select a Delivery Zone!" }]}
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
