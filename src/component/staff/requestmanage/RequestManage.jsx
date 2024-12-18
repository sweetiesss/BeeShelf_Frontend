// export default RequestManagement;
import { Button, Image, message, Modal, Select, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import useAxios from "../../../services/CustomizeAxios";

const { Option } = Select;

const RequestManagement = () => {
  const [selectedView, setSelectedView] = useState("import");
  const [requests, setRequests] = useState([]);
  const [requestExports, setRequestExports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [pagination, setPagination] = useState({
    totalItemsCount: 0,
    pageSize: 8,
    totalPagesCount: 0,
    pageIndex: 0,
  });
  const [paginationExport, setPaginationExport] = useState({
    totalItemsCount: 0,
    pageSize: 8,
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
  const formatDateTime = (dateString) => {
    if (!dateString) return "Null"; // Return "Null" if the input is falsy

    // Tạo một đối tượng Date với múi giờ Asia/Bangkok (UTC+7)
    const dateInBangkok = new Date(
      new Date(dateString).toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );

    // Cộng thêm 7 tiếng (7 giờ * 60 phút * 60 giây * 1000 ms)
    const dateWithExtra7Hours = new Date(
      dateInBangkok.getTime() + 7 * 60 * 60 * 1000
    );

    // Format the date part
    const formattedDate = dateWithExtra7Hours.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Format the time part
    const formattedTime = dateWithExtra7Hours.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      // second: "2-digit",
      hour12: false,
    });

    return `${formattedDate} ${formattedTime}`;
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

  // Show import request detail
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

  // Show export request detail
  const [isModalExportVisible, setIsModalVisibleExport] = useState(false);
  const [selectedExportRequest, setSelectedRequestExport] = useState(null);

  const showRequestDetailExport = (request) => {
    setSelectedRequestExport(request);
    setIsModalVisibleExport(true);
  };

  const handleModalExportClose = () => {
    setIsModalVisibleExport(false);
    setSelectedRequestExport(null);
  };

  // Add this function to check valid status transitions for requests
  const getValidStatusTransitions = (currentStatus) => {
    switch (currentStatus) {
      case "Draft":
        return ["Pending"]; // Request Created
      case "Pending":
        return ["Processing"]; // Staff confirmed or OCOP Partner Cancelled
      case "Processing":
        return ["Delivered"]; // OCOP Partner Delivered or Deliver window expire
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

  // Add this function to check valid status transitions for requests
  const getValidExportStatusTransitions = (currentStatus) => {
    switch (currentStatus) {
      case "Draft":
        return ["Pending"]; // Request Created
      case "Pending":
        return ["Processing", "Cancelled"]; // Staff confirmed or OCOP Partner Cancelled
      case "Processing":
        return ["Delivered", "Failed"]; // OCOP Partner Delivered or Deliver window expire
      case "Delivered":
        return ["Completed"]; // Item stored
      case "Failed":
      case "Completed":
      case "Cancelled":
      case "Returned":
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
          staffId: userInfor?.id,
        },
      });

      if (response && response.status === 200) {
        message.success("Status updated successfully!");
        fetchRequests(); // Refresh request list
        setIsModalVisible(false);
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

  // Update the status update function to validate transitions
  const updateExportRequestStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      const currentRequest = requestExports.find(
        (request) => request.id === id
      );
      const validTransitions = getValidExportStatusTransitions(
        currentRequest.status
      );

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
          staffId: userInfor?.id,
          status: newStatus,
        },
      });

      if (response && response.status === 200) {
        message.success("Status updated successfully!");
        fetchRequestExports();
        setIsModalVisibleExport(false);
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
      <div className="p-[20px] overflow-auto">
        <h1 className="text-4xl font-bold text-gray-800  mb-8">
          Request Management
        </h1>

        {/* Dropdown lựa chọn giữa Import và Export */}
        <div className="flex  mb-6">
          <Select
            defaultValue="import"
            style={{ width: 220 }}
            onChange={(value) => setSelectedView(value)}
            className="rounded-lg shadow-md"
          >
            <Option value="import">Import Requests</Option>
            <Option value="export">Export Requests</Option>
          </Select>
        </div>

        {/* Hiển thị bảng Import hoặc Export dựa trên lựa chọn */}
        {selectedView === "import" && (
          <>
            <h2 className="text-lg font-bold">Import Request Management</h2>
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
                  filters: Array.from(
                    new Set(
                      (requests || [])
                        .map((item) => item.productName)
                        .filter((name) => name) // Lọc ra những giá trị hợp lệ (không null/undefined)
                    )
                  ).map((name) => ({ text: name, value: name })), // Tạo mảng filters từ productName duy nhất
                  onFilter: (value, record) => record.productName === value, // Lọc theo productName
                },

                {
                  title: "Request Type",
                  dataIndex: "requestType",
                  key: "requestType",
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
                  sorter: (a, b) =>
                    new Date(a.createDate) - new Date(b.createDate),
                  sortDirections: ["descend", "ascend"],
                  render: (text) => {
                    if (!text) return ""; // Kiểm tra trường hợp giá trị null hoặc undefined

                    return <>{formatDateTime(text)}</>;
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
                        onClick={() => showRequestDetail(record)}
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
          </>
        )}

        {/* Hiển thị bảng Export khi selectedView === "export" */}
        {selectedView === "export" && (
          <>
            <h2 className="text-lg font-bold">Export Request Management</h2>
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
                  filters: Array.from(
                    new Set(
                      (requests || [])
                        .map((item) => item.productName)
                        .filter((name) => name) // Lọc ra những giá trị hợp lệ (không null/undefined)
                    )
                  ).map((name) => ({ text: name, value: name })), // Tạo mảng filters từ productName duy nhất
                  onFilter: (value, record) => record.productName === value, // Lọc theo productName
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
                  sorter: (a, b) =>
                    new Date(a.createDate) - new Date(b.createDate),
                  sortDirections: ["descend", "ascend"],
                  render: (text) => formatDateTime(text),
                },
                {
                  title: "Action",
                  dataIndex: "",
                  key: "x",
                  render: (_, record) => (
                    <div className="flex flex-col gap-2 items-center">
                      <Button
                        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        onClick={() => showRequestDetailExport(record)}
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
          </>
        )}
      </div>

      <Modal
        title="Import Request Details"
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
                  <p className="font-bold">Lot Amount:</p>
                  <p>{selectedRequest.lotAmount}</p>
                </div>
                <div>
                  <p className="font-bold">Product Per Lot Amount:</p>
                  <p>{selectedRequest.productPerLotAmount}</p>
                </div>
                <div>
                  <p className="font-bold">Total Product Amount:</p>
                  <p>{selectedRequest.totalProductAmount}</p>
                </div>
                <div>
                  <p className="font-bold">Create Date:</p>
                  <p>{formatDateTime(selectedRequest.createDate)}</p>
                </div>

                <div>
                  <p className="font-bold">Approve Date:</p>
                  <p>{formatDateTime(selectedRequest.apporveDate)}</p>
                </div>

                <div>
                  <p className="font-bold">Delivery Date:</p>
                  <p>{formatDateTime(selectedRequest.deliverDate)}</p>
                </div>

                <div>
                  <p className="font-bold">Cancel Date:</p>
                  <p>{formatDateTime(selectedRequest.cancelDate)}</p>
                </div>
                <div>
                  <p className="font-bold">Cancel Reason:</p>
                  <p>{selectedRequest.cancellationReason || "Null"}</p>
                </div>

                <div>
                  <p className="font-bold">Warehouse Name:</p>
                  <p>{selectedRequest.warehouseName}</p>
                </div>
                <div>
                  <p className="font-bold">Inventory Name:</p>
                  <p>{selectedRequest.sendToInventoryName}</p>
                </div>
                <div>
                  <p className="font-bold">Lot ID:</p>
                  <p>{selectedRequest.lotId}</p>
                </div>
               
                {/* <div>
                  <p className="font-bold">Export To Lot ID:</p>
                  <p>{selectedRequest.exportFromLotId}</p>
                </div> */}
                {/* <div>
                  <p className="font-bold">Inventory ID:</p>
                  <p>{selectedRequest.sendToInventoryId}</p>
                </div> */}
                
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Export Request Details"
        open={isModalExportVisible}
        onCancel={handleModalExportClose}
        footer={[
          <Button key="close" onClick={handleModalExportClose}>
            Close
          </Button>,
        ]}
      >
        {selectedExportRequest && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div>
                <Image
                  src={selectedExportRequest.productImage}
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
                value={selectedExportRequest.status}
                onChange={(newStatus) =>
                  updateExportRequestStatus(selectedExportRequest.id, newStatus)
                }
                disabled={
                  getValidExportStatusTransitions(selectedExportRequest.status)
                    .length === 0
                }
              >
                {getValidExportStatusTransitions(
                  selectedExportRequest.status
                ).map((status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="font-bold">Request ID:</p>
                  <p>{selectedExportRequest.id}</p>
                </div>
                <div>
                  <p className="font-bold">Partner Email:</p>
                  <p>{selectedExportRequest.partner_email}</p>
                </div>
                <div>
                  <p className="font-bold">Status:</p>
                  <p>{renderStatusTag(selectedExportRequest.status)}</p>
                </div>
                
                <div>
                  <p className="font-bold">Product Name:</p>
                  <p>{selectedExportRequest.productName}</p>
                </div> 
                <div>
                  <p className="font-bold">Description:</p>
                  <p>{selectedExportRequest.description}</p>
                </div>
                <div>
                  <p className="font-bold">Lot Amount:</p>
                  <p>{selectedExportRequest.lotAmount}</p>
                </div>
                <div>
                  <p className="font-bold">Product Per Lot Amount:</p>
                  <p>{selectedExportRequest.productPerLotAmount}</p>
                </div>
                <div>
                  <p className="font-bold">Total Product Amount:</p>
                  <p>{selectedExportRequest.totalProductAmount}</p>
                </div>
                <div>
                  <p className="font-bold">Create Date:</p>
                  <p>{formatDateTime(selectedExportRequest.createDate)}</p>
                </div>

                <div>
                  <p className="font-bold">Approve Date:</p>
                  <p>{formatDateTime(selectedExportRequest.apporveDate)}</p>
                </div>

                <div>
                  <p className="font-bold">Delivery Date:</p>
                  <p>{formatDateTime(selectedExportRequest.deliverDate)}</p>
                </div>

                <div>
                  <p className="font-bold">Cancel Date:</p>
                  <p>{formatDateTime(selectedExportRequest.cancelDate)}</p>
                </div>
                <div>
                  <p className="font-bold">Cancel Reason:</p>
                  <p>{selectedExportRequest.cancellationReason || "Null"}</p>
                </div>

                <div>
                  <p className="font-bold">New Warehouse Name:</p>
                  <p>{selectedExportRequest.warehouseName}</p>
                </div>
                <div>
                  <p className="font-bold">New Inventory Name:</p>
                  <p>{selectedExportRequest.sendToInventoryName}</p>
                </div>
                <div>
                  <p className="font-bold">New Lot ID:</p>
                  <p>{selectedExportRequest.lotId}</p>
                </div>
                {/* <div>
                  <p className="font-bold">Old Inventory ID:</p>
                  <p>{selectedExportRequest.sendToInventoryId}</p>
                </div> */}
                <div>
                  <p className="font-bold">Old Warehouse Name:</p>
                  <p>{selectedExportRequest.exportFromWarehouseName}</p>
                </div>
                <div>
                  <p className="font-bold">Old Inventory Name:</p>
                  <p>{selectedExportRequest.exportFromInventoryName}</p>
                </div>
                <div>
                  <p className="font-bold">Old Lot ID:</p>
                  <p>{selectedExportRequest.exportFromLotId}</p>
                </div>
                {/* <div>
                  <p className="font-bold">New Inventory ID:</p>
                  <p>{selectedExportRequest.exportFromLotId}</p>
                </div> */}
                
               
                
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RequestManagement;
