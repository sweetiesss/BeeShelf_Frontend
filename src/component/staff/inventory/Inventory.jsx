import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Space,
  Row,
  Col,
  message,
  Spin,
  Modal,
  Input,
  DatePicker,
} from "antd";
import { useAuth } from "../../../context/AuthContext";
import useAxiosBearer from "../../../services/CustomizeAxios";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd"; // Import Pagination từ Ant Design
import { useTranslation } from "react-i18next";
const { Title, Paragraph } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const Inventory = () => {
  const [buttonLoading, setButtonLoading] = useState({});
  const { userInfor } = useAuth(); // Lấy thông tin user từ hook useAuth
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [filteredInventories, setFilteredInventories] = useState([]);
  const [boughtDateRange, setBoughtDateRange] = useState(null);
  const [expirationDateRange, setExpirationDateRange] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const { fetchDataBearer } = useAxiosBearer();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  //Phân trang cho Card Inventory
  const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại
  const pageSize = 8; // Số lượng card hiển thị trên mỗi trang

  // Tính toán card cần hiển thị dựa trên trang hiện tại
  const paginatedInventories = filteredInventories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  //Phân trang cho card Inventory Detail
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const modalPageSize = 6; // Số lượng card hiển thị trên mỗi trang trong modal

  // Tính toán card cần hiển thị trong modal dựa trên trang hiện tại
  const paginatedSelectedInventory = selectedInventory?.slice(
    (modalCurrentPage - 1) * modalPageSize,
    modalCurrentPage * modalPageSize
  );
  //Hàm format datetime
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

  // Hàm gọi API để lấy danh sách thanh toán
  const fetchInventories = async () => {
    setLoading(true);
    try {
      const StoreId = userInfor?.workAtWarehouseId;

      if (!StoreId) {
        console.error(t("Warehouse_ID_is_not_available"));
        setLoading(false);
        return;
      }

      const response = await fetchDataBearer({
        url: `/room/get-rooms`,
        method: "GET",
        params: {
          filterBy: "StoreId",
          filterQuery: userInfor.workAtWarehouseId,
          descending: false,
          pageIndex: 0,
          pageSize: 100,
        },
      });
      console.log(response);

      if (response && response.data) {
        setInventories(response.data.items);
        setFilteredInventories(response.data.items); // Set initial inventories to filtered inventories
        message.success(t("Data_loaded_successfully"));
      } else {
        message.error(t("No_data_returned_from_the_server"));
      }
    } catch (error) {
      console.error(t("Error_fetching_inventories"), error);
      message.error(t("Failed_to_fetch_inventories_Please_try_again"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfor.workAtWarehouseId) {
      fetchInventories();
    }
  }, [userInfor]);

  const getDetailInventory = async (id) => {
    setButtonLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetchDataBearer({
        url: `/room/get-room/${id}`,
        method: "GET",
      });
      if (response && response.data) {
        const lotData = response.data.lots;

        if (lotData) {
          setSelectedInventory(lotData);
          setIsModalVisible(true);
        }
      } else {
        message.error(t("No_data_returned_from_the_server"));
      }
    } catch (error) {
      console.error(t("Error_fetching_inventory_details"), error);
      message.error(t("Failed_to_fetch_inventory_details_Please_try_again"));
    } finally {
      setButtonLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedInventory(null);
  };

  // Hàm lọc theo tên
  const handleSearch = (value) => {
    setFilterLoading(true);
    applyFilters(value, boughtDateRange, expirationDateRange);
    setFilterLoading(false);
  };

  const handleBoughtDateChange = (dates) => {
    setFilterLoading(true);
    setBoughtDateRange(dates);
    applyFilters(searchValue, dates, expirationDateRange);
    setFilterLoading(false);
  };

  const handleExpirationDateChange = (dates) => {
    setFilterLoading(true);
    setExpirationDateRange(dates);
    applyFilters(searchValue, boughtDateRange, dates);
    setFilterLoading(false);
  };

  const applyFilters = (searchText, boughtDates, expirationDates) => {
    let filtered = [...inventories];

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter((item) =>
        (item.name || "").toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply bought date filter
    if (boughtDates && boughtDates[0] && boughtDates[1]) {
      filtered = filtered.filter((item) => {
        const boughtDate = new Date(item.boughtDate);
        return (
          boughtDate >= boughtDates[0].startOf("day").toDate() &&
          boughtDate <= boughtDates[1].endOf("day").toDate()
        );
      });
    }

    // Apply expiration date filter
    if (expirationDates && expirationDates[0] && expirationDates[1]) {
      filtered = filtered.filter((item) => {
        const expirationDate = new Date(item.expirationDate);
        return (
          expirationDate >= expirationDates[0].startOf("day").toDate() &&
          expirationDate <= expirationDates[1].endOf("day").toDate()
        );
      });
    }

    setFilteredInventories(filtered);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Title level={2} style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
          {t("Inventory_Management")}
        </Title>

        <div className="flex flex-col gap-4 mb-4">
          <Search
            placeholder={t("Search_by_Inventory_Name")}
            onSearch={handleSearch}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleSearch(e.target.value);
            }}
            style={{ width: 300 }}
          />
          <div className="flex gap-4 items-center">
            <div>
              <span className="mr-2">{t("Bought_Date")}:</span>
              <RangePicker onChange={handleBoughtDateChange} />
            </div>
            <div>
              <span className="mr-2">{t("Expiration_Date")}:</span>
              <RangePicker onChange={handleExpirationDateChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Dùng Row và Col để chia card thành nhiều cột */}
      <Row gutter={[16, 16]} justify="center">
        {loading || filterLoading ? (
          <div className="flex justify-center py-8 w-full">
            <Spin size="large" tip={t("Loading")} />
          </div>
        ) : (
          paginatedInventories.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
              <Card
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Bóng đổ tinh tế
                  borderRadius: "12px", // Bo tròn góc card
                  border: "1px solid #e6e6e6", // Viền card
                  transition: "transform 0.2s, box-shadow 0.2s", // Hiệu ứng chuyển đổi mượt mà
                  backgroundColor: "#f9f9f9", // Màu nền nhạt
                }}
                title={
                  <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                    {t("Inventory_ID")}: {item.id}
                  </Title>
                }
                hoverable
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Typography>
                    <Title level={5} style={{ color: "#555" }}>
                      {t("Overview_Inventory")}
                    </Title>
                    <Paragraph>
                      <strong>{t("RoomCode")}</strong> {item.roomCode}
                    </Paragraph>
                    <Paragraph>
                      <strong>{t("Max_Weight")}:</strong> {item.maxWeight} kg
                    </Paragraph>

                    <Paragraph>
                      <strong>{t("OCOP_Partner_ID")}:</strong>{" "}
                      {item.ocopPartnerId}
                    </Paragraph>
                    <Paragraph>
                      <strong>{t("Weight")}:</strong> {item.weight} kg
                    </Paragraph>
                    <Paragraph>
                      <strong>{t("Total_Product")}:</strong> {item.totalProduct} Unit
                    </Paragraph>
                    <Paragraph>
                      <strong>{t("Warehouse_Name")}:</strong> {item.storeName}
                    </Paragraph>
                    <Paragraph>
                      <strong>{t("Bought_Date")}:</strong>{" "}
                      {formatDateTime(item.boughtDate)}
                    </Paragraph>
                    <Paragraph>
                      <strong>{t("Expiration_Date")}:</strong>{" "}
                      {formatDateTime(item.expirationDate)}
                    </Paragraph>
                  </Typography>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => getDetailInventory(item.id)}
                    disabled={buttonLoading[item.id]}
                  >
                    {buttonLoading[item.id] ? (
                      <Spin size="small" />
                    ) : (
                      t("View_Details")
                    )}
                  </Button>
                </Space>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredInventories.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

      <Modal
        className="!w-[800px]"
        title={t("Inventory_Details")}
        open={isModalVisible}
        onCancel={() => {
          handleModalClose();
          setModalCurrentPage(1); // Reset về trang đầu khi đóng modal
        }}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            {t("Close")}
          </Button>,
        ]}
      >
        <div className="grid grid-cols-2 gap-4">
          {paginatedSelectedInventory?.map((item, idx) => (
            <Card
              key={idx}
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                border: "1px solid #f0f0f0",
                backgroundColor: "#ffffff",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div className="space-y-2">
                {/* <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-600">{t("Lot_ID")}:</p>
                  <p className="text-gray-800">{item.id}</p>
                </div> */}
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-600">
                    {t("Code_Lot_Number")}:
                  </p>
                  <p className="text-gray-800">{item.lotNumber}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-600">{t("Lot_Name")}:</p>
                  <p className="text-gray-800">{item.name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-600">{t("Lot_Amount")}:</p>
                  <p className="text-gray-800">{item.lotAmount} lot</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-600">
                    {t("Product_PerLot")}:
                  </p>
                  <p className="text-gray-800">{item.productPerLot} Unit</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-600">
                    {t("Unit")}:
                  </p>
                  <p className="text-gray-800"> Bottle/Package/Carton/Box/Bag/..</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-600">
                    {t("Product_Name")}:
                  </p>
                  <p className="text-gray-800">{item.productName}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-600">
                    {t("Total_Product_Amount")}:
                  </p>
                  <p className="text-gray-800">
                    {item.totalProductAmount} Unit
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination trong modal */}
        {selectedInventory && selectedInventory.length > modalPageSize && (
          <div className="flex justify-center mt-4">
            <Pagination
              current={modalCurrentPage}
              pageSize={modalPageSize}
              total={selectedInventory.length}
              onChange={(page) => setModalCurrentPage(page)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inventory;
