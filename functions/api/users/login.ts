// Cloudflare Pages Function: /api/users/login (POST)
import { ensureTables } from '../../ensureDb';

interface Env {
  DB?: any;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    const body: any = await request.json();
    const rawIdentifier = (body.identifier || body.email || body.phone || '').trim();
    const password = body.password || '';
    const normalized = rawIdentifier.toLowerCase();
    const cleanPhone = rawIdentifier.replace(/\D/g, '').slice(-10);

    if (env.DB) {
      await ensureTables(env.DB);
      const user: any = await env.DB.prepare(`
        SELECT * FROM users 
        WHERE LOWER(email) = ? OR (phone != '' AND phone = ?) OR (phone != '' AND phone = ?)
        LIMIT 1
      `).bind(normalized, rawIdentifier, cleanPhone).first();

      if (user && user.password_hash === password) {
        return jsonResponse({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '9476088111',
            address: user.address || '',
            avatarUrl: user.avatar_url || '',
            role: user.role
          }
        });
      }
    }

    // Master Admin fallback authentication
    if ((normalized === 'admin@mrbun.in' || cleanPhone === '9476088111') && password === 'admin123') {
      return jsonResponse({
        success: true,
        user: {
          id: 'usr-admin',
          name: 'Mr Bun Master Admin',
          email: 'admin@mrbun.in',
          phone: '9476088111',
          avatarUrl: '/logo.png',
          role: 'admin',
          assignedOutlet: 'All Outlets',
          status: 'active'
        }
      });
    }

    return jsonResponse({ success: false, error: 'Invalid mobile number/email or password.' }, 401);
  } catch (err: any) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
};
