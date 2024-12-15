import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Popconfirm,
  Form,
  Button,
  Space,
  Modal,
  Drawer,
  Descriptions,
  Select,
  Checkbox,
} from "antd";
import AxiosWarehouse from "../../services/Warehouse";
import AxiosEmployee from "../../services/Employee";
import AxiosInventory from "../../services/Inventory";
import AxiosOthers from "../../services/Others";
const { Option } = Select;
export default function WarehousesPage() {
  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState([]); // Warehouse data
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [editingKey, setEditingKey] = useState(""); // Track the editing key
  const {
    getWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouseById,
    getWarehouseById,
    assignStaff,
    assignShipper,
  } = AxiosWarehouse(); // API calls
  const { getEmployees } = AxiosEmployee();
  const { createInventory } = AxiosInventory();
  const { getProvinces } = AxiosOthers();
  const [search, setSearch] = useState(); // Search term
  const [sortCriteria, setSortCriteria] = useState(); // Search term
  const [descending, setDescending] = useState(false); // Sort order

  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // Modal visibility

  const [isDrawerVisible, setIsDrawerVisible] = useState(false); // Drawer visibility

  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [shipperList, setShipperList] = useState([]);
  const [assignWarehouseId, setAssignWarehouseId] = useState(null); // Selected warehouse for assignment
  const [selectedWarehouse, setSelectedWarehouse] = useState();
  const [selectedStaff, setSelectedStaff] = useState();
  const [selectedShippers, setSelectedShippers] = useState();
  const [warehouseListSelection, setWarehouseListSelection] = useState();

  const [isCreateInventoryModalVisible, setIsCreateInventoryModalVisible] =
    useState(false);
  const [newInventory, setNewInventory] = useState({
    name: "",
    maxWeight: 0,
    price: 0,
    weight: 0,
    warehouseId: 0,
  });

  const [newWarehouse, setNewWarehouse] = useState({
    id: 0,
    name: "",
    capacity: "",
    location: "",
    isCold: 0,
    provinceId: 0,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (warehouses && warehouses.length > 0) fetchEmployeeList();
  }, [warehouses]);

  useEffect(() => {
    fetchWarehousesList();
  }, [pagination.pageIndex, pagination.pageSize, search, descending]);

  useEffect(() => {
    fetchBeginData();
  }, []);

  const fetchBeginData = async () => {
    const result = await getWarehouses(
      undefined,
      undefined, // Example sort by name
      undefined,
      0,
      1000
    );
    if (result?.status === 200) {
      const { items, totalItemsCount, totalPagesCount } = result.data;
      setWarehouseListSelection(
        items.map((ware) => ({
          label: ware.name + "-" + ware.location,
          value: ware.id,
        }))
      );
    }
    const result2 = await getProvinces();
    if (result2?.status === 200) {
      setProvinces(result2?.data);
    }
  };
  // Fetch warehouse list
  const fetchWarehousesList = async () => {
    try {
      setLoading(true);
      const result = await getWarehouses(
        search,
        sortCriteria, // Example sort by name
        descending,
        pagination.pageIndex,
        pagination.pageSize
      );

      if (result?.status === 200) {
        const { items, totalItemsCount, totalPagesCount } = result.data;
        setWarehouses(items.map((item) => ({ ...item, key: item.id }))); // Add key for table rows
        setPagination((prev) => ({
          ...prev,
          totalItems: totalItemsCount,
          totalPages: totalPagesCount,
        }));
      }
    } catch (e) {
      console.error("Failed to fetch warehouses:", e);
    } finally {
      setLoading(false);
    }
  };
  const fetchEmployeeList = async () => {
    try {
      setLoading(true);
      const result = await getEmployees(
        undefined,
        undefined,
        undefined, // Example sort by name
        descending,
        0,
        1000
      );
      console.log("employeeList", result);

      if (result?.status === 200) {
        setEmployeeList(result?.data);
        const filterEmptyEmployee = result?.data?.items?.filter(
          (item) => item.workAtWarehouseId === null
        );
        console.log("filterEmptyEmployee", filterEmptyEmployee);
        const staffListFiltered = filterEmptyEmployee.filter(
          (staff) => staff.roleName === "Staff"
        );
        const shipperListFiltered = filterEmptyEmployee.filter(
          (shipper) => shipper.roleName === "Shipper"
        );
        setStaffList(
          staffListFiltered.map((staff) => ({
            label: staff.email + "-" + staff.firstName,
            value: staff.id,
          }))
        );
        setShipperList(
          shipperListFiltered.map((shipper) => ({
            label: shipper.email + "-" + shipper.firstName,
            value: shipper.id,
          }))
        );
        console.log("res", result?.data?.items);
        const assignedWarehouseIds = new Set(
          result?.data?.items
            ?.filter((employee) => employee.workAtWarehouseId !== null)
            .map((employee) => employee.workAtWarehouseId)
        );
        console.log("warehouses", warehouses);
        console.log("assignedWarehouseIds", assignedWarehouseIds);

        console.log(warehouseListSelection);

        // const unassignedWarehouses = warehouseListSelection.filter(
        //   (warehouse) => !assignedWarehouseIds.has(warehouse.value)
        // );
        console.log("unassignedWarehouses", warehouseListSelection);

        setWarehouseList(warehouseListSelection);
      }
    } catch (e) {
      console.error("Failed to fetch warehouses:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpen = () => setIsModalVisible(true);
  const handleModalClose = () => {
    setNewWarehouse({
      id: 0,
      name: "",
      capacity: "",
      location: "",
      isCold: 0,
      provinceId: 0,
    });
    setIsModalVisible(false);
    setIsUpdateModalVisible(false);
  };

  // Handle Assign Staff
  const handleAssignStaff = async () => {
    try {
      console.log("selectedWarehouse", selectedWarehouse);
      console.log("selectedStaff", selectedStaff);
      console.log("selectedShippers", selectedShippers);

      console.log(!selectedStaff);

      if (
        !assignWarehouseId &&
        selectedShippers.length === 0 &&
        selectedStaff.length === 0
      ) {
        console.error("Required parameters are missing.");
        return;
      }
      const submitShipper = selectedShippers?.map((ship) => ({
        employeeId: ship,
        warehouseId: assignWarehouseId,
      }));

      console.log("submitShipper", submitShipper);
      console.log(selectedStaff);
      const submitSelectStaff = selectedStaff?.map((item) => ({
        employeeId: item,
        warehouseId: assignWarehouseId,
      }));

      let checkrefresh = false;
      console.log("submitSelectStaff", submitSelectStaff);
      if (submitSelectStaff.length > 0) {
        const result1 = await assignStaff(submitSelectStaff);
        console.log(result1);
        if (result1?.status === 200) checkrefresh = true;
      }
      if (selectedShippers.length > 0) {
        const result2 = await assignShipper(submitShipper);
        console.log(result2);
        if (result2?.status === 200) checkrefresh = true;
      }
      if (checkrefresh === true) {
        setIsAssignModalVisible(false);
        fetchWarehousesList();
      }

      setAssignWarehouseId();
      setSelectedStaff();
      setSelectedShippers([]);
    } catch (e) {
      console.error("Failed to assign staff:", e);
    }
  };

  // Open Assign Modal
  const openAssignModal = () => {
    setSelectedStaff();
    setIsAssignModalVisible(true);
  };

  // Close Assign Modal
  const closeAssignModal = () => {
    setIsAssignModalVisible(false);
    setSelectedStaff();
  };

  // Handle create warehouse
  const handleCreateWarehouse = async () => {
    try {
      await createWarehouse(newWarehouse);
      handleModalClose();
      fetchWarehousesList(); // Refresh list after creation
    } catch (error) {
      console.error("Failed to create warehouse:", error);
    }
  };

  // Handle input changes for the new inventory
  const handleInventoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewInventory((prev) => ({ ...prev, [name]: value }));
  };

  // Handle warehouse selection for inventory creation
  const handleWarehouseSelection = (value) => {
    setNewInventory((prev) => ({ ...prev, warehouseId: value }));
  };

  // Open Inventory Modal
  const openInventoryModal = () => {
    setNewInventory({ warehouseId: null, productName: "", quantity: 0 });
    setIsCreateInventoryModalVisible(true);
  };

  // Close Inventory Modal
  const closeInventoryModal = () => {
    setIsCreateInventoryModalVisible(false);
  };

  // Handle Inventory Creation
  const handleCreateInventory = async () => {
    try {
      if (
        !newInventory.warehouseId ||
        !newInventory.name ||
        !newInventory.maxWeight
      ) {
        console.error("Please fill all required fields.");
        console.log(newInventory.warehouseId);
        console.log(newInventory.name);
        console.log(newInventory.maxWeight);
        return;
      }

      const result = await createInventory(newInventory); // Call the API
      if (result?.status === 200) {
        fetchWarehousesList(); // Refresh list
        closeInventoryModal();
      }
    } catch (error) {
      console.error("Failed to create inventory:", error);
    }
  };

  // Handle input changes for new warehouse
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWarehouse((prev) => ({ ...prev, [name]: value }));
  };
  const handleProvinceChange = (value) => {
    setNewWarehouse((prev) => ({ ...prev, provinceId: value }));
  };
  const handleIsColdChange = (e) => {
    setNewWarehouse((prev) => ({ ...prev, isCold: e.target.checked ? 1 : 0 }));
  };

  // Save updated data
  const handleUpdateWarehouse = async () => {
    try {
      const resut = await updateWarehouse(newWarehouse?.id, newWarehouse);
      if (resut?.status === 200) {
        handleModalClose();
        fetchWarehousesList();
      }
    } catch (error) {
      console.error("Failed to create warehouse:", error);
    }
  };

  // Edit row
  const edit = (record) => {
    setIsUpdateModalVisible(true);
    const parts = record?.location.split(",");

    parts.pop();

    const updatedLocation = parts.join(",").trim();

    setNewWarehouse({
      id: record?.id,
      name: record?.name,
      capacity: record?.capacity,
      location: updatedLocation,
      isCold: record?.isCold,
      provinceId: record?.provinceId,
    });
  };

  // Delete row
  const handleDelete = async (id) => {
    try {
      const resut = await deleteWarehouseById(id);
      if (resut?.status === 200) {
        fetchWarehousesList();
      }
    } catch (error) {
      console.error("Failed to create warehouse:", error);
    }
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      editable: true,
    },
    {
      title: "isCold",
      dataIndex: "isCold",
      editable: true,
      render: (_, record) => (record?.isCold === 1 ? "Cold" : "Normal"),
    },
    {
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Create Date",
      dataIndex: "createDate",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <Space>
            <Button
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              type="link"
            >
              Edit
            </Button>

            <Button onClick={() => openDetailsDrawer(record.key)} type="link">
              View Details
            </Button>

            <Popconfirm
              title="Are you sure to delete this warehouse?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // Merge columns with editable behavior
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "weight" || col.dataIndex === "maxWeight"
            ? "number"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });

  // Open details drawer
  const openDetailsDrawer = async (id) => {
    try {
      const result = await getWarehouseById(id);
      if (result?.status === 200) {
        setSelectedWarehouse(result.data);
        setIsDrawerVisible(true);
      }
    } catch (e) {
      console.error("Failed to fetch warehouse details:", e);
    }
  };

  // Close details drawer
  const closeDetailsDrawer = () => {
    setIsDrawerVisible(false);
    setSelectedWarehouse(null);
  };

  return (
    <>
      <Form form={form} component={false}>
        <div style={{ marginBottom: "16px" }}>
          <Input.Search
            placeholder="Search warehouses"
            allowClear
            onSearch={(value) => setSearch(value)}
            style={{ width: "300px", marginRight: "16px" }}
          />
          <Button type="primary" onClick={handleModalOpen}>
            Add Warehouse
          </Button>
          <Button type="primary" onClick={openAssignModal}>
            Assign Employee
          </Button>
          <Button type="primary" onClick={openInventoryModal}>
            Create Inventory
          </Button>
        </div>
        <Table
          bordered
          dataSource={warehouses}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            current: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
            total: pagination.totalItems,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                pageIndex: page - 1,
                pageSize,
              }));
            },
          }}
          loading={loading}
        />
      </Form>
      <Modal
        title="Add Warehouse"
        visible={isModalVisible}
        onCancel={handleModalClose}
        onOk={handleCreateWarehouse}
        okText="Create"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Warehouse Name" required>
            <Input
              name="name"
              value={newWarehouse.name}
              onChange={handleInputChange}
              placeholder="Enter warehouse name"
            />
          </Form.Item>
          <Form.Item label="Capacity" required>
            <Input
              name="capacity"
              value={newWarehouse.capacity}
              onChange={handleInputChange}
              placeholder="Enter capacity"
              type="number"
            />
          </Form.Item>
          <Form.Item label="Address">
            <Space.Compact style={{ width: "100%" }}>
              <Form.Item style={{ width: "60%" }} required>
                <Input
                  name="location"
                  value={newWarehouse.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              </Form.Item>
              <Form.Item style={{ width: "40%" }} required>
                <Select
                  name="provinceId"
                  onChange={handleProvinceChange}
                  value={newWarehouse?.provinceId}
                  placeholder="Select Province"
                >
                  {provinces?.map((item) => (
                    <Option value={item?.id}>{item?.subDivisionName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Space.Compact>
          </Form.Item>
          <Form.Item>
            <span> Is Cold Storage? </span>
            <Checkbox
              checked={newWarehouse.isCold === 1}
              onChange={handleIsColdChange}
            >
              Yes
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Update Warehouse"
        visible={isUpdateModalVisible}
        onCancel={handleModalClose}
        onOk={handleUpdateWarehouse}
        okText="Create"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Warehouse Name" required>
            <Input
              name="name"
              value={newWarehouse.name}
              onChange={handleInputChange}
              placeholder="Enter warehouse name"
            />
          </Form.Item>
          <Form.Item label="Capacity" required>
            <Input
              name="capacity"
              value={newWarehouse.capacity}
              onChange={handleInputChange}
              placeholder="Enter capacity"
              type="number"
            />
          </Form.Item>
          <Form.Item label="Address">
            <Space.Compact style={{ width: "100%" }}>
              <Form.Item style={{ width: "60%" }} required>
                <Input
                  name="location"
                  value={newWarehouse.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              </Form.Item>
              <Form.Item style={{ width: "40%" }} required>
                <Select
                  name="provinceId"
                  onChange={handleProvinceChange}
                  value={newWarehouse?.provinceId}
                  placeholder="Select Province"
                >
                  {provinces?.map((item) => (
                    <Option value={item?.id}>{item?.subDivisionName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Space.Compact>
          </Form.Item>
          <Form.Item>
            <span> Is Cold Storage? </span>
            <Checkbox
              checked={newWarehouse.isCold == 1}
              onChange={handleIsColdChange}
            >
              Yes
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Assign Staff"
        visible={isAssignModalVisible}
        onCancel={closeAssignModal}
        onOk={handleAssignStaff}
        okText="Assign"
        cancelText="Cancel"
      >
        <Select
          placeholder="Select warehouse to assign"
          options={warehouseList}
          onChange={(value) => setAssignWarehouseId(value)}
          value={assignWarehouseId}
          style={{ width: "100%" }}
        />
        <Select
          mode="multiple"
          placeholder="Select staff to assign"
          options={staffList}
          onChange={(value) => setSelectedStaff(value)}
          value={selectedStaff}
          style={{ width: "100%" }}
        />
        <Select
          mode="multiple"
          placeholder="Select shipper to assign"
          options={shipperList}
          onChange={(value) => setSelectedShippers(value)}
          value={selectedShippers}
          style={{ width: "100%" }}
        />
      </Modal>
      <Modal
        title="Create Inventory"
        visible={isCreateInventoryModalVisible}
        onOk={handleCreateInventory}
        onCancel={closeInventoryModal}
        okText="Create"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Warehouse" required>
            <Select
              placeholder="Select warehouse"
              options={warehouseListSelection}
              onChange={(value) => handleWarehouseSelection(value)}
              value={newInventory.warehouseId}
            />
          </Form.Item>
          <Form.Item label="Name" required>
            <Input
              name="name"
              value={newInventory.name}
              onChange={handleInventoryInputChange}
              placeholder="Enter inventory's name"
            />
          </Form.Item>
          <Form.Item label="Price" required>
            <Input
              name="price"
              value={newInventory.price}
              onChange={handleInventoryInputChange}
              placeholder="Enter price"
              type="number"
            />
          </Form.Item>
          <Form.Item label="Max weight" required>
            <Input
              name="maxWeight"
              value={newInventory.maxWeight}
              onChange={handleInventoryInputChange}
              placeholder="Enter max weight"
              type="number"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Warehouse Details"
        visible={isDrawerVisible}
        onClose={closeDetailsDrawer}
        width={400}
      >
        {selectedWarehouse ? (
          <Descriptions column={1}>
            <Descriptions.Item label="Name">
              {selectedWarehouse.name}
            </Descriptions.Item>
            <Descriptions.Item label="Capacity">
              {selectedWarehouse.capacity}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {selectedWarehouse.location}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {selectedWarehouse.createDate}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Loading details...</p>
        )}
      </Drawer>
    </>
  );
}
