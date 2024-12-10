import React from "react";
import { Alert, ConfigProvider , Spin } from "antd";

export default function SpinnerLoading() {
  const contentStyle = {
    padding: 300,
    color: "var(--Xanh-Base)",
    primaryColor: "var(--Xanh-Base)",
    borderRadius: 4,
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "green", // Set the primary color to green
        },
      }}
    >
      <Spin tip="loading..." size="large">
        <div style={contentStyle} />
      </Spin>
    </ConfigProvider>
  );
}
