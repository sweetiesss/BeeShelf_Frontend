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
} from "antd";
import { useAuth } from "../../../context/AuthContext";
import useAxiosBearer from "../../../services/CustomizeAxios";

const { Title, Paragraph } = Typography;
const { Search } = Input;

const Inventory = () => {
  const { userInfor } = useAuth(); // Lấy thông tin user từ hook useAuth
  const [loading, setLoading] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [filteredInventories, setFilteredInventories] = useState([]);
  const { fetchDataBearer } = useAxiosBearer();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState([]);
  // const [loadingDetails, setLoadingDetails] = useState({}); // Track loading for each inventory item

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
    // setLoadingDetails((prev) => ({ ...prev, [id]: true })); // Set loading to true for this specific inventory
    try {
      const response = await fetchDataBearer({
        url: `/inventory/get-inventory/${id}`,
        method: "GET",
      });
      if (response && response.data) {
        // Assuming the first element of the 'lots' array contains the inventory lot details
        const lotData = response.data.lots;

        if (lotData) {
          // Now, setting the inventory lot details
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
      // setLoadingDetails((prev) => ({ ...prev, [id]: false })); // Reset loading for this specific inventory
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedInventory(null);
  };

  // Hàm lọc theo tên
  const handleSearch = (value) => {
    if (value) {
      // Lọc danh sách dựa trên tên
      const filtered = inventories.filter((item) =>
        (item.name || '').toLowerCase().includes(value.toLowerCase()) // Kiểm tra nếu item.name là null hoặc undefined
      );
      setFilteredInventories(filtered);
    } else {
      // Nếu ô tìm kiếm trống, hiển thị tất cả inventory
      setFilteredInventories(inventories);
    }
  };
  

  return (
    <div style={{ padding: "20px" }}>
      {/* Thêm ô tìm kiếm theo tên */}
      <Search
        placeholder="Search by Inventory Name"
        onSearch={handleSearch}
        style={{ marginBottom: 20, width: 300 }}
        allowClear
      />

      {/* Dùng Row và Col để chia card thành nhiều cột */}
      <Row gutter={[16, 16]} justify="center">
        {loading ? (
          <Spin size={32} className="text-center" />
        ) : (
          filteredInventories.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card
                style={{
                  padding: "20px",
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
                  </Typography>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => getDetailInventory(item.id)}
                    // disabled={loadingDetails[item.id]} // Disable button if loading for this item
                  >
                    {"View Details"}
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
        {/* {loadingDetails[selectedInventory?.id] ? (
          <Spin size="large" className="flex justify-center items-center" />
        ) : ( */}
        <div className="grid grid-cols-2 gap-4">
          {selectedInventory?.map((item, idx) => (
            <>
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
            </>
          ))}
        </div>
        {/* )} */}
      </Modal>
    </div>
  );
};

export default Inventory;
