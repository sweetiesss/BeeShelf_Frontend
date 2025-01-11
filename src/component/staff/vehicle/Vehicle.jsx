/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from "react";
import { Table, message, Spin, Button, Input, Modal, Form, Select } from "antd";
import { useParams } from "react-router-dom";
import useAxios from "../../../services/CustomizeAxios";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Vehicle = () => {
  const { userInfor } = useAuth(); // Lấy thông tin user từ hook useAuth
  const { moneyTransferId: urlPaymentId } = useParams(); // Lấy paymentId từ URL
  const [moneyTransferId, setPaymentId] = useState(urlPaymentId || ""); // Trạng thái cho paymentId (lấy từ URL nếu có)
  const [vehicleId, setVehicleId] = useState("");
  const [shipperId, setShipperId] = useState("");
  const [visible, setVisible] = useState(false); // Trạng thái hiển thị modal
  const [vehicles, setVehicles] = useState([]);
  const [vehicleIdOptions, setVehicleIdOptions] = useState([]); // Trạng thái cho danh sách paymentId options
  const [shippperIdOptions, setShipperIdOptions] = useState(["anh", "ss"]); // Trạng thái cho danh sách paymentId options
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [pagination, setPagination] = useState({
    totalItemsCount: 0,
    pageSize: 8,
    totalPagesCount: 0,
    pageIndex: 0,
  });
  const { fetchDataBearer } = useAxios();
  const typeVehicles = ["Truck", "Van", "Motorcycle"];
  const { t } = useTranslation();

  // Hàm gọi API để lấy danh sách thanh toán
  const fetchVehicles = async (pageIndex, pageSize) => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: `/vehicle/get-vehicles`,
        method: "GET",
        params: {
          warehouseId: userInfor?.workAtWarehouseId,
          descending: false,
          pageIndex: pageIndex,
          pageSize: pageSize,
        },
      });

      if (response && response.data) {
        const { totalItemsCount, pageSize, totalPagesCount, pageIndex, items } =
          response.data;
        setVehicles(items || []);
        message.success(t("Data_loaded_successfully"));

        setPagination({
          totalItemsCount,
          pageSize,
          totalPagesCount,
          pageIndex,
        });

        const options = (items || [])
          ?.filter((vehicle) => vehicle.status === t("Available"))
          ?.filter((item) => !item.assignedDriverId)
          .map((vehicle) => ({
            value: vehicle.id,
            label: `

            ${t("Name_Vehicle")}: ${vehicle.name} - 
            ${t("License_Plate")}: ${vehicle.licensePlate}`,
          }));
        setVehicleIdOptions(options);
      } else {
        message.error(t("No_data_returned_or_invalid_data_format"));
        setVehicles([]); // In case of invalid data, set to empty array
      }
    } catch (error) {
      console.error(t("Error_fetching_payments"), error);
      message.error(t("Failed_to_fetch_payments"));
      setVehicles([]); // Ensure empty array if error occurs
    } finally {
      setLoading(false);
    }
  };

  // Hàm Unassign Vehicle
  const handleUnassignVehicle = async (vehicleId) => {
    try {
      // Giả lập gọi API để unassign vehicle
      await fetchDataBearer({
        url: `/vehicle/unassign-vehicle/${vehicleId}`,
        method: "POST",
      });

      message.success(t("Vehicle_unassigned_successfully"));
      fetchVehicles(pagination.pageIndex, pagination.pageSize); // Refresh the vehicle list
    } catch (error) {
      console.error(t("Error_unassigning_vehicle"), error);
      message.error(t("Failed_to_unassign_vehicle"));
    }
  };

  // Hàm gọi API để assign vehicle mới
  const assignVehicleToShipper = async (vehicleId, shipperId) => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: `/vehicle/assign-driver/${vehicleId}/${shipperId}`,
        method: "POST",
      });

      if (response && response.status === 200) {
        message.success(t("Vehicle_assigned_successfully"));
        fetchVehicles(pagination.pageIndex, pagination.pageSize); // Cập nhật lại danh sách vehicle
        setVisible(false); // Đóng modal khi tạo assign thành công
      } else {
        const errorMessage =
          response?.data?.message || t("Failed_to_confirm_money_transfer");
        message.error(errorMessage);
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || t("Something_went_wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch shippers
  useEffect(() => {
    const fetchShippers = async () => {
      try {
        const storeId = userInfor?.workAtWarehouseId;
        const response = await fetchDataBearer({
          url: "/store/get-store-shippers",
          // url: `/store/get-store-shippers/${storeId}`,
          method: "GET",
          params: {
            hasVehicle: false,
            pageIndex: 0,
            pageSize: 100,
            filterBy: "StoreId",
            filterQuery: storeId,
          },
        });
        setShipperIdOptions(response.data.items);
        console.log("Shipper options set to:", response.data.items);
        console.log("sss", shippperIdOptions);
      } catch (error) {
        console.error(t("Error_fetching_shippers_data"), error);
      }
    };

    // if (userInfor?.workAtWarehouseId) {
    //   fetchShippers();
    // }
    fetchShippers();
  }, []);

  useEffect(() => {
    console.log("Updated shipperIdOptions (state):", shippperIdOptions);
  }, [shippperIdOptions]);

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedVehicle(null);
  };

  const handleViewDetail = async (id) => {
    try {
      const response = await fetchDataBearer({
        url: `/vehicle/get-vehicle/${id}`,
        method: "GET",
      });
      console.log(response);
      setSelectedVehicle(response.data);
      setIsModalVisible(true);
    } catch (error) {
      toast.error(t("Failed_to_fetch_vehicle_data"));
    }
  };
  const columns = [
    // { title: t("ID"), dataIndex: "id", key: "id" },
    {
      title: t("Vehicle_Name"),
      dataIndex: "name",
      key: "name",
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
        <div className="p-2">
          <Select
            className="w-[120px]"
            value={selectedKeys[0]}
            onChange={(value) => {
              setSelectedKeys(value ? [value] : []);
              confirm();
            }}
            allowClear
          >
            <Option value="InService">{t("In_Service")}</Option>
            <Option value="Repair">{t("Repair")}</Option>
            <Option value="Available">{t("Available")}</Option>
          </Select>
        </div>
      ),
      onFilter: (value, record) => record.status === value,
      render: (status) => t(status),
    },
    {
      title: t("Assigned_Driver_Email"),
      dataIndex: "assignedDriverEmail",
      key: "assignedDriverEmail",
    },
    {
      title: t("Assigned_Driver_Name"),
      dataIndex: "assignedDriverName",
      key: "assignedDriverName",
    },
    {
      title: t("License_Plate"),
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: t("Action"),
      key: "action",
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
          {/* Nút View Detail */}
          <Button
            type="primary"
            size="small"
            style={{ minWidth: "100px", padding: "0 10px" }}
            onClick={() => handleViewDetail(record.id)}
          >
            {t("View_Detail")}
          </Button>
          {/* Nút Unassign Vehicle */}
          <Button
            type="default"
            danger
            size="small"
            disabled={record.status !== t("Available")}
            style={{
              minWidth: "120px",
              padding: "0 10px",
              color: record.status === t("Available") ? "#ff4d4f" : "#d9d9d9",
              borderColor:
                record.status === t("Available") ? "#ff4d4f" : "#d9d9d9",
              cursor:
                record.status === t("Available") ? "pointer" : "not-allowed",
            }}
            onClick={() => handleUnassignVehicle(record.id)}
          >
            {t("Unassign_Vehicle")}
          </Button>
        </div>
      ),
    },

    // Cột bổ sung có thể bỏ qua nếu không cần thiết
  ];

  const updateVehicleStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      const currentVehicle = vehicles.find((vehicle) => vehicle.id === id);
      const validTransitions = getValidStatusTransitions(currentVehicle.status);

      if (!validTransitions.includes(newStatus)) {
        message.error(
          t("Invalid_status_transition", {
            currentStatus: currentVehicle.status,
            newStatus: newStatus,
          })
        );
        return;
      }

      const response = await fetchDataBearer({
        url: `/vehicle/update-vehicle-status/${id}`,
        method: "PUT",
        params: {
          status: newStatus,
        },
      });

      if (response && response.status === 200) {
        message.success(t("Status_updated_successfully"));
        fetchVehicles();
      } else {
        const errorMessage =
          response?.data?.message || t("Failed_to_update_status");
        message.error(errorMessage);
      }
    } catch (error) {
      console.error(t("Error_updating_status"), error);
      message.error(
        error.response?.data?.message || t("Failed_to_update_status_try_again")
      );
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  // Update vehicle type
  const updateVehicle = async (id, values) => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: `/vehicle/update-vehicle/${id}`,
        method: "PUT",
        params: {
          type: values.type,
        },
        data: {
          name: values.name,
          licensePlate: values.licensePlate,
          warehouseId: values.warehouseId,
          isCold: values.isCold,
        },
      });

      if (response && response.status === 200) {
        message.success(t("Type_updated_successfully"));
        fetchVehicles();
      } else {
        const errorMessage =
          response?.data?.message || t("Failed_to_update_type");
        message.error(errorMessage);
      }
    } catch (error) {
      console.error(t("Error_updating_type"), error);
      message.error(
        error.response?.data?.message || t("Failed_to_update_type_try_again")
      );
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };
  // Add this function to check valid status transitions
  const getValidStatusTransitions = (currentStatus) => {
    switch (currentStatus) {
      case t("Available"):
        return [t("Repair")];
      case t("InService"):
        return [];
      case t("Repair"):
        return [t("Available")];
      default:
        return [];
    }
  };

  // Lấy dữ liệu thanh toán khi component mount và khi pagination thay đổi
  useEffect(() => {
    fetchVehicles(0, pagination.pageSize);
  }, []);

  return (
    <div className="p-[20px]">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        {t("Vehicle_Management")}
      </h1>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">{t("Vehicle_List")}</h1>
        <div className="flex gap-4">
          <Button
            type="primary"
            onClick={() => setVisible(true)} // Hiển thị modal khi nhấn nút
          >
            {t("Assign_Vehicle_To_Shipper")}
          </Button>
        </div>
      </div>
      {/* Modal hiển thị form nhập staffId và paymentId */}
      <Modal
        title={t("Assign_Vehicle_To_Shipper")}
        open={visible}
        onCancel={() => setVisible(false)} // Đóng modal khi nhấn cancel
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            {t("Cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => assignVehicleToShipper(vehicleId, shipperId)}
          >
            {t("Assign_Vehicle_To_Shipper1")}
          </Button>,
        ]}
      >
        <Form layout="vertical">
          {/* Shipper ID */}
          <Form.Item label={t("Shipper_ID")} required>
            <Select
              value={shipperId}
              onChange={(value) => setShipperId(value)}
              placeholder={t("Select_Shipper_ID")}
            >
              {shippperIdOptions.map((shipper) => (
                <Select.Option
                  key={shipper.employeeId}
                  value={shipper.employeeId}
                >
                  {t("Employee_Name")}: {shipper.shipperName} -{" "}
                  {t("Store_Name")}: {shipper.warehouseName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Vehicle */}
          <Form.Item label={t("Vehicle")} required>
            <Select
              value={vehicleId}
              onChange={(value) => setVehicleId(value)}
              placeholder={t("Select_Vehicle_ID")}
            >
              {vehicleIdOptions.map((option) => (
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
        dataSource={vehicles}
        columns={columns}
        loading={loading}
        pagination={{
          current: pagination.pageIndex + 1, // Trang bắt đầu từ 1
          pageSize: pagination.pageSize,
          total: pagination.totalItemsCount,
          onChange: (page) => {
            setPagination((prev) => ({
              ...prev,
              pageIndex: page - 1, // Chuyển trang (index bắt đầu từ 0)
            }));
            fetchVehicles(page - 1, pagination.pageSize);
          },
        }}
      />

      <Modal
        title={
          <div className="text-2xl font-bold text-gray-800">
            {t("Vehicle_Details")}
          </div>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button
            key="close"
            onClick={handleModalClose}
            className="bg-red-500 text-white hover:bg-red-600 transition duration-200"
          >
            {t("Close")}
          </Button>,
        ]}
        className="!w-[700px]"
      >
        {selectedVehicle && (
          <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg shadow-md">
            {/* Vehicle Status Section */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="statusSelect"
                  className="block text-lg font-bold mb-2 text-gray-700"
                >
                  {t("Status")}:
                </label>
                <Select
                  id="statusSelect"
                  className="w-full"
                  value={selectedVehicle.status}
                  onChange={(newStatus) =>
                    updateVehicleStatus(selectedVehicle.id, newStatus)
                  }
                  placeholder={t("Select_a_status")}
                  disabled={
                    getValidStatusTransitions(selectedVehicle.status).length ===
                    0
                  }
                >
                  {getValidStatusTransitions(selectedVehicle.status).map(
                    (status) => (
                      <Option key={status} value={status}>
                        {status}
                      </Option>
                    )
                  )}
                </Select>
              </div>
            </div>

            {/* Vehicle Information Display */}
            <div className="p-4 bg-white rounded-lg shadow space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  {t("Vehicle_ID")}:
                </span>
                <span className="text-gray-900">{selectedVehicle.id}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  {t("Vehicle_Name")}:
                </span>
                <span className="text-gray-900">{selectedVehicle.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  {t("Capacity")}:
                </span>
                <span className="text-gray-900">
                  {selectedVehicle.capacity
                    ? `${selectedVehicle.capacity} kg`
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  {t("License_Plate")}:
                </span>
                <span className="text-gray-900">
                  {selectedVehicle.licensePlate}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  {t("Type")}:
                </span>
                <span className="text-gray-900">{selectedVehicle.type}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Vehicle;
