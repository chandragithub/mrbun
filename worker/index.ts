// Cloudflare Worker for Mr Bun Fast Food
// Target: mrbun.ceansystech.workers.dev
// Database: Cloudflare D1 SQLite (DB)

export interface Env {
  DB: any;
  ASSETS?: any;
  COMPANY_NAME?: string;
  CONTACT_PHONE?: string;
  CONTACT_EMAIL?: string;
  FSSAI_LICENSE?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Health check endpoint
    if (url.pathname === '/api/health') {
      return jsonResponse({
        status: 'online',
        service: 'Mr Bun Fast Food Cloudflare Worker',
        subdomain: 'mrbun.ceansystech.workers.dev',
        fssai: '22926112000173',
        phone: '9476088111',
        email: 'contact@mrbun.in',
        database: 'Cloudflare D1 SQLite (mrbun-db)',
        timestamp: new Date().toISOString()
      });
    }

    // API: Orders
    if (url.pathname === '/api/orders') {
      if (request.method === 'GET') {
        try {
          if (env.DB) {
            const email = url.searchParams.get('email');
            let query = 'SELECT * FROM orders ORDER BY created_at DESC LIMIT 50';
            let stmt = env.DB.prepare(query);
            if (email) {
              query = 'SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC';
              stmt = env.DB.prepare(query).bind(email);
            }
            const { results } = await stmt.all();
            return jsonResponse({ success: true, orders: results });
          }
          return jsonResponse({ success: true, orders: [] });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      if (request.method === 'POST') {
        try {
          const body: any = await request.json();
          const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);

          if (env.DB) {
            await env.DB.prepare(`
              INSERT INTO orders (
                id, user_id, customer_name, customer_email, customer_phone,
                delivery_type, delivery_address, items_json, subtotal, discount,
                tax, delivery_fee, total_amount, payment_method, payment_status,
                order_status, order_notes, fssai_license
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              orderId,
              body.userId || null,
              body.customerName || 'Customer',
              body.customerEmail || 'contact@mrbun.in',
              body.customerPhone || '9476088111',
              body.deliveryType || 'delivery',
              body.deliveryAddress || 'Dine-in / Pickup',
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
            ).run();
          }

          return jsonResponse({
            success: true,
            orderId,
            message: 'Order baked successfully into Mr Bun Cloudflare D1 database',
            fssai: '22926112000173'
          }, 201);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 400);
        }
      }
    }

    // API: Party Orders
    if (url.pathname === '/api/party') {
      if (request.method === 'GET') {
        try {
          if (env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM party_orders ORDER BY created_at DESC').all();
            return jsonResponse({ success: true, partyBookings: results });
          }
          return jsonResponse({ success: true, partyBookings: [] });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      if (request.method === 'POST') {
        try {
          const body: any = await request.json();
          const partyId = 'PARTY-' + Math.floor(100 + Math.random() * 900);

          if (env.DB) {
            await env.DB.prepare(`
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
            ).run();
          }

          return jsonResponse({
            success: true,
            partyId,
            message: 'Party booking received. Mr Bun Catering desk will call you at 9476088111.'
          }, 201);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 400);
        }
      }
    }

    // API: Franchise Application
    if (url.pathname === '/api/franchise' && request.method === 'POST') {
      try {
        const body: any = await request.json();
        const refId = 'FRAN-' + Math.floor(1000 + Math.random() * 9000);

        if (env.DB) {
          await env.DB.prepare(`
            INSERT INTO franchise_applications (
              id, full_name, phone, email, city, state, model_interested,
              investment_budget, has_property, property_area, prior_experience, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            refId,
            body.fullName,
            body.phone,
            body.email || null,
            body.city,
            body.state || null,
            body.modelInterested,
            body.investmentBudget || null,
            body.hasProperty || null,
            body.propertyArea || null,
            body.priorExperience || null,
            'new_inquiry'
          ).run();
        }

        return jsonResponse({
          success: true,
          referenceId: refId,
          message: 'Franchise inquiry submitted. Mr Bun Franchise Head will call you at 9476088111.'
        }, 201);
      } catch (err: any) {
        return jsonResponse({ success: false, error: err.message }, 400);
      }
    }

    // Static Asset Serving via Cloudflare Assets
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404) {
        // SPA Fallback: serve index.html for unknown HTML routes
        return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
      }
      return response;
    }

    return new Response('Mr Bun Fast Food - Cloudflare Worker Online', { status: 200 });
  }
};
