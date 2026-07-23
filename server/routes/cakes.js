// ─── routes/cakes.js ──────────────────────────────────────────────────────────
// GET    /api/cakes          → list all cakes (public)
// GET    /api/cakes/:id      → single cake (public)
// POST   /api/cakes          → add cake (admin, supports image upload via multer)
// PUT    /api/cakes/:id      → edit cake (admin)
// DELETE /api/cakes/:id      → delete cake (admin)

const router      = require("express").Router();
const multer      = require("multer");
const path        = require("path");
const { pool }    = require("../db");
const requireAuth = require("../middleware/auth");

// ── Multer: save uploads to server/uploads/ ─────────────────────────────────
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (_, file, cb) => cb(null, `cake_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

// ── GET /api/cakes ───────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = "SELECT * FROM cakes ORDER BY id ASC";
    let params = [];
    if (category && category !== "all") {
      query = "SELECT * FROM cakes WHERE category=$1 ORDER BY id ASC";
      params = [category];
    }
    const { rows } = await pool.query(query, params);
    // Parse JSON fields
    const cakes = rows.map(r => ({
      ...r,
      weights: typeof r.weights === "string" ? JSON.parse(r.weights) : r.weights,
    }));
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/cakes/:id ───────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM cakes WHERE id=$1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Cake not found" });
    const r = rows[0];
    res.json({ ...r, weights: typeof r.weights === "string" ? JSON.parse(r.weights) : r.weights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/cakes (admin) ──────────────────────────────────────────────────
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, badge, description } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ error: "name, category, price are required" });
    }

    // Image can come as an uploaded file OR as a URL string in body.img
    let imgUrl = req.body.img || null;
    if (req.file) {
      imgUrl = `/uploads/${req.file.filename}`;
    }

    const flavors  = req.body.flavors  ? JSON.parse(req.body.flavors)  : ["Vanilla"];
    const weights  = req.body.weights  ? JSON.parse(req.body.weights)  : [{ w: "1kg", p: Number(price) }];

    const { rows } = await pool.query(
      `INSERT INTO cakes(name,category,price,img,badge,flavors,weights,description)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, category, Number(price), imgUrl, badge || "", flavors, JSON.stringify(weights), description || ""]
    );
    const r = rows[0];
    res.status(201).json({ ...r, weights: typeof r.weights === "string" ? JSON.parse(r.weights) : r.weights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/cakes/:id (admin) ───────────────────────────────────────────────
router.put("/:id", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, badge, description } = req.body;
    const existing = await pool.query("SELECT * FROM cakes WHERE id=$1", [req.params.id]);
    if (!existing.rows.length) return res.status(404).json({ error: "Cake not found" });

    let imgUrl = req.body.img || existing.rows[0].img;
    if (req.file) imgUrl = `/uploads/${req.file.filename}`;

    const flavors = req.body.flavors ? JSON.parse(req.body.flavors) : existing.rows[0].flavors;
    const weights = req.body.weights ? JSON.parse(req.body.weights) : existing.rows[0].weights;

    const { rows } = await pool.query(
      `UPDATE cakes SET name=$1,category=$2,price=$3,img=$4,badge=$5,flavors=$6,weights=$7,description=$8
       WHERE id=$9 RETURNING *`,
      [
        name       || existing.rows[0].name,
        category   || existing.rows[0].category,
        price      ? Number(price) : existing.rows[0].price,
        imgUrl,
        badge      !== undefined ? badge : existing.rows[0].badge,
        flavors,
        JSON.stringify(weights),
        description !== undefined ? description : existing.rows[0].description,
        req.params.id,
      ]
    );
    const r = rows[0];
    res.json({ ...r, weights: typeof r.weights === "string" ? JSON.parse(r.weights) : r.weights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/cakes/:id (admin) ────────────────────────────────────────────
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM cakes WHERE id=$1 RETURNING id", [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: "Cake not found" });
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
