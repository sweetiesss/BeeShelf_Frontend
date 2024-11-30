// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Avatar, Button } from "antd";

// const Orderdetail = ({ orders }) => {
//   const { orderId } = useParams(); // Get the orderId from the URL
//   const navigate = useNavigate();

//   // Find the order based on orderId
//   const order = orders.find((o) => o.id === orderId);

//   if (!order) {
//     return (
//       <div className="p-6">
//         <h1 className="text-2xl font-bold text-gray-700">Order Not Found</h1>
//         <Button onClick={() => navigate(-1)} className="mt-4">
//           Go Back
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">
//         Order Details: {order.id}
//       </h1>
//       <div className="flex flex-col md:flex-row md:space-x-6">
//         {/* Left Section */}
//         <div className="flex-none">
//           <Avatar
//             shape="square"
//             src={order.image || "default-image.jpg"}
//             size={128}
//             className="mb-6"
//           />
//         </div>

//         {/* Right Section */}
//         <div className="flex-1">
//           <p className="text-lg text-gray-600">
//             <strong>Order Code:</strong> {order.id}
//           </p>
//           <p className="text-lg text-gray-600">
//             <strong>Receiver Address:</strong> {order.receiverAddress}
//           </p>
//           <p className="text-lg text-gray-600">
//             <strong>Total Price:</strong> ${order.totalPrice}
//           </p>
//           <p className="text-lg text-gray-600">
//             <strong>Shipper:</strong> {order.shipper || "Not Assigned"}
//           </p>
//           <p className="text-lg text-gray-600">
//             <strong>Status:</strong> {order.status}
//           </p>
//           <p className="text-lg text-gray-600">
//             <strong>Created At:</strong> {order.createdAt || "N/A"}
//           </p>
//         </div>
//       </div>

//       {/* Back Button */}
//       <div className="mt-6">
//         <Button type="primary" onClick={() => navigate(-1)}>
//           Back to Orders
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Orderdetail;
