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
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
export default function WarehousesPage() {
  const { getEmployees } = AxiosEmployee();
  const { createInventory } = AxiosInventory();
  const { getProvinces } = AxiosOthers();
  const {
    getWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouseById,
    getWarehouseById,
    assignStaff,
    assignShipper,
  } = AxiosWarehouse(); 
  
  const { t } = useTranslation();
  const nav = useNavigate();

  const [form] = Form.useForm();
  const [warehouses, setWarehouses] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState(""); 


  const [search, setSearch] = useState(); 
  const [sortCriteria, setSortCriteria] = useState(); 
  const [descending, setDescending] = useState(false); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); 

  const [isDrawerVisible, setIsDrawerVisible] = useState(false); 

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
    inventoryAmount: 0,
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
    fetchWarehousesList();
  }, []);

  const fetchBeginData = async () => {
    const result = await getWarehouses(
      undefined,
      undefined, 
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
  const fetchWarehousesList = async () => {
    try {
      setLoading(true);
      const result = await getWarehouses(
        search,
        sortCriteria,
        descending,
        pagination.pageIndex,
        pagination.pageSize
      );

      if (result?.status === 200) {
        const { items, totalItemsCount, totalPagesCount } = result.data;
        setWarehouses(items.map((item) => ({ ...item, key: item.id }))); 
        setPagination((prev) => ({
          ...prev,
          totalItems: totalItemsCount,
          totalPages: totalPagesCount,
        }));
      }
    } catch (e) {
      console.error("Failed to fetch stores:", e);
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
        undefined,
        descending,
        0,
        1000
      );
      if (result?.status === 200) {
        setEmployeeList(result?.data);
        const filterEmptyEmployee = result?.data?.items?.filter(
          (item) => item.workAtWarehouseId === null
        );
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
        const assignedWarehouseIds = new Set(
          result?.data?.items
            ?.filter((employee) => employee.workAtWarehouseId !== null)
            .map((employee) => employee.workAtWarehouseId)
        );
        setWarehouseList(warehouseListSelection);
      }
    } catch (e) {
      console.error("Failed to fetch stores:", e);
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

  const handleAssignStaff = async () => {
    try {
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
        storeId: assignWarehouseId,
      }));
      const submitSelectStaff = selectedStaff?.map((item) => ({
        employeeId: item,
        storeId: assignWarehouseId,
      }));

      let checkrefresh = false;
      if (submitSelectStaff.length > 0) {
        const result1 = await assignStaff(submitSelectStaff);
        if (result1?.status === 200) checkrefresh = true;
      }
      if (selectedShippers.length > 0) {
        const result2 = await assignShipper(submitShipper);
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

  const openAssignModal = () => {
    setSelectedStaff();
    setIsAssignModalVisible(true);
  };

  const closeAssignModal = () => {
    setIsAssignModalVisible(false);
    setSelectedStaff();
  };

  const handleCreateWarehouse = async () => {
    try {
      await createWarehouse(newWarehouse);
      handleModalClose();
      fetchWarehousesList();
    } catch (error) {
      console.error("Failed to create store:", error);
    }
  };

  const handleInventoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewInventory((prev) => ({ ...prev, [name]: value }));
  };

  const handleWarehouseSelection = (value) => {
    setNewInventory((prev) => ({ ...prev, warehouseId: value }));
  };

  const openInventoryModal = () => {
    setNewInventory({ warehouseId: null, productName: "", quantity: 0 });
    setIsCreateInventoryModalVisible(true);
  };

  const closeInventoryModal = () => {
    setIsCreateInventoryModalVisible(false);
  };

  const handleCreateInventory = async () => {
    try {
      if (
        !newInventory.warehouseId ||
        !newInventory.inventoryAmount ||
        !newInventory.maxWeight
      ) {
        console.error("Please fill all required fields.");
        return;
      }

      const result = await createInventory(newInventory);
      if (result?.status === 200) {
        fetchWarehousesList();
        closeInventoryModal();
      }
    } catch (error) {
      console.error("Failed to create inventory:", error);
    }
  };

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

  const handleUpdateWarehouse = async () => {
    try {
      const resut = await updateWarehouse(newWarehouse?.id, newWarehouse);
      if (resut?.status === 200) {
        handleModalClose();
        fetchWarehousesList();
      }
    } catch (error) {
      console.error("Failed to create store:", error);
    }
  };

  const edit = (record) => {
    setIsUpdateModalVisible(true);
    const parts = record?.location.split(",");

    parts.pop();

    const updatedLocation = parts.join(",").trim();

    setNewWarehouse({
      ...record,
      location: updatedLocation,
    });
  };

  const handleDelete = async (id) => {
    try {
      const resut = await deleteWarehouseById(id);
      if (resut?.status === 200) {
        fetchWarehousesList();
      }
    } catch (error) {
      console.error("Failed to create store:", error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Capacity (kg)",
      dataIndex: "capacity",
    },

    {
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Width (m)",
      dataIndex: "width",

      render: (_, record) => <span>{record?.width || 0}</span>,
    },
    {
      title: "Length (m)",
      dataIndex: "length",

      render: (_, record) => <span>{record?.length || 0}</span>,
    },
    {
      title: "Create Date",
      dataIndex: "createDate",

      render: (_, record) => format(record?.createDate, "dd/MM/yyyy"),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <Space>
            <Button disabled={editingKey !== ""} onClick={() => edit(record)}>
              Edit
            </Button>

            <Button onClick={() => nav("create-room", { state: record })}>
              Add Rooms
            </Button>

            <Button onClick={() => openDetailsDrawer(record.key)}>
              View Details
            </Button>

            <Popconfirm
              title="Are you sure to delete this store?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

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

  const openDetailsDrawer = async (id) => {
    try {
      const result = await getWarehouseById(id);
      if (result?.status === 200) {
        setSelectedWarehouse(result.data);
        setIsDrawerVisible(true);
      }
    } catch (e) {
      console.error("Failed to fetch store details:", e);
    }
  };

  const closeDetailsDrawer = () => {
    setIsDrawerVisible(false);
    setSelectedWarehouse(null);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">{t("Store Management")}</h1>
      <Form form={form} component={false}>
        <div style={{ marginBottom: "16px" }} className="flex gap-4">
          <Input.Search
            placeholder="Search stores"
            allowClear
            onSearch={(value) => setSearch(value)}
            style={{ width: "300px" }}
          />
          <Button type="primary" onClick={() => nav("create-store")}>
            Add Store
          </Button>
          <Button type="primary" onClick={openAssignModal}>
            Assign Employee
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
        title="Update Store"
        visible={isUpdateModalVisible}
        onCancel={handleModalClose}
        onOk={handleUpdateWarehouse}
        okText="Update"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Store Name" required>
            <Input
              name="name"
              value={newWarehouse.name}
              onChange={handleInputChange}
              placeholder="Enter Store Name"
            />
          </Form.Item>
          <Form.Item label="Capacity (kg)">
            <div
              className="py-1 px-3 rounded-md bg-gray-100 cursor-not-allowed"
              style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "#d9d9d9",
              }}
            >
              {newWarehouse.capacity}
            </div>
          </Form.Item>
          <Form.Item>
            <Space.Compact style={{ width: "100%" }}>
              <Form.Item style={{ width: "50%" }} label="Width (m)">
                <div
                  className="py-1 px-3 rounded-md bg-gray-100 cursor-not-allowed"
                  style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#d9d9d9",
                  }}
                >
                  {newWarehouse.width || 0}
                </div>
              </Form.Item>
              <Form.Item style={{ width: "50%" }} label="Length (m)">
                <div
                  className="py-1 px-3 rounded-md bg-gray-100 cursor-not-allowed"
                  style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#d9d9d9",
                  }}
                >
                  {newWarehouse.length || 0}
                </div>
              </Form.Item>
            </Space.Compact>
          </Form.Item>
          <Form.Item label="Address">
            <Space.Compact style={{ width: "100%" }}>
              <Form.Item style={{ width: "50%" }}>
                <div
                  className="py-1 px-3 rounded-md bg-gray-100 cursor-not-allowed"
                  style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#d9d9d9",
                  }}
                >
                  {newWarehouse.location}
                </div>
              </Form.Item>
              <Form.Item style={{ width: "50%" }}>
                <div
                  className="py-1 px-3 rounded-md bg-gray-100 cursor-not-allowed"
                  style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#d9d9d9",
                  }}
                >
                  {
                    provinces?.find(
                      (item) => item.id === newWarehouse?.provinceId
                    )?.subDivisionName
                  }
                </div>
              </Form.Item>
            </Space.Compact>
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
          placeholder="Select store to assign"
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

      <Drawer
        title="Store Details"
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
