import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { AuthContext } from "../../context/AuthContext";

import { useTranslation } from "react-i18next";
import AxiosInventory from "../../services/Inventory";
import AxiosProduct from "../../services/Product";

import AxiosLot from "../../services/Lot";
import ImportRequestSide from "../../component/partner/request/ImportRequestSide";
import ExportRequestSide from "../../component/partner/request/ExportRequestSide";
import { useLocation } from "react-router-dom";
import ImportRequestSideUpdate from "../../component/partner/request/ImportRequestSideUpdate";

export default function UpdateRequestPage() {
  const location = useLocation();
  const [updateDataBased, setUpdateDataBased] = useState(location?.state || {});

  const { userInfor } = useContext(AuthContext);
  const [typeRequest, setTypeRequest] = useState(updateDataBased?.requestType);

  const [products, setProducts] = useState([]);
  const [productsImported, setProductsImported] = useState([]);

  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const { getInventory1000ByUserId } = AxiosInventory();
  const { getProductByUserId } = AxiosProduct();
  const { getLotByUserId, getLotById } = AxiosLot();

  useEffect(() => {
    const fetchingBeginData = async () => {
      try {
        setLoading(true);
        const result = await getInventory1000ByUserId(userInfor?.id);
        if (result?.status === 200) {
          setInventories(result.data.items || []);
        }
        const response = await getProductByUserId(
          userInfor?.id,
          0,
          1000,
          "",
          "Name",
          false,
          undefined
        );
        if (response?.status === 200) {
          setProducts(response.data.items || []);
        }
        const productsInWarehouse = await getLotByUserId(
          userInfor?.id,
          "",
          undefined,
          undefined,
          "ExpirationDate",
          false,
          0,
          1000
        );
        setProductsImported(productsInWarehouse?.data || []);
      } catch (e) {
        console.error("Error fetching inventories", e);
      } finally {
        setLoading(false);
      }
    };
    fetchingBeginData();
  }, []);
  useEffect(() => {
    const fetchingData = async () => {
      if (updateDataBased && updateDataBased?.lotId > 0) {
        const result = await getLotById(updateDataBased?.lotId);
        console.log("resultghere", result);
        if (result?.status === 200) {
          setUpdateDataBased((prev) => ({ ...prev, lot: result?.data }));
        }
      }
    };
    fetchingData();
  }, []);
  // Render the form
  return (
    <div>
      <p className="font-semibold text-3xl mb-10">{t("CreateRequest")}</p>
      <div className=" flex gap-4 items-center mb-4">
        <div className="text-[var(--en-vu-600)] font-normal col-span-1">
          {t("TypeOfRequest")}
        </div>

        <span className="text-xl font-medium ">{typeRequest}</span>
      </div>

      {typeRequest === "Import" && (
        <ImportRequestSideUpdate
          products={products}
          inventories={inventories}
          updateDataBased={updateDataBased}
        />
      )}
      {typeRequest === "Export" && (
        <ExportRequestSide
          productsImported={productsImported}
          inventories={inventories}
          updateDataBased={updateDataBased}
        />
      )}
    </div>
  );
}
