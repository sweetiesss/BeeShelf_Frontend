import { useTranslation } from "react-i18next";
import {
  CaretDown,
  CaretUp,
  MagnifyingGlass,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export function WarehouseHeader({
  handleDownload,
  selectedProducts,
  products,
  warehouses,
  applyFilters,
  setFiltersVisible,
  filtersVisible,
}) {
  const { t } = useTranslation();

  // Filter state
  const [filters, setFilters] = useState({
    location: "",
    sizeRange: [0, 5000],
    status: "INSTOCK",
  });

  // Update filters
  const updateFilter = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  // Handle filter submission
  const handleFilterSubmit = () => {
    applyFilters(filters); // This function should filter the warehouses based on the filters
  };

  // Toggle filter visibility
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  return (
    <div className="relative space-y-10">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">{t("Warehouses")}</p>
        {/* Toggle button, positioned fixed and above the slider */}
        <button
          className="bg-[var(--main-project-color)] px-4 py-2 rounded-full text-white shadow-lg focus:outline-none fixed right-4 top-[5.5rem] z-50"
          onClick={toggleFilters}
        >
          {filtersVisible ? <CaretRight size={24} /> : <CaretLeft size={24} />}
        </button>
      </div>

      {/* Filter section with sliding effect */}
      <div
        className={`fixed top-16 right-0 h-full w-80 bg-white shadow-2xl border-l-2 border-gray-300 z-40 p-6 transition-all duration-500 ease-in-out transform ${
          filtersVisible
            ? "translate-x-0 opacity-100 visible"
            : "translate-x-full opacity-0 invisible"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">{t("Filters")}</h2>
        <div className="space-y-6">
          {/* Quick Search */}
          <div className="flex items-center border border-gray-300 rounded-lg p-2">
            <MagnifyingGlass size={20} weight="bold" />
            <input
              className="ml-2 w-full border-0 outline-none"
              placeholder={t("QuickSearch")}
            />
          </div>

          {/* Filter by Location */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="text-gray-600 font-medium">
              {t("Location")}:
            </label>
            <select
              name="location"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
            >
              <option value="">{t("AllLocations")}</option>
              <option value="Hanoi">Hanoi</option>
              <option value="Ho Chi Minh City">Ho Chi Minh City</option>
              <option value="Da Nang">Da Nang</option>
            </select>
          </div>

          {/* Filter by Warehouse Size */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="text-gray-600 font-medium">
              {t("WarehouseSize")}:
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={filters.sizeRange[1]}
              onChange={(e) =>
                updateFilter("sizeRange", [0, parseInt(e.target.value, 10)])
              }
              className="mt-2 w-full"
            />
            <span className="text-gray-600 font-medium block mt-2">
              {filters.sizeRange[1]} sqm
            </span>
          </div>

          {/* Filter by Inventory Status */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="text-gray-600 font-medium">{t("Status")}:</label>
            <select
              name="status"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
            >
              <option value="INSTOCK">{t("INSTOCK")}</option>
              <option value="OUTSTOCK">{t("OUTSTOCK")}</option>
            </select>
          </div>

          {/* Apply and Reset Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md w-full"
              onClick={handleFilterSubmit}
            >
              {t("Apply")} {t("Filters")}
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md w-full"
              onClick={() => handleDownload(products)}
            >
              {t("Reset")} {t("Filters")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InventoryHeader({
  applyInventoryFilters,
  handleDownload,
  products,
}) {
  const { t } = useTranslation();
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    location: "",
    maxWeight: [0, 5000], // Example: max weight range (0 to 5000)
    weight: [0, 5000], // Example: max weight range (0 to 5000)
    status: "INSTOCK",
    startDate: "", // Start date for the range
    endDate: "", // End date for the range
  });

  // Update filter values
  const updateFilter = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  // Handle filter submission
  const handleFilterSubmit = () => {
    applyInventoryFilters(filters); // Pass the filters back to the parent component
  };

  // Toggle filter visibility
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  return (
    <div className="relative space-y-10">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">{t("Inventories")}</p>
        {/* Toggle button, positioned fixed and above the slider */}
        <button
          className="bg-[var(--main-project-color)] px-4 py-2 rounded-full text-white shadow-lg focus:outline-none fixed right-4 top-[5.5rem] z-50"
          onClick={toggleFilters}
        >
          {filtersVisible ? <CaretRight size={24} /> : <CaretLeft size={24} />}
        </button>
      </div>

      {/* Filter section with sliding effect */}
      <div
        className={`fixed text-left top-10 right-0 h-full w-80 bg-white shadow-2xl border-l-2 border-gray-300 z-40 p-6 transition-all duration-500 ease-in-out transform ${
          filtersVisible
            ? "translate-x-0 opacity-100 visible"
            : "translate-x-full opacity-0 invisible"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4 ">{t("Filters")}</h2>
        <div className="space-y-6">
          {/* Quick Search */}
          <div className="flex items-center border border-gray-300 rounded-lg p-2">
            <MagnifyingGlass size={20} weight="bold" />
            <input
              className="ml-2 w-full border-0 outline-none"
              placeholder={t("QuickSearch")}
            />
          </div>

          {/* Filter by Location */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="text-gray-600 font-medium">
              {t("Location")}:
            </label>
            <select
              name="location"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
            >
              <option value="">{t("AllLocations")}</option>
              <option value="Hanoi">Hanoi</option>
              <option value="Ho Chi Minh City">Ho Chi Minh City</option>
              <option value="Da Nang">Da Nang</option>
            </select>
          </div>

          {/* Filter by Inventory Weight */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="text-gray-600 font-medium">{t("Weight")}:</label>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={filters.weight[1]}
              onChange={(e) =>
                updateFilter("weight", [0, parseInt(e.target.value, 10)])
              }
              className="mt-2 w-full"
            />
            <span className="text-gray-600 font-medium block mt-2">
              {filters.weight[1]} kg
            </span>
          </div>

          {/* Filter by Max Weight */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="text-gray-600 font-medium">
              {t("MaxWeight")}:
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={filters.maxWeight[1]}
              onChange={(e) =>
                updateFilter("maxWeight", [0, parseInt(e.target.value, 10)])
              }
              className="mt-2 w-full"
            />
            <span className="text-gray-600 font-medium block mt-2">
              {filters.maxWeight[1]} kg
            </span>
          </div>

          {/* Date Range Filter */}
          <div className="border border-gray-300 rounded-lg p-4">
            <div>
              <label className="text-gray-600 font-medium">{t("Date")}:</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => updateFilter("startDate", e.target.value)}
                className="ml-2 w-full"
              />
            </div>
            <div>
              <label className="text-gray-600 font-medium mt-2">
                {t("To")}:
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => updateFilter("endDate", e.target.value)}
                className="ml-2 w-full"
              />
            </div>
          </div>

          {/* Filter by Inventory Stock Status */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="text-gray-600 font-medium">{t("Status")}:</label>
            <select
              name="status"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
            >
              <option value="INSTOCK">{t("INSTOCK")}</option>
              <option value="OUTSTOCK">{t("OUTSTOCK")}</option>
            </select>
          </div>

          {/* Apply and Reset Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md w-full"
              onClick={handleFilterSubmit}
            >
              {t("Apply")} {t("Filters")}
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md w-full"
              onClick={() => handleDownload(products)}
            >
              {t("Reset")} {t("Filters")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
