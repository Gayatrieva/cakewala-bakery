// ─── routes/dashboard.js ──────────────────────────────────────────────────────
// GET /api/dashboard   → KPI stats + weekly sales chart + category pie (admin)

const router      = require("express").Router();
const { pool }    = require("../db");
const requireAuth = require("../middleware/auth");

router.get("/", requireAuth, async (req, res) => {
  try {
    // ── KPI stats ─────────────────────────────────────────────────────────────
    const [totalOrders, totalRevenue, pending, delivered, customers, testimonials] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM orders"),
      pool.query("SELECT COALESCE(SUM(total),0)::int AS sum FROM orders WHERE status != 'cancelled'"),
      pool.query("SELECT COUNT(*)::int AS count FROM orders WHERE status='pending'"),
      pool.query("SELECT COUNT(*)::int AS count FROM orders WHERE status='delivered'"),
      pool.query("SELECT COUNT(*)::int AS count FROM customers"),
      pool.query("SELECT COUNT(*)::int AS count FROM testimonials WHERE status='pending'"),
    ]);

    // ── Today's orders & revenue ─────────────────────────────────────────────
    const [todayOrders, todayRevenue] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM orders WHERE created_at::date = CURRENT_DATE"),
      pool.query("SELECT COALESCE(SUM(total),0)::int AS sum FROM orders WHERE created_at::date = CURRENT_DATE"),
    ]);

    // ── Weekly sales data (last 7 days) ──────────────────────────────────────
    const weeklyResult = await pool.query(`
      SELECT
        TO_CHAR(created_at, 'Dy') AS day,
        COUNT(*)::int              AS orders,
        COALESCE(SUM(total),0)::int AS revenue
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '7 days'
        AND status != 'cancelled'
      GROUP BY TO_CHAR(created_at, 'Dy'), DATE_TRUNC('day', created_at)
      ORDER BY DATE_TRUNC('day', created_at)
    `);

    // Fill missing days with zeros (last 7 days)
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const weekMap = {};
    weeklyResult.rows.forEach(r => { weekMap[r.day] = r; });
    const salesData = days.map(d => weekMap[d] || { day: d, orders: 0, revenue: 0 });

    // ── Category breakdown (pie) ──────────────────────────────────────────────
    const categoryResult = await pool.query(`
      SELECT
        c.category,
        COUNT(o.id)::int AS order_count
      FROM orders o
      JOIN LATERAL (
        SELECT category FROM cakes WHERE name = (o.items->0->>'name') LIMIT 1
      ) c ON true
      WHERE o.status != 'cancelled'
      GROUP BY c.category
    `);

    // Fallback: use orders count per category from cakes table if no orders yet
    const pieResult = categoryResult.rows.length > 0
      ? categoryResult.rows
      : (await pool.query(
          "SELECT category, COUNT(*)::int AS order_count FROM cakes GROUP BY category"
        )).rows;

    const COLORS = { birthday: "#C0395C", wedding: "#E8698A", anniversary: "#C4945A", custom: "#9B59B6", cupcake: "#F59E0B", photo: "#3B82F6" };
    const total = pieResult.reduce((s, r) => s + r.order_count, 0) || 1;
    const pieData = pieResult.map(r => ({
      name:  r.category.charAt(0).toUpperCase() + r.category.slice(1),
      value: Math.round((r.order_count / total) * 100),
      color: COLORS[r.category] || "#888",
    }));

    // ── Recent orders (last 5) ────────────────────────────────────────────────
    const recentOrders = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC LIMIT 5"
    );

    res.json({
      stats: {
        totalOrders:      totalOrders.rows[0].count,
        totalRevenue:     totalRevenue.rows[0].sum,
        pendingOrders:    pending.rows[0].count,
        deliveredOrders:  delivered.rows[0].count,
        totalCustomers:   customers.rows[0].count,
        pendingReviews:   testimonials.rows[0].count,
        todayOrders:      todayOrders.rows[0].count,
        todayRevenue:     todayRevenue.rows[0].sum,
      },
      salesData,
      pieData,
      recentOrders: recentOrders.rows.map(o => ({
        ...o,
        items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
