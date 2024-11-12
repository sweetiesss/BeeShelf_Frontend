import { toast } from "react-toastify";
import useAxios from "./CustomizeAxios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AxiosUser() {
  const { fetchData } = useAxios();
  const { setIsAuthenticated } = useContext(AuthContext);
  const requestGetUserByEmail = async (email, token) => {
    try {
      const fetching = await fetchData({
        url: `partner/get-partner/${email}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return fetching;
    } catch (error) {
      return error;
    }
  };
  const getAuth = async (data) => {
    try {
      const fetching = await fetchData({
        url: "auth/Login",
        method: "POST",
        data: data,
      });
      return fetching;
    } catch (error) {
      return error.response.data.message;
    }
  };
 
  const loginByEmailPassword = async (data) => {
    try {
      let name = "";
      const fetching = async () => {
        const getToken = await getAuth(data);

        if (getToken && getToken?.status === 200) {
          console.log("hesjsndaskjndk");

          if (getToken?.data && getToken?.data.length > 0) {
            const successDataToken = getToken?.data;
            setIsAuthenticated(successDataToken);
            const getAccount = await requestGetUserByEmail(
              data.email,
              successDataToken
            );
            if (getAccount && getAccount?.status === 200 && getAccount?.data) {
              name = getAccount.data?.lastName;
              return getAccount.data;
            }

            throw new Error("Unable to fetch account details.");
          }
        }

        throw new Error(getToken || "Authentication failed.");
      };

      const result = await toast.promise(fetching(), {
        pending: "Request in progress...",
        success: {
          render() {
            return `Welcome back ${name}`;
          },
        },
        error: {
          render({ data }) {

            return `${data?.message || "Something went wrong!"}`;
          },
        },
      });
      return result;
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const requestSignUp = async (data) => {
    try {
      const fetching = fetchData({
        url: "auth/sign-up",
        method: "POST",
        data,
      });
      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render({ data }) {
            return `Welcome ${data?.data?.firstName}`;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      const resultFetching = await fetching;
      return resultFetching;
    } catch (error) {
      return error;
    }
  };

  return { requestSignUp, loginByEmailPassword };
}
