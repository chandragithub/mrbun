-- Mr Bun Fast Food Database Schema (Cloudflare D1 SQLite)
-- Database Name: mrbun (0b367436-034c-462f-8811-c1ac76ea2023)
-- Subdomain: mrbun.ceansystech.workers.dev
-- Helpline: 9476088111 | Email: contact@mrbun.in | FSSAI: 22926112000173

-- 1. Store Settings (Brand Identity, Logo, Phone, Email, Address, About Us, FSSAI, Payments)
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

-- 2. Dynamic Menu Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'burgers', 'pizzas', 'sandwiches', 'mocktails', 'sides', 'combos'
    description TEXT,
    price REAL NOT NULL,
    original_price REAL,
    is_veg INTEGER DEFAULT 1, -- 1 = veg, 0 = non-veg
    spicy_level INTEGER DEFAULT 1, -- 0 to 3
    rating REAL DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 12,
    image TEXT NOT NULL,
    is_popular INTEGER DEFAULT 0,
    is_new INTEGER DEFAULT 1,
    tags TEXT,
    options_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Dynamic Offers & Discounts Table (Percentage OFF or Direct Cash Benefit)
CREATE TABLE IF NOT EXISTS offers (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL, -- 'percentage' or 'flat'
    discount_value REAL NOT NULL,
    min_order_amount REAL DEFAULT 0,
    max_discount REAL,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Multiple Outlets & Kitchens Table
CREATE TABLE IF NOT EXISTS outlets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    address TEXT NOT NULL,
    landmark TEXT,
    phone TEXT NOT NULL,
    timings TEXT NOT NULL,
    status TEXT NOT NULL, -- 'Open Now', 'Late Night Available', 'Coming Soon', 'Renovating'
    image TEXT NOT NULL,
    features_json TEXT,
    seating_capacity TEXT,
    is_flagship INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Customer Orders & Approvals Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_type TEXT DEFAULT 'delivery', -- 'delivery' or 'pickup'
    delivery_address TEXT NOT NULL,
    items_json TEXT NOT NULL,
    subtotal REAL NOT NULL,
    discount REAL DEFAULT 0,
    tax REAL NOT NULL,
    delivery_fee REAL DEFAULT 0,
    total_amount REAL NOT NULL,
    payment_method TEXT DEFAULT 'upi', -- 'cod', 'upi', 'card'
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid'
    order_status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'baking', 'out_for_delivery', 'delivered', 'cancelled'
    order_notes TEXT,
    fssai_license TEXT DEFAULT '22926112000173',
    admin_notification_json TEXT,
    customer_confirmation_json TEXT,
    approved_at TEXT,
    approved_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Party & Catering Bookings Table
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
    payment_method TEXT DEFAULT 'online', -- 'online', 'upi', 'cash_before_prep'
    payment_status TEXT DEFAULT 'pending',
    special_notes TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'catering_scheduled', 'completed', 'cancelled'
    admin_notification_json TEXT,
    customer_confirmation_json TEXT,
    approved_at TEXT,
    approved_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6b. Curated Celebration Packages Table (Dynamic Admin Package Customization)
CREATE TABLE IF NOT EXISTS party_packages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    min_guests INTEGER DEFAULT 10,
    price REAL NOT NULL,
    price_type TEXT DEFAULT 'per_plate', -- 'per_plate' or 'fixed'
    badge TEXT,
    image TEXT NOT NULL,
    includes_json TEXT NOT NULL,
    recommended_for TEXT,
    popular_items_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Registered Users & Admins
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    address TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer', -- 'customer' or 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Franchise Expressions of Interest
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

-- 9. Customer Food & Service Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    rating REAL NOT NULL,
    comment TEXT NOT NULL,
    menu_item TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. MSG91 OTP Verifications Table
CREATE TABLE IF NOT EXISTS otp_verifications (
    id TEXT PRIMARY KEY,
    phone TEXT NOT NULL,
    otp TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    verified INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
