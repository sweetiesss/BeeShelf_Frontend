import React, { useEffect, useState } from "react";
import {
  Table,
  InputNumber,
  message,
  Button,
  Input,
  Modal,
  Form,
  Select,
} from "antd";
import useAxios from "../../services/CustomizeAxios";
import { Descriptions } from "antd";
import { t } from "i18next";

import {
  Garage,
  GearSix,
  Motorcycle,
  Tire,
  Truck,
  Van,
} from "@phosphor-icons/react";
const { Option } = Select;

const VehiclePage = () => {
  const { fetchDataBearer } = useAxios();
  const [vehicles, setVehicles] = useState([]);
  const [showVehicles, setShowVehicles] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [warehouseOptions, setWarehouseOptions] = useState([]);

  const [filter, setFilter] = useState({
    storeId: 0,
    status: "",
    type: "",
    sortBy: "",
    descending: true,
    pageIndex: 0,
    pageSize: 10,
  });

  // const [isColdSelected, setIsColdSelected] = useState(null);
  const filteredWarehouses = warehouseOptions
  // .filter(
  //   (warehouse) =>
  //     // isColdSelected === null || warehouse.isCold === isColdSelected
  // );
  const [form] = Form.useForm();
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: `/vehicle/get-vehicles`,
        method: "GET",
        params: {
          ...(filter?.storeId > 0 && { storeId: filter?.storeId }),
          status: filter?.status,
          type: filter?.type,
          sortBy: filter?.sortBy,
          descending: filter?.descending,
          pageIndex: filter?.pageIndex,
          pageSize: filter?.pageSize,
        },
      });
      setVehicles(response?.data);
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
        url: `/store/get-stores`,
        method: "GET",
        params: {
          descending: false,
          pageIndex: 0,
          pageSize: 10,
        },
      });

      if (response && response.status === 200) {
        setWarehouses(response?.data);
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

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [showDropdownId, setShowDropdownId] = useState(null);

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
      storeId: record.storeId,
      isCold: record.isCold,
    });
    setUpdateVisible(true);
  };

  const [detailVisible, setDetailVisible] = useState(false);
  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingDetailId, setLoadingDetailId] = useState(null);

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
          storeId: values.storeId,
          isCold: values.isCold,
          capacity: values.capacity,
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
          storeId: values.storeId,
          isCold: values.isCold,
          capacity: values.capacity,
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

  useEffect(() => {
    const newVehicleList = vehicles?.items?.map((prev) => {
      const warehouse = warehouses?.items?.find(
        (item) => item.id === prev.storeId
      );
      return { ...prev, warehouse: warehouse };
    });

    setShowVehicles({ ...vehicles, items: newVehicleList });
  }, [vehicles, warehouses]);
  useEffect(() => {
    fetchVehicles();
  }, [filter]);
  return (
    <div className="">
      <div className="flex gap-8 items-end mb-10">
        <div className="flex gap-4 items-end">
          <Garage size={32} weight="duotone" className="text-end" />
          <Select
            showSearch
            style={{ width: "12rem", height: "fit-content" }}
            optionFilterProp="label"
            value={filter?.storeId}
            options={[
              {
                value: 0,
                label: "Select store",
              },
              ...(warehouses?.items
                ? warehouses?.items?.map((item) => ({
                    value: item?.id,
                    label: item?.name,
                  }))
                : []),
            ]}
            onChange={(selectOption) => {
              form.setFieldValue({
                type: 0,
                storeId: parseInt(selectOption),
              });
              setFilter((prev) => ({
                ...prev,
                storeId: selectOption,
                pageIndex: 0,
              }));
            }}
          />
        </div>

        <div className="flex gap-4 items-end">
          <GearSix size={32} weight="duotone" className="text-end" />
          <Select
            showSearch
            style={{ width: "12rem" }}
            optionFilterProp="label"
            value={filter?.status}
            options={[
              {
                value: "",
                label: "Select vehicles status",
              },
              {
                value: "Available",
                label: "Available",
              },
              {
                value: "InService",
                label: "InService",
              },
              {
                value: "Repair",
                label: "Repair",
              },
            ]}
            onChange={(selectOption) =>
              setFilter((prev) => ({
                ...prev,
                status: selectOption,
                pageIndex: 0,
              }))
            }
          />
        </div>
        <div className="flex gap-4 items-end">
          {filter?.type === "Motorcycle" && (
            <Motorcycle size={32} weight="duotone" className="text-end" />
          )}
          {filter?.type === "Truck" && (
            <Truck size={32} weight="duotone" className="text-end" />
          )}
          {filter?.type === "Van" && (
            <Van size={32} weight="duotone" className="text-end" />
          )}
          {filter?.type === "" && (
            <Tire size={32} weight="duotone" className="text-end" />
          )}

          <Select
            showSearch
            style={{ width: "12rem" }}
            optionFilterProp="label"
            value={filter?.type}
            options={[
              {
                value: "",
                label: "Select vehicles type",
              },
              {
                value: "Truck",
                label: "Truck",
              },
              {
                value: "Van",
                label: "Van",
              },
              {
                value: "Motorcycle",
                label: "Motorcycle",
              },
            ]}
            onChange={(selectOption) =>
              setFilter((prev) => ({
                ...prev,
                type: selectOption,
                pageIndex: 0,
              }))
            }
          />
        </div>
        <Button
          type="primary"
          onClick={() => {
            form.setFieldsValue({
              type: filter.type || null,
              storeId: filter.storeId || null,
              isCold:
                warehouseOptions.find(
                  (warehouse) => warehouse.id === filter.storeId
                )?.isCold || 0,
            });

            setVisible(true);
          }}
        >
          Create Vehicle
        </Button>
      </div>
      <Modal
        title="Create Vehicle"
        open={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
          // setIsColdSelected(null);
        }}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            Create Vehicle
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={createVehicle}>
          <Form.Item
            label="Vehicle Type"
            name="type"
            rules={[{ required: true, message: "Please select vehicle type!" }]}
          >
            <Select placeholder="Select Vehicle Type">
              <Option value="Truck">Truck</Option>
              <Option value="Van">Van</Option>
              <Option value="Motorcycle">Motorcycle</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Vehicle Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the vehicle name!" },
              {
                validator: (_, value) => {
                  if (!value || value.trim() === "") {
                    return Promise.reject(
                      new Error("Vehicle name cannot be empty or just spaces.")
                    );
                  }
                  if (value.length > 50) {
                    return Promise.reject(
                      new Error("Vehicle name must be 50 characters or fewer.")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Enter Vehicle Name" maxLength={50} />
          </Form.Item>
          <Form.Item
            label="License Plate"
            name="licensePlate"
            rules={[
              { required: true, message: "Please enter the license plate!" },
              {
                validator: (_, value) => {
                  if (!value || value.trim() === "") {
                    return Promise.reject(
                      new Error("License plate cannot be empty or just spaces.")
                    );
                  }
                  if (value.length > 20) {
                    return Promise.reject(
                      new Error("License plate must be 20 characters or fewer.")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Enter License Plate" maxLength={20} />
          </Form.Item>

          <Form.Item
            label="Capacity (kg)"
            name="capacity"
            rules={[
              { required: true, message: "Please enter the capacity!" },
              {
                validator: (_, value) => {
                  if (value === undefined || value === null || value === "") {
                    return Promise.reject(
                      new Error(
                        "Capacity cannot be empty. Please enter a value."
                      )
                    );
                  }
                  if (value <= 0) {
                    return Promise.reject(
                      new Error(
                        "Capacity must be a positive number greater than 0."
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder="Enter capacity in kg"
              min={1}
              step={1}
              style={{ width: "100%" }}
            />
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
              // onChange={(value) => setIsColdSelected(value)} // Cập nhật isColdSelected khi thay đổi
            >
              <Option value={1}>Yes</Option>
              <Option value={0}>No</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Store"
            name="storeId"
            rules={[{ required: true, message: "Please select warehouse!" }]}
          >
            <Select
              placeholder="Select Store"
              // disabled={isColdSelected === null}
              showSearch
              optionFilterProp="children"
            >
              {filteredWarehouses.length > 0 ? (
                filteredWarehouses.map((warehouse) => (
                  <Option key={warehouse.id} value={warehouse.id}>
                    {/* ID: {warehouse.id} -  */}
                    Name: {warehouse.name} -{" "}
                    {warehouse.isCold ? "(Cold Storage)" : "(Non-Cold Storage)"}
                  </Option>
                ))
              ) : (
                <Option disabled>No warehouses available</Option>
              )}
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
          // setIsColdSelected(null);
        }}
        footer={[
          <Button key="back" onClick={() => setUpdateVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            Update Vehicle
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateVehicle}>
          <Form.Item
            label="Vehicle Type"
            name="type"
            rules={[{ required: true, message: "Please select vehicle type!" }]}
          >
            <Select placeholder="Select Vehicle Type">
              <Option value="Truck">Truck</Option>
              <Option value="Van">Van</Option>
              <Option value="Motorcycle">Motorcycle</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Vehicle Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the vehicle name!" },
              {
                validator: (_, value) => {
                  if (!value || value.trim() === "") {
                    return Promise.reject(
                      new Error("Vehicle name cannot be empty or just spaces.")
                    );
                  }
                  if (value.length < 3) {
                    return Promise.reject(
                      new Error(
                        "Vehicle name must be at least 3 characters long."
                      )
                    );
                  }
                  if (value.length > 50) {
                    return Promise.reject(
                      new Error("Vehicle name must be 50 characters or fewer.")
                    );
                  }
                  if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
                    return Promise.reject(
                      new Error(
                        "Vehicle name can only contain letters, numbers, and spaces."
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Enter Vehicle Name" maxLength={50} />
          </Form.Item>
          <Form.Item
            label="License Plate"
            name="licensePlate"
            rules={[
              { required: true, message: "Please enter the license plate!" },
              {
                validator: (_, value) => {
                  if (!value || value.trim() === "") {
                    return Promise.reject(
                      new Error("License plate cannot be empty or just spaces.")
                    );
                  }
                  if (value.length > 20) {
                    return Promise.reject(
                      new Error("License plate must be 20 characters or fewer.")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Enter License Plate" maxLength={20} />
          </Form.Item>

          <Form.Item
            label="Capacity (kg)"
            name="capacity"
            rules={[
              { required: true, message: "Please enter the capacity!" },
              {
                validator: (_, value) => {
                  if (value === undefined || value === null || value === "") {
                    return Promise.reject(
                      new Error(
                        "Capacity cannot be empty. Please enter a value."
                      )
                    );
                  }
                  if (value <= 0) {
                    return Promise.reject(
                      new Error(
                        "Capacity must be a positive number greater than 0."
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder="Enter capacity in kg"
              min={1}
              step={1}
              style={{ width: "100%" }}
            />
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
              // onChange={(value) => setIsColdSelected(value)}
            >
              <Option value={1}>Yes</Option>
              <Option value={0}>No</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Warehouse ID"
            name="storeId"
            rules={[{ required: true, message: "Please select warehouse!" }]}
          >
            <Select
              placeholder="Select Warehouse"
              // disabled={isColdSelected === null}
            >
              {filteredWarehouses.length > 0 ? (
                filteredWarehouses.map((warehouse) => (
                  <Option key={warehouse.id} value={warehouse.id}>
                    ID: {warehouse.id} - Name: {warehouse.name} -{" "}
                    {warehouse.isCold ? "(Cold Storage)" : "(Non-Cold Storage)"}
                  </Option>
                ))
              ) : (
                <Option disabled>No warehouses available</Option>
              )}
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
          <Button key="close" danger onClick={handleCloseDetailModal}>
            Delete
          </Button>,
          <Button key="close" type="primary" onClick={handleCloseDetailModal}>
            Asign
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
            <Descriptions.Item label="Store ID">
              {vehicleDetail.storeId}
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
        dataSource={showVehicles?.items}
        size="large"
        columns={[
          {
            title: "Index",
            key: "index",
            width: 70,
            align: "start",
            render: (text, record, index) =>
              filter?.pageIndex * showVehicles?.pageSize + index + 1,
          },
          {
            title: "Vehicle Name",
            dataIndex: "name",
            key: "name",
            width: 150,
            align: "start",
          },
          {
            title: "Capacity (kg)",
            dataIndex: "capacity",
            key: "capacity",
            width: 150,
            align: "start",
          },
          {
            title: "Frozen",
            dataIndex: "isCold",
            key: "frozen",
            width: 70,
            align: "start",
            render: (text, record) => (record === 1 ? "Frozen" : "Normal"),
          },
          {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 70,
            align: "start",
          },
          {
            title: "Assign to",
            dataIndex: "assignedDriverEmail",
            key: "assignedDriverEmail",
            width: 150,
            align: "start",
            render: (text, record) =>
              record?.assignedDriverEmail ? (
                record?.assignedDriverEmail
              ) : (
                <span className="text-gray-300">{t("NotAssignedYet")}</span>
              ),
          },
          {
            title: "License Plate",
            dataIndex: "licensePlate",
            key: "licensePlate",
            width: 120,
            align: "start",
          },
          {
            title: "Store Name",
            key: "warehouseName",
            width: 200,
            align: "start",
            render: (text, record) => record.warehouse?.name || "Not Available",
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            align: "start",
          },
          {
            title: "Actions",
            key: "actions",
            width: 320,
            align: "start",
            render: (text, record) => (
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  justifyContent: "start",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{ display: "flex", gap: "6px", alignItems: "start" }}
                >
                  {showDropdownId === record?.id ? (
                    <>
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
                          minWidth: "80px",
                          height: "2rem",
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
                          color:
                            record.status === "Repair" ? "#ff4d4f" : "#d9d9d9",
                          borderColor:
                            record.status === "Repair" ? "#ff4d4f" : "#d9d9d9",
                          borderRadius: "5px",
                          padding: "0 8px",
                          minWidth: "80px",
                          height: "2rem",
                          cursor:
                            record.status === "Repair"
                              ? "pointer"
                              : "not-allowed",
                        }}
                      >
                        Delete
                      </Button>
                      <Select
                        placeholder="Select Status"
                        style={{ width: 120 }}
                        onChange={(value) =>
                          setSelectedStatus((prev) => ({
                            ...prev,
                            [record.id]: value,
                          }))
                        }
                        value={selectedStatus[record.id] || null}
                      >
                        <Option value="Available">Available</Option>
                        <Option value="Repair">Repair</Option>
                      </Select>
                      <Button
                        type="default"
                        size="small"
                        onClick={() => handleApproveClick(record)}
                        style={{
                          color: "white",
                          backgroundColor: "#0db977",
                          borderRadius: "5px",
                          height: "2rem",
                          padding: "0 8px",
                          minWidth: "80px",
                        }}
                      >
                        Submit
                      </Button>
                      <Button
                        type="default"
                        size="small"
                        onClick={() => setShowDropdownId()}
                        style={{
                          color: "#6b7280",
                          borderColor: "#6b7280",
                          borderRadius: "5px",
                          height: "2rem",
                          padding: "0 8px",
                          minWidth: "fit-content",
                        }}
                      >
                        X
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="default"
                        size="small"
                        onClick={() => handleVehicleDetail(record)}
                        style={{
                          color: "#848a9f",
                          borderColor: "#848a9f",
                          borderRadius: "5px",
                          height: "2rem",
                          padding: "0 8px",
                          minWidth: "80px",
                        }}
                      >
                        Detail
                      </Button>
                      <Button
                        type="default"
                        size="small"
                        onClick={() => setShowDropdownId(record?.id)}
                        style={{
                          color: "#52c41a",
                          borderColor: "#52c41a",
                          borderRadius: "5px",
                          height: "2rem",
                          padding: "0 8px",
                          minWidth: "80px",
                        }}
                      >
                        {t("Edit")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ),
          },
        ]}
        rowKey="id"
        loading={loading}
        pagination={{
          current: vehicles?.pageIndex + 1,
          pageSize: vehicles?.pageSize,
          total: vehicles?.totalItemsCount,
          onChange: (page, pageSize) => {
            setFilter((prev) => ({ ...prev, pageIndex: page - 1, pageSize }));
          },
        }}
      />
    </div>
  );
};

export default VehiclePage;
