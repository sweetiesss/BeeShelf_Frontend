import { useEffect, useRef, useState } from "react";
import { useDetail } from "../../context/DetailContext";
import { X } from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext";
import AxiosProduct from "../../services/Product";

export default function DetailSlide() {
  const { userInfor } = useAuth();
  const {
    dataDetail,
    typeDetail,
    updateDataDetail,
    updateTypeDetail,
    setRefresh,
  } = useDetail();
  const detailComponent = useRef();

  const handleCloseDetail = () => {
    updateDataDetail();
    updateTypeDetail("");
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
  const ProductDetail = () => {
    const [form, setForm] = useState();
    const [errors, setErrors] = useState();
    const { updateProductById } = AxiosProduct();
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
    const handleEdit = () => {
      dataDetail?.isInInv
        ? setForm({
            price: dataDetail?.price,
            weight: dataDetail?.weight,
            pictureLink: dataDetail?.pictureLink,
          })
        : setForm({
            ocopPartnerId: userInfor?.id,
            barcode: dataDetail?.barcode,
            name: dataDetail?.name,
            price: dataDetail?.price,
            weight: dataDetail?.weight,
            productCategoryId: dataDetail?.productCategoryId,
            pictureLink: dataDetail?.pictureLink,
            origin: dataDetail?.origin,
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
                {form?.name.length >= 0 ? (
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
                {form?.origin.length>=0 ? (
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
                {form?.price ? (
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
                {form?.weight ? (
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
              {form ? (
                <>
                  <button onClick={() => setForm()}>Cancel</button>
                  <button onClick={handeUpdate}>Update</button>
                </>
              ) : (
                <>
                  <button onClick={handleEdit}>Edit</button>
                  <button>Create Request</button>
                </>
              )}
            </div>
          </div>
        </div>
        {showUpdateConfirm && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div
              className="absolute bg-white border border-gray-300 text-black shadow-md rounded-lg p-4 w-fit h-fit"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <p>{`Are you sure you want to update ${dataDetail?.name}?`}</p>
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

  const requestDetail = () => {
    return (
      <div className="w-[455px] h-full bg-white p-6 flex flex-col gap-8 text-black">
        {/* Header */}
        <div className="w-full flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-black">
                Product information
              </h2>
            </div>
            <div
              className="text-3xl cursor-pointer text-gray-500 hover:text-black"
              onClick={handleCloseDetail}
            >
              <X weight="bold" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-lg text-center">
              <span className="flex-1 text-gray-500">Product details</span>
              <span className="flex-1 text-black">LOT details</span>
            </div>
            <div className="w-full h-px bg-gray-300"></div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-gray-300 rounded-lg"></div>
            <div className="text-center">
              <p className="text-xl font-medium">Cauliflower</p>
              <p className="text-gray-600 text-lg">#ID394812</p>
            </div>
          </div>

          {/* Product Info Table */}
          <div className="w-full flex flex-col gap-4">
            {[
              { label: "ID:", value: "#ID391288" },
              { label: "Lot num:", value: "312947463" },
              { label: "Name:", value: "Cauliflower" },
              { label: "Create date:", value: "12/03/2024" },
              { label: "Amount:", value: "123.423" },
              { label: "Product ID:", value: "#ID394812" },
              { label: "Product amount:", value: "492.412" },
              { label: "Import date:", value: "12/03/2024" },
              { label: "Export date:", value: "13/03/2024" },
              { label: "Expiration date:", value: "12/05/2024" },
              { label: "Inventory ID:", value: "#ID591038" },
            ].map((item, index) => (
              <div key={index} className="flex justify-between text-lg">
                <span className="text-gray-600">{item.label}</span>
                <span className="text-black">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="detail-slider z-10 text-white">
      <div ref={detailComponent} className="h-full">
        {typeDetail == "request" && requestDetail()}
        {typeDetail == "product" && ProductDetail()}
      </div>
    </div>
  );
}
