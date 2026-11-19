// Cloudflare Pages Function for Products API
// Connected to Cloudflare D1 SQLite database binding `DB`

interface Env {
  DB?: any;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  const url = new URL(request.url);
  const category = url.searchParams.get('category');

  // If D1 binding is configured
  if (env.DB) {
    try {
      let query = 'SELECT * FROM products';
      let stmt;
      if (category && category !== 'all') {
        query += ' WHERE category = ?';
        stmt = env.DB.prepare(query).bind(category);
      } else {
        stmt = env.DB.prepare(query);
      }
      const { results } = await stmt.all();
      return new Response(JSON.stringify({ success: true, data: results }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ success: false, error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Fallback response for local dev / unconfigured D1
  return new Response(
    JSON.stringify({ 
      success: true, 
      source: 'cloudflare-worker-edge', 
      message: 'Cloudflare D1 is ready. Run wrangler d1 execute to load tables.' 
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
