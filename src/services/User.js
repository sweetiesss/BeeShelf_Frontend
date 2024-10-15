import { toast } from "react-toastify";
import useAxios from "./CustomizeAxios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AxiosUser() {
  const { fetchData } = useAxios();
  const { setIsAuthenticated } = useContext(AuthContext);

  const requestGetUserByEmail = async (email, token) => {
    try {
      const fetching = fetchData({
        url: `user/get-user/${email}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render({ data }) {
            console.log("data Success", data?.data?.firstName);
            return `Welcome back ${data?.data?.firstName}`;
          },
        },
        error: {
          render({ data }) {
            console.log("data Error", data.response.data.message);
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });

      const resultFetching = await fetching;
      console.log("Fetched User Data:", resultFetching);

      // Return the result to the caller
      return resultFetching;
    } catch (error) {
      console.error("Login error:", error);
      console.log("error", error.message);

      // Return error for further handling
      return error;
    }
  };
  const getAuth = async (data) => {
    try {
      const fetching = fetchData({
        url: "auth/Login",
        method: "POST",
        data: data,
      });
      await toast.promise(fetching, {
        pending: "Request in progress...",
      });
      const resultFetching = await fetching;
      return resultFetching;
    } catch (error) {
      return error.response.data.message;
    }
  };

  const loginByEmailPassword = async (data) => {
    try {
      const getToken = await getAuth(data);
      if (getToken && getToken?.status === 200) {
        if (getToken?.data && getToken?.data.length > 0) {
          const successDataToken = getToken?.data;
          setIsAuthenticated(successDataToken);
          const getAccount = await requestGetUserByEmail(
            data.email,
            successDataToken
          );

          if (getAccount && getAccount?.status === 200 && getAccount?.data) {
            return getAccount.data;
          }
          return getAccount;
        }
      }
      return getToken;
    } catch (e) {
      console.log(e);
      return e.response.data.message;
    }
  };

  const requestSignUp = async (data) => {
    try {
      const fetching = fetchData({
        url: "auth/Signup",
        method: "POST",
        data,
      });
      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render({ data }) {
            console.log("data Success", data?.data?.firstName);
            return `Welcome ${data?.data?.firstName}`;
          },
        },
        error: {
          render({ data }) {
            console.log("data Error", data.response.data.message);
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      const resultFetching = await fetching;
      return resultFetching;
    } catch (error) {
      console.error("Login error:", error);
      console.log("error", error.message);
      return error;
    }
  };

  return { requestSignUp, loginByEmailPassword };
}

// const requestLogin= async (data)=>{

// console.log(process.env.BASE_URL_API);
//     return await axios.post("user/Login",data);
// }
// export {requestLogin}
