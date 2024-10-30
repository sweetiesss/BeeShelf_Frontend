import { useContext } from "react";
import useAxios from "./CustomizeAxios";
import { AuthContext } from "../context/AuthContext";

export default function AxiosInventory() {
  const { fetchDataBearer } = useAxios();
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
