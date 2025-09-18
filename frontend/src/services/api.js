import axios from 'axios';

// Frontend-only mock API layer (no real backend). Replace with real endpoints later.
const api = axios.create();

// In-memory mock data
let vehicles = [
  { id: 1, model: 'EV Sedan', variant: 'Premium', color: 'White', price: 35000 },
  { id: 2, model: 'EV SUV', variant: 'Standard', color: 'Blue', price: 42000 }
];
let orders = [
  { id: 1, code: 'ORD001', customerName: 'Nguyen Van A', vehicleModel: 'EV Sedan', status: 'Pending' }
];
let customers = [
  { id: 1, name: 'Nguyen Van A', phone: '0900000001', email: 'a@example.com' },
  { id: 2, name: 'Tran Thi B', phone: '0900000002', email: 'b@example.com' }
];
let inventory = [
  { id: 1, vehicleModel: 'EV Sedan', dealerName: 'Dealer HN', quantity: 5 },
  { id: 2, vehicleModel: 'EV SUV', dealerName: 'Dealer HCM', quantity: 8 }
];
let dealers = [
  { id: 1, name: 'Dealer HN', region: 'Miền Bắc', target: 100 },
  { id: 2, name: 'Dealer HCM', region: 'Miền Nam', target: 150 }
];

api.interceptors.request.use(config => {
  // Simple routing based on URL
  const { url, method } = config;

  function ok(data) {
    return Promise.resolve({ data, status: 200, statusText: 'OK', headers: {}, config });
  }
  function notFound() { return Promise.resolve({ data: { message: 'Not Found'}, status:404, statusText:'Not Found', headers:{}, config}); }

  if (method === 'get') {
    switch (url) {
      case '/vehicles': return ok(vehicles);
      case '/orders': return ok(orders);
      case '/customers': return ok(customers);
      case '/inventory': return ok(inventory);
      case '/dealers': return ok(dealers);
      case '/reports/sales': return ok({ total: 1000, byDealer: [{ dealer:'Dealer HN', value:400 }, { dealer:'Dealer HCM', value:600 }] });
      case '/reports/inventory': return ok({ items: inventory.length });
      case '/reports/forecast': return ok({ message: 'AI forecast placeholder', demandIndex: 1.2 });
      default: return notFound();
    }
  }
  return config;
});

export default api;
