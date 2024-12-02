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
} from "antd";
import { useAuth } from "../../../context/AuthContext";
import useAxiosBearer from "../../../services/CustomizeAxios";

const { Title, Paragraph } = Typography;

const Inventory = () => {
  const { userInfor } = useAuth(); // Lấy thông tin user từ hook useAuth
  const [loading, setLoading] = useState(false);
  const [inventories, setInventories] = useState([]);
  const { fetchDataBearer } = useAxiosBearer();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

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
    try {
      const response = await fetchDataBearer({
        url: `/inventory/get-inventory/${id}`,
        method: "GET",
      });
      if (response && response.data) {
        setSelectedInventory(response.data);
        setIsModalVisible(true);
      } else {
        message.error("No data returned from the server.");
      }
    } catch (error) {
      console.error("Error fetching inventory details:", error);
      message.error("Failed to fetch inventory details. Please try again.");
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedInventory(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Dùng Row và Col để chia card thành nhiều cột */}
      <Row gutter={[16, 16]} justify="center">
        {loading ? (
          <Spin size={32} className="text-center" />
        ) : (
          inventories.map((item, index) => (
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
                  >
                    View Details
                  </Button>
                </Space>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal
        title="Inventory Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {selectedInventory && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="font-bold">Inventory ID:</p>
              <p>{selectedInventory.id}</p>
            </div>
            <div>
              <p className="font-bold">Name:</p>
              <p>{selectedInventory.name}</p>
            </div>
            <div>
              <p className="font-bold">Max Weight:</p>
              <p>{selectedInventory.maxWeight}</p>
            </div>
            <div>
              <p className="font-bold">OCOP Partner ID:</p>
              <p>{selectedInventory.ocopPartnerId}</p>
            </div>
            <div>
              <p className="font-bold">Current Weight:</p>
              <p>{selectedInventory.weight}</p>
            </div>
            <div>
              <p className="font-bold">Total Products:</p>
              <p>{selectedInventory.totalProduct}</p>
            </div>
            <div>
              <p className="font-bold">Warehouse Name:</p>
              <p>{selectedInventory.warehouseName}</p>
            </div>
            <div>
              <p className="font-bold">Status:</p>
              <p>{selectedInventory.status}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inventory;
