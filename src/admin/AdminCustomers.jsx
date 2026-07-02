// ─── AdminCustomers ───────────────────────────────────────────────────────────
// Customer list with:
//   - Search bar (filters by name or email)
//   - Full table: avatar, name, email, phone, city, order count, total spent, join date
//   - WhatsApp shortcut per customer

import { useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import { R, RL, DARK, MID, BORDER, WHATSAPP_NUM } from "../constants/tokens";
import { ADMIN_CUSTOMERS } from "../constants/data";

const AdminCustomers = () => {
  const [search, setSearch] = useState("");

  const filtered = ADMIN_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search)
  );

  return (
    <div>
      {/* Search bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <Search size={16} color={MID} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers…"
            style={{ width: "100%", paddingLeft: 40, paddingRight: 14, height: 42, borderRadius: 12, border: `1.5px solid ${BORDER}`, fontSize: ".88rem", color: DARK, background: "#fff" }} />
        </div>
      </div>

      {/* Customers table */}
      <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 16px rgba(192,57,92,.07)", border: `1px solid ${BORDER}` }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".83rem" }}>
            <thead>
              <tr style={{ background: "#FFE8EF" }}>
                {["Customer", "Email", "Phone", "City", "Orders", "Total Spent", "Joined", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: MID, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#FFFBFD" }}>

                  {/* Avatar + name */}
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${R},${RL})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: ".75rem", flexShrink: 0 }}>
                        {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 600, color: DARK, whiteSpace: "nowrap" }}>{c.name}</span>
                    </div>
                  </td>

                  <td style={{ padding: "12px 14px", color: MID }}>{c.email}</td>
                  <td style={{ padding: "12px 14px", color: MID }}>{c.phone}</td>
                  <td style={{ padding: "12px 14px", color: DARK }}>{c.city}</td>
                  <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 700, color: DARK }}>{c.orders}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: R }}>₹{c.spent.toLocaleString()}</td>
                  <td style={{ padding: "12px 14px", color: MID, fontSize: ".75rem" }}>{c.joined}</td>

                  {/* WhatsApp action */}
                  <td style={{ padding: "12px 14px" }}>
                    <a href={`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(`Hi ${c.name}! This is Sweet Delights Bakery.`)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#25D36620", color: "#128C7E", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: ".75rem", fontWeight: 600, textDecoration: "none" }}>
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
