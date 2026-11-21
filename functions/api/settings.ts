// Cloudflare Pages Function for Settings API
interface Env {
  DB?: any;
  MSG91_AUTH_KEY?: string;
  MSG91_TEMPLATE_ID?: string;
}

const DEFAULT_SETTINGS = {
  brandName: 'Mr Bun',
  tagline: 'Pizzas • Burgers • Mocktails',
  logoUrl: '/logo.png',
  phone: '9476088111',
  email: 'contact@mrbun.in',
  address: 'Mr Bun Central Kitchen & Food Hub, Commercial Avenue, Sector 4',
  aboutStory: 'With his dapper bowler hat, signature mustache, dashing red bow-tie, and enthusiastic thumbs-up, Mr Bun is the embodiment of fast food perfection. Coming straight out of a warm pizza box holding a fresh slice of cheese burst pizza, he reminds us that great food should always be fun, generous, and served with a wink! Whether it\'s a quick midnight craving or a 100-guest birthday bash, Mr Bun brings the party to your table with steaming hot patties, freshly toasted sesame buns, and handcrafted dips.',
  aboutHeroTitle: 'Crafting Happiness in Every Bite & Sip',
  aboutHeroDescription: 'Born from a deep obsession with buttery brioche buns, molten cheese burst crusts, and ice-cold artisan mocktails, Mr Bun is on a mission to elevate fast food into a culinary celebration.',
  fssaiLicense: '22926112000173',
  msg91AuthKey: '',
  msg91TemplateId: '',
  msg91WidgetId: '3667706d6550343738383031',
  msg91TokenAuth: '551095TZsDtgzbxo16b016ebaP1',
  paymentOptions: {
    cashEnabled: true,
    cashPolicyNotice: 'Cash payment is accepted strictly BEFORE food preparation begins in kitchen.',
    upiEnabled: true,
    upiId: 'mrbun@upi',
    upiName: 'Mr Bun Fast Food Central',
    cardEnabled: true,
    cardGateway: 'cashfree',
    cashfreeAppId: '',
    cashfreeSecretKey: '',
    isTestMode: false
  }
};

