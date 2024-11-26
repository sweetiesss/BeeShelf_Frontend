import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Popconfirm,
  Form,
  Button,
  Modal,
  Space,
  Select,
} from "antd";
import AxiosEmployee from "../../services/Employee";

export default function EmployeePage() {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]); // Employee data
  const [loading, setLoading] = useState(false); // Loading state
  const [editingKey, setEditingKey] = useState(""); // Track the editing key
  const { getEmployees, updateEmployee, createEmployee } = AxiosEmployee(); // Fetch employees and update API calls
  const [search, setSearch] = useState();
  const [sortBy, setSortBy] = useState();
  const [filterByRole, setFilterByRole] = useState();
  const [descending, setDescending] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    roleId: 0,
  });
  const defaultNewEmployee = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    roleId: 0,
  };
  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchEmployeeList();
  }, [pagination.pageIndex, pagination.pageSize]);

  // Fetch employee list
  const fetchEmployeeList = async () => {
    try {
      setLoading(true);
      const result = await getEmployees(
        search,
        sortBy,
        filterByRole,
        descending,
        pagination.pageIndex,
        pagination.pageSize
      );

      if (result?.status === 200) {
        const { items, totalItemsCount, totalPagesCount } = result.data;
        setEmployees(items.map((item) => ({ ...item, key: item.id }))); // Add key for table rows
        setPagination((prev) => ({
          ...prev,
          totalItems: totalItemsCount,
          totalPages: totalPagesCount,
        }));
      }
    } catch (e) {
      console.error("Failed to fetch employees:", e);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleCreate = async () => {
    try {
      const result = await createEmployee(newEmployee);
      if (result?.status === 200) {
        fetchEmployeeList(); // Refresh employee list
        setIsModalVisible(false);
        setNewEmployee(defaultNewEmployee);
      }
    } catch (e) {
      console.error("Failed to create employee:", e);
    }
  };

  // Determine if a row is being edited
  const isEditing = (record) => record.key === editingKey;

  // Cancel editing
  const cancel = () => {
    setEditingKey("");
  };

  // Save updated data via API
  const save = async (key) => {
    try {
      const row = await form.validateFields(); // Validate fields and get updated values
      const newData = [...employees];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        const updatedData = { ...item, ...row };
        console.log(updatedData);

        // Call API to save the updated data
        const response = await updateEmployee({
          confirmPassword: process.env.REACT_APP_GLOBAL_PASSWORD,
          email: updatedData.email,
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          phone: updatedData.phone,
          setting: updatedData.setting || "",
          pictureLink: updatedData.pictureLink || "",
        });

        if (response?.status === 200) {
          newData.splice(index, 1, updatedData); // Update the table data locally
          setEmployees(newData);
          setEditingKey("");
        } else {
          console.error("Failed to save employee:", response);
        }
      }
    } catch (err) {
      console.error("Validation or API call failed:", err);
    }
  };

  const roleOptions = [
    { label: "Staff", value: 3 },
    { label: "Shipper", value: 4 },
    { label: "Manager", value: 5 },
  ];

  // Edit row
  const edit = (key) => {
    setEditingKey(key);
  };

  // Table columns
  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      editable: true,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      editable: true,
    },
    {
      title: "Role",
      dataIndex: "roleName",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span
          style={{
            color: status === "Active" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button onClick={() => save(record.key)} type="link">
              Save
            </Button>
            <Popconfirm title="Cancel edit?" onConfirm={cancel}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </Space>
        ) : (
          <Button
            disabled={editingKey !== ""}
            onClick={() => edit(record.key)}
            type="link"
          >
            Edit
          </Button>
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
        inputType: col.dataIndex === "phone" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // Editable cell component
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            initialValue={record[dataIndex]} // Ensure the initial value matches the record
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputType === "number" ? <Input type="number" /> : <Input />}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  return (
    <>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Add Employee
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={employees}
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
        title="Create Employee"
        visible={isModalVisible}
        onOk={handleCreate}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Email" required>
            <Input
              name="email"
              value={newEmployee.email}
              onChange={handleInputChange}
              placeholder="Enter email"
            />
          </Form.Item>
          <Form.Item label="Password" required>
            <Input.Password
              name="password"
              value={newEmployee.password}
              onChange={handleInputChange}
              placeholder="Enter password"
            />
          </Form.Item>
          <Form.Item label="First Name" required>
            <Input
              name="firstName"
              value={newEmployee.firstName}
              onChange={handleInputChange}
              placeholder="Enter first name"
            />
          </Form.Item>
          <Form.Item label="Last Name" required>
            <Input
              name="lastName"
              value={newEmployee.lastName}
              onChange={handleInputChange}
              placeholder="Enter last name"
            />
          </Form.Item>
          <Form.Item label="Phone" required>
            <Input
              name="phone"
              value={newEmployee.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
          </Form.Item>
          <Form.Item label="Role" required>
            <Select
              name="roleId"
              value={newEmployee.roleId}
              onChange={(value) =>
                setNewEmployee((prev) => ({ ...prev, roleId: value }))
              }
              placeholder="Select a role"
              options={roleOptions}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
