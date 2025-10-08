import { getDb, isMockMode, getMockApi } from './supabaseClient';

// PUBLIC_INTERFACE
export const orderService = {
  /** Create a new order */
  async createOrder(order) {
    if (isMockMode()) {
      const api = getMockApi();
      return api.createOrder(order);
    }
    const db = getDb();
    const { data, error } = await db.from('orders').insert(order).select().single();
    if (error) throw error;
    return data;
  },

  /** List orders */
  async listOrders() {
    if (isMockMode()) {
      const api = getMockApi();
      return api.listOrders();
    }
    const db = getDb();
    const { data, error } = await db.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};
