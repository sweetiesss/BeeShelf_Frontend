import { toast } from "react-toastify";
import useAxios from "./CustomizeAxios";
import axios from "./CustomizeAxios";

const AxiosUser = () => {
  const { response, fetchData } = useAxios();

  const requestLogin = async (data) => {
    try {
      const fetching = fetchData({
        url: "user/Login",
        method: "POST",
        data: data,
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
      return resultFetching;
    } catch (error) {
      console.error("Login error:", error);
      console.log("error", error.message);

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
      console.error("Login error:", error);
      console.log("error", error.message);

      return error;
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

  return { requestLogin, requestSignUp,getAuth };
};

export default AxiosUser;
// const requestLogin= async (data)=>{

// console.log(process.env.BASE_URL_API);
//     return await axios.post("user/Login",data);
// }
// export {requestLogin}
