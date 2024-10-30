import useAxios from "./CustomizeAxios";

export default function AxiosLot() {
  const { fetchDataBearer } = useAxios();
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
  return { createLot };
}
