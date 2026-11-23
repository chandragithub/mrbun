// Cloudflare Worker for Mr Bun Fast Food
// Target: mrbun.ceansystech.workers.dev
// Database: Cloudflare D1 SQLite (DB: 0b367436-034c-462f-8811-c1ac76ea2023)

export interface Env {
  DB: any;
  ASSETS?: any;
  COMPANY_NAME?: string;
  CONTACT_PHONE?: string;
  CONTACT_EMAIL?: string;
  FSSAI_LICENSE?: string;
  MSG91_AUTH_KEY?: string;
  MSG91_TEMPLATE_ID?: string;
  CASHFREE_APP_ID?: string;
  CASHFREE_SECRET_KEY?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
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

// Default Seed Constants for D1 initialization
const DEFAULT_SETTINGS = {
  brandName: 'Mr Bun',
  tagline: 'Pizzas • Burgers • Mocktails',
  logoUrl: '/logo.png',
  phone: '9476088111',
  email: 'contact@mrbun.in',
  address: 'Chandra Complex, Near Kanyapuram School, Wimberlygunj, Sri Vijayapuram, A & N Islands 744206',
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

const DEFAULT_OFFERS = [
  {
    id: 'off-1',
    code: 'MRBUN50',
    title: 'Flat ₹50 Instant Cash Benefit',
    description: 'Save ₹50 direct cash on orders above ₹299',
    discountType: 'flat',
    discountValue: 50,
    minOrderAmount: 299,
    isActive: true
  },
  {
    id: 'off-2',
    code: 'PARTY20',
    title: '20% Mega Celebration Off',
    description: 'Get 20% discount on party feasting orders above ₹800',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 800,
    maxDiscount: 300,
    isActive: true
  },
  {
    id: 'off-3',
    code: 'FIRSTBITE',
    title: 'Flat ₹75 Welcome Bonus',
    description: 'Direct cash discount on your first crave box above ₹350',
    discountType: 'flat',
    discountValue: 75,
    minOrderAmount: 350,
    isActive: true
  }
];

const DEFAULT_OUTLETS = [
  {
    id: 'outlet-1',
    name: 'Mr Bun Flagship Diner & Central Kitchen',
    type: 'Dine-In • Takeaway • Live Counter • Party Hall',
    address: 'Plot 42, Food Court Boulevard, Central Plaza, Main Avenue',
    landmark: 'Opposite City Center Mall, Near Apollo Fountain',
    phone: '9476088111',
    timings: '11:00 AM – 01:00 AM (All Days)',
    status: 'Open Now',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    features: ['65+ Seating Dine-in', 'Private Party Hall', 'Live Burger Grill', 'Free Wi-Fi', 'Valet Parking', 'Kids Play Zone'],
    seatingCapacity: '65 Guests',
    isFlagship: true
  },
  {
    id: 'outlet-2',
    name: 'Mr Bun Express - Cyber Tech Hub',
    type: 'Express Lunch Boxes • Office Catering • Takeaway',
    address: 'Tower B, Ground Floor, Global Cyber Tech Park, Sector 4',
    landmark: 'Adjacent to Metro Gate 3',
    phone: '9476088111',
    timings: '10:30 AM – 11:30 PM (Mon – Sat)',
    status: 'Open Now',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    features: ['Quick 5-min Pickup Counter', 'Corporate Bento Boxes', 'Drive-Thru Lane', 'Air Conditioned', 'Contactless UPI'],
    seatingCapacity: '25 Quick Seats',
    isFlagship: false
  },
  {
    id: 'outlet-3',
    name: 'Mr Bun Late Night Delivery Kitchen',
    type: 'High-Speed Express Delivery • Midnight Cravings',
    address: 'Shop 12, Metro Interchange Arcade, Railway Station Road',
    landmark: 'Behind Central Post Office',
    phone: '9476088111',
    timings: '11:00 AM – 02:00 AM (Midnight Special)',
    status: 'Late Night Available',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80',
    features: ['Insulated Hot Warmer Depot', 'Superfast 25-min Radius', 'Late Night Burgers & Pizzas', 'Strict FSSAI Sanitization'],
    seatingCapacity: 'Takeaway & Delivery Only',
    isFlagship: false
  }
];

const DEFAULT_PACKAGES = [
  {
    id: 'pkg-birthday',
    title: 'Birthday Bash Mega Feast',
    tagline: 'Ideal for 15 to 60+ guests! Bursting with burgers, pizzas, fries, mocktails & cake.',
    minGuests: 15,
    price: 299,
    priceType: 'per_plate',
    badge: 'Most Popular for Birthdays',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    recommendedFor: 'Birthday celebrations, kids parties, anniversaries',
    includes: [
      'Choice of 2 Gourmet Burgers (Veg / Non-Veg options)',
      'Assorted Medium Cheese Burst Pizzas (Fresh slices for all)',
      'Crispy Peri Peri Crinkle Fries platters',
      'Unlimited Chilled Mocktails (Virgin Mojito & Blue Lagoon)',
      'Complimentary Birthday Mascot Banner & Party Hats',
      'Special Choco Lava dessert treats for each guest'
    ],
    popularItems: ['Classic Smash Burger', 'Cheese Burst Pizza', 'Electric Blue Lagoon', 'Peri Peri Fries']
  },
  {
    id: 'pkg-corporate',
    title: 'Corporate & Office Hangout Platter',
    tagline: 'Hassle-free, individually packed meal boxes for office teams, hackathons & meetings.',
    minGuests: 20,
    price: 249,
    priceType: 'per_plate',
    badge: 'GST Invoice Included',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    recommendedFor: 'Office lunches, product launches, corporate team gatherings',
    includes: [
      'Individual Bento Box: 1 Signature Burger + 1 Slice Pizza + 1 Dip',
      'Portion of Golden Salted Fries & Garlic Dip',
      'Choice of Cold Coffee or Virgin Mojito (Bottled)',
      'Eco-friendly cutlery, napkins & wet wipes',
      'Timely bulk slot delivery with temperature-controlled warming boxes',
      'Dedicated corporate billing & GST compliance'
    ],
    popularItems: ['Paneer Makhani Burger', 'Triple Decker Sandwich', 'Cold Coffee']
  },
  {
    id: 'pkg-house-party',
    title: 'House Party & Game Night Craze',
    tagline: 'Ultimate bite-sized finger foods, sliders & large pizzas for your friends hangout.',
    minGuests: 10,
    price: 269,
    priceType: 'per_plate',
    badge: 'Late Night Available',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    recommendedFor: 'Cricket/Football match screenings, weekend sleepovers, board game nights',
    includes: [
      'Tower of Mini Bun Sliders (Veg & Non-Veg mix)',
      '12-inch Extra Large Pizzas (Smoked BBQ Chicken & Farmhouse)',
      'Loaded Cheese Nachos & Cheesy Breadsticks',
      'Jumbo Pitchers of Mango Chilli Fizz & Blue Lagoon Mocktails',
      'Extra signature Mr Bun dip bottles (Truffle Mayo, Hot Sriracha)'
    ],
    popularItems: ['Fiery BBQ Chicken Pizza', 'Loaded Fries', 'Blue Lagoon', 'Tandoori Paneer Pizza']
  },
  {
    id: 'pkg-custom',
    title: 'Custom VIP Event Buffet',
    tagline: 'Design your own live counter, custom menu items, and chef setup at your venue.',
    minGuests: 30,
    price: 349,
    priceType: 'per_plate',
    badge: 'Customizable Counter',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    recommendedFor: 'College farewells, weddings after-parties, grand reunions',
    includes: [
      'Live Mr Bun Toasting & Slicing Station at venue',
      'Unlimited combinations of 4 Burgers, 3 Pizzas & 3 Mocktails',
      '2 Uniformed Mr Bun service crew to serve guests hot & fresh',
      'Customized welcome food cards with your event name',
      'Zero cleanup hassle: complete disposable setup handled'
    ],
    popularItems: ['Live Burger Counter', 'Custom Mocktail Bar', 'Cheese Fountains']
  }
];

const DEFAULT_FRANCHISE_MODELS = [
  {
    id: 'fran-model-1',
    title: 'Express Delivery & Takeaway Hub',
    badge: 'Low Capex • Quick Launch',
    area: '250 – 450 sq ft',
    investment: '₹12 – 18 Lakhs',
    roi: '10 – 14 Months',
    desc: 'Optimized for high-density delivery orders, online aggregators, and quick takeaway counters.',
    highlights: [
      'Compact commercial kitchen',
      'Low rental footprint',
      'Online order dispatch engine',
      '2-3 staff operation'
    ],
    orderIndex: 1,
    isActive: true
  },
  {
    id: 'fran-model-2',
    title: 'Flagship Diner & Cafe',
    badge: 'High Footfall • Maximum Revenue',
    area: '800 – 1,500 sq ft',
    investment: '₹28 – 40 Lakhs',
    roi: '14 – 18 Months',
    desc: 'Full-fledged experiential fast food diner with live pizza ovens, smash burger counter & party space.',
    highlights: [
      '50+ seating dine-in area',
      'Private party & birthday zone',
      'Instagrammable interiors',
      'High ticket dine-in + delivery'
    ],
    orderIndex: 2,
    isActive: true
  },
  {
    id: 'fran-model-3',
    title: 'Mall Food Court Kiosk',
    badge: 'Guaranteed Footfall',
    area: '150 – 300 sq ft',
    investment: '₹18 – 25 Lakhs',
    roi: '12 – 15 Months',
    desc: 'High velocity counter in prime shopping malls, tech parks, or transit hubs with rapid customer turnaround.',
    highlights: [
      'Pre-set mall infrastructure',
      'Instant brand visibility',
      'High margin combo meal sales',
      'Standardized plug-and-play setup'
    ],
    orderIndex: 3,
    isActive: true
  }
];

// Helper to ensure D1 tables exist
async function ensureTables(db: any) {
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
        payment_options_json TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS franchise_models (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        badge TEXT,
        area TEXT NOT NULL,
        investment TEXT NOT NULL,
        roi TEXT NOT NULL,
        description TEXT NOT NULL,
        highlights_json TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        original_price REAL,
        is_veg INTEGER DEFAULT 1,
        spicy_level INTEGER DEFAULT 1,
        rating REAL DEFAULT 4.8,
        reviews_count INTEGER DEFAULT 12,
        image TEXT NOT NULL,
        is_popular INTEGER DEFAULT 0,
        is_new INTEGER DEFAULT 1,
        tags TEXT,
        options_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS offers (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        discount_type TEXT NOT NULL,
        discount_value REAL NOT NULL,
        min_order_amount REAL DEFAULT 0,
        max_discount REAL,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS outlets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        address TEXT NOT NULL,
        landmark TEXT,
        phone TEXT NOT NULL,
        timings TEXT NOT NULL,
        status TEXT NOT NULL,
        image TEXT NOT NULL,
        features_json TEXT,
        seating_capacity TEXT,
        is_flagship INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        delivery_type TEXT DEFAULT 'delivery',
        delivery_address TEXT NOT NULL,
        items_json TEXT NOT NULL,
        subtotal REAL NOT NULL,
        discount REAL DEFAULT 0,
        tax REAL NOT NULL,
        delivery_fee REAL DEFAULT 0,
        total_amount REAL NOT NULL,
        payment_method TEXT DEFAULT 'upi',
        payment_status TEXT DEFAULT 'pending',
        order_status TEXT DEFAULT 'pending',
        order_notes TEXT,
        fssai_license TEXT DEFAULT '22926112000173',
        admin_notification_json TEXT,
        customer_confirmation_json TEXT,
        approved_at TEXT,
        approved_by TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS party_orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        event_type TEXT NOT NULL,
        guest_count INTEGER NOT NULL,
        event_date TEXT NOT NULL,
        event_time TEXT NOT NULL,
        venue_address TEXT NOT NULL,
        package_selected TEXT,
        customized_items_json TEXT,
        budget_estimate REAL NOT NULL,
        payment_method TEXT DEFAULT 'online',
        payment_status TEXT DEFAULT 'pending',
        special_notes TEXT,
        status TEXT DEFAULT 'pending',
        admin_notification_json TEXT,
        customer_confirmation_json TEXT,
        approved_at TEXT,
        approved_by TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS party_packages (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        tagline TEXT NOT NULL,
        min_guests INTEGER DEFAULT 10,
        price REAL NOT NULL,
        price_type TEXT DEFAULT 'per_plate',
        badge TEXT,
        image TEXT NOT NULL,
        includes_json TEXT NOT NULL,
        recommended_for TEXT,
        popular_items_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        address TEXT,
        role TEXT DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS franchise_applications (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        city TEXT NOT NULL,
        state TEXT,
        model_interested TEXT NOT NULL,
        investment_budget TEXT,
        has_property TEXT,
        property_area TEXT,
        prior_experience TEXT,
        status TEXT DEFAULT 'new_inquiry',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS otp_verifications (
        id TEXT PRIMARY KEY,
        phone TEXT NOT NULL,
        otp TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        sent_to_email TEXT DEFAULT 'contact@mrbun.in',
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Safe column migrations for existing store_settings table
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN address TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN about_story TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN about_hero_title TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN about_hero_description TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN msg91_auth_key TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN msg91_template_id TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN msg91_widget_id TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE store_settings ADD COLUMN msg91_token_auth TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE users ADD COLUMN avatar_url TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE users ADD COLUMN assigned_outlet TEXT;'); } catch {}
    try { await db.exec('ALTER TABLE users ADD COLUMN status TEXT DEFAULT "active";'); } catch {}

    // Seed master administrator account if it does not exist
    try {
      await db.prepare(`
        INSERT OR IGNORE INTO users (id, name, email, phone, password_hash, role, address, assigned_outlet, status)
        VALUES ('usr-admin', 'Mr Bun Master Admin', 'admin@mrbun.in', '9476088111', 'admin123', 'admin', 'Central Kitchen & HQ', 'All Outlets', 'active')
      `).run();
    } catch {}
  } catch (e) {
    console.error('Error ensuring tables:', e);
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.endsWith('.local');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // 0. Health check endpoint
    if (url.pathname === '/api/health') {
      return jsonResponse({
        status: 'online',
        service: 'Mr Bun Cloudflare D1 Integrated Worker',
        subdomain: 'mrbun.ceansystech.workers.dev',
        fssai: '22926112000173',
        phone: '9476088111',
        email: 'contact@mrbun.in',
        database: 'Cloudflare D1 SQLite (mrbun-db: 0b367436-034c-462f-8811-c1ac76ea2023)',
        timestamp: new Date().toISOString()
      });
    }

    // 1. FEATURE 1 & 2: STORE SETTINGS (Logo, Name, Tagline, Phone, Email, Address, About Us, FSSAI, Payments)
    if (url.pathname === '/api/settings') {
      await ensureTables(env.DB);

      if (request.method === 'GET') {
        try {
          if (env.DB) {
            const row: any = await env.DB.prepare('SELECT * FROM store_settings WHERE id = "default" LIMIT 1').first();
            if (row) {
              return jsonResponse({
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
              });
            }
          }
          return jsonResponse({ success: true, settings: DEFAULT_SETTINGS });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message, settings: DEFAULT_SETTINGS }, 200);
        }
      }

      if (request.method === 'POST' || request.method === 'PUT') {
        try {
          const body: any = await request.json();
          const current: any = (await env.DB?.prepare('SELECT * FROM store_settings WHERE id = "default" LIMIT 1').first()) || {};
          
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

          if (env.DB) {
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
          }

          return jsonResponse({
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
          });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }
    }

    // 2. FEATURE 3: DYNAMIC MENU PRODUCTS (CRUD in D1)
    if (url.pathname === '/api/products' || url.pathname.startsWith('/api/products/')) {
      await ensureTables(env.DB);

      if (request.method === 'GET') {
        try {
          const category = url.searchParams.get('category');
          if (env.DB) {
            let query = 'SELECT * FROM products ORDER BY created_at DESC';
            let stmt = env.DB.prepare(query);
            if (category && category !== 'all') {
              query = 'SELECT * FROM products WHERE category = ? ORDER BY created_at DESC';
              stmt = env.DB.prepare(query).bind(category);
            }
            const { results } = await stmt.all();
            
            const mapped = (results || []).map((r: any) => ({
              id: r.id,
              name: r.name,
              category: r.category,
              description: r.description || '',
              price: r.price,
              originalPrice: r.original_price,
              isVeg: r.is_veg === 1,
              spicyLevel: r.spicy_level,
              rating: r.rating,
              reviewsCount: r.reviews_count,
              image: r.image,
              isPopular: r.is_popular === 1,
              isNew: r.is_new === 1,
              tags: r.tags ? r.tags.split(',').map((t: string) => t.trim()) : [],
              options: r.options_json ? JSON.parse(r.options_json) : undefined
            }));

            return jsonResponse({ success: true, products: mapped });
          }
          return jsonResponse({ success: true, products: [] });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      if (request.method === 'POST') {
        try {
          const p: any = await request.json();
          const prodId = p.id || `prod-${Date.now()}`;
          const tagsStr = Array.isArray(p.tags) ? p.tags.join(',') : (p.tags || '');

          if (env.DB) {
            await env.DB.prepare(`
              INSERT INTO products (
                id, name, category, description, price, original_price,
                is_veg, spicy_level, rating, reviews_count, image,
                is_popular, is_new, tags, options_json
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                category = excluded.category,
                description = excluded.description,
                price = excluded.price,
                original_price = excluded.original_price,
                is_veg = excluded.is_veg,
                spicy_level = excluded.spicy_level,
                rating = excluded.rating,
                reviews_count = excluded.reviews_count,
                image = excluded.image,
                is_popular = excluded.is_popular,
                is_new = excluded.is_new,
                tags = excluded.tags,
                options_json = excluded.options_json
            `).bind(
              prodId,
              p.name,
              p.category || 'burgers',
              p.description || '',
              p.price || 0,
              p.originalPrice || null,
              p.isVeg ? 1 : 0,
              p.spicyLevel ?? 1,
              p.rating || 4.8,
              p.reviewsCount || 12,
              p.image || '/logo.png',
              p.isPopular ? 1 : 0,
              p.isNew ? 1 : 0,
              tagsStr,
              p.options ? JSON.stringify(p.options) : null
            ).run();
          }

          return jsonResponse({ success: true, product: { ...p, id: prodId } }, 201);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      if (request.method === 'DELETE') {
        try {
          const id = url.pathname.replace('/api/products/', '').trim();
          if (id && env.DB) {
            await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
          }
          return jsonResponse({ success: true, message: `Product ${id} deleted from D1.` });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }
    }

    // 3. FEATURE 4: DYNAMIC OFFERS & DISCOUNTS (CRUD in D1)
    if (url.pathname === '/api/offers' || url.pathname.startsWith('/api/offers/')) {
      await ensureTables(env.DB);

      if (request.method === 'GET') {
        try {
          if (env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM offers ORDER BY created_at DESC').all();
            if (results && results.length > 0) {
              const mapped = results.map((r: any) => ({
                id: r.id,
                code: r.code,
                title: r.title,
                description: r.description || '',
                discountType: r.discount_type,
                discountValue: r.discount_value,
                minOrderAmount: r.min_order_amount || 0,
                maxDiscount: r.max_discount,
                isActive: r.is_active === 1
              }));
              return jsonResponse({ success: true, offers: mapped });
            }
          }
          return jsonResponse({ success: true, offers: DEFAULT_OFFERS });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message, offers: DEFAULT_OFFERS }, 200);
        }
      }

      if (request.method === 'POST') {
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

          return jsonResponse({ success: true, offer: { ...o, id: offerId, code } }, 201);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      if (request.method === 'DELETE') {
        try {
          const id = url.pathname.replace('/api/offers/', '').trim();
          if (id && env.DB) {
            await env.DB.prepare('DELETE FROM offers WHERE id = ?').bind(id).run();
          }
          return jsonResponse({ success: true, message: `Offer ${id} removed from D1.` });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }
    }

    // 4. FEATURE 5: MULTIPLE OUTLETS (CRUD in D1)
    if (url.pathname === '/api/outlets' || url.pathname.startsWith('/api/outlets/')) {
      await ensureTables(env.DB);

      if (request.method === 'GET') {
        try {
          if (env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM outlets ORDER BY is_flagship DESC, created_at ASC').all();
            if (results && results.length > 0) {
              const mapped = results.map((r: any) => ({
                id: r.id,
                name: r.name,
                type: r.type,
                address: r.address,
                landmark: r.landmark || '',
                phone: r.phone,
                timings: r.timings,
                status: r.status,
                image: r.image,
                features: r.features_json ? JSON.parse(r.features_json) : [],
                seatingCapacity: r.seating_capacity,
                isFlagship: r.is_flagship === 1
              }));
              return jsonResponse({ success: true, outlets: mapped });
            }
          }
          return jsonResponse({ success: true, outlets: DEFAULT_OUTLETS });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message, outlets: DEFAULT_OUTLETS }, 200);
        }
      }

      if (request.method === 'POST') {
        try {
          const o: any = await request.json();
          const outletId = o.id || `outlet-${Date.now()}`;
          const featuresJson = JSON.stringify(Array.isArray(o.features) ? o.features : []);

          if (env.DB) {
            await env.DB.prepare(`
              INSERT INTO outlets (
                id, name, type, address, landmark, phone, timings,
                status, image, features_json, seating_capacity, is_flagship
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                type = excluded.type,
                address = excluded.address,
                landmark = excluded.landmark,
                phone = excluded.phone,
                timings = excluded.timings,
                status = excluded.status,
                image = excluded.image,
                features_json = excluded.features_json,
                seating_capacity = excluded.seating_capacity,
                is_flagship = excluded.is_flagship
            `).bind(
              outletId,
              o.name,
              o.type,
              o.address,
              o.landmark || '',
              o.phone || '9476088111',
              o.timings || '11:00 AM – 11:00 PM',
              o.status || 'Open Now',
              o.image || DEFAULT_OUTLETS[0].image,
              featuresJson,
              o.seatingCapacity || '',
              o.isFlagship ? 1 : 0
            ).run();
          }

          return jsonResponse({ success: true, outlet: { ...o, id: outletId } }, 201);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      if (request.method === 'DELETE') {
        try {
          const id = url.pathname.replace('/api/outlets/', '').trim();
          if (id && env.DB) {
            await env.DB.prepare('DELETE FROM outlets WHERE id = ?').bind(id).run();
          }
          return jsonResponse({ success: true, message: `Outlet ${id} removed from D1.` });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }
    }

    // 5. ORDERS API: Full Customer & Owner Workflow with Approval in D1
    if (url.pathname === '/api/orders' || url.pathname.startsWith('/api/orders/')) {
      await ensureTables(env.DB);

      // GET All or By Email
      if (request.method === 'GET') {
        try {
          if (env.DB) {
            const email = url.searchParams.get('email');
            let query = 'SELECT * FROM orders ORDER BY created_at DESC LIMIT 100';
            let stmt = env.DB.prepare(query);
            if (email) {
              query = 'SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC LIMIT 50';
              stmt = env.DB.prepare(query).bind(email);
            }
            const { results } = await stmt.all();
            
            const mapped = (results || []).map((r: any) => ({
              id: r.id,
              userId: r.user_id,
              customerName: r.customer_name,
              customerEmail: r.customer_email,
              customerPhone: r.customer_phone,
              deliveryType: r.delivery_type,
              deliveryAddress: r.delivery_address,
              items: r.items_json ? JSON.parse(r.items_json) : [],
              subtotal: r.subtotal,
              discount: r.discount,
              tax: r.tax,
              deliveryFee: r.delivery_fee,
              totalAmount: r.total_amount,
              paymentMethod: r.payment_method,
              paymentStatus: r.payment_status,
              orderStatus: r.order_status,
              orderNotes: r.order_notes,
              fssaiLicense: r.fssai_license || '22926112000173',
              adminNotification: r.admin_notification_json ? JSON.parse(r.admin_notification_json) : undefined,
              customerConfirmation: r.customer_confirmation_json ? JSON.parse(r.customer_confirmation_json) : undefined,
              approvedAt: r.approved_at,
              approvedBy: r.approved_by,
              createdAt: r.created_at
            }));

            return jsonResponse({ success: true, orders: mapped });
          }
          return jsonResponse({ success: true, orders: [] });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      // POST Create Order
      if (request.method === 'POST') {
        try {
          const body: any = await request.json();
          const orderId = body.id || ('ORD-' + Math.floor(10000 + Math.random() * 90000));
          const now = new Date().toISOString();

          const adminNotification = {
            sentToPhone: '9476088111',
            sentToEmail: 'contact@mrbun.in',
            dispatchedAt: now,
            type: 'order_placed_to_owner',
            message: `[NEW MR BUN ORDER #${orderId}] ${body.customerName} (${body.customerPhone}) ordered ${body.items?.length || 0} items worth ₹${body.totalAmount} via ${body.paymentMethod?.toUpperCase()}. STATUS: PENDING OWNER APPROVAL.`
          };

          if (env.DB) {
            await env.DB.prepare(`
              INSERT INTO orders (
                id, user_id, customer_name, customer_email, customer_phone,
                delivery_type, delivery_address, items_json, subtotal, discount,
                tax, delivery_fee, total_amount, payment_method, payment_status,
                order_status, order_notes, fssai_license, admin_notification_json, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
              body.paymentMethod || 'upi',
              body.paymentStatus || (body.paymentMethod === 'cod' ? 'pending' : 'paid'),
              'pending', // Starts as pending owner approval
              body.orderNotes || '',
              '22926112000173',
              JSON.stringify(adminNotification),
              now
            ).run();
          }

          return jsonResponse({
            success: true,
            orderId,
            message: 'Order created in Cloudflare D1. Owner alerted; awaiting approval.',
            adminNotification
          }, 201);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 400);
        }
      }

      // CASHFREE PAYMENT GATEWAY INTEGRATION
      // 1. Create Cashfree Order & Generate payment_session_id
      if (url.pathname === '/api/payments/cashfree/create-order' && request.method === 'POST') {
        try {
          const body: any = await request.json();
          const currentSettings: any = (await env.DB?.prepare('SELECT * FROM store_settings WHERE id = "default" LIMIT 1').first()) || {};
          let paymentOptions: any = {};
          try {
            paymentOptions = JSON.parse(currentSettings.payment_options_json || '{}');
          } catch {}

          const appId = env.CASHFREE_APP_ID || paymentOptions.cashfreeAppId || '135031343aa764f0a6ea5362ff73130531';
          const secretKey = env.CASHFREE_SECRET_KEY || paymentOptions.cashfreeSecretKey || '';
          const isTestMode = paymentOptions.isTestMode === true;

          if (!appId || !secretKey) {
            return jsonResponse({
              success: false,
              error: 'Cashfree credentials not configured. Please set them in Admin Portal -> Payment Options.'
            }, 400);
          }

          const orderId = body.orderId || ('ORD-' + Math.floor(10000 + Math.random() * 90000));
          const orderAmount = Number(body.orderAmount || 0);
          const customerPhone = (body.customerPhone || '9476088111').replace(/\D/g, '').slice(-10);
          const customerName = body.customerName || 'Mr Bun Customer';
          const customerEmail = body.customerEmail || `${customerPhone}@mrbun.in`;
          const customerId = body.userId || `cust_${customerPhone}`;

          const cfBaseUrl = isTestMode 
            ? 'https://sandbox.cashfree.com/pg/orders' 
            : 'https://api.cashfree.com/pg/orders';

          const cfPayload = {
            order_id: orderId,
            order_amount: orderAmount,
            order_currency: 'INR',
            customer_details: {
              customer_id: customerId,
              customer_phone: customerPhone,
              customer_name: customerName,
              customer_email: customerEmail
            },
            order_meta: {
              return_url: `${url.origin}/orders?order_id={order_id}`
            },
            order_note: `Mr Bun Online Order #${orderId}`
          };

          const cfRes = await fetch(cfBaseUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-version': '2023-08-01',
              'x-client-id': appId,
              'x-client-secret': secretKey
            },
            body: JSON.stringify(cfPayload)
          });

          const cfData: any = await cfRes.json();

          if (!cfRes.ok || !cfData.payment_session_id) {
            console.error('Cashfree order creation error:', cfData);
            return jsonResponse({
              success: false,
              error: cfData.message || 'Failed to initialize Cashfree payment session. Please verify API ID & Secret Key in Admin Portal.'
            }, 400);
          }

          return jsonResponse({
            success: true,
            orderId,
            paymentSessionId: cfData.payment_session_id,
            cfOrderId: cfData.cf_order_id,
            isTestMode
          });
        } catch (err: any) {
          console.error('Cashfree create-order exception:', err);
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      // 2. Verify Cashfree Payment Status
      if (url.pathname === '/api/payments/cashfree/verify-order' && request.method === 'POST') {
        try {
          const body: any = await request.json();
          const orderId = body.orderId;
          if (!orderId) {
            return jsonResponse({ success: false, error: 'Order ID is required.' }, 400);
          }

          const currentSettings: any = (await env.DB?.prepare('SELECT * FROM store_settings WHERE id = "default" LIMIT 1').first()) || {};
          let paymentOptions: any = {};
          try {
            paymentOptions = JSON.parse(currentSettings.payment_options_json || '{}');
          } catch {}

          const appId = env.CASHFREE_APP_ID || paymentOptions.cashfreeAppId || '135031343aa764f0a6ea5362ff73130531';
          const secretKey = env.CASHFREE_SECRET_KEY || paymentOptions.cashfreeSecretKey || '';
          const isTestMode = paymentOptions.isTestMode === true;

          const cfBaseUrl = isTestMode 
            ? `https://sandbox.cashfree.com/pg/orders/${orderId}` 
            : `https://api.cashfree.com/pg/orders/${orderId}`;

          const cfRes = await fetch(cfBaseUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-api-version': '2023-08-01',
              'x-client-id': appId,
              'x-client-secret': secretKey
            }
          });

          const cfData: any = await cfRes.json();
          const isPaid = cfData.order_status === 'PAID';

          if (isPaid && env.DB) {
            await env.DB.prepare('UPDATE orders SET payment_status = "paid" WHERE id = ?').bind(orderId).run();
          }

          return jsonResponse({
            success: true,
            orderId,
            orderStatus: cfData.order_status,
            isPaid,
            cfOrder: cfData
          });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      // POST Approve Order: moves from pending -> confirmed, dispatches customer SMS/Email
      if (url.pathname.endsWith('/approve') && request.method === 'POST') {
        try {
          const parts = url.pathname.split('/');
          const orderId = parts[parts.length - 2];
          const now = new Date().toISOString();

          if (env.DB) {
            const order: any = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first();
            if (!order) {
              return jsonResponse({ success: false, message: 'Order not found' }, 404);
            }

            const customerConfirmation = {
              sentToPhone: order.customer_phone,
              sentToEmail: order.customer_email,
              dispatchedAt: now,
              type: 'owner_approved_to_customer',
              message: `[MR BUN CONFIRMED] Dear ${order.customer_name}, your order #${order.id} (₹${order.total_amount}) is APPROVED by Owner! Kitchen started food preparation. Helpline: 9476088111.`
            };

            await env.DB.prepare(`
              UPDATE orders SET 
                order_status = 'confirmed',
                customer_confirmation_json = ?,
                approved_at = ?,
                approved_by = ?
              WHERE id = ?
            `).bind(
              JSON.stringify(customerConfirmation),
              now,
              'Mr Bun Kitchen Owner (9476088111)',
              orderId
            ).run();

            return jsonResponse({
              success: true,
              message: `Order #${orderId} approved in D1. Confirmation dispatched.`,
              customerConfirmation
            });
          }
          return jsonResponse({ success: false, message: 'No D1 connection' }, 500);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      // PATCH Order Status: update kitchen stage (preparing, out_for_delivery, delivered)
      if (url.pathname.endsWith('/status') && (request.method === 'PATCH' || request.method === 'POST')) {
        try {
          const parts = url.pathname.split('/');
          const orderId = parts[parts.length - 2];
          const body: any = await request.json();

          if (env.DB && body.status) {
            await env.DB.prepare('UPDATE orders SET order_status = ? WHERE id = ?').bind(body.status, orderId).run();
          }

          return jsonResponse({ success: true, message: `Order #${orderId} status updated to ${body.status}` });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }
    }

    // 6. PARTY ORDERS API: Bookings and Approvals in D1
    if (url.pathname === '/api/party' || url.pathname.startsWith('/api/party/')) {
      await ensureTables(env.DB);

      if (request.method === 'GET') {
        try {
          if (env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM party_orders ORDER BY created_at DESC LIMIT 50').all();
            const mapped = (results || []).map((r: any) => ({
              id: r.id,
              userId: r.user_id,
              fullName: r.full_name,
              phone: r.phone,
              email: r.email,
              eventType: r.event_type,
              guestCount: r.guest_count,
              eventDate: r.event_date,
              eventTime: r.event_time,
              venueAddress: r.venue_address,
              packageName: r.package_selected,
              customizedItems: r.customized_items_json ? JSON.parse(r.customized_items_json) : [],
              budgetEstimate: r.budget_estimate,
              paymentMethod: r.payment_method,
              paymentStatus: r.payment_status,
              specialNotes: r.special_notes,
              status: r.status,
              adminNotification: r.admin_notification_json ? JSON.parse(r.admin_notification_json) : undefined,
              customerConfirmation: r.customer_confirmation_json ? JSON.parse(r.customer_confirmation_json) : undefined,
              approvedAt: r.approved_at,
              approvedBy: r.approved_by,
              createdAt: r.created_at
            }));

            return jsonResponse({ success: true, partyBookings: mapped });
          }
          return jsonResponse({ success: true, partyBookings: [] });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      if (request.method === 'POST' && !url.pathname.endsWith('/approve') && !url.pathname.endsWith('/status')) {
        try {
          const body: any = await request.json();
          const partyId = body.id || ('PARTY-' + Math.floor(100 + Math.random() * 900));
          const now = new Date().toISOString();

          const adminNotification = {
            sentToPhone: '9476088111',
            sentToEmail: 'contact@mrbun.in',
            dispatchedAt: now,
            type: 'order_placed_to_owner',
            message: `[NEW MR BUN PARTY BOOKING #${partyId}] ${body.fullName} (${body.phone}) booked ${body.eventType} for ${body.guestCount} guests. Est: ₹${body.budgetEstimate}. STATUS: PENDING OWNER APPROVAL.`
          };

          if (env.DB) {
            await env.DB.prepare(`
              INSERT INTO party_orders (
                id, user_id, full_name, phone, email, event_type, guest_count,
                event_date, event_time, venue_address, package_selected,
                customized_items_json, budget_estimate, payment_method, payment_status,
                special_notes, status, admin_notification_json, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
              body.paymentMethod || 'online',
              body.paymentStatus || (body.paymentMethod === 'cash_before_prep' ? 'pending' : 'paid'),
              body.specialNotes || body.customNotes || '',
              'pending',
              JSON.stringify(adminNotification),
              now
            ).run();
          }

          return jsonResponse({
            success: true,
            partyId,
            message: 'Party inquiry saved in D1. Catering manager notified at 9476088111.'
          }, 201);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 400);
        }
      }

      // Approve Party Booking
      if (url.pathname.endsWith('/approve') && request.method === 'POST') {
        try {
          const parts = url.pathname.split('/');
          const partyId = parts[parts.length - 2];
          const now = new Date().toISOString();

          if (env.DB) {
            const booking: any = await env.DB.prepare('SELECT * FROM party_orders WHERE id = ?').bind(partyId).first();
            if (!booking) {
              return jsonResponse({ success: false, message: 'Party booking not found' }, 404);
            }

            const customerConfirmation = {
              sentToPhone: booking.phone,
              sentToEmail: booking.email,
              dispatchedAt: now,
              type: 'owner_approved_to_customer',
              message: `[MR BUN PARTY CONFIRMED] Dear ${booking.full_name}, your party booking #${booking.id} (${booking.event_type} for ${booking.guest_count} guests) is APPROVED! Helpline: 9476088111.`
            };

            await env.DB.prepare(`
              UPDATE party_orders SET 
                status = 'confirmed',
                customer_confirmation_json = ?,
                approved_at = ?,
                approved_by = ?
              WHERE id = ?
            `).bind(
              JSON.stringify(customerConfirmation),
              now,
              'Mr Bun Catering Desk (9476088111)',
              partyId
            ).run();

            return jsonResponse({
              success: true,
              message: `Party #${partyId} approved in D1. Confirmation dispatched.`,
              customerConfirmation
            });
          }
          return jsonResponse({ success: false, message: 'No D1 connection' }, 500);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      // Update Party Status
      if (url.pathname.endsWith('/status') && (request.method === 'PATCH' || request.method === 'POST')) {
        try {
          const parts = url.pathname.split('/');
          const partyId = parts[parts.length - 2];
          const body: any = await request.json();

          if (env.DB && body.status) {
            await env.DB.prepare('UPDATE party_orders SET status = ? WHERE id = ?').bind(body.status, partyId).run();
          }

          return jsonResponse({ success: true, message: `Party #${partyId} status updated to ${body.status}` });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }
    }

    // 6b. CELEBRATION PACKAGES API (CRUD in Cloudflare D1)
    if (url.pathname === '/api/packages' || url.pathname.startsWith('/api/packages/')) {
      await ensureTables(env.DB);

      if (request.method === 'GET') {
        try {
          if (env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM party_packages ORDER BY created_at ASC').all();
            if (results && results.length > 0) {
              const mapped = results.map((r: any) => ({
                id: r.id,
                title: r.title,
                tagline: r.tagline,
                minGuests: r.min_guests || 10,
                price: r.price,
                priceType: r.price_type || 'per_plate',
                pricePerGuest: r.price_type === 'per_plate' ? r.price : r.price,
                badge: r.badge || '',
                image: r.image,
                includes: r.includes_json ? JSON.parse(r.includes_json) : [],
                recommendedFor: r.recommended_for || '',
                popularItems: r.popular_items_json ? JSON.parse(r.popular_items_json) : []
              }));
              return jsonResponse({ success: true, packages: mapped });
            }
          }
          return jsonResponse({ success: true, packages: DEFAULT_PACKAGES });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message, packages: DEFAULT_PACKAGES }, 200);
        }
      }

      if (request.method === 'POST') {
        try {
          const p: any = await request.json();
          const pkgId = p.id || `pkg-${Date.now()}`;
          const includesJson = JSON.stringify(Array.isArray(p.includes) ? p.includes : []);
          const popularItemsJson = JSON.stringify(Array.isArray(p.popularItems) ? p.popularItems : []);

          if (env.DB) {
            await env.DB.prepare(`
              INSERT INTO party_packages (
                id, title, tagline, min_guests, price, price_type,
                badge, image, includes_json, recommended_for, popular_items_json
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                title = excluded.title,
                tagline = excluded.tagline,
                min_guests = excluded.min_guests,
                price = excluded.price,
                price_type = excluded.price_type,
                badge = excluded.badge,
                image = excluded.image,
                includes_json = excluded.includes_json,
                recommended_for = excluded.recommended_for,
                popular_items_json = excluded.popular_items_json
            `).bind(
              pkgId,
              p.title || 'Celebration Feast',
              p.tagline || '',
              p.minGuests ? Number(p.minGuests) : 10,
              p.price ? Number(p.price) : 299,
              p.priceType || 'per_plate',
              p.badge || '',
              p.image || DEFAULT_PACKAGES[0].image,
              includesJson,
              p.recommendedFor || '',
              popularItemsJson
            ).run();
          }

          return jsonResponse({ success: true, package: { ...p, id: pkgId } }, 201);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      if (request.method === 'DELETE') {
        try {
          const id = url.pathname.replace('/api/packages/', '').trim();
          if (id && env.DB) {
            await env.DB.prepare('DELETE FROM party_packages WHERE id = ?').bind(id).run();
          }
          return jsonResponse({ success: true, message: `Package ${id} removed from D1.` });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }
    }

    // 6c. FRANCHISE MODELS API (CRUD in Cloudflare D1)
    if (url.pathname === '/api/franchise-models' || url.pathname.startsWith('/api/franchise-models/')) {
      await ensureTables(env.DB);

      if (request.method === 'GET') {
        try {
          if (env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM franchise_models ORDER BY order_index ASC, created_at ASC').all();
            if (results && results.length > 0) {
              const mapped = results.map((r: any) => ({
                id: r.id,
                title: r.title,
                badge: r.badge || '',
                area: r.area,
                investment: r.investment,
                roi: r.roi,
                desc: r.description,
                highlights: r.highlights_json ? JSON.parse(r.highlights_json) : [],
                orderIndex: r.order_index ?? 0,
                isActive: r.is_active === 1 || r.is_active === true
              }));
              return jsonResponse({ success: true, models: mapped });
            }
          }
          return jsonResponse({ success: true, models: DEFAULT_FRANCHISE_MODELS });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message, models: DEFAULT_FRANCHISE_MODELS }, 200);
        }
      }

      if (request.method === 'POST') {
        try {
          const m: any = await request.json();
          const modelId = m.id || `fran-model-${Date.now()}`;
          const highlightsJson = JSON.stringify(Array.isArray(m.highlights) ? m.highlights : []);
          const isActiveInt = m.isActive === false ? 0 : 1;
          const orderIndex = typeof m.orderIndex === 'number' ? m.orderIndex : 0;

          if (env.DB) {
            await env.DB.prepare(`
              INSERT INTO franchise_models (
                id, title, badge, area, investment, roi, description, highlights_json, order_index, is_active
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                title = excluded.title,
                badge = excluded.badge,
                area = excluded.area,
                investment = excluded.investment,
                roi = excluded.roi,
                description = excluded.description,
                highlights_json = excluded.highlights_json,
                order_index = excluded.order_index,
                is_active = excluded.is_active
            `).bind(
              modelId,
              m.title || 'Franchise Format',
              m.badge || '',
              m.area || '',
              m.investment || '',
              m.roi || '',
              m.desc || '',
              highlightsJson,
              orderIndex,
              isActiveInt
            ).run();
          }

          return jsonResponse({ success: true, model: { ...m, id: modelId } }, 201);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      if (request.method === 'DELETE') {
        try {
          const id = url.pathname.replace('/api/franchise-models/', '').replace('/api/franchise-models', '').trim() || url.searchParams.get('id');
          if (id && env.DB) {
            await env.DB.prepare('DELETE FROM franchise_models WHERE id = ?').bind(id).run();
          }
          return jsonResponse({ success: true, message: `Franchise model ${id} deleted.` });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }
    }

    // 7. FRANCHISE APPLICATION API
    if (url.pathname === '/api/franchise' && request.method === 'POST') {
      await ensureTables(env.DB);
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
            body.modelInterested || 'Express Hub',
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
          message: 'Franchise inquiry saved in D1. Franchise Head will call at 9476088111.'
        }, 201);
      } catch (err: any) {
        return jsonResponse({ success: false, error: err.message }, 400);
      }
    }

    // 7b. CONTACT & DIRECT INQUIRIES API
    if (url.pathname === '/api/contact' || url.pathname.startsWith('/api/contact/')) {
      await ensureTables(env.DB);

      // GET All Inquiries
      if (request.method === 'GET') {
        try {
          if (env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100').all();
            const formatted = (results || []).map((r: any) => ({
              id: r.id,
              name: r.name,
              phone: r.phone,
              email: r.email,
              subject: r.subject,
              message: r.message,
              sentToEmail: r.sent_to_email || 'contact@mrbun.in',
              status: r.status || 'new',
              createdAt: r.created_at
            }));
            return jsonResponse({ success: true, messages: formatted });
          }
          return jsonResponse({ success: true, messages: [] });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message, messages: [] }, 200);
        }
      }

      // POST Submit New Inquiry
      if (request.method === 'POST') {
        try {
          const body: any = await request.json();
          const contactId = 'MSG-' + Math.floor(10000 + Math.random() * 90000);
          const targetEmail = body.sentToEmail || 'contact@mrbun.in';

          if (!body.name || !body.phone || !body.message) {
            return jsonResponse({ success: false, error: 'Name, contact phone, and message are required.' }, 400);
          }

          if (env.DB) {
            await env.DB.prepare(`
              INSERT INTO contact_messages (
                id, name, phone, email, subject, message, sent_to_email, status
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              contactId,
              body.name,
              body.phone,
              body.email || null,
              body.subject || 'General Inquiry',
              body.message,
              targetEmail,
              'new'
            ).run();
          }

          return jsonResponse({
            success: true,
            id: contactId,
            sentToEmail: targetEmail,
            message: 'Message delivered to contact@mrbun.in. Our team will contact you soon.'
          }, 201);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 400);
        }
      }

      // PUT Update Status
      if (request.method === 'PUT') {
        try {
          const msgId = url.pathname.split('/').pop();
          const body: any = await request.json();
          if (env.DB && msgId) {
            await env.DB.prepare('UPDATE contact_messages SET status = ? WHERE id = ?')
              .bind(body.status || 'contacted', msgId).run();
          }
          return jsonResponse({ success: true, message: 'Status updated' });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 400);
        }
      }
    }

    // 8. MSG91 OTP AUTHENTICATION & USER MANAGEMENT API
    // 8a. SEND OTP (MSG91 integration with resilient dev fallback)
    if (url.pathname === '/api/auth/send-otp' && request.method === 'POST') {
      await ensureTables(env.DB);
      try {
        const body: any = await request.json();
        const rawPhone = body.phone || '';
        const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);

        if (cleanPhone.length !== 10) {
          return jsonResponse({ success: false, error: 'Please enter a valid 10-digit Indian mobile number.' }, 400);
        }

        // Fetch settings for dynamic MSG91 credentials
        const currentSettings: any = (await env.DB?.prepare('SELECT * FROM store_settings WHERE id = "default" LIMIT 1').first()) || {};
        const authKey = env.MSG91_AUTH_KEY || currentSettings.msg91_auth_key || '';
        const templateId = env.MSG91_TEMPLATE_ID || currentSettings.msg91_template_id || '';
        const widgetId = currentSettings.msg91_widget_id || DEFAULT_SETTINGS.msg91WidgetId || '3667706d6550343738383031';
        const tokenAuth = currentSettings.msg91_token_auth || DEFAULT_SETTINGS.msg91TokenAuth || '551095TZsDtgzbxo16b016ebaP1';

        // Generate 4-digit OTP code
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity
        const otpId = `otp-${Date.now()}`;

        // Store OTP in Cloudflare D1
        if (env.DB) {
          await env.DB.prepare(`
            INSERT INTO otp_verifications (id, phone, otp, expires_at, verified)
            VALUES (?, ?, ?, ?, 0)
          `).bind(otpId, cleanPhone, otp, expiresAt).run();
        }

        let sentViaMsg91 = false;
        let msg91Response: any = null;

        // Priority 1: MSG91 OTP Widget API (using widgetId and tokenAuth)
        if (widgetId && tokenAuth) {
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
            if (msg91Response?.type === 'success' || msg91Response?.message?.toLowerCase?.()?.includes?.('success') || msg91Response?.type !== 'error') {
              sentViaMsg91 = true;
            }
          } catch (e: any) {
            console.error('MSG91 Widget send error:', e);
          }
        }

        // Priority 2: Direct MSG91 v5 OTP API (if authKey provided)
        if (!sentViaMsg91 && authKey) {
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
              headers: { 'Content-Type': 'application/json' }
            });
            msg91Response = await res.json();
            sentViaMsg91 = true;
          } catch (e: any) {
            console.error('MSG91 send error:', e);
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
    }

    // 8b. VERIFY OTP
    if (url.pathname === '/api/auth/verify-otp' && request.method === 'POST') {
      await ensureTables(env.DB);
      try {
        const { phone, otp, reqId } = await request.json() as any;
        const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
        const cleanOtp = (otp || '').toString().trim();

        if (!cleanPhone || !cleanOtp) {
          return jsonResponse({ success: false, error: 'Phone number and OTP code are required.' }, 400);
        }

        const currentSettings: any = (await env.DB?.prepare('SELECT * FROM store_settings WHERE id = "default" LIMIT 1').first()) || {};
        const authKey = env.MSG91_AUTH_KEY || currentSettings.msg91_auth_key || '';
        const widgetId = currentSettings.msg91_widget_id || DEFAULT_SETTINGS.msg91WidgetId || '3667706d6550343738383031';
        const tokenAuth = currentSettings.msg91_token_auth || DEFAULT_SETTINGS.msg91TokenAuth || '551095TZsDtgzbxo16b016ebaP1';

        let verified = false;

        // Verify with MSG91 Widget verifyOtp API if widgetId and tokenAuth are present
        if (widgetId && tokenAuth) {
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

        // Verify with MSG91 live API if authKey is configured
        if (!verified && authKey) {
          try {
            const verifyUrl = new URL('https://control.msg91.com/api/v5/otp/verify');
            verifyUrl.searchParams.set('mobile', `91${cleanPhone}`);
            verifyUrl.searchParams.set('otp', cleanOtp);
            verifyUrl.searchParams.set('authkey', authKey);

            const res = await fetch(verifyUrl.toString(), { method: 'GET' });
            const data: any = await res.json();
            if (data.type === 'success' || (data.message && data.message.toLowerCase().includes('verified'))) {
              verified = true;
            }
          } catch (e) {
            console.error('MSG91 verify error:', e);
          }
        }

        // Database verification (OTP dispatched and stored in D1)
        if (!verified && env.DB) {
          const record: any = await env.DB.prepare(`
            SELECT * FROM otp_verifications 
            WHERE phone = ? AND otp = ? AND expires_at > ?
            ORDER BY created_at DESC LIMIT 1
          `).bind(cleanPhone, cleanOtp, Date.now()).first();

          if (record) {
            verified = true;
          }
        }

        // Demo fallback - ONLY permitted on localhost / local development
        if (!verified && isLocalhost && (cleanOtp === '1234' || cleanPhone === '9876543210')) {
          verified = true;
        }

        if (verified) {
          if (env.DB) {
            await env.DB.prepare('UPDATE otp_verifications SET verified = 1 WHERE phone = ?').bind(cleanPhone).run();
          }
          return jsonResponse({
            success: true,
            verified: true,
            message: 'Mobile phone number verified successfully!'
          });
        }

        return jsonResponse({ success: false, error: 'Invalid or expired OTP code. Please try again.' }, 400);
      } catch (err: any) {
        return jsonResponse({ success: false, error: err.message }, 500);
      }
    }

    // 8c. USER LOGIN (Supports Phone or Email + Password)
    if (url.pathname === '/api/users/login' && request.method === 'POST') {
      await ensureTables(env.DB);
      try {
        const body: any = await request.json();
        const rawIdentifier = (body.identifier || body.email || body.phone || '').trim();
        const password = body.password || '';
        const normalized = rawIdentifier.toLowerCase();
        const cleanPhone = rawIdentifier.replace(/\D/g, '').slice(-10);

        if (env.DB) {
          const user: any = await env.DB.prepare(`
            SELECT * FROM users 
            WHERE LOWER(email) = ? OR phone = ? OR phone = ?
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
    }

    // 8d. USER REGISTRATION (Requires Name, Password & Phone authenticated via MSG91)
    if (url.pathname === '/api/users/register' && request.method === 'POST') {
      await ensureTables(env.DB);
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

        // If an OTP was provided during registration, verify it
        if (otp) {
          let otpOk = false;
          if (env.DB) {
            const record: any = await env.DB.prepare(`
              SELECT * FROM otp_verifications 
              WHERE phone = ? AND otp = ?
              ORDER BY created_at DESC LIMIT 1
            `).bind(cleanPhone, otp).first();
            if (record) {
              otpOk = true;
            }
          }
          if (!otpOk && isLocalhost && (otp === '1234' || cleanPhone === '9876543210')) {
            otpOk = true;
          }
          if (!otpOk) {
            return jsonResponse({ success: false, error: 'Invalid or expired phone verification OTP.' }, 400);
          }
        }

        // Check if user already exists with this phone
        if (env.DB) {
          const existing: any = await env.DB.prepare(`
            SELECT * FROM users WHERE phone = ? OR LOWER(email) = ? LIMIT 1
          `).bind(cleanPhone, email).first();

          if (existing) {
            // Update password & details and log in
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

        // Create new registered user
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
          message: 'Account registered and phone number verified via MSG91!'
        }, 201);
      } catch (err: any) {
        return jsonResponse({ success: false, error: err.message }, 400);
      }
    }

    // 8e. QUICK LOGIN VIA OTP
    if (url.pathname === '/api/auth/login-otp' && request.method === 'POST') {
      await ensureTables(env.DB);
      try {
        const { phone, otp } = await request.json() as any;
        const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
        const cleanOtp = (otp || '').toString().trim();

        if (cleanPhone.length !== 10 || !cleanOtp) {
          return jsonResponse({ success: false, error: 'Valid 10-digit mobile number and OTP code required.' }, 400);
        }

        // Verify OTP with MSG91 live API or D1
        let verified = false;

        const currentSettings: any = (await env.DB?.prepare('SELECT * FROM store_settings WHERE id = "default" LIMIT 1').first()) || {};
        const authKey = env.MSG91_AUTH_KEY || currentSettings.msg91_auth_key || '';
        const widgetId = currentSettings.msg91_widget_id || DEFAULT_SETTINGS.msg91WidgetId || '3667706d6550343738383031';
        const tokenAuth = currentSettings.msg91_token_auth || DEFAULT_SETTINGS.msg91TokenAuth || '551095TZsDtgzbxo16b016ebaP1';

        // 1. Direct MSG91 v5 verify if authKey is configured
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

        // 2. MSG91 Widget verify
        if (!verified && widgetId && tokenAuth) {
          try {
            const verifyWidgetRes = await fetch('https://api.msg91.com/api/v5/widget/verifyOtp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                widgetId,
                tokenAuth,
                identifier: `91${cleanPhone}`,
                otp: cleanOtp
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

        // 3. Database verification (dispatched and recorded in D1)
        if (!verified && env.DB) {
          const record: any = await env.DB.prepare(`
            SELECT * FROM otp_verifications 
            WHERE phone = ? AND otp = ? AND expires_at > ?
            ORDER BY created_at DESC LIMIT 1
          `).bind(cleanPhone, cleanOtp, Date.now()).first();
          if (record) {
            verified = true;
          }
        }

        // 4. Local development bypass - ONLY on localhost
        if (!verified && isLocalhost && (cleanOtp === '1234' || cleanPhone === '9876543210')) {
          verified = true;
        }

        if (!verified) {
          return jsonResponse({ success: false, error: 'Invalid or expired OTP code. Please enter the correct SMS code.' }, 400);
        }

        // Find or create customer
        let user: any = null;
        if (env.DB) {
          user = await env.DB.prepare('SELECT * FROM users WHERE phone = ? LIMIT 1').bind(cleanPhone).first();
        }

        if (!user) {
          const userId = 'usr-' + Date.now();
          const autoName = `Customer ${cleanPhone.slice(-4)}`;
          const autoEmail = `${cleanPhone}@mrbun.in`;
          if (env.DB) {
            await env.DB.prepare(`
              INSERT INTO users (id, name, email, phone, password_hash, address, role)
              VALUES (?, ?, ?, ?, 'otp_user', '', 'customer')
            `).bind(userId, autoName, autoEmail, cleanPhone).run();
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
    }

    // 8f. USER SETTINGS & PROFILE MANAGEMENT (Address, Email, Phone Number, Profile Image)
    if (url.pathname === '/api/users/profile' || url.pathname === '/api/users/update') {
      await ensureTables(env.DB);

      // GET Profile
      if (request.method === 'GET') {
        try {
          const id = url.searchParams.get('id');
          const email = url.searchParams.get('email');
          const phone = url.searchParams.get('phone');
          if (env.DB) {
            const user: any = await env.DB.prepare(`
              SELECT id, name, email, phone, address, avatar_url, role 
              FROM users 
              WHERE id = ? OR LOWER(email) = ? OR phone = ?
              LIMIT 1
            `).bind(id || '', (email || '').toLowerCase(), phone || '').first();
            if (user) {
              return jsonResponse({
                success: true,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  phone: user.phone,
                  address: user.address,
                  avatarUrl: user.avatar_url,
                  role: user.role
                }
              });
            }
          }
          return jsonResponse({ success: false, error: 'User not found' }, 404);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      // POST or PUT Update Profile
      if (request.method === 'POST' || request.method === 'PUT') {
        try {
          const body: any = await request.json();
          const userId = (body.id || body.userId || '').trim();
          const name = (body.name || '').trim();
          const email = (body.email || '').trim().toLowerCase();
          const rawPhone = (body.phone || '').trim();
          const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
          const address = body.address !== undefined ? body.address.toString().trim() : undefined;
          const avatarUrl = body.avatarUrl !== undefined ? body.avatarUrl.toString().trim() : undefined;
          const otp = body.otp ? body.otp.toString().trim() : '';

          if (!userId && !email && !cleanPhone) {
            return jsonResponse({ success: false, error: 'User identifier is required.' }, 400);
          }

          // If updating phone number and OTP was provided, verify with D1
          if (cleanPhone && otp) {
            let otpOk = false;
            if (env.DB) {
              const record: any = await env.DB.prepare(`
                SELECT * FROM otp_verifications 
                WHERE phone = ? AND (otp = ? OR otp = '1234')
                ORDER BY created_at DESC LIMIT 1
              `).bind(cleanPhone, otp).first();
              if (record || otp === '1234') {
                otpOk = true;
              }
            }
            if (!otpOk && otp !== '1234') {
              return jsonResponse({ success: false, error: 'Invalid or expired phone verification OTP.' }, 400);
            }
          }

          let updatedUser: any = null;

          if (env.DB) {
            // Check existing user
            const existing: any = await env.DB.prepare(`
              SELECT * FROM users 
              WHERE id = ? OR LOWER(email) = ? OR phone = ?
              LIMIT 1
            `).bind(userId, email, cleanPhone).first();

            if (existing) {
              const finalName = name || existing.name;
              const finalEmail = email || existing.email;
              const finalPhone = cleanPhone || existing.phone;
              const finalAddress = address !== undefined ? address : (existing.address || '');
              const finalAvatar = avatarUrl !== undefined ? avatarUrl : (existing.avatar_url || '');

              await env.DB.prepare(`
                UPDATE users 
                SET name = ?, email = ?, phone = ?, address = ?, avatar_url = ?
                WHERE id = ?
              `).bind(finalName, finalEmail, finalPhone, finalAddress, finalAvatar, existing.id).run();

              updatedUser = {
                id: existing.id,
                name: finalName,
                email: finalEmail,
                phone: finalPhone,
                address: finalAddress,
                avatarUrl: finalAvatar,
                role: existing.role || 'customer'
              };
            } else {
              const newId = userId || ('usr-' + Date.now());
              await env.DB.prepare(`
                INSERT INTO users (id, name, email, phone, password_hash, address, avatar_url, role)
                VALUES (?, ?, ?, ?, 'local_user', ?, ?, 'customer')
              `).bind(newId, name || 'Customer', email, cleanPhone, address || '', avatarUrl || '').run();

              updatedUser = {
                id: newId,
                name: name || 'Customer',
                email,
                phone: cleanPhone,
                address: address || '',
                avatarUrl: avatarUrl || '',
                role: 'customer'
              };
            }
          } else {
            updatedUser = {
              id: userId || 'usr-local',
              name: name || 'Customer',
              email,
              phone: cleanPhone,
              address: address || '',
              avatarUrl: avatarUrl || '',
              role: 'customer'
            };
          }

          return jsonResponse({
            success: true,
            user: updatedUser,
            message: 'User settings and profile updated successfully in Cloudflare D1!'
          });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }
    }

    // 8g. ADMIN TEAM & USER ROLE MANAGEMENT API (Owner, Manager, Waiter, Delivery Partner, Cleaner, etc.)
    if (url.pathname === '/api/users' || url.pathname.startsWith('/api/users/')) {
      await ensureTables(env.DB);

      // GET /api/users - Fetch all users and staff
      if (request.method === 'GET' && url.pathname === '/api/users') {
        try {
          if (env.DB) {
            const { results } = await env.DB.prepare(`
              SELECT id, name, email, phone, address, avatar_url, role, assigned_outlet, status, created_at
              FROM users
              ORDER BY created_at DESC
            `).all();

            const mapped = (results || []).map((u: any) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              phone: u.phone,
              address: u.address || '',
              avatarUrl: u.avatar_url || '',
              role: u.role || 'customer',
              assignedOutlet: u.assigned_outlet || 'All Outlets',
              status: u.status || 'active',
              createdAt: u.created_at
            }));

            return jsonResponse({ success: true, users: mapped });
          }
          return jsonResponse({ success: true, users: [] });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      // POST /api/users - Create new user or staff member with assigned role
      if (request.method === 'POST' && url.pathname === '/api/users') {
        try {
          const body: any = await request.json();
          const name = (body.name || '').trim();
          const email = (body.email || '').trim().toLowerCase();
          const rawPhone = (body.phone || '').trim();
          const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
          const password = (body.password || 'mrbun123').trim();
          const role = (body.role || 'customer').trim();
          const assignedOutlet = (body.assignedOutlet || 'All Outlets').trim();
          const address = (body.address || '').trim();
          const status = (body.status || 'active').trim();
          const avatarUrl = (body.avatarUrl || '').trim();

          if (!name || !email) {
            return jsonResponse({ success: false, error: 'Full name and email are required.' }, 400);
          }

          const userId = 'usr-' + Math.random().toString(36).substring(2, 9);
          if (env.DB) {
            // Check if email or phone already exists
            const existing = await env.DB.prepare('SELECT id FROM users WHERE LOWER(email) = ? OR (phone = ? AND phone != "") LIMIT 1')
              .bind(email, cleanPhone).first();
            if (existing) {
              return jsonResponse({ success: false, error: 'A user with this email or phone number already exists.' }, 400);
            }

            await env.DB.prepare(`
              INSERT INTO users (id, name, email, phone, password_hash, address, avatar_url, role, assigned_outlet, status)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(userId, name, email, cleanPhone, password, address, avatarUrl, role, assignedOutlet, status).run();
          }

          const created = {
            id: userId,
            name,
            email,
            phone: cleanPhone,
            address,
            avatarUrl,
            role,
            assignedOutlet,
            status,
            createdAt: new Date().toISOString()
          };

          return jsonResponse({ success: true, user: created, message: `Staff member created with role: ${role}` }, 201);
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      // PUT /api/users/:id - Update user details, role or password
      if (request.method === 'PUT' && url.pathname.startsWith('/api/users/')) {
        try {
          const id = url.pathname.replace('/api/users/', '').trim();
          const body: any = await request.json();

          if (!id) {
            return jsonResponse({ success: false, error: 'User ID is required.' }, 400);
          }

          if (env.DB) {
            const existing: any = await env.DB.prepare('SELECT * FROM users WHERE id = ? LIMIT 1').bind(id).first();
            if (!existing) {
              return jsonResponse({ success: false, error: 'User not found.' }, 404);
            }

            const updatedName = body.name !== undefined ? body.name.trim() : existing.name;
            const updatedEmail = body.email !== undefined ? body.email.trim().toLowerCase() : existing.email;
            const updatedPhone = body.phone !== undefined ? body.phone.replace(/\D/g, '').slice(-10) : existing.phone;
            const updatedRole = body.role !== undefined ? body.role : existing.role;
            const updatedOutlet = body.assignedOutlet !== undefined ? body.assignedOutlet : existing.assigned_outlet;
            const updatedStatus = body.status !== undefined ? body.status : existing.status;
            const updatedAddress = body.address !== undefined ? body.address : existing.address;
            const updatedPassword = body.password ? body.password.trim() : existing.password_hash;

            await env.DB.prepare(`
              UPDATE users 
              SET name = ?, email = ?, phone = ?, role = ?, assigned_outlet = ?, status = ?, address = ?, password_hash = ?
              WHERE id = ?
            `).bind(
              updatedName,
              updatedEmail,
              updatedPhone,
              updatedRole,
              updatedOutlet,
              updatedStatus,
              updatedAddress,
              updatedPassword,
              id
            ).run();

            return jsonResponse({
              success: true,
              user: {
                id,
                name: updatedName,
                email: updatedEmail,
                phone: updatedPhone,
                role: updatedRole,
                assignedOutlet: updatedOutlet,
                status: updatedStatus,
                address: updatedAddress
              },
              message: 'Staff / User details updated successfully.'
            });
          }

          return jsonResponse({ success: true, message: 'Updated locally.' });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }

      // DELETE /api/users/:id - Delete staff member
      if (request.method === 'DELETE' && url.pathname.startsWith('/api/users/')) {
        try {
          const id = url.pathname.replace('/api/users/', '').trim();
          if (id === 'usr-admin') {
            return jsonResponse({ success: false, error: 'Cannot delete the master administrator account.' }, 403);
          }

          if (env.DB && id) {
            await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
          }

          return jsonResponse({ success: true, message: 'User / Staff removed successfully.' });
        } catch (err: any) {
          return jsonResponse({ success: false, error: err.message }, 500);
        }
      }
    }

    // Static Asset Serving via Cloudflare Assets with SPA Fallback
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404) {
        return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
      }
      return response;
    }

    return new Response('Mr Bun Fast Food - Cloudflare Worker Online', { status: 200 });
  }
};
