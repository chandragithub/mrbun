// Cloudflare Pages Function for Settings API
interface Env {
  DB?: any;
}

const DEFAULT_SETTINGS = {
  brandName: 'Mr Bun',
  tagline: 'Pizzas • Burgers • Mocktails',
  logoUrl: '/logo.png',
  phone: '9476088111',
  email: 'contact@mrbun.in',
  fssaiLicense: '22926112000173',
  paymentOptions: {
    cashEnabled: true,
    cashPolicyNotice: 'Cash payment is accepted strictly BEFORE food preparation begins in kitchen.',
    upiEnabled: true,
    upiId: 'mrbun@upi',
    upiName: 'Mr Bun Fast Food Central',
    cardEnabled: true,
    cardGateway: 'cashfree',
    cashfreeAppId: 'CF_LIVE_MRBUN_2026',
    isTestMode: false
  }
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  if (env.DB) {
    try {
      const row: any = await env.DB.prepare('SELECT * FROM store_settings WHERE id = "default" LIMIT 1').first();
      if (row) {
        return new Response(JSON.stringify({
          success: true,
          settings: {
            brandName: row.brand_name,
            tagline: row.tagline,
            logoUrl: row.logo_url,
            phone: row.phone,
            email: row.email,
            fssaiLicense: row.fssai_license,
            paymentOptions: JSON.parse(row.payment_options_json || '{}')
          }
        }), { headers: { 'Content-Type': 'application/json' } });
      }
    } catch (e: any) {
      console.error(e);
    }
  }
  return new Response(JSON.stringify({ success: true, settings: DEFAULT_SETTINGS }), {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  try {
    const body: any = await request.json();
    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO store_settings (id, brand_name, tagline, logo_url, phone, email, fssai_license, payment_options_json, updated_at)
        VALUES ('default', ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          brand_name = excluded.brand_name,
          tagline = excluded.tagline,
          logo_url = excluded.logo_url,
          phone = excluded.phone,
          email = excluded.email,
          fssai_license = excluded.fssai_license,
          payment_options_json = excluded.payment_options_json,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        body.brandName || DEFAULT_SETTINGS.brandName,
        body.tagline || DEFAULT_SETTINGS.tagline,
        body.logoUrl || DEFAULT_SETTINGS.logoUrl,
        body.phone || DEFAULT_SETTINGS.phone,
        body.email || DEFAULT_SETTINGS.email,
        body.fssaiLicense || DEFAULT_SETTINGS.fssaiLicense,
        JSON.stringify(body.paymentOptions || DEFAULT_SETTINGS.paymentOptions)
      ).run();
    }

    return new Response(JSON.stringify({ success: true, settings: body }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
