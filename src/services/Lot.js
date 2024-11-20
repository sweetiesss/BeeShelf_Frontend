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
        url: `lot/get-lot/`+id,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  return { createLot,getLotById };
}
