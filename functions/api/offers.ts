// Cloudflare Pages Function for Offers API
interface Env {
  DB?: any;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  if (env.DB) {
    try {
      const { results } = await env.DB.prepare('SELECT * FROM offers ORDER BY created_at DESC').all();
      const mapped = (results || []).map((r: any) => ({
        id: r.id,
        code: r.code,
        title: r.title,
        description: r.description,
        discountType: r.discount_type,
        discountValue: r.discount_value,
        minOrderAmount: r.min_order_amount,
        maxDiscount: r.max_discount,
        isActive: r.is_active === 1
      }));
      return new Response(JSON.stringify({ success: true, offers: mapped }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ success: false, error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  return new Response(JSON.stringify({ success: true, offers: [] }), {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  try {
    const o: any = await request.json();
    const offerId = o.id || `off-${Date.now()}`;
    const code = (o.code || '').trim().toUpperCase();

    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO offers (
          id, code, title, description, discount_type, discount_value,
          min_order_amount, max_discount, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          code = excluded.code,
          title = excluded.title,
          description = excluded.description,
          discount_type = excluded.discount_type,
          discount_value = excluded.discount_value,
          min_order_amount = excluded.min_order_amount,
          max_discount = excluded.max_discount,
          is_active = excluded.is_active
      `).bind(
        offerId,
        code,
        o.title || '',
        o.description || '',
        o.discountType || 'percentage',
        o.discountValue || 0,
        o.minOrderAmount || 0,
        o.maxDiscount || null,
        o.isActive ? 1 : 0
      ).run();
    }

    return new Response(JSON.stringify({ success: true, offer: { ...o, id: offerId, code } }), {
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
