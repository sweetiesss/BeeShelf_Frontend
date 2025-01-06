import React, { useEffect, useMemo, useRef, useState } from "react";
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
import AxiosProduct from "../../services/Product";
import haversine from "haversine-distance";

export default function CreateOrderPage() {
  const { t } = useTranslation();
  const { userInfor } = useAuth();
  const { getAllProduct } = AxiosPartner();
  const { getProductByUserId } = AxiosProduct();
  const { createOrder } = AxiosOrder();
  const { getWarehouseById, getWarehouses } = AxiosWarehouse();
  const { getProvincesWithDeliveryZone } = AxiosOthers();

  const [inventories, setInventories] = useState();
  const [products, setProducts] = useState();
  const [inventoriesShowList, setInventoriesShowList] = useState();
  const [loading, setLoading] = useState();
  const [warehouseFilter, setWareHouseFilter] = useState();

  const [receiverLocation, setReceiverLoaction] = useState("");
  const [distance, setDistance] = useState(null); // State for storing calculated distance
  const [item, setItem] = useState({ productId: null, productAmount: null });

  const [deliveryZone, setDeliveryZone] = useState();

  const [fullWarehouses, setFullWarehouses] = useState();
  const [warehouses, setWarehouses] = useState();
  const [warehouse, setWarehouse] = useState();
  const [detailWarehouse, setDetailWarehouse] = useState();
  const debounceTimeoutRef = useRef(null);
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState();
  const [latLon, setLatLon] = useState();
  const [supportedDeliveryZone, setSupportedDeliveryZone] = useState([]);

  const [defaultLocation, setDefaultLocation] = useState("");

  const baseForm = {
    ocopPartnerId: userInfor?.id,
    receiverPhone: "",
    receiverAddress: "",
    deliveryZoneId: "",
    distance: 0,
    products: [],
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

  useEffect(() => {
    getProductsInWareHouse();
  }, []);

  useEffect(() => {
    filterWarehouse();
    getDetailWarehouse();
  }, [warehouse]);

  useEffect(() => {
    console.log("inventories", inventories);
  }, [inventories]);
  const validateForm = () => {
    const newErrors = {};

    if (!warehouse) {
      newErrors.warehouse = t("Store is required");
    }

    if (!deliveryZone) {
      newErrors.deliveryZone = t("Delivery Zone is required");
    }

    if (!form.receiverPhone || !/^\d{10,15}$/.test(form.receiverPhone)) {
      newErrors.receiverPhone = t("Invalid phone number");
    }

    if (!form.receiverAddress) {
      newErrors.receiverAddress = t("Receiver Address is required");
    }

    if (form.products.length === 0) {
      newErrors.products = t("At least one product must be added");
    }
    if (!distance) {
      newErrors.distance = t("Delivery Zone is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateProduct = () => {
    const newErrors = {};

    if (!item.productId) {
      newErrors.productId = t("Select a product");
    }

    if (!item.productAmount || item.productAmount <= 0) {
      newErrors.productAmount = t("Invalid product amount");
    } else {
      const product = inventoriesShowList.find((p) => p.id === item.productId);
      if (product && product.stock < item.productAmount) {
        newErrors.productAmount = t(`Only ${product.stock} available in stock`);
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const filterWarehouse = () => {
    if (inventories) {
      const result = inventories.filter(
        (a) => parseInt(a.storeId) === parseInt(warehouse?.storeId)
      );

      setInventoriesShowList(result);
    }
  };

  const getProductsInWareHouse = async () => {
    try {
      setLoading(true);
      const result = await getAllProduct(userInfor?.id);
      console.log("All product", result);

      if (result?.status === 200) {
        setInventories(result?.data?.products);
      }

      const result2 = await getProductByUserId(
        userInfor?.id,
        0,
        1000,
        "",
        undefined,
        undefined,
        undefined,
        undefined
      );
      if (result2?.status === 200) {
        console.log("result2", result2);

        setProducts(result2?.data?.items);
      }
      const result3 = await getWarehouses("", undefined, undefined, 0, 1000);
      console.log("result3", result3);
      if (result3?.status === 200) {
        setFullWarehouses(result3?.data?.items);
      }
      const result4 = await getProvincesWithDeliveryZone();
      if (result4?.status === 200) {
        setProvinces(result4?.data?.items);
      }
      if (result?.status === 200 && result3?.status === 200) {
        const warehouseMap = new Map();
        result?.data?.products?.forEach((item) => {
          if (!warehouseMap.has(item.storeId)) {
            warehouseMap.set(item.storeId, {
              storeId: item.storeId,
              storeName: item.storeName,
              productStock: item.stock || 0,
              // isDisabled : true,
            });
          } else {
            const currentWarehouse = warehouseMap.get(item.storeId);
            warehouseMap.set(item.storeId, {
              ...currentWarehouse,
              productStock: currentWarehouse.productStock + (item.stock || 0),
            });
          }
        });

        const uniqueWarehouses = Array.from(warehouseMap.values());

        const mergedData = result3?.data?.items.map((store) => {
          const matchingWarehouse = uniqueWarehouses.find(
            (warehouse) => warehouse.storeId === store.id
          );

          if (matchingWarehouse) {
            return {
              ...store,
              ...matchingWarehouse, // Merge unique warehouse properties
              isDisabled: false, // Set isDisabled to false if matched
            };
          } else {
            return {
              ...store,
              isDisabled: true, // Set isDisabled to true if not matched
            };
          }
        });

        setWarehouses(mergedData);
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
        const result = await getWarehouseById(warehouse?.storeId);
        if (result?.status === 200) {
          console.log("detail", result);
          console.log("from the warehouse", warehouse);
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
  console.log("full", fullWarehouses);

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

  const handleItemAdd = () => {
    if (validateProduct()) {
      setForm((prev) => ({
        ...prev,
        products: [...prev.products, item],
      }));
      setItem({ productId: null, productAmount: null });
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
      if (!validateForm()) {
        return;
      }
      console.log("Order Created:", form);
      const submitForm = {
        ...form,
        deliveryZoneId: parseInt(deliveryZone?.id),
        distance: parseFloat(distance),
      };
      const result = await createOrder(submitForm, warehouse?.storeId, true);
      console.log(submitForm);
      setForm(baseForm);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const handeSaveAsDraft = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      if (!validateForm()) {
        return;
      }
      console.log("Order Created:", form);
      const submitForm = {
        ...form,
        deliveryZoneId: parseInt(deliveryZone?.id),
        distance: parseFloat(distance),
      };
      const result = await createOrder(submitForm, warehouse?.storeId, false);
      console.log(result);
      setForm(baseForm);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const mappingProps = useMemo(() => {
    return {
      showLocation: {
        name: "Receiver Address",
        location: receiverLocation,
      },
      defaultLocation: form?.provinceId?.subDivisionName,
      data: fullWarehouses,
      setLatLng: setLatLon,
      toLocation: detailWarehouse,
      setDistance: setDistance,
    };
  }, [receiverLocation, fullWarehouses, detailWarehouse]);
 
  useEffect(() => {
    const handler = setTimeout(() => {
      setReceiverLoaction(form?.receiverAddress);
      const dataList = form?.receiverAddress
        ?.split(",")
        .map((item) => item.trim());
      const provniceFouned = provinces?.find((item) =>
        dataList?.some((dataList) => dataList?.includes(item?.subDivisionName))
      );
      if (provniceFouned) {
        const findDeliveryZone = provniceFouned?.deliveryZones?.find((item) =>
          dataList?.some((dataList) => dataList?.includes(item?.name))
        );
        if (findDeliveryZone)
          setForm((prev) => ({
            ...prev,
            deliveryZoneId: findDeliveryZone?.id,
          }));
        else setSupportedDeliveryZone(provniceFouned);
        console.log("findDeliveryZone", findDeliveryZone);
      }
      console.log("provinceF", provniceFouned);

      setForm((prev) => ({ ...prev, provinceId: provniceFouned }));
    }, 500); // Adjust the debounce delay (300ms in this example)

    return () => clearTimeout(handler); // Cleanup timeout on unmount or location change
  }, [form?.receiverAddress]);

  console.log("detailWarehouse", detailWarehouse);
  console.log("warehouses", warehouses);
  console.log("warehouse", warehouse);
  console.log("form", form);

  console.log("receiverLocation", receiverLocation);

  const findNearestLocation = (userCoords) => {
    let nearestStore = null;
    let shortestDistance = Infinity;

    fullWarehouses?.forEach((store) => {
      if (store?.latitude && store?.longitude) {
        const storeCoords = {
          latitude: store?.latitude,
          longitude: store?.longitude,
        };
        const distance = haversine(userCoords, storeCoords); // Distance in meters
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestStore = store;
        }
      }
    });

    return { nearestStore, distance: shortestDistance };
  };

  const nearestStore = useMemo(() => {
    if (latLon) {
      const result = findNearestLocation(latLon);
      if (result) {
        const addField = warehouses?.map((item) => {
          if (item?.id === result?.nearestStore?.id) {
            return {
              ...item,
              distance: result?.distance,
              type: "Nearest",
            };
          }
          return item;
        });
        console.log("addField", addField);
        setWarehouses(addField);
      }

      return result;
    }
    return null;
  }, [latLon]);

  console.log("nearestStore", nearestStore);

  return (
    <div className="p-8 mx-auto bg-white shadow-lg rounded-lg h-full">
      <div className="flex gap-40 h-full text-lg">
        <form className="space-y-6 w-[40%]">
          <p className="text-2xl font-semibold mb-4">{t("Create Order")}</p>
          <div className="space-y-6 w-full">
            <div>
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
                  className="mt-1 block w-full border-gray-300 border-2  px-2 py-1"
                  required
                />
                {errors.receiverPhone && (
                  <p className="text-red-500 text-base font-medium mt-2">
                    {errors.receiverPhone}
                  </p>
                )}
              </div>
              <label className="block  font-medium text-gray-700">
                {t("Receiver Address")}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  name="receiverAddress"
                  placeholder={t("receiverAddress")}
                  value={form.receiverAddress}
                  onChange={handleInputChange}
                  className="mt-1 outline-none border-2 p-[0.35rem] flex-grow "
                  required
                />

                {/* <div className="w-fit">
                  <Select
                    styles={{
                      menu: (provided) => ({
                        ...provided,

                        // Restrict the dropdown height
                        overflowY: "hidden", // Enable scrolling for content
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        padding: 0, // Ensure no extra padding
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
                        padding: "0.5rem 1rem", // Option padding
                        textAlign: "left", // Center-align text
                      }),
                    }}
                    value={deliveryZone} // Map string to object
                    onChange={(selectedOption) =>
                      setDeliveryZone(selectedOption)
                    }
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
                </div> */}
              </div>
              {errors.receiverAddress && (
                <p className="text-red-500 text-base font-medium mt-2">
                  {errors.receiverAddress}
                </p>
              )}
            </div>
            <div>
              <label className="block  font-medium text-gray-700 ">
                {t("Store")}
              </label>
              <Select
                className="col-span-2"
                styles={{
                  menu: (provided) => ({
                    ...provided,

                    overflowY: "hidden", // Enable scrolling for content
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    padding: 0, // Ensure no extra padding
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
                  option: (
                    baseStyles,
                    { isFocused, isSelected, isDisabled }
                  ) => ({
                    ...baseStyles,
                    backgroundColor: isSelected
                      ? "var(--Xanh-Base)"
                      : isFocused
                      ? "var(--Xanh-100)"
                      : "white",
                    color: isSelected
                      ? "white !important"
                      : isDisabled
                      ? "#d1d5db"
                      : "black",
                    cursor: "pointer",
                    padding: "0.5rem 1rem", // Option padding
                    textAlign: "left", // Center-align text
                  }),
                }}
                value={warehouse ? warehouse : null} // Map string to object
                onChange={(selectedOption) => setWarehouse(selectedOption)}
                options={warehouses}
                formatOptionLabel={(selectedOption) => (
                  <div className="flex items-center gap-4 justify-between">
                    <p>{selectedOption?.name}</p>
                    <p>
                      {selectedOption?.type &&
                        selectedOption?.type +
                          " (" +
                          selectedOption?.distance?.toFixed(2) +
                          " km)"}
                    </p>
                  </div>
                )}
                getOptionValue={(option) => option.id}
                getOptionLabel={(option) => option.name}
              />
              {errors.warehouse && (
                <p className="text-red-500 text-base font-medium mt-2">
                  {errors.warehouse}
                </p>
              )}
            </div>
            <div>
              <label className="block  font-medium text-gray-700">
                {t("Products")}
              </label>
              <div className="grid grid-cols-8 gap-4 items-center">
                <Select
                  className="col-span-5"
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      overflowY: "hidden", // Enable scrolling for content
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      padding: 0, // Ensure no extra padding
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
                      color: isSelected ? "white" : "black",
                      cursor: "pointer",
                      padding: "0.5rem 1rem", // Option padding
                      textAlign: "left", // Center-align text
                    }),
                  }}
                  value={
                    item.productId
                      ? inventoriesShowList?.find(
                          (product) =>
                            parseInt(product.id) === parseInt(item.productId)
                        )
                      : null
                  } // Map string to object
                  onChange={(selectedOption) => {
                    setItem((prev) => ({
                      ...prev,
                      productId: selectedOption.id,
                    }));
                  }}
                  options={inventoriesShowList?.map((product) => ({
                    ...product,
                    value: product.id,
                  }))} // Map options with stock info
                  formatOptionLabel={(option, { context }) =>
                    context === "menu" ? (
                      <div className="gap-4">
                        <p>{option.productName}</p>
                        <p className="text-gray-500">
                          {option.stock + " stocks in " + option?.storeName}
                        </p>
                      </div>
                    ) : (
                      <div className="gap-4">
                        <p>
                          {option.productName}
                          <span className="text-gray-500 text-sm">
                            {" (" + option.stock + " stocks available)"}
                          </span>
                        </p>
                      </div>
                    )
                  }
                  placeholder={t("Select Product")}
                />

                <input
                  type="number"
                  name="productAmount"
                  placeholder={t("productAmount")}
                  value={item.productAmount || 0}
                  onChange={handleItemChange}
                  className="col-span-2 mt-1 block w-full border-[1px] border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500  px-2 py-1"
                  required
                />
                <button
                  type="button"
                  onClick={handleItemAdd}
                  className="bg-[var(--Xanh-Base)] text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition"
                >
                  {t("+")}
                </button>
              </div>
              {errors.products && (
                <p className="text-red-500 text-base font-medium mt-2">
                  {errors.products}
                </p>
              )}
            </div>
            <ul className="mt-10 space-y-2 overflow-auto h-fit max-h-[10rem]">
              {form?.products &&
                form?.products?.map((item) => {
                  console.log(item);
                  const product = inventoriesShowList.find((pro) => {
                    console.log("pro", pro);
                    return parseInt(pro.id) === parseInt(item.productId);
                  });
                  const detailProduct = products.find((pro) => {
                    console.log("pro2", pro);
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
                        <div className="flex gap-6">
                          <span>
                            {new Intl.NumberFormat().format(
                              detailProduct?.price * item.productAmount
                            )}{" "}
                            vnd
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            {t("Remove")}
                          </button>
                        </div>
                      </li>
                    </>
                  );
                })}
            </ul>
          </div>

          <div className="flex justify-between space-x-4 mt-6 items-center">
            <div className="flex justify-between w-full gap-8">
              <button
                type="button"
                onClick={() => {
                  setForm(baseForm);
                  setItem({ productId: 0, productAmount: 0 });
                  setWarehouse(0);
                }} // Reset form
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow hover:bg-gray-300 transition"
              >
                {t("Reset")}
              </button>
              <div className="flex gap-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition"
                  onClick={handeSaveAsDraft}
                >
                  {t("SaveAsDraft")}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[var(--Xanh-Base)] text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition"
                  onClick={handleSubmit}
                >
                  {t("CreateOrder")}
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="max-w-[50%] w-[50%]  z-10 max-h-[20%]">
          <Mapping
            // toLocation={deliveryZone?.name + " " + deliveryZone?.provinceName}

            // setLatLng={() => {}}
            {...mappingProps}
          />
          {/* <Mapping
              showLocation="123 Main St, New York, NY"
  startLocation="456 Elm St, Boston, MA"
            height="90%"
          /> */}
          {/* <Mapping showLocation="Xã Phước Tỉnh, Huyện Long Điền, Tỉnh Bà Rịa Vũng Tàu" /> */}
        </div>
      </div>
    </div>
  );
}
