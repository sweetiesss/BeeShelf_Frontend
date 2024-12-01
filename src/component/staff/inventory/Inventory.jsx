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
            title={<Title level={4}>Inventory 1</Title>}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Typography>
                <Title level={5}>Overview</Title>
                <Paragraph>Overview about inventory details.</Paragraph>
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
                <Title level={5}>Overview</Title>
                <Paragraph>Overview about inventory details.</Paragraph>
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
                <Title level={5}>Overview</Title>
                <Paragraph>Overview about inventory details.</Paragraph>
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
                <Title level={5}>Overview</Title>
                <Paragraph>Overview about inventory details.</Paragraph>
              </Typography>
              <Button type="primary" size="small">
                View Details
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Thêm các Card khác nếu cần */}
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
                <Title level={5}>Overview</Title>
                <Paragraph>Overview about inventory details.</Paragraph>
              </Typography>
              <Button type="primary" size="small">
                View Details
              </Button>
            </Space>
          </Card>
        </Col>

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
                <Title level={5}>Overview</Title>
                <Paragraph>Overview about inventory details.</Paragraph>
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


              {/* <Paragraph>
                Information about current orders and their statuses.
              </Paragraph> */}
                            {/* <Paragraph>
                Details about payments, including total amounts and status.
              </Paragraph> */}
                          {/* <Paragraph>
              This is a brief description of the project or section.
            </Paragraph> */}
                        {/* <Button type="primary" size="large">
              Create Payment
            </Button> */}
                        {/* <Button type="danger" size="large">
              Cancel Operation
            </Button> */}