// export default RequestManagement;
import { Button, Image, message, Modal, Select, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import useAxios from "../../../services/CustomizeAxios";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
          StoreId: userInfor?.workAtWarehouseId,
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

        message.success(t("Data_loaded_successfully"));
      } else {
        message.error(t("No_data_returned_from_the_server"));
      }
    } catch (error) {
      console.error(t("Error_fetching_requests"), error);
      message.error(
        t("Failed_to_fetch_requests_Please_check_the_Warehouse_ID")
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A"; // Return "Null" if the input is falsy

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
          StoreId: userInfor?.workAtWarehouseId,
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

        message.success(t("Data_loaded_successfully"));
      } else {
        message.error(t("No_data_returned_from_the_server"));
      }
    } catch (error) {
      console.error(t("Error_fetching_requests"), error);
      message.error(
        t("Failed_to_fetch_requests_Please_check_the_Warehouse_ID")
      );
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

    return <Tag color={colorMap[status] || "default"}>{t(status)}</Tag>;
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
        return [t("Pending")]; // Request Created
      case "Pending":
        return [t("Processing")]; // Staff confirmed or OCOP Partner Cancelled
      case "Processing":
        return [t("Delivered")]; // OCOP Partner Delivered or Deliver window expire
      case "Delivered":
        return [t("Failed"), t("Completed")]; // Item stored
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
        return [t("Pending")]; // Request Created
      case "Pending":
        return [t("Processing"), t("Cancelled")]; // Staff confirmed or OCOP Partner Cancelled
      case "Processing":
        return [t("Delivered"), t("Failed")]; // OCOP Partner Delivered or Deliver window expire
      case "Delivered":
        return [t("Completed")]; // Item stored
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
          t("Invalid_status_transition", {
            current: t(currentRequest.status),
            next: t(newStatus),
          })
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
        message.success(t("Status_updated_successfully"));
        fetchRequests(); // Refresh request list
        setIsModalVisible(false);
      } else {
        const errorMessage =
          response?.data?.message || t("Failed_to_update_status");
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(
        error.response?.data?.message || t("Failed_to_update_status_try_again")
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
          t("Invalid_status_transition", {
            current: t(currentRequest.status),
            next: t(newStatus),
          })
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
        message.success(t("Status_updated_successfully"));
        fetchRequestExports();
        setIsModalVisibleExport(false);
      } else {
        const errorMessage =
          response?.data?.message || t("Failed_to_update_status");
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(
        error.response?.data?.message || t("Failed_to_update_status_try_again")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-[20px] overflow-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {t("Request_Management")}
        </h1>

        {/* Dropdown lựa chọn giữa Import và Export */}
        <div className="flex mb-6">
          <Select
            defaultValue="import"
            style={{ width: 220 }}
            onChange={(value) => setSelectedView(value)}
            className="rounded-lg shadow-md"
          >
            <Option value="import">{t("Import_Requests")}</Option>
            <Option value="export">{t("Export_Requests")}</Option>
          </Select>
        </div>

        {/* Hiển thị bảng Import hoặc Export dựa trên lựa chọn */}
        {selectedView === "import" && (
          <>
            <h2 className="text-lg font-bold">
              {t("Import_Request_Management")}
            </h2>
            <Table
              dataSource={requests}
              columns={[
                // { title: t("Request_ID"), dataIndex: "id", key: "id" },
                {
                  title: t("Partner_Email"),
                  dataIndex: "partner_email",
                  key: "partner_email",
                },
                { title: t("Request_Name"), dataIndex: "name", key: "name" },
                {
                  title: t("Product_Name"),
                  dataIndex: "productName",
                  key: "productName",
                  filters: Array.from(
                    new Set(
                      (requests || [])
                        .map((item) => item.productName)
                        .filter((name) => name)
                    )
                  ).map((name) => ({ text: name, value: name })),
                  onFilter: (value, record) => record.productName === value,
                },
                {
                  title: t("Request_Type"),
                  dataIndex: "requestType",
                  key: "requestType",
                },
                {
                  title: t("Status"),
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
                        <Option value="Pending">{t("Pending")}</Option>
                        <Option value="Processing">{t("Processing")}</Option>
                        <Option value="Failed">{t("Failed")}</Option>
                        <Option value="Delivered">{t("Delivered")}</Option>
                        <Option value="Canceled">{t("Canceled")}</Option>
                        <Option value="Completed">{t("Completed")}</Option>
                      </Select>
                    </div>
                  ),
                  onFilter: (value, record) => record.status === value,
                  render: (status) => renderStatusTag(status),
                },
                {
                  title: t("Create_Date"),
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
                  title: t("Action"),
                  dataIndex: "",
                  key: "x",
                  render: (_, record) => (
                    <div className="flex flex-col gap-2 items-center">
                      <Button
                        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        onClick={() => showRequestDetail(record)}
                      >
                        {t("View_Details")}
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
            <h2 className="text-lg font-bold">
              {t("Export_Request_Management")}
            </h2>
            <Table
              dataSource={requestExports}
              columns={[
                { title: t("Request_ID"), dataIndex: "id", key: "id" },
                {
                  title: t("Partner_Email"),
                  dataIndex: "partner_email",
                  key: "partner_email",
                },
                { title: t("Request_Name"), dataIndex: "name", key: "name" },
                {
                  title: t("Product_Name"),
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
                  title: t("Request_Type"),
                  dataIndex: "requestType",
                  key: "requestType",
                },
                {
                  title: t("Warehouse_Name"),
                  dataIndex: "warehouseName",
                  key: "warehouseName",
                },
                {
                  title: t("Status"),
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
                        <Option value="Pending">{t("Pending")}</Option>
                        <Option value="Processing">{t("Processing")}</Option>
                        <Option value="Failed">{t("Failed")}</Option>
                        <Option value="Delivered">{t("Delivered")}</Option>
                        <Option value="Canceled">{t("Canceled")}</Option>
                        <Option value="Completed">{t("Completed")}</Option>
                      </Select>
                    </div>
                  ),
                  onFilter: (value, record) => record.status === value,
                  render: (status) => renderStatusTag(status),
                },
                {
                  title: t("Create_Date"),
                  dataIndex: "createDate",
                  key: "createDate",
                  sorter: (a, b) =>
                    new Date(a.createDate) - new Date(b.createDate),
                  sortDirections: ["descend", "ascend"],
                  render: (text) => formatDateTime(text),
                },
                {
                  title: t("Action"),
                  dataIndex: "",
                  key: "x",
                  render: (_, record) => (
                    <div className="flex flex-col gap-2 items-center">
                      <Button
                        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        onClick={() => showRequestDetailExport(record)}
                      >
                        {t("View_Details")}
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
        title={t("Import_Request_Details")}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            {t("Close")}
          </Button>,
        ]}
      >
        {selectedRequest && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div>
                <Image
                  src={selectedRequest.productImage}
                  alt={t("Request_Image")}
                  className="w-full"
                />
              </div>
              <label htmlFor="statusSelect" className="font-bold">
                {t("Update_Status")}:
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
                      {t(status)}
                    </Option>
                  )
                )}
              </Select>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="font-bold">{t("Request_ID")}:</p>
                  <p>{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Partner_Email")}:</p>
                  <p>{selectedRequest.partner_email}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Status")}:</p>
                  <p>{renderStatusTag(selectedRequest.status)}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Description")}:</p>
                  <p>{selectedRequest.description}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Lot_Amount")}:</p>
                  <p>{selectedRequest.lotAmount}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Product_Per_Lot_Amount")}:</p>
                  <p>{selectedRequest.productPerLotAmount} Unit</p>
                </div>
                <div>
                  <p className="font-bold">{t("Total_Product_Amount")}:</p>
                  <p>{selectedRequest.totalProductAmount}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Create_Date")}:</p>
                  <p>{formatDateTime(selectedRequest.createDate)}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Approve_Date")}:</p>
                  <p>{formatDateTime(selectedRequest.apporveDate)}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Delivery_Date")}:</p>
                  <p>{formatDateTime(selectedRequest.deliverDate)}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Cancel_Date")}:</p>
                  <p>{formatDateTime(selectedRequest.cancelDate)}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Cancel_Reason")}:</p>
                  <p>{selectedRequest.cancellationReason || t("N/A")}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Warehouse_Name")}:</p>
                  <p>{selectedRequest.storeName}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Inventory_Name")}:</p>
                  <p>{selectedRequest.sendToRoomName}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Lot_ID")}:</p>
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
        title={t("Export_Request_Details")}
        open={isModalExportVisible}
        onCancel={handleModalExportClose}
        footer={[
          <Button key="close" onClick={handleModalExportClose}>
            {t("Close")}
          </Button>,
        ]}
      >
        {selectedExportRequest && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div>
                <Image
                  src={selectedExportRequest.productImage}
                  alt={t("Request_Image")}
                  className="w-full"
                />
              </div>
              <label htmlFor="statusSelect" className="font-bold">
                {t("Update_Status")}:
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
                    {t(status)}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="font-bold">{t("Request_ID")}:</p>
                  <p>{selectedExportRequest.id}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Partner_Email")}:</p>
                  <p>{selectedExportRequest.partner_email}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Status")}:</p>
                  <p>{renderStatusTag(selectedExportRequest.status)}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Product_Name")}:</p>
                  <p>{selectedExportRequest.productName}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Description")}:</p>
                  <p>{selectedExportRequest.description}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Lot_Amount")}:</p>
                  <p>{selectedExportRequest.lotAmount}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Product_Per_Lot_Amount")}:</p>
                  <p>{selectedExportRequest.productPerLotAmount} Unit</p>
                </div>
                <div>
                  <p className="font-bold">{t("Total_Product_Amount")}:</p>
                  <p>{selectedExportRequest.totalProductAmount}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Create_Date")}:</p>
                  <p>{formatDateTime(selectedExportRequest.createDate)}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Approve_Date")}:</p>
                  <p>{formatDateTime(selectedExportRequest.apporveDate)}</p>
                </div>
                <div>
                  <p className="font-bold">{t("Delivery_Date")}:</p>
                  <p>{formatDateTime(selectedExportRequest.deliverDate)}</p>
                </div>

                <div>
      <p className="font-bold">{t("Cancel_Date")}:</p>
      <p>{formatDateTime(selectedExportRequest.cancelDate)}</p>
    </div>
    <div>
      <p className="font-bold">{t("Cancel_Reason")}:</p>
      <p>{selectedExportRequest.cancellationReason || t("N/A")}</p>
    </div>
    <div>
      <p className="font-bold">{t("New_Warehouse_Name")}:</p>
      <p>{selectedExportRequest.storeName}</p>
    </div>
    <div>
      <p className="font-bold">{t("New_Inventory_Name")}:</p>
      <p>{selectedExportRequest.sendToRoomName}</p>
    </div>
    <div>
      <p className="font-bold">{t("New_Lot_ID")}:</p>
      <p>{selectedExportRequest.lotId}</p>
    </div>
    <div>
      <p className="font-bold">{t("Old_Warehouse_Name")}:</p>
      <p>{selectedExportRequest.exportFromStoreName}</p>
    </div>
    <div>
      <p className="font-bold">{t("Old_Inventory_Name")}:</p>
      <p>{selectedExportRequest.exportFromRoomName}</p>
    </div>
    <div>
      <p className="font-bold">{t("Old_Lot_ID")}:</p>
      <p>{selectedExportRequest.exportFromLotId}</p>
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
