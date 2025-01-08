import { useContext, useEffect, useRef, useState } from "react";
import { useDetail } from "../../context/DetailContext";
import { Warning, X, XCircle } from "@phosphor-icons/react";
import { AuthContext, useAuth } from "../../context/AuthContext";
import AxiosProduct from "../../services/Product";
import AxiosLot from "../../services/Lot";
import AxiosRequest from "../../services/Request";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/img/defaultAvatar.jpg";
import defaultImg from "../../assets/img/defaultImg.jpg";
import AxiosOrder from "../../services/Order";
import { add, addMonths, format } from "date-fns";
import AxiosInventory from "../../services/Inventory";

import Select from "react-select";
import AxiosCategory from "../../services/Category";
import { useTranslation } from "react-i18next";

export default function DetailSlide() {
  const { userInfor, setRefrestAuthWallet, authWallet } =
    useContext(AuthContext);
  const { t } = useTranslation();
  const {
    dataDetail,
    typeDetail,
    updateDataDetail,
    updateTypeDetail,
    setRefresh,
    createRequest,
    setCreateRequest,
  } = useDetail();
  const { getProductCategoryBy1000 } = AxiosCategory();
  const { getLotByProductIdX1000 } = AxiosLot();
  const [productCategories, setProductCategories] = useState([]);

  useEffect(() => {
    fetchingBeginData();
  }, []);
  const fetchingBeginData = async () => {
    const productCategoriesResult = await getProductCategoryBy1000();
    if (productCategoriesResult?.status === 200) {
      setProductCategories(productCategoriesResult?.data?.items);
    }
  };

  const detailComponent = useRef();
  const nav = useNavigate();

  const handleCloseDetail = () => {
    updateDataDetail();
    updateTypeDetail("");
  };

  const ProductDetail = () => {
    const [form, setForm] = useState({
      ocopPartnerId: userInfor?.id,
      barcode: dataDetail?.barcode,
      name: dataDetail?.name,
      price: dataDetail?.price,
      weight: dataDetail?.weight,
      unit: dataDetail?.unit,
      isCold: dataDetail?.isCold,
      productCategoryId: dataDetail?.productCategoryId,
      pictureLink: dataDetail?.pictureLink,
      origin: dataDetail?.origin,
    });
    const [inputField, setInputField] = useState();
    const [lotsList, setLotsList] = useState();
    const [errors, setErrors] = useState();
    const { updateProductById } = AxiosProduct();
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
    const unitOptions = [
      { value: "", label: "ChooseUnit" },
      { value: "Liter", label: "Liter" },
      { value: "Milliliter", label: "Milliliter" },
      { value: "Pieces", label: "Pieces" },
      { value: "Box", label: "Box" },
      { value: "Bottle", label: "Bottle" },
      { value: "Package", label: "Package" },
      { value: "Carton", label: "Carton" },
      { value: "Meter", label: "Meter" },
      { value: "Centimeter", label: "Centimeter" },
      { value: "Square Meter", label: "SquareMeter" },
      { value: "Kilometer", label: "Kilometer" },
      { value: "Bag", label: "Bag" },
      { value: "Sheet", label: "Sheet" },
      { value: "Roll", label: "Roll" },
      { value: "Jar", label: "Jar" },
      { value: "Pot", label: "Pot" },
      { value: "Tablet", label: "Tablet" },
      { value: "Can", label: "Can" },
    ];
    useEffect(() => {
      const handleClickOutSide = (event) => {
        if (
          detailComponent.current &&
          !detailComponent.current.contains(event.target) &&
          !createRequest
        ) {
          handleCloseDetail();
        }
      };
      document.addEventListener("mousedown", handleClickOutSide);
      return () => {
        document.removeEventListener("mousedown", handleClickOutSide);
      };
    }, [createRequest]);
    useEffect(() => {
      const fetchingLot = async () => {
        if (dataDetail && typeDetail === "product") {
          const lotResut = await getLotByProductIdX1000(
            userInfor?.id,
            dataDetail?.id,
            false
          );
          setLotsList(lotResut);
        }
      };
      fetchingLot();
    }, [dataDetail, typeDetail]);
    const handleEdit = () => {
      setInputField({
        barcode: true,
        name: true,
        price: true,
        weight: true,
        productCategoryId: true,
        unit: true,
        isCold: true,
        productCategoryId: true,
        pictureLink: true,
        origin: true,
      });
    };
    const handleInput = (e) => {
      const { name, value } = e.target;
      if (name === "price") {
        if (value > 999999999) {
          setForm(() => ({ ...form, [name]: 999999999 }));
          return;
        }
      }
      if (name === "weight") {
        if (value > 999999999) {
          setForm(() => ({ ...form, [name]: 999999999 }));
          return;
        }
      }

      value === ""
        ? setForm(() => ({ ...form, [name]: "" }))
        : setForm(() => ({ ...form, [name]: value }));
    };
    const handeUpdate = () => {
      setShowUpdateConfirm(true);
    };
    const confirmUpdate = async () => {
      try {
        const res = await updateProductById(dataDetail?.id, form);
        if (res.status === 200) {
          setRefresh(dataDetail?.id);
        }
      } catch (e) {
      } finally {
        setShowUpdateConfirm(false);
      }
    };

    return (
      <>
        <div className="w-[455px] h-full bg-white p-6 flex flex-col gap-8 text-black">
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-black">
                {t("ProductDetail")}
              </h2>
              <div
                className="text-3xl cursor-pointer text-gray-500 hover:text-black"
                onClick={handleCloseDetail}
              >
                <X weight="bold" />
              </div>
            </div>
            <div className="w-full h-px bg-gray-300"></div>
          </div>

          <div className="w-full flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-4">
              <img
                src={dataDetail?.pictureLink}
                className="w-32 h-32 object-cover object-center rounded-lg relative border-2 "
              />
            </div>
            <div className="text-center  flex flex-col justify-center items-center">
              {inputField?.name ? (
                <input
                  name="name"
                  value={form?.name}
                  placeholder="Name"
                  onChange={handleInput}
                  className={`input-field text-center text-xl font-medium w-full ${
                    errors?.name ? "input-error" : ""
                  }`}
                />
              ) : (
                <p className="text-xl font-medium">{dataDetail?.name}</p>
              )}
              {inputField?.barcode ? (
                <input
                  name="barcode"
                  value={form?.barcode}
                  placeholder="Barcode"
                  onChange={handleInput}
                  className={`input-field text-center w-full col-span-1 text-gray-600 text-lg${
                    errors?.barcode ? "input-error" : ""
                  }`}
                />
              ) : (
                <p className="text-gray-600 text-lg">{dataDetail?.barcode}</p>
              )}
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <span className="text-black text-lg font-semibold col-span-1">
              {t("Origin")}:
            </span>
            {inputField?.origin ? (
              <input
                name="origin"
                value={form?.origin}
                placeholder="Origin"
                onChange={handleInput}
                className={`input-field text-left w-full col-span-1 font-semibold text-lg${
                  errors?.origin ? "input-error" : ""
                }`}
              />
            ) : (
              <span className="text-gray-700 text-lg col-span-1">
                {dataDetail?.origin}
              </span>
            )}
            <span className="text-black text-lg font-semibold col-span-1">
              {t("Category")}:
            </span>
            {inputField?.productCategoryId ? (
              <Select

                value={
                  productCategories?.find(
                    (op) =>
                      parseInt(op.id) === parseInt(form?.productCategoryId)
                  ) || null
                }
                onChange={(selectedOption) =>
                  handleInput({
                    target: {
                      name: "productCategoryId",
                      value: selectedOption.id,
                    },
                  })
                }
                options={productCategories}
                getOptionValue={(e) => e.id}
                getOptionLabel={(e) => e.typeName} 
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    overflowY: "hidden", 
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    padding: 0,
                    maxHeight: "7.5rem",
                    overflow: "auto",
                  }),
                  control: (baseStyles) => ({
                    ...baseStyles,
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "0.5rem",
                    boxShadow: "none",
                    "&:hover": {
                      border: "1px solid #888",
                    },
                  }),
                  option: (baseStyles, { isFocused, isSelected }) => ({
                    ...baseStyles,
                    backgroundColor: isSelected
                      ? "#0056b3"
                      : isFocused
                      ? "#e7f3ff"
                      : "white",
                    color: isSelected ? "white" : "black",
                    cursor: "pointer",
                    padding: "0.5rem 1rem", 
                    textAlign: "left",
                  }),
                }}
              />
            ) : (
              <span className="text-gray-700 text-lg col-span-1">
                {dataDetail?.productCategoryName}
              </span>
            )}
            <span className="text-black text-lg font-semibold col-span-1">
              {t("CreateDate")}:
            </span>
            <span className="text-gray-700 text-lg col-span-1">
              {format(dataDetail?.createDate, "dd/MM/yyyy")}
            </span>
            <span className="text-black text-lg font-semibold col-span-1">
              {t("Price")}:
            </span>
            {inputField?.price ? (
              <div className="relative">
                <input
                  name="price"
                  type="number"
                  value={form?.price}
                  onChange={handleInput}
                  className={`input-field pr-10 text-left w-full col-span-1 font-semibold text-lg${
                    errors?.price ? "input-error" : ""
                  }`}
                />
                <div className="absolute top-3 right-7">vnd</div>
              </div>
            ) : (
              <span className="text-gray-700 text-lg col-span-1">
                {new Intl.NumberFormat().format(dataDetail?.price)} vnd
              </span>
            )}
            <span className="text-black text-lg font-semibold col-span-1">
              {t("Unit")}:
            </span>
            {inputField?.unit ? (
              <Select
                value={unitOptions.find(
                  (option) => option.value === form?.unit
                )}
                onChange={(selectedOption) =>
                  handleInput({
                    target: {
                      name: "unit",
                      value: selectedOption.value,
                    },
                  })
                }
                name="unit"
                className="react-select-container"
                classNamePrefix="react-select"
                options={unitOptions}
                getOptionLabel={(option) => `${t(option.label)}`}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: "7.5rem",
                    overflow: "auto",
                  }),
                  control: (provided) => ({
                    ...provided,
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    borderColor: "#ccc",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#aaa" },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "#0056b3"
                      : state.isFocused
                      ? "#e6f7ff"
                      : "white",
                    color: state.isSelected ? "white" : "black",
                  }),
                }}
              />
            ) : (
              <span className="text-gray-700 text-lg col-span-1">
                {t(dataDetail?.unit)}
              </span>
            )}
            <span className="text-black text-lg font-semibold col-span-1">
              {t("Frozen")}:
            </span>
            {inputField?.isCold ? (
              <Select
                value={[
                  { value: 0, label: t("NormalProduct") },
                  { value: 1, label: t("FrozenProduct") },
                ].find((option) => option.value === form?.isCold)}
                onChange={(selectedOption) =>
                  handleInput({
                    target: {
                      name: "isCold",
                      value: selectedOption.value,
                    },
                  })
                }
                name="isCold"
                className="react-select-container"
                classNamePrefix="react-select"
                options={[
                  { value: 0, label: t("NormalProduct") },
                  { value: 1, label: t("FrozenProduct") },
                ]}
                getOptionLabel={(option) => `${t(option.label)}`}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: "7.5rem",
                    overflow: "auto",
                  }),
                  control: (provided) => ({
                    ...provided,
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    borderColor: "#ccc", 
                    boxShadow: "none",
                    "&:hover": { borderColor: "#aaa" }, 
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "#0056b3"
                      : state.isFocused
                      ? "#e6f7ff"
                      : "white",
                    color: state.isSelected ? "white" : "black",
                  }),
                }}
              />
            ) : (
              <span className="text-gray-700 text-lg col-span-1">
                {dataDetail?.isCold === 0
                  ? t("NormalProduct")
                  : t("FrozenProduct")}
              </span>
            )}
            <span className="text-black text-lg font-semibold col-span-1">
              {t("Weight")}:
            </span>
            {inputField?.weight ? (
              <div className="relative">
                <input
                  name="weight"
                  value={form?.weight}
                  type="number"
                  onChange={handleInput}
                  className={`input-field text-left col-span-1 w-full font-semibold text-lg${
                    errors?.weight ? "input-error" : ""
                  }`}
                />
                <div className="absolute top-3 right-7">kg</div>
              </div>
            ) : (
              <span className="text-gray-700 text-lg col-span-1">
                {dataDetail?.weight} kg
              </span>
            )}
            <span className="text-black text-lg font-semibold col-span-1">
              {t("TotalLotsImported")}:
            </span>
            <span className="text-gray-700 text-lg col-span-1">
              {lotsList?.data?.totalItemsCount} {t("lot")}
            </span>
          </div>
          <div className="flex justify-between items-center w-full gap-4">
            {inputField ? (
              <>
                <button
                  className="mt-auto hover:bg-red-500 bg-red-300 hover:text-white text-black py-2 px-4 rounded-lg w-full"
                  onClick={() => setInputField()}
                >
                  {t("Cancel")}
                </button>
                <button
                  className="mt-auto hover:bg-green-500 bg-green-300 hover:text-white text-black py-2 px-4 rounded-lg w-full"
                  onClick={handeUpdate}
                >
                  {t("Update")}
                </button>
              </>
            ) : (
              <>
                {!dataDetail?.isInInv && (
                  <button
                    onClick={handleEdit}
                    className="mt-auto hover:bg-gray-400 bg-gray-300 hover:text-white text-black py-2 px-4 rounded-lg w-full"
                  >
                    {t("Edit")}
                  </button>
                )}
                <button
                  onClick={() => setCreateRequest(true)}
                  className="mt-auto hover:bg-green-500 bg-green-300 hover:text-white text-black py-2 px-4 rounded-lg w-full"
                >
                  {t("CreateRequest")}
                </button>
              </>
            )}
          </div>
        </div>

        {showUpdateConfirm && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div
              className="absolute bg-white border border-gray-300 text-black shadow-md rounded-lg p-4 w-[20rem] h-fit"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <p>
                <span className="text-[var(--en-vu-600)]">
                  {t("AreYouSureYouWantToUpdate")}:
                </span>{" "}
                <span className="font-semibold">{dataDetail?.name}</span>?
              </p>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowUpdateConfirm(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={() => confirmUpdate()}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  {t("Update")}
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  const RequestDetail = () => {
    const { getLotById } = AxiosLot();
    const {
      sendRequestById,
      updateRequestStatus,
      deleteRequestById,
      cancelRequest,
    } = AxiosRequest();
    const [lotData, setLotData] = useState();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
    const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(null);
    const [cancelReason, setCancelReason] = useState("");
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

    const [inputField, setInputField] = useState();
    const [errors, setErrors] = useState();

    useEffect(() => {
      const handleClickOutSide = (event) => {
        if (
          detailComponent.current &&
          !detailComponent.current.contains(event.target)
        ) {
          handleCloseDetail();
        }
      };
      document.addEventListener("mousedown", handleClickOutSide);
      return () => {
        document.removeEventListener("mousedown", handleClickOutSide);
      };
    }, []);
    useEffect(() => {
      const fetch = async () => {
        try {
          const data = await getLotById(dataDetail?.lotId);
          setLotData(data?.data);
        } catch (err) {
          return err;
        }
      };
      fetch();
    }, [dataDetail]);
    const handleSendRequest = async () => {
      await sendRequestById(dataDetail?.id);
      setRefresh(dataDetail?.id);
    };

    const handleDeleteClick = (e, request) => {
      e.stopPropagation();
      setShowDeleteConfirmation(request);
    };

    const confirmDelete = async () => {
      try {
        setRefresh(0);
        const res = await deleteRequestById(showDeleteConfirmation?.id);
      } catch (e) {
      } finally {
        setRefresh(-1);
        updateDataDetail();
        updateTypeDetail();
        cancelDelete();
      }
    };
    const cancelDelete = () => {
      setShowDeleteConfirmation(null);
    };

    const handleUpdateStatusClick = (e, request, status) => {
      e.stopPropagation();
      setShowUpdateConfirmation([request, status]);
    };

    const confirmUpdateStatus = async () => {
      try {
        if (showUpdateConfirmation[1] === "Canceled") {
          const res = await cancelRequest(
            showUpdateConfirmation[0]?.id,
            cancelReason
          );
        } else {
          const res = await updateRequestStatus(
            showUpdateConfirmation[0]?.id,
            showUpdateConfirmation[1]
          );
        }
      } catch (e) {
      } finally {
        setCancelReason("");
        setRefresh(showUpdateConfirmation[0]?.id);
        exitUpdateStatus();
      }
    };
    const exitUpdateStatus = () => {
      setShowUpdateConfirmation(null);
    };

    const [form, setForm] = useState({
      ocopPartnerId: userInfor?.id,
      name: dataDetail?.name,
      description: dataDetail?.description,
      exportFromLotId: 0,
      sendToRoomId: dataDetail?.sendToRoomId,
      lot: {
        lotNumber: "string",
        name: "string",
        amount: 0,
        productId: 0,
        productAmount: 0,
      },
    });

    const { updateProductById } = AxiosProduct();
    useEffect(() => {
      const handleClickOutSide = (event) => {
        if (
          detailComponent.current &&
          !detailComponent.current.contains(event.target) &&
          !createRequest
        ) {
          handleCloseDetail();
        }
      };
      document.addEventListener("mousedown", handleClickOutSide);
      return () => {
        document.removeEventListener("mousedown", handleClickOutSide);
      };
    }, [createRequest]);
    const handleEdit = () => {
      dataDetail?.isInInv
        ? setInputField({
            price: true,
            weight: false,
            pictureLink: true,
            barcode: false,
            name: false,
            productCategoryId: false,
            origin: false,
          })
        : setInputField({
            barcode: true,
            name: true,
            price: true,
            weight: true,
            productCategoryId: false,
            pictureLink: true,
            origin: true,
          });
    };
    const handleInput = (e) => {
      const { name, value } = e.target;
      value === ""
        ? setForm(() => ({ ...form, [name]: "" }))
        : setForm(() => ({ ...form, [name]: value }));
    };
    const handeUpdate = () => {
      setShowUpdateConfirm(true);
    };
    const confirmUpdate = async () => {
      try {
        const res = await updateProductById(dataDetail?.id, form);
        if (res.status === 200) {
          setRefresh(dataDetail?.id);
        }
      } catch (e) {
      } finally {
        setShowUpdateConfirm(false);
      }
    };

    return (
      <>
        <div className="w-[600px] h-full bg-white p-6 flex flex-col gap-8 text-black">
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold text-black">
                  Request information
                </h2>
              </div>
              <div
                className="text-3xl cursor-pointer text-gray-500 hover:text-black"
                onClick={handleCloseDetail}
              >
                <X weight="bold" />
              </div>
            </div>
            <div className="w-full h-px bg-gray-300"></div>
          </div>

          <div className="w-full flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32  relative border-2 rounded-lg ">
                <img
                  src={dataDetail?.productImage}
                  className="w-full h-full object-cover object-center border-2 rounded-lg"
                />
                <div
                  className={`absolute rounded-xl px-1 py-1 right-0 top-0 translate-x-5 -translate-y-5 ${
                    dataDetail?.status === "Completed"
                      ? "bg-green-200 text-green-800"
                      : dataDetail?.status === "Shipped"
                      ? "bg-yellow-200 text-yellow-800"
                      : dataDetail?.status === "Pending"
                      ? "bg-blue-200 text-blue-800"
                      : dataDetail?.status === "Draft"
                      ? "bg-gray-200 text-gray-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {dataDetail?.status}
                </div>
              </div>

              <div className="text-center">
                <p className="text-xl font-medium">{dataDetail?.name}</p>
                <p
                  className={`text-gray-600 text-lg ${
                    dataDetail?.requestType === "Import"
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                >
                  {dataDetail?.requestType}
                </p>
              </div>
            </div>

            <div className="w-full flex flex-col gap-4">
              {[
                { label: "Lot Num:", value: dataDetail?.lotId },
                { label: "Product Name:", value: lotData?.lotNumber },
                {
                  label: "Create date:",
                  value: format(
                    add(new Date(dataDetail?.createDate), { hours: 7 }),
                    "HH:mm - dd/MM/yyyy"
                  ),
                },
                { label: "Description:", value: dataDetail?.description },
                { label: "Amount:", value: lotData?.lotAmount + " lots" },
                { label: "Product Per Lot:", value: lotData?.productPerLot },
                {
                  label: "Total Product Amount:",
                  value: lotData?.totalProductAmount,
                },
                {
                  label: "Apporve Date:",
                  value: dataDetail?.apporveDate
                    ? dataDetail?.apporveDate
                    : "Not Yet",
                },
                {
                  label: "Deliver Date:",
                  value: dataDetail?.deliverDate
                    ? format(
                        add(new Date(dataDetail?.deliverDate), { hours: 7 }),
                        "HH:mm - dd/MM/yyyy"
                      )
                    : "Not Yet",
                },

                { label: "To Store:", value: dataDetail?.storeName },
              ]?.map((item, index) => (
                <div key={index} className="grid grid-cols-2 gap-4  text-lg">
                  <div className="text-gray-600">{item.label}</div>
                  <div className="text-black">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center w-full gap-4">
            {dataDetail?.status === "Draft" ? (
              <>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
                  onClick={(e) => handleDeleteClick(e, dataDetail)}
                >
                  Delete
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md w-full"
                  onClick={() => {
                    handleCloseDetail();
                    nav("request/update-request", { state: { ...dataDetail } });
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
                  onClick={handleSendRequest}
                >
                  Send
                </button>
              </>
            ) : dataDetail?.status === "Pending" ? (
              <>
                <button
                  className="bg-gray-500 text-white py-3 rounded-md w-full"
                  onClick={(e) =>
                    handleUpdateStatusClick(e, dataDetail, "Canceled")
                  }
                >
                  Cancel
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {showDeleteConfirmation && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div
              className="absolute bg-white border border-gray-300 shadow-md rounded-2xl p-8 w-[30rem] h-fit text-black"
              style={{
                top: "50%",
                left: "-50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="flex items-center justify-center">
                <div className="text-5xl bg-fit h-fit p-4 bg-[#fff5f6] rounded-full mb-6">
                  <Warning weight="fill" color="#fe3f56" />
                </div>
              </div>
              <p className="w-full text-2xl font-semibold text-center  mb-6">
                Delete Request
              </p>
              <p className="text-center w-full text-wrap  mb-6">{`You are going to delete the "${dataDetail?.name}" request?`}</p>
              <div className="flex justify-between gap-4">
                <button
                  onClick={cancelDelete}
                  className="bg-[#f5f5f7] text-black px-4 py-2 rounded-3xl w-full"
                >
                  {t("No, Keep It.")}
                </button>
                <button
                  onClick={() => confirmDelete(showDeleteConfirmation)}
                  className="bg-[#fe3f56] text-white px-4 py-2 rounded-3xl w-full"
                >
                  {t("Yes, Delete!")}
                </button>
              </div>
            </div>
          </>
        )}
        {showUpdateConfirmation && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div
              className="absolute bg-white border border-gray-300 shadow-md rounded-2xl p-8 w-[30rem] h-fit text-black"
              style={{
                top: "50%",
                left: "-50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="flex items-center justify-center">
                <div className="text-5xl bg-fit h-fit p-4 bg-[#fff5f6] rounded-full mb-6">
                  <Warning weight="fill" color="#fe3f56" />
                </div>
              </div>
              <p className="w-full text-2xl font-semibold text-center  mb-6">
                Cancel Request
              </p>
              <p className="text-center w-full text-wrap  mb-6">{`You are going to delete the "${dataDetail?.name}" request?`}</p>
              <div className="mb-8">
                {showUpdateConfirmation[1] === "Canceled" && (
                  <div className="flex gap-4 items-center">
                    <label>Reason</label>
                    <input
                      className="w-full border-2 rounded-lg px-4 py-2"
                      placeholder="Fill reason why you cancel the request"
                      type="text"
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-between gap-4">
                <button
                  onClick={exitUpdateStatus}
                  className="bg-[#f5f5f7] text-black px-4 py-2 rounded-3xl w-full"
                >
                  {t("No, Keep It.")}
                </button>
                <button
                  onClick={confirmUpdateStatus}
                  className="bg-[#fe3f56] text-white px-4 py-2 rounded-3xl w-full"
                >
                  {t("Yes, Cancel!")}
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  const OrderDetail = () => {
    const { sendOrderById, deleteOrderById, cancelOrderById } = AxiosOrder();
    const [lotData, setLotData] = useState();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(null);

    useEffect(() => {
      const handleClickOutSide = (event) => {
        if (
          detailComponent.current &&
          !detailComponent.current.contains(event.target)
        ) {
          handleCloseDetail();
        }
      };
      document.addEventListener("mousedown", handleClickOutSide);
      return () => {
        document.removeEventListener("mousedown", handleClickOutSide);
      };
    }, []);

    const handleSendRequest = async () => {
      await sendOrderById(dataDetail?.id);
      setRefresh(dataDetail?.id);
      handleCloseDetail();
    };

    const handleDeleteClick = (e, order) => {
      e.stopPropagation();
      setShowDeleteConfirmation(order);
    };

    const confirmDelete = async () => {
      try {
        setRefresh(0);
        const res = await deleteOrderById(showDeleteConfirmation?.id);
      } catch (e) {
      } finally {
        setRefresh(-1);
        updateDataDetail();
        updateTypeDetail();
        cancelDelete();
      }
    };
    const cancelDelete = () => {
      setShowDeleteConfirmation(null);
    };

    const handleCancelClick = (e, order) => {
      e.stopPropagation();
      setShowCancelConfirmation(order);
    };
    const confirmCancel = async () => {
      try {
        setRefresh(0);
        const res = await cancelOrderById(showCancelConfirmation?.id);
      } catch (e) {
      } finally {
        setRefresh(-1);
        updateDataDetail();
        updateTypeDetail();
        cancelDelete();
      }
    };
    const cancelCancel = () => {
      setShowCancelConfirmation(null);
    };
    return (
      <>
        <div className="w-[800px] h-full bg-white p-6 flex flex-col gap-8 text-black max-h-[100vh] overflow-auto">
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold text-black">
                  {t("OrdersInformation")}
                </h2>
              </div>
              <div
                className="text-3xl cursor-pointer text-gray-500 hover:text-black"
                onClick={handleCloseDetail}
              >
                <X weight="bold" />
              </div>
            </div>
            <div className="w-full h-px bg-gray-300"></div>
          </div>

          <div className="w-full flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-4">
              <img
                src={dataDetail?.pictureLink || defaultImg}
                className="w-32 h-32 bg-gray-300 border-2 rounded-lg relative object-cover object-center"
              />
              <div className="text-center">
                <p className="text-xl font-medium">{dataDetail?.orderCode}</p>
                <p
                  className={`text-gray-600 text-lg ${
                    dataDetail?.requestType === "Import"
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                >
                  {dataDetail?.requestType}
                </p>
              </div>
            </div>
            <div className="w-full flex flex-col gap-4">
              {[
                {
                  label: t("ReceiverPhone") + ":",
                  value: dataDetail?.receiverPhone,
                },
                {
                  label: t("ReceiverAddress") + ":",
                  value:
                    dataDetail?.receiverAddress +
                    " " +
                    dataDetail?.deliveryZoneName,
                },
                {
                  label: t("FromWStore") + ":",
                  value: (
                    <div className="flex flex-col items-end">
                      <p>{dataDetail?.storeName}</p>
                      <p className="text-gray-400">
                        {"(" + dataDetail?.storeLocation + ")"}
                      </p>
                    </div>
                  ),
                },
                {
                  label: t("CreateDate") + ":",
                  value: format(
                    add(new Date(dataDetail?.createDate), { hours: 7 }),
                    "HH:mm - dd/MM/yyyy"
                  ),
                },
                {
                  label: "StartDeliveryDate" + ":",
                  value: dataDetail?.deliverStartDate
                    ? format(
                        add(new Date(dataDetail?.deliverStartDate), {
                          hours: 7,
                        }),
                        "HH:mm - dd/MM/yyyy"
                      )
                    : t("NotYet"),
                },
                {
                  label: "CompleteDeliveryDate" + ":",
                  value: dataDetail?.deliverFinishDate
                    ? format(
                        add(new Date(dataDetail?.deliverFinishDate), {
                          hours: 7,
                        }),
                        "HH:mm - dd/MM/yyyy"
                      )
                    : t("NotYet"),
                },
                {
                  label: t("Distance") + ":",
                  value: dataDetail?.distance + " km",
                },
              ]?.map((item, index) => (
                <div key={index} className="flex justify-between ">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-black">{item.value}</span>
                </div>
              ))}
              <div className="flex justify-between ">
                <span className="text-gray-600">{t("Status")}</span>
                <span
                  className={`px-2 py-1 rounded-xl  ${
                    dataDetail?.status === "Delivered"
                      ? "bg-lime-200 text-lime-800"
                      : dataDetail?.status === "Shipped"
                      ? "bg-cyan-200 text-cyan-800"
                      : dataDetail?.status === "Processing"
                      ? "bg-blue-200 text-blue-800"
                      : dataDetail?.status === "Draft"
                      ? "bg-gray-200 text-gray-800"
                      : dataDetail?.status === "Pending"
                      ? "bg-orange-200 text-orange-800"
                      : dataDetail?.status === "Canceled"
                      ? "bg-red-200 text-red-800"
                      : dataDetail?.status === "Returned"
                      ? "bg-purple-200 text-purple-800"
                      : dataDetail?.status === "Refunded"
                      ? "bg-teal-200 text-teal-800"
                      : dataDetail?.status === "Completed"
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {t(dataDetail?.status)}
                </span>
              </div>
              <div className="w-full h-[0.2rem] bg-gray-200" />
              <label className="font-medium text-lg flex justify-between items-center">
                {t("OrderDetail")}
              </label>
              <div className="grid grid-cols-11 items-center gap-4 text-sm">
                <p className="col-span-2">{t("Image")}</p>
                <p className="text-black  col-span-3 text-ellipsis overflow-hidden text-nowrap">
                  {t("ProductName")}
                </p>
                <p className="text-black  col-span-2">
                  {t("Price")} <span className="text-gray-400">(vnd)</span>
                </p>
                <p className="text-black  col-span-1">{t("x")}</p>
                <p className="text-black  col-span-1">{t("Unit")}</p>
                <p className="text-black  col-span-2  text-end">
                  {t("Total")} <span className="text-gray-400">(vnd)</span>
                </p>
              </div>
              {dataDetail?.orderDetails?.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-11 items-center gap-4"
                >
                  <img
                    src={item?.productImage || defaultImg}
                    className="w-16 h-16 border-2 bg-gray-300 rounded-lg relative col-span-2 object-cover object-center"
                  />
                  <span className="text-black  col-span-3 text-ellipsis overflow-hidden text-nowrap">
                    {item.productName}
                  </span>
                  <span className="text-black  col-span-2">
                    {new Intl.NumberFormat().format(item.productPrice)}
                  </span>
                  <span className="text-black  col-span-1">
                    {new Intl.NumberFormat().format(item.productAmount)}
                  </span>
                  <span className="text-black  col-span-1">
                    {t(item?.unit)}
                  </span>
                  <span className="text-black  col-span-2 text-end">
                    {new Intl.NumberFormat().format(
                      item.productPrice * item.productAmount
                    )}
                  </span>
                </div>
              ))}
              <div className="w-full h-[0.2rem] bg-gray-200" />
              <label className="font-medium text-lg flex justify-between items-center">
                {t("TotalFees")}
              </label>
              {[
                {
                  label: t("AdditionalFee") + ":",
                  value: dataDetail?.orderFees?.[0]?.additionalFee || 0,
                },
                {
                  label: t("DeliveryFee") + ":",
                  value: dataDetail?.orderFees?.[0]?.deliveryFee || 0,
                },
                {
                  label: t("StorageFee") + ":",
                  value: dataDetail?.orderFees?.[0]?.storageFee || 0,
                },
                {
                  label: t("Total") + ":",
                  value: dataDetail?.totalPriceAfterFee,
                },
              ]?.map((item, index) => (
                <div key={index} className="flex justify-between ">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-black">
                    {new Intl.NumberFormat().format(item.value)} vnd
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-8 items-center w-full justify-between">
            {dataDetail?.status === "Draft" ? (
              <>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md w-full "
                  onClick={(e) => handleDeleteClick(e, dataDetail)}
                >
                  {t("Delete")}
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md w-full"
                  onClick={() => {
                    handleCloseDetail();
                    nav("order/update-order", {
                      state: { ...dataDetail },
                    });
                  }}
                >
                  {t("Edit")}
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
                  onClick={handleSendRequest}
                >
                  {t("Send")}
                </button>
              </>
            ) : dataDetail?.status === "Pending" ? (
              <>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md w-full"
                  onClick={(e) => handleCancelClick(e, dataDetail)}
                >
                  {t("Cancel")}
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {showDeleteConfirmation && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div
              className="absolute bg-white border border-gray-300 shadow-md rounded-2xl p-8 w-[30rem] h-fit text-black"
              style={{
                top: "50%",
                left: "-10%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="flex items-center justify-center">
                <div className="text-5xl bg-fit h-fit p-4 bg-[#fff5f6] rounded-full mb-6">
                  <Warning weight="fill" color="#fe3f56" />
                </div>
              </div>
              <p className="w-full text-2xl font-semibold text-center  mb-6">
                Delete Order
              </p>
              <p className="text-center w-full text-wrap  mb-6">{`You are going to delete the "${dataDetail?.orderCode}" order?`}</p>
              <div className="flex justify-between gap-4">
                <button
                  onClick={cancelDelete}
                  className="bg-[#f5f5f7] text-black px-4 py-2 rounded-3xl w-full"
                >
                  {t("No, Keep It.")}
                </button>
                <button
                  onClick={() => confirmDelete(showDeleteConfirmation)}
                  className="bg-[#fe3f56] text-white px-4 py-2 rounded-3xl w-full"
                >
                  {t("Yes, Delete!")}
                </button>
              </div>
            </div>
          </>
        )}
        {showCancelConfirmation && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div
              className="absolute bg-white border border-gray-300 shadow-md rounded-2xl p-8 w-[30rem] h-fit text-black"
              style={{
                top: "50%",
                left: "-10%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="flex items-center justify-center">
                <div className="text-5xl bg-fit h-fit p-4 bg-[#fff9f5] rounded-full mb-6">
                  <Warning weight="fill" color="#feca3f" />
                </div>
              </div>
              <p className="w-full text-2xl font-semibold text-center  mb-6">
                Cancel Order
              </p>
              <p className="text-center w-full text-wrap  mb-6">{`You are going to cancel the "${dataDetail?.orderCode}" order?`}</p>
              <div className="flex justify-between gap-4">
                <button
                  onClick={cancelCancel}
                  className="bg-[#f5f5f7] text-black px-4 py-2 rounded-3xl w-full"
                >
                  {t("No, Keep It.")}
                </button>
                <button
                  onClick={() => confirmCancel(showDeleteConfirmation)}
                  className="bg-[#feca3f] text-white px-4 py-2 rounded-3xl w-full"
                >
                  {t("Yes, Cancel!")}
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  const InventoryDetail = () => {
    const { extendInventory } = AxiosInventory();

    const [showExtendConfirmation, setShowExtendConfirmation] = useState(null);
    const [lotsCleanData, setLotsCleanData] = useState();
    const [monthBuyInvrentory, setMonthToBuyInventory] = useState(1);
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCancelExtendInventory = () => {
      setShowExtendConfirmation(false);
      setMonthToBuyInventory(0);
    };
    const handleSetMonthToBuy = (price, data) => {
      const dataPrice = Math.round(parseFloat(price) * parseFloat(data));
      setErrors("");
      if (data < 0 || data === null || data === undefined || data === "") {
        setErrors("YouNeedAtLeast1MonthToBuyRoom.");
        setMonthToBuyInventory("");
        return;
      }
      setMonthToBuyInventory(Math.floor(data));
      if (dataPrice > authWallet?.totalAmount) {
        setErrors("NotEnoughtMoneyToDoThis.");
        return;
      }
    };
    const handleConfirmExtendInventory = async () => {
      try {
        setLoading(true);
        const result = await extendInventory(
          dataDetail?.id,
          userInfor.id,
          monthBuyInvrentory
        );
        if (result?.status == 200) {
          handleCancelExtendInventory();
          setRefrestAuthWallet((prev) => !prev);
          setRefresh(dataDetail?.id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const cleanLotsData = () => {
      if (dataDetail?.lots) {
        const arrayOfProduct = Array.from(
          new Map(
            dataDetail?.lots.map((item) => [
              item.productId,
              {
                productId: item.productId,
                productName: item.productName,
                totalLot: item.amount,
                productAmount: item.productAmount, 
                lots: [], 
              },
            ])
          ).values()
        );
        const cleanLots = arrayOfProduct.map((pro) => {
          const data = dataDetail?.lots.filter(
            (lot) => lot.productId === pro.productId
          );

          return {
            productId: pro.productId,
            productName: pro.productName,
            totalLot: data.reduce((sum, lot) => sum + lot.amount, 0), 
            productAmount: data.reduce(
              (sum, lot) => sum + lot.productAmount,
              0
            ), 
            lots: data.map((lot) => ({
              name: lot.name,
              lotNumber: lot.lotNumber,
              importDate: lot.importDate,
              expirationDate: lot.expirationDate,
              amount: lot.amount,
              productAmount: lot.productAmount,
            })),
          };
        });
        return cleanLots; 
      }
      return [];
    };
    useEffect(() => {
      const handleClickOutSide = (event) => {
        if (
          detailComponent.current &&
          !detailComponent.current.contains(event.target)
        ) {
          handleCloseDetail();
        }
      };
      document.addEventListener("mousedown", handleClickOutSide);
      return () => {
        document.removeEventListener("mousedown", handleClickOutSide);
      };
    }, []);
    return (
      <>
        <div className="w-[32rem] h-full bg-white p-6 flex flex-col gap-8 text-black">
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold text-black">
                  {t("RoomInformation")}
                </h2>
              </div>
              <div
                className="text-3xl cursor-pointer text-gray-500 hover:text-black"
                onClick={handleCloseDetail}
              >
                <X weight="bold" />
              </div>
            </div>
            <div className="w-full h-px bg-gray-300"></div>
          </div>
          <div className="w-full flex flex-col gap-4">
            {[
              {
                label: t("RoomName") + ":",
                value: dataDetail?.name,
              },
              {
                label: t("Store") + ":",
                value: dataDetail?.storeName,
              },
              {
                label: t("Price") + ":",
                value:
                  new Intl.NumberFormat().format(dataDetail?.price) + " vnd",
              },
              {
                label: t("BoughtDate") + ":",
                value: format(dataDetail?.boughtDate || 0, "dd/MM/yyyy"),
              },
              {
                label: t("ExpirationDate") + ":",
                value: format(dataDetail?.expirationDate || 0, "dd/MM/yyyy"),
              },
              {
                label: t("Weight") + ":",
                value:
                  dataDetail?.weight + " / " + dataDetail?.maxWeight + " kg",
              },
            ]?.map((item, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 w-full">
                <div className="text-gray-600 col-span-2">{item.label}</div>
                <div className="text-black col-span-4">{item.value}</div>
              </div>
            ))}
            {cleanLotsData().length > 0 && (
              <>
                <div className="w-full h-[0.2rem] bg-gray-200" />
                <label className="font-medium text-lg flex justify-between items-center">
                  Products Amount
                </label>
                <div className=" items-center grid-cols-9 grid gap-4 text-gray-500 font-medium border-b-2 border-gray-400 pb-2">
                  <span className=" col-span-4">Product</span>
                  <span className=" text-end col-span-2">Total Lots</span>
                  <span className=" text-end col-span-3">Total Products</span>
                </div>
                {cleanLotsData()?.map((item, index) => (
                  <div>
                    <div>
                      <div
                        key={index}
                        className=" items-center grid-cols-9 grid gap-4 text-black font-medium"
                      >
                        <span className=" col-span-4">{item.productName}</span>
                        <span className=" text-end col-span-2">
                          {item.totalLot}
                        </span>
                        <span className=" text-end col-span-3">
                          {item.productAmount}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div></div>
                      {item?.lots.map((lot) => (
                        <div className=" items-center grid  grid-cols-9 gap-4 text-gray-500 ">
                          <span className="col-span-2 text-start overflow-auto text-clip">
                            {lot.name}
                          </span>
                          <span className="text-end">{lot.number}</span>
                          <span className=" col-span-4 text-end">
                            {format(new Date(lot.importDate), "dd/MM")}-
                            {format(new Date(lot.expirationDate), "dd/MM/yy")}
                          </span>

                          <span className=" text-end">{lot.amount}</span>
                          <span className=" text-end">{lot.productAmount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="flex gap-8">
            <button
              className="bg-green-500 px-4 py-2 rounded-lg text-white w-full"
              onClick={() => setShowExtendConfirmation((prev) => !prev)}
            >
              {t("Extend")}
            </button>
            <button
              className="bg-green-500 px-4 py-2 rounded-lg text-white w-full"
              onClick={() => {
                nav("inventory/lots", { state: { ...dataDetail } });
                handleCloseDetail();
              }}
            >
              {t("ShowLots")}
            </button>
          </div>
        </div>
        {showExtendConfirmation && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[20] left-0 right-0"></div>
            <div
              className="absolute bg-white border border-gray-300 shadow-md rounded-lg px-4 py-8 w-[35rem] h-fit z-[30]"
              style={{
                top: "50%",
                left: "-100%",
                transform: "translate(-25%, -50%)",
              }}
            >
              <div
                className="absolute top-2 right-2 text-white text-3xl hover:scale-105 cursor-pointer"
                onClick={handleCancelExtendInventory}
              >
                <XCircle fill="#ef4444" weight="fill" />
              </div>
              <p className="text-2xl">{`${t("ExtendingRoom")}: ${
                dataDetail?.name
              }`}</p>
              <div className="flex items-center justify-between my-7">
                <div
                  className={`flex items-center overflow-auto py-2 px-4 w-fit border border-gray-300 rounded-2xl  mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
                    monthBuyInvrentory > 0
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  }`}
                >
                  <input
                    type="number"
                    className="outline-none w-[5rem]"
                    value={monthBuyInvrentory}
                    step={1}
                    onChange={(e) =>
                      handleSetMonthToBuy(dataDetail?.price, e.target.value)
                    }
                  ></input>

                  <p>{t("Months")}</p>
                </div>
                <button
                  className="bg-gray-300 px-3 py-2 h-fit rounded-lg hover:bg-gray-400"
                  onClick={() => handleSetMonthToBuy(dataDetail?.price, 6)}
                >
                  6 {t("Months")}
                </button>
                <button
                  className="bg-gray-300 px-3 py-2 h-fit rounded-lg hover:bg-gray-400"
                  onClick={() => handleSetMonthToBuy(dataDetail?.price, 12)}
                >
                  1 {t("Year")}
                </button>
                <button
                  className="bg-gray-300 px-3 py-2 h-fit rounded-lg hover:bg-gray-400"
                  onClick={() => handleSetMonthToBuy(dataDetail?.price, 24)}
                >
                  2 {t("Years")}
                </button>
              </div>

              <div className="mb-7 grid-cols-8 grid gap-4">
                <div className="col-span-2 text-gray-500">{t("Name")}</div>
                <div className="col-span-2 text-gray-500">{t("Price")}</div>
                <div className="col-span-1 text-gray-500 text-center">
                  {t("Amount")}
                </div>
                <div className="col-span-1 text-gray-500">{t("Unit")}</div>
                <div className="col-span-2 text-gray-500">{t("Total")}</div>
                <div className="col-span-2">{dataDetail?.name}</div>
                <div className="col-span-2">
                  {new Intl.NumberFormat().format(dataDetail?.price) + "vnd"}
                </div>
                <div className="col-span-1 text-center">
                  {monthBuyInvrentory}
                </div>
                <div className="col-span-1">{t("Month")}</div>
                <div className="col-span-2">
                  {`${new Intl.NumberFormat().format(
                    Math.round(
                      parseFloat(dataDetail?.price) *
                        parseFloat(monthBuyInvrentory)
                    )
                  )} vnd`}
                </div>
                <div className="col-span-8 text-red-500">
                  <div className="">{t(errors)}</div>
                </div>
                <div className="col-span-8 flex gap-x-4">
                  <div className="">{t("ExpectExpirationDate")}:</div>
                  <p>
                    {format(
                      addMonths(
                        new Date(dataDetail?.expirationDate),
                        parseInt(monthBuyInvrentory || 0)
                      ),
                      "dd/MM/yyyy"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => handleCancelExtendInventory()}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-red-500 hover:text-white"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={handleConfirmExtendInventory}
                  disabled={errors?.length > 0 || loading}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  {t("Confirm")}
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  };
  const ProfileDetail = () => {
    const { handleLogout, userInfor } = useContext(AuthContext);

    const nav = useNavigate();
    useEffect(() => {
      const handleClickOutSide = (event) => {
        if (
          detailComponent.current &&
          !detailComponent.current.contains(event.target)
        ) {
          handleCloseDetail();
        }
      };
      document.addEventListener("mousedown", handleClickOutSide);
      return () => {
        document.removeEventListener("mousedown", handleClickOutSide);
      };
    }, []);
    const logout = () => {
      handleLogout();
      nav("/");
      updateTypeDetail();
    };
    const handleEditProfile = () => {
      updateTypeDetail();
      nav("editProfile");
    };

    return (
      <>
        <div className="w-[455px] h-full bg-white p-6 flex flex-col gap-8 text-black ">
          <div className="flex justify-between">
            <div>{t("UserProfile")}</div>
            <div>X</div>
          </div>
          <div className="flex-col items-center flex mt-[1rem]">
            <div className=" w-[8rem] h-[8rem] rounded-lg overflow-auto">
              <img
                src={userInfor?.pictureLink || defaultAvatar}
                className="relative w-full h-full"
                alt="User Avatar"
              ></img>
            </div>
            <div className="font-medium text-xl mt-[1rem] mx-[0.3rem]">
              {userInfor?.firstName + " " + userInfor?.lastName}
            </div>
            <div className="text-[var(--en-vu-600)]">
              {t(userInfor?.roleName)}
            </div>
          </div>
          <div className="flex flex-col w-full pl-[2rem] pr-[1rem]">
            <div className="font-medium mb-[16px] flex justify-between items-center">
              <p>{t("PersonalDetails")}</p>
              <div onClick={handleEditProfile}>X</div>
            </div>
            <div className="grid grid-cols-2 gap-[16px] w-full">
              <div className="text-[var(--en-vu-600)]">{t("PhoneNumber")}</div>
              <div className="text-[var(--en-vu-Base)]">{userInfor?.phone}</div>
              <div className="text-[var(--en-vu-600)]">{t("Email")}</div>
              <div className="text-[var(--en-vu-Base)] w-[11rem] overflow-hidden">
                {userInfor?.email}
              </div>
            </div>
            {userInfor?.roleName === "Partner" && (
              <>
                <div className="w-full border-b-2 my-4"></div>
                <div className="font-medium mb-[16px] flex justify-between items-center">
                  <p>{t("BusinessDetails")}</p>
                  <div onClick={handleEditProfile}>X</div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-[var(--en-vu-600)]">
                    {t("BusinessName")}
                  </div>
                  <div className="text-[var(--en-vu-Base)]">
                    {userInfor?.businessName}
                  </div>
                  <div className="text-[var(--en-vu-600)]">
                    {t("CategoryName")}
                  </div>
                  <div className="text-[var(--en-vu-Base)]">
                    {userInfor?.categoryName}
                  </div>
                  <div className="text-[var(--en-vu-600)]">
                    {t("OcopCategoryName")}
                  </div>
                  <div className="text-[var(--en-vu-Base)]">
                    {userInfor?.ocopCategoryName}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            className="mt-auto bg-red-500 text-white py-2 px-4 rounded-lg"
            onClick={logout}
          >
            {t("Logout")}
          </button>
        </div>
      </>
    );
  };

  const LotDetail = () => {
    const { sendOrderById, deleteOrderById } = AxiosOrder();
    const [lotData, setLotData] = useState();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
    const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(null);
    useEffect(() => {
      const handleClickOutSide = (event) => {
        if (
          detailComponent.current &&
          !detailComponent.current.contains(event.target)
        ) {
          handleCloseDetail();
        }
      };
      document.addEventListener("mousedown", handleClickOutSide);
      return () => {
        document.removeEventListener("mousedown", handleClickOutSide);
      };
    }, []);

    return (
      <>
        <div className="w-[500px] h-full bg-white p-6 flex flex-col gap-8 text-black max-h-[100vh] overflow-auto">
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold text-black">
                  Lots information
                </h2>
              </div>
              <div
                className="text-3xl cursor-pointer text-gray-500 hover:text-black"
                onClick={handleCloseDetail}
              >
                <X weight="bold" />
              </div>
            </div>
            <div className="w-full h-px bg-gray-300"></div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <img
              src={dataDetail?.productPictureLink || defaultImg}
              className="w-32 h-32 bg-gray-300 border-2 rounded-lg relative object-cover object-center"
            />
            <p className="text-xl text-center font-medium">
              {dataDetail?.name}
            </p>
          </div>

          <div className="w-full flex flex-col gap-4">
            {[
              { label: "Lot Num:", value: dataDetail?.lotNumber },
              { label: "Product Name:", value: dataDetail?.productName },
              { label: "Create date:", value: dataDetail?.createDate },
              { label: "Amount:", value: dataDetail?.lotAmount },
              {
                label: "Product amount:",
                value: dataDetail?.totalProductAmount,
              },
              { label: "Import date:", value: dataDetail?.importDate },
              { label: "Expiration date:", value: dataDetail?.expirationDate },
              { label: "Store:", value: dataDetail?.storeName },
            ]?.map((item, index) => (
              <div key={index} className="flex justify-between text-lg">
                <span className="text-gray-600">{item.label}</span>
                <span className="text-black">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };
  return (
    <div className="detail-slider">
      <div ref={detailComponent} className="h-full">
        {typeDetail == "request" && RequestDetail()}
        {typeDetail == "product" && ProductDetail()}
        {typeDetail == "profile" && ProfileDetail()}
        {typeDetail == "order" && OrderDetail()}
        {typeDetail == "inventory" && InventoryDetail()}
        {typeDetail == "lots" && LotDetail()}
      </div>
    </div>
  );
}
