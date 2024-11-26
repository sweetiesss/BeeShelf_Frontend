import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import AxiosPartner from "../../services/Partner";
import axios from "axios";
import Mapping from "../../component/shared/Mapping";
import AxiosOrder from "../../services/Order";
import AxiosWarehouse from "../../services/Warehouse";
import { toast } from "react-toastify";

export default function CreateOrderPage() {
  const { t } = useTranslation();
  const { userInfor } = useAuth();
  const { getAllProduct } = AxiosPartner();
  const { createOrder } = AxiosOrder();
  const { getWarehouseById } = AxiosWarehouse();

  const [inventories, setInventories] = useState();
  const [inventoriesShowList, setInventoriesShowList] = useState();
  const [loading, setLoading] = useState();
  const [warehouseFilter, setWareHouseFilter] = useState();
  const [step, setStep] = useState(1);
  const [distance, setDistance] = useState(null); // State for storing calculated distance
  const [item, setItem] = useState({ productId: null, productAmount: null });

  const [warehouses, setWarehouses] = useState();
  const [warehouse, setWarehouse] = useState();

  const baseForm = {
    ocopPartnerId: userInfor?.id,
    receiverPhone: "",
    receiverAddress: "",
    distance: null,
    products: [],
  };
  const [form, setForm] = useState(baseForm);

  useEffect(() => {
    getProductsInWareHouse();
  }, []);

  useEffect(() => {
    if (form.receiverAddress) {
      calculateDistance();
    }
  }, [form.receiverAddress, warehouse]);

  useEffect(() => {
    filterWarehouse();
  }, [warehouse]);

  useEffect(() => {
    if (inventories) {
      const uniqueWarehouses = Array.from(
        new Map(
          inventories.map((item) => [
            item.warehouseId,
            {
              warehouseId: item.warehouseId,
              warehouseName: item.warehouseName,
            },
          ])
        ).values()
      );
      setWarehouses(uniqueWarehouses);
    }
  }, [inventories]);

  const filterWarehouse = () => {
    if (inventories) {
      console.log("here0", inventories);
      console.log("here1/2", warehouse);
      console.log("here2", warehouses);

      const result = inventories.filter(
        (a) => parseInt(a.warehouseId) === parseInt(warehouse)
      );
      console.log("here", result);

      setInventoriesShowList(result);
    }
  };

  const getProductsInWareHouse = async () => {
    try {
      setLoading(true);
      const result = await getAllProduct(userInfor?.id, warehouseFilter);
      if (result?.status === 200) {
        setInventories(result?.data?.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const getWarehouses = async () => {
    try {
      setLoading(true);
      const result = await getWarehouseById(warehouse);
      if (result?.status === 200) {
        return result;
      }
      return undefined;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = async () => {
    const API_KEY = process.env.REACT_APP_MAP_API_KEY;
    const dataLocation = await getWarehouses(warehouse);
    const warehouseAddress = dataLocation?.data?.location; // Replace with your actual warehouse address
    const receiverAddress = form.receiverAddress;

    try {
      const response = await axios.get(
        `https://www.mapquestapi.com/directions/v2/route?key=${API_KEY}&from=${encodeURIComponent(
          warehouseAddress
        )}&to=${encodeURIComponent(receiverAddress)}`
      );

      const distanceInMiles = response.data.route.distance; // Distance in miles
      const distanceInKilometers = (distanceInMiles * 1.6125).toFixed(2); // Convert to kilometers
      setDistance(distanceInKilometers);
      setForm((prev) => ({ ...prev, distance: distanceInKilometers })); // Update the form
    } catch (error) {
      console.error("Error calculating distance:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const addItem = () => {
    console.log("item", item);
    console.log("invnt", inventories);
    const checkFoundDataStock = inventories.find(
      (a) => parseInt(a.id) === parseInt(item.productId)
    );
    console.log("checkFoundDataStock", checkFoundDataStock);

    if (item.productId && item.productAmount > 0) {
      if (checkFoundDataStock?.stock >= item.productAmount) {
        const productFounded = form?.products?.find(
          (pro) => parseInt(pro.productId) === parseInt(item.productId)
        );
        console.log("founded", productFounded);
        if (productFounded) {
          const newProducts = form?.products?.filter(
            (pro) => parseInt(pro.productId) !== parseInt(item.productId)
          );
          const newPro = {
            productId: productFounded.productId,
            productAmount: productFounded.productAmount + item.productAmount,
          };
          setForm((prev) => ({
            ...prev,
            products: [...newProducts, newPro],
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            products: [...prev.products, item],
          }));
        }
        setItem({ productId: 0, productAmount: 0 });
      } else {
        toast.warning("Stock in warehouse is not enough");
      }
    }
  };

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.filter(
        (pro) => parseInt(pro.productId) !== parseInt(index)
      ),
    }));
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      console.log("Order Created:", form);
      const result = await createOrder(form, warehouse);
      console.log(result);
      setForm(baseForm);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 mx-auto bg-white shadow-lg rounded-lg h-full">
      <div className="flex gap-40 h-full text-lg">
        <form onSubmit={handleSubmit} className="space-y-6 w-[40%]">
          <p className="text-2xl font-semibold mb-4">{t("Create Order")}</p>
          <p className="text-xl font-semibold mb-4">
            {t("CustomerInformation")}
          </p>
          <div>
            <label className="block  font-medium text-gray-700">
              {t("Receiver Phone")}
            </label>
            <input
              type="text"
              name="receiverPhone"
              value={form.receiverPhone}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 border-b-2 focus:ring-blue-500 focus:border-blue-500 px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block  font-medium text-gray-700">
              {t("Receiver Address")}
            </label>
            <input
              type="text"
              name="receiverAddress"
              value={form.receiverAddress}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 border-b-2 focus:ring-blue-500 focus:border-blue-500  px-2 py-1"
              required
            />
          </div>
          <div className="space-y-6 w-full">
            <h2 className="text-lg font-semibold">{t("OrderInformation")}</h2>
            <div>
              <label className="block  font-medium text-gray-700">
                {t("Warehouse")}
              </label>
              <select
                className="text-black border border-gray-300 p-2 rounded-md w-full"
                onChange={(e) => {
                  setWarehouse(e.target.value);
                }}
                value={warehouse}
              >
                <option key={0} value={0}>
                  Select Warehouse
                </option>
                {warehouses?.map((item) => (
                  <option key={item?.warehouseId} value={item?.warehouseId}>
                    {item?.warehouseName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block  font-medium text-gray-700">
                {t("Products")}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <select
                  className="text-black border border-gray-300 p-2 rounded-md"
                  onChange={handleItemChange}
                  name="productId"
                  value={item.productId}
                >
                  <option key={0} value={0}>
                    Select products
                  </option>
                  {inventoriesShowList?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.productName}/{item.stock}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="productAmount"
                  placeholder={t("productAmount")}
                  value={item.productAmount}
                  onChange={handleItemChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500  px-2 py-1"
                  required
                />
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
                >
                  {t("Add Item")}
                </button>
              </div>
            </div>
            <ul className="mt-10 space-y-2 overflow-auto h-[10rem]">
              {form?.products &&
                form?.products?.map((item) => {
                  console.log(item);
                  const product = inventoriesShowList.find((pro) => {
                    console.log("pro", pro);
                    return parseInt(pro.id) === parseInt(item.productId);
                  });
                  return (
                    <>
                      <li
                        key={item.productId}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <span>
                          {product?.productName} - {item.productAmount}/
                          {product?.stock} stock
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          {t("Remove")}
                        </button>
                      </li>
                    </>
                  );
                })}
            </ul>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setForm(baseForm);setItem({productId:0,productAmount:0});setWarehouse(0)
              }} // Reset form
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow hover:bg-gray-300 transition"
            >
              {t("Reset")}
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
            >
              {t("CreateOrder")}
            </button>
          </div>
        </form>
        <div className="max-w-[50%] w-[50%] h-[] z-10 max-h-[20%vh]">
          <Mapping showLocation={form.receiverAddress} height="90%" />

          {distance && (
            <p className="mt-4 text-lg">
              {t("Distance")}: {distance} {t("km")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
