-- Mr Bun Fast Food Database Schema (Cloudflare D1 SQLite)
-- Company: Mr Bun | FSSAI: 22926112000173 | Contact: 9476088111 / contact@mrbun.in

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
    reviews_count INTEGER DEFAULT 120,
    image TEXT NOT NULL,
    is_popular INTEGER DEFAULT 0,
    tags TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    payment_method TEXT DEFAULT 'cod', -- 'cod', 'upi', 'card'
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid'
    order_status TEXT DEFAULT 'received', -- 'received', 'preparing', 'baking', 'out_for_delivery', 'delivered'
    order_notes TEXT,
    fssai_license TEXT DEFAULT '22926112000173',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS party_orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'Birthday Party', 'Corporate Event', 'House Party', 'College Fest', 'Game Night'
    guest_count INTEGER NOT NULL,
    event_date TEXT NOT NULL,
    event_time TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    package_selected TEXT,
    customized_items_json TEXT,
    budget_estimate REAL NOT NULL,
    special_notes TEXT,
    status TEXT DEFAULT 'inquiry_received', -- 'inquiry_received', 'confirmed', 'catering_scheduled', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    rating REAL NOT NULL,
    comment TEXT NOT NULL,
    menu_item TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
