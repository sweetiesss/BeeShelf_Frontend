import React from 'react';

export default function Insights({ inventories, requests, orders }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold">Total Inventories</h3>
        <p className="text-3xl">{inventories.length}</p>
      </div>
      <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold">Total Products</h3>
        {/* <p className="text-3xl">{inventories.reduce((acc, inv) => acc + inv.products.length, 0)}</p> */}
      </div>
      <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold">Pending Requests</h3>
        {/* <p className="text-3xl">{requests.filter(r => r.status === 'Pending').length}</p> */}
      </div>
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold">Completed Orders</h3>
        {/* <p className="text-3xl">{orders.filter(o => o.status === 'Completed').length}</p> */}
      </div>
    </div>
  );
}
