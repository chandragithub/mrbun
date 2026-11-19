// Cloudflare Pages Function for Outlets API
interface Env {
  DB?: any;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  if (env.DB) {
    try {
      const { results } = await env.DB.prepare('SELECT * FROM outlets ORDER BY is_flagship DESC, created_at ASC').all();
      const mapped = (results || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        address: r.address,
        landmark: r.landmark || '',
        phone: r.phone,
        timings: r.timings,
        status: r.status,
        image: r.image,
        features: r.features_json ? JSON.parse(r.features_json) : [],
        seatingCapacity: r.seating_capacity,
        isFlagship: r.is_flagship === 1
      }));
      return new Response(JSON.stringify({ success: true, outlets: mapped }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ success: false, error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  return new Response(JSON.stringify({ success: true, outlets: [] }), {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  try {
    const o: any = await request.json();
    const outletId = o.id || `outlet-${Date.now()}`;
    const featuresJson = JSON.stringify(Array.isArray(o.features) ? o.features : []);

    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO outlets (
          id, name, type, address, landmark, phone, timings,
          status, image, features_json, seating_capacity, is_flagship
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          type = excluded.type,
          address = excluded.address,
          landmark = excluded.landmark,
          phone = excluded.phone,
          timings = excluded.timings,
          status = excluded.status,
          image = excluded.image,
          features_json = excluded.features_json,
          seating_capacity = excluded.seating_capacity,
          is_flagship = excluded.is_flagship
      `).bind(
        outletId,
        o.name,
        o.type,
        o.address,
        o.landmark || '',
        o.phone || '9476088111',
        o.timings || '11:00 AM – 11:00 PM',
        o.status || 'Open Now',
        o.image || '/logo.png',
        featuresJson,
        o.seatingCapacity || '',
        o.isFlagship ? 1 : 0
      ).run();
    }

    return new Response(JSON.stringify({ success: true, outlet: { ...o, id: outletId } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
