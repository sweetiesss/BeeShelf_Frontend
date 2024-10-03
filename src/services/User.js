import useAxios from "./customizeAxios";
import axios from "./customizeAxios";

const AxiosUser = () => {
  const { response, fetchData } = useAxios();

  const requestLogin = async (data) => {
    try {
      const fetching = await fetchData({
        url: "user/Login",
        method: "POST",
        data: data,
      });
      return fetching;
    } catch (error) {
      console.error("Login error:", error);
      console.log("error",error.message);
      
      return error; 
    }
  };

  return { requestLogin };
};

export default AxiosUser;
// const requestLogin= async (data)=>{

// console.log(process.env.BASE_URL_API);
//     return await axios.post("user/Login",data);
// }
// export {requestLogin}
