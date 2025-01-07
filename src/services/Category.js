import { toast } from "react-toastify";
import useAxiosBearer, { useAxios } from "./CustomizeAxios";

export default function AxiosCategory() {
  const { fetchDataBearer } = useAxiosBearer();
  const getProductCategoryBy1000 = async (pageIndex = 0, size = 1000) => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.append("pageIndex", pageIndex);
      queryParams.append("pageSize", size);

      const fetching = await fetchDataBearer({
        url: `productCategory/get-product-categories?${queryParams.toString()}`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.error(e);
      return e;
    }
  };

  return { getProductCategoryBy1000 };
}
