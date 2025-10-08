import { getDb, isMockMode, getMockApi } from './supabaseClient';

/**
 * Shape note:
 * Supabase view public.menu exposes:
 *  - id, name, description, price, category, imageUrl (camelCase), isFeatured
 * Mock data will mirror that shape to avoid UI conditionals.
 */

// PUBLIC_INTERFACE
export const menuService = {
  /** Fetch menu items from Supabase or mock. */
  async getMenu() {
    if (isMockMode()) {
      const api = getMockApi();
      const items = await api.getMenu();
      // Ensure fields exist even if undefined in mock entries
      return items.map((it) => ({
        id: it.id,
        name: it.name,
        description: it.description,
        price: it.price,
        category: it.category || '',
        imageUrl: it.imageUrl || it.image_url || null,
        isFeatured: typeof it.isFeatured === 'boolean' ? it.isFeatured : !!it.is_featured,
      }));
    }
    const db = getDb();
    const { data, error } = await db.from('menu').select('*').order('id');
    if (error) throw error;
    // Data already matches { imageUrl, category } from the view
    return data;
  },
};
