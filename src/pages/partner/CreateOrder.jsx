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
const cloneWarehouseData = {
  id: 1,
  name: "Ha Noi Main Warehouse",
  capacity: 500000,
  provinceId: 23,
  provinceName: "Hà Nội",
  location: "178A Đ. Bưởi, Hà Nội",
  coordinates: { lat: 21.028511, lon: 105.804817 }, // Example coordinates
  deliveryZones: [
    { id: 1, name: "Ba Đình", coordinates: { lat: 21.03333, lon: 105.8145 } },
    { id: 2, name: "Cầu Giấy", coordinates: { lat: 21.02858, lon: 105.7886 } },
    // Add more delivery zones as needed
  ],
};

export default function CreateOrderPage() {
  const { t } = useTranslation();
  const { userInfor } = useAuth();
  const { getAllProduct } = AxiosPartner();
  const { createOrder } = AxiosOrder();
  const { getWarehouseById } = AxiosWarehouse();
  const { getAddressProvincesStressWard } = AxiosOthers();

  const [inventories, setInventories] = useState();
  const [inventoriesShowList, setInventoriesShowList] = useState();
  const [loading, setLoading] = useState();
  const [warehouseFilter, setWareHouseFilter] = useState();
  const [step, setStep] = useState(1);
  const [distance, setDistance] = useState(null); // State for storing calculated distance
  const [item, setItem] = useState({ productId: null, productAmount: null });

  const [provinceList, setProvinencesList] = useState();
  const [province, setProvinences] = useState(0);
  const [strictList, setStrictList] = useState();
  const [strict, setStrict] = useState(0);
  const [wardList, setWardList] = useState();
  const [ward, setWard] = useState(0);
  const [location, setLocation] = useState();

  const [deliveryZone, setDeliveryZone] = useState();

  const [warehouses, setWarehouses] = useState();
  const [warehouse, setWarehouse] = useState();
  const [detailWarehouse, setDetailWarehouse] = useState();
  const debounceTimeoutRef = useRef(null);
  const [validLocation, setValidLocation] = useState("");
  const [defaultLocation, setDefaultLocation] = useState("");

  const [startLocation, setStartLocation] = useState();

  const baseForm = {
    ocopPartnerId: userInfor?.id,
    receiverPhone: "",
    receiverAddress: "",
    deliveryZoneId: "",
    // receiverWard: "",
    // receiverStrict: "",
    // receiverProvince: "",
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

  // useEffect(() => {
  //   const validateAndFormatLocation = async () => {
  //     const {
  //       receiverAddress,
  //       receiverWard,
  //       receiverStrict,
  //       receiverProvince,
  //     } = form;
  //     if (
  //       receiverProvince.length > 0 &&
  //       receiverStrict.length > 0 &&
  //       receiverWard.length > 0
  //     ) {
  //       setValidLocation(
  //         `${
  //           receiverAddress && receiverAddress + ", "
  //         } ${receiverWard}, ${receiverStrict}, ${receiverProvince}`
  //       );

  //       setDefaultLocation(
  //         `${receiverWard}, ${receiverStrict}, ${receiverProvince}`
  //       );
  //     } else setValidLocation();
  //   };

  //   validateAndFormatLocation();
  // }, [
  //   form.receiverAddress,
  //   form.receiverWard,
  //   form.receiverStrict,
  //   form.receiverProvince,
  // ]);

  useEffect(() => {
    getProductsInWareHouse();
    // getProvinces();
  }, []);

  // useEffect(() => {
  //   getDistricts();
  // }, [province]);
  // useEffect(() => {
  //   getWard();
  // }, [strict]);

  // const getProvinces = async () => {
  //   const result = await getAddressProvincesStressWard(1, 0);
  //   setProvinencesList(result?.data?.data);
  //   console.log(result);
  // };
  // const getDistricts = async () => {
  //   setForm((prev) => ({ ...prev, receiverStrict: "" }));
  //   setForm((prev) => ({ ...prev, receiverWard: "" }));

  //   if (province !== 0 && province) {
  //     const result = await getAddressProvincesStressWard(2, province);
  //     setStrictList(result?.data?.data);
  //     console.log("district", result);
  //   }
  // };
  // const getWard = async () => {
  //   setForm((prev) => ({ ...prev, receiverWard: "" }));

  //   if (strict !== 0 && strict) {
  //     const result = await getAddressProvincesStressWard(3, strict);
  //     setWardList(result?.data?.data);
  //     console.log("ward", result);
  //   }
  // };

  useEffect(() => {
    if (form.receiverAddress) {
      calculateDistance();
    }
  }, [form.receiverAddress, warehouse]);

  useEffect(() => {
    filterWarehouse();
    getDetailWarehouse();
  }, [warehouse]);

  console.log("t", process.env.REACT_APP_MAP_API_KEY);

  useEffect(() => {
    console.log("inventories", inventories);

    if (inventories) {
      const warehouseMap = new Map();

      inventories.forEach((item) => {
        if (!warehouseMap.has(item.warehouseId)) {
          warehouseMap.set(item.warehouseId, {
            warehouseId: item.warehouseId,
            warehouseName: item.warehouseName,
            productStock: item.stock || 0, // Use initial stock value or 0 if undefined
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
    }
  }, [inventories]);

  const filterWarehouse = () => {
    if (inventories) {
      console.log("here0", inventories);
      console.log("here1/2", warehouse);
      console.log("here2", warehouses);

      const result = inventories.filter(
        (a) => parseInt(a.warehouseId) === parseInt(warehouse?.warehouseId)
      );
      console.log("here", result);

      setInventoriesShowList(result);
    }
  };

  const getProductsInWareHouse = async () => {
    try {
      setLoading(true);
      const result = await getAllProduct(userInfor?.id, warehouseFilter);
      console.log("All product", result);

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

  const calculateDistance = async () => {
    setStartLocation();
    const API_KEY = process.env.REACT_APP_MAP_API_KEY;

    const warehouseAddress = warehouse?.location; // Replace with your actual warehouse address
    const receiverAddress = form.receiverAddress;
    console.log("addres", warehouseAddress);

    setStartLocation(warehouse?.location);

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
      // const result = await createOrder(form, warehouse?.warehouseId);
      // console.log(result);
      setForm(baseForm);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  console.log("inventories", inventories);

  return (
    <div className="p-8 mx-auto bg-white shadow-lg rounded-lg h-full">
      <div className="flex gap-40 h-full text-lg">
        <form onSubmit={handleSubmit} className="space-y-6 w-[40%]">
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
                value={warehouse} // Map string to object
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
              className="mt-1 block w-full border-gray-300 border-b-2  px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block  font-medium text-gray-700">
              {t("Receiver Address")}
            </label>

            {/* <div className="flex justify-between mt-4 items-center">
              <div>
                <select
                  className="border-b-2 border-[var(--en-vu-500-disable)]"
                  value={province}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      receiverProvince: "",
                      receiverStrict: "",
                      receiverWard: "",
                    }));
                    setProvinences(e.target.value);
                    const provinceName = provinceList.find(
                      (item) => item?.id == e.target.value
                    );
                    setForm((prev) => ({
                      ...prev,
                      receiverProvince: provinceName?.full_name,
                    }));
                  }}
                >
                  <option value={0}>Select Province</option>
                  {provinceList?.map((pro) => (
                    <option value={pro?.id}>{pro?.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  className="border-b-2 border-[var(--en-vu-500-disable)]"
                  value={strict}
                  onChange={(e) => {
                    setStrict(e.target.value);
                    const stirctName = strictList.find(
                      (item) => item?.id == e.target.value
                    );
                    setForm((prev) => ({
                      ...prev,
                      receiverStrict: stirctName?.full_name,
                    }));
                  }}
                >
                  <option value={0}>Select Districts</option>
                  {strictList?.map((pro) => (
                    <option value={pro?.id}>{pro?.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  className="border-b-2 border-[var(--en-vu-500-disable)]"
                  value={ward}
                  onChange={(e) => {
                    setWard(e.target.value);
                    const wardName = wardList.find(
                      (item) => item?.id == e.target.value
                    );
                    setForm((prev) => ({
                      ...prev,
                      receiverWard: wardName?.full_name,
                    }));
                  }}
                >
                  <option value={0}>Select Ward</option>
                  {wardList?.map((pro) => (
                    <option value={pro?.id}>{pro?.full_name}</option>
                  ))}
                </select>
              </div>
            </div> */}
            <div className="flex items-center gap-4">
              <input
                type="text"
                name="receiverAddress"
                placeholder={t("receiverAddress")}
                value={form.receiverAddress}
                onChange={handleInputChange}
                className="mt-1 outline-none border-2 p-[0.35rem] flex-grow"
                required
              />

              <div className="w-fit">
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
                  onChange={(selectedOption) => setDeliveryZone(selectedOption)}
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

          <div className="flex justify-end space-x-4 mt-6">
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
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
            >
              {t("CreateOrder")}
            </button>
          </div>
        </form>
        <div className="max-w-[50%] w-[50%] h-[] z-10 max-h-[20%vh]">
          <Mapping
            showLocation={warehouse?.location}
            toLocation={validLocation}
            defaultLocation={defaultLocation}

            // cloneWarehouseData={cloneWarehouseData}
          />
          {/* <Mapping
              showLocation="123 Main St, New York, NY"
  startLocation="456 Elm St, Boston, MA"
            height="90%"
          /> */}
          {/* <Mapping showLocation="Xã Phước Tỉnh, Huyện Long Điền, Tỉnh Bà Rịa Vũng Tàu" /> */}

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