async function ensureSettingsTable(db: any) {
  if (!db) return;
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS store_settings (
        id TEXT PRIMARY KEY,
        brand_name TEXT NOT NULL,
        tagline TEXT NOT NULL,
        logo_url TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        address TEXT,
        about_story TEXT,
        about_hero_title TEXT,
        about_hero_description TEXT,
        fssai_license TEXT NOT NULL,
        msg91_auth_key TEXT,
        msg91_template_id TEXT,
        payment_options_json TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN address TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN about_story TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN about_hero_title TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN about_hero_description TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN msg91_auth_key TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN msg91_template_id TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN msg91_widget_id TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN msg91_token_auth TEXT;'); } catch {}
  } catch (e) {
    console.warn('ensureSettingsTable notice:', e);
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  if (env.DB) {
    try {
      await ensureSettingsTable(env.DB);
      const row: any = await env.DB.prepare('SELECT * FROM store_settings WHERE id = "default" LIMIT 1').first();
      if (row) {
        return new Response(JSON.stringify({
          success: true,
          settings: {
            brandName: row.brand_name || DEFAULT_SETTINGS.brandName,
            tagline: row.tagline || DEFAULT_SETTINGS.tagline,
            logoUrl: row.logo_url || DEFAULT_SETTINGS.logoUrl,
            phone: row.phone || DEFAULT_SETTINGS.phone,
            email: row.email || DEFAULT_SETTINGS.email,
            address: row.address || DEFAULT_SETTINGS.address,
            aboutStory: row.about_story || DEFAULT_SETTINGS.aboutStory,
            aboutHeroTitle: row.about_hero_title || DEFAULT_SETTINGS.aboutHeroTitle,
            aboutHeroDescription: row.about_hero_description || DEFAULT_SETTINGS.aboutHeroDescription,
            fssaiLicense: row.fssai_license || DEFAULT_SETTINGS.fssaiLicense,
            msg91AuthKey: row.msg91_auth_key || env.MSG91_AUTH_KEY || '',
            msg91TemplateId: row.msg91_template_id || env.MSG91_TEMPLATE_ID || '',
            msg91WidgetId: row.msg91_widget_id || DEFAULT_SETTINGS.msg91WidgetId || '',
            msg91TokenAuth: row.msg91_token_auth || DEFAULT_SETTINGS.msg91TokenAuth || '',
            paymentOptions: JSON.parse(row.payment_options_json || '{}')
          }
        }), { headers: { 'Content-Type': 'application/json' } });
      }
    } catch (e: any) {
      console.error('Error fetching settings from D1 in Pages Function:', e);
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
      await ensureSettingsTable(env.DB);
      const current: any = (await env.DB.prepare('SELECT * FROM store_settings WHERE id = "default" LIMIT 1').first()) || {};

      const brandName = body.brandName ?? current.brand_name ?? DEFAULT_SETTINGS.brandName;
      const tagline = body.tagline ?? current.tagline ?? DEFAULT_SETTINGS.tagline;
      const logoUrl = body.logoUrl ?? current.logo_url ?? DEFAULT_SETTINGS.logoUrl;
      const phone = body.phone ?? current.phone ?? DEFAULT_SETTINGS.phone;
      const email = body.email ?? current.email ?? DEFAULT_SETTINGS.email;
      const address = body.address ?? current.address ?? DEFAULT_SETTINGS.address;
      const aboutStory = body.aboutStory ?? current.about_story ?? DEFAULT_SETTINGS.aboutStory;
      const aboutHeroTitle = body.aboutHeroTitle ?? current.about_hero_title ?? DEFAULT_SETTINGS.aboutHeroTitle;
      const aboutHeroDescription = body.aboutHeroDescription ?? current.about_hero_description ?? DEFAULT_SETTINGS.aboutHeroDescription;
      const fssaiLicense = body.fssaiLicense ?? current.fssai_license ?? DEFAULT_SETTINGS.fssaiLicense;
      const msg91AuthKey = body.msg91AuthKey ?? current.msg91_auth_key ?? '';
      const msg91TemplateId = body.msg91TemplateId ?? current.msg91_template_id ?? '';
      const msg91WidgetId = body.msg91WidgetId ?? current.msg91_widget_id ?? DEFAULT_SETTINGS.msg91WidgetId ?? '';
      const msg91TokenAuth = body.msg91TokenAuth ?? current.msg91_token_auth ?? DEFAULT_SETTINGS.msg91TokenAuth ?? '';

      let paymentOptions = DEFAULT_SETTINGS.paymentOptions;
      if (current.payment_options_json) {
        try { paymentOptions = JSON.parse(current.payment_options_json); } catch {}
      }
      if (body.paymentOptions) {
        paymentOptions = { ...paymentOptions, ...body.paymentOptions };
      }

      await env.DB.prepare(`
        INSERT INTO store_settings (
          id, brand_name, tagline, logo_url, phone, email, address,
          about_story, about_hero_title, about_hero_description,
          fssai_license, msg91_auth_key, msg91_template_id, msg91_widget_id, msg91_token_auth, payment_options_json, updated_at
        )
        VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          brand_name = excluded.brand_name,
          tagline = excluded.tagline,
          logo_url = excluded.logo_url,
          phone = excluded.phone,
          email = excluded.email,
          address = excluded.address,
          about_story = excluded.about_story,
          about_hero_title = excluded.about_hero_title,
          about_hero_description = excluded.about_hero_description,
          fssai_license = excluded.fssai_license,
          msg91_auth_key = excluded.msg91_auth_key,
          msg91_template_id = excluded.msg91_template_id,
          msg91_widget_id = excluded.msg91_widget_id,
          msg91_token_auth = excluded.msg91_token_auth,
          payment_options_json = excluded.payment_options_json,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        brandName,
        tagline,
        logoUrl,
        phone,
        email,
        address,
        aboutStory,
        aboutHeroTitle,
        aboutHeroDescription,
        fssaiLicense,
        msg91AuthKey,
        msg91TemplateId,
        msg91WidgetId,
        msg91TokenAuth,
        JSON.stringify(paymentOptions)
      ).run();

      return new Response(JSON.stringify({
        success: true,
        settings: {
          brandName,
          tagline,
          logoUrl,
          phone,
          email,
          address,
          aboutStory,
          aboutHeroTitle,
          aboutHeroDescription,
          fssaiLicense,
          msg91AuthKey,
          msg91TemplateId,
          msg91WidgetId,
          msg91TokenAuth,
          paymentOptions
        },
        message: 'Settings updated in Cloudflare D1 database.'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
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
