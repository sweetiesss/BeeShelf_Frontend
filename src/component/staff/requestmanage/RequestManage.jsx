// import React, { useEffect, useState } from "react";
// import { Table, Tag, Input, Space, Button, message, Select } from "antd";
// import useAxios from "../../../services/CustomizeAxios";
// import { useAuth } from "../../../context/AuthContext";

// const { Option } = Select;

// const RequestManagement = () => {
//   const [warehouseId, setWarehouseId] = useState("");
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     totalItemsCount: 0,
//     pageSize: 10,
//     totalPagesCount: 0,
//     pageIndex: 0,
//   });
//   const [email, setEmail] = useState("");
//   const [employeeDetails, setEmployeeDetails] = useState(null);
//   const { fetchDataBearer } = useAxios();

//   useEffect(() => {
//     fetchRequests(0);
//   }, []);

//   //getStaffInformationUnderLocalStorage
//   const { userInfor } = useAuth();



//   const fetchRequests = async (pageIndex = 0) => {
//     setLoading(true);
//     try {
//       console.log(userInfor?.workAtWarehouseId);
  
//       const response = await fetchDataBearer({
//         url: `/request/get-requests`,
//         method: "GET",
//         params: {
//           warehouseId: userInfor?.workAtWarehouseId,
//           pageIndex,
//           pageSize: pagination.pageSize,
//         },
//       });
  
//       if (response && response.data) {
//         const { totalItemsCount, pageSize, totalPagesCount, pageIndex, items } =
//           response.data;
  
//         // Lọc các yêu cầu không có trạng thái Draft
//         const filteredItems = items.filter((item) => item.status !== "Draft");
  
//         setRequests(
//           filteredItems.map((item) => ({
//             key: item.id,
//             ...item,
//           }))
//         );
  
//         setPagination({
//           totalItemsCount,
//           pageSize,
//           totalPagesCount,
//           pageIndex,
//         });
  
//         message.success("Data loaded successfully!");
//       } else {
//         message.error("No data returned from the server.");
//       }
//     } catch (error) {
//       console.error("Error fetching requests:", error);
//       message.error("Failed to fetch requests. Please check the Warehouse ID.");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const handlePageChange = (page) => {
//     fetchRequests(page - 1);
//   };

//   const updateRequestStatus = async (id, newStatus) => {
//     if (!newStatus) {
//       message.error("Please select a new status!");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Log dữ liệu trước khi gửi
//       console.log("Updating status for ID:", id, "to new status:", newStatus);

//       const response = await fetchDataBearer({
//         url: `/request/update-request-status/${id}?status=${newStatus}`,
//         method: "PUT",
//       });

