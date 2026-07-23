// ─── AdminCustomRequests ──────────────────────────────────────────────────────
// Custom cake requests managed in local state — no backend needed.
// Uses the TestimonialsStore pattern but for custom requests.

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { DARK, MID, BORDER } from "../constants/tokens";
import StatusBadge from "../components/StatusBadge";

const MOCK_REQUESTS = [
  {
    id: 1, name: "Priya Sharma",   phone: "9876543210",
    shape: "Round", size: "3 kg", flavor: "Chocolate", tiers: 2,
    occasion: "Wedding Anniversary", budget: "₹4,000–₹6,000",
    delivery_date: "28 Jul 2025", message: "Please write 'Happy 10th Anniversary' in gold lettering.",
    status: "new", created_at: "2025-07-20T10:30:00Z",
  },
  {
    id: 2, name: "Vikram Joshi",   phone: "7654321098",
    shape: "Square", size: "2 kg", flavor: "Vanilla", tiers: 1,
    occasion: "Corporate Event", budget: "₹2,500–₹3,500",
    delivery_date: "25 Jul 2025", message: "Company logo on top, blue and white theme.",
    status: "reviewing", created_at: "2025-07-19T14:00:00Z",
  },
  {
    id: 3, name: "Kavya Reddy",    phone: "4321098765",
    shape: "Heart", size: "1.5 kg", flavor: "Strawberry", tiers: 1,
    occasion: "Birthday", budget: "₹1,500–₹2,500",
    delivery_date: "23 Jul 2025", message: "Unicorn theme with pastel colours.",
    status: "quoted", created_at: "2025-07-18T09:00:00Z",
  },
  {
    id: 4, name: "Sneha Patel",    phone: "6543210987",
    shape: "Round", size: "4 kg", flavor: "Red Velvet", tiers: 3,
    occasion: "Wedding", budget: "₹8,000–₹12,000",
    delivery_date: "30 Jul 2025", message: "Floral decorations, no fondant please.",
    status: "new", created_at: "2025-07-21T16:45:00Z",
  },
];

const STATUS_OPTS = ["new", "reviewing", "quoted", "completed"];

const AdminCustomRequests = () => {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const updateStatus = (id, status) => {
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {requests.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 18, border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🎂</div>
            <p style={{ color: MID }}>No custom requests yet.</p>
          </div>
        )}
        {requests.map(r => (
          <div key={r.id} style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 4px 16px rgba(192,57,92,.07)", border: `1px solid ${BORDER}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <p style={{ fontWeight: 700, color: DARK, fontSize: "1rem" }}>{r.name}</p>
                  <StatusBadge status={r.status} />
                  <span style={{ fontSize: ".72rem", color: "#bbb" }}>
                    {r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : ""}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {[
                    [r.shape,                                 "Shape"],
                    [r.size,                                  "Size"],
                    [r.flavor,                                "Flavour"],
                    [`${r.tiers} tier${r.tiers > 1 ? "s":""}`, "Tiers"],
                    [r.occasion,                              "Occasion"],
                    [r.budget,                                "Budget"],
                    [r.delivery_date,                         "Delivery"],
                  ].filter(([v]) => v).map(([v, l]) => (
                    <div key={l} style={{ fontSize: ".8rem" }}>
                      <span style={{ color: MID }}>{l}: </span>
                      <span style={{ fontWeight: 600, color: DARK }}>{v}</span>
                    </div>
                  ))}
                </div>
                {r.message && (
                  <p style={{ marginTop: 8, fontSize: ".82rem", color: MID, fontStyle: "italic" }}>"{r.message}"</p>
                )}
                {/* Inline status update */}
                <div style={{ marginTop: 12 }}>
                  <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)}
                    style={{ padding: "5px 12px", borderRadius: 8, border: `1.5px solid ${BORDER}`, fontSize: ".8rem", color: DARK, cursor: "pointer" }}>
                    {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <a href={`https://wa.me/91${r.phone}?text=${encodeURIComponent(`Hi ${r.name}! Your custom cake inquiry is under review.`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#25D366", color: "#fff", padding: "8px 18px", borderRadius: 10, fontSize: ".82rem", fontWeight: 600, textDecoration: "none", height: "fit-content" }}>
                <MessageCircle size={14} /> Reply on WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCustomRequests;
