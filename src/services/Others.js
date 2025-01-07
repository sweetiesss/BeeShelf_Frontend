import axios from "axios";
import { useAxios } from "./CustomizeAxios";

export default function AxiosOthers() {
  const { fetchData } = useAxios();
  const getBanks = async () => {
    try {
      const fetching = await axios.get("https://api.vietqr.io/v2/banks");
      return fetching;
    } catch (e) {
      console.error(e);
      return e;
    }
  };
  const getProvinces = async () => {
    try {
      const fetching = await fetchData({
        url: "partner/get-provinces",
        method: "GET",
      });
      return fetching; 
    } catch (e) {
      console.error(e);
      return e;
    }
  };
  const getProvincesWithDeliveryZone = async () => {
    try {
      const fetching = await fetchData({
        url: "user/get-provinces?pageIndex=0&pageSize=1000",
        method: "GET",
      });
      return fetching; 
    } catch (e) {
      console.error(e);
      return e;
    }
  };
  const getAddressProvincesStressWard = async (A, B) => {
    try {
      const fetching = await axios.get(
        `https://esgoo.net/api-tinhthanh/${A}/${B}.htm`
      );
      return fetching;
    } catch (e) {
      console.error(e);
      return e;
    }
  };

  const getOcopCategoryBy100 = async (pageIndex = 0, size = 100) => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.append("pageIndex", pageIndex);
      queryParams.append("pageSize", size);

      const fetching = await fetchData({
        url: `productCategory/get-ocop-categories?${queryParams.toString()}`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.error(e);
      return e;
    }
  };

  return { getBanks, getOcopCategoryBy100, getProvinces,getAddressProvincesStressWard,getProvincesWithDeliveryZone };
}