//       if (response && response.status === 200) {
//         message.success("Status updated successfully!");
//         fetchRequests(pagination.pageIndex); // Làm mới bảng sau khi cập nhật
//       } else {
//         const errorMessage =
//           response?.data?.message || "Failed to update status.";
//         message.error(errorMessage);
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       message.error(
//         error.response?.data?.message ||
//           "Failed to update status. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStatusTag = (status) => {
//     const colorMap = {
//       Processing: "blue",
//       Delivered: "cyan",
//       Completed: "green",
//       Failed: "red",
//       Canceled: "orange",
//     };
//     return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Request Management</h1>

//       {/* Request Table */}
//       <Table
        
//         dataSource={requests}
//         columns={[
//           { title: "Request ID", dataIndex: "id", key: "id" },
//           {
//             title: "Partner Email",
//             dataIndex: "partner_email",
//             key: "partner_email",
//           },
//           { title: "Request Name", dataIndex: "name", key: "name" },
//           {
//             title: "Description",
//             dataIndex: "description",
//             key: "description",
//           },
//           {
//             title: "Product Name",
//             dataIndex: "productName",
//             key: "productName",
//           },
//           {
//             title: "Request Type",
//             dataIndex: "requestType",
//             key: "requestType",
//           },
//           {
//             title: "Warehouse Name",
//             dataIndex: "warehouseName",
//             key: "warehouseName",
//           },
//           {
//             title: "Status",
//             dataIndex: "status",
//             key: "status",
//             render: (status, record) => (
//               <Space direction="vertical">
//                 {renderStatusTag(status)}
//                 <Select
//                   style={{ width: 75, padding: 0 }}
//                   placeholder="Update Status"
//                   onChange={(newStatus) =>
//                     updateRequestStatus(record.id, newStatus)
//                   }
//                   defaultValue={status}
//                 >
//                   {/* <Option value="Processing">Processing</Option>
//                   <Option value="Delivered">Delivered</Option> */}
//                   <Option value="Delivered">Delivered</Option>
//                   <Option value="Completed">Completed</Option>
//                   <Option value="Cancelled">Cancelled</Option>
//                   <Option value="Failed">Failed</Option>
                  
//                 </Select>
//               </Space>
//             ),
//           },
//           { title: "Create Date", dataIndex: "createDate", key: "createDate" },
//           {
//             title: "Approve Date",
//             dataIndex: "apporveDate",
//             key: "apporveDate",
//           },
//           {
//             title: "Deliver Date",
//             dataIndex: "deliverDate",
//             key: "deliverDate",
//           },
//         ]}
//         loading={loading}
//         pagination={{
//           current: pagination.pageIndex + 1,
//           pageSize: pagination.pageSize,
//           total: pagination.totalItemsCount,
//           onChange: handlePageChange,
//         }}
//       />
//     </div>
//   );
// };

// export default RequestManagement;
import React, { useEffect, useState } from "react";
import { Table, Tag, Input, Space, Button, message, Select } from "antd";
import useAxios from "../../../services/CustomizeAxios";
import { useAuth } from "../../../context/AuthContext";

const { Option } = Select;

const RequestManagement = () => {
  const [warehouseId, setWarehouseId] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalItemsCount: 0,
    pageSize: 10,
    totalPagesCount: 0,
    pageIndex: 0,
  });
  const [email, setEmail] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const { fetchDataBearer } = useAxios();

  useEffect(() => {
    fetchRequests(0);
  }, []);

  const { userInfor } = useAuth();

  const fetchRequests = async (pageIndex = 0) => {
    setLoading(true);
    try {
      console.log(userInfor?.workAtWarehouseId);

      const response = await fetchDataBearer({
        url: `/request/get-requests`,
        method: "GET",
        params: {
          warehouseId: userInfor?.workAtWarehouseId,
          pageIndex,
          pageSize: pagination.pageSize,
        },
      });

      if (response && response.data) {
        const { totalItemsCount, pageSize, totalPagesCount, pageIndex, items } =
          response.data;

        // Lọc các yêu cầu không có trạng thái "Draft"
        const filteredItems = items.filter((item) => item.status !== "Draft");

        setRequests(
          filteredItems.map((item) => ({
            key: item.id,
            ...item,
          }))
        );

        setPagination({
          totalItemsCount,
          pageSize,
          totalPagesCount,
          pageIndex,
        });

        message.success("Data loaded successfully!");
      } else {
        message.error("No data returned from the server.");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      message.error("Failed to fetch requests. Please check the Warehouse ID.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchRequests(page - 1);
  };

  const updateRequestStatus = async (id, newStatus) => {
    if (!newStatus) {
      message.error("Please select a new status!");
      return;
    }

    setLoading(true);
    try {
      // Log dữ liệu trước khi gửi
      console.log("Updating status for ID:", id, "to new status:", newStatus);

      const response = await fetchDataBearer({
        url: `/request/update-request-status/${id}?status=${newStatus}`,
        method: "PUT",
      });

      if (response && response.status === 200) {
        message.success("Status updated successfully!");
        fetchRequests(pagination.pageIndex); // Làm mới bảng sau khi cập nhật
      } else {
        const errorMessage =
          response?.data?.message || "Failed to update status.";
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(
        error.response?.data?.message ||
          "Failed to update status. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStatusTag = (status) => {
    const colorMap = {
      Processing: "blue",
      Delivered: "cyan",
      Completed: "green",
      Failed: "red",
      Canceled: "orange",
    };
    return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Request Management</h1>

      {/* Request Table */}
      <Table
        dataSource={requests}
        columns={[
          { title: "Request ID", dataIndex: "id", key: "id" },
          {
            title: "Partner Email",
            dataIndex: "partner_email",
            key: "partner_email",
          },
          { title: "Request Name", dataIndex: "name", key: "name" },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Product Name",
            dataIndex: "productName",
            key: "productName",
          },
          {
            title: "Request Type",
            dataIndex: "requestType",
            key: "requestType",
          },
          {
            title: "Warehouse Name",
            dataIndex: "warehouseName",
            key: "warehouseName",
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
              <Space direction="vertical">
                {renderStatusTag(status)}
                <Select
                  // style={{ width: 150 }}
                  style={{ width: 75, padding: 0 }}
                  placeholder="Update Status"
                  onChange={(newStatus) =>
                    updateRequestStatus(record.id, newStatus)
                  }
                  defaultValue={status}
                >
                  {/* Chỉ hiển thị các trạng thái khác "Draft" */}
                  <Option value="Processing">Processing</Option>
                  <Option value="Delivered">Delivered</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="Canceled">Canceled</Option>
                  <Option value="Failed">Failed</Option>
                </Select>
              </Space>
            ),
          },
          { title: "Create Date", dataIndex: "createDate", key: "createDate" },
          {
            title: "Approve Date",
            dataIndex: "approveDate",
            key: "approveDate",
          },
          {
            title: "Deliver Date",
            dataIndex: "deliverDate",
            key: "deliverDate",
          },
        ]}
        loading={loading}
        pagination={{
          current: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          total: pagination.totalItemsCount,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
};

export default RequestManagement;
