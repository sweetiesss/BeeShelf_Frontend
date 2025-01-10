import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AxiosPayment from "../../services/Payment";

import axios from "axios";
import { add, format } from "date-fns";
import {
  ArrowsLeftRight,
  Coins,
  DotsThreeVertical,
  Eye,
  EyeClosed,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import defaultImg from "../../assets/img/defaultImg.jpg";

export function PaymentPage() {
  const { t } = useTranslation();
  const { userInfor, isAuthenticated, authWallet } = useAuth();
  const moneyExchange = useRef();
  const moneyWithdrawn = useRef();
  const {
    createWithdrawnRequest,
    createQrCode,
    getPaymentTransactionByUserId,
    getPaymentWithDrawByUserId,
    getOrdersSaleByUserId,
  } = AxiosPayment();

  const [option, setOption] = useState("Custom_Amount");
  const [customeAmount, setCustomAmount] = useState();
  const [error, setError] = useState();
  const [hiddenNumber, setHiddenNumber] = useState(true);
  const [exhangePage, openExhangePage] = useState(false);
  const [withdrawnPage, openWithdrawnPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [typePayment, setTypePayment] = useState("Exchange");
  const [payments, setPayment] = useState();
  const [withdrawPayments, setWithdrawPayment] = useState();
  const [ordersSale, setOrdersSalePayment] = useState();
  const [openAction, handleOpenActionTab] = useState();
  const [selectedPayment, setSelectedPaymet] = useState();

  const [form, setForm] = useState({
    buyerEmail: userInfor?.email || "",
    cancelUrl: "https://www.beeshelf.com/partner/payment/result",
    returnUrl: "https://www.beeshelf.com/partner/payment/result",
    description: userInfor?.firstName + " exchange money.",
  });

  useEffect(() => {
    fetchBeginData();
    const handleClickOutSide = (event) => {
      if (
        moneyExchange.current &&
        !moneyExchange.current.contains(event.target)
      ) {
        setCustomAmount(0);
        openExhangePage(false);
      }
      if (
        moneyWithdrawn.current &&
        !moneyWithdrawn.current.contains(event.target)
      ) {
        setCustomAmount(0);
        openWithdrawnPage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  useEffect(() => {
    fetchBeginData();
  }, [refresh]);

  const fetchBeginData = async () => {
    try {
      setLoading(true);
      const result = await getPaymentTransactionByUserId(userInfor?.id);
      if (result?.status === 200) {
        setPayment(result?.data);
      }
      const result2 = await getPaymentWithDrawByUserId(userInfor?.id);
      if (result2?.status === 200) {
        setWithdrawPayment(result2?.data);
      }
      const result3 = await getOrdersSaleByUserId(userInfor?.id);
      if (result3?.status === 200) {
        setOrdersSalePayment(result3?.data);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async () => {
    try {
      setLoadingButton(true);
      let thisError = error;
      if (customeAmount >= 2000) {
        thisError = undefined;
      }

      if (!thisError) {
        const result = await createQrCode(option, customeAmount, form);

        if (result.status !== 400 && result.status !== 500) {
          const checkoutUrl = result?.data?.data?.checkoutUrl;
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          } else {
            console.error("Checkout URL not found in response");
          }
        } else {
          console.error("Invalid response status:", result.status);
        }

      }
    } catch (e) {
      console.error("Error during payment creation:", e);
    } finally {
    }
  };
  const handleSubmitWithdrawnPayment = async () => {
    try {
      let thisError = error;
      if (customeAmount > authWallet?.totalAmount) {
        return;
      }
      if (customeAmount <= 2000) {
        return;
      }

      const result = await createWithdrawnRequest(userInfor?.id, customeAmount);

      if (result?.status === 200) {
        setRefresh((prev) => !prev);
        openWithdrawnPage(true);
        setCustomAmount(0);
        setTypePayment("Withdrawn");
      }

    } catch (e) {
      console.error("Error during payment creation:", e);
    }
  };


  return (
    <div className="h-full relative">
      <div className="flex justify-between">
        <div>
          <p className="text-3xl font-semibold">{t("Transaction Management")}</p>
        </div>
        <div className="flex gap-4">
          <button
            className="p-2 px-4  border-2 rounded-2xl hover:bg-gray-100 bg-white"
            onClick={() => openWithdrawnPage(true)}
          >
            {t("Withdrawn")}
          </button>
          <button
            className="p-2 px-4  border-2 rounded-2xl hover:bg-green-600 bg-[var(--Xanh-Base)] text-white flex items-center"
            onClick={() => openExhangePage(true)}
          >
            <ArrowsLeftRight className="text-2xl mr-2" /> {t("Coin Exchange")}
          </button>
        </div>
      </div>
      <div className="my-8">
        <div className="shadow-xl border-2 bg-white rounded-lg p-8  mb-3 overflow-y-scroll max-h-[50rem] w-full relative">
          <div className="text-2xl mb-4">{t("Transaction")}</div>
          <div className="flex gap-4 items-center mb-4">
            <label>{t("Type Of Transaction")}: </label>
            <select
              className="border-2 px-2 py-1 rounded-xl text-gray-300 focus-within:text-black focus-within:border-black"
              value={typePayment}
              onChange={(e) => setTypePayment(e.target.value)}
            >
              <option value="Exchange">{t("Exchange")}</option>
              <option value="Withdrawn">{t("Withdrawn")}</option>
              <option value="OrdersSales">{t("Order Sales")}</option>
            </select>
          </div>
          {typePayment === "Exchange" ? (
            <table className="w-full">
              <thead>
                <tr>
                  <td className="text-center pb-2  ">#</td>

                  <td className="text-left pb-2  px-3">{t("Code")}</td>
                  <td className="text-left pb-2 ">{t("CreateDate")}</td>
                  <td className="text-left pb-2 ">{t("Description")}</td>
                  <td className="text-left pb-2 ">{t("Amount")}</td>
                  <td className="text-center pb-2">{t("Status")}</td>
                </tr>
              </thead>
              <tbody>
                {payments &&
                  payments?.map((payment, index) => {
                    return (
                      <>
                        <tr
                          key={index}
                          className={`hover:bg-gray-100 border-t-2 relative h-[4rem] items-center`}
                        >
                          <td className=" px-1 py-2 text-center ">
                            {index + 1}
                          </td>

                          <td className=" px-3 py-2  ">{payment?.code}</td>
                          <td className=" px-1 py-2 ">
                            {format(
                              add(new Date(payment?.createDate), { hours: 7 }),
                              "HH:mm - dd/MM/yyyy"
                            )}
                          </td>
                          <td className=" px-1 py-2 max-w-[20rem]">
                            {payment?.description}
                          </td>
                          <td
                            className={` px-1 py-2 font-medium ${
                              payment?.inventoryId === null
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {new Intl.NumberFormat().format(payment?.amount)}{" "}
                            vnd
                          </td>
                          <td className=" px-1 py-2 text-center align-middle">
                            <p
                              className={`px-2 py-1 inline-block rounded-full text-sm font-semibold h-fit w-fit ${
                                payment.status === "PAID"
                                  ? "bg-green-200 text-green-800"
                                  : payment.status === "Shipped"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : payment.status === "PENDING"
                                  ? "bg-blue-200 text-gray-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {t(payment.status)}
                            </p>
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          ) : typePayment === "Withdrawn" ? (
            <table className="w-full">
              <thead>
                <tr>
                  <td className="text-center pb-2  ">#</td>
                  <td className="text-center pb-2">{t("Image")}</td>
                  <td className="text-left pb-2  px-3">{t("StaffName")}</td>
                  <td className="text-left pb-2 ">{t("StaffEmail")}</td>
                  <td className="text-left pb-2 ">{t("Bank")}</td>
                  <td className="text-left pb-2 ">{t("Account")}</td>
                  <td className="text-left pb-2 ">{t("CreateDate")}</td>
                  <td className="text-left pb-2 ">{t("ConfirmDate")}</td>
                  <td className="text-left pb-2 ">{t("Amount")}</td>
                  <td className="text-center pb-2">{t("Status")}</td>
                </tr>
              </thead>
              <tbody>
                {withdrawPayments &&
                  withdrawPayments?.map((payment, index) => {
                    return (
                      <>
                        <tr
                          key={index}
                          className={`hover:bg-gray-100 border-t-2 relative h-[4rem] items-center`}
                        >
                          <td className=" px-1 py-2 text-center ">
                            {index + 1}
                          </td>
                          <td className=" py-2  flex justify-center items-center ">
                            <img
                              src={
                                payment?.pictureLink
                                  ? payment?.pictureLink
                                  : defaultImg
                              }
                              alt={payment?.name}
                              className="h-20 w-20 rounded-xl object-cover object-center"
                            />
                          </td>
                          <td className=" px-3 py-2  ">
                            {payment?.transferByStaffName || (
                              <span className="text-gray-400">
                                {t("Pending...")}
                              </span>
                            )}
                          </td>
                          <td className=" px-1 py-2 ">
                            {payment?.transferByStaffEmail || (
                              <span className="text-gray-400">
                                {t("Pending...")}
                              </span>
                            )}
                          </td>
                          <td className=" px-1 py-2">
                            {payment?.partner_bank_name}
                          </td>
                          <td className=" px-1 py-2">
                            {payment?.partner_bank_account}
                          </td>
                          <td className=" px-1 py-2 ">
                            {format(
                              add(new Date(payment?.createDate), { hours: 7 }),
                              "HH:mm - dd/MM/yyyy"
                            )}
                          </td>
                          <td className=" px-1 py-2 ">
                            {format(
                              add(new Date(payment?.confirmDate), { hours: 7 }),
                              "HH:mm - dd/MM/yyyy"
                            )}
                          </td>
                          <td className=" px-1 py-2 font-medium text-red-500">
                            {new Intl.NumberFormat().format(payment?.amount)}{" "}
                            vnd
                          </td>
                          <td className=" px-1 py-2 text-center align-middle">
                            <p
                              className={`px-2 py-1 inline-block rounded-full text-sm font-semibold h-fit w-fit ${
                                payment?.isTransferred === 1
                                  ? "bg-green-200 text-green-800"
                                  : payment?.isTransferred === 0
                                  ? "bg-gray-200 text-gray-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {payment?.isTransferred === 1
                                ? t("COMPLETE")
                                : payment?.isTransferred === 0
                                ? t("PENDING")
                                : "CANCELED"}
                            </p>
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <td className="text-center pb-2  ">#</td>

                  <td className="text-left pb-2  px-3">{t("OrderCode")}</td>
                  <td className="text-left pb-2 ">{t("ShipperEmail")}</td>
                  <td className="text-left pb-2 ">{t("ShipperName")}</td>
                  <td className="text-left pb-2 ">{t("Account")}</td>
                  <td className="text-left pb-2 ">{t("CreateDate")}</td>
                  <td className="text-left pb-2 ">{t("ConfirmDate")}</td>
                  <td className="text-left pb-2 ">{t("Amount")}</td>
                  <td className="text-center pb-2">{t("Status")}</td>
                </tr>
              </thead>
              <tbody>
                {ordersSale &&
                  ordersSale?.map((payment, index) => {
                    return (
                      <>
                        <tr
                          key={index}
                          className={`hover:bg-gray-100 border-t-2 relative h-[4rem] items-center`}
                        >
                          <td className=" px-1 py-2 text-center ">
                            {index + 1}
                          </td>
                          <td className=" px-3 py-2  ">{payment?.orderCode}</td>
                          <td className=" px-1 py-2 ">
                            {payment?.shipperEmail}
                          </td>
                          <td className=" px-1 py-2">{payment?.shipperName}</td>
                          <td className=" px-1 py-2">
                            {payment?.partner_bank_account}
                          </td>
                          <td className=" px-1 py-2 ">
                          </td>
                          <td className=" px-1 py-2 ">
                          </td>
                          <td className=" px-1 py-2 text-green-500 font-medium">
                            {new Intl.NumberFormat().format(
                              payment?.totalAmount
                            )}{" "}
                            vnd
                          </td>
                          <td className=" px-1 py-2 text-center align-middle">
                            <p
                              className={`px-2 py-1 inline-block rounded-full text-sm font-semibold h-fit w-fit ${
                                payment?.isTransferred === 1
                                  ? "bg-green-200 text-green-800"
                                  : payment?.isTransferred === 0
                                  ? "bg-gray-200 text-gray-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {payment?.isTransferred === 1
                                ? t("COMPLETE")
                                : payment?.isTransferred === 0
                                ? t("PENDING")
                                : "CANCELED"}
                            </p>
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {exhangePage && (
        <>
          <div className=" inset-0 bg-black w-full h-full fixed opacity-50"></div>
          <div
            className="w-[60rem] p-8 shadow-lg rounded-3xl bg-white absolute"
            style={{
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            ref={moneyExchange}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-4 text-center">
                {t("Money Exchange")}
              </h1>
              <p className="text-xl text-center text-gray-500">
                {t("Choose Your Exchange Amount")}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-10">
              {[30000, 50000, 100000, 200000].map((amount) => (
                <div
                  key={amount}
                  className={`p-4 text-center rounded-lg cursor-pointer shadow-md transition-all ${
                    customeAmount === amount
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setCustomAmount(amount);
                  }}
                >
                  {new Intl.NumberFormat().format(amount)} vnd
                </div>
              ))}
            </div>
            <div className="w-full relative my-10">
              <div className="bg-gray-300 h-[2px]"></div>
              <div
                className="text-center mb-6 p-3 text-gray-500 text-xl absolute bg-white"
                style={{
                  top: "60%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {t("or")}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 relative">
              <div
                className={`flex items-center bg-[var(--en-vu-200)] rounded-2xl w-[25rem] overflow-hidden   px-4 py-4  focus-within:text-black `}
              >
                <div
                  className={`px-3 py-4 bg-white border-2 rounded-2xl shadow-xl ${
                    customeAmount > 0 ? "border-[var(--Xanh-Base)]" : ""
                  }`}
                >
                  VND
                </div>
                <input
                  type="number"
                  min={0}
                  max={1000000}
                  className=" rounded-lg px-4 text-xl w-full max-w-sm h-[3.5rem] outline-none bg-transparent"
                  placeholder="Enter custom amount"
                  value={customeAmount}
                  onChange={(e) => {
                    setError();
                    if ((e.target.value < 20000) & (e.target.value > 0))
                      setError("TheMinimumAmountMustBeLarger20000vnd");
                    setCustomAmount(e.target.value);
                  }}
                />
              </div>
              <ArrowsLeftRight className="text-3xl" />
              <div
                className={`flex items-center bg-[var(--en-vu-200)] rounded-2xl w-[25rem] overflow-hidden   px-4 py-4  focus-within:text-black `}
              >
                <div
                  className={`px-5 py-4 bg-white border-2 rounded-2xl shadow-xl ${
                    customeAmount > 0 ? "border-[var(--Xanh-Base)]" : ""
                  }`}
                >
                  <Coins className="text-2xl" />
                </div>
                <div
                  className=" rounded-lg px-4 text-xl w-full max-w-sm h-[3.5rem] outline-none bg-transparent cursor-not-allowed items-center flex"
                  placeholder="Enter custom amount"
                >
                  {new Intl.NumberFormat().format(customeAmount)}
                </div>
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-center w-full mt-4">
                {t(error)}
              </div>
            )}
            <div className="mt-8 text-center w-full">
              <button
                onClick={!loadingButton ? handleSubmitPayment : undefined}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-all"
                disabled={loadingButton}
              >
                {t("Generate QR Payment")}
              </button>
            </div>
          </div>
        </>
      )}
      {withdrawnPage && (
        <>
          <div className=" inset-0 bg-black w-full h-full fixed opacity-50"></div>
          <div
            className="w-[60rem] p-8 shadow-lg rounded-3xl bg-white absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            ref={moneyWithdrawn}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-4 text-center">
                {t("Money Withdraw")}
              </h1>
              <p className="text-xl text-center text-gray-500">
                {t("Choose Your Withdrawn Amount")}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-10">
              {[30000, 50000, 100000, 200000].map((amount) => (
                <div
                  key={amount}
                  className={`p-4 text-center rounded-lg cursor-pointer shadow-md transition-all ${
                    customeAmount === amount
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setError();
                    if (amount > authWallet?.totalAmount)
                      setError("TheMinimumAmountMustBeLargerYourWallet");

                    setCustomAmount(amount);
                  }}
                >
                  {new Intl.NumberFormat().format(amount)} vnd
                </div>
              ))}
            </div>
            <div className="w-full relative my-10">
              <div className="bg-gray-300 h-[2px]"></div>
              <div
                className="text-center mb-6 p-3 text-gray-500 text-xl absolute bg-white"
                style={{
                  top: "60%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {t("or")}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 relative">
              <div
                className={`flex items-center bg-[var(--en-vu-200)] rounded-2xl w-[25rem] overflow-hidden   px-4 py-4  focus-within:text-black `}
              >
                <div
                  className={`px-5 py-4 bg-white border-2 rounded-2xl shadow-xl ${
                    customeAmount > 0 ? "border-[var(--Xanh-Base)]" : ""
                  }`}
                >
                  <Coins className="text-2xl" />
                </div>
                <input
                  type="number"
                  min={0}
                  max={1000000}
                  className=" rounded-lg px-4 text-xl w-full max-w-sm h-[3.5rem] outline-none bg-transparent"
                  placeholder="Enter custom amount"
                  value={customeAmount}
                  onChange={(e) => {
                    setError();
                    if ((e.target.value < 20000) & (e.target.value > 0))
                      setError("TheMinimumAmountMustBeLarger20000vnd");
                    if (e.target.value > authWallet?.totalAmount)
                      setError("TheMinimumAmountMustBeLargerYourWallet");

                    setCustomAmount(e.target.value);
                  }}
                />
              </div>
              <ArrowsLeftRight className="text-3xl" />
              <div
                className={`flex items-center bg-[var(--en-vu-200)] rounded-2xl w-[25rem] overflow-hidden   px-4 py-4  focus-within:text-black `}
              >
                <div
                  className={`px-3 py-4 bg-white border-2 rounded-2xl shadow-xl ${
                    customeAmount > 0 ? "border-[var(--Xanh-Base)]" : ""
                  }`}
                >
                  VND
                </div>

                <div
                  className=" rounded-lg px-4 text-xl w-full max-w-sm h-[3.5rem] outline-none bg-transparent cursor-not-allowed items-center flex"
                  placeholder="Enter custom amount"
                >
                  {new Intl.NumberFormat().format(customeAmount)}
                </div>
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-center w-full mt-4">
                {t(error)}
              </div>
            )}
            <div className="mt-8 text-center w-full">
              <button
                onClick={handleSubmitWithdrawnPayment}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-all"
              >
                {t("Create Withdrawn Request")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
