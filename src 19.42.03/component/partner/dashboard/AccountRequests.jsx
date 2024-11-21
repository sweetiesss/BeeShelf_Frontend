import React from 'react';

export default function AccountRequests({ requests }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Account Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request.id} className="mb-4">
            <p className="text-lg">{request.partnerName}</p>
            <p className="text-sm text-gray-600">Status: {request.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
