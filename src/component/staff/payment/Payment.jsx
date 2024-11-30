// import React, { useEffect, useState } from "react";
// import { Table, message, Spin, Button } from "antd";
// import useAxios from "../../../services/CustomizeAxios"; // Giả sử bạn đã tạo hook Axios tùy chỉnh

// const Payment = () => {
//   const [payments, setPayments] = useState([]); // Dữ liệu thanh toán
//   const [loading, setLoading] = useState(false); // Trạng thái loading
//   const [pagination, setPagination] = useState({
//     totalItemsCount: 0,
//     pageSize: 10,
//     totalPagesCount: 0,
//     pageIndex: 0,
//   });
//   const { fetchDataBearer } = useAxios(); // Hook axios

//   // Hàm gọi API để lấy danh sách thanh toán
//   const fetchPayments = async () => {
    
//     setLoading(true);
//     try {
//       const response = await fetchDataBearer({
        
//         url: "/payment/get-payments", // API của bạn
//         method: "GET",
//         params: {
//           pageIndex: pagination.pageIndex,
//           pageSize: pagination.pageSize,
//         },
//       });
//       console.log("AAAAAAA",response);

//       if (response && response.data) {
      
//         // Cập nhật dữ liệu vào state
//         setPayments(response.data);
        


//         message.success("Data loaded successfully!");
//       } else {
//         message.error("No data returned from the server.");
//       }
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//       message.error("Failed to fetch payments. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
// //   console.log("BBBBBB",payments);
//   // Hàm gọi API để tạo một payment mới
//   const createPayment = async () => {
//     setLoading(true);
//     try {
//       const response = await fetchDataBearer({
//         url: "/payment/create-payment", // API của bạn
//         method: "POST",
//         data: {
//           // Giả sử bạn muốn tạo một payment với các giá trị mặc định hoặc từ input
//           totalAmount: 1000,
//           shipperEmail: "shipper@example.com",
//           shipperName: "John Doe",
//         },
//       });

//       if (response && response.status === 200) {
//         message.success("Payment created successfully!");
//         fetchPayments(); // Tải lại danh sách thanh toán sau khi tạo thành công
//       } else {
//         const errorMessage = response?.data?.message || "Failed to create payment.";
//         message.error(errorMessage);
//       }
//     } catch (error) {
//       console.error("Error creating payment:", error);
//       message.error("Failed to create payment. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cột trong bảng
//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       key: "id",
//     },
//     {
//       title: "Ocop Partner ID",
//       dataIndex: "ocopPartnerId",
//       key: "ocopPartnerId",
//     },
//     {
//       title: "Order ID",
//       dataIndex: "orderId",
//       key: "orderId",
//     },
//     {
//       title: "Collected By",
//       dataIndex: "collectedBy",
//       key: "collectedBy",
//     },
//     {
//       title: "Shipper Email",
//       dataIndex: "shipperEmail",
//       key: "shipperEmail",
//     },
//     {
//       title: "Shipper Name",
//       dataIndex: "shipperName",
//       key: "shipperName",
//     },
//     {
//       title: "Total Amount",
//       dataIndex: "totalAmount",
//       key: "totalAmount",
//       render: (text) => `$${text}`, // Hiển thị tổng số tiền
//     },
//   ];

//   // Sử dụng useEffect để tự động lấy dữ liệu khi component được render
//   useEffect(() => {
//     fetchPayments();
//   }, []); // Chạy một lần khi component mount

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Payments List</h1>
      
//       {/* Nút Create Payment */}
//       <Button
//         type="primary"
//         onClick={createPayment}
//         loading={loading}
//         style={{ marginBottom: 20 }}
//       >
//         Create Payment
//       </Button>

//       {/* Hiển thị loading khi đang tải dữ liệu */}
//       {loading ? (
//         <Spin tip="Loading payments..." />
//       ) : (
//         <Table
//           dataSource={payments}
//           columns={columns}
//           loading={loading}
//           pagination={{
//             current: pagination.pageIndex + 1,
//             pageSize: pagination.pageSize,
//             total: pagination.totalItemsCount,
//             onChange: (page) => {
//               setPagination((prev) => ({
//                 ...prev,
//                 pageIndex: page - 1,
//               }));
//               fetchPayments(); // Gọi lại API khi chuyển trang
//             },
//           }}
//           rowKey="id" // Đảm bảo mỗi hàng có key duy nhất
//         />
//       )}
//     </div>
//   );
// };

// export default Payment;




import React, { useEffect, useState } from "react";
import { Table, message, Spin, Button, Input, Modal, Form } from "antd";
import { useParams } from "react-router-dom";
import useAxios from "../../../services/CustomizeAxios";
import { useAuth } from "../../../context/AuthContext"; // Giả sử bạn đã có hook useAuth

const Payment = () => {
  const { userInfor } = useAuth(); // Lấy thông tin user từ hook useAuth
  const { paymentId: urlPaymentId } = useParams(); // Lấy paymentId từ URL
  const [paymentId, setPaymentId] = useState(urlPaymentId || ""); // Trạng thái cho paymentId (lấy từ URL nếu có)
  const [visible, setVisible] = useState(false); // Trạng thái hiển thị modal
  const [payments, setPayments] = useState([]);
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
        url: "/payment/get-payments",
        method: "GET",
        params: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      });
      if (response && response.data) {
        setPayments(response.data);
        message.success("Data loaded successfully!");
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
      const response = await fetchDataBearer({
        url: `/payment/create-money-transfer/${paymentId}`, // Chuyển paymentId vào URL
        method: "POST",
        data: {
          staffId: userInfor?.id, // Sử dụng userInfor?.id cho staffId
          paymentId,
        },
      });
      if (response && response.status === 200) {
        message.success("Payment created successfully!");
        fetchPayments();
        setVisible(false); // Đóng modal khi tạo payment thành công
      } else {
        const errorMessage = response?.data?.message || "Failed to create payment.";
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      message.error("Failed to create payment.");
    } finally {
      setLoading(false);
    }
  };

  // Cột trong bảng
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Ocop Partner ID", dataIndex: "ocopPartnerId", key: "ocopPartnerId" },
    { title: "Order ID", dataIndex: "orderId", key: "orderId" },
    { title: "Collected By", dataIndex: "collectedBy", key: "collectedBy" },
    { title: "Shipper Email", dataIndex: "shipperEmail", key: "shipperEmail" },
    { title: "Shipper Name", dataIndex: "shipperName", key: "shipperName" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount", render: (text) => `$${text}` },
  ];

  // Lấy dữ liệu thanh toán khi component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Payments List</h1>

      {/* Nút "Create Payment" để mở modal */}
      <Button
        type="primary"
        onClick={() => setVisible(true)} // Hiển thị modal khi nhấn nút
        loading={loading}
        style={{ marginBottom: 20 }}
      >
        Create Payment
      </Button>

      {/* Modal hiển thị form nhập staffId và paymentId */}
      <Modal
        title="Create Payment"
        visible={visible}
        onCancel={() => setVisible(false)} // Đóng modal khi nhấn cancel
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={createPayment}>
            Create Payment
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
            <Input
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              placeholder="Enter Payment ID"
            />
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
