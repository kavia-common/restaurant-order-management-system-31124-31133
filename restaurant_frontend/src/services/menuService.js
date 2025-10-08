import { getDb, isMockMode, getMockApi } from './supabaseClient';

/**
 * Data normalization
 * - We normalize both Supabase rows and mock items to a unified camelCase shape the UI expects.
 * - image_url (snake_case) from DB/view is mapped to imageUrl (camelCase).
 * - We also ensure category and isFeatured fields are present.
 */

// PUBLIC_INTERFACE
export const menuService = {
  /** Fetch menu items from Supabase or mock. */
  async getMenu() {
    if (isMockMode()) {
      const api = getMockApi();
      const items = await api.getMenu();
      // Normalize mock to common shape
      return (items || []).map((it) => ({
        id: it.id,
        name: it.name,
        description: it.description,
        price: it.price,
        category: (it.category || '').trim(),
        imageUrl: it.imageUrl || it.image_url || null,
        isFeatured:
          typeof it.isFeatured === 'boolean'
            ? it.isFeatured
            : typeof it.is_featured === 'boolean'
            ? it.is_featured
            : false,
        created_at: it.created_at,
      }));
    }

    const db = getDb();
    // Explicitly select fields including image_url to guard against view/table changes
    const { data, error } = await db
      .from('menu')
      // Select snake_case fields from the underlying table/view
      // and map to camelCase in JS only.
      .select('id,name,description,price,category,image_url,is_featured,created_at')
      .order('id');
    if (error) throw error;

    // Map snake_case DB fields to camelCase shape for UI
    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      category: (row.category || '').trim(),
      imageUrl: row.image_url ?? null,
      isFeatured: typeof row.is_featured === 'boolean' ? row.is_featured : false,
      createdAt: row.created_at,
    }));
  },
};
