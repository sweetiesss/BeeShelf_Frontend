import React, { useEffect, useState } from "react";
import { Table, message, Button, Input, Modal, Form, Select } from "antd";
import useAxios from "../../../services/CustomizeAxios";
import { Descriptions } from "antd";

const { Option } = Select;

const VehicleManage = () => {
  const { fetchDataBearer } = useAxios();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [showDropdownId, setShowDropdownId] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingDetailId, setLoadingDetailId] = useState(null);
  const [form] = Form.useForm();
  const fetchVehicles = async () => {
    setLoading(true);
    let allVehicles = [];
    let currentPage = 0;
    const pageSize = 10;

    try {
      while (true) {
        const response = await fetchDataBearer({
          url: `/vehicle/get-vehicles`,
          method: "GET",
          params: {
            descending: false,
            pageIndex: currentPage,
            pageSize: pageSize,
          },
        });

        if (response && response.data.items.length > 0) {
          allVehicles = [...allVehicles, ...response.data.items];
          currentPage += 1;
        } else {
          break;
        }
      }

      setVehicles(allVehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      message.error("Failed to fetch vehicles.");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchWarehouses = async () => {
    try {
      const response = await fetchDataBearer({
        url: `/warehouse/get-warehouses`,
        method: "GET",
        params: {
          descending: false,
          pageIndex: 0,
          pageSize: 10,
        },
      });

      if (response && response.status === 200) {
        const options = response.data.items.map((warehouse) => ({
          id: warehouse.id,
          name: warehouse.name,
          isCold: warehouse.isCold,
        }));
        setWarehouseOptions(options);
      } else {
        message.error("Failed to fetch warehouses.");
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      message.error("Error fetching warehouses.");
    }
  };

  const handleApproveClick = (record) => {
    if (!record) {
      message.error("Invalid record.");
      return;
    }

    if (selectedStatus[record.id]) {
      handleApproveVehicle(record, selectedStatus[record.id]);
      setSelectedStatus((prev) => ({ ...prev, [record.id]: null }));
      setShowDropdownId(null);
    } else {
      message.warning("Please select a status before approving.");
    }
  };

  const handleApproveVehicle = async (record, status) => {
    try {
      const response = await fetchDataBearer({
        url: `/vehicle/update-vehicle-status/${record.id}`,
        method: "PUT",
        params: {
          status: status,
        },
      });

      if (response && response.status === 200) {
        message.success(
          `Vehicle ID: ${record.id} has been approved with status: ${status}`
        );
        fetchVehicles();
        setShowDropdownId(null); 
      } else {
        const errorData = await response?.data;
        message.error(
          `Failed to approve vehicle: ${errorData?.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error approving vehicle:", error);
      message.error("Something went wrong!");
    }
  };
  const openUpdateModal = (record) => {
    setSelectedVehicle(record);
    form.setFieldsValue({
      type: record.type,
      name: record.name,
      licensePlate: record.licensePlate,
      warehouseId: record.warehouseId,
      isCold: record.isCold,
    });
    setUpdateVisible(true);
  };
 
  const handleVehicleDetail = async (record) => {
    setLoadingDetailId(record.id); 
    try {
      const response = await fetchDataBearer({
        url: `/vehicle/get-vehicle/${record.id}`,
        method: "GET",
      });

      if (response && response.status === 200) {
        setVehicleDetail(response.data);
        setDetailVisible(true);
      } else {
        message.error(
          response?.data?.message || "Failed to fetch vehicle details."
        );
      }
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      message.error("Something went wrong while fetching vehicle details!");
    } finally {
      setLoadingDetailId(null);
    }
  };
  const handleCloseDetailModal = () => {
    setDetailVisible(false);
    setVehicleDetail(null);
  };
  const handleUpdateVehicle = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetchDataBearer({
        url: `/vehicle/update-vehicle/${selectedVehicle.id}`,
        method: "PUT",
        params: {
          type: values.type,
        },
        data: {
          name: values.name,
          licensePlate: values.licensePlate,
          warehouseId: values.warehouseId,
          isCold: values.isCold,
        },
      });

      if (response && response.status === 200) {
        message.success("Vehicle updated successfully!");
        setUpdateVisible(false);
        fetchVehicles();
        form.resetFields();
      } else {
        message.error(response?.data?.message || "Failed to update vehicle.");
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      message.error("duplicate license plates");
    }
  };
  const handleDeleteVehicle = async (record) => {
    try {
      const response = await fetchDataBearer({
        url: `/vehicle/delete-vehicle/${record.id}`,
        method: "DELETE",
      });

      if (response && response.status === 200) {
        message.success("Vehicle deleted successfully!");
        fetchVehicles();
      } else {
        message.error(response?.data?.message || "Failed to delete vehicle.");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      message.error("Something went wrong!");
    }
  };
  const createVehicle = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);

      const response = await fetchDataBearer({
        url: `/vehicle/create-vehicle/?type=${values.type}`,
        method: "POST",
        data: {
          name: values.name,
          licensePlate: values.licensePlate,
          warehouseId: values.warehouseId,
          isCold: values.isCold,
        },
      });

      if (response && response.status === 200) {
        message.success("Vehicle created successfully!");
        fetchVehicles();
        setVisible(false);
        form.resetFields();
      } else {
        const errorMessage =
          response?.data?.message || "Failed to create vehicle.";
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating vehicle:", error);
      message.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVehicles();
    fetchWarehouses();
  }, []);

  return (
    <div className="p-[20px]">
      <Button
        type="primary"
        onClick={() => setVisible(true)}
        style={{ marginBottom: 20 }}
      >
        Create Vehicle
      </Button>

      <h1>Vehicle List</h1>
      <Modal
        title="Create Vehicle"
        open={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={createVehicle}
          >
            Create Vehicle
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">

          <Form.Item
            label="Vehicle Type"
            name="type"
            rules={[{ required: true, message: "Please select vehicle type!" }]}
          >
            <Select placeholder="Select Vehicle Type">
              <Option value="Truck">Truck</Option>
              <Option value="Van">Van</Option>
              <Option value="Motorbike">Motorbike</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Vehicle Name"
            name="name"
            rules={[{ required: true, message: "Please enter vehicle name!" }]}
          >
            <Input placeholder="Enter Vehicle Name" />
          </Form.Item>
          <Form.Item
            label="License Plate"
            name="licensePlate"
            rules={[{ required: true, message: "Please enter license plate!" }]}
          >
            <Input placeholder="Enter License Plate" />
          </Form.Item>
          <Form.Item
            label="Warehouse ID"
            name="warehouseId"
            rules={[{ required: true, message: "Please select warehouse!" }]}
          >
            <Select
              placeholder="Select Warehouse"
              onChange={(value) => {
                const selectedWarehouse = warehouseOptions.find(
                  (warehouse) => warehouse.id === value
                );
                form.setFieldsValue({
                  isCold: selectedWarehouse.isCold ? 1 : 0,
                });
              }}
            >
              {warehouseOptions.map((warehouse) => (
                <Option key={warehouse.id} value={warehouse.id}>
                  ID: {warehouse.id} - Name: {warehouse.name} -{" "}
                  {warehouse.isCold ? "(Cold Storage)" : "(Non-Cold Storage)"}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Is Cold Storage?"
            name="isCold"
            rules={[
              { required: true, message: "Please select cold storage option!" },
            ]}
          >
            <Select placeholder="Select Option" disabled>
              <Option value={1}>Yes</Option>
              <Option value={0}>No</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update Vehicle"
        open={updateVisible}
        onCancel={() => {
          setUpdateVisible(false);
          form.resetFields();
        }}
        footer={[
          <Button key="back" onClick={() => setUpdateVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleUpdateVehicle}
          >
            Update Vehicle
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Vehicle Type"
            name="type"
            rules={[{ required: true, message: "Please select vehicle type!" }]}
          >
            <Select placeholder="Select Vehicle Type">
              <Option value="Truck">Truck</Option>
              <Option value="Van">Van</Option>
              <Option value="Motorbike">Motorbike</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Vehicle Name"
            name="name"
            rules={[{ required: true, message: "Please enter vehicle name!" }]}
          >
            <Input placeholder="Enter Vehicle Name" />
          </Form.Item>

          <Form.Item
            label="License Plate"
            name="licensePlate"
            rules={[{ required: true, message: "Please enter license plate!" }]}
          >
            <Input placeholder="Enter License Plate" />
          </Form.Item>

          <Form.Item
            label="Warehouse ID"
            name="warehouseId"
            rules={[{ required: true, message: "Please select warehouse!" }]}
          >
            <Select
              placeholder="Select Warehouse"
              onChange={(value) => {
                const selectedWarehouse = warehouseOptions.find(
                  (warehouse) => warehouse.id === value
                );
                form.setFieldsValue({
                  isCold: selectedWarehouse.isCold ? 1 : 0,
                });
              }}
            >
              {warehouseOptions.map((warehouse) => (
                <Option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}{" "}
                  {warehouse.isCold ? "(Cold Storage)" : "(Non-Cold Storage)"}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Is Cold Storage?"
            name="isCold"
            rules={[
              { required: true, message: "Please select cold storage option!" },
            ]}
          >
            <Select
              placeholder="Select Option"
              disabled={true}
            >
              <Option value={1}>Yes</Option>
              <Option value={0}>No</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Vehicle Details"
        open={detailVisible}
        onCancel={handleCloseDetailModal}
        footer={[
          <Button key="close" onClick={handleCloseDetailModal}>
            Close
          </Button>,
        ]}
      >
        {vehicleDetail ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{vehicleDetail.id}</Descriptions.Item>
            <Descriptions.Item label="Name">
              {vehicleDetail.name}
            </Descriptions.Item>
            <Descriptions.Item label="License Plate">
              {vehicleDetail.licensePlate}
            </Descriptions.Item>
            <Descriptions.Item label="Capacity">
              {vehicleDetail.capacity}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {vehicleDetail.type}
            </Descriptions.Item>
            <Descriptions.Item label="Is Cold Storage?">
              {vehicleDetail.isCold ? "Yes" : "No"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {vehicleDetail.status}
            </Descriptions.Item>
            <Descriptions.Item label="Warehouse ID">
              {vehicleDetail.warehouseId}
            </Descriptions.Item>
            <Descriptions.Item label="Assigned Driver ID">
              {vehicleDetail.assignedDriverId ?? "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Assigned Driver Email">
              {vehicleDetail.assignedDriverEmail ?? "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Assigned Driver Name">
              {vehicleDetail.assignedDriverName ?? "N/A"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Loading vehicle details...</p>
        )}
      </Modal>
      <Table
        dataSource={vehicles}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 70,
            align: "center",
          },
          {
            title: "Vehicle Name",
            dataIndex: "name",
            key: "name",
            width: 150,
            align: "center",
          },
          {
            title: "License Plate",
            dataIndex: "licensePlate",
            key: "licensePlate",
            width: 120,
            align: "center",
          },
          {
            title: "Warehouse ID",
            dataIndex: "warehouseId",
            key: "warehouseId",
            width: 120,
            align: "center",
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            align: "center",
          },
          {
            title: "Actions",
            key: "actions",
            width: 350,
            align: "center",
            render: (text, record) => (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  type="default"
                  size="small"
                  onClick={() => handleVehicleDetail(record)}
                  style={{
                    color: "#52c41a",
                    borderColor: "#52c41a",
                    borderRadius: "5px",
                    padding: "0 8px",
                    minWidth: "85px",
                  }}
                >
                  Detail
                </Button>
                <Button
                  type="default"
                  size="small"
                  onClick={() => openUpdateModal(record)}
                  disabled={
                    record.status === "InService" ||
                    record.status === "Available"
                  }
                  style={{
                    color:
                      record.status === "InService" ||
                      record.status === "Available"
                        ? "#d9d9d9"
                        : "#1890ff",
                    borderColor:
                      record.status === "InService" ||
                      record.status === "Available"
                        ? "#d9d9d9"
                        : "#1890ff",
                    borderRadius: "5px",
                    padding: "0 8px",
                    minWidth: "85px",
                    cursor:
                      record.status === "InService" ||
                      record.status === "Available"
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Update
                </Button>
                <Button
                  type="default"
                  size="small"
                  onClick={() => handleDeleteVehicle(record)}
                  disabled={record.status !== "Repair"}
                  style={{
                    color: record.status === "Repair" ? "#ff4d4f" : "#d9d9d9",
                    borderColor:
                      record.status === "Repair" ? "#ff4d4f" : "#d9d9d9",
                    borderRadius: "5px",
                    padding: "0 8px",
                    minWidth: "85px",
                    cursor:
                      record.status === "Repair" ? "pointer" : "not-allowed",
                  }}
                >
                  Delete
                </Button>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  {showDropdownId === record?.id && (
                    <Select
                      placeholder="Select Status"
                      style={{ width: 130 }}
                      onChange={(value) =>
                        setSelectedStatus((prev) => ({
                          ...prev,
                          [record.id]: value,
                        }))
                      }
                      value={selectedStatus[record.id] || null}
                    >
                      <Option value="Available">Available</Option>
                      <Option value="InService">InService</Option>
                      <Option value="Repair">Repair</Option>
                    </Select>
                  )}

                  <Button
                    type="default"
                    size="small"
                    onClick={() => {
                      if (showDropdownId === record?.id) {
                        handleApproveClick(record);
                      } else {
                        setShowDropdownId(record?.id);
                      }
                    }}
                    style={{
                      color: "#52c41a",
                      borderColor: "#52c41a",
                      borderRadius: "5px",
                      padding: "0 8px",
                      minWidth: "85px",
                    }}
                  >
                    {showDropdownId === record?.id ? "Submit" : "Approve"}
                  </Button>
                </div>
              </div>
            ),
          },
        ]}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default VehicleManage;
