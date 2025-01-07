import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import AxiosPartner from "../../services/Partner";
import axios from "axios";
import Mapping from "../../component/shared/Mapping";
import AxiosOrder from "../../services/Order";
import AxiosWarehouse from "../../services/Warehouse";
import { toast } from "react-toastify";
import AxiosOthers from "../../services/Others";
import Select from "react-select";
import { useLocation } from "react-router-dom";

export default function UpdateOrderPage() {
  const { t } = useTranslation();
  const { userInfor } = useAuth();
  const { getAllProduct } = AxiosPartner();
  const { updateOrder } = AxiosOrder();
  const { getWarehouseById } = AxiosWarehouse();
  const location = useLocation();

  const baseDate = location?.state || {};
  const [inventories, setInventories] = useState();
  const [inventoriesShowList, setInventoriesShowList] = useState();
  const [loading, setLoading] = useState();
  const [warehouseFilter, setWareHouseFilter] = useState();
  const [step, setStep] = useState(1);
  const [distance, setDistance] = useState(null);
  const [item, setItem] = useState({ productId: null, productAmount: null });

  const [deliveryZone, setDeliveryZone] = useState(baseDate?.deliveryZoneId);
  const [recevierDeliveryAddress, setRecevierDeliveryAddress] = useState();

  const [warehouses, setWarehouses] = useState();
  const [warehouse, setWarehouse] = useState();
  const [detailWarehouse, setDetailWarehouse] = useState();
  const debounceTimeoutRef = useRef(null);

  const [defaultLocation, setDefaultLocation] = useState("");

  const baseForm = {
    ocopPartnerId: userInfor?.id,
    receiverPhone: baseDate?.receiverPhone,
    receiverAddress: baseDate?.receiverAddress,
    deliveryZoneId: baseDate?.deliveryZoneId,
    distance: baseDate?.distance,
    products:
      baseDate?.orderDetails?.map((item) => ({
        productId: item?.productId ?? "", 
        productAmount: item?.productAmount ?? 0,
      })) || [], 
  };
  const defaultForm = {
    ocopPartnerId: userInfor?.id,
    receiverPhone: "",
    receiverAddress: "",
    deliveryZoneId: null,
    distance: 0,
    products: [],
  };
  const [form, setForm] = useState(baseForm);
  console.log("form", form);
  useEffect(() => {
    getProductsInWareHouse();
   
  }, []);
  useEffect(() => {
    filterWarehouse();
    getDetailWarehouse();
  }, [warehouse]);

  useEffect(() => {
    console.log("inventories", inventories);

    if (inventories) {
      const warehouseMap = new Map();

      inventories.forEach((item) => {
        if (!warehouseMap.has(item.warehouseId)) {
          warehouseMap.set(item.warehouseId, {
            warehouseId: item.warehouseId,
            warehouseName: item.warehouseName,
            productStock: item.stock || 0,
          });
        } else {
          const currentWarehouse = warehouseMap.get(item.warehouseId);
          warehouseMap.set(item.warehouseId, {
            ...currentWarehouse,
            productStock: currentWarehouse.productStock + (item.stock || 0),
          });
        }
      });

      const uniqueWarehouses = Array.from(warehouseMap.values());
      setWarehouses(uniqueWarehouses);
      setWarehouse(
        uniqueWarehouses?.find(
          (item) => item?.warehouseId === baseDate?.warehouseID
        )
      );
    }
  }, [inventories]);

  const filterWarehouse = () => {
    if (inventories) {
      const result = inventories.filter(
        (a) => parseInt(a.warehouseId) === parseInt(warehouse?.warehouseId)
      );
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
  const getDetailWarehouse = async () => {
    try {
      setLoading(true);
      if (warehouse) {
        const result = await getWarehouseById(warehouse?.warehouseId);
        if (result?.status === 200) {
          setRecevierDeliveryAddress(
            baseDate?.deliveryZoneName + " " + result?.data?.provinceName
          );
          setDetailWarehouse(result?.data);
          return;
        }
      }
      setDetailWarehouse();
      return undefined;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "receiverAdress") {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        setForm((prev) => ({ ...prev, [name]: value }));
      }, 500);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const addItem = () => {
    const checkFoundDataStock = inventories.find(
      (a) => parseInt(a.id) === parseInt(item.productId)
    );

    if (item.productId && item.productAmount > 0) {
      if (checkFoundDataStock?.stock >= item.productAmount) {
        const productFounded = form?.products?.find(
          (pro) => parseInt(pro.productId) === parseInt(item.productId)
        );
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
      const submitForm = {
        ...form,
        deliveryZoneId: parseInt(deliveryZone),
        distance: parseFloat(distance),
      };
      const result = await updateOrder(
        submitForm,
        baseDate?.id,
        warehouse?.warehouseId,
        true
      );
      if (result?.status === 200) {
        setForm();
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  const handeSaveAsDraft = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const submitForm = {
        ...form,
        deliveryZoneId: parseInt(deliveryZone),
        distance: parseFloat(distance),
      };
      const result = await updateOrder(
        submitForm,
        baseDate?.id,
        warehouse?.warehouseId,
        false
      );
      if (result?.status === 200) {
        setForm();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 mx-auto bg-white shadow-lg rounded-lg h-full">
      <div className="flex gap-40 h-full text-lg">
        <form className="space-y-6 w-[40%]">
          <p className="text-2xl font-semibold mb-4">{t("Create Order")}</p>
          <div className="space-y-6 w-full">
            <h2 className="text-lg font-semibold">{t("OrderInformation")}</h2>
            <div>
              <label className="block  font-medium text-gray-700">
                {t("Warehouse")}
              </label>
              <Select
                className="col-span-2"
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    overflowY: "hidden", 
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    padding: 0, 
                    maxHeight: "11.5rem",
                    overflow: "auto",
                  }),
                  control: (baseStyles) => ({
                    ...baseStyles,
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxShadow: "none",
                    "&:hover": {
                      border: "1px solid #888",
                    },
                  }),
                  option: (baseStyles, { isFocused, isSelected }) => ({
                    ...baseStyles,
                    backgroundColor: isSelected
                      ? "var(--Xanh-Base)"
                      : isFocused
                      ? "var(--Xanh-100)"
                      : "white",
                    color: isSelected ? "white !important" : "black",
                    cursor: "pointer",
                    padding: "0.5rem 1rem", 
                    textAlign: "left", 
                  }),
                }}
                value={warehouse} 
                onChange={(selectedOption) => setWarehouse(selectedOption)}
                options={warehouses}
                formatOptionLabel={(selectedOption) => (
                  <div className="flex items-center gap-4">
                    <p>{selectedOption?.warehouseName}</p>
                  </div>
                )}
                getOptionValue={(option) => option.warehouseId}
                getOptionLabel={(option) => option.warehouseName}
              />
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
            <ul className="mt-10 space-y-2 overflow-auto h-fit max-h-[10rem]">
              {form?.products &&
                form?.products?.map((item) => {
                  const product = inventoriesShowList?.find(
                    (pro) => parseInt(pro.id) === parseInt(item.productId)
                  );
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
              value={form?.receiverPhone}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 border-b-2  px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block  font-medium text-gray-700">
              {t("Receiver Address")}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                name="receiverAddress"
                placeholder={t("receiverAddress")}
                value={form?.receiverAddress}
                onChange={handleInputChange}
                className="mt-1 outline-none border-2 p-[0.35rem] flex-grow"
                required
              />

              <div className="w-fit">
                <Select
                  styles={{
                    menu: (provided) => ({
                      ...provided,

                    
                      overflowY: "hidden",
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      padding: 0, 
                      maxHeight: "11.5rem",
                      overflow: "auto",
                    }),
                    control: (baseStyles) => ({
                      ...baseStyles,
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      boxShadow: "none",
                      "&:hover": {
                        border: "1px solid #888",
                      },
                    }),
                    option: (baseStyles, { isFocused, isSelected }) => ({
                      ...baseStyles,
                      backgroundColor: isSelected
                        ? "var(--Xanh-Base)"
                        : isFocused
                        ? "var(--Xanh-100)"
                        : "white",
                      color: isSelected ? "white !important" : "black",
                      cursor: "pointer",
                      padding: "0.5rem 1rem", 
                      textAlign: "left", 
                    }),
                  }}
                  value={detailWarehouse?.deliveryZones.find(
                    (item) => item.id === deliveryZone
                  )} 
                  onChange={(selectedOption) => {
                    setDeliveryZone(selectedOption.id);
                    setRecevierDeliveryAddress(
                      selectedOption?.name + " " + selectedOption?.provinceName
                    );
                  }}
                  options={detailWarehouse?.deliveryZones}
                  formatOptionLabel={(selectedOption) => (
                    <div className="flex items-center gap-4">
                      <p>{selectedOption?.name}</p>
                    </div>
                  )}
                  getOptionValue={(option) => option.id}
                  getOptionLabel={(option) => option.name}
                />
              </div>
              <div className="border p-[0.35rem] w-fit cursor-not-allowed">
                {detailWarehouse?.deliveryZones[0]?.provinceName}
              </div>
            </div>
          </div>

          <div className="flex justify-between space-x-4 mt-6 items-center">
            {distance && (
              <p className="mt-4 text-lg">
                {t("Distance")}: {distance.toFixed(3)} {"km"}
              </p>
            )}
            <div className="flex justify-between w-full gap-8">
              <button
                type="button"
                onClick={() => {
                  setForm(baseForm);
                  setItem({ productId: 0, productAmount: 0 });
                  setWarehouse(0);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow hover:bg-gray-300 transition"
              >
                {t("Reset")}
              </button>
              <div className="flex gap-8">
                <button
                  type="submit"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition"
                  onClick={handeSaveAsDraft}
                >
                  {t("SaveAsDraft")}
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
                  onClick={handleSubmit}
                >
                  {t("CreateOrder")}
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="max-w-[50%] w-[50%] h-[] z-10 max-h-[20%vh]">
          <Mapping
            showLocation={detailWarehouse}
            toLocation={recevierDeliveryAddress}
            defaultLocation={defaultLocation}
            setDistance={setDistance}

          />
        </div>
      </div>
    </div>
  );
}
