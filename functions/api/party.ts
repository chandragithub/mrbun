// Cloudflare Pages Function for Party & Bulk Catering API (Cloudflare D1 SQLite)

interface Env {
  DB?: any;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  if (env.DB) {
    try {
      const { results } = await env.DB.prepare('SELECT * FROM party_orders ORDER BY created_at DESC').all();
      return new Response(JSON.stringify({ success: true, partyBookings: results }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ success: false, error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ success: true, partyBookings: [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    const body: any = await request.json();
    const partyId = 'PARTY-' + Math.floor(100 + Math.random() * 900);

    if (env.DB) {
      const stmt = env.DB.prepare(`
        INSERT INTO party_orders (
          id, user_id, full_name, phone, email, event_type, guest_count,
          event_date, event_time, venue_address, package_selected,
          customized_items_json, budget_estimate, special_notes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        partyId,
        body.userId || null,
        body.fullName,
        body.phone,
        body.email,
        body.eventType,
        body.guestCount,
        body.eventDate,
        body.eventTime,
        body.venueAddress,
        body.packageName || null,
        JSON.stringify(body.customizedItems || []),
        body.budgetEstimate || 0,
        body.specialNotes || '',
        'inquiry_received'
      );

      await stmt.run();
    }

    return new Response(
      JSON.stringify({
        success: true,
        partyId,
        message: 'Party booking received. Mr Bun Catering desk will call you at 9476088111.'
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
