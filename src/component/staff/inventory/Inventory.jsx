import React from "react";
import { Card, Button, Typography, Space, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

const Inventory = () => {
  return (
    <div style={{ padding: "20px" }}>
      {/* Dùng Row và Col để chia card thành nhiều cột */}
      <Row gutter={[16, 16]} justify="start">
        {/* Card Inventory 1 */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            style={{
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
            title={<Title level={4}>Inventory 1 </Title>}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Typography>
                <Title level={5}>Overview Inventory</Title>
                <Paragraph>name</Paragraph>
                <Paragraph>maxWeight</Paragraph>
                <Paragraph>ocopPartnerId</Paragraph>
                <Paragraph>weight</Paragraph>
                <Paragraph>totalProduct</Paragraph>
                <Paragraph>warehouseName</Paragraph>
              </Typography>
              <Button type="primary" size="small">
                View Details
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Card Inventory 2 */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            style={{
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
            title={<Title level={4}>Inventory 2</Title>}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Typography>
                <Title level={5}>Overview Inventory</Title>
                <Paragraph>name</Paragraph>
                <Paragraph>maxWeight</Paragraph>
                <Paragraph>ocopPartnerId</Paragraph>
                <Paragraph>weight</Paragraph>
                <Paragraph>totalProduct</Paragraph>
                <Paragraph>warehouseName</Paragraph>
              </Typography>
              <Button type="primary" size="small">
                View Details
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Card Inventory 3 */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            style={{
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
            title={<Title level={4}>Inventory 3</Title>}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Typography>
                <Title level={5}>Overview Inventory</Title>
                <Paragraph>name</Paragraph>
                <Paragraph>maxWeight</Paragraph>
                <Paragraph>ocopPartnerId</Paragraph>
                <Paragraph>weight</Paragraph>
                <Paragraph>totalProduct</Paragraph>
                <Paragraph>warehouseName</Paragraph>
              </Typography>
              <Button type="primary" size="small">
                View Details
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Card Inventory 4 */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            style={{
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
            title={<Title level={4}>Inventory 4</Title>}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Typography>
                <Title level={5}>Overview Inventory</Title>
                <Paragraph>name</Paragraph>
                <Paragraph>maxWeight</Paragraph>
                <Paragraph>ocopPartnerId</Paragraph>
                <Paragraph>weight</Paragraph>
                <Paragraph>totalProduct</Paragraph>
                <Paragraph>warehouseName</Paragraph>
              </Typography>
              <Button type="primary" size="small">
                View Details
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Card Inventory 5 */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            style={{
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
            title={<Title level={4}>Inventory 5</Title>}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Typography>
                <Title level={5}>Overview Inventory</Title>
                <Paragraph>name</Paragraph>
                <Paragraph>maxWeight</Paragraph>
                <Paragraph>ocopPartnerId</Paragraph>
                <Paragraph>weight</Paragraph>
                <Paragraph>totalProduct</Paragraph>
                <Paragraph>warehouseName</Paragraph>
              </Typography>
              <Button type="primary" size="small">
                View Details
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Card Inventory 6 */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            style={{
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
            title={<Title level={4}>Inventory 6</Title>}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Typography>
                <Title level={5}>Overview Inventory</Title>
                <Paragraph>name</Paragraph>
                <Paragraph>maxWeight</Paragraph>
                <Paragraph>ocopPartnerId</Paragraph>
                <Paragraph>weight</Paragraph>
                <Paragraph>totalProduct</Paragraph>
                <Paragraph>warehouseName</Paragraph>
              </Typography>
              <Button type="primary" size="small">
                View Details
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Inventory;

// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   Button,
//   Typography,
//   Space,
//   Row,
//   Col,
//   message,
//   Pagination,
// } from "antd";
// import { useAuth } from "../../../context/AuthContext"; // Auth context for user info
// import useAxios from "../../../services/CustomizeAxios"; // Custom Axios hook

// const { Title, Paragraph } = Typography;

// const Inventory = () => {
//   const { userInfor } = useAuth(); // Get userInfor from the authentication context
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 10,
//     totalItemsCount: 0,
//     totalPagesCount: 0,
//   });

//   // Use custom axios hook
//   const { fetchData } = useAxios();

//   useEffect(() => {
//     if (!userInfor || !userInfor.workAtWarehouseId) {
//       return; // Prevent fetching if no user info or warehouse ID
//     }

//     const fetchInventories = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchData({
//           url: `/inventory/get-inventories/${userInfor.workAtWarehouseId}`,
//           method: "GET",
//           params: {
//             filterBy: "WarehouseId",
//             filterQuery: userInfor.workAtWarehouseId,
//             descending: false,
//             pageIndex: pagination.pageIndex,
//             pageSize: pagination.pageSize,
//           },
//         });

//         if (response && response.data) {
//           const {
//             totalItemsCount,
//             pageSize,
//             totalPagesCount,
//             pageIndex,
//             items,
//           } = response.data;

//           // Update state with fetched data
//           setData(items);
//           setPagination({
//             totalItemsCount,
//             pageSize,
//             totalPagesCount,
//             pageIndex,
//           });

//           message.success("Data loaded successfully!");
//         } else {
//           message.error("No data returned from the server.");
//         }
//       } catch (error) {
//         console.error("Error fetching inventories:", error);
//         message.error("Failed to fetch inventories. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInventories(); // Fetch inventories when the component mounts or pagination changes
//   }, [userInfor, pagination.pageIndex, pagination.pageSize]); // Re-run effect if userInfo or pagination changes

//   const handlePageChange = (page, pageSize) => {
//     setPagination({
//       ...pagination,
//       pageIndex: page - 1, // Convert to zero-based index
//       pageSize,
//     });
//   };

//   return (
//     <div style={{ padding: "100px" }}>
//       {/* Dùng Row và Col để chia card thành nhiều cột */}
//       <Row gutter={[16, 16]} justify="start">
//         {loading ? (
//           <div>Loading...</div> // Show loading indicator
//         ) : (
//           data.map((item, index) => (
//             <Col key={index} xs={24} sm={12} md={8} lg={6}>
//               <Card
//                 style={{
//                   padding: "20px",
//                   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                   borderRadius: "10px",
//                   minHeight: "300px", // Adjust height for consistent layout
//                 }}
//                 title={<Title level={4}>Inventory {index + 1}</Title>}
//               >
//                 <Space direction="vertical" style={{ width: "100%" }}>
//                   <Typography>
//                     <Title level={5}>Overview Inventory</Title>
//                     <Paragraph>Name: {item.name}</Paragraph>
//                     <Paragraph>Max Weight: {item.maxWeight}</Paragraph>
//                     <Paragraph>OCOP Partner Id: {item.ocopPartnerId}</Paragraph>
//                     <Paragraph>Weight: {item.weight}</Paragraph>
//                     <Paragraph>Total Product: {item.totalProduct}</Paragraph>
//                     <Paragraph>Warehouse Name: {item.warehouseName}</Paragraph>
//                   </Typography>
//                   <Button type="primary" size="small">
//                     View Details
//                   </Button>
//                 </Space>
//               </Card>
//             </Col>
//           ))
//         )}
//       </Row>

//       {/* Pagination Controls */}
//       <div style={{ marginTop: "20px", textAlign: "center" }}>
//         <Pagination
//           current={pagination.pageIndex + 1} // Display 1-based page index
//           pageSize={pagination.pageSize}
//           total={pagination.totalItemsCount}
//           onChange={handlePageChange}
//           showSizeChanger
//           pageSizeOptions={["10", "20", "50"]}
//         />
//       </div>
//     </div>
//   );
// };

// export default Inventory;
