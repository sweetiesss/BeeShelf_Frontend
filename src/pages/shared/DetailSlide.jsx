import { useContext, useEffect, useRef, useState } from "react";
import { useDetail } from "../../context/DetailContext";
import { X } from "@phosphor-icons/react";
import { AuthContext, useAuth } from "../../context/AuthContext";
import AxiosProduct from "../../services/Product";
import AxiosLot from "../../services/Lot";
import AxiosRequest from "../../services/Request";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/img/defaultAvatar.jpg";
import AxiosOrder from "../../services/Order";

export default function DetailSlide() {
  const { userInfor } = useContext(AuthContext);
  const {
    dataDetail,
    typeDetail,
    updateDataDetail,
    updateTypeDetail,
    setRefresh,
    createRequest,
    setCreateRequest,
  } = useDetail();

  const detailComponent = useRef();

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
      productCategoryId: dataDetail?.productCategoryId,
      pictureLink: dataDetail?.pictureLink,
      origin: dataDetail?.origin,
    });
    const [inputField, setInputField] = useState();
    const [errors, setErrors] = useState();
    const { updateProductById } = AxiosProduct();
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
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
        console.log(res);
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
          {/* Header */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-black">
                Product Details
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
              <div className="w-32 h-32 bg-gray-300 rounded-lg relative">
                {dataDetail?.isInInv && (
                  <div className="absolute right-0 top-0 bg-green-500 text-white px-1 py-1 rounded-2xl translate-x-4 -translate-y-4">
                    Inv
                  </div>
                )}
              </div>
              <div className="text-center ">
                {inputField?.name ? (
                  <input
                    name="name"
                    value={form?.name}
                    placeholder="Name"
                    onChange={handleInput}
                    className={`input-field text-center ${
                      errors?.name ? "input-error" : ""
                    }`}
                  />
                ) : (
                  <p className="text-xl font-medium">{dataDetail?.name}</p>
                )}
                <p className="text-gray-600 text-lg">{dataDetail?.barcode}</p>
              </div>
            </div>

            {/* Product Info Table */}
            <div className="w-full flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-lg">
                  OCOP Partner Email:
                </span>
                <span className="text-black text-lg font-semibold">
                  {dataDetail?.ocopPartnerEmail}
                </span>
              </div>
              <div className="flex justify-between items-center gap-8 h-[3rem]">
                <span className="text-gray-600 text-lg">Origin:</span>
                {inputField?.origin ? (
                  <input
                    name="origin"
                    value={form?.origin}
                    placeholder="Origin"
                    onChange={handleInput}
                    className={`input-field text-left w-full font-semibold text-lg${
                      errors?.origin ? "input-error" : ""
                    }`}
                  />
                ) : (
                  <span className="text-black text-lg font-semibold">
                    {dataDetail?.origin}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center gap-8 h-[3rem]">
                <span className="text-gray-600 text-lg">
                  Product Category Name:
                </span>
                <span className="text-black text-lg font-semibold">
                  {dataDetail?.productCategoryName}
                </span>
              </div>
              <div className="flex justify-between items-center gap-8 h-[3rem]">
                <span className="text-gray-600 text-lg">Create Date:</span>
                <span className="text-black text-lg font-semibold">
                  {dataDetail?.createDate}
                </span>
              </div>
              <div className="flex justify-between items-center gap-8 h-[3rem]">
                <span className="text-gray-600 text-lg">Price:</span>
                {inputField?.price ? (
                  <input
                    name="price"
                    type="number"
                    value={form?.price}
                    onChange={handleInput}
                    className={`input-field text-left w-full font-semibold text-lg${
                      errors?.price ? "input-error" : ""
                    }`}
                  />
                ) : (
                  <span className="text-black text-lg font-semibold">
                    {dataDetail?.price}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center gap-8 h-[3rem]">
                <span className="text-gray-600 text-lg">Weight:</span>
                {inputField?.weight ? (
                  <input
                    name="weight"
                    value={form?.weight}
                    type="number"
                    onChange={handleInput}
                    className={`input-field text-left w-full font-semibold text-lg${
                      errors?.weight ? "input-error" : ""
                    }`}
                  />
                ) : (
                  <span className="text-black text-lg font-semibold">
                    {dataDetail?.weight}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center w-full px-20">
              {inputField ? (
                <>
                  <button onClick={() => setInputField()}>Cancel</button>
                  <button onClick={handeUpdate}>Update</button>
                </>
              ) : (
                <>
                  <button onClick={handleEdit}>Edit</button>
                  <button onClick={() => setCreateRequest(true)}>
                    Create Request
                  </button>
                </>
              )}
            </div>
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
              <p><span className="text-[var(--en-vu-600)]">Are you sure you want to update:</span> <span className="font-semibold">{dataDetail?.name}</span>?</p>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowUpdateConfirm(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmUpdate()}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Update
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
    const { sendRequestById, updateRequestStatus, deleteRequestById } =
      AxiosRequest();
    const [lotData, setLotData] = useState();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
    const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(null);
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
        console.log(res);
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
        const res = await updateRequestStatus(
          showUpdateConfirmation[0]?.id,
          showUpdateConfirmation[1]
        );
        console.log(res);
      } catch (e) {
      } finally {
        setRefresh(showUpdateConfirmation[0]?.id);
        cancelDelete();
      }
    };
    const exitUpdateStatus = () => {
      setShowUpdateConfirmation(null);
    };

    const [form, setForm] = useState({
      ocopPartnerId: userInfor?.id,
      name: dataDetail?.name,
      description: dataDetail?.description,
      sendToInventoryId: dataDetail?.sendToInventoryId,
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
        console.log(res);
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
          {/* Header */}
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
              <div className="w-32 h-32 bg-gray-300 rounded-lg relative">
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

            {/* Product Info Table */}
            <div className="w-full flex flex-col gap-4">
              {[
                { label: "Lot Num:", value: dataDetail?.lotId },
                { label: "Product Name:", value: lotData?.lotNumber },
                { label: "Create date:", value: dataDetail?.createDate },
                { label: "Description:", value: dataDetail?.description },
                { label: "Amount:", value: lotData?.amount },
                // { label: "Product ID:", value: "#ID394812" },
                { label: "Product amount:", value: lotData?.productAmount },
                { label: "Import date:", value: "notYet" },
                { label: "Export date:", value: "NotYet" },
                { label: "Expiration date:", value: "NotYet" },
                { label: "To Warehouse:", value: dataDetail?.warehouseName },
              ].map((item, index) => (
                <div key={index} className="flex justify-between text-lg">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-black">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center w-full px-20">
            {dataDetail?.status === "Draft" ? (
              <>
                <button onClick={(e) => handleDeleteClick(e, dataDetail)}>
                  Delete
                </button>
                <button>Edit</button>
                <button onClick={handleSendRequest}>Send</button>
              </>
            ) : dataDetail?.status === "Pending" ? (
              <>
                <button onClick={(e) => handleDeleteClick(e, dataDetail)}>
                  Delete
                </button>
                <button
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
              className="absolute bg-white border border-gray-300 shadow-md rounded-lg p-4 w-fit h-fit text-black"
              style={{
                top: "50%",
                left: "-100%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <p>{`Are you sure you want to delete ${dataDetail?.name}?`}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => confirmDelete(showDeleteConfirmation)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
        {showUpdateConfirmation && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div
              className="absolute bg-white border border-gray-300 shadow-md rounded-lg p-4 w-fit h-fit text-black"
              style={{
                top: "50%",
                left: "-100%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <p>{`Are you sure you want to ${
                showUpdateConfirmation[1] === "Canceled" ? "cancel:" : ""
              } ${dataDetail?.name}?`}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={confirmUpdateStatus}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={exitUpdateStatus}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md"
                >
                  Exist
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  const OrderDetail = () => {
    const { sendOrderById, deleteOrderById } = AxiosOrder();
    const [lotData, setLotData] = useState();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
    const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(null);

    console.log("dataDetail", dataDetail);

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
    };

    const handleDeleteClick = (e, request) => {
      e.stopPropagation();
      setShowDeleteConfirmation(request);
    };

    const confirmDelete = async () => {
      try {
        setRefresh(0);
        const res = await deleteOrderById(showDeleteConfirmation?.id);
        console.log(res);
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

    // const handleUpdateStatusClick = (e, request, status) => {
    //   e.stopPropagation();
    //   setShowUpdateConfirmation([request, status]);
    // };

    // const confirmUpdateStatus = async () => {
    //   try {
    //     const res = await updateRequestStatus(
    //       showUpdateConfirmation[0]?.id,
    //       showUpdateConfirmation[1]
    //     );
    //     console.log(res);
    //   } catch (e) {
    //   } finally {
    //     setRefresh(showUpdateConfirmation[0]?.id);
    //     cancelDelete();
    //   }
    // };
    // const exitUpdateStatus = () => {
    //   setShowUpdateConfirmation(null);
    // };

    return (
      <>
        <div className="w-[455px] h-full bg-white p-6 flex flex-col gap-8 text-black">
          {/* Header */}
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
              <div className="w-32 h-32 bg-gray-300 rounded-lg relative">
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

            {/* Product Info Table */}
            <div className="w-full flex flex-col gap-4">
              {[
                {
                  label: "Receiver Address:",
                  value: dataDetail?.receiverAddress,
                },
                { label: "Receiver Phone:", value: dataDetail?.receiverPhone },
                { label: "Create date:", value: dataDetail?.createDate },
                { label: "Description:", value: dataDetail?.description },
              ].map((item, index) => (
                <div key={index} className="flex justify-between ">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-black">{item.value}</span>
                </div>
              ))}
              <div className="w-full h-[0.2rem] bg-gray-200" />
              <label className="font-medium text-lg flex justify-between items-center">
                Order Details
              </label>
              {dataDetail?.orderDetails.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg relative"></div>
                  <span className="text-gray-600">{item.productName}</span>
                  <span className="text-black">
                    {item.productPrice}$*{item.productAmount}
                  </span>
                  <span className="text-black">
                    {item.productPrice * item.productAmount}
                  </span>
                </div>
              ))}
              <label className="font-medium text-lg flex justify-between items-center">
                Order Fees
              </label>
              {[
                {
                  label: "Additional Fee:",
                  value: dataDetail?.orderFees?.[0]?.additionalFee || 0,
                },
                {
                  label: "Delivery Fee:",
                  value: dataDetail?.orderFees?.[0]?.deliveryFee || 0,
                },
                {
                  label: "Storage Fee:",
                  value: dataDetail?.orderFees?.[0]?.storageFee || 0,
                },
                { label: "Total Price:", value: dataDetail?.totalPrice },
              ].map((item, index) => (
                <div key={index} className="flex justify-between ">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-black">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center w-full px-20">
            {dataDetail?.status === "Draft" ? (
              <>
                <button onClick={(e) => handleDeleteClick(e, dataDetail)}>
                  Delete
                </button>
                <button>Edit</button>
                <button onClick={handleSendRequest}>Send</button>
              </>
            ) : dataDetail?.status === "Pending" ? (
              <>
                <button onClick={(e) => handleDeleteClick(e, dataDetail)}>
                  Delete
                </button>
                <button
                // onClick={(e) =>handleUpdateStatusClick(e, dataDetail, "Canceled")}
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
              className="absolute bg-white border border-gray-300 shadow-md rounded-lg p-4 w-fit h-fit text-black"
              style={{
                top: "50%",
                left: "-100%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <p>{`Are you sure you want to delete order ${dataDetail?.id} ?`}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => confirmDelete(showDeleteConfirmation)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {/*
        {showUpdateConfirmation && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div
              className="absolute bg-white border border-gray-300 shadow-md rounded-lg p-4 w-fit h-fit text-black"
              style={{
                top: "50%",
                left: "-100%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <p>{`Are you sure you want to ${
                showUpdateConfirmation[1] === "Canceled" ? "cancel:" : ""
              } ${dataDetail?.name}?`}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={confirmUpdateStatus}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={exitUpdateStatus}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md"
                >
                  Exist
                </button>
              </div>
            </div>
          </>
        )} */}
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
            <div>User Profile</div>
            <div>X</div>
          </div>
          <div className="flex-col items-center flex mt-[1rem]">
            <div className="bg-gray-200 w-[8rem] h-[8rem] rounded-lg overflow-auto">
              <img
                src={userInfor?.picture || defaultAvatar}
                className="relative w-full h-full"
                alt="User Avatar"
              ></img>
            </div>
            <div className="font-medium text-xl mt-[1rem] mx-[0.3rem]">
              {userInfor?.firstName + " " + userInfor?.lastName}
            </div>
            <div className="text-[var(--en-vu-600)]">{userInfor?.roleName}</div>
          </div>
          <div className="flex flex-col w-full pl-[2rem] pr-[1rem]">
            <div className="font-medium mb-[16px] flex justify-between items-center">
              <p>Personal details</p>
              <div onClick={handleEditProfile}>X</div>
            </div>
            <div className="grid grid-cols-2 gap-[16px] w-full">
              <div className="text-[var(--en-vu-600)]">Phone number:</div>
              <div className="text-[var(--en-vu-Base)]">{userInfor?.phone}</div>
              <div className="text-[var(--en-vu-600)]">Email:</div>
              <div className="text-[var(--en-vu-Base)]">{userInfor?.email}</div>
            </div>
            <div className="w-full border-b-2 my-4"></div>
            <div className="font-medium mb-[16px] flex justify-between items-center">
              <p>Business details</p>
              <div onClick={handleEditProfile}>X</div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-[var(--en-vu-600)]">Business name:</div>
              <div className="text-[var(--en-vu-Base)]">
                {userInfor?.businessName}
              </div>
              <div className="text-[var(--en-vu-600)]">Category name:</div>
              <div className="text-[var(--en-vu-Base)]">
                {userInfor?.categoryName}
              </div>
              <div className="text-[var(--en-vu-600)]">Ocop category name:</div>
              <div className="text-[var(--en-vu-Base)]">
                {userInfor?.ocopCategoryName}
              </div>
            </div>
          </div>

          <button
            className="mt-auto bg-red-500 text-white py-2 px-4 rounded-lg"
            onClick={logout}
          >
            Logout
          </button>
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
      </div>
    </div>
  );
}
