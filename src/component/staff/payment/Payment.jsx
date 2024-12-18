import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Table, message, Spin, Button, Input, Modal, Form, Select } from "antd";
import { useParams } from "react-router-dom";
import useAxios from "../../../services/CustomizeAxios";
import { useAuth } from "../../../context/AuthContext";

const Payment = () => {
  const { userInfor } = useAuth(); // Lấy thông tin user từ hook useAuth
  const { moneyTransferId: urlPaymentId } = useParams(); // Lấy paymentId từ URL
  const [moneyTransferId, setPaymentId] = useState(urlPaymentId || ""); // Trạng thái cho paymentId (lấy từ URL nếu có)
  const [pictureLink, setPictureLink] = useState(null); // Trạng thái cho picture_link
  const [file, setFile] = useState(null); // Trạng thái cho file ảnh
  const [visible, setVisible] = useState(false); // Trạng thái hiển thị modal
  const [payments, setPayments] = useState([]);
  const [paymentIdOptions, setPaymentIdOptions] = useState([]); // Trạng thái cho danh sách paymentId options
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalItemsCount: 0,
    pageSize: 8,
    pageIndex: 0,
  });
  const { fetchDataBearer } = useAxios();
  const { t } = useTranslation();

  // Hàm gọi API để lấy danh sách thanh toán
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const warehouseId = userInfor?.workAtWarehouseId;

      if (!warehouseId) {
       
        message.error(t("WarehouseIDisnotavailable.Pleaseloginagain."));
        setLoading(false);
        return;
      }

      const response = await fetchDataBearer({
        url: `/payment/get-money-transfers/${warehouseId}`,
        method: "GET",
        params: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      });

      if (response && response.data) {
        setPayments(response.data);
        message.success(t("Dataloadedsuccessfully!"));

        // Tạo danh sách paymentId cho Select component
        const options = response.data
          .filter((item) => item.isTransferred === 0)
          .map((item) => ({
            value: item.id,
            label: `MoneyTransferId: ${item.id} - OCOP Partner ID: ${
              item.ocopPartnerId
            } - Amount: ${new Intl.NumberFormat("vi-VN", {
              style: "decimal",
              maximumFractionDigits: 0,
            }).format(item.amount)} VNĐ`,
          }));

        setPaymentIdOptions(options);
      } else {
        message.error(t("Nodatareturnedfromtheserver."));
      }
    } catch (error) {
      console.error(t("Errorfetchingpayments:"), error);
      message.error(t("Failedtofetchpayments."));
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi file ảnh và upload ảnh lên server
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      message.error(t("Pleaseselectavalidimagefile."));
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetchDataBearer({
        url: "/picture/upload-image", // Sử dụng API mới
        method: "POST",
        data: formData,
      });

      if (response && response.data) {
        setFile(selectedFile);
        setPictureLink(response.data); // Giả sử response.data chứa URL của ảnh
        message.success(t("Imageuploadedsuccessfully!"));
      } else {
        message.error(t("Failedtouploadimage."));
      }
    } catch (error) {
      console.error(t("Erroruploadingimage:"), error);
      message.error(t("Anerroroccurredwhileuploadingtheimage."));
    }
  };

  // Hàm gọi API để tạo một payment mới
  const createPayment = async () => {
    setLoading(true);
    try {
      if (!moneyTransferId) {
        message.error(t("PleaseselectaPaymentID."));
        setLoading(false);
        return;
      }

      if (!pictureLink) {
        message.error(t("Pleaseuploadapicture."));
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("moneyTransferId", moneyTransferId);
      formData.append("picture_link", pictureLink);

      const pictureLinkParam = encodeURIComponent(
        pictureLink.name || pictureLink
      );

      const response = await fetchDataBearer({
        url: `/payment/confirm-money-transfer-request/${userInfor?.id}/${moneyTransferId}?picture_link=${pictureLinkParam}`,
        method: "POST",
        data: formData,
      });

      if (response && response.status === 200) {
        message.success(t("Paymentconfirmedsuccessfully!"));
        fetchPayments();
        setVisible(false);
        setPictureLink(null);
        setPaymentId("");
      } else {
        const errorMessage =
          response?.data?.message || t("Failedtoconfirmmoneytransfer");
        message.error(errorMessage);
      }
    } catch (error) {
      console.error(t("Errorconfirmingpayment:"), error);
      message.error(t("Anerroroccurredwhileconfirmingthpayment"));
    } finally {
      setLoading(false);
    }
  };

  // Định nghĩa các cột trong bảng
  const columns = [
    {
      title: t("ID"), 
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    // {
    //   title: t("ocopPartnerId"),
    //   dataIndex: "ocopPartnerId",
    //   key: "ocopPartnerId",
    //   align: "center",
    // },
    {
      title: t("OcopPartnerEmail"),
      dataIndex: "partner_email",
      key: "partner_email",
      align: "center",
    },
    {
      title: t("OcopPartnerEmail"),
      dataIndex: "partner_email",
      key: "partner_email",
      align: "center",
    },
    {
      title: t("BankName"),
      dataIndex: "partner_bank_name",
      key: "partner_bank_name",
      align: "center",
    },
    {
      title: t("BankAccount"),
      dataIndex: "partner_bank_account",
      key: "partner_bank_account",
      align: "center",
    },
    // {
    //   title: t("TransferBy"),
    //   dataIndex: "transferBy",
    //   key: "transferBy",
    //   align: "center",
    // },
    {
      title: t("TransferByStaffEmail"),
      dataIndex: "transferByStaffEmail",
      key: "transferByStaffEmail",
      align: "center",
    },
    {
      title: t("Amount"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (amount) =>
        `${new Intl.NumberFormat("vi-VN", {
          style: "decimal",
          maximumFractionDigits: 0,
        }).format(amount)} VNĐ`,
    },
    {
      title: t("CreateDate"),
      dataIndex: "createDate",
      key: "createDate",
      align: "center",
      render: (text) => {
        if (!text) return "N/A";
        const date = new Date(text);
        const formattedDate = new Intl.DateTimeFormat("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "Asia/Ho_Chi_Minh",
        }).format(date);

        const formattedTime = new Intl.DateTimeFormat("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Ho_Chi_Minh",
        }).format(date);

        return (
          <>
            {formattedDate}
            <br />
            {formattedTime}
          </>
        );
      },
    },
    {
      title: t("ConfirmDate"),
      dataIndex: "confirmDate",
      key: "confirmDate",
      align: "center",
      render: (text) => {
        if (!text) return "Null";
        const date = new Date(text);
        const formattedDate = new Intl.DateTimeFormat("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "Asia/Ho_Chi_Minh",
        }).format(date);

        const formattedTime = new Intl.DateTimeFormat("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Ho_Chi_Minh",
        }).format(date);

        return (
          <>
            {formattedDate}
            <br />
            {formattedTime}
          </>
        );
      },
    },


    {
      title: t("PictureLink"), 
      dataIndex: "pictureLink",
      key: "pictureLink",
      align: "center",
      render: (link) => {
        const baseStyle = {
          borderRadius: "4px",
          padding: "6px 12px",
          display: "inline-block",
          color: "#fff",
          textDecoration: "none",
          cursor: "pointer",
          transition: "transform 0.2s, opacity 0.2s",
        };

        const viewImageStyle = {
          ...baseStyle,
          backgroundColor: "#1890ff", // Màu xanh cho View Image
        };

        const noImageStyle = {
          ...baseStyle,
          backgroundColor: "#ffcccc", // Màu đỏ nhạt cho No Image
          color: "#a8071a", // Màu chữ đỏ đậm
        };

        return link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={viewImageStyle}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.95)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {t("ViewImage")}
          </a>
        ) : (
          <span
            style={noImageStyle}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.95)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {t("NoImage")}
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    fetchPayments();
  }, [pagination.pageIndex]);

  return (
    <div style={{ padding: "20px" }}>
       <h1 className="text-4xl font-bold text-gray-800 mb-8">
      {t("TransferManage")} 
    </h1>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">
        {t("TransferMoneyRequestList")}
      </h1>
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          style={{ marginBottom: 20 }}
        >
         {t("ConfirmMoneyTransferRequest")}
        </Button>
      </div>

      <Modal
        title={t("ConfirmMoneyTransferRequest")}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            {t("Cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={createPayment}
          >
            {t("ConfirmMoneyTransferRequest")} 
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label={t("StaffID")}  required>
            <Input value={userInfor?.id} disabled placeholder="Staff ID" />
          </Form.Item>

          <Form.Item label={t("PaymentID")} required>
            <Select
              value={moneyTransferId}
              onChange={setPaymentId}
              placeholder={t("SelectPaymentID")} 
              allowClear
            >
              {paymentIdOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label={t("UploadPicture")}  required>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        dataSource={payments}
        columns={columns}
        rowKey="id"
        loading={{
          spinning: loading,
        }}
        pagination={{
          current: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          total: pagination.totalItemsCount,
          onChange: (page) =>
            setPagination((prev) => ({ ...prev, pageIndex: page - 1 })),
        }}
      />
    </div>
  );
};

export default Payment;
