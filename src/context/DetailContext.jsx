// DetailContext.js
import React, { createContext, useState, useContext } from "react";

// Create the context
const DetailContext = createContext();

// Custom hook for consuming context
export const useDetail = () => useContext(DetailContext);

// Provider component
export const DetailProvider = ({ children }) => {
  const [dataDetail, setDataDetail] = useState();
  const [typeDetail, setTypeDetail] = useState("");
  const [refresh, setRefresh] = useState();
  const [productCreateRequest, setProductCreateRequest] = useState();

  const updateDataDetail = (data) => setDataDetail(data);
  const updateTypeDetail = (type) => setTypeDetail(type);

  return (
    <DetailContext.Provider
      value={{
        dataDetail,
        typeDetail,
        updateDataDetail,
        updateTypeDetail,
        refresh,
        setRefresh,
        productCreateRequest,
        setProductCreateRequest,
      }}
    >
      {children}
    </DetailContext.Provider>
  );
};
