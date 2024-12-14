import React, { useEffect, useState } from "react";
import { Table, message, Button, Input, Modal, Form, Select } from "antd";
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

  // State cho danh sách vehicles
  const [vehicles, setVehicles] = useState([]);
  const [showVehicles, setShowVehicles] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho modal tạo vehicle
  const [visible, setVisible] = useState(false);
  const [warehouseOptions, setWarehouseOptions] = useState([]);

  const [filter, setFilter] = useState({
    warehouseId: 0,
    status: "",
    type: "",
    sortBy: "",
    descending: false,
    pageIndex: 0,
    pageSize: 10,
  });

  // Form instance
  const [form] = Form.useForm();

  // Hàm fetch danh sách vehicles từ API
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: `/vehicle/get-vehicles`,
        method: "GET",
        params: {
          ...(filter?.warehouseId > 0 && { warehouseId: filter?.warehouseId }),
          status: filter?.status,
          type: filter?.type,
          sortBy: filter?.sortBy,
          descending: filter?.descending,
          pageIndex: filter?.pageIndex,
          pageSize: filter?.pageSize,
        },
      });
      console.log("vehicles", response);
      setVehicles(response?.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      message.error("Failed to fetch vehicles.");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm fetch danh sách warehouses từ API
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

  // const [selectedStatus, setSelectedStatus] = useState(null);
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
        fetchVehicles(); // Refresh danh sách sau khi approve thành công
        setShowDropdownId(null); // Ẩn dropdown
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

  // Hàm mở modal và gán dữ liệu vehicle cần update
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
  //Hàm xử lí detail:
  const [detailVisible, setDetailVisible] = useState(false);
  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingDetailId, setLoadingDetailId] = useState(null);
  //Hàm xử lí cho Approve Status
  // const [showDropdownId, setShowDropdownId] = useState(null);
  // const handleStatusChange = (id, status) => {
  //   setSelectedStatus((prev) => ({ ...prev, [id]: status }));
  // };

  // Hàm mở modal và fetch chi tiết vehicle
  const handleVehicleDetail = async (record) => {
    // setLoadingDetail(record.id);
    setLoadingDetailId(record.id); // Set loading cho dòng cụ thể
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
      //   setLoadingDetail(null);
      setLoadingDetailId(null);
    }
  };

  // Hàm đóng modal
  const handleCloseDetailModal = () => {
    setDetailVisible(false);
    setVehicleDetail(null);
  };

  // Hàm cập nhật vehicle
  const handleUpdateVehicle = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);
      console.log("Selected Vehicle:", selectedVehicle);
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
        fetchVehicles(); // Refresh the vehicle list
        form.resetFields();
      } else {
        message.error(response?.data?.message || "Failed to update vehicle.");
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      message.error("duplicate license plates");
    }
  };
  // Hàm Delete vehicle:
  const handleDeleteVehicle = async (record) => {
    try {
      const response = await fetchDataBearer({
        url: `/vehicle/delete-vehicle/${record.id}`,
        method: "DELETE",
      });

      if (response && response.status === 200) {
        message.success("Vehicle deleted successfully!");
        fetchVehicles(); // Refresh the vehicle list
      } else {
        message.error(response?.data?.message || "Failed to delete vehicle.");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      message.error("Something went wrong!");
    }
  };

  // Hàm tạo vehicle
  const createVehicle = async () => {
    try {
      const values = await form.validateFields(); // Lấy dữ liệu từ form sau khi validate

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
        form.resetFields(); // Reset form sau khi tạo thành công
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

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchVehicles();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    const newVehicleList = vehicles?.items?.map((prev) => {
      const warehouse = warehouses?.items?.find(
        (item) => item.id === prev.warehouseId
      );
      return { ...prev, warehouse: warehouse };
    });
    setShowVehicles(newVehicleList);
  }, [vehicles, warehouses]);
  useEffect(() => {
    fetchVehicles();
  }, [filter]);

  console.log("vehicles", vehicles);
  console.log("showVehicles", showVehicles);
  console.log("warehouses", warehouses);
  console.log(form.getFieldValue());

  return (
    <div className="">
      <div className="flex gap-8 items-end mb-10">
        <div className="flex gap-4 items-end">
          <Garage size={32} weight="duotone" className="text-end" />
          <Select
            showSearch
            style={{ width: "12rem", height: "fit-content" }}
            optionFilterProp="label"
            value={filter?.warehouseId}
            options={[
              {
                value: 0,
                label: "Select warehouses",
              },
              ...(warehouses?.items
                ? warehouses?.items?.map((item) => ({
                    value: item?.id,
                    label: item?.name,
                  }))
                : []),
            ]}
            onChange={(selectOption) => {
              console.log("selectedOption", selectOption);

              form.setFieldValue({
                type: 0,
                warehouseId: parseInt(selectOption),
              });

              console.log("Form Values After Setting:", form.getFieldsValue());
              setFilter((prev) => ({ ...prev, warehouseId: selectOption }));
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
              setFilter((prev) => ({ ...prev, status: selectOption }))
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
              setFilter((prev) => ({ ...prev, type: selectOption }))
            }
          />
        </div>
        <Button
          type="primary"
          onClick={() => {
            form.setFieldsValue({
              type: filter.type !== "" ? filter.type : null,
              warehouseId: filter.warehouseId > 0 ? filter.warehouseId : null, // Set filtered warehouseId or reset to null
              isCold: warehouseOptions.find(
                (warehouse) => warehouse.id === filter.warehouseId
              )?.isCold
                ? 1
                : 0, // Set `isCold` based on the selected warehouse, default to 0 if not found
            });
            setVisible(true); // Show modal
          }}
        >
          Create Vehicle
        </Button>
      </div>

      {/* Modal tạo vehicle */}
      <Modal
        title="Create Vehicle"
        open={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields(); // Reset form khi đóng modal
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
          {/* Vehicle Type */}
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

          {/* Vehicle Name */}
          <Form.Item
            label="Vehicle Name"
            name="name"
            rules={[{ required: true, message: "Please enter vehicle name!" }]}
          >
            <Input placeholder="Enter Vehicle Name" />
          </Form.Item>

          {/* License Plate */}
          <Form.Item
            label="License Plate"
            name="licensePlate"
            rules={[{ required: true, message: "Please enter license plate!" }]}
          >
            <Input placeholder="Enter License Plate" />
          </Form.Item>

          {/* Warehouse ID */}
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

                // Set isCold based on selected warehouse
                form.setFieldsValue({
                  isCold: selectedWarehouse.isCold ? 1 : 0,
                });
              }}
            >
              <Option key={0} value={"Select warehouse"}></Option>
              {warehouseOptions.map((warehouse) => (
                <Option key={warehouse.id} value={warehouse.id}>
                  ID: {warehouse.id} - Name: {warehouse.name} -{" "}
                  {warehouse.isCold ? "(Cold Storage)" : "(Non-Cold Storage)"}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Is Cold Storage? */}
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
              disabled={true} // Luôn disable để không cho phép người dùng thay đổi
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

      {/* Bảng hiển thị vehicles */}
      <Table
        dataSource={showVehicles}
        size="large"
        columns={[
          {
            title: "Index",
            key: "index",
            width: 70,
            align: "start",
            render: (text, record, index) => index + 1,
          },
          {
            title: "Vehicle Name",
            dataIndex: "name",
            key: "name",
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
            title: "WarehouseName",
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
                {/* Nút Vehicle Detail */}

                {/* Dropdown và Button Approve */}
                <div
                  style={{ display: "flex", gap: "6px", alignItems: "start" }}
                >
                  {showDropdownId === record?.id ? (
                    <>
                      {" "}
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
                        <Option value="InService">InService</Option>
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
