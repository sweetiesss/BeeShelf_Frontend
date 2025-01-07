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
  const getAuth = async (data) => {
    try {
      const fetching = fetchData({
        url: "auth/login",
        method: "POST",
        data: data,
      });
      await toast.promise(fetching, {
        pending: "Request in progress...",
        error: {
          render({ data }) {
            return `${
              data?.response?.data?.message || "Something went wrong!"
            }`;
          },
        },
      });

      return fetching;
    } catch (error) {
      return error;
    }
  };

  const loginByEmailPassword = async (data) => {
    try {
      let name = "";
      let nameEmployee = "";
      const getToken = await getAuth(data);
      if (getToken && getToken?.status === 200) {
        if (getToken?.data && getToken?.data.length > 0) {
          const successDataToken = getToken?.data;
          const objectCheck = jwtDecode(successDataToken);
          console.log("check", objectCheck);

          setIsAuthenticated(successDataToken);
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
            if (getAccount && getAccount?.status === 200 && getAccount?.data) {
              name = getAccount.data?.lastName;
              return getAccount;
            }
          } else if (
            objectCheck &&
            (objectCheck?.[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] === "Staff" || 
              objectCheck?.[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ] === "Manager" ||
              objectCheck?.[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ] === "Admin")
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
              return getEmployeeAccount;
            }
          }
          throw new Error("Unable to fetch account details.");
        }
      }

      return getToken;
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
          render() {
            return `Your account created.`;
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
  const requestResetPassword = async (data) => {
    try {
      const fetching = fetchData({
        url: "auth/reset-password",
        method: "POST",
        data,
      });

      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Your new password updated.`;
          },
        },
        error: {
          render({ data }) {
            if (data.response.data.message === "Invalid reset token.") {
              return "The request is expired.";
            } else {
              return `${data.response.data.message || "Something went wrong!"}`;
            }
          },
        },
      });
      const resultFetching = await fetching;

      return resultFetching;
    } catch (error) {
      return error;
    }
  };
  const sendRequestResetPassword = async (email) => {
    try {
      const fetching = fetchData({
        url: "auth/forgot-password?email=" + email,
        method: "POST",
      });

      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Your request has been sent`;
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
 
  //????
  return {
    requestSignUp,
    loginByEmailPassword,
    requestResetPassword,
    sendRequestResetPassword,
  };
}
