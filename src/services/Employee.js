import { toast } from "react-toastify";
import useAxiosBearer from "./CustomizeAxios";

export default function AxiosEmployee() {
  const { fetchDataBearer } = useAxiosBearer();
  const getEmployees = async (
    search,
    sortBy,
    filterByRole,
    descending,
    pageIndex,
    pageSize
  ) => {
    try {
      const queryParams = new URLSearchParams();
      search && queryParams.append("search", search);
      sortBy && queryParams.append("sortBy", sortBy);
      filterByRole && queryParams.append("filterByRole", filterByRole);
      queryParams.append("descending", descending);
      queryParams.append("pageIndex", pageIndex);
      queryParams.append("pageSize", pageSize);

      const fetching = await fetchDataBearer({
        url: `user/get-employees?${queryParams.toString()}`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const updateEmployee = async (data) => {
    try {
      const fetching = await fetchDataBearer({
        url: `user/update-employee`,
        method: "PUT",
        data: data,
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const createEmployee = async (data) => {
    try {
      const fetching = fetchDataBearer({
        url: `user/create-employee`,
        method: "POST",
        data: data,
      });
      await toast.promise(fetching, {
        pending: "Employee creating...",
        success: {
          render() {
            return `Employee created`;
          },
        },
        error: {
          render({ data }) {
            console.log("data Error", data.response.data.message);
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const getWarehouseDashboardData = async (showYear) => {
    try {
      const url = `user/get-manager-dashboard?year=` + parseInt(showYear);

      const fetching = await fetchDataBearer({
        url,
        method: "GET",
      });

      console.log(fetching);

      return fetching;
    } catch (error) {
      console.error("Error fetching products:", error);
      return error;
    }
  };

  return { getEmployees, updateEmployee, createEmployee ,getWarehouseDashboardData};
}
