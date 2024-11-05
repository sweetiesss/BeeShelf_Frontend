import { useEffect, useRef, useState } from "react";
import { useDetail } from "../../context/DetailContext";
import { X } from "@phosphor-icons/react";

export default function DetailSlide() {
  const { dataDetail, typeDetail, updateDataDetail, updateTypeDetail } =
    useDetail();
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
      </div>
    </div>
  );
}
