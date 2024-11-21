import axios from "axios";

export default function AxiosOthers() {
  const getBanks = async () => {
    try {
      const fetching = await axios.get("https://api.vietqr.io/v2/banks");
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  return { getBanks };
}
