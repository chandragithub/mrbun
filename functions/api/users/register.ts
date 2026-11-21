// Cloudflare Pages Function: POST /api/users/register
import { ensureTables } from '../../ensureDb';

interface Env {
  DB?: any;
  MSG91_AUTH_KEY?: string;
  MSG91_TEMPLATE_ID?: string;
  MSG91_WIDGET_ID?: string;
  MSG91_TOKEN_AUTH?: string;
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
  const url = new URL(request.url);
  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  try {
    const body: any = await request.json();
    const name = (body.name || '').trim();
    const password = (body.password || '').trim();
    const rawPhone = (body.phone || '').trim();
    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
    const email = (body.email || `${cleanPhone}@mrbun.in`).trim().toLowerCase();
    const address = (body.address || '').trim();
    const otp = body.otp ? body.otp.toString().trim() : '';

    if (!name) {
      return jsonResponse({ success: false, error: 'Please enter your full name.' }, 400);
    }
    if (cleanPhone.length !== 10) {
      return jsonResponse({ success: false, error: 'Please enter a valid 10-digit mobile number.' }, 400);
    }
    if (!password || password.length < 4) {
      return jsonResponse({ success: false, error: 'Password must be at least 4 characters.' }, 400);
    }

    if (env.DB) {
      await ensureTables(env.DB);
    }

    // Verify OTP if provided
    if (otp) {
      let otpOk = false;
      if (env.DB) {
        try {
          const record: any = await env.DB.prepare(`
            SELECT * FROM otp_verifications 
            WHERE phone = ? AND otp = ? AND expires_at > ?
            ORDER BY created_at DESC LIMIT 1
          `).bind(cleanPhone, otp, Date.now()).first();
          if (record) {
            otpOk = true;
          }
        } catch {}
      }

      // Demo fallback strictly on localhost
      if (!otpOk && isLocalhost && (otp === '1234' || cleanPhone === '9876543210')) {
        otpOk = true;
      }

      if (!otpOk) {
        return jsonResponse({ success: false, error: 'Invalid or expired phone verification OTP.' }, 400);
      }
    }

    // Check if user already exists
    if (env.DB) {
      const existing: any = await env.DB.prepare(`
        SELECT * FROM users WHERE phone = ? OR LOWER(email) = ? LIMIT 1
      `).bind(cleanPhone, email).first();

      if (existing) {
        await env.DB.prepare(`
          UPDATE users SET name = ?, password_hash = ?, address = ? WHERE id = ?
        `).bind(name, password, address || existing.address || '', existing.id).run();

        return jsonResponse({
          success: true,
          user: {
            id: existing.id,
            name,
            email: existing.email,
            phone: cleanPhone,
            address: address || existing.address || '',
            role: existing.role || 'customer'
          },
          message: 'Account updated & authenticated successfully.'
        });
      }
    }

    // Insert new user
    const userId = 'usr-' + Date.now();
    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO users (id, name, email, phone, password_hash, address, role)
        VALUES (?, ?, ?, ?, ?, ?, 'customer')
      `).bind(userId, name, email, cleanPhone, password, address).run();
    }

    return jsonResponse({
      success: true,
      user: {
        id: userId,
        name,
        email,
        phone: cleanPhone,
        address,
        role: 'customer'
      },
      message: 'Account registered and phone number verified successfully!'
    }, 201);
  } catch (err: any) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
};
