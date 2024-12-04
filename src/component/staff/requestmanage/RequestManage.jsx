// export default RequestManagement;
import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Input,
  Space,
  Button,
  message,
  Select,
  Modal,
  Image,
} from "antd";
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

  // const updateRequestStatus = async (id, newStatus) => {
  //   if (!newStatus) {
  //     message.error("Please select a new status!");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     // Log dữ liệu trước khi gửi
  //     console.log("Updating status for ID:", id, "to new status:", newStatus);

  //     const response = await fetchDataBearer({
  //       url: `/request/update-request-status/${id}?status=${newStatus}`,
  //       method: "PUT",
  //     });

  //     if (response && response.status === 200) {
  //       message.success("Status updated successfully!");
  //       fetchRequests(pagination.pageIndex); // Làm mới bảng sau khi cập nhật
  //     } else {
  //       const errorMessage =
  //         response?.data?.message || "Failed to update status.";
  //       message.error(errorMessage);
  //     }
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //     message.error(
  //       error.response?.data?.message ||
  //         "Failed to update status. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  // Show request detail
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const showRequestDetail = (request) => {
    setSelectedRequest(request);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRequest(null);
  };

  // Add this function to check valid status transitions for requests
  const getValidStatusTransitions = (currentStatus) => {
    switch (currentStatus) {
      case "Draft":
        return ["Pending"]; // Request Created
      case "Pending":
        return ["Processing", "Cancelled"]; // Staff confirmed or OCOP Partner Cancelled
      case "Processing":
        return [ "Delivered","Failed"]; // OCOP Partner Delivered or Deliver window expire
      case "Delivered":
        return ["Failed","Completed"]; // Item stored
      case "Failed":
      case "Completed":
      case "Cancelled":
        return []; // Final states - no further transitions allowed
      default:
        return [];
    }
  };

  // Update the status update function to validate transitions
  const updateRequestStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      const currentRequest = requests.find((request) => request.id === id);
      const validTransitions = getValidStatusTransitions(currentRequest.status);

      if (!validTransitions.includes(newStatus)) {
        message.error(
          `Invalid status transition from ${currentRequest.status} to ${newStatus}`
        );
        return;
      }

      const response = await fetchDataBearer({
        url: `/request/update-request-status/${id}`,
        method: "PUT",
        params: {
          status: newStatus,
        },
      });

      if (response && response.status === 200) {
        message.success("Status updated successfully!");
        fetchRequests(); // Refresh request list
        setIsModalVisible(false);
        if (selectedRequest?.id === id) {
          setSelectedRequest({ ...selectedRequest, status: newStatus }); // Update modal if open
        }
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

  return (
    <>
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
            // {
            //   title: "Description",
            //   dataIndex: "description",
            //   key: "description",
            // },
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
                <div className="flex flex-col gap-2 items-center">
                  {renderStatusTag(status)} {/* Hiển thị status tag */}
                </div>
              ),
            },
            {
              title: "Create Date",
              dataIndex: "createDate",
              key: "createDate",
              render: (text) => text?.split("T")[0], // Chỉ hiển thị ngày
            },
            {
              title: "Approve Date",
              dataIndex: "approveDate",
              key: "approveDate",
              render: (text) => text?.split("T")[0], // Chỉ hiển thị ngày
            },
            {
              title: "Deliver Date",
              dataIndex: "deliverDate",
              key: "deliverDate",
              render: (text) => text?.split("T")[0], // Chỉ hiển thị ngày
            },
            {
              title: "Action",
              dataIndex: "",
              key: "x",
              render: (_, record) => (
                <div className="flex flex-col gap-2 items-center">
                  <Button
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                    onClick={() => showRequestDetail(record)} // Hien thi chi tiet
                  >
                    View Details
                  </Button>
                </div>
              ),
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
      <Modal
        title="Request Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {selectedRequest && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div>
                <Image
                  src={selectedRequest.productImage}
                  alt="Request Image"
                  className="w-full"
                />
              </div>
              <label htmlFor="statusSelect" className="font-bold">
                Update Status:
              </label>
              <Select
                id="statusSelect"
                className="w-full"
                value={selectedRequest.status}
                onChange={(newStatus) =>
                  updateRequestStatus(selectedRequest.id, newStatus)
                }
                disabled={
                  getValidStatusTransitions(selectedRequest.status).length === 0
                }
              >
                {getValidStatusTransitions(selectedRequest.status).map(
                  (status) => (
                    <Option key={status} value={status}>
                      {status}
                    </Option>
                  )
                )}
              </Select>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="font-bold">Request ID:</p>
                  <p>{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="font-bold">Partner Email:</p>
                  <p>{selectedRequest.partner_email}</p>
                </div>
                <div>
                  <p className="font-bold">Status:</p>
                  <p>{renderStatusTag(selectedRequest.status)}</p>
                </div>
                <div>
                  <p className="font-bold">Description:</p>
                  <p>{selectedRequest.description}</p>
                </div>
                <div>
                  <p className="font-bold">Receiver Address:</p>
                  <p>{selectedRequest.receiverAddress}</p>
                </div>
                <div>
                  <p className="font-bold">Date:</p>
                  <p>{selectedRequest.createDate.split("T")[0]}</p>
                </div>
                {/* <div>
                  <p className="font-bold">Total Price:</p>
                  <p>${selectedRequest.totalPrice}</p>
                </div> */}
                <div>
                  <p className="font-bold">Warehouse Name:</p>
                  <p>{selectedRequest.warehouseName}</p>
                </div>
                <div>
                  <p className="font-bold">Warehouse Location:</p>
                  <p>{selectedRequest.warehouseLocation}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RequestManagement;
