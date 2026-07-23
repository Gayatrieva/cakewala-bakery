// ─── test.js ──────────────────────────────────────────────────────────────────
// Standalone API integration test — run with: node server/test.js
// Requires the server to be running first: cd server && node index.js
//
// Prints PASS / FAIL for every endpoint.
// Exit code 0 = all passed, 1 = at least one failed.

require("dotenv").config({ path: `${__dirname}/.env` });

const BASE    = `http://localhost:${process.env.PORT || 3001}/api`;
const ADMIN   = { email: process.env.ADMIN_EMAIL || "admin@sweetdelights.in", password: process.env.ADMIN_PASSWORD || "admin123" };

let passed = 0, failed = 0, token = "";

async function req(method, path, body, auth = false) {
  const headers = { "Content-Type": "application/json" };
  if (auth && token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function assert(label, condition, detail = "") {
  if (condition) {
    console.log(`  ✅ PASS  ${label}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL  ${label}${detail ? " — " + detail : ""}`);
    failed++;
  }
}

async function run() {
  console.log("\n🧪 Sweet Delights API Test Suite");
  console.log(`   Base URL: ${BASE}\n`);

  // ── 1. Health ────────────────────────────────────────────────────────────
  console.log("── Health ───────────────────────────────────────────");
  const health = await req("GET", "/health");
  assert("GET /health → 200", health.status === 200, JSON.stringify(health.data));

  // ── 2. Auth ──────────────────────────────────────────────────────────────
  console.log("\n── Auth ─────────────────────────────────────────────");
  const badLogin = await req("POST", "/auth/login", { email: "wrong@x.com", password: "bad" });
  assert("POST /auth/login wrong creds → 401", badLogin.status === 401);

  const goodLogin = await req("POST", "/auth/login", ADMIN);
  assert("POST /auth/login correct → 200 + token", goodLogin.status === 200 && !!goodLogin.data.token, JSON.stringify(goodLogin.data));
  token = goodLogin.data.token || "";

  // ── 3. Cakes ─────────────────────────────────────────────────────────────
  console.log("\n── Cakes ────────────────────────────────────────────");
  const cakes = await req("GET", "/cakes");
  assert("GET /cakes → 200 + array", cakes.status === 200 && Array.isArray(cakes.data), `count=${cakes.data.length}`);
  assert("GET /cakes has seeded data", cakes.data.length >= 10);

  const newCake = await req("POST", "/cakes", { name: "Test Cake", category: "birthday", price: 999, badge: "", description: "Test", img: "https://example.com/cake.jpg", flavors: JSON.stringify(["Vanilla"]), weights: JSON.stringify([{w:"1kg",p:999}]) }, true);
  assert("POST /cakes → 201", newCake.status === 201, JSON.stringify(newCake.data));
  const cakeId = newCake.data.id;

  const updCake = await req("PUT", `/cakes/${cakeId}`, { name: "Updated Test Cake", price: 1099 }, true);
  assert("PUT /cakes/:id → 200", updCake.status === 200 && updCake.data.name === "Updated Test Cake");

  const delCake = await req("DELETE", `/cakes/${cakeId}`, null, true);
  assert("DELETE /cakes/:id → 200", delCake.status === 200 && delCake.data.success === true);

  // ── 4. Orders ─────────────────────────────────────────────────────────────
  console.log("\n── Orders ───────────────────────────────────────────");
  const orderPayload = {
    customer_name: "Test User", phone: "9000000001", email: "test@test.com",
    address: "123 Test St", city: "Mumbai", pincode: "400001",
    items: [{ name: "Chocolate Truffle", weight: "1kg", flavor: "Dark Chocolate", qty: 1, price: 1499 }],
    subtotal: 1499, delivery_fee: 0, total: 1499, payment: "cod",
    delivery_date: "2025-02-01", delivery_slot: "10–12pm", notes: "",
  };
  const newOrder = await req("POST", "/orders", orderPayload);
  assert("POST /orders → 201", newOrder.status === 201, JSON.stringify(newOrder.data?.id));
  const orderId = newOrder.data.id;

  const orders = await req("GET", "/orders", null, true);
  assert("GET /orders (admin) → 200 + array", orders.status === 200 && Array.isArray(orders.data));

  const updOrder = await req("PATCH", `/orders/${orderId}/status`, { status: "accepted" }, true);
  assert("PATCH /orders/:id/status → 200", updOrder.status === 200 && updOrder.data.status === "accepted");

  // ── 5. Customers ──────────────────────────────────────────────────────────
  console.log("\n── Customers ────────────────────────────────────────");
  const customers = await req("GET", "/customers", null, true);
  assert("GET /customers (admin) → 200 + array", customers.status === 200 && Array.isArray(customers.data));
  assert("Placing order created/updated customer", customers.data.some(c => c.phone === "9000000001"));

  // ── 6. Testimonials ───────────────────────────────────────────────────────
  console.log("\n── Testimonials ─────────────────────────────────────");
  const pubT = await req("GET", "/testimonials");
  assert("GET /testimonials (public) → 200 approved only", pubT.status === 200 && pubT.data.every(t => t.status === "approved"));

  const newT = await req("POST", "/testimonials", { name: "John Doe", city: "Pune", rating: 5, text: "Amazing cakes!" });
  assert("POST /testimonials → 201 pending", newT.status === 201 && newT.data.status === "pending");
  const tId = newT.data.id;

  const allT = await req("GET", "/testimonials/all", null, true);
  assert("GET /testimonials/all (admin) → includes pending", allT.status === 200 && allT.data.some(t => t.status === "pending"));

  const approveT = await req("PATCH", `/testimonials/${tId}/approve`, {}, true);
  assert("PATCH /testimonials/:id/approve → approved", approveT.status === 200 && approveT.data.status === "approved");

  const delT = await req("DELETE", `/testimonials/${tId}`, null, true);
  assert("DELETE /testimonials/:id → success", delT.status === 200 && delT.data.success === true);

  // ── 7. Custom Requests ────────────────────────────────────────────────────
  console.log("\n── Custom Requests ──────────────────────────────────");
  const newReq = await req("POST", "/custom-requests", { name: "Jane Doe", phone: "9000000002", shape: "Heart", size: "2kg", flavor: "Chocolate", tiers: 2, occasion: "Wedding", budget: "₹5,000–10,000", message: "Purple theme" });
  assert("POST /custom-requests → 201", newReq.status === 201);

  const reqs = await req("GET", "/custom-requests", null, true);
  assert("GET /custom-requests (admin) → 200 + array", reqs.status === 200 && Array.isArray(reqs.data));

  const updReq = await req("PATCH", `/custom-requests/${newReq.data.id}/status`, { status: "reviewing" }, true);
  assert("PATCH /custom-requests/:id/status → 200", updReq.status === 200 && updReq.data.status === "reviewing");

  // ── 8. Dashboard ──────────────────────────────────────────────────────────
  console.log("\n── Dashboard ────────────────────────────────────────");
  const dash = await req("GET", "/dashboard", null, true);
  assert("GET /dashboard → 200", dash.status === 200);
  assert("Dashboard has stats", !!dash.data.stats && typeof dash.data.stats.totalOrders === "number");
  assert("Dashboard has salesData array", Array.isArray(dash.data.salesData));
  assert("Dashboard has pieData array", Array.isArray(dash.data.pieData));
  assert("Dashboard has recentOrders array", Array.isArray(dash.data.recentOrders));

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n${"─".repeat(52)}`);
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) console.log("  🎂 All tests passed! Backend is ready.\n");
  else              console.log("  ⚠️  Some tests failed — check your .env and server logs.\n");
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error("\n❌ Test runner error:", err.message);
  console.error("   Is the server running? (cd server && node index.js)");
  process.exit(1);
});
