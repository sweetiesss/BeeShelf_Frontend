import React, { useEffect, useState } from "react";
import { Table, message, Spin, Button, Modal, Form, Select } from "antd";
import { useAuth } from "../../../context/AuthContext";
import useAxios from "../../../services/CustomizeAxios";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  // Fetch Delivery Zones
  const fetchDeliveryZones = async () => {
    try {
      setLoading(true);
      const warehouseId = userInfor?.workAtWarehouseId;
  
      if (!warehouseId) {
        message.error(t("Warehouse_ID_is_not_available._Please_log_in_again."));
        return;
      }
  
      const response = await fetchDataBearer({
        url: `/store/get-store/${warehouseId}`,
        method: "GET",
      });
  
      if (response?.data?.deliveryZones) {
        setDeliveryZones(response.data.deliveryZones);
        message.success(t("Delivery_Zones_loaded_successfully!"));
      } else {
        message.error(t("No_delivery_zones_returned_from_the_server."));
      }
    } catch (error) {
      console.error(t("Error_fetching_Delivery_Zones:"), error);
      message.error(t("Error_fetching_delivery_zones_from_the_server."));
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
        message.error(t("Warehouse_ID_is_not_available._Please_log_in_again."));
        return;
      }
  
      const response = await fetchDataBearer({
        url: "/store/get-store-shippers",
        method: "GET",
        params: {
          filterBy: "StoreId",
          filterQuery: warehouseId,
          pageIndex: 0,
          pageSize: 10,
        },
      });
  
      if (response?.data?.items) {
        setShippers(response.data.items);
        message.success(t("Shippers_loaded_successfully!"));
      } else {
        setShippers([]);
        message.error(t("No_shippers_returned_from_the_server."));
      }
    } catch (error) {
      console.error(t("Error_fetching_Shippers:"), error);
      message.error(t("Error_fetching_the_shipper_list."));
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
        message.error(t("Warehouse_ID_is_not_available._Please_log_in_again."));
        return;
      }
  
      const response = await fetchDataBearer({
        url: "/store/get-store-shippers",
        method: "GET",
        params: {
          hasDeliveryZone: false,
          filterBy: "StoreId",
          filterQuery: warehouseId,
          pageIndex: 0,
          pageSize: 10,
        },
      });
  
      if (response?.data?.items) {
        setShippersOption(response.data.items);
        message.success(t("Shippers_loaded_successfully_for_selection!"));
      } else {
        setShippersOption([]);
        message.error(t("No_shippers_available_for_selection."));
      }
    } catch (error) {
      console.error(t("Error_fetching_Shippers_for_options:"), error);
      message.error(t("Error_fetching_the_shipper_list_for_selection."));
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
      message.error(t("Warehouse_ID_is_not_available._Please_log_in_again."));
      return;
    }

    const response = await fetchDataBearer({
      url: "/store/get-store-shippers",
      method: "GET",
      params: {
        hasDeliveryZone: true,
        filterBy: "StoreId",
        filterQuery: warehouseId,
        pageIndex: 0,
        pageSize: 10,
      },
    });

    if (response?.data?.items) {
      setShippersOption2(response.data.items);
      message.success(t("Shippers_loaded_successfully_for_changing!"));
    } else {
      setShippersOption2([]);
      message.error(t("No_shippers_available_for_changing."));
    }
  } catch (error) {
    console.error(t("Error_fetching_Shippers_for_changing:"), error);
    message.error(t("Error_fetching_the_shipper_list_for_changing."));
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
      url: `/store/assign-shipper-to-delivery-zone/${shipperId}/${deliveryZoneId}`,
      method: "POST",
    });

    if (response) {
      if (isChangeModalVisible) {
        message.success(t("Shipper_changed_to_Delivery_Zone_successfully!"));
        setIsChangeModalVisible(false);
        formChange.resetFields();
      } else if (isModalVisible) {
        message.success(t("Shipper_assigned_to_Delivery_Zone_successfully!"));
        setIsModalVisible(false);
        form.resetFields();
      }

      fetchShippers(); // Refresh shipper list
    } else {
      if (isChangeModalVisible) {
        message.error(t("Failed_to_change_Shipper_in_Delivery_Zone."));
      } else if (isModalVisible) {
        message.error(t("Failed_to_assign_Shipper_to_Delivery_Zone."));
      }
    }
  } catch (error) {
    console.error(t("Error_assigning_Shipper_to_Delivery_Zone:"), error);

    if (isChangeModalVisible) {
      message.error(
        t("Error_changing_Shipper:") +
          (error.response?.data?.message || t("An_unexpected_error_occurred."))
      );
    } else if (isModalVisible) {
      message.error(
        t("Error_assigning_Shipper:") +
          (error.response?.data?.message || t("An_unexpected_error_occurred."))
      );
    }
  }
};

