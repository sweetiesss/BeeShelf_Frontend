import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

export default function CreateOrderPage() {
  const { t } = useTranslation();
  const { userInfor } = useAuth();

  const baseForm = {
    ocopPartnerId: userInfor?.id,
    receiverPhone: "",
    receiverAddress: "",
    distance: null,
    products: [
      {
        productId: null,
        productAmount: null,
      },
    ],
  };
  const [form, setForm] = useState(baseForm);

  const [item, setItem] = useState({ productName: "", quantity: 1, price: 0 });

  const [lots,setLots]=useState();

  useEffect(()=>{

  },[]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    if (item.productName && item.quantity > 0 && item.price > 0) {
      setForm((prev) => ({
        ...prev,
        items: [...prev.items, item],
      }));
      setItem({ productName: "", quantity: 1, price: 0 });
    }
  };

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order Created:", form);
    // Add your API call here
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">{t("Create Order")}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("Customer Name")}
            </label>
            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("Customer Email")}
            </label>
            <input
              type="email"
              name="customerEmail"
              value={form.customerEmail}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("Customer Phone")}
            </label>
            <input
              type="text"
              name="customerPhone"
              value={form.customerPhone}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("Order Date")}
            </label>
            <input
              type="date"
              name="orderDate"
              value={form.orderDate}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h2 className="text-lg font-semibold mb-2">{t("Order Items")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <input
              type="text"
              name="productName"
              placeholder={t("Product Name")}
              value={item.productName}
              onChange={handleItemChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder={t("Quantity")}
              value={item.quantity}
              onChange={handleItemChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="number"
              name="price"
              placeholder={t("Price")}
              value={item.price}
              onChange={handleItemChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={addItem}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
            >
              {t("Add Item")}
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            {form?.items?.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  {item.productName} - {item.quantity} x ${item.price}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  {t("Remove")}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setForm(baseForm)} // Reset form
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow hover:bg-gray-300 transition"
          >
            {t("Reset")}
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
          >
            {t("Create Order")}
          </button>
        </div>
      </form>
    </div>
  );
}
