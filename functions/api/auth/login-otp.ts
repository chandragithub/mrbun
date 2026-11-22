// Cloudflare Pages Function: POST /api/auth/login-otp
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
    const { phone, otp, reqId } = await request.json() as any;
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    const cleanOtp = (otp || '').toString().trim();

    if (cleanPhone.length !== 10 || !cleanOtp) {
      return jsonResponse({ success: false, error: 'Valid 10-digit mobile number and OTP code required.' }, 400);
    }

    if (env.DB) {
      await ensureTables(env.DB);
    }

    let currentSettings: any = {};
    if (env.DB) {
      try {
        currentSettings = (await env.DB.prepare('SELECT * FROM store_settings WHERE id = "default" LIMIT 1').first()) || {};
      } catch {}
    }

    const authKey = env.MSG91_AUTH_KEY || currentSettings.msg91_auth_key || '';
    const widgetId = env.MSG91_WIDGET_ID || currentSettings.msg91_widget_id || '3667706d6550343738383031';
    const tokenAuth = env.MSG91_TOKEN_AUTH || currentSettings.msg91_token_auth || '551095TZsDtgzbxo16b016ebaP1';

    let verified = false;

    // 1. Validate with actual MSG91 live OTP verification API
    if (authKey) {
      try {
        const verifyUrl = new URL('https://control.msg91.com/api/v5/otp/verify');
        verifyUrl.searchParams.set('mobile', `91${cleanPhone}`);
        verifyUrl.searchParams.set('otp', cleanOtp);
        verifyUrl.searchParams.set('authkey', authKey);

        const res = await fetch(verifyUrl.toString(), {
          method: 'GET',
          headers: { 'authkey': authKey }
        });
        const data: any = await res.json();
        if (data.type === 'success' || (data.message && data.message.toLowerCase().includes('verified'))) {
          verified = true;
        }
      } catch (e) {
        console.error('MSG91 verify API error:', e);
      }
    }

    // 2. Validate with MSG91 Widget verifyOtp API
    if (!verified && widgetId && tokenAuth) {
      try {
        const verifyWidgetRes = await fetch('https://api.msg91.com/api/v5/widget/verifyOtp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            widgetId,
            tokenAuth,
            identifier: `91${cleanPhone}`,
            otp: cleanOtp,
            ...(reqId ? { reqId } : {})
          })
        });
        const widgetData: any = await verifyWidgetRes.json();
        if (widgetData?.type === 'success' || (widgetData?.message && widgetData.message.toLowerCase().includes('verified'))) {
          verified = true;
        }
      } catch (e) {
        console.error('MSG91 Widget verify error:', e);
      }
    }

    // 3. Database verification (custom OTP dispatched and stored in D1)
    if (!verified && env.DB) {
      try {
        const record: any = await env.DB.prepare(`
          SELECT * FROM otp_verifications 
          WHERE phone = ? AND otp = ? AND expires_at > ?
          ORDER BY created_at DESC LIMIT 1
        `).bind(cleanPhone, cleanOtp, Date.now()).first();

        if (record) {
          verified = true;
        }
      } catch (dbErr) {
        console.error('D1 OTP verification error:', dbErr);
      }
    }

    // 4. Demo fallback - ONLY on localhost / local development
    if (!verified && isLocalhost && cleanOtp === '1234') {
      verified = true;
    }

    if (!verified) {
      return jsonResponse({ success: false, error: 'Invalid or expired OTP code. Please enter the correct SMS code.' }, 400);
    }

    // Find or create customer
    let user: any = null;
    if (env.DB) {
      try {
        user = await env.DB.prepare('SELECT * FROM users WHERE phone = ? LIMIT 1').bind(cleanPhone).first();
      } catch {}
    }

    if (!user) {
      const userId = 'usr-' + Date.now();
      const autoName = `Customer ${cleanPhone.slice(-4)}`;
      const autoEmail = `${cleanPhone}@mrbun.in`;
      if (env.DB) {
        try {
          await env.DB.prepare(`
            INSERT INTO users (id, name, email, phone, password_hash, address, role)
            VALUES (?, ?, ?, ?, 'otp_user', '', 'customer')
          `).bind(userId, autoName, autoEmail, cleanPhone).run();
        } catch {}
      }
      user = {
        id: userId,
        name: autoName,
        email: autoEmail,
        phone: cleanPhone,
        address: '',
        role: 'customer'
      };
    }

    return jsonResponse({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || cleanPhone,
        address: user.address || '',
        avatarUrl: user.avatar_url || '',
        role: user.role || 'customer'
      }
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
};
