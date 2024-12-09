// export default RequestManagement;
import { Button, Image, message, Modal, Select, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import useAxios from "../../../services/CustomizeAxios";

const { Option } = Select;

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [requestExports, setRequestExports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [pagination, setPagination] = useState({
    totalItemsCount: 0,
    pageSize: 10,
    totalPagesCount: 0,
    pageIndex: 0,
  });
  const [paginationExport, setPaginationExport] = useState({
    totalItemsCount: 0,
    pageSize: 10,
    totalPagesCount: 0,
    pageIndex: 0,
  });
  const { fetchDataBearer } = useAxios();
  const [statusFilter, setStatusFilter] = useState(null);

  useEffect(() => {
    fetchRequests(0);
    fetchRequestExports(0);
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
          import: true,
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

  const fetchRequestExports = async (pageIndex = 0) => {
    setLoadingExport(true);
    try {
      console.log(userInfor?.workAtWarehouseId);

      const response = await fetchDataBearer({
        url: `/request/get-requests`,
        method: "GET",
        params: {
          warehouseId: userInfor?.workAtWarehouseId,
          pageIndex,
          pageSize: pagination.pageSize,
          import: false,
        },
      });

      if (response && response.data) {
        const { totalItemsCount, pageSize, totalPagesCount, pageIndex, items } =
          response.data;

        // Lọc các yêu cầu không có trạng thái "Draft"
        const filteredItems = items.filter((item) => item.status !== "Draft");

        setRequestExports(
          filteredItems.map((item) => ({
            key: item.id,
            ...item,
          }))
        );

        setPaginationExport({
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
      setLoadingExport(false);
    }
  };

  const handlePageChange = (page) => {
    fetchRequests(page - 1);
  };

  const handlePageChangeExport = (page) => {
    fetchRequestExports(page - 1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
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
        return ["Processing"]; // Staff confirmed or OCOP Partner Cancelled
      case "Processing":
        return ["Delivered", "Failed"]; // OCOP Partner Delivered or Deliver window expire
      case "Delivered":
        return ["Failed", "Completed"]; // Item stored
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
        fetchRequestExports();
        setIsModalVisible(false);
        // if (selectedRequest?.id === id) {
        //   setSelectedRequest({ ...selectedRequest, status: newStatus }); // Update modal if open
        // }
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
      <div className="p-[20px]">
        <h1>Import Request Management</h1>

        {/* Request Import Table */}
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
              title: "Product Name",
              dataIndex: "productName",
              key: "productName",
            },
            {
              title: "Request Type",
              dataIndex: "requestType",
              key: "requestType",
            },
            // {
            //   title: "Warehouse Name",
            //   dataIndex: "warehouseName",
            //   key: "warehouseName",
            // },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
              }) => (
                <div style={{ padding: 8 }}>
                  <Select
                    style={{ width: 120 }}
                    value={selectedKeys[0]}
                    onChange={(value) => {
                      setSelectedKeys(value ? [value] : []);
                      confirm();
                    }}
                    allowClear
                  >
                    <Option value="Pending">Pending</Option>
                    <Option value="Processing">Processing</Option>
                    <Option value="Failed">Failed</Option>
                    <Option value="Delivered">Delivered</Option>
                    <Option value="Canceled">Canceled</Option>
                    <Option value="Completed">Completed</Option>
                  </Select>
                </div>
              ),
              onFilter: (value, record) => record.status === value,
              render: (status) => renderStatusTag(status),
            },
            {
              title: "Create Date",
              dataIndex: "createDate",
              key: "createDate",
              render: (text) => {
                if (!text) return ""; // Kiểm tra trường hợp giá trị null hoặc undefined

                const date = new Date(text);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cần cộng 1
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");

                return `${day}/${month}/${year} ${hours}:${minutes}`;
              },
            },
            {
              title: "Approve Date",
              dataIndex: "apporveDate", // Sửa typo ở đây
              key: "apporveDate",
              render: (text) => {
                if (!text) return ""; // Trả về chuỗi rỗng nếu không có giá trị
                const date = new Date(text);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cần cộng 1
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");

                return `${day}/${month}/${year} ${hours}:${minutes}`;
              },
            },
            {
              title: "Deliver Date",
              dataIndex: "deliverDate",
              key: "deliverDate",
              render: (text) => {
                if (!text) return ""; // Kiểm tra nếu giá trị không tồn tại, trả về chuỗi rỗng
                const date = new Date(text);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cần cộng 1
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");

                return `${day}/${month}/${year} ${hours}:${minutes}`;
              },
            },
            {
              title: "Cancel Date",
              dataIndex: "cancelDate",
              key: "cancelDate",
              render: (text) => {
                if (!text) return ""; // Kiểm tra nếu giá trị không tồn tại, trả về chuỗi rỗng
                const date = new Date(text);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cần cộng 1
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");

                return `${day}/${month}/${year} ${hours}:${minutes}`;
              },
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

        <h1>Export Request Management</h1>

        {/* Request Export Table */}
        <Table
          dataSource={requestExports}
          columns={[
            { title: "Request ID", dataIndex: "id", key: "id" },
            {
              title: "Partner Email",
              dataIndex: "partner_email",
              key: "partner_email",
            },
            { title: "Request Name", dataIndex: "name", key: "name" },
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
              filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
              }) => (
                <div style={{ padding: 8 }}>
                  <Select
                    style={{ width: 120 }}
                    value={selectedKeys[0]}
                    onChange={(value) => {
                      setSelectedKeys(value ? [value] : []);
                      confirm();
                    }}
                    allowClear
                  >
                    <Option value="Pending">Pending</Option>
                    <Option value="Processing">Processing</Option>
                    <Option value="Failed">Failed</Option>
                    <Option value="Delivered">Delivered</Option>
                    <Option value="Canceled">Canceled</Option>
                    <Option value="Completed">Completed</Option>
                  </Select>
                </div>
              ),
              onFilter: (value, record) => record.status === value,
              render: (status) => renderStatusTag(status),
            },
            {
              title: "Create Date",
              dataIndex: "createDate",
              key: "createDate",
              render: (text) => {
                if (!text) return ""; // Kiểm tra trường hợp giá trị null hoặc undefined

                const date = new Date(text);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cần cộng 1
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");

                return `${day}/${month}/${year} ${hours}:${minutes}`;
              },
            },
            {
              title: "Approve Date",
              dataIndex: "apporveDate", // Fix the typo here from 'apporveDate' to 'approveDate'
              key: "apporveDate",
              render: (text) => {
                if (!text) return ""; // Trả về chuỗi rỗng nếu không có giá trị
                const date = new Date(text);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cần cộng 1
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");

                return `${day}/${month}/${year} ${hours}:${minutes}`;
              },
            },

            {
              title: "Deliver Date",
              dataIndex: "deliverDate",
              key: "deliverDate",
              render: (text) => {
                if (!text) return ""; // Kiểm tra nếu giá trị không tồn tại, trả về chuỗi rỗng
                const date = new Date(text);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cần cộng 1
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");

                return `${day}/${month}/${year} ${hours}:${minutes}`;
              },
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
          loading={loadingExport}
          pagination={{
            current: paginationExport.pageIndex + 1,
            pageSize: paginationExport.pageSize,
            total: paginationExport.totalItemsCount,
            onChange: handlePageChangeExport,
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
                {/* <div>
                  <p className="font-bold">Receiver Address:</p>
                  <p>{selectedRequest.receiverAddress}</p>
                </div> */}
                <div>
                  <p className="font-bold">Create Date:</p>
                  <p>
                    {(() => {
                      const date = new Date(selectedRequest.createDate);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      ); // Tháng bắt đầu từ 0, cần cộng 1
                      const year = date.getFullYear();
                      const hours = String(date.getHours()).padStart(2, "0");
                      const minutes = String(date.getMinutes()).padStart(
                        2,
                        "0"
                      );

                      return `${day}/${month}/${year} ${hours}:${minutes}`;
                    })()}
                  </p>
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
                  <p className="font-bold">Lot ID:</p>
                  <p>{selectedRequest.lotId}</p>
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
