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
import {
  BaseballHelmet,
  MicrosoftTeamsLogo,
  Minus,
  Package,
  ShirtFolded,
  TrendDown,
  TrendUp,
  Truck,
  Warehouse,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import SpinnerLoading from "../../shared/Loading";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import AxiosEmployee from "../../../services/Employee";

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

const WarehouseDashboard = () => {
  // Dummy data for sales overview
  const [orders, setOrders] = useState();
  const [ordersPrevious, setOrdersPrevious] = useState();
  const { userInfor } = useAuth();
  const { getWarehouseDashboardData } = AxiosEmployee();
  const [revenueUpdate, setRevenueUpdate] = useState();
  const [revenueUpdate2, setRevenueUpdate2] = useState();
  const [totalStatusCount, setTotalStatusCount] = useState();
  const [totalStatusCount2, setTotalStatusCount2] = useState();
  const [loading, setLoading] = useState(false);
  const [thisYear, setThisYear] = useState(new Date().getFullYear());
  const { t } = useTranslation();
  const salesOverviewData = {
    labels: [t("Bought"), t("Notbought")],
    datasets: [
      {
        label: "InventoriesOverview",
        data: [
          totalStatusCount?.totalBoughtInventory,
          totalStatusCount?.totalUnboughtInventory,
        ],
        backgroundColor: ["#0db977", "#d6f3e8"],
        hoverOffset: 10,
      },
    ],
  };
  useEffect(() => {
    const fetchBeginData = async () => {
      try {
        setLoading(true);
        const result = await getWarehouseDashboardData(thisYear);
        const result2 = await getWarehouseDashboardData(thisYear - 1);
        if (result?.status === 200 && result2?.status === 200) {
          const getData = result?.data;
          const getData2 = result2?.data;
          setOrders(getData);
          setOrdersPrevious(getData2);

          const YearlyRevenue = getData?.data?.map((warehouse) => ({
            warehouseName: warehouse.name,
            totalRevenue: warehouse.totalRevenue || 0,
          }));
          setRevenueUpdate(YearlyRevenue);
          const YearlyRevenue2 = getData2?.data?.map((warehouse) => ({
            warehouseName: warehouse.name,
            totalRevenue: warehouse.totalRevenue || 0,
          }));
          setRevenueUpdate2(YearlyRevenue2);
          setTotalStatusCount(calculateOrderStatuses(getData));
          setTotalStatusCount2(calculateOrderStatuses(getData2));
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchBeginData();
  }, [thisYear]);

  console.log(orders);
  console.log(ordersPrevious);
  console.log("revenueUpdate", revenueUpdate);
  console.log("revenueUpdate2", revenueUpdate2);

  const salesOverviewOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw.toLocaleString()}`,
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
    let totalBoughtInventory = 0;
    let totalUnboughtInventory = 0;
    console.log("here", data);

    // Loop through each warehouse
    data?.data?.forEach((warehouse) => {
      totalBoughtInventory += warehouse.totalBoughtInventory || 0;
      totalUnboughtInventory += warehouse.totalUnboughtInventory || 0;
    });

    const result = {
      totalBoughtInventory,
      totalUnboughtInventory,
    };

    return result;
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
    labels: revenueUpdate
      ? revenueUpdate.map((item) => item?.warehouseName)
      : [],
    datasets: [
      {
        label: thisYear + " " + t("Sales"),

        data: revenueUpdate
          ? revenueUpdate.map((item) => item?.totalRevenue)
          : [],
        borderColor: "#0a9a63",
        backgroundColor: "#0db977",
        fill: true,
        tension: 0.4,
      },
      {
        label: thisYear - 1 + " " + t("Sales"),
        data: revenueUpdate2
          ? revenueUpdate2.map((item) => item?.totalRevenue)
          : [],

        borderColor: "#F5659C",
        backgroundColor: "#F24688",
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
          <div className="grid grid-cols-6 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg border-[1px] shadow-lg flex gap-4">
              <div className="h-full w-fit flex items-center text-5xl text-gray-300">
                <Warehouse weight="duotone" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {orders?.totalWarehouse}
                  <span className="text-sm text-gray-500">
                    {" "}
                    {"(" + t("warehouses") + ")"}
                  </span>
                </p>
                <p className="text-gray-500">{t("TotalWarehouses")}</p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border-[1px] shadow-lg flex gap-4">
              <div className="h-full w-fit flex items-center text-5xl text-gray-300">
                <Package weight="duotone" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {orders?.totalInventory}
                  <span className="text-sm text-gray-500">
                    {" "}
                    {"(" + t("inventories") + ")"}
                  </span>
                </p>
                <p className="text-gray-500">{t("TotalInventories")}</p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border-[1px] shadow-lg flex gap-4">
              <div className="h-full w-fit flex items-center text-5xl text-gray-300">
                <MicrosoftTeamsLogo weight="duotone" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {orders?.totalEmployee}
                  <span className="text-sm text-gray-500">
                    {" "}
                    {"(" + t("employees") + ")"}
                  </span>
                </p>
                <p className="text-gray-500">{t("TotalEmployees")}</p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border-[1px] shadow-lg flex gap-4">
              <div className="h-full w-fit flex items-center text-5xl text-gray-300">
                <ShirtFolded weight="duotone" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {orders?.totalStaff}
                  <span className="text-sm text-gray-500">
                    {" "}
                    {"(" + t("staffs") + ")"}
                  </span>
                </p>
                <p className="text-gray-500">{t("TotalStaffs")}</p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border-[1px] shadow-lg flex gap-4">
              <div className="h-full w-fit flex items-center text-5xl text-gray-300">
                <BaseballHelmet weight="duotone" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {orders?.totalShipper}
                  <span className="text-sm text-gray-500">
                    {" "}
                    {"(" + t("shippers") + ")"}
                  </span>
                </p>
                <p className="text-gray-500">{t("TotalShippers")}</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border-[1px] shadow-lg flex gap-4">
              <div className="h-full w-fit flex items-center text-5xl text-gray-300">
                <Truck weight="duotone" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {orders?.totalVehicle}
                  <span className="text-sm text-gray-500">
                    {" "}
                    {"(" + t("vehicles") + ")"}
                  </span>
                </p>
                <p className="text-gray-500">{t("TotalVehicles")}</p>
              </div>
            </div>
          </div>

          {/* Bottom Row for Charts */}
          <div className="grid grid-cols-4 gap-6">
            {/* Sales Overview */}
            <div className="p-4 bg-white rounded-lg shadow-xl border-[1px] col-span-1 ">
              <h2 className="text-lg font-bold mb-4">
                {t("InventoriesOverview")}
              </h2>
              <Doughnut
                data={salesOverviewData}
                options={salesOverviewOptions}
              />
            </div>

            {/* Revenue Updates */}
            {/* <div className="p-4 bg-white rounded-lg shadow-xl border-[1px]">
              <h2 className="text-lg font-bold mb-4">
                {t("RevenueSales")}
                {" (vnd)"}
              </h2>
              <Bar data={revenueUpdateData} options={revenueUpdateOptions} />
            </div> */}

            {/* Yearly Sales */}
            <div className="p-4 bg-white rounded-lg shadow-xl border-[1px] col-span-2 ">
              <h2 className="text-lg font-bold mb-4">
                {t("YearlySales")}
                {" (vnd)"}
              </h2>
              <Line data={yearlySalesData} options={yearlySalesOptions} />
            </div>
            <div className="p-4 bg-white rounded-lg shadow-xl border-[1px] col-span-1  overflow-auto max-h-[50vh]">
              <h2 className="text-lg font-bold mb-4">
                {t("WarehousesOverview")}
              </h2>
              <div className="flex flex-col gap-4">
                {orders?.data?.map((item) => (
                  <div className="border-[1px] shadow-lg px-4 py-4 rounded-xl">
                    <p>{item?.name}</p>
                    <div className="text-sm">
                      <div className="flex gap-4">
                        <p>{t("Revenue")}:</p>
                        <p>
                          {(() => {
                            console.log("check item", item?.totalRevenue);

                            const totalSales = item?.totalRevenue || 0;
                            const formattedSales =
                              totalSales > 1000000
                                ? `${(totalSales / 1000000).toFixed(0)}m`
                                : new Intl.NumberFormat().format(totalSales);

                            return formattedSales;
                          })()}{" "}
                          vnd
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <p>{t("Inventories")}:</p>
                        <p>
                          {item?.totalBoughtInventory+" "+t("bought")+" / "} 
                          {item?.totalUnboughtInventory+" "+t("notbought")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SpinnerLoading />
      )}
    </div>
  );
};

export default WarehouseDashboard;
