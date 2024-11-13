export function ProductListSkeleton({ size }) {
  return (
    <div className="w-full h-auto relative ">
      <div className="w-full h-fit left-[136px] top-[381px] flex-col justify-start items-start gap-8 inline-flex bg-white rounded-lg mb-3 p-4">
        <div className="w-full h-fit flex flex-col justify-start items-start gap-8 animate-pulse">
          {/* Skeleton Row */}
          {[...Array(size)].map((_, index) => (
            <div
              key={index}
              className="self-stretch flex justify-start items-center gap-2"
            >
              {/* Checkbox Placeholder */}
              <div className="w-[43px] flex justify-center items-center">
                <div className="w-[25px] h-[25px] bg-gray-300 rounded-[3px]" />
              </div>

              {/* Img Placeholder */}
              <div className="w-[11rem]">
                <div className="h-[20px] w-full bg-gray-300 rounded-sm" />
              </div>
              {/* Bar Placeholder */}
              <div className="w-[9rem]">
                <div className="h-[20px] w-[100%] bg-gray-300 rounded-sm" />
              </div>
              {/* Category Placeholder */}
              <div className=" w-[18rem]">
                <div className="h-[20px] w-[100%] bg-gray-300 rounded-sm" />
              </div>
              {/* Group Placeholder */}
              <div className="w-[19rem]">
                <div className="h-[20px] w-[100%] bg-gray-300 rounded-sm" />
              </div>
              {/* Price Placeholder */}
              <div className="w-[14rem]">
                <div className="h-[20px] w-[100%] bg-gray-300 rounded-sm" />
              </div>
              {/* Weight Placeholder */}
              <div className="w-[9rem]">
                <div className="h-[20px] w-[100%] bg-gray-300 rounded-sm" />
              </div>
              <div className="w-[11rem]">
                <div className="h-[20px] w-[100%] bg-gray-300 rounded-sm" />
              </div>

              {/* Action Placeholder */}
              <div className="w-[63px] flex justify-center items-center">
                <div className="w-5 h-5 bg-gray-300 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
