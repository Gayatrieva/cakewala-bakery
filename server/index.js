// ─── index.js ─────────────────────────────────────────────────────────────────
// Sweet Delights Bakery — Express REST API entry point
// Starts on PORT (default 3001). Serves /uploads as static files.

require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const path      = require("path");
const { initDB } = require("./db");

// ── Routes ───────────────────────────────────────────────────────────────────
const authRoute           = require("./routes/auth");
const cakesRoute          = require("./routes/cakes");
const ordersRoute         = require("./routes/orders");
const customersRoute      = require("./routes/customers");
const testimonialsRoute   = require("./routes/testimonials");
const customRequestsRoute = require("./routes/customRequests");
const dashboardRoute      = require("./routes/dashboard");

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4173"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Static: serve uploaded cake images ───────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",            authRoute);
app.use("/api/cakes",           cakesRoute);
app.use("/api/orders",          ordersRoute);
app.use("/api/customers",       customersRoute);
app.use("/api/testimonials",    testimonialsRoute);
app.use("/api/custom-requests", customRequestsRoute);
app.use("/api/dashboard",       dashboardRoute);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found` }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// ── Bootstrap ────────────────────────────────────────────────────────────────
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🎂 Sweet Delights API running at http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health\n`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to initialise database:", err.message);
    console.error("   Check your DATABASE_URL in server/.env");
    process.exit(1);
  });
