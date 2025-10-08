import { getDb, isMockMode, getMockApi } from './supabaseClient';

// PUBLIC_INTERFACE
export const menuService = {
  /** Fetch menu items from Supabase or mock. */
  async getMenu() {
    if (isMockMode()) {
      const api = getMockApi();
      return api.getMenu();
    }
    const db = getDb();
    const { data, error } = await db.from('menu').select('*').order('id');
    if (error) throw error;
    return data;
  },
};
