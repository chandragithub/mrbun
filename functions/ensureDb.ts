// Helper to ensure all Cloudflare D1 SQLite tables and seed data exist
export const TABLE_SCHEMAS = [
  // 1. Store Settings
  `CREATE TABLE IF NOT EXISTS store_settings (
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
    msg91_widget_id TEXT,
    msg91_token_auth TEXT,
    payment_options_json TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // 2. Users (Staff & Master Admin)
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    address TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer',
    assigned_outlet TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // 3. Products
  `CREATE TABLE IF NOT EXISTS products (
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
  )`,

  // 4. Offers
  `CREATE TABLE IF NOT EXISTS offers (
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
  )`,

  // 5. Outlets
  `CREATE TABLE IF NOT EXISTS outlets (
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
  )`,

  // 6. Orders
  `CREATE TABLE IF NOT EXISTS orders (
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
  )`,

  // 7. Party Orders
  `CREATE TABLE IF NOT EXISTS party_orders (
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
  )`,

  // 8. Party Packages
  `CREATE TABLE IF NOT EXISTS party_packages (
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
  )`,

  // 9. Franchise Models
  `CREATE TABLE IF NOT EXISTS franchise_models (
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
  )`,

  // 10. Franchise Applications
  `CREATE TABLE IF NOT EXISTS franchise_applications (
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
  )`,

  // 11. OTP Verifications
  `CREATE TABLE IF NOT EXISTS otp_verifications (
    id TEXT PRIMARY KEY,
    phone TEXT NOT NULL,
    otp TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    verified INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // 12. Reviews
  `CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    rating REAL NOT NULL,
    comment TEXT NOT NULL,
    menu_item TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // 13. Contact Messages
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_to_email TEXT DEFAULT 'contact@mrbun.in',
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`
];

export async function ensureTables(db: any) {
  if (!db) return;

  for (const query of TABLE_SCHEMAS) {
    try {
      if (db.prepare) {
        await db.prepare(query).run();
      } else if (db.exec) {
        await db.exec(query);
      }
    } catch (e) {
      try {
        if (db.exec) await db.exec(query);
      } catch {}
    }
  }

  // Safe incremental column migrations
  const migrations = [
    'ALTER TABLE store_settings ADD COLUMN address TEXT',
    'ALTER TABLE store_settings ADD COLUMN about_story TEXT',
    'ALTER TABLE store_settings ADD COLUMN about_hero_title TEXT',
    'ALTER TABLE store_settings ADD COLUMN about_hero_description TEXT',
    'ALTER TABLE store_settings ADD COLUMN msg91_auth_key TEXT',
    'ALTER TABLE store_settings ADD COLUMN msg91_template_id TEXT',
    'ALTER TABLE store_settings ADD COLUMN msg91_widget_id TEXT',
    'ALTER TABLE store_settings ADD COLUMN msg91_token_auth TEXT',
    'ALTER TABLE users ADD COLUMN avatar_url TEXT',
    'ALTER TABLE users ADD COLUMN assigned_outlet TEXT',
    'ALTER TABLE users ADD COLUMN status TEXT DEFAULT "active"'
  ];

  for (const migration of migrations) {
    try {
      if (db.prepare) {
        await db.prepare(migration).run();
      } else if (db.exec) {
        await db.exec(migration);
      }
    } catch {}
  }

  // Seed master administrator account if it does not exist (with PBKDF2 hashed password)
  try {
    const existing = await db.prepare('SELECT id, password_hash FROM users WHERE id = "usr-admin" LIMIT 1').first();
    const adminHash = 'pbkdf2_sha256$100000$7903f652f6291f6482dba30db75340c0$3f1b6654d3f222a73db568aa269081a78f7cbb614552df468645173a23b0bbba';
    if (!existing) {
      await db.prepare(`
        INSERT OR IGNORE INTO users (id, name, email, phone, password_hash, role, address, assigned_outlet, status)
        VALUES ('usr-admin', 'Mr Bun Master Admin', 'admin@mrbun.in', '9476088111', ?, 'admin', 'Central Kitchen & HQ', 'All Outlets', 'active')
      `).bind(adminHash).run();
    } else if (existing.password_hash === 'admin123') {
      await db.prepare('UPDATE users SET password_hash = ? WHERE id = "usr-admin"').bind(adminHash).run();
    }
  } catch {}
}
