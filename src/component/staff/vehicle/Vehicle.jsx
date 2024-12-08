/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from "react";
import { Table, message, Spin, Button, Input, Modal, Form, Select } from "antd";
import { useParams } from "react-router-dom";
import useAxios from "../../../services/CustomizeAxios";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const Vehicle = () => {
  const { userInfor } = useAuth(); // Lấy thông tin user từ hook useAuth
  const { moneyTransferId: urlPaymentId } = useParams(); // Lấy paymentId từ URL
  const [moneyTransferId, setPaymentId] = useState(urlPaymentId || ""); // Trạng thái cho paymentId (lấy từ URL nếu có)
  const [vehicleId, setVehicleId] = useState("");
  const [shipperId, setShipperId] = useState("");
  const [visible, setVisible] = useState(false); // Trạng thái hiển thị modal
  const [vehicles, setVehicles] = useState([]);
  const [vehicleIdOptions, setVehicleIdOptions] = useState([]); // Trạng thái cho danh sách paymentId options
  const [shippperIdOptions, setShipperIdOptions] = useState([]); // Trạng thái cho danh sách paymentId options
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalItemsCount: 0,
    pageSize: 10,
    totalPagesCount: 0,
    pageIndex: 0,
  });
  const { fetchDataBearer } = useAxios();

  // Hàm gọi API để lấy danh sách thanh toán
  const fetchVehicles = async () => {
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

      if (response) {
        setVehicles(response?.data?.items || []);
        message.success("Data loaded successfully!");

        setPagination((prevPagination) => ({
          ...prevPagination,
          totalItemsCount: response.totalCount || 0,
          totalPagesCount: Math.ceil(response.totalCount / pagination.pageSize),
        }));

        const options = (response?.data?.items || [])
          ?.filter((vehicle) => vehicle.status === "Available")
          .map((vehicle) => ({
            value: vehicle.id,
            label: `VehicleId: ${vehicle.id} - Name Vehicle: ${vehicle.name} - License Plate: ${vehicle.licensePlate}`,
          }));
        setVehicleIdOptions(options);
      } else {
        message.error("No data returned or invalid data format.");
        setVehicles([]); // In case of invalid data, set to empty array
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      message.error("Failed to fetch payments.");
      setVehicles([]); // Ensure empty array if error occurs
    } finally {
      setLoading(false);
    }
  };

  // Hàm gọi API để tạo một payment mới
  const assignVehicleToShipper = async (shipperId, vehicleId) => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: `/vehicle/assign-driver/${shipperId}/${vehicleId}`,
        method: "POST",
      });

      if (response && response.status === 200) {
        message.success("vehicle Assign successfully!");
        fetchVehicles(); // Cập nhật lại danh sách vehicle
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

  // Fetch shippers
  useEffect(() => {
    const fetchShippers = async () => {
      try {
        const warehouseId = userInfor?.workAtWarehouseId;

        if (!warehouseId) {
          console.error("Warehouse ID is not available");
          return;
        }

        const response = await fetchDataBearer({
          url: `/warehouse/get-warehouse-shippers`,
          method: "GET",
          params: {
            pageIndex: 0,
            pageSize: 100,
            filterBy: "WarehouseId",
            filterQuery: warehouseId,
          },
        });

        if (response.status === 200 && response.data) {
          console.log("Shippers data:", response.data);
          setShipperIdOptions(response.data.items || []);
        } else {
          console.error("Failed to fetch shippers data");
        }
      } catch (error) {
        console.error("Error fetching shippers data:", error);
      }
    };

    if (userInfor?.workAtWarehouseId) {
      fetchShippers();
    }
  }, [userInfor]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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
      toast.error("Failed to fetch vehicle data");
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
            <Option value="InService">InService</Option>
            <Option value="Repair">Repair</Option>
            <Option value="Available">Available</Option>
          </Select>
        </div>
      ),
      onFilter: (value, record) => record.status === value,
      render: (status) => status,
    },
    {
      title: "AssignedDriverEmail",
      dataIndex: "assignedDriverEmail",
      key: "assignedDriverEmail",
    },
    {
      title: "AssignedDriverName",
      dataIndex: "assignedDriverName",
      key: "assignedDriverName",
    },
    { title: "LicensePlate", dataIndex: "licensePlate", key: "licensePlate" },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Button type="primary" onClick={() => handleViewDetail(record.id)}>
          View Detail
        </Button>
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
          `Invalid status transition from ${currentVehicle.status} to ${newStatus}`
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
        message.success("Status updated successfully!");
        fetchVehicles();
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
      setIsModalVisible(false);
    }
  };
  // Add this function to check valid status transitions
  const getValidStatusTransitions = (currentStatus) => {
    switch (currentStatus) {
      case "Available":
        return ["Repair", "InService"];
      case "InService":
        return [];
      case "Repair":
        return ["Available"];
      default:
        return [];
    }
  };

  // Lấy dữ liệu thanh toán khi component mount và khi pagination thay đổi
  useEffect(() => {
    fetchVehicles();
  }, [pagination.pageIndex]);

  return (
    <div className="p-[20px]">
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
        open={visible}
        onCancel={() => setVisible(false)} // Đóng modal khi nhấn cancel
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => assignVehicleToShipper(shipperId, vehicleId)}
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
              value={shipperId}
              onChange={(value) => setShipperId(value)}
              placeholder="Select Vehicle ID"
            >
              {shippperIdOptions.map(
                (shipper) =>
                  shipper.employeeId &&
                  shipper.warehouseId && (
                    // eslint-disable-next-line react/jsx-no-undef
                    <Option key={shipper.employeeId} value={shipper.employeeId}>
                      EmployeeId: {shipper.employeeId} - WarehouseId:{" "}
                      {shipper.warehouseId}
                    </Option>
                  )
              )}
            </Select>
          </Form.Item>

          <Form.Item label="Vehicle" required>
            <Select
              value={vehicleId}
              onChange={(value) => setVehicleId(value)}
              placeholder="Select Vehicle ID"
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

      <Modal
        title="Order Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {selectedVehicle && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="statusSelect" className="font-bold">
                Status:
              </label>
              <Select
                id="statusSelect"
                className="w-full"
                value={selectedVehicle.status}
                onChange={(newStatus) =>
                  updateVehicleStatus(selectedVehicle.id, newStatus)
                }
                placeholder="Select a status"
                disabled={
                  getValidStatusTransitions(selectedVehicle.status).length === 0
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
            <div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between items-center">
                  <p className="font-bold">Vehicle ID:</p>
                  <p>{selectedVehicle.id}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold">vehicle Name:</p>
                  <p>{selectedVehicle.name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold">License Plate:</p>
                  <p>{selectedVehicle.licensePlate}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold">Status:</p>
                  <p>{selectedVehicle.status}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold">Type:</p>
                  <p>{selectedVehicle.type}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold">Assigned Driver Name:</p>
                  <p>{selectedVehicle.assignedDriverName}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Vehicle;
