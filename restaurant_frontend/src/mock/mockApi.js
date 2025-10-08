import { mockMenu } from './mockData';

let orders = [];
let idCounter = 1000;

function sleep(ms) { return new Promise((res) => setTimeout(res, ms)); }

// PUBLIC_INTERFACE
export const mockApi = {
  /** Get menu items (mock) */
  async getMenu() {
    await sleep(300);
    return mockMenu;
  },

  /** Create order (mock) */
  async createOrder(order) {
    await sleep(400);
    const newOrder = {
      ...order,
      id: idCounter++,
      created_at: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    return newOrder;
  },

  /** List orders (mock) */
  async listOrders() {
    await sleep(250);
    return orders;
  }
};
