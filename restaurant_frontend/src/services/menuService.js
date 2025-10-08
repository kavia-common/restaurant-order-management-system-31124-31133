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
      .select('id,name,description,price,category,image_url,imageUrl,is_featured,isFeatured,created_at')
      .order('id');
    if (error) throw error;

    // Map either view alias (imageUrl) or base column (image_url) to imageUrl
    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      category: (row.category || '').trim(),
      imageUrl: row.imageUrl ?? row.image_url ?? null,
      isFeatured:
        typeof row.isFeatured === 'boolean'
          ? row.isFeatured
          : typeof row.is_featured === 'boolean'
          ? row.is_featured
          : false,
      created_at: row.created_at,
    }));
  },
};
