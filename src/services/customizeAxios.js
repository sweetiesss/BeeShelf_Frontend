// import axios from "axios";

// console.log(process.env.REACT_APP_BASE_URL_API);

// const instance =axios.create({
//     baseURL:process.env.REACT_APP_BASE_URL_API
// })
// instance.interceptors.response.use(function(response){
//     return response.data;
// },function(error){
//     return Promise.reject(error)
// })

// export default instance;

import axios from "axios";
import { useState } from "react";
const useAxios = () => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_API,
  });
  instance.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    function (response) {
      console.log("response", response.data);

      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchData = async ({ url, method, data = {}, params = {} }) => {
    setLoading(true);
    try {
      const result = await instance({
        url,
        method,
        data,
        params,
      });
      setResponse(result.data);
      console.log("result",result);
      
      return result;
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      setError(errorMessage);
      return Promise.reject(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return { response, error, loading, fetchData };
};

export default useAxios;
