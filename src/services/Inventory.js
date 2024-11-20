import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useAxiosBearer from "./CustomizeAxios";

export default function AxiosInventory() {
  const { fetchDataBearer } = useAxiosBearer();
  const {userInfor}=useContext(AuthContext);
  const getInventory100 = async () => {
    try {
      const fetching = await fetchDataBearer({
        url: `inventory/get-inventories/${userInfor?.id}?descending=false&pageIndex=0&pageSize=100`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  return{getInventory100};
}
