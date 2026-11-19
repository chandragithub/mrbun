// Cloudflare Pages Function for Orders API (Cloudflare D1 SQLite)

interface Env {
  DB?: any;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (env.DB) {
    try {
      let query = 'SELECT * FROM orders ORDER BY created_at DESC';
      let stmt = env.DB.prepare(query);
      if (email) {
        query = 'SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC';
        stmt = env.DB.prepare(query).bind(email);
      }
      const { results } = await stmt.all();
      return new Response(JSON.stringify({ success: true, orders: results }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ success: false, error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ success: true, orders: [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    const body: any = await request.json();
    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);

    if (env.DB) {
      const stmt = env.DB.prepare(`
        INSERT INTO orders (
          id, user_id, customer_name, customer_email, customer_phone,
          delivery_type, delivery_address, items_json, subtotal, discount,
          tax, delivery_fee, total_amount, payment_method, payment_status,
          order_status, order_notes, fssai_license
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        orderId,
        body.userId || null,
        body.customerName,
        body.customerEmail,
        body.customerPhone,
        body.deliveryType || 'delivery',
        body.deliveryAddress,
        JSON.stringify(body.items || []),
        body.subtotal || 0,
        body.discount || 0,
        body.tax || 0,
        body.deliveryFee || 0,
        body.totalAmount || 0,
        body.paymentMethod || 'cod',
        body.paymentStatus || 'pending',
        'received',
        body.orderNotes || '',
        '22926112000173'
      );

      await stmt.run();
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        message: 'Order created successfully on Cloudflare D1',
        fssai: '22926112000173'
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 201
      }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
