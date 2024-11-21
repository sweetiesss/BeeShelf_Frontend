import React from "react";
import defaultImg from "../../../assets/img/defaultImg.jpg";

export default function OrderCard({ order, onClickEdit, onClickDelete }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-top mb-4">
        <div>
          <p className="text-xl font-bold">
            Order ID: <span className="font-medium">#{order.id}</span>
          </p>
          <p className="text-xl font-bold"> ReceiverName</p>
          <div className="flex text-sm">
            <p className=" text-gray-700 ">
              Phone: <span className="font-medium">{order.receiverPhone}</span>
            </p>
          </div>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-sm font-semibold h-fit ${
            order.orderStatus === "Delivered"
              ? "bg-green-200 text-green-800"
              : order.orderStatus === "Shipped"
              ? "bg-yellow-200 text-yellow-800"
              : order.orderStatus === "Processing"
              ? "bg-blue-200 text-blue-800"
              : order.orderStatus === "Pending"
              ? "bg-gray-200 text-gray-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {order.orderStatus}
        </div>
      </div>
      <div>
        <div>From: Warehouse A.</div>
        <div>To: {order.receiverAddress}</div>
      </div>

      {/* Order Details Section */}
      <div className="text-sm text-gray-700">
        <p className="mb-2">
          Product Name:{" "}
          <span className="font-medium">{order.product_name}</span>
        </p>
        <p className="mb-2">
          Product Amount:{" "}
          <span className="font-medium">{order.productAmount}</span>
        </p>
        <p className="mb-2">
          Total Price: <span className="font-medium">${order.totalPrice}</span>
        </p>
        <p className="mb-2">
          COD Status: <span className="font-medium">{order.codStatus}</span>
        </p>
        <p className="mb-2">
          Delivery By: <span className="font-medium">{order.deliver_by}</span>
        </p>
      </div>

      {/* Receiver Information */}
      <div className="mt-4">
        <h3 className="text-sm font-bold mb-2">Receiver Information:</h3>
      </div>

      {/* Picture Section */}
      <div className="mt-4">
        <img
          src={order.picture_link}
          alt="Product"
          className="w-20 h-20 object-cover rounded-lg mb-4"
        />
      </div>

      {/* Actions: Edit and Delete */}
      <div className="flex mt-4 space-x-4">
        <button className="text-blue-600 hover:underline" onClick={onClickEdit}>
          Edit
        </button>
        <button
          className="text-red-600 hover:underline"
          onClick={onClickDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
export function OrderDetailCard({ order, onClickEdit, onClickDelete }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="space-y-4">
        <p className="text-2xl font-bold"> Order detail</p>

        <hr></hr>
      </div>
      <div className="grid grid-cols-2">
        <p className="font-medium">#{order.id}</p>
        <p
          className={`px-2 py-1 text-center rounded-full text-sm font-semibold h-fit ${
            order.orderStatus === "Delivered"
              ? "bg-green-200 text-green-800"
              : order.orderStatus === "Shipped"
              ? "bg-yellow-200 text-yellow-800"
              : order.orderStatus === "Processing"
              ? "bg-blue-200 text-blue-800"
              : order.orderStatus === "Pending"
              ? "bg-gray-200 text-gray-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {order.orderStatus}
        </p>

        <p>Created:</p>
        <p>{new Date(order.createDate).toLocaleDateString()}</p>
        <p>Total:</p>
        <p>{order.totalPrice}</p>
        <p>Customer:</p>
        <p>ReceiverName</p>
        <p>Phone:</p>
        <p>{order.receiverPhone}</p>
      </div>
      <div>OrderStatus</div>
      <hr></hr>
      <div>
        <div className="flex">
          <p>from</p>
          <p>Warehouse A</p>
        </div>
        <div className="flex">
          <p>to</p>
          <p> {order.receiverAddress}</p>
        </div>
      </div>
      <hr></hr>

      {/* Order Details Section */}
      <div className="text-sm text-gray-700 ">
        <div className="flex">
          <img
            src={defaultImg}
            alt="Product"
            className="w-16 h-1w-16 object-cover rounded-lg mb-4"
          />
          <p className="mb-2">
            <span className="font-medium">{order.product_name}</span>
          </p>
        </div>
        <p className="mb-2">
          Product Amount:{" "}
          <span className="font-medium">{order.productAmount}</span>
        </p>
        <p className="mb-2">
          COD Status: <span className="font-medium">{order.codStatus}</span>
        </p>
        <p className="mb-2">
          Delivery By: <span className="font-medium">{order.deliver_by}</span>
        </p>
      </div>
      {/* Actions: Edit and Delete */}
      <div className="flex mt-4 space-x-4">
        <button className="text-blue-600 hover:underline" onClick={onClickEdit}>
          Edit
        </button>
        <button
          className="text-red-600 hover:underline"
          onClick={onClickDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
