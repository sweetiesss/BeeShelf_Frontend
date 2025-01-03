import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { AuthContext } from "../../context/AuthContext";

import { useTranslation } from "react-i18next";
import AxiosInventory from "../../services/Inventory";
import AxiosProduct from "../../services/Product";

import AxiosLot from "../../services/Lot";
import ImportRequestSide from "../../component/partner/request/ImportRequestSide";
import ExportRequestSide from "../../component/partner/request/ExportRequestSide";

export default function CreateRequestPage({ handleCancel, handleClose }) {
  const { userInfor } = useContext(AuthContext);
  const [typeRequest, setTypeRequest] = useState("Import");

  const [products, setProducts] = useState([]);
  const [productsImported, setProductsImported] = useState([]);

  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const { getInventory1000ByUserId } = AxiosInventory();
  const { getProductByUserId } = AxiosProduct();
  const { getLotByUserId } = AxiosLot();

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

  console.log("ImportedProduts", productsImported);
  console.log("inventories", inventories);

  // Render the form
  return (
    <div>
      <p className="font-semibold text-3xl mb-4">{t("CreateRequest")}</p>
      <div className=" flex gap-4 items-center mb-4">
        <div className="text-[var(--en-vu-600)] font-normal col-span-1">
          {t("TypeOfRequest")}
        </div>

        <Select
          className="col-span-2"
          styles={{
            menu: (provided) => ({
              ...provided,

              // Restrict the dropdown height
              overflowY: "hidden", // Enable scrolling for content
            }),
            menuList: (provided) => ({
              ...provided,
              padding: 0, // Ensure no extra padding
              maxHeight: "11.5rem",
              overflow: "auto",
            }),
            control: (baseStyles) => ({
              ...baseStyles,
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "none",
              "&:hover": {
                border: "1px solid #888",
              },
            }),
            option: (baseStyles, { isFocused, isSelected }) => ({
              ...baseStyles,
              backgroundColor: isSelected
                ? "var(--Xanh-Base)"
                : isFocused
                ? "var(--Xanh-100)"
                : "white",
              color: isSelected ? "white !important" : "black",
              cursor: "pointer",
              padding: "0.5rem 1rem", // Option padding
              textAlign: "left", // Center-align text
            }),
          }}
          value={{
            value: typeRequest,
            label: typeRequest,
          }} // Map string to object
          onChange={(selectedOption) => setTypeRequest(selectedOption.value)}
          options={[
            { value: "Import", label: "Import" },
            { value: "Export", label: "Export" },
          ]}
          formatOptionLabel={({ value }) => (
            <div className="flex items-center gap-4">
              <p>{value}</p>
              <p className="text-gray-400">
                {"("}
                {value === "Import"
                  ? t("ImportProductToInventory")
                  : "ExportProductFromInventory"}
                {")"}
              </p>
            </div>
          )}
        />
      </div>

      {typeRequest === "Import" && (
        <ImportRequestSide products={products} inventories={inventories} />
      )}
      {typeRequest === "Export" && (
        <ExportRequestSide
          productsImported={productsImported}
          inventories={inventories}
        />
      )}
    </div>
  );
}
