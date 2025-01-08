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
} from "antd";
import useAxios from "../../services/CustomizeAxios";
import { Descriptions } from "antd";
import { t } from "i18next";
import {
  Garage,
  GearSix,
  Motorcycle,
  Tire,
  Truck,
  Van,
} from "@phosphor-icons/react";
const { Option } = Select;

const CategoryPage = () => {
  const { fetchDataBearer } = useAxios();

  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showVehicles, setShowVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteHolder, setDeleteHolder] = useState();
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [form] = Form.useForm();
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetchDataBearer({
        url: `productCategory/get-product-categories`,
        method: "GET",
        params: {
          pageIndex: filter?.pageIndex,
          pageSize: filter?.pageSize,
        },
      });
      const response2 = await fetchDataBearer({
        url: `productCategory/get-categories`,
        method: "GET",
        params: {
          pageIndex: 0,
          pageSize: 100,
        },
      });
      setCategories(response2?.data);
      setVehicles(response?.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      message.error("Failed to fetch vehicles.");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [updateVisible, setUpdateVisible] = useState(false);
  const openUpdateModal = (record) => {
    setSelectedVehicle(record);
    form.setFieldsValue({
      typeName: record?.typeName,
      typeDescription: record?.typeDescription,
      categoryId:record?.categoryId,
      expireIn: record?.expireIn,
    });
    setUpdateVisible(true);
  };
  const [detailVisible, setDetailVisible] = useState(false);
  const [vehicleDetail, setVehicleDetail] = useState(null);
  const handleCloseDetailModal = () => {
    setDetailVisible(false);
    setVehicleDetail(null);
  };
  const handleUpdateVehicle = async () => {
    try {
      const values = await form.validateFields();
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
        fetchVehicles();
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

  const createVehicle = async () => {
    try {
      const values = await form.validateFields();

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
        form.resetFields(); 
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
  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [filter]);
  return (
    <div className="">
      <Button
        style={{ marginBottom: "2rem" }}
        type="primary"
        onClick={
          () => setVisible(true)
        }
      >
        CreateProductCategory
      </Button>
      <Modal
        title="CreateProductCategory"
        open={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
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
      <Table
        dataSource={vehicles?.items}
        size="large"
        columns={[
          {
            title: "Type",
            dataIndex: "typeName",
            key: "typeName",
            width: 150,
            align: "start",
          },
          {
            title: "Description",
            dataIndex: "typeDescription",
            key: "typeDescription",
            width: 150,
            align: "start",
          },
          {
            title: "ExpireIn",

            key: "expireIn",
            width: 100,
            align: "start",
            render: (text, record) => (
              <span>
                {record?.expireIn} {t("days")}
              </span>
            ),
          },

          {
            title: "Actions",
            key: "actions",
            width: 100,
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
                    onClick={() => openUpdateModal(record)}
                    style={{
                      color: "#0db977",
                      borderColor: "#0db977",
                      borderRadius: "5px",
                      padding: "0 8px",
                      minWidth: "80px",
                      height: "2rem",
                    }}
                  >
                    Update
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
    </div>
  );
};

export default CategoryPage;
