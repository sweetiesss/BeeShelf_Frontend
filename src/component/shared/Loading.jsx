import React from "react";
import { Alert, Flex, Spin } from "antd";

export default function SpinnerLoading() {
  const contentStyle = {
    padding: 300,
    color: "var(--Xanh-Base)",
    borderRadius: 4,
  };
  return (
    <>
      <Spin tip="loading..." size="large">
        <div style={contentStyle} />
      </Spin>
    </>
  );
}
