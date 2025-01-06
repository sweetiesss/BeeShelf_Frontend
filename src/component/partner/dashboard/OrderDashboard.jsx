import React, { useEffect, useState } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../../context/AuthContext";
import AxiosPartner from "../../../services/Partner";
import { Bag, Minus, Package, TrendDown, TrendUp } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import SpinnerLoading from "../../shared/Loading";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import AxiosInventory from "../../../services/Inventory";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const OrderDashboard = () => {
  // Dummy data for sales overview
  const [allProducts, setAllProduct] = useState();
  const [allIventories, setAllIventory] = useState();
  const [orders, setOrders] = useState();
  const [ordersPrevious, setOrdersPrevious] = useState();
  const { userInfor } = useAuth();
  const { getOrderRevunue, getAllProduct } = AxiosPartner();
  const { getInventory1000ByUserId } = AxiosInventory();

  const [revenueUpdate, setRevenueUpdate] = useState();
  const [revenueUpdate2, setRevenueUpdate2] = useState();
  const [totalStatusCount, setTotalStatusCount] = useState();
  const [totalStatusCount2, setTotalStatusCount2] = useState();
  const [loading, setLoading] = useState(false);
  const [thisYear, setThisYear] = useState(new Date().getFullYear());
  const { t } = useTranslation();
  const salesOverviewData = {
    labels: [
      t("Canceled"),
      t("Completed"),
      t("Failed"),
      t("Pending"),
      t("Shipping"),
    ],
    datasets: [
      {
        label: t("SalesOverview"),
        data: [
          totalStatusCount?.orderStatus?.Canceled,
          totalStatusCount?.orderStatus?.Completed,
          totalStatusCount?.orderStatus?.Failed,
          totalStatusCount?.orderStatus?.Pending,
          totalStatusCount?.orderStatus?.Shipping,
        ],
        backgroundColor: [
          "#F44336",
          "#4CAF50",
          "#FF9800",
          "#FFEB3B",
          "#2196F3",
        ],
        hoverOffset: 4,
      },
    ],
  };
  useEffect(() => {
    const fetchBeginData = async () => {
      try {
        setLoading(true);
        const result = await getOrderRevunue(userInfor?.id, thisYear);
        const result2 = await getOrderRevunue(userInfor?.id, thisYear - 1);
        const result3 = await getAllProduct(userInfor?.id);
        const result4 = await getInventory1000ByUserId(userInfor?.id);
        if (result?.status === 200 && result2?.status === 200) {
          const getData = result?.data;
          const getData2 = result2?.data;
          setOrders(getData);
          setOrdersPrevious(getData2);

          const completedOrderTotals = getData?.map((entry) => {
            // Filter for Completed orders and sum their orderAmount
            return entry.data
              .filter((order) => order.orderStatus === "Completed")
              .reduce((sum, order) => sum + order.amount, 0);
          });
          const completedOrderTotals2 = getData2?.map((entry) => {
            // Filter for Completed orders and sum their orderAmount
            return entry.data
              .filter((order) => order.orderStatus === "Completed")
              .reduce((sum, order) => sum + order.amount, 0);
          });
          setRevenueUpdate(completedOrderTotals);
          setRevenueUpdate2(completedOrderTotals2);
          setTotalStatusCount(calculateOrderStatuses(getData));
          setTotalStatusCount2(calculateOrderStatuses(getData2));
        }
        if (result3?.status === 200) {
          setAllProduct(result3?.data);
        }
        if (result4?.status === 200) {
          setAllIventory(result4?.data);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchBeginData();
  }, [thisYear]);

  const salesOverviewOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw.toLocaleString()} ${t("orders")}`,
        },
      },
    },
  };

  // Dummy data for revenue updates
  const revenueUpdateData = {
    labels: [
      t("Jan"),
      t("Feb"),
      t("Mar"),
      t("Apr"),
      t("May"),
      t("Jun"),
      t("Jul"),
      t("Aug"),
      t("Sep"),
      t("Oct"),
      t("Nov"),
      t("Dec"),
    ],
    datasets: [
      {
        label: "vnd",
        data: revenueUpdate,
        backgroundColor: "#0db977",
      },
    ],
  };
  const calculateOrderStatuses = (data) => {
    const statusCount = {
      Canceled: 0,
      Completed: 0,
      Failed: 0,
      Shipping: 0,
      Pending: 0,
    };
    const statusSales = {
      Canceled: 0,
      Completed: 0,
      Failed: 0,
      Shipping: 0,
      Pending: 0,
    };

    let totalOrder = 0;
    let totalSales = 0;

    // Loop through months
    data.forEach((month) => {
      month.data.forEach((order) => {
        // Add up order statuses
        statusCount[order.orderStatus] += order?.orderAmount || 0;
        statusSales[order.orderStatus] += order?.amount || 0;

        // Sum total orders and sales for Completed status
        if (order.orderStatus === "Completed") {
          totalOrder += order.orderAmount || 0;
          totalSales += order.amount || 0;
        }
      });
    });

    const result = {
      orderStatus: { ...statusCount },
      orderSales: { ...statusSales },
      totalOrder,
      totalSales,
    };

    return result; // Set the state
  };

  const revenueUpdateOptions = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Dummy data for yearly sales
  const yearlySalesData = {
    labels: [
      t("Jan"),
      t("Feb"),
      t("Mar"),
      t("Apr"),
      t("May"),
      t("Jun"),
      t("Jul"),
      t("Aug"),
      t("Sep"),
      t("Oct"),
      t("Nov"),
      t("Dec"),
    ],
    datasets: [
      {
        label: thisYear - 1 + " " + t("Sales"),
        data: revenueUpdate2,
        borderColor: "#F5659C",
        backgroundColor: "#F24688",
        fill: true,
        tension: 0.4,
      },
      {
        label: thisYear + " " + t("Sales"),
        data: revenueUpdate,
        borderColor: "#0a9a63",
        backgroundColor: "#0db977",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const yearlySalesOptions = {
    plugins: {
      legend: { position: "bottom" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  const onChange = (date, dateString) => {
    console.log("dateString", dateString);
    if (dateString) {
      setThisYear(dateString);
      return;
    }
    setThisYear(new Date().getFullYear());
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">{t("Dashboard")}</h1>
      {!loading ? (
        <div>
          <div className="flex gap-4 mb-8 items-center">
            <p className="font-medium text-xl">{t("SelectYear")}</p>
            <DatePicker
              size="large"
              onChange={onChange}
              picker="year"
              value={dayjs(String(thisYear), "YYYY")}
            />
          </div>
          <div className="grid grid-cols-5 gap-6 grid-rows-2">
            <div className="flex flex-col justify-between">
              {(() => {
                const total = totalStatusCount?.totalSales || 1;
                const total2 = totalStatusCount2?.totalSales || 1;
                if (total > total2) {
                  const percentage = ((total2 / total) * 100).toFixed(2);
                  return (
                    <div className="p-5 items-center h-[7rem] border-[1px] bg-white rounded-lg shadow-lg flex gap-4">
                      <div className="h-full w-fit flex items-center text-5xl text-green-500">
                        <TrendUp />
                      </div>
                      <div>
                        <p className="text-xl font-bold">
                          {(() => {
                            const totalSales =
                              totalStatusCount?.totalSales || 0;
                            const formattedSales =
                              totalSales > 1000000
                                ? `${(totalSales / 1000000).toFixed(0)}m`
                                : new Intl.NumberFormat().format(totalSales);

                            return formattedSales;
                          })()}
                          {" vnd "}

                          <span className="text-sm text-gray-500">
                            {" (" + percentage + ")%"}
                          </span>
                        </p>
                        <p className="text-gray-500">{t("TotalSales")}</p>
                      </div>
                    </div>
                  );
                }
                if (total < total2) {
                  const percentage = ((total / total2) * 100).toFixed(2);

                  return (
                    <div className="p-5 items-center h-[7rem] border-[1px] bg-white rounded-lg shadow-lg flex gap-4">
                      <div className="h-full w-fit flex items-center text-5xl text-red-500">
                        <TrendDown />
                      </div>
                      <div>
                        <p className="text-xl font-bold">
                          {(() => {
                            const totalSales =
                              totalStatusCount?.totalSales || 0;
                            const formattedSales =
                              totalSales > 100000000
                                ? `${(totalSales / 1000000).toFixed(0)}m`
                                : new Intl.NumberFormat().format(totalSales);

                            return formattedSales;
                          })()}
                          {" vnd "}

                          <span className="text-sm text-gray-500">
                            {" (-" + percentage + ")%"}
                          </span>
                        </p>
                        <p className="text-gray-500">{t("TotalSales")}</p>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="p-5 items-center h-[7rem] border-[1px] bg-white rounded-lg shadow-lg flex gap-4">
                    <div className="h-full w-fit flex items-center text-5xl text-gray-300">
                      <Minus />
                    </div>
                    <div>
                      <p className="text-xl font-bold">
                        {(() => {
                          const totalSales = totalStatusCount?.totalSales || 0;
                          const formattedSales =
                            totalSales > 100000000
                              ? `${(totalSales / 1000000).toFixed(0)}m`
                              : new Intl.NumberFormat().format(totalSales);

                          return formattedSales;
                        })()}
                        {" vnd "}

                        <span className="text-sm text-gray-500">
                          {" "}
                          {" (0%)"}
                        </span>
                      </p>
                      <p className="text-gray-500">{t("TotalSales")}</p>
                    </div>
                  </div>
                );
              })()}
              <div className="p-5 items-center h-[7rem] border-[1px] bg-white rounded-lg shadow-lg flex gap-4">
                <div className="h-full w-fit flex items-center text-5xl text-gray-300">
                  <Bag />
                </div>
                <div>
                  <p className="text-xl font-bold">
                    {allProducts?.totalProductAmount}
                  </p>
                  <p className="text-gray-500">{t("TotalImportedProducts")}</p>
                </div>
              </div>
              <div className="p-5 items-center h-[7rem] border-[1px] bg-white rounded-lg shadow-lg flex gap-4">
                <div className="h-full w-fit flex items-center text-5xl text-gray-300">
                  <Package />
                </div>
                <div>
                  <p className="text-xl font-bold">
                    {allIventories?.totalItemsCount}
                  </p>
                  <p className="text-gray-500">{t("TotalBoughtInventories")}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-lg col-span-2 border-[1px]">
              <h2 className="text-lg font-bold mb-4">
                {t("RevenueSales")}
                {" (vnd)"}
              </h2>
              <Bar data={revenueUpdateData} options={revenueUpdateOptions} />
            </div>
            <div className="grid col-span-2 row-span-2 ">
              <div className="p-4 bg-white rounded-lg shadow-xl border-[1px]  overflow-auto max-h-[74.7vh] h-fit">
                <h2 className="text-lg font-bold mb-4">
                  {t("ImportedProductOverview")}
                </h2>
                <div className="flex flex-col gap-4  ">
                  {allProducts?.products?.map((item) => (
                    <div className="border-[1px] shadow-lg px-4 py-4 rounded-xl">
                      <p className="font-medium text-lg">{item?.productName}</p>
                      <div className="text-sm text-gray-500">
                        <div className="flex gap-4">
                          <p>{t("Stock")}:</p>
                          <p>{item?.stock}</p>
                        </div>
                        <div className="flex gap-4">
                          <p>{t("StoredAt")}:</p>
                          <p>{item?.warehouseName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-lg border-[1px]">
              <h2 className="text-lg font-bold mb-4">{t("OrdersOverview")}</h2>
              <Doughnut
                data={salesOverviewData}
                options={salesOverviewOptions}
              />
            </div>

            <div className="p-4 bg-white rounded-lg shadow-lg col-span-2 border-[1px]">
              <h2 className="text-lg font-bold mb-4">
                {t("YearlySales")}
                {" (vnd)"}
              </h2>
              <Line data={yearlySalesData} options={yearlySalesOptions} />
            </div>
          </div>
        </div>
      ) : (
        <SpinnerLoading />
      )}
    </div>
  );
};

export default OrderDashboard;
