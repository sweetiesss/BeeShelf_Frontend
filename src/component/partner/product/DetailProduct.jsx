// components/partner/product/DetailProduct.js

import { ArrowLeft, ArrowRight, Plus } from "@phosphor-icons/react";

export default function DetailProduct({ product }) {
  return (
    <div className="detail-product px-8">
      <div className="p-4">
        <div className="flex justify-between">
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
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
            <div className="flex items-center justify-between px-4">
              <div className="px-2 py-1 border-[var(--line-main-color)]  border-2  bg-white rounded-xl shadow-lg">
                <ArrowLeft className="" weight="bold" />
              </div>
              <p className="">1 of 3</p>
              <div className="px-2 py-1 border-[var(--line-main-color)]  border-2 bg-white rounded-xl shadow-lg">
                <ArrowRight className="" weight="bold" />
              </div>
            </div>
          </div>

          <div className="w-[35%]">
            <div className="">
              <div className="label">Display Name</div>
              <input
                onClick={(e) => e.stopPropagation()}
                className="w-full"
                value={product.name}
              />
            </div>

            <div className="flex justify-between w-full">
              <div className="w-[30%]">
                <div className="label">SKU</div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product.sku}
                />
              </div>
              <div className="w-[60%]">
                <div className="label">Barcode</div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product.sku}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div className="w-[45%]">
                <div className="label">Brand</div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product.group}
                />
              </div>
              <div className="w-[45%]">
                <div className="label">Vendor</div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product.category}
                />
              </div>
            </div>

            <div className="flex space-x-4 w-full justify-between">
              <div className="w-[26%]">
                <div className="label">Stock: </div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product.stock}
                />
              </div>
              <div className="w-[26%]">
                <div className="label">Size: </div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product.size || 'N/A'}
                />
              </div>
              <div className="w-[26%]">
                <div className="label">Reserved: </div>
                <input
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                  value={product.reserved}
                />
              </div>
            </div>
          </div>

          <div className="w-[35%]">
            <p className="text-sm text-gray-500">Tags:</p>
            <div className="flex gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-200 text-sm rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex justify-between py-2 pb-4">
        <button className="px-4 py-2">Reset</button>
        <div className="space-x-10">
          <button className="px-4 py-2">Update</button>
          <button className="px-4 py-2">Delete</button>
        </div>
      </div>
    </div>
  );
}
