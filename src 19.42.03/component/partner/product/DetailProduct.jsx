// components/partner/product/DetailProduct.js

import { ArrowLeft, ArrowRight, Plus } from "@phosphor-icons/react";
import defaultImg from "../../../assets/img/defaultImg.jpg";

export default function DetailProduct({
  product,
  handleCancel,
  handleConfirm,
  handleReset,
  handleSaveDraft,
  handleInputDetail,
}) {
  return (
    <div className="detail-product px-8">
      <div className="p-4">
        <div className="flex justify-between">
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product?.imageLink ? product?.imageLink : defaultImg}
                alt={product?.name}
                className="h-56 w-56 rounded-xl"
              />
              <div
                className="absolute top-3 right-3 w-5 h-5 flex justify-center items-center
                opacity-50 hover:opacity-100  
                bg-white rounded-full
                "
                onClick={(e) => e.stopPropagation()}
              >
                <Plus weight="bold" />
              </div>
            </div>
          </div>

          <div className="w-[35%]">
            <div className="">
              <div className="label">Display Name</div>
              <input
                onChange={handleInputDetail}
                name="name"
                onClick={(e) => e.stopPropagation()}
                className="w-full"
                value={product?.name}
              />
            </div>

            <div className="flex justify-between w-full">
              <div className="w-[30%]">
                <div className="label">SKU</div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product?.sku}
                />
              </div>
              <div className="w-[60%]">
                <div className="label">Barcode</div>
                <input
                  onChange={handleInputDetail}
                  name="barcode"
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product?.barcode}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div className="w-[45%]">
                <div className="label">Brand</div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product?.group}
                />
              </div>
              <div className="w-[45%]">
                <div className="label">Vendor</div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product?.category}
                />
              </div>
            </div>

            <div className="flex space-x-4 w-full justify-between">
              <div className="w-[26%]">
                <div className="label">Stock: </div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product?.stock}
                />
              </div>
              <div className="w-[26%]">
                <div className="label">Size: </div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product?.size || "N/A"}
                />
              </div>
              <div className="w-[26%]">
                <div className="label">Reserved: </div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product?.reserved}
                />
              </div>
            </div>
          </div>

          <div className="w-[35%]">
            <div className="flex justify-between gap-10">
              <div className="w-1/2">
                <div className="label">Price: </div>
                <input
                  className="w-full"
                  name="price"
                  onClick={(e) => e.stopPropagation()}
                  value={product?.price}
                />
              </div>
              <div className="w-1/2">
                <div className="label">Cost: </div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product?.cost}
                />
              </div>
            </div>

            <div className="w-[26%]">
              <div className="label">Origin: </div>
              <input
                onChange={handleInputDetail}
                name="origin"
                className="w-full"
                onClick={(e) => e.stopPropagation()}
                value={product?.origin}
              />
            </div>
            <div className="w-[26%]">
              <div className="label">Weight: </div>
              <input
                onChange={handleInputDetail}
                name="weight"
                className="w-full"
                onClick={(e) => e.stopPropagation()}
                value={product?.weight}
              />
            </div>
            <div className="flex justify-between gap-10">
              <div className="w-1/2">
                <div className="label">Create Date: </div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={new Date(product?.createDate).toLocaleDateString()}
                  disabled={true}
                />
              </div>
              <div className="w-1/2">
                <div className="label">Exp Date: </div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={new Date(product?.expDate).toLocaleDateString()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />

      <div className="flex justify-between py-2 pb-4">
        <div className="space-x-10">
          <button
            className="px-4 py-2"
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
          >
            Reset
          </button>
        </div>
        <div>
          <button className="px-4 py-2" onClick={handleCancel}>
            Cancel
          </button>
          <button className="px-4 py-2" onClick={handleSaveDraft}>
            Save As Draft
          </button>
          <button className="px-4 py-2" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
