import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AxiosPayment from "../../services/Payment";
import { t } from "i18next";
import axios from "axios";
import { format } from "date-fns";
import {
  ArrowsLeftRight,
  Coins,
  DotsThreeVertical,
  Eye,
  EyeClosed,
} from "@phosphor-icons/react";

export function PaymentPage() {
  const { userInfor, isAuthenticated } = useAuth();
  const [option, setOption] = useState("Custom_Amount");
  const [customeAmount, setCustomAmount] = useState();
  const [error, setError] = useState();
  const [authWallet, setAuthWallet] = useState();
  const [hiddenNumber, setHiddenNumber] = useState(true);
  const [exhangePage, openExhangePage] = useState(false);
  const [withdrawnPage, openWithdrawnPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [typePayment, setTypePayment] = useState("Exchange");
  const [payments, setPayment] = useState();
  const [withdrawPayments, setWithdrawPayment] = useState();
  const [openAction, handleOpenActionTab] = useState();
  const [selectedPayment, setSelectedPaymet] = useState();
  const moneyExchange = useRef();
  const moneyWithdrawn = useRef();

  const [form, setForm] = useState({
    buyerEmail: userInfor?.email || "",
    cancelUrl: "https://www.beeshelf.com/partner/payment/result",
    returnUrl: "https://www.beeshelf.com/partner/payment/result",
    description: userInfor?.firstName + " exchange money.",
  });
  const {
    createWithdrawnRequest,
    createQrCode,
    getPaymentTransactionByUserId,
    getPaymentWithDrawByUserId,
  } = AxiosPayment();

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
        console.log("payment", result);
        setPayment(result?.data);
      }
      const result2 = await getPaymentWithDrawByUserId(userInfor?.id);
      if (result2?.status === 200) {
        console.log("withDrawnPayment", result2);
        setWithdrawPayment(result2?.data);
      }

      await getAuthWalletMoney();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async () => {
    console.log(option);
    console.log(customeAmount);
    console.log(form);

    try {
      let thisError = error;
      if (customeAmount >= 2000) {
        thisError = undefined;
      }

      if (!thisError) {
        const result = await createQrCode(option, customeAmount, form);

        if (result.status !== 400 && result.status !== 500) {
          // Navigate directly to the checkout URL
          const checkoutUrl = result?.data?.data?.checkoutUrl;
          if (checkoutUrl) {
            window.location.href = checkoutUrl; // Navigate the current tab
          } else {
            console.error("Checkout URL not found in response");
          }
        } else {
          console.error("Invalid response status:", result.status);
        }

        console.log(result);
      }
    } catch (e) {
      console.error("Error during payment creation:", e);
    }
  };
  const handleSubmitWithdrawnPayment = async () => {
    console.log(customeAmount);
    try {
      let thisError = error;
      if (customeAmount >= 2000) {
        thisError = undefined;
      }

      if (!thisError) {
        const result = await createWithdrawnRequest(
          userInfor?.id,
          customeAmount
        );

        if (result?.status === 200) {
          setRefresh((prev) => !prev);
          openWithdrawnPage(true);
          setCustomAmount(0);
          setTypePayment("Withdrawn")
        }

        console.log(result);
      }
    } catch (e) {
      console.error("Error during payment creation:", e);
    }
  };

  const getAuthWalletMoney = async () => {
    try {
      if (userInfor?.roleName === "Partner" && userInfor?.roleId == 2) {
        if (userInfor && isAuthenticated) {
          console.log("check tokeen", isAuthenticated);

          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL_API}partner/get-wallet/${userInfor?.id}`,
            {
              headers: {
                Authorization: `Bearer ${isAuthenticated}`,
              },
            }
          );
          console.log(response);

          setAuthWallet(response.data);
        }
      } else {
        return;
      }
    } catch (error) {
      console.error(
        "Error fetching wallet:",
        error.response?.data || error.message
      );
    } finally {
    }
  };
  console.log(typePayment);

  return (
    <div className="h-full relative">
      <div className="flex justify-between">
        <div>
          <p className="text-3xl font-semibold">{t("MyWallet")}</p>
        </div>
        <div className="flex gap-4">
          <button
            className="p-2 px-4  border-2 rounded-2xl hover:bg-gray-100 bg-white"
            onClick={() => openWithdrawnPage(true)}
          >
            {t("Withdraw")}
          </button>
          <button
            className="p-2 px-4  border-2 rounded-2xl hover:bg-green-600 bg-[var(--Xanh-Base)] text-white flex items-center"
            onClick={() => openExhangePage(true)}
          >
            <ArrowsLeftRight className="text-2xl mr-2" /> {t("CoinExchange")}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4 my-8">
        <div className="col-span-2   border-2 p-8 rounded-xl shadow-xl h-fit">
          <div className="flex mb-4 justify-between items-center">
            <div className="text-2xl">{t("WalletBalance")}</div>
            <>
              {hiddenNumber ? (
                <EyeClosed
                  weight="bold"
                  className="text-3xl hover:scale-110 cursor-pointer"
                  onClick={() => setHiddenNumber(false)}
                />
              ) : (
                <Eye
                  weight="bold"
                  className="text-3xl hover:scale-110 cursor-pointer"
                  onClick={() => setHiddenNumber(true)}
                />
              )}
            </>
          </div>
          {[
            {
              walletColor:
                "linear-gradient(254deg, #0A9A63 0.24%, #35C48D 99.76%",
              walletName: "BeeShelf Coin",
              walletCoins: hiddenNumber
                ? "xxxxxxxxxxxx"
                : new Intl.NumberFormat().format(authWallet?.totalAmount),
              createDate: userInfor?.createDate,
            },
          ].map((wallet) => (
            <div
              className=" rounded-xl px-10 py-8 text-white"
              style={{ background: wallet.walletColor }}
            >
              <div>
                <div className="font-medium text-2xl">{wallet.walletName}</div>
                <div className="text-3xl mt-5 mb-7">
                  {wallet.walletCoins} vnd
                </div>
                {wallet?.createDate && (
                  <div className="text-base text-[var(--en-vu-10-white)]">
                    {t("ActiveOn") +
                      ": " +
                      format(wallet?.createDate, "MMM dd,yyyy")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="shadow-xl border-2 bg-white col-span-5 rounded-lg p-8  mb-3 overflow-y-scroll max-h-[50rem] w-full relative">
          <div className="text-2xl mb-4">{t("Transaction")}</div>
          <div className="flex gap-4 items-center mb-4">
            <label>{t("TypyeOfTransaction")}: </label>
            <select
              className="border-2 px-2 py-1 rounded-xl text-gray-300 focus-within:text-black focus-within:border-black"
              value={typePayment}
              onChange={(e) => setTypePayment(e.target.value)}
            >
              <option value="Exchange">{t("Exchange")}</option>
              <option value="Withdrawn">{t("Withdrawn")}</option>
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
                            {format(payment?.createDate, "hh:mm - dd/MM/yyyy")}
                          </td>
                          <td className=" px-1 py-2 max-w-[20rem]">
                            {payment?.description}
                          </td>
                          <td className=" px-1 py-2 ">
                            {new Intl.NumberFormat().format(payment?.amount)}{" "}
                            vnd
                          </td>
                          <td className=" px-1 py-2 text-center align-middle">
                            <p
                              className={`px-2 py-1 inline-block rounded-full text-sm font-semibold h-fit w-fit ${
                                payment.status === "COMPLETED"
                                  ? "bg-green-200 text-green-800"
                                  : payment.status === "Shipped"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : payment.status === "PENDING"
                                  ? "bg-blue-200 text-gray-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {payment.status}
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
                  <td className="text-left pb-2  px-3">{t("StaffName")}</td>
                  <td className="text-left pb-2 ">{t("StaffEmail")}</td>
                  <td className="text-left pb-2 ">{t("CreateDate")}</td>
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

                          <td className=" px-3 py-2  ">
                            {payment?.transferByStaffName || (
                              <span className="text-gray-400">
                                {t("Pending...")}
                              </span>
                            )}
                          </td>
                          <td className=" px-1 py-2 max-w-[20rem]">
                            {payment?.transferByStaffEmail || (
                              <span className="text-gray-400">
                                {t("Pending...")}
                              </span>
                            )}
                          </td>
                          <td className=" px-1 py-2 ">
                            {format(payment?.createDate, "hh:mm - dd/MM/yyyy")}
                          </td>
                          <td className=" px-1 py-2 ">
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
                                ? "COMPLETE"
                                : payment?.isTransferred === 0
                                ? "PENDING"
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
              top: "70%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            ref={moneyExchange}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-4 text-center">
                {t("MoneyExchange")}
              </h1>
              <p className="text-xl text-center text-gray-500">
                {t("ChooseYourExchangeAmount")}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-10">
              {/* Predefined Amount Options */}
              {[10000, 50000, 100000, 200000].map((amount) => (
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
              {/* Custom Amount Input */}
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
                      setError("TheMinimumAmountMustBe2000vnd");
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
                {error}
              </div>
            )}
            <div className="mt-8 text-center w-full">
              {/* Submit Button */}
              <button
                onClick={handleSubmitPayment}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-all"
              >
                {t("GenerateQRCode")}
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
              top: "70%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            ref={moneyWithdrawn}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-4 text-center">
                {t("MoneyWithdraw")}
              </h1>
              <p className="text-xl text-center text-gray-500">
                {t("ChooseYourWithDrawnAmount")}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-10">
              {/* Predefined Amount Options */}
              {[10000, 50000, 100000, 200000].map((amount) => (
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
              {/* Custom Amount Input */}
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
                      setError("TheMinimumAmountMustBe20000vnd");
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
                {error}
              </div>
            )}
            <div className="mt-8 text-center w-full">
              {/* Submit Button */}
              <button
                onClick={handleSubmitWithdrawnPayment}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-all"
              >
                {t("CreateWithdrawnRequest")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
