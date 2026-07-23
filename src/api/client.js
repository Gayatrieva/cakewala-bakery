// ─── src/api/client.js ────────────────────────────────────────────────────────
// Central fetch wrapper for all API calls.
// - Prepends /api base path (proxied to http://localhost:3001 in dev via vite.config)
// - Automatically attaches JWT token from localStorage for admin requests
// - Normalises errors into { ok: false, error: string } shape

const BASE = "/api";

function getToken() {
  return localStorage.getItem("sd_admin_token") || "";
}

export function setToken(token) {
  if (token) localStorage.setItem("sd_admin_token", token);
  else       localStorage.removeItem("sd_admin_token");
}

export function isLoggedIn() {
  return !!getToken();
}

/**
 * apiFetch(path, options?)
 * @param {string} path  - e.g. "/cakes" or "/orders/123/status"
 * @param {object} opts  - standard fetch options + { auth: bool, isFormData: bool }
 */
export async function apiFetch(path, opts = {}) {
  const { auth = false, isFormData = false, ...fetchOpts } = opts;
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...fetchOpts, headers: { ...headers, ...(fetchOpts.headers || {}) } });

  // Handle 401 — token expired or invalid
  if (res.status === 401) {
    setToken(null);
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

// ── Convenience helpers ───────────────────────────────────────────────────────

export const api = {
  // Auth
  login: (email, password) =>
    apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  // Cakes
  getCakes:   ()        => apiFetch("/cakes"),
  createCake: (formData) => apiFetch("/cakes",      { method: "POST",   auth: true, isFormData: true, body: formData }),
  updateCake: (id, fd)  => apiFetch(`/cakes/${id}`, { method: "PUT",    auth: true, isFormData: true, body: fd }),
  deleteCake: (id)      => apiFetch(`/cakes/${id}`, { method: "DELETE", auth: true }),

  // Orders
  getOrders:    (status) => apiFetch(`/orders${status && status !== "all" ? `?status=${status}` : ""}`, { auth: true }),
  placeOrder:   (data)   => apiFetch("/orders", { method: "POST", body: JSON.stringify(data) }),
  updateStatus: (id, status) => apiFetch(`/orders/${id}/status`, { method: "PATCH", auth: true, body: JSON.stringify({ status }) }),

  // Customers
  getCustomers: (search) => apiFetch(`/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`, { auth: true }),

  // Testimonials
  getTestimonials:    ()   => apiFetch("/testimonials"),
  getAllTestimonials:  ()   => apiFetch("/testimonials/all", { auth: true }),
  submitTestimonial:  (data) => apiFetch("/testimonials", { method: "POST", body: JSON.stringify(data) }),
  approveTestimonial: (id) => apiFetch(`/testimonials/${id}/approve`, { method: "PATCH", auth: true }),
  rejectTestimonial:  (id) => apiFetch(`/testimonials/${id}/reject`,  { method: "PATCH", auth: true }),
  deleteTestimonial:  (id) => apiFetch(`/testimonials/${id}`,         { method: "DELETE", auth: true }),

  // Custom requests
  getCustomRequests:    ()      => apiFetch("/custom-requests", { auth: true }),
  submitCustomRequest:  (data)  => apiFetch("/custom-requests", { method: "POST", body: JSON.stringify(data) }),
  updateRequestStatus:  (id, status) => apiFetch(`/custom-requests/${id}/status`, { method: "PATCH", auth: true, body: JSON.stringify({ status }) }),

  // Dashboard
  getDashboard: () => apiFetch("/dashboard", { auth: true }),
};
