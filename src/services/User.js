import { toast } from "react-toastify";
import { useAxios } from "./CustomizeAxios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

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

  const requestGetEmployeeByEmail = async (email, token) => {
    try {
      const fetching = await fetchData({
        url: `user/get-employee/${email}`,
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

  // const requestGetUserByEmail = async (email, token, type = "employee") => {
  //   try {
  //     // Tạo URL dựa trên type
  //     const url = type === "partner" ? `user/get-employee/${email}` : `partner/get-partner/${email}`;

  //     const fetching = await fetchData({
  //       url: url,
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return fetching;
  //   } catch (error) {
  //     return error;
  //   }
  // };

  //
  const getAuth = async (data) => {
    try {
      const fetching = await fetchData({
        url: "auth/login",
        method: "POST",
        data: data,
      });
      console.log("getAuth", fetching);
  
      return fetching;
    } catch (error) {
      return error;
    }
  };

  const loginByEmailPassword = async (data) => {
    try {
      let name = "";
      let nameEmployee= "";
      const fetching = async () => {
        const getToken = await getAuth(data);
        console.log("getToken", getToken);

        if (getToken && getToken?.status === 200) {
          if (getToken?.data && getToken?.data.length > 0) {
            const successDataToken = getToken?.data;
            const objectCheck = jwtDecode(successDataToken);
            console.log(objectCheck);

            setIsAuthenticated(successDataToken);
            // const getAccount = await requestGetUserByEmail(
            //   data.email,
            //   successDataToken
            // );
            // if (getAccount && getAccount?.status === 200 && getAccount?.data) {
            //   name = getAccount.data?.lastName;
            //   return getAccount.data;
            // }
            if (
              objectCheck &&
              objectCheck?.[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ] === "Partner"
            ) {
              const getAccount = await requestGetUserByEmail(
                data.email,
                successDataToken
              );
              if (
                getAccount &&
                getAccount?.status === 200 &&
                getAccount?.data
              ) {
                name = getAccount.data?.lastName;
                return getAccount.data;
              }
            } else if (
              objectCheck &&
              objectCheck?.[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ] === "Staff"
            ) {
              const getEmployeeAccount = await requestGetEmployeeByEmail(
                data.email,
                successDataToken
              );
              if (
                getEmployeeAccount &&
                getEmployeeAccount?.status === 200 &&
                getEmployeeAccount?.data
              ) {
                name = getEmployeeAccount.data?.lastName;
                return getEmployeeAccount.data;
              }
            }

            throw new Error("Unable to fetch account details.");
          }
        }

        throw new Error(
          getToken?.response?.data?.errors?.password?.[0] ||
            getToken?.response?.data?.message ||
            "Authentication failed."
        );
      };

      const result = await toast.promise(fetching(), {
        pending: "Request in progress...",
        success: {
          render() {
            return `Welcome back ${name || nameEmployee}`;
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
      console.log(fetching);

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
  const requestGetEmployeeByEmail = async (email, token) => {
    try {
      const fetching = await fetchData({
        url: `user/get-employee/${email}`,
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

  return {
    requestSignUp,
    loginByEmailPassword,
    requestResetPassword,
    sendRequestResetPassword,
    requestGetEmployeeByEmail,
  };

}
