// ─── routes/customRequests.js ─────────────────────────────────────────────────
// GET  /api/custom-requests   → all requests (admin)
// POST /api/custom-requests   → submit new (public, from CustomCakePage)
// PATCH /api/custom-requests/:id/status  → update status (admin)

const router      = require("express").Router();
const { pool }    = require("../db");
const requireAuth = require("../middleware/auth");

// ── GET /api/custom-requests (admin) ────────────────────────────────────────
router.get("/", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM custom_requests ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/custom-requests (public) ──────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, shape, size, flavor, tiers, occasion, budget, delivery_date, message } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "name and phone are required" });

    const { rows } = await pool.query(
      `INSERT INTO custom_requests
         (name, phone, email, shape, size, flavor, tiers, occasion, budget, delivery_date, message, status)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'new') RETURNING *`,
      [name, phone, email || "", shape || "", size || "", flavor || "", tiers || 1, occasion || "", budget || "", delivery_date || "", message || ""]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/custom-requests/:id/status (admin) ────────────────────────────
router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status required" });
    const { rows } = await pool.query(
      "UPDATE custom_requests SET status=$1 WHERE id=$2 RETURNING *",
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Request not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
