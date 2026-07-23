// ─── routes/orders.js ─────────────────────────────────────────────────────────
// GET   /api/orders              → all orders (admin)
// POST  /api/orders              → place new order (public, from checkout)
// PATCH /api/orders/:id/status   → update order status (admin)

const router      = require("express").Router();
const { pool }    = require("../db");
const requireAuth = require("../middleware/auth");

// ── GET /api/orders (admin) ──────────────────────────────────────────────────
router.get("/", requireAuth, async (req, res) => {
  try {
    const { status } = req.query;
    let query  = "SELECT * FROM orders ORDER BY created_at DESC";
    let params = [];
    if (status && status !== "all") {
      query  = "SELECT * FROM orders WHERE status=$1 ORDER BY created_at DESC";
      params = [status];
    }
    const { rows } = await pool.query(query, params);
    // Normalise items field
    const orders = rows.map(o => ({
      ...o,
      items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
    }));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/orders (public) ────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const {
      customer_name, phone, email, address, city, pincode,
      items, subtotal, delivery_fee, total, payment,
      delivery_date, delivery_slot, notes,
    } = req.body;

    if (!customer_name || !phone || !items || !total) {
      return res.status(400).json({ error: "customer_name, phone, items, total are required" });
    }

    // Generate order ID: SD + timestamp suffix
    const orderId = `SD${Date.now()}`;

    const { rows } = await pool.query(
      `INSERT INTO orders
         (id, customer_name, phone, email, address, city, pincode,
          items, subtotal, delivery_fee, total, payment,
          delivery_date, delivery_slot, notes, status)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'pending')
       RETURNING *`,
      [
        orderId, customer_name, phone, email || "", address || "", city || "", pincode || "",
        JSON.stringify(items), subtotal || 0, delivery_fee || 0, total,
        payment || "cod", delivery_date || "", delivery_slot || "", notes || "",
      ]
    );

    // Upsert customer record (creates or updates order count + spent)
    await pool.query(
      `INSERT INTO customers(name, phone, email, city, orders, spent)
       VALUES($1,$2,$3,$4,1,$5)
       ON CONFLICT(phone) DO UPDATE
         SET orders = customers.orders + 1,
             spent  = customers.spent + $5`,
      [customer_name, phone, email || "", city || "", total]
    );

    const order = rows[0];
    res.status(201).json({ ...order, items: typeof order.items === "string" ? JSON.parse(order.items) : order.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/orders/:id/status (admin) ─────────────────────────────────────
router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status required" });

    const { rows } = await pool.query(
      "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *",
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Order not found" });
    const o = rows[0];
    res.json({ ...o, items: typeof o.items === "string" ? JSON.parse(o.items) : o.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