return (
  <div className="p-[20px] overflow-auto">
    <h1 className="text-4xl font-bold text-gray-800 mb-8">
      {t("Delivery_Zone_Management")}
    </h1>

    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-700">
        {t("Shipper_List")}
      </h2>
      <div className="flex gap-4">
        <Button type="primary" onClick={showModal}>
          {t("Assign_Shipper_To_Delivery_Zone")}
        </Button>
        <Button
          className="bg-green-500 text-white hover:bg-green-600"
          onClick={showChangeModal}
        >
          {t("Change_Shipper_To_Delivery_Zone")}
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
      title: t("Employee_ID"),
      dataIndex: "employeeId",
      key: "employeeId",
      align: "center",
    },
    {
      title: t("Shipper_Name"),
      dataIndex: "shipperName",
      key: "shipperName",
      align: "center",
    },
    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => status || t("N/A"),
    },
    {
      title: t("Delivery_Zone"),
      dataIndex: "deliveryZoneName",
      key: "deliveryZoneName",
      align: "center",
      filters: deliveryZones.map((zone) => ({
        text: zone.name,
        value: zone.name,
      })),
      onFilter: (value, record) => record.deliveryZoneName === value,
      render: (text) => text || t("N/A"),
    },
    {
      title: t("Warehouse1"),
      dataIndex: "warehouseName",
      key: "warehouseName",
      align: "center",
      render: (text) => text || t("N/A"),
    },
  ]}
  locale={{ emptyText: t("No_Data") }}
/>

{/* Modal Assign */}
<Modal
  title={t("Assign_Shipper_To_Delivery_Zone")}
  visible={isModalVisible}
  onCancel={handleCancel}
  onOk={() => form.submit()}
  okText={t("Assign")}
  cancelText={t("Cancel")}
>
  <Form form={form} layout="vertical" onFinish={handleAssign}>
    <Form.Item
      name="shipperId"
      label={t("Shipper")}
      rules={[{ required: true, message: t("Please_select_a_Shipper!") }]}
    >
      <Select placeholder={t("Select_a_Shipper")} loading={loadingShippers}>
        {shippersOption.map((shipper) => (
          <Option key={shipper.employeeId} value={shipper.employeeId}>
            {`${shipper.shipperName} (ID: ${shipper.employeeId})`}
          </Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item
      name="deliveryZoneId"
      label={t("Delivery_Zone")}
      rules={[{ required: true, message: t("Please_select_a_Delivery_Zone!") }]}
    >
      <Select placeholder={t("Select_a_Delivery_Zone")} loading={loading}>
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
  title={t("Change_Shipper_To_Delivery_Zone")}
  visible={isChangeModalVisible}
  onCancel={handleChangeCancel}
  onOk={() => formChange.submit()}
  okText={t("Change")}
  cancelText={t("Cancel")}
>
  <Form form={formChange} layout="vertical" onFinish={handleAssign}>
    <Form.Item
      name="shipperId"
      label={t("Shipper")}
      rules={[{ required: true, message: t("Please_select_a_Shipper!") }]}
    >
      <Select placeholder={t("Select_a_Shipper")} loading={loadingShippers}>
        {shippersOption2.map((shipper) => (
          <Option key={shipper.employeeId} value={shipper.employeeId}>
            {`${shipper.shipperName} (ID: ${shipper.employeeId})`}
          </Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item
      name="deliveryZoneId"
      label={t("Delivery_Zone")}
      rules={[{ required: true, message: t("Please_select_a_Delivery_Zone!") }]}
    >
      <Select placeholder={t("Select_a_Delivery_Zone")} loading={loading}>
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
