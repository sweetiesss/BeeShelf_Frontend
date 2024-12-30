import React, { useEffect, useMemo, useState } from "react";
import Mapping from "../../component/shared/Mapping";
import { Bounce, toast } from "react-toastify";
import AxiosWarehouse from "../../services/Warehouse";
import AxiosOthers from "../../services/Others";
import Select from "react-select";

export default function AddStorePage() {
  const [newStore, setNewStore] = useState({
    name: "",
    capacity: "",
    length: 100,
    width: 100,
    location: "",
    provinceId: "",
    cols: 12,
  });
  const { getProvinces } = AxiosOthers();
  const { createWarehouse } = AxiosWarehouse();
  const [provinces, setProvinces] = useState();
  const [locationError, setLocationError] = useState();
  const [debouncedLocation, setDebouncedLocation] = useState(
    newStore?.location
  );

  const [latLng, setLatLng] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStore((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchBeginData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocation(newStore?.location);
      const dataList = newStore?.location
        ?.split(",")
        .map((item) => item.trim());
      const provniceFouned = provinces?.find(
        (item) => item.subDivisionName === dataList?.[dataList?.length - 2]
      );
      setNewStore((prev) => ({ ...prev, provinceId: provniceFouned }));
    }, 500); // Adjust the debounce delay (300ms in this example)

    return () => clearTimeout(handler); // Cleanup timeout on unmount or location change
  }, [newStore?.location]);

  const fetchBeginData = async () => {
    const result2 = await getProvinces();
    if (result2?.status === 200) {
      setProvinces(result2?.data);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { provinceId, ...theForm } = newStore;
      const submitForm = {
        ...theForm,
        provinceId: provinceId?.id,
        longitude: latLng?.lon,
        latitude: latLng?.lat,
      };
      console.log(submitForm);
      const result = await createWarehouse(submitForm);
      console.log(result);
      if (result?.status === 200) {
        setLatLng();
        setNewStore({
          name: "",
          capacity: "",
          length: 100,
          width: 100,
          location: "",
          province: "",
          cols: 12,
        });
      }
    } catch (error) {
      console.error("Failed to create store:", error);
    }
  };

  const mappingProps = useMemo(() => {
    return {
      showLocation: {
        name: "Your Location",
        location: debouncedLocation,
      },
      defaultLocation: newStore?.provinceId?.subDivisionName,

      setLatLng: setLatLng,
    };
  }, [debouncedLocation, newStore?.provinceId, setLatLng]);

  const calculatePercentage = (number1, number2) => {
    const total = Number(number1) + Number(number2);
    const firstStep = Number(number1) / Number(total);
    console.log("firstStep", firstStep);
    const result = firstStep * 100;
    console.log("result", result);

    return result;
  };

  return (
    <div className="flex justify-center gap-10">
      <div className="flex flex-col items-center p-4 w-full h-full">
        <h1 className="text-2xl font-bold mb-6">Add New Store</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 font-semibold">
              Store Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newStore.name}
              onChange={handleInputChange}
              placeholder="Enter store name"
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="capacity" className="mb-2 font-semibold">
              Capacity (kg):
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={newStore.capacity}
              onChange={handleInputChange}
              placeholder="Enter capacity"
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="width" className="mb-2 font-semibold">
                Width (m):
              </label>
              <input
                type="number"
                id="width"
                name="width"
                value={newStore.width}
                onChange={handleInputChange}
                placeholder="Enter width"
                className="p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="length" className="mb-2 font-semibold">
                Length (m):
              </label>
              <input
                type="number"
                id="length"
                name="length"
                value={newStore.length}
                onChange={handleInputChange}
                placeholder="Enter length"
                className="p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="location" className="mb-2 font-semibold">
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={newStore.location}
              onChange={handleInputChange}
              placeholder="Enter store location"
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="w-full h-64 border border-gray-300 rounded z-10">
            <Mapping {...mappingProps} />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Store
          </button>
        </form>
      </div>
      <div className="w-full">
        <div>The store roading map</div>
        <div className="flex flex-col">
          <label htmlFor="cols" className="mb-2 font-semibold">
            Maximum number of room on Store Width (room):
          </label>
          <input
            type="number"
            id="cols"
            name="cols"
            value={newStore.cols}
            onChange={handleInputChange}
            placeholder="Enter cols"
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className=" flex justify-center p-10 w-full h-full">
          <div className={`w-[40rem] h-[40rem] p-10 `}>
            <div
              className={`relative grid`}
              style={{
                gridTemplateColumns: `repeat(${newStore?.cols || 1}, 1fr)`,
                width: `${calculatePercentage(
                  newStore?.width,
                  newStore?.length
                )}%`,
                height: `${calculatePercentage(
                  newStore?.length,
                  newStore?.width
                )}%`,
                margin: "auto",
                border: "5px double black",
              }}
            >
              <div className="absolute w-[30%] h-[20%] max-w-[82px] max-h-[82px] overflow-hidden border-2 border-black bg-white flex items-center justify-center bottom-0 left-[50%] text-center -translate-x-[50%] translate-y-[60%]">
                <p>Exist</p>
              </div>
              {Array.from({ length: newStore?.cols }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#fff", // Cell background color
                    border: "1px solid #ccc", // Optional: Add borders to each cell
                    height: "100%",
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
