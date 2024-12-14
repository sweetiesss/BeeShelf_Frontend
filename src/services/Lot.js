import useAxiosBearer from "./CustomizeAxios";

export default function AxiosLot() {
  const { fetchDataBearer } = useAxiosBearer();
  const createLot = async (data) => {
    try {
      const fetching = await fetchDataBearer({
        url: `lot/create-lot`,
        method: "POST",
        data: data,
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const getLotById = async (id) => {
    try {
      const fetching = await fetchDataBearer({
        url: `lot/get-lot/` + id,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const getLotByProductIdX1000 = async (id, productId, descending) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("filterBy", "ProductId");
      queryParams.append("filterQuery", productId);
      queryParams.append("descending", descending);
      queryParams.append("pageIndex", 0);
      queryParams.append("pageSize", "1000");

      const fetching = await fetchDataBearer({
        url: `lot/get-lots/` + id + "?" + queryParams.toString(),
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const getLotByUserId = async (
    userId,
    search,
    productId,
    inventoryId,
    sortBy,
    descending,
    page,
    pageSize
  ) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("search", search);
      productId && queryParams.append("filterBy", "ProductId");
      productId && queryParams.append("filterQuery", productId);

      inventoryId && queryParams.append("filterBy", "InventoryId");
      inventoryId && queryParams.append("filterQuery", inventoryId);

      queryParams.append("sortBy", sortBy);
      queryParams.append("descending", descending);
      queryParams.append("pageIndex", page);
      queryParams.append("pageSize", pageSize);

      const fetching = await fetchDataBearer({
        url: `lot/get-lots/` + userId + "?" + queryParams.toString(),
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  return { createLot, getLotById, getLotByProductIdX1000, getLotByUserId };
}
