import React, { useEffect, useState } from "react";
import { Table, message, Spin, Button, Input, Modal, Form, Select } from "antd";
import { useParams } from "react-router-dom";
import useAxios from "../../../services/CustomizeAxios";
import { useAuth } from "../../../context/AuthContext";

const Payment = () => {
  const { userInfor } = useAuth(); // Lấy thông tin user từ hook useAuth
  const { paymentId: urlPaymentId } = useParams(); // Lấy paymentId từ URL
  const [paymentId, setPaymentId] = useState(urlPaymentId || ""); // Trạng thái cho paymentId (lấy từ URL nếu có)
  const [visible, setVisible] = useState(false); // Trạng thái hiển thị modal
  const [payments, setPayments] = useState([]);
  const [paymentIdOptions, setPaymentIdOptions] = useState([]); // Trạng thái cho danh sách paymentId options
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalItemsCount: 0,
    pageSize: 10,
    totalPagesCount: 0,
    pageIndex: 0,
  });
  const { fetchDataBearer } = useAxios();

  // Hàm gọi API để lấy danh sách thanh toán
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const warehouseId = userInfor?.workAtWarehouseId;

      if (!warehouseId) {
        console.error("Warehouse ID is not available");
        setLoading(false);
        return;
      }

      const response = await fetchDataBearer({
        url: `/payment/get-payments/${warehouseId}`, // Sử dụng URL với warehouseId động
        method: "GET",
        params: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      });

      if (response && response.data) {
        setPayments(response.data);
        message.success("Data loaded successfully!");

        // Map the response data to paymentId options for the Select component
        const options = response.data.map((payment) => ({
          value: payment.id, // ID của payment sẽ là value
          label: `Payment ID: ${payment.id} - 
          Order ID: ${payment.orderId} - 
          ShipperName: ${payment.shipperName}`,
           // Hiển thị Payment ID trong label
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

  // Hàm gọi API để tạo một payment mới
  const createPayment = async () => {
    setLoading(true);
    try {
      // Kiểm tra thông tin trước khi gọi API
      console.log("Creating payment with paymentId:", paymentId, "and staffId:", userInfor?.id);

      const response = await fetchDataBearer({
        // url: `/payment/create-money-transfer/${paymentId}`, // Chuyển paymentId vào URL
        url: `/payment/create-money-transfer/${paymentId}?staffId=${userInfor?.id}`,
        method: "POST",
        data: {
        //   staffId: userInfor?.id, // Sử dụng userInfor?.id cho staffId
        //   paymentId,
        paymentId,
        },
      });

      if (response && response.status === 200) {
        message.success("Payment created successfully!");
        fetchPayments(); // Cập nhật lại danh sách thanh toán
        setVisible(false); // Đóng modal khi tạo payment thành công
      } else {
        const errorMessage =
          response?.data?.message || "Failed to create money transfer.";
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      message.error("Failed to create money transfer.");
    } finally {
      setLoading(false);
    }
  };

  // Cột trong bảng
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Ocop Partner ID",
      dataIndex: "ocopPartnerId",
      key: "ocopPartnerId",
    },
    { title: "Order ID", dataIndex: "orderId", key: "orderId" },
    { title: "Collected By", dataIndex: "collectedBy", key: "collectedBy" },
    { title: "Shipper Email", dataIndex: "shipperEmail", key: "shipperEmail" },
    { title: "Shipper Name", dataIndex: "shipperName", key: "shipperName" },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => `$${text}`,
    },
  ];

  // Lấy dữ liệu thanh toán khi component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {/* Nút "Create Payment" để mở modal */}
      <Button
        type="primary"
        onClick={() => setVisible(true)} // Hiển thị modal khi nhấn nút
        loading={loading}
        style={{ marginBottom: 20 }}
      >
        Create Money Transfer
      </Button>
      <h1>Payments List</h1>
      {/* Modal hiển thị form nhập staffId và paymentId */}
      <Modal
        title="Create Money Transfer"
        visible={visible}
        onCancel={() => setVisible(false)} // Đóng modal khi nhấn cancel
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
            Create Money Transfer 
          </Button>,
        ]}
      >
        <Form layout="vertical">
          {/* Trường input cho staffId */}
          <Form.Item label="Staff ID" required>
            <Input
              value={userInfor?.id} // Để giá trị mặc định là userInfor?.id
              disabled // Chặn người dùng chỉnh sửa trường này
              placeholder="Staff ID"
            />
          </Form.Item>

          {/* Trường input cho paymentId */}
          <Form.Item label="Payment ID" required>
            <Select
              value={paymentId} // Đảm bảo paymentId là state hoặc prop đang lưu trữ giá trị đã chọn
              onChange={(value) => setPaymentId(value)} // Cập nhật giá trị khi người dùng chọn
              placeholder="Select Payment ID"
            >
              {paymentIdOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Hiển thị loading khi đang tải dữ liệu */}
      {loading ? (
        <Spin tip="Loading payments..." />
      ) : (
        <Table
          dataSource={payments}
          columns={columns}
          loading={loading}
          pagination={{
            current: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
            total: pagination.totalItemsCount,
            onChange: (page) => {
              setPagination((prev) => ({
                ...prev,
                pageIndex: page - 1,
              }));
              fetchPayments(); // Gọi lại API khi chuyển trang
            },
          }}
          rowKey="id"
        />
      )}
    </div>
  );
};

export default Payment;
