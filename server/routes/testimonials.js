// ─── routes/testimonials.js ───────────────────────────────────────────────────
// GET    /api/testimonials          → approved only (public, for homepage carousel)
// GET    /api/testimonials/all      → all statuses (admin)
// POST   /api/testimonials          → submit new (public)
// PATCH  /api/testimonials/:id/approve  (admin)
// PATCH  /api/testimonials/:id/reject   (admin)
// DELETE /api/testimonials/:id          (admin)

const router      = require("express").Router();
const { pool }    = require("../db");
const requireAuth = require("../middleware/auth");

// ── GET /api/testimonials (public — approved only) ───────────────────────────
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM testimonials WHERE status='approved' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/testimonials/all (admin) ────────────────────────────────────────
router.get("/all", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM testimonials ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/testimonials (public — submit) ─────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, city, rating, text } = req.body;
    if (!name || !text) return res.status(400).json({ error: "name and text are required" });

    const avatar = name.slice(0, 2).toUpperCase();
    const { rows } = await pool.query(
      `INSERT INTO testimonials(name, city, rating, text, avatar, status)
       VALUES($1,$2,$3,$4,$5,'pending') RETURNING *`,
      [name, city || "India", Math.min(5, Math.max(1, Number(rating) || 5)), text, avatar]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/testimonials/:id/approve (admin) ───────────────────────────────
router.patch("/:id/approve", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "UPDATE testimonials SET status='approved' WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Testimonial not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/testimonials/:id/reject (admin) ────────────────────────────────
router.patch("/:id/reject", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "UPDATE testimonials SET status='rejected' WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Testimonial not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/testimonials/:id (admin) ─────────────────────────────────────
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM testimonials WHERE id=$1 RETURNING id",
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Testimonial not found" });
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
