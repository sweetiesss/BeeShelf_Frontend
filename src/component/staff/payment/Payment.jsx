import React, { useEffect, useState } from "react";
import { Table, message, Spin, Button, Input, Modal, Form, Select } from "antd";
import { useParams } from "react-router-dom";
import useAxios from "../../../services/CustomizeAxios";
import { useAuth } from "../../../context/AuthContext";

const Payment = () => {
  const { userInfor } = useAuth(); // Lấy thông tin user từ hook useAuth
  const { moneyTransferId: urlPaymentId } = useParams(); // Lấy paymentId từ URL
  const [moneyTransferId, setPaymentId] = useState(urlPaymentId || ""); // Trạng thái cho paymentId (lấy từ URL nếu có)
  const [pictureLink, setPictureLink] = useState(null); // Trạng thái cho picture_link
  const [file, setFile] = useState(null); // Trạng thái cho file ảnh
  const [visible, setVisible] = useState(false); // Trạng thái hiển thị modal
  const [payments, setPayments] = useState([]);
  const [paymentIdOptions, setPaymentIdOptions] = useState([]); // Trạng thái cho danh sách paymentId options
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalItemsCount: 0,
    pageSize: 10,
    pageIndex: 0,
  });
  const { fetchDataBearer } = useAxios();

  // Hàm gọi API để lấy danh sách thanh toán
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const warehouseId = userInfor?.workAtWarehouseId;

      if (!warehouseId) {
        message.error("Warehouse ID is not available. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetchDataBearer({
        url: `/payment/get-money-transfers/${warehouseId}`,
        method: "GET",
        params: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      });

      if (response && response.data) {
        setPayments(response.data);
        message.success("Data loaded successfully!");

        // Tạo danh sách paymentId cho Select component
        const options = response.data
          .filter((item) => item.isTransferred === 0)
          .map((item) => ({
            value: item.id,
            label: `MoneyTransferId: ${item.id} - OCOP Partner ID: ${
              item.ocopPartnerId
            } - Amount: ${new Intl.NumberFormat("vi-VN", {
              style: "decimal",
              maximumFractionDigits: 0,
            }).format(item.amount)} VNĐ`,
          }));

        setPaymentIdOptions(options);
      } else {
        message.error("No data returned from the server.");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      message.error("Failed to fetch payments.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi file ảnh và upload ảnh lên server
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      message.error("Please select a valid image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetchDataBearer({
        url: "/picture/upload-image", // Sử dụng API mới
        method: "POST",
        data: formData,
      });

      if (response && response.data) {
        setFile(selectedFile);
        setPictureLink(response.data); // Giả sử response.data chứa URL của ảnh
        message.success("Image uploaded successfully!");
      } else {
        message.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("An error occurred while uploading the image.");
    }
  };

  // Hàm gọi API để tạo một payment mới
  const createPayment = async () => {
    setLoading(true);
    try {
      if (!moneyTransferId) {
        message.error("Please select a Payment ID.");
        setLoading(false);
        return;
      }

      if (!pictureLink) {
        message.error("Please upload a picture.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("moneyTransferId", moneyTransferId);
      formData.append("picture_link", pictureLink);

      const pictureLinkParam = encodeURIComponent(
        pictureLink.name || pictureLink
      );

      const response = await fetchDataBearer({
        url: `/payment/confirm-money-transfer-request/${userInfor?.id}/${moneyTransferId}?picture_link=${pictureLinkParam}`,
        method: "POST",
        data: formData,
      });

      if (response && response.status === 200) {
        message.success("Payment confirmed successfully!");
        fetchPayments();
        setVisible(false);
        setPictureLink(null);
        setPaymentId("");
      } else {
        const errorMessage =
          response?.data?.message || "Failed to confirm money transfer.";
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      message.error("An error occurred while confirming the payment.");
    } finally {
      setLoading(false);
    }
  };

  // Định nghĩa các cột trong bảng
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Ocop Partner ID",
      dataIndex: "ocopPartnerId",
      key: "ocopPartnerId",
    },
    { title: "Transfer By", dataIndex: "transferBy", key: "transferBy" },
    {
      title: "Transfer By Staff Email",
      dataIndex: "transferByStaffEmail",
      key: "transferByStaffEmail",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        `${new Intl.NumberFormat("vi-VN", {
          style: "decimal",
          maximumFractionDigits: 0,
        }).format(amount)} VNĐ`,
    },
    {
      title: "Create Date",
      dataIndex: "createDate",
      key: "createDate",
      render: (text) => {
        if (!text) return "N/A";
        const date = new Date(text);
        return new Intl.DateTimeFormat("vi-VN").format(date);
      },
    },
    {
      title: "Picture Link",
      dataIndex: "pictureLink",
      key: "pictureLink",
      render: (link) => {
        return link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            View Image
          </a>
        ) : (
          "No Image"
        );
      },
    },
  ];

  useEffect(() => {
    fetchPayments();
  }, [pagination.pageIndex]);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        type="primary"
        onClick={() => setVisible(true)}
        style={{ marginBottom: 20 }}
      >
        Confirm Money Transfer Request
      </Button>

      <h1>Transfer Money Request List</h1>

      <Modal
        title="Confirm Money Transfer Request"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={createPayment}
          >
            Confirm Money Transfer Request
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Staff ID" required>
            <Input value={userInfor?.id} disabled placeholder="Staff ID" />
          </Form.Item>

          <Form.Item label="Payment ID" required>
            <Select
              value={moneyTransferId}
              onChange={setPaymentId}
              placeholder="Select Payment ID"
              allowClear
            >
              {paymentIdOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Upload Picture" required>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        dataSource={payments}
        columns={columns}
        rowKey="id"
        loading={{
          spinning: loading,
        }}
        pagination={{
          current: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          total: pagination.totalItemsCount,
          onChange: (page) =>
            setPagination((prev) => ({ ...prev, pageIndex: page - 1 })),
        }}
      />
    </div>
  );
};

export default Payment;
