// Mock API calls for orders (you can replace these with real API calls)
const mockOrders = [
    { id: 1, customerName: 'John Doe', totalPrice: 100, status: 'Pending' },
    { id: 2, customerName: 'Jane Smith', totalPrice: 200, status: 'Shipped' },
  ];
  
  export const fetchOrders = async () => {
    // Simulate fetching data from API
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockOrders), 500);
    });
  };
  
  export const addOrder = async (order) => {
    const newOrder = { ...order, id: mockOrders.length + 1 };
    mockOrders.push(newOrder);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newOrder), 500);
    });
  };
  
  export const updateOrder = async (order) => {
    const index = mockOrders.findIndex((o) => o.id === order.id);
    mockOrders[index] = order;
    return new Promise((resolve) => {
      setTimeout(() => resolve(order), 500);
    });
  };
  
  export const deleteOrder = async (orderId) => {
    const index = mockOrders.findIndex((o) => o.id === orderId);
    mockOrders.splice(index, 1);
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  };
  