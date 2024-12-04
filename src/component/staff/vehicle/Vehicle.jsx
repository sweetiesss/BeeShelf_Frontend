import React, { useEffect, useState } from "react";
import { Table, message, Spin, Button, Input, Modal, Form, Select } from "antd";
import { useParams } from "react-router-dom";
import useAxios from "../../../services/CustomizeAxios";
import { useAuth } from "../../../context/AuthContext";

const Vehicle = () => {
  const { userInfor } = useAuth(); // Lấy thông tin user từ hook useAuth
  const { moneyTransferId: urlPaymentId } = useParams(); // Lấy paymentId từ URL
  const [moneyTransferId, setPaymentId] = useState(urlPaymentId || ""); // Trạng thái cho paymentId (lấy từ URL nếu có)
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
      const response = await fetchDataBearer({
        url: `/vehicle/get-vehicles`,
        method: "GET",
        params: {
          warehouseId: userInfor?.workAtWarehouseId,
          descending: false,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      });
  
      if (response && Array.isArray(response.data)) { // Ensure it's an array
        setPayments(response.data);
        message.success("Data loaded successfully!");
  
        setPagination((prevPagination) => ({
          ...prevPagination,
          totalItemsCount: response.totalCount || 0, 
          totalPagesCount: Math.ceil(response.totalCount / pagination.pageSize),
        }));
  
        const options = response.data.map((moneyTransferId) => ({
          value: moneyTransferId.id, 
          label: `VehicleId: ${moneyTransferId.id} - Name Vehicle: ${moneyTransferId.name} - License Plate: ${moneyTransferId.licensePlate}`,
        }));
        setPaymentIdOptions(options);
      } else {
        message.error("No data returned or invalid data format.");
        setPayments([]); // In case of invalid data, set to empty array
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      message.error("Failed to fetch payments.");
      setPayments([]); // Ensure empty array if error occurs
    } finally {
      setLoading(false);
    }
  };
  

  // Hàm gọi API để tạo một payment mới
  const createPayment = async () => {
    setLoading(true);
    try {
      console.log("Creating payment with Vehicle:", moneyTransferId, "and staffId:", userInfor?.id);

      const response = await fetchDataBearer({
        url: `/payment/confirm-money-transfer-request/${userInfor?.id}/${moneyTransferId}`,
        method: "POST",
        data: {
          moneyTransferId,
        },
      });

      if (response && response.status === 200) {
        message.success("vehicle Assign successfully!");
        fetchPayments(); // Cập nhật lại danh sách vehicle
        setVisible(false); // Đóng modal khi tạo Assign thành công
      } else {
        const errorMessage =
          response?.data?.message || "Failed to Confirm money transfer.";
        message.error(errorMessage);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }

  };

  // Cột trong bảng
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Vehicle Name ",
      dataIndex: "name",
      key: "name",
    },
    { title: "LicensePlate", dataIndex: "licensePlate", key: "licensePlate" },
    // Cột bổ sung có thể bỏ qua nếu không cần thiết
  ];

  // Lấy dữ liệu thanh toán khi component mount và khi pagination thay đổi
  useEffect(() => {
    fetchPayments();
  }, [pagination.pageIndex]);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        type="primary"
        onClick={() => setVisible(true)} // Hiển thị modal khi nhấn nút
        style={{ marginBottom: 20 }}
      >
        Assign Vehicle To Shipper
      </Button>
      <h1>Vehicle List</h1>

      {/* Modal hiển thị form nhập staffId và paymentId */}
      <Modal
        title="Assign vehicle to shipper"
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
            Assign Vehicle To Shipper
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Shipper ID" required>
            {/* <Input
              value={userInfor?.id} // Để giá trị mặc định là userInfor?.id
              disabled
              placeholder="Staff ID"
            /> */}
                <Select
              value={moneyTransferId}
              onChange={(value) => setPaymentId(value)}
              placeholder="Select Vehicle ID"
            >
              {paymentIdOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Vehicle" required>
            <Select
              value={moneyTransferId}
              onChange={(value) => setPaymentId(value)}
              placeholder="Select Vehicle ID"
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

      {/* Hiển thị bảng dữ liệu */}
      <Table
        dataSource={payments}
        columns={columns}
        pagination={{
          current: pagination.pageIndex + 1, // Trang bắt đầu từ 1
          pageSize: pagination.pageSize,
          total: pagination.totalItemsCount,
          onChange: (page) => {
            setPagination((prev) => ({
              ...prev,
              pageIndex: page - 1, // Chuyển trang (index bắt đầu từ 0)
            }));
          },
        }}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default Vehicle;
