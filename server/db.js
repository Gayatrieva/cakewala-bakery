// ─── db.js ────────────────────────────────────────────────────────────────────
// PostgreSQL connection pool + schema creation + seed data.
// All tables are created with IF NOT EXISTS so re-running is safe.

require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ── Schema ──────────────────────────────────────────────────────────────────
const SCHEMA = `
  CREATE TABLE IF NOT EXISTS admins (
    id         SERIAL PRIMARY KEY,
    email      TEXT UNIQUE NOT NULL,
    password   TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS cakes (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    category    TEXT NOT NULL,
    price       INTEGER NOT NULL,
    img         TEXT,
    rating      NUMERIC(3,1) DEFAULT 5.0,
    reviews     INTEGER DEFAULT 0,
    badge       TEXT DEFAULT '',
    flavors     TEXT[],
    weights     JSONB,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS orders (
    id            TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone         TEXT NOT NULL,
    email         TEXT,
    address       TEXT,
    city          TEXT,
    pincode       TEXT,
    items         JSONB NOT NULL,
    subtotal      INTEGER NOT NULL,
    delivery_fee  INTEGER DEFAULT 0,
    total         INTEGER NOT NULL,
    payment       TEXT DEFAULT 'cod',
    delivery_date TEXT,
    delivery_slot TEXT,
    notes         TEXT,
    status        TEXT DEFAULT 'pending',
    created_at    TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS customers (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT,
    phone      TEXT UNIQUE NOT NULL,
    city       TEXT,
    orders     INTEGER DEFAULT 0,
    spent      INTEGER DEFAULT 0,
    joined     TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    city       TEXT DEFAULT 'India',
    rating     INTEGER DEFAULT 5,
    text       TEXT NOT NULL,
    avatar     TEXT,
    status     TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS custom_requests (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    phone       TEXT NOT NULL,
    email       TEXT,
    shape       TEXT,
    size        TEXT,
    flavor      TEXT,
    tiers       INTEGER DEFAULT 1,
    occasion    TEXT,
    budget      TEXT,
    delivery_date TEXT,
    message     TEXT,
    status      TEXT DEFAULT 'new',
    created_at  TIMESTAMPTZ DEFAULT NOW()
  );
`;

