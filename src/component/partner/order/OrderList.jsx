import OrderCard from "./OrderCard";

export default function OrderList({ orders, onDeleteOrder, onSelectOrder }) {
  return (
    <div className="p-6 rounded-lg ">
      <h2 className="text-xl font-semibold mb-4">Order List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
