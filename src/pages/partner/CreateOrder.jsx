import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import AxiosPartner from "../../services/Partner";
import axios from "axios";
import AxiosOrder from "../../services/Order";
import AxiosWarehouse from "../../services/Warehouse";
import { toast } from "react-toastify";
import AxiosOthers from "../../services/Others";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import AxiosProduct from "../../services/Product";
import haversine from "haversine-distance";
import MappingOrder from "../../component/shared/MappingOrder";
import SpinnerLoading from "../../component/shared/Loading";

export default function CreateOrderPage() {
  const { t } = useTranslation();
  const { userInfor } = useAuth();
  const { getProductByUserIdProvinceIdProductId } = AxiosPartner();
  const { getProductByUserId } = AxiosProduct();
  const { createOrder } = AxiosOrder();
  const { getWarehouses } = AxiosWarehouse();
  const { getProvincesWithDeliveryZone } = AxiosOthers();
  const [products, setProducts] = useState();
  const [loading, setLoading] = useState();
  const [receiverLocation, setReceiverLoaction] = useState("");
  const [distance, setDistance] = useState(null);
  const [item, setItem] = useState({
    productId: null,
    productAmount: null,
    provinceId: null,
  });
  const [deliveryZone, setDeliveryZone] = useState();
  const [fullWarehouses, setFullWarehouses] = useState();
  const [detailWarehouse, setDetailWarehouse] = useState();
  const debounceTimeoutRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState();
  const [latLon, setLatLon] = useState();
  const [supportedDeliveryZone, setSupportedDeliveryZone] = useState([]);
  const [dataStored, setDataStored] = useState();
  const baseForm = {
    ocopPartnerId: userInfor?.id,
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    deliveryZoneId: "",
    distance: 0,
    products: [],
  };

  const [form, setForm] = useState(baseForm);

  useEffect(() => {
    getProductsInWareHouse();
  }, []);
  const validateForm = () => {
    const newErrors = {};
   
    if (!form.receiverPhone || !/^\d{10,15}$/.test(form.receiverPhone)) {
      newErrors.receiverPhone = t("Invalid phone number");
    }

    if (!form.receiverAddress) {
      newErrors.receiverAddress = t("Receiver Address is required");
    }
    if (!form.receiverName) {
      newErrors.receiverAddress = t("Receiver Address is required");
    }

    if (form.products.length === 0) {
      newErrors.products = t("At least one product must be added");
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
      const maxAmount = dataStored?.reduce(
        (accurate, item) => accurate + (item.productInStorage || 0),
        0
      );
      const productAmmountInForm = form?.products.find(
        (pro) => pro.productId == item.productId
      );
      if (
        maxAmount &&
        maxAmount <
          item?.productAmount + (productAmmountInForm?.productAmount || 0)
      ) {
        newErrors.productAmount = t(`Only ${maxAmount} available in stock`);
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  const getProductsInWareHouse = async () => {
    try {
      setLoading(true);
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
        setProducts(result2?.data?.items);
      }
      const result3 = await getWarehouses("", undefined, undefined, 0, 1000);
      if (result3?.status === 200) {
        setFullWarehouses(result3?.data?.items);
      }
      const result4 = await getProvincesWithDeliveryZone();
      if (result4?.status === 200) {
        setProvinces(result4?.data?.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => {
      const { [name]: removedError, ...restErrors } = prev;
      return restErrors;
    });

    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (name === "receiverAdress") {
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
      setErrors((prev) => {
        const {
          productAmount: removedError,
          products: removcedError,
          ...restErrors
        } = prev;
        return restErrors;
      });
      const itemForm = {
        productId: item?.productId,
        productAmount: item?.productAmount,
        productStore: dataStored,
      };
      const foundProductIt = form?.products.find(
        (item) => item.productId === itemForm.productId
      );
      if (foundProductIt) {
        const productsFiltered = form?.products.filter(
          (item) =>
            parseInt(item.productId) != parseInt(foundProductIt.productId)
        );
        const newAddProduct = {
          productId: foundProductIt.productId,
          productAmount: foundProductIt.productAmount + itemForm.productAmount,
          productStore: itemForm?.productStore,
        };
        setForm((prev) => ({
          ...prev,
          products: [...productsFiltered, newAddProduct],
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          products: [...prev?.products, itemForm],
        }));
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
      if (!validateForm()) {
        return;
      }
      const submitProducts = form.products.map((item) => ({
        ...item,
        productStore: item.productStore.map((item2) => ({
          storeId: item2.id,
          distance: parseFloat(item2.distance || 0),
        })),
      }));
      const { provinceId, ...leftForm } = form;
      const submitForm = {
        ...leftForm,
        distance: parseFloat(distance) || 0,
        products: submitProducts,
      };
      const result = await createOrder(submitForm, true);
      if (result?.status === 200) {
        setForm(baseForm);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const handeSaveAsDraft = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const submitProducts = form.products.map((item) => ({
        ...item,
        productStore: item.productStore.map((item2) => ({
          storeId: item2.id,
          distance: parseFloat(item2.distance || 0),
        })),
      }));
      const { provinceId, ...leftForm } = form;
      const submitForm = {
        ...leftForm,
        distance: parseFloat(distance) || 0,
        products: submitProducts,
      };
      const result = await createOrder(submitForm, false);
      if (result?.status === 200) {
        setForm(baseForm);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const mappingProps = useMemo(() => {
    const updatedWarehouses = fullWarehouses?.map((warehouse) => {
      if (warehouse.location) {
        const locationParts = warehouse.location
          .split(",")
          .map((part) => part.trim());
        const lastPart = locationParts[locationParts.length - 1];
        if (lastPart === warehouse.provinceName) {
          locationParts.pop();
        }
        return {
          ...warehouse,
          location: locationParts.join(", "),
        };
      }
      return warehouse;
    });
    return {
      showLocation: {
        name: "Receiver Address",
        location: receiverLocation,
      },
      defaultLocation: form?.provinceId?.subDivisionName,
      data: updatedWarehouses,
      data2: dataStored,
      setLatLng: setLatLon,
      toLocation: detailWarehouse,
      setDistance: setDistance,
    };
  }, [receiverLocation, dataStored]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const dataList = receiverLocation?.split(",").map((item) => item.trim());
      const provniceFouned = provinces?.find((item) =>
        dataList?.some((dataList) =>
          dataList
            ?.trim()
            ?.toLowerCase()
            ?.includes(item?.subDivisionName?.trim()?.toLowerCase())
        )
      );

      setItem((prev) => ({ ...prev, provinceId: provniceFouned?.id }));
      setForm((prev) => ({ ...prev, provinceId: provniceFouned }));
      setReceiverLoaction(form?.receiverAddress);
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
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [form?.receiverAddress]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        setDataStored();
        if (item.productId && item.provinceId) {
          const result = await getProductByUserIdProvinceIdProductId(
            item?.productId,
            item?.provinceId,
            userInfor?.id
          );
          if (result?.status === 200) {
            setDataStored(result?.data?.data);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [item?.productId, item?.provinceId]);
  return (
    <div className="p-8 mx-auto bg-white shadow-lg rounded-lg h-full">
      {loading ? (
        <SpinnerLoading />
      ) : (
        <div className="flex gap-40 h-full text-lg">
          <form className="space-y-6 w-[40%]">
            <p className="text-2xl font-semibold mb-4">{t("Create Order")}</p>
            <div className="space-y-6 w-full">
              <div>
                <p className="text-xl font-semibold mb-4">
                  {t("Customer Information")}
                </p>
                <div>
                  <label className="block  font-medium text-gray-700">
                    {t("Receiver Name")}
                  </label>
                  <input
                    type="text"
                    name="receiverName"
                    value={form.receiverName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 border-2  px-2 py-1"
                    required
                  />
                  {errors.receiverName && (
                    <p className="text-red-500 text-base font-medium mt-2">
                      {errors.receiverName}
                    </p>
                  )}
                </div>
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
                    placeholder={t("Receiver Address")}
                    value={form.receiverAddress}
                    onChange={handleInputChange}
                    className="mt-1 outline-none border-2 p-[0.35rem] flex-grow "
                    required
                  />
                </div>
                {errors.receiverAddress && (
                  <p className="text-red-500 text-base font-medium mt-2">
                    {errors.receiverAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="block  font-medium text-gray-700">
                  {t("Products")}
                </label>

                <Select
                  className="col-span-5"
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
                      color: isSelected ? "white" : "black",
                      cursor: "pointer",
                      padding: "0.5rem 1rem",
                      textAlign: "left",
                    }),
                  }}
                  value={
                    item.productId
                      ? products?.find(
                          (product) =>
                            parseInt(product.id) === parseInt(item.productId)
                        )
                      : null
                  }
                  onChange={(selectedOption) => {
                    setItem((prev) => ({
                      ...prev,
                      productId: selectedOption.id,
                    }));
                  }}
                  options={products?.map((product) => ({
                    ...product,
                    value: product.id,
                  }))}
                  formatOptionLabel={(option, { context }) =>
                    context === "menu" ? (
                      <div className="gap-4 flex items-center">
                        <img
                          src={option.pictureLink}
                          alt={option.name}
                          className="w-[5rem] h-[5rem] object-cover object-center rounded-lg border-2 border-gray-500"
                        />
                        <div>
                          <p className="text-black">{option?.name}</p>
                          <p className="text-gray-500 text-sm">
                            {(option?.price).toFixed(0) +
                              " vnd/" +
                              option?.unit}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="gap-4 flex items-center">
                        <img
                          src={option.pictureLink}
                          alt={option.name}
                          className="w-[5rem] h-[5rem] object-cover object-center rounded-lg border-2 border-gray-500"
                        />
                        <div>
                          <p className="text-black">{option?.name}</p>
                          <p className="text-gray-500 text-sm">
                            {(option?.price).toFixed(0) +
                              " vnd/" +
                              option?.unit}
                          </p>
                        </div>
                      </div>
                    )
                  }
                  placeholder={t("Select Product")}
                />

                <div className="flex gap-10 items-center">
                  <div className="flex w-fit text-nowrap gap-4">
                    <p>Max amount:</p>
                    <p>
                      {(() => {
                        const totalStorage = dataStored?.reduce(
                          (accurate, item) =>
                            accurate + (item.productInStorage || 0),
                          0
                        );

                        const currentProduct = form?.products.find(
                          (pro) => pro.productId === item.productId
                        );

                        const productUnit = products?.find(
                          (product) =>
                            parseInt(product.id, 10) ===
                            parseInt(item.productId, 10)
                        )?.unit;

                        const currentAmount =
                          currentProduct?.productAmount || 0;

                        return `${totalStorage - currentAmount} ${
                          productUnit || ""
                        }`;
                      })()}
                    </p>
                  </div>
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
                {errors.productAmount && (
                  <p className="text-red-500 text-base font-medium mt-2">
                    {errors.productAmount}
                  </p>
                )}
                {errors.products && (
                  <p className="text-red-500 text-base font-medium mt-2">
                    {errors.products}
                  </p>
                )}
              </div>
              <ul className="mt-10 space-y-2 overflow-auto h-fit max-h-[10rem]">
                {form?.products &&
                  form?.products?.map((item) => {
                    const product = products.find((pro) => {
                      return parseInt(pro.id) === parseInt(item.productId);
                    });
                    const detailProduct = products.find((pro) => {
                      return parseInt(pro.id) === parseInt(item.productId);
                    });
                    return (
                      <>
                        <li
                          key={item.productId}
                          className="flex justify-between items-center border-b pb-2"
                        >
                          <span>{product?.name}</span>
                          <div className="flex gap-6">
                            <p>
                              {item.productAmount} {product.unit}
                            </p>
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
                  }}
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
            <MappingOrder {...mappingProps} />
          </div>
        </div>
      )}
    </div>
  );
}
