import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Button,
  Input,
  Modal,
  Form,
  Select,
  InputNumber,
  Descriptions,
} from "antd";
import useAxios from "../../services/CustomizeAxios";

import { t } from "i18next";
import {
  Garage,
  GearSix,
  Motorcycle,
  Tire,
  Truck,
  Van,
} from "@phosphor-icons/react";
import { add, format } from "date-fns";
import AxiosPartner from "../../services/Partner";
const { Option } = Select;

const ZoomableImageModal = ({ imageUrl, visible, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleZoom = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prevScale) => Math.max(1, prevScale + zoomDelta));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!visible) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      footer={null}
      onCancel={onClose}
      centered
      bodyStyle={{ textAlign: "center", overflow: "hidden", padding: 0 }}
      style={{ maxWidth: "80vw", maxHeight: "80vh" }}
    >
      {imageUrl && (
        <div
          onWheel={handleZoom}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            overflow: "hidden",
            width: "100%",
            height: "100%",
          }}
        >
          <img
            src={imageUrl}
            alt="Zoomable"
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.3s",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </div>
      )}
    </Modal>
  );
};

const PartnerPage = () => {
  const { fetchDataBearer } = useAxios();

  // State cho danh sách vehicles
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showVehicles, setShowVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho modal tạo vehicle
  const [visible, setVisible] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteHolder, setDeleteHolder] = useState();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const {
    getVerificationPaper,
    verifyVerificationPaper,
    rejectVerificationPaper,
  } = AxiosPartner();

  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailAvailable, setDetaukAvailable] = useState(false);
  const [onAction, setOnAction] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [reasonReject, setReasonReject] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  // Form instance
  const [form] = Form.useForm();

  // Hàm fetch danh sách vehicles từ API
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: `partner/get-partners`,
        method: "GET",
        params: {
          pageIndex: filter?.pageIndex,
          pageSize: filter?.pageSize,
        },
      });
      setVehicles(response?.data);
      //   const response2 = await fetchDataBearer({
      //     url: `productCategory/get-categories`,
      //     method: "GET",
      //     params: {
      //       pageIndex: 0,
      //       pageSize: 100,
      //     },
      //   });
      //   setCategories(response2?.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      message.error("Failed to fetch vehicles.");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm mở modal và gán dữ liệu vehicle cần update
  const openUpdateModal = (record) => {
    setSelectedVehicle(record);
    form.setFieldsValue({
      typeName: record?.typeName,
      typeDescription: record?.typeDescription,
      categoryId: record?.categoryId,
      expireIn: record?.expireIn,
    });
    setUpdateVisible(true);
  };
  //Hàm xử lí detail:
  const [detailVisible, setDetailVisible] = useState(false);
  const [vehicleDetail, setVehicleDetail] = useState(null);

  // Hàm đóng modal
  const handleCloseDetailModal = () => {
    setDetailVisible(false);
    setVehicleDetail(null);
  };

  console.log("vehicleDetail", vehicleDetail);

  // Hàm cập nhật vehicle
  const handleUpdateVehicle = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);
      console.log("Selected Vehicle:", selectedVehicle);
      const response = await fetchDataBearer({
        url: `/productCategory/update-product-category/${selectedVehicle.id}`,
        method: "PUT",
        params: {
          type: values.type,
        },
        data: {
          typeName: values?.typeName,
          typeDescription: values?.typeDescription,
          expireIn: values?.expireIn,
        },
      });

      if (response && response.status === 200) {
        message.success("Product category updated successfully!");
        setUpdateVisible(false);
        fetchVehicles();
        form.resetFields();
      } else {
        message.error(
          response?.data?.message || "Failed to Product category vehicle."
        );
      }
    } catch (error) {
      console.error("Error updating product category:", error);
    }
  };
  // Hàm Delete vehicle:
  const handleDeleteVehicle = (record) => {
    setDeleteHolder(record);
    setDeleteConfirmation(true);
  };

  const confirmDeleteCategory = async () => {
    try {
      const response = await fetchDataBearer({
        url: `productCategory/delete-product-category/${deleteHolder.id}`,
        method: "DELETE",
      });

      if (response && response.status === 200) {
        message.success("Category deleted successfully!");
        fetchVehicles(); // Refresh the category list
      } else {
        message.error(response?.data?.message || "Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("Something went wrong!");
    } finally {
      setDeleteConfirmation(false);
    }
  };
  console.log("categories", categories);

  // Hàm tạo vehicle
  const createVehicle = async () => {
    try {
      const values = await form.validateFields(); // Lấy dữ liệu từ form sau khi validate

      setLoading(true);

      const response = await fetchDataBearer({
        url: `/productCategory/create-product-category`,
        method: "POST",
        data: {
          categoryId: values.categoryId,
          typeName: values.typeName,
          typeDescription: values.typeDescription,
          expireIn: values.expireIn,
        },
      });

      if (response && response.status === 200) {
        message.success("Product category created successfully!");
        fetchVehicles();
        setVisible(false);
        form.resetFields(); // Reset form sau khi tạo thành công
      } else {
        const errorMessage =
          response?.data?.message || "Failed to create product category.";
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating product category:", error);
      message.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  const handleCloseDeleteCategory = () => {
    setDeleteConfirmation(false);
    setDeleteHolder();
  };

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [filter, refresh]);

  console.log("vehicles", vehicles);
  console.log("showVehicles", showVehicles);

  const handleShowDetails = async (record) => {
    try {
      setDetailLoading(true);
      setVehicleDetail();
      const result = await getVerificationPaper(record?.id);
      console.log("result", result);
      if (result?.status == 200) {
        const resultData = result?.data?.data[result?.data?.data?.length - 1];
        if (resultData) {
          console.log("resultData", resultData);
          const { id: paperId, ...remainingData } = resultData;
          setVehicleDetail({ ...record, ...remainingData, paperId });
        } else {
          setVehicleDetail({ ...record });
        }
        setDetailVisible(true);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setDetailLoading(false);
    }
  };

  const confirmVerifyPartner = async () => {
    try {
      setDetailLoading(true);
      if (vehicleDetail) {
        const result = await verifyVerificationPaper(vehicleDetail?.paperId);
        console.log("result", result);

        if (result?.status === 200) {
          setOnAction("");
          await fetchVehicles();
          const result = vehicles?.items?.find(
            (item) => item.id === vehicleDetail?.id
          );
          if (result) {
            handleShowDetails(result);
          }
        }
      }
    } catch (e) {
    } finally {
      setDetailLoading(false);
    }
  };
  const rejectVerifyPartner = async () => {
    try {
      setDetailLoading(true);
      if (vehicleDetail) {
        const result = await rejectVerificationPaper(
          vehicleDetail?.paperId,
          reasonReject
        );
        console.log("result", result);

        if (result?.status === 200) {
          setOnAction("");
          setReasonReject("");
          await fetchVehicles();
          const result = vehicles?.items?.find(
            (item) => item.id === vehicleDetail?.id
          );
          if (result) {
            handleShowDetails(result);
          }
        }
      }
    } catch (e) {
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="">
      <Button
        style={{ marginBottom: "2rem" }}
        type="primary"
        onClick={
          () => setVisible(true) // Show modal
        }
      >
        CreateProductCategory
      </Button>

      {/* Modal tạo vehicle */}
      <Modal
        title="CreateProductCategory"
        open={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields(); // Reset form khi đóng modal
        }}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={createVehicle}
          >
            Create Product Category
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          {/* Vehicle Type */}
          <Form.Item
            label="Name"
            name="typeName"
            rules={[
              {
                required: true,
                message: "Please enter product category type name!",
              },
            ]}
          >
            <Input placeholder="Enter product category Name" />
          </Form.Item>

          {/* Vehicle Name */}
          <Form.Item
            label="Description"
            name="typeDescription"
            rules={[
              {
                required: true,
                message: "Please enter product category description!",
              },
            ]}
          >
            <Input placeholder="Enter product category Description" />
          </Form.Item>
          <Form.Item label="Category" name="categoryId">
            <Select
              placeholder="Select Category"
              onChange={(value) => {
                console.log(value);

                form.setFieldsValue({
                  categoryId: value,
                });
              }}
            >
              {categories?.items?.map((cate) => (
                <Option key={cate?.id} value={cate?.id}>
                  {cate?.type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* License Plate */}
          <Form.Item
            label={"ExpireIn" + " (" + "days" + ")"}
            name="expireIn"
            rules={[
              { required: true, message: "Please enter expire in days!" },
              {
                type: "number",
                min: 1,
                max: 9999999,
                message:
                  "Value must be greater than 0 and less than 9,999,999!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || (value > 0 && value < 9999999)) {
                    return Promise.resolve();
                  }
                  return Promise.reject();
                },
              }),
            ]}
          >
            <InputNumber
              placeholder="Enter expire in days"
              type="number"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="UpdateProductCategory"
        open={updateVisible}
        onCancel={() => {
          setUpdateVisible(false);
          form.resetFields();
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setUpdateVisible(false);
              form.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleUpdateVehicle}
          >
            Update Product Category
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="typeName"
            rules={[
              {
                required: true,
                message: "Please enter product category type name!",
              },
            ]}
          >
            <Input placeholder="Enter product category Name" />
          </Form.Item>

          {/* Vehicle Name */}
          <Form.Item
            label="Description"
            name="typeDescription"
            rules={[
              {
                required: true,
                message: "Please enter product category description!",
              },
            ]}
          >
            <Input placeholder="Enter product category Description" />
          </Form.Item>
          <Form.Item label="Category" name="categoryId">
            <Select
              placeholder="Select Category"
              onChange={(value) => {
                console.log(value);
                form.setFieldsValue({
                  categoryId: value,
                });
              }}
            >
              {categories?.items?.map((cate) => (
                <Option key={cate?.id} value={cate?.id}>
                  {cate?.type}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* License Plate */}
          <Form.Item
            label="ExpireIn"
            name="expireIn"
            rules={[
              { required: true, message: "Please enter expire in days!" },
              {
                type: "number",
                min: 1,
                max: 9999999,
                message:
                  "Value must be greater than 0 and less than 9,999,999!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || (value > 0 && value < 9999999)) {
                    return Promise.resolve();
                  }
                  return Promise.reject();
                },
              }),
            ]}
          >
            <InputNumber
              placeholder="Enter expire in days"
              type="number"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* Bảng hiển thị vehicles */}
      <Table
        dataSource={vehicles?.items}
        size="large"
        columns={[
          {
            title: "Picture",
            key: "Picture",
            width: 50,
            align: "start",
            render: (text, record) => (
              <img src={record?.pictureLink} className="h-[5rem] w-[5rem] " />
            ),
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 150,
            align: "start",
          },
          {
            title: "Name",
            key: "Name",
            width: 150,
            align: "start",
            render: (text, record) => (
              <span>{record?.firstName + " " + record?.lastName}</span>
            ),
          },
          {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 50,
            align: "start",
          },
          {
            title: "Tax Identification Number",
            dataIndex: "taxIdentificationNumber",
            key: "taxIdentificationNumber",
            width: 150,
            align: "start",
          },
          {
            title: "Create Date",
            key: "createDate",
            width: 100,
            align: "start",
            render: (text, record) => (
              <span>
                {format(
                  add(new Date(record?.createDate), { hours: 7 }),
                  "HH:mm - dd/MM/yyyy"
                )}
              </span>
            ),
          },
          {
            title: "Status",
            key: "isVerify",
            width: 50,
            align: "start",
            render: (text, record) => (
              <span
                className={`${
                  record?.isVerified === 1
                    ? "bg-green-500 text-white font-medium px-2 py-1 rounded-xl"
                    : ""
                }`}
              >
                {record?.isVerified === 1 ? "Verified" : ""}
              </span>
            ),
          },
          {
            title: "Actions",
            key: "actions",
            width: 150,
            align: "start",
            render: (text, record) => (
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  justifyContent: "start",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{ display: "flex", gap: "6px", alignItems: "start" }}
                >
                  <Button
                    type="default"
                    size="small"
                    onClick={() => handleShowDetails(record)}
                    style={{
                      color: "#0db977",
                      borderColor: "#0db977",
                      borderRadius: "5px",
                      padding: "0 8px",
                      minWidth: "80px",
                      height: "2rem",
                    }}
                  >
                    Show details
                  </Button>
                  <Button
                    type="default"
                    size="small"
                    onClick={() => handleDeleteVehicle(record)}
                    style={{
                      color: "#ff4d4f",
                      borderColor: "#ff4d4f",
                      borderRadius: "5px",
                      padding: "0 8px",
                      minWidth: "80px",
                      height: "2rem",
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ),
          },
        ]}
        rowKey="id"
        loading={loading}
        pagination={{
          current: vehicles?.pageIndex + 1,
          pageSize: vehicles?.pageSize,
          total: vehicles?.totalItemsCount,
          onChange: (page, pageSize) => {
            setFilter((prev) => ({ ...prev, pageIndex: page - 1, pageSize }));
          },
        }}
      />
      <Modal
        title="DeleteCategory"
        centered
        open={deleteConfirmation}
        onOk={() => confirmDeleteCategory()}
        onCancel={() => handleCloseDeleteCategory()}
      >
        <p>
          Do you want to delete:{" "}
          <span className="font-semibold">{deleteHolder?.typeName}</span>
        </p>
      </Modal>
      {/* Detail Modal */}
      <Modal
        centered
        open={detailVisible}
        width={1450}
        onCancel={handleCloseDetailModal}
        footer={
          onAction === ""
            ? [
                <button
                  key="Verify"
                  size="large"
                  className={`${
                    vehicleDetail?.isVerified === 1 ||
                    !vehicleDetail?.backPictureLink ||
                    !vehicleDetail?.frontPictureLink
                      ? "bg-[#0000000a] border-[#d9d9d9] text-[#00000040]"
                      : "text-[#0db977] border-[#0db977] hover:text-green-400 hover:border-green-400"
                  } border mr-4`}
                  onClick={() => setOnAction("verify")}
                  style={{
                    lineHeight: "24px",
                    borderRadius: "5px",
                    padding: "0 8px",
                    minWidth: "80px",
                    height: "2rem",
                  }}
                  disabled={
                    vehicleDetail?.isVerified === 1 ||
                    !vehicleDetail?.backPictureLink ||
                    !vehicleDetail?.frontPictureLink
                  }
                >
                  Verify
                </button>,
                <Button
                  key="Reject"
                  size="large"
                  disabled={
                    vehicleDetail?.isVerified === 1 ||
                    vehicleDetail?.isRejected === 1 ||
                    !vehicleDetail?.backPictureLink ||
                    !vehicleDetail?.frontPictureLink
                  }
                  onClick={() => setOnAction("reject")}
                  danger
                  // className={`${
                  //   vehicleDetail?.isVerified === 1 ||
                  //   vehicleDetail?.isRejected === 1
                  //     ? ""
                  //     : "text-[#ff4d4f] border-[#ff4d4f]"
                  // } hover:text-[#ff4d4f] hover:border-[#ff4d4f]`}
                  style={{
                    borderRadius: "5px",
                    padding: "0 8px",
                    minWidth: "80px",
                    height: "2rem",
                  }}
                >
                  Reject
                </Button>,
                <button
                  key="close"
                  color="default"
                  onClick={handleCloseDetailModal}
                  size="large"
                  className="hover:text-gray-500 hover:border-gray-500 border ml-4"
                  style={{
                    lineHeight: "24px",
                    borderRadius: "5px",
                    padding: "0 8px",
                    minWidth: "80px",
                    height: "2rem",
                  }}
                >
                  Close
                </button>,
              ]
            : onAction === "verify"
            ? [
                <Button
                  key="Verifybutton"
                  onClick={() => confirmVerifyPartner()}
                  style={{
                    backgroundColor: "#0db977",
                    borderColor: "#0db977",
                    color: "white",
                    borderRadius: "5px",
                    padding: "0 8px",
                    minWidth: "80px",
                    height: "2rem",
                  }}
                  size="large"
                  loading={detailLoading}
                  disabled={detailLoading}
                >
                  YES, verify this partner.
                </Button>,
                <Button
                  key="Reject"
                  size="large"
                  onClick={() => setOnAction("")}
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    borderColor: "#ff4d4f",
                    borderRadius: "5px",
                    padding: "0 8px",
                    minWidth: "80px",
                    height: "2rem",
                  }}
                  disabled={detailLoading}
                >
                  NO, turn back.
                </Button>,
              ]
            : [
                <div
                  key="RejectActions"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <Input
                    placeholder="Reject reason"
                    onChange={(e) => setReasonReject(e.target.value)}
                    value={reasonReject}
                    size="large"
                    style={{ flex: 1 }}
                  />
                  <Button
                    key="Verifybutton"
                    onClick={() => rejectVerifyPartner()}
                    style={{
                      backgroundColor: "#0db977",
                      borderColor: "#0db977",
                      color: "white",
                      borderRadius: "5px",
                      padding: "0 8px",
                      minWidth: "80px",
                      height: "2rem",
                    }}
                    size="large"
                    loading={detailLoading}
                    disabled={detailLoading}
                  >
                    YES, reject this partner.
                  </Button>
                  <Button
                    key="Reject"
                    onClick={() => setOnAction("")}
                    style={{
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      borderColor: "#ff4d4f",
                      borderRadius: "5px",
                      padding: "0 8px",
                      minWidth: "80px",
                      height: "2rem",
                    }}
                    size="large"
                    disabled={detailLoading}
                  >
                    NO, turn back.
                  </Button>
                </div>,
              ]
        }
      >
        {vehicleDetail ? (
          <>
            <p className="text-xl font-medium">User Detail Infor</p>
            <div className="flex justify-center mt-6 gap-6">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Picture">
                  <img
                    src={vehicleDetail?.pictureLink}
                    alt="Picture"
                    style={{ maxHeight: "100px" }}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {vehicleDetail?.isVerified === 1 ? (
                    <span className="font-medium text-green-500">Verified</span>
                  ) : vehicleDetail?.isRejected === 1 ? (
                    <span className="font-medium text-red-500">Rejected</span>
                  ) : (
                    <span className="font-medium ">None action yet</span>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Name">
                  <div className="overflow-clip text-ellipsis">
                    {vehicleDetail?.firstName + " " + vehicleDetail?.lastName}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {vehicleDetail?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {vehicleDetail?.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Tax Identification Number">
                  {vehicleDetail?.taxIdentificationNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Create Date">
                  {format(
                    add(new Date(vehicleDetail?.createDate), { hours: 7 }),
                    "HH:mm - dd/MM/yyyy"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Bank Name">
                  {vehicleDetail?.bankName}
                </Descriptions.Item>
                <Descriptions.Item label="Bank Account">
                  {vehicleDetail?.bankAccountNumber}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions column={2} bordered>
                <Descriptions.Item label="Create Verify Request" span={2}>
                  {format(
                    add(new Date(vehicleDetail?.createDate), { hours: 7 }),
                    "HH:mm - dd/MM/yyyy"
                  )}
                </Descriptions.Item>
                {vehicleDetail?.isVerified === 1 ? (
                  <>
                    <Descriptions.Item label="Verify Date" span={2}>
                      {format(
                        add(new Date(vehicleDetail?.verifyDate), { hours: 7 }),
                        "HH:mm - dd/MM/yyyy"
                      )}
                    </Descriptions.Item>
                  </>
                ) : vehicleDetail?.isRejected === 1 ? (
                  <>
                    <Descriptions.Item label="Reject Date" span={2}>
                      {format(
                        add(new Date(vehicleDetail?.rejectDate), {
                          hours: 7,
                        }),
                        "HH:mm - dd/MM/yyyy"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Reject reason" span={2}>
                      {vehicleDetail?.rejectReason}
                    </Descriptions.Item>
                  </>
                ) : (
                  <></>
                )}
                <Descriptions.Item label="Business License">
                  {vehicleDetail?.frontPictureLink ? (
                    <img
                      src={vehicleDetail?.frontPictureLink}
                      alt="Picture"
                      style={{ maxHeight: "430px" }}
                      onClick={() =>
                        handleImageClick(vehicleDetail?.frontPictureLink)
                      }
                    />
                  ) : (
                    <span className="font-medium">No license uploaded yet</span>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="OCOP License">
                  {vehicleDetail?.backPictureLink ? (
                    <img
                      src={vehicleDetail?.backPictureLink}
                      alt="Picture"
                      style={{ maxHeight: "430px" }}
                      onClick={() =>
                        handleImageClick(vehicleDetail?.backPictureLink)
                      }
                    />
                  ) : (
                    <span className="font-medium">No license uploaded yet</span>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </>
        ) : (
          <p>No details available.</p>
        )}
      </Modal>
      <ZoomableImageModal
        imageUrl={selectedImage}
        visible={isModalVisible}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PartnerPage;
