import useAxios from "./CustomizeAxios";

export default function AxiosOrder() {
  // Simulate fetching data from API
  const { fetchDataBearer } = useAxios();

  const getOrderByUserId = async (
    userId,
    filterByStatus,
    sortBy,
    descending,
    pageIndex,
    Size
  ) => {
    try {
      // const fetching = await fetchDataBearer({
      //   url: `order/get-orders/${userId}?${
      //     filterByStatus && "filterByStatus=" + filterByStatus + "&"
      //   }${sortBy && "sortBy=" + sortBy + "&"}${
      //     descending && "descending=" + descending + "&"
      //   }pageIndex=${pageIndex}&pageSize=${Size}`,
      //   method: "GET",
      // });
      const queryParams = new URLSearchParams();
  
      // Conditionally add query parameters
      if (typeof filterByStatus !== 'undefined') queryParams.append("filterByStatus", filterByStatus);
      if (typeof sortBy !== 'undefined') queryParams.append("sortBy", sortBy);
      if (typeof descending !== 'undefined') queryParams.append("descending", descending);
      queryParams.append("pageIndex", pageIndex);
      queryParams.append("pageSize", Size);
    
      const fetching = await fetchDataBearer({
        url: `order/get-orders/${userId}?${queryParams.toString()}`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  return { getOrderByUserId };
}
