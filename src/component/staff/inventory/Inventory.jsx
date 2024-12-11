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

  // Hàm gọi API để lấy danh sách thanh toán
  const fetchInventories = async () => {
    setLoading(true);
    try {
      const warehouseId = userInfor?.workAtWarehouseId;

      if (!warehouseId) {
        console.error("Warehouse ID is not available");
        setLoading(false);
        return;
      }

      const response = await fetchDataBearer({
        url: `/inventory/get-inventories`,
        method: "GET",
        params: {
          filterBy: "WarehouseId",
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
        message.success("Data loaded successfully!");
      } else {
        message.error("No data returned from the server.");
      }
    } catch (error) {
      console.error("Error fetching inventories:", error);
      message.error("Failed to fetch inventories. Please try again.");
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
        url: `/inventory/get-inventory/${id}`,
        method: "GET",
      });
      if (response && response.data) {
        const lotData = response.data.lots;

        if (lotData) {
          setSelectedInventory(lotData);
          setIsModalVisible(true);
        }
      } else {
        message.error("No data returned from the server.");
      }
    } catch (error) {
      console.error("Error fetching inventory details:", error);
      message.error("Failed to fetch inventory details. Please try again.");
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
        <Title level={2}>Inventory Management</Title>
        <div className="flex flex-col gap-4 mb-4">
          <Search
            placeholder="Search by Inventory Name"
            onSearch={handleSearch}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleSearch(e.target.value);
            }}
            style={{ width: 300 }}
          />
          <div className="flex gap-4 items-center">
            <div>
              <span className="mr-2">Bought Date:</span>
              <RangePicker onChange={handleBoughtDateChange} />
            </div>
            <div>
              <span className="mr-2">Expiration Date:</span>
              <RangePicker onChange={handleExpirationDateChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Dùng Row và Col để chia card thành nhiều cột */}
      <Row gutter={[16, 16]} justify="center">
        {loading || filterLoading ? (
          <div className="flex justify-center py-8 w-full">
            <Spin size="large" tip="Loading..." />
          </div>
        ) : (
          filteredInventories.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
              <Card
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "10px",
                }}
                title={<Title level={4}>Inventory {index + 1}</Title>}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Typography>
                    <Title level={5}>Overview Inventory</Title>
                    <Paragraph>Name: {item.name}</Paragraph>
                    <Paragraph>Max Weight: {item.maxWeight}</Paragraph>
                    <Paragraph>OCOP Partner ID: {item.ocopPartnerId}</Paragraph>
                    <Paragraph>Weight: {item.weight}</Paragraph>
                    <Paragraph>Total Product: {item.totalProduct}</Paragraph>
                    <Paragraph>Warehouse Name: {item.warehouseName}</Paragraph>
                    <Paragraph>
                      Bought Date:{" "}
                      {new Date(item.boughtDate).toLocaleDateString("vi-VN")}
                    </Paragraph>
                    <Paragraph>
                      Expiration Date:{" "}
                      {new Date(item.expirationDate).toLocaleDateString(
                        "vi-VN"
                      )}
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
                      "View Details"
                    )}
                  </Button>
                </Space>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal
        className="!w-[800px]"
        title="Inventory Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {/* Wrap content with Spin */}
        <div className="grid grid-cols-2 gap-4">
          {selectedInventory?.map((item, idx) => (
            <Card key={idx}>
              <div className="flex justify-between items-center">
                <p className="font-bold">Lot ID:</p>
                <p>{item.id}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-bold">Lot Number:</p>
                <p>{item.lotNumber}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-bold">Lot Name:</p>
                <p>{item.name}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-bold">Lot Amount:</p>
                <p>{item.lotAmount}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-bold">Product PerLot:</p>
                <p>{item.productPerLot}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-bold">Product Name:</p>
                <p>{item.productName}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-bold">Total Product Amount:</p>
                <p>{item.totalProductAmount}</p>
              </div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;
