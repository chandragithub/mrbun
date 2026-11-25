// Cloudflare Pages Function: POST /api/auth/send-otp
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
    const rawPhone = body.phone || '';
    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);

    if (cleanPhone.length !== 10) {
      return jsonResponse({ success: false, error: 'Please enter a valid 10-digit Indian mobile number.' }, 400);
    }

    if (env.DB) {
      await ensureTables(env.DB);
    }

    // Fetch dynamic MSG91 credentials from Store Settings
    let currentSettings: any = {};
    if (env.DB) {
      try {
        currentSettings = (await env.DB.prepare('SELECT * FROM store_settings WHERE id = "default" LIMIT 1').first()) || {};
      } catch {}
    }

    const authKey = env.MSG91_AUTH_KEY || currentSettings.msg91_auth_key || '';
    const templateId = env.MSG91_TEMPLATE_ID || currentSettings.msg91_template_id || '';
    const widgetId = env.MSG91_WIDGET_ID || currentSettings.msg91_widget_id || '';
    const tokenAuth = env.MSG91_TOKEN_AUTH || currentSettings.msg91_token_auth || '';

    // Generate 4-digit OTP code & 10-minute expiry
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const otpId = `otp-${Date.now()}`;

    // Record OTP in Cloudflare D1
    if (env.DB) {
      try {
        await env.DB.prepare(`
          INSERT INTO otp_verifications (id, phone, otp, expires_at, verified)
          VALUES (?, ?, ?, ?, 0)
        `).bind(otpId, cleanPhone, otp, expiresAt).run();
      } catch (dbErr) {
        console.error('Error recording OTP in D1:', dbErr);
      }
    }

    let sentViaMsg91 = false;
    let msg91Response: any = null;

    // 1. Direct MSG91 v5 OTP API (Priority if authKey is configured)
    if (authKey) {
      try {
        const msg91Url = new URL('https://control.msg91.com/api/v5/otp');
        msg91Url.searchParams.set('mobile', `91${cleanPhone}`);
        msg91Url.searchParams.set('authkey', authKey);
        msg91Url.searchParams.set('otp', otp);
        msg91Url.searchParams.set('otp_expiry', '10');
        if (templateId) {
          msg91Url.searchParams.set('template_id', templateId);
        }

        const res = await fetch(msg91Url.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authkey': authKey
          }
        });
        msg91Response = await res.json();
        if (msg91Response?.type === 'success' || msg91Response?.message?.toLowerCase?.()?.includes?.('success')) {
          sentViaMsg91 = true;
        }
      } catch (e: any) {
        console.error('MSG91 direct API error:', e);
      }
    }

    // 2. MSG91 Widget sendOtp API (Fallback or if widget configured)
    if (!sentViaMsg91 && widgetId && tokenAuth) {
      try {
        const widgetRes = await fetch('https://api.msg91.com/api/v5/widget/sendOtp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            widgetId,
            tokenAuth,
            identifier: `91${cleanPhone}`
          })
        });
        msg91Response = await widgetRes.json();
        if (msg91Response?.type === 'success' || msg91Response?.message?.toLowerCase?.()?.includes?.('success')) {
          sentViaMsg91 = true;
        }
      } catch (e: any) {
        console.error('MSG91 widget send error:', e);
      }
    }

    // Production Response: Validate with actual API
    if (sentViaMsg91) {
      return jsonResponse({
        success: true,
        message: `OTP sent to +91 ${cleanPhone} via MSG91 SMS.`,
        phone: cleanPhone,
        sentViaMsg91: true,
        devOtp: isLocalhost ? otp : undefined
      });
    }

    // In Production: If MSG91 failed, return exact MSG91 feedback
    if (!isLocalhost) {
      const errorMsg = msg91Response?.message || (
        !authKey && !widgetId
          ? 'MSG91 credentials not configured. Please enter your MSG91 Auth Key & Template ID in Admin Portal -> Store Settings.'
          : 'Failed to send SMS via MSG91. Please verify MSG91 balance, Auth Key, or Template ID.'
      );
      return jsonResponse({
        success: false,
        error: errorMsg,
        msg91Details: msg91Response
      }, 400);
    }

    // Local Development Fallback: allow testing without live SMS
    return jsonResponse({
      success: true,
      message: `[DEV MODE] OTP generated for +91 ${cleanPhone}.`,
      phone: cleanPhone,
      devOtp: otp,
      sentViaMsg91: false,
      isDevMode: true
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
};
