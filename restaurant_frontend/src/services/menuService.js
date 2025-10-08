import { getDb, isMockMode, getMockApi } from './supabaseClient';

// Best-effort detection of Supabase storage path vs. public URL
function isLikelyStoragePath(s) {
  if (!s || typeof s !== 'string') return false;
  const v = s.trim();
  if (!v) return false;
  // Cases:
  // - bucket/path/to/file.jpg
  // - public/<bucket>/<path> (console-style pieces)
  // - URLs that include /storage/v1/object/authenticated or missing /public/
  const looksLikePath = /^[^/:]+\/.+\.[a-z0-9]+$/i.test(v); // bucket/something.ext
  const isConsoleUrl = /supabase\.co\/storage\/v1\/object\/(auth|signed|public)\//.test(v);
  // direct public URL already fine
  const isHttp = /^https?:\/\//i.test(v);
  // If it's http and has .../object/public/... we'll treat as already usable
  if (isHttp && /\/storage\/v1\/object\/public\//.test(v)) return false;
  // If it's http but not clearly public, we may still want to transform using getPublicUrl where possible
  if (isHttp && !/\/storage\/v1\/object\/(public|signed)\//.test(v)) return true;
  return looksLikePath || isConsoleUrl;
}

// Try to transform any DB-provided value into a browser-usable URL.
// - If already an https external URL, return as-is.
// - If looks like a Supabase storage path or a non-public console URL, build a public or signed URL.
async function toRenderableImageUrl(db, rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const val = rawUrl.trim();
  if (!val) return null;

  // If clearly a public URL (https and not a Supabase storage console path requiring auth), return as-is
  if (/^https?:\/\//i.test(val) && !/\/storage\/v1\/object\/(auth|authenticated)\//.test(val)) {
    return val.replace(/^http:\/\//i, 'https://'); // avoid mixed content
  }

  // Attempt to parse storage bucket and path
  // Supported inputs:
  // - "<bucket>/<path/to/file.jpg>"
  // - "https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<path>"
  // - "https://<ref>.supabase.co/storage/v1/object/authenticated/<bucket>/<path>"
  let bucket = null;
  let objectPath = null;

  if (/^https?:\/\//i.test(val)) {
    const m = val.match(/\/storage\/v1\/object\/(public|authenticated|sign|signed)\/([^/]+)\/(.+)$/i);
    if (m) {
      bucket = m[2];
      objectPath = m[3];
    }
  } else if (/^[^/:]+\/.+/.test(val)) {
    const idx = val.indexOf('/');
    bucket = val.slice(0, idx);
    objectPath = val.slice(idx + 1);
  }

  if (bucket && objectPath && db?.storage) {
    try {
      // First try public URL
      const { data: pub } = db.storage.from(bucket).getPublicUrl(objectPath);
      if (pub?.publicUrl) {
        // eslint-disable-next-line no-console
        console.debug('[menuService] Transformed storage path to public URL:', { bucket, objectPath, publicUrl: pub.publicUrl });
        return pub.publicUrl.replace(/^http:\/\//i, 'https://');
      }

      // If no public URL (likely private bucket), generate a signed URL
      const { data: signedData, error: signedErr } = await db
        .storage
        .from(bucket)
        .createSignedUrl(objectPath, 60 * 60); // 1 hour
      if (signedErr) {
        // eslint-disable-next-line no-console
        console.warn('[menuService] Failed to create signed URL for image', { bucket, objectPath, error: signedErr.message });
      }
      if (signedData?.signedUrl) {
        // eslint-disable-next-line no-console
        console.debug('[menuService] Generated signed URL for private object:', { bucket, objectPath });
        return signedData.signedUrl.replace(/^http:\/\//i, 'https://');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[menuService] Error deriving image URL from storage path', { bucket, objectPath, error: e.message });
    }
  }

  // As a last resort, return original (caller will handle fallback in UI)
  return val.replace(/^http:\/\//i, 'https://');
}

/**
 * Data normalization
 * - We normalize both Supabase rows and mock items to a unified camelCase shape the UI expects.
 * - image_url (snake_case) from DB/view is mapped to imageUrl (camelCase) and transformed to a browser-usable URL when needed.
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

    // Map snake_case DB fields to camelCase shape for UI and normalize image URL
    const mapped = await Promise.all(
      (data || []).map(async (row) => {
        const raw = row.image_url ?? null;
        let finalUrl = raw;
        try {
          if (raw && isLikelyStoragePath(raw)) {
            finalUrl = await toRenderableImageUrl(db, raw);
            if (!finalUrl) {
              // eslint-disable-next-line no-console
              console.warn('[menuService] Could not resolve image URL from storage path. Falling back.', {
                id: row.id,
                name: row.name,
                raw,
              });
            } else if (finalUrl !== raw) {
              // eslint-disable-next-line no-console
              console.debug('[menuService] Normalized image URL from DB value:', {
                id: row.id,
                name: row.name,
                from: raw,
                to: finalUrl,
              });
            }
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('[menuService] Error while normalizing image URL', { id: row.id, name: row.name, error: e.message });
        }

        return {
          id: row.id,
          name: row.name,
          description: row.description,
          price: row.price,
          category: (row.category || '').trim(),
          imageUrl: finalUrl ?? null,
          isFeatured: typeof row.is_featured === 'boolean' ? row.is_featured : false,
          createdAt: row.created_at,
        };
      })
    );

    return mapped;
  },
};
