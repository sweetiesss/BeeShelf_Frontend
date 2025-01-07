export function ProductListSkeleton({ size }) {
  return (
    <div className="w-full h-auto relative ">
      <div className="w-full h-fit left-[136px] top-[381px] flex-col justify-start items-start gap-8 inline-flex bg-white rounded-lg mb-3 p-4">
        <div className="w-full h-fit flex flex-col justify-start items-start gap-8 animate-pulse">
          {[...Array(size)].map((_, index) => (
            <div
              key={index}
              className="self-stretch flex justify-start items-center gap-2"
            >
              <div className="w-[43px] flex justify-center items-center">
                <div className="w-[25px] h-[25px] bg-gray-300 rounded-[3px]" />
              </div>

              <div className="w-[11rem]">
                <div className="h-[20px] w-full bg-gray-300 rounded-sm" />
              </div>
              <div className="w-[9rem]">
                <div className="h-[20px] w-[100%] bg-gray-300 rounded-sm" />
              </div>
              <div className=" w-[18rem]">
                <div className="h-[20px] w-[100%] bg-gray-300 rounded-sm" />
              </div>
              <div className="w-[19rem]">
                <div className="h-[20px] w-[100%] bg-gray-300 rounded-sm" />
              </div>
              <div className="w-[14rem]">
                <div className="h-[20px] w-[100%] bg-gray-300 rounded-sm" />
              </div>
              <div className="w-[9rem]">
                <div className="h-[20px] w-[100%] bg-gray-300 rounded-sm" />
              </div>
              <div className="w-[11rem]">
                <div className="h-[20px] w-[100%] bg-gray-300 rounded-sm" />
              </div>

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

export function WarehouseListSkeleton() {
  return (
    <div className="animate-pulse shadow-lg rounded-lg p-6 mb-4 w-full max-w-lg mx-auto bg-gray-200">
      <div className="h-6 bg-gray-300 rounded mb-4 w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );
}
