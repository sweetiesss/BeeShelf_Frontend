import React, { useState } from "react";
import {
  Table,
  Tag,
  Input,
  Dropdown,
  Button,
  Menu,
  Space,
} from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";


// const { Option } = Select;

const Ordermanage = () => {
  const [filter, setFilter] = useState("Status");

  // Dữ liệu mẫu
  const data = [
    {
      key: "1",
      orderName: "Organic Rice + 1 more",
      customer: "Customer Name",
      status: "Unassigned",
      quantity: 234,
      location: "123 Phan Xich Long",
      date: "12/12/2024",
      price: "$50000",
    },
    {
      key: "2",
      orderName: "Organic Rice",
      customer: "Customer Name",
      status: "Assigned",
      quantity: 234,
      location: "123 Phan Xich Long",
      date: "12/12/2024",
      price: "$50000",
    },
    {
      key: "3",
      orderName: "Organic Rice",
      customer: "Customer Name",
      status: "Pending",
      quantity: 234,
      location: "123 Phan Xich Long",
      date: "12/12/2024",
      price: "$50000",
    },
    {
      key: "4",
      orderName: "Organic Rice",
      customer: "Customer Name",
      status: "Canceled",
      quantity: 234,
      location: "123 Phan Xich Long",
      date: "12/12/2024",
      price: "$50000",
    },
    {
      key: "5",
      orderName: "Organic Rice",
      customer: "Customer Name",
      status: "Processing",
      quantity: 234,
      location: "123 Phan Xich Long",
      date: "12/12/2024",
      price: "$50000",
    },
    {
      key: "6",
      orderName: "Organic Rice",
      customer: "Customer Name",
      status: "Delivered",
      quantity: 234,
      location: "123 Phan Xich Long",
      date: "12/12/2024",
      price: "$50000",
    },
  ];

  // Cột trong bảng
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Order name",
      dataIndex: "orderName",
      key: "orderName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color;
        switch (status) {
          case "Unassigned":
            color = "default";
            break;
          case "Assigned":
            color = "blue";
            break;
          case "Pending":
            color = "orange";
            break;
          case "Canceled":
            color = "red";
            break;
          case "Processing":
            color = "purple";
            break;
          case "Delivered":
            color = "green";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "To location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Total price",
      dataIndex: "price",
      key: "price",
    },
  ];

  // Menu dropdown
  const menu = (
    <Menu
      onClick={(e) => {
        setFilter(e.key === "1" ? "Status" : "Date"); // Cập nhật giá trị của filter
      }}
    >
      <Menu.Item key="1">Status</Menu.Item>
      <Menu.Item key="2">Date</Menu.Item>
    </Menu>
  );
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>Order management</h1>
      <Space style={{ marginBottom: 16 }}>
        <Dropdown overlay={menu}>
          <Button>
            Filter by: {filter} <DownOutlined />
          </Button>
        </Dropdown>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search for order"
          style={{ width: 300 }}
        />
      </Space>
      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          pageSize: 10,
          position: ["bottomCenter"],
        }}
        rowSelection={{
          type: "checkbox",
        }}
      />
    </div>
  );
  


};

export default Ordermanage;