// ── Seed Data ────────────────────────────────────────────────────────────────
const SEED_CAKES = [
  { name: "Strawberry Dream",       category: "birthday",    price: 799,  img: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&q=80", rating: 4.9, reviews: 142, badge: "bestseller", flavors: ["Vanilla","Strawberry","Butterscotch"], weights: [{w:"0.5kg",p:799},{w:"1kg",p:1299},{w:"2kg",p:2299}], description: "A dreamy three-layer vanilla sponge filled with fresh strawberry compote and whipped cream." },
  { name: "Chocolate Truffle",      category: "birthday",    price: 899,  img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80", rating: 5.0, reviews: 218, badge: "bestseller", flavors: ["Dark Chocolate","Milk Chocolate","Hazelnut"], weights: [{w:"0.5kg",p:899},{w:"1kg",p:1499},{w:"2kg",p:2699}], description: "Rich, decadent dark chocolate ganache cake with truffle filling and mirror-glaze finish." },
  { name: "White Elegance",         category: "wedding",     price: 3499, img: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80", rating: 4.8, reviews: 76,  badge: "featured",    flavors: ["Vanilla","Rose","Lemon"], weights: [{w:"2kg",p:3499},{w:"3kg",p:4999},{w:"5kg",p:7999}], description: "A four-tier masterpiece adorned with hand-crafted sugar flowers and edible gold leaf." },
  { name: "Rose Garden Delight",    category: "anniversary", price: 1299, img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80", rating: 4.7, reviews: 94,  badge: "new",         flavors: ["Rose","Lychee","Raspberry"], weights: [{w:"0.5kg",p:1299},{w:"1kg",p:1999},{w:"2kg",p:3499}], description: "Rose-infused cream, lychee compote, and hand-piped buttercream petals." },
  { name: "Red Velvet Romance",     category: "anniversary", price: 999,  img: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&q=80", rating: 4.8, reviews: 109, badge: "bestseller",  flavors: ["Red Velvet","Cream Cheese","Vanilla"], weights: [{w:"0.5kg",p:999},{w:"1kg",p:1599},{w:"2kg",p:2899}], description: "Velvety crimson sponge with cream cheese frosting and edible rose petals." },
  { name: "Rainbow Celebration",    category: "birthday",    price: 849,  img: "https://images.unsplash.com/photo-1562440499-64b9a5a35975?w=600&q=80", rating: 4.6, reviews: 83,  badge: "",            flavors: ["Vanilla","Funfetti","Cotton Candy"], weights: [{w:"0.5kg",p:849},{w:"1kg",p:1399},{w:"2kg",p:2499}], description: "Six vibrant rainbow layers with fluffy cloud frosting and rainbow sprinkles." },
  { name: "Blush Cupcake Box",      category: "cupcake",     price: 599,  img: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&q=80", rating: 4.9, reviews: 201, badge: "bestseller",  flavors: ["Vanilla","Strawberry","Chocolate"], weights: [{w:"6 pcs",p:599},{w:"12 pcs",p:1099},{w:"24 pcs",p:1999}], description: "Hand-decorated blush pink cupcakes with swirled buttercream and edible glitter." },
  { name: "Memory Lane Photo Cake", category: "photo",       price: 1199, img: "https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?w=600&q=80", rating: 4.7, reviews: 67,  badge: "",            flavors: ["Vanilla","Chocolate","Pineapple"], weights: [{w:"0.5kg",p:1199},{w:"1kg",p:1699},{w:"2kg",p:2999}], description: "Cherish memories with an edible photo print on velvety cream frosting." },
  { name: "Designer Fantasy",       category: "custom",      price: 1999, img: "https://images.unsplash.com/photo-1488477304112-4944851de03d?w=600&q=80", rating: 5.0, reviews: 38,  badge: "featured",    flavors: ["Chocolate","Vanilla","Caramel"], weights: [{w:"1kg",p:1999},{w:"2kg",p:3499},{w:"3kg",p:4999}], description: "A completely bespoke creation — you dream it, our artists craft it." },
  { name: "Golden Lemon Drizzle",   category: "anniversary", price: 799,  img: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=80", rating: 4.5, reviews: 52,  badge: "new",         flavors: ["Lemon","Elderflower","Vanilla"], weights: [{w:"0.5kg",p:799},{w:"1kg",p:1299},{w:"2kg",p:2299}], description: "Zesty lemon sponge drizzled with golden syrup and crystallised lemon zest." },
];

const SEED_TESTIMONIALS = [
  { name: "Priya Sharma",  city: "Mumbai",    rating: 5, text: "The Strawberry Dream for my daughter's birthday was absolutely stunning! Everyone at the party kept asking where I got it. The flavour was out of this world 🎂", avatar: "PS", status: "approved" },
  { name: "Arjun Mehta",   city: "Delhi",     rating: 5, text: "Ordered the White Elegance for our wedding. It was beyond our expectations — the sugar flowers looked real! Sweet Delights made our day even more special.", avatar: "AM", status: "approved" },
  { name: "Sneha Kapoor",  city: "Bangalore", rating: 5, text: "The custom designer cake for my husband's 40th was a masterpiece. They replicated his favourite cricket ground in fondant. Unbelievable attention to detail!", avatar: "SK", status: "approved" },
  { name: "Ravi Krishnan", city: "Chennai",   rating: 5, text: "Placed my order via WhatsApp at 9pm and the cake arrived fresh the next morning. Red Velvet Romance tasted even better than it looked!", avatar: "RK", status: "approved" },
  { name: "Meera Nair",    city: "Kochi",     rating: 5, text: "The cupcake box was the hit of our office party. 24 perfectly decorated cupcakes, all different toppings. Truly premium quality at a great price.", avatar: "MN", status: "approved" },
  { name: "Divya Pillai",  city: "Pune",      rating: 5, text: "Memory Lane Photo Cake was the most emotional gift I've ever given to my parents on their anniversary. The photo print was crystal clear!", avatar: "DP", status: "approved" },
];

const SEED_CUSTOMERS = [
  { name: "Priya Sharma",   email: "priya@email.com",  phone: "9876543210", city: "Mumbai",    orders: 5, spent: 6247  },
  { name: "Arjun Mehta",    email: "arjun@email.com",  phone: "9876543211", city: "Delhi",     orders: 3, spent: 8998  },
  { name: "Sneha Kapoor",   email: "sneha@email.com",  phone: "9876543212", city: "Bangalore", orders: 7, spent: 11247 },
  { name: "Ravi Krishnan",  email: "ravi@email.com",   phone: "9876543213", city: "Chennai",   orders: 2, spent: 3298  },
  { name: "Meera Nair",     email: "meera@email.com",  phone: "9876543214", city: "Kochi",     orders: 4, spent: 5596  },
  { name: "Divya Pillai",   email: "divya@email.com",  phone: "9876543215", city: "Pune",      orders: 6, spent: 9147  },
];

const SEED_ORDERS = [
  { id: "SD8472931", customer_name: "Priya Sharma",  phone: "9876543210", email: "priya@email.com",  address: "12 Marine Drive", city: "Mumbai",    pincode: "400001", items: [{name:"Strawberry Dream",weight:"1kg",flavor:"Vanilla",qty:1,price:1299}],  subtotal: 1299, delivery_fee: 0,  total: 1299, payment: "COD",    delivery_date: "2025-01-17", delivery_slot: "10–12pm", notes: "",               status: "delivered" },
  { id: "SD8472930", customer_name: "Arjun Mehta",   phone: "9876543211", email: "arjun@email.com",  address: "45 Connaught Pl", city: "Delhi",     pincode: "110001", items: [{name:"Chocolate Truffle",weight:"2kg",flavor:"Dark Chocolate",qty:1,price:2699}], subtotal: 2699, delivery_fee: 0,  total: 2699, payment: "Online", delivery_date: "2025-01-18", delivery_slot: "2–4pm",   notes: "",               status: "preparing" },
  { id: "SD8472929", customer_name: "Sneha Kapoor",  phone: "9876543212", email: "sneha@email.com",  address: "78 MG Road",      city: "Bangalore", pincode: "560001", items: [{name:"Designer Fantasy",weight:"3kg",flavor:"Chocolate",qty:1,price:4999}],  subtotal: 4999, delivery_fee: 0,  total: 4999, payment: "Online", delivery_date: "2025-01-20", delivery_slot: "10–12pm", notes: "Extra fondant",  status: "accepted" },
  { id: "SD8472928", customer_name: "Ravi Krishnan", phone: "9876543213", email: "ravi@email.com",   address: "23 Anna Salai",   city: "Chennai",   pincode: "600002", items: [{name:"Red Velvet Romance",weight:"1kg",flavor:"Red Velvet",qty:1,price:1599}], subtotal: 1599, delivery_fee: 0,  total: 1599, payment: "COD",    delivery_date: "2025-01-15", delivery_slot: "4–6pm",   notes: "",               status: "out_for_delivery" },
  { id: "SD8472927", customer_name: "Meera Nair",    phone: "9876543214", email: "meera@email.com",  address: "56 MG Road",      city: "Kochi",     pincode: "682001", items: [{name:"Blush Cupcake Box",weight:"24 pcs",flavor:"Vanilla",qty:1,price:1999}], subtotal: 1999, delivery_fee: 0,  total: 1999, payment: "Online", delivery_date: "2025-01-16", delivery_slot: "10–12pm", notes: "Office delivery",status: "pending" },
  { id: "SD8472926", customer_name: "Divya Pillai",  phone: "9876543215", email: "divya@email.com",  address: "90 FC Road",      city: "Pune",      pincode: "411004", items: [{name:"Memory Lane Photo Cake",weight:"1kg",flavor:"Vanilla",qty:1,price:1699}],subtotal: 1699, delivery_fee: 0,  total: 1699, payment: "Online", delivery_date: "2025-01-14", delivery_slot: "2–4pm",   notes: "",               status: "delivered" },
];

const SEED_CUSTOM_REQUESTS = [
  { name: "Kavya Rao",    phone: "9876543210", email: "kavya@email.com",   shape: "Heart",  size: "2kg", flavor: "Red Velvet", tiers: 2, occasion: "Anniversary", budget: "₹3,000–5,000",    delivery_date: "2025-01-22", message: "Pink theme with roses", status: "new" },
  { name: "Amir Khan",    phone: "9876543211", email: "amir@email.com",    shape: "Round",  size: "3kg", flavor: "Chocolate",  tiers: 3, occasion: "Birthday",     budget: "₹5,000–10,000",   delivery_date: "2025-01-25", message: "Football theme",        status: "reviewing" },
  { name: "Simran Kaur",  phone: "9876543212", email: "simran@email.com",  shape: "Tier",   size: "5kg", flavor: "Vanilla",    tiers: 4, occasion: "Wedding",      budget: "Above ₹10,000",   delivery_date: "2025-02-10", message: "White and gold theme",  status: "quoted" },
];

// ── Init: create tables + seed if empty ─────────────────────────────────────
async function initDB() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(SCHEMA);

    // Seed admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@sweetdelights.in";
    const adminPass  = process.env.ADMIN_PASSWORD || "admin123";
    const existing   = await client.query("SELECT id FROM admins WHERE email=$1", [adminEmail]);
    if (existing.rowCount === 0) {
      const hash = await bcrypt.hash(adminPass, 10);
      await client.query("INSERT INTO admins(email,password) VALUES($1,$2)", [adminEmail, hash]);
      console.log("✓ Admin account seeded");
    }

    // Seed cakes
    const cakeCount = await client.query("SELECT COUNT(*) FROM cakes");
    if (parseInt(cakeCount.rows[0].count) === 0) {
      for (const c of SEED_CAKES) {
        await client.query(
          `INSERT INTO cakes(name,category,price,img,rating,reviews,badge,flavors,weights,description)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [c.name, c.category, c.price, c.img, c.rating, c.reviews, c.badge, c.flavors, JSON.stringify(c.weights), c.description]
        );
      }
      console.log(`✓ ${SEED_CAKES.length} cakes seeded`);
    }

    // Seed testimonials
    const tCount = await client.query("SELECT COUNT(*) FROM testimonials");
    if (parseInt(tCount.rows[0].count) === 0) {
      for (const t of SEED_TESTIMONIALS) {
        await client.query(
          `INSERT INTO testimonials(name,city,rating,text,avatar,status) VALUES($1,$2,$3,$4,$5,$6)`,
          [t.name, t.city, t.rating, t.text, t.avatar, t.status]
        );
      }
      console.log(`✓ ${SEED_TESTIMONIALS.length} testimonials seeded`);
    }

    // Seed customers
    const cCount = await client.query("SELECT COUNT(*) FROM customers");
    if (parseInt(cCount.rows[0].count) === 0) {
      for (const c of SEED_CUSTOMERS) {
        await client.query(
          `INSERT INTO customers(name,email,phone,city,orders,spent) VALUES($1,$2,$3,$4,$5,$6)`,
          [c.name, c.email, c.phone, c.city, c.orders, c.spent]
        );
      }
      console.log(`✓ ${SEED_CUSTOMERS.length} customers seeded`);
    }

    // Seed orders
    const oCount = await client.query("SELECT COUNT(*) FROM orders");
    if (parseInt(oCount.rows[0].count) === 0) {
      for (const o of SEED_ORDERS) {
        await client.query(
          `INSERT INTO orders(id,customer_name,phone,email,address,city,pincode,items,subtotal,delivery_fee,total,payment,delivery_date,delivery_slot,notes,status)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
          [o.id, o.customer_name, o.phone, o.email, o.address, o.city, o.pincode,
           JSON.stringify(o.items), o.subtotal, o.delivery_fee, o.total, o.payment,
           o.delivery_date, o.delivery_slot, o.notes, o.status]
        );
      }
      console.log(`✓ ${SEED_ORDERS.length} orders seeded`);
    }

    // Seed custom requests
    const rCount = await client.query("SELECT COUNT(*) FROM custom_requests");
    if (parseInt(rCount.rows[0].count) === 0) {
      for (const r of SEED_CUSTOM_REQUESTS) {
        await client.query(
          `INSERT INTO custom_requests(name,phone,email,shape,size,flavor,tiers,occasion,budget,delivery_date,message,status)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
          [r.name, r.phone, r.email, r.shape, r.size, r.flavor, r.tiers, r.occasion, r.budget, r.delivery_date, r.message, r.status]
        );
      }
      console.log(`✓ ${SEED_CUSTOM_REQUESTS.length} custom requests seeded`);
    }

    await client.query("COMMIT");
    console.log("✓ Database ready");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("✗ DB init failed:", err.message);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB };
