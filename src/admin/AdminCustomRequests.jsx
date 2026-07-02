// ─── AdminCustomRequests ──────────────────────────────────────────────────────
// Lists custom cake inquiry requests with:
//   - Request cards showing all spec fields (shape, size, flavour, tiers, occasion, budget, delivery)
//   - Status badge per request (new / reviewing / quoted)
//   - WhatsApp reply button per request

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { DARK, MID, BORDER } from "../constants/tokens";
import StatusBadge from "../components/StatusBadge";

// Demo custom request data (in a real app this would come from a backend)
const DEMO_REQUESTS = [
  { id: 1, name: "Kavya Rao",    phone: "9876543210", shape: "Heart",  size: "2kg", flavor: "Red Velvet", tiers: 2, occasion: "Anniversary", budget: "₹3,000–5,000",    date: "2025-01-22", status: "new" },
  { id: 2, name: "Amir Khan",    phone: "9876543211", shape: "Round",  size: "3kg", flavor: "Chocolate",  tiers: 3, occasion: "Birthday",     budget: "₹5,000–10,000",   date: "2025-01-25", status: "reviewing" },
  { id: 3, name: "Simran Kaur",  phone: "9876543212", shape: "Tier",   size: "5kg", flavor: "Vanilla",    tiers: 4, occasion: "Wedding",      budget: "Above ₹10,000",   date: "2025-02-10", status: "quoted" },
];

const AdminCustomRequests = () => {
  const [requests] = useState(DEMO_REQUESTS);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {requests.map(r => (
          <div key={r.id} style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 4px 16px rgba(192,57,92,.07)", border: `1px solid ${BORDER}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>

              {/* Request details */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <p style={{ fontWeight: 700, color: DARK, fontSize: "1rem" }}>{r.name}</p>
                  <StatusBadge status={r.status} />
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {[
                    [r.shape,                         "Shape"],
                    [r.size,                          "Size"],
                    [r.flavor,                        "Flavour"],
                    [`${r.tiers} tier${r.tiers > 1 ? "s" : ""}`, "Tiers"],
                    [r.occasion,                      "Occasion"],
                    [r.budget,                        "Budget"],
                    [r.date,                          "Delivery"],
                  ].map(([v, l]) => (
                    <div key={l} style={{ fontSize: ".8rem" }}>
                      <span style={{ color: MID }}>{l}: </span>
                      <span style={{ fontWeight: 600, color: DARK }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp reply button */}
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
