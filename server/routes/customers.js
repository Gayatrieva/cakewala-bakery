// ─── routes/customers.js ──────────────────────────────────────────────────────
// GET /api/customers   → list all customers (admin)
// GET /api/customers/:id

const router      = require("express").Router();
const { pool }    = require("../db");
const requireAuth = require("../middleware/auth");

// ── GET /api/customers ───────────────────────────────────────────────────────
router.get("/", requireAuth, async (req, res) => {
  try {
    const { search } = req.query;
    let query  = "SELECT * FROM customers ORDER BY spent DESC";
    let params = [];
    if (search) {
      query  = "SELECT * FROM customers WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1 ORDER BY spent DESC";
      params = [`%${search}%`];
    }
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/customers/:id ───────────────────────────────────────────────────
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM customers WHERE id=$1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Customer not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
