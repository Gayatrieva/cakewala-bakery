// ─── AdminCustomers ───────────────────────────────────────────────────────────
// Displays customers from local mock data — no backend needed.
// Search filters client-side in real time.

import { useState, useMemo } from "react";
import { Search, MessageCircle } from "lucide-react";
import { R, RL, DARK, MID, BORDER, WHATSAPP_NUM } from "../constants/tokens";

const MOCK_CUSTOMERS = [
  { id: 1, name: "Priya Sharma",   email: "priya@email.com",   phone: "98765 43210", city: "Mumbai",    orders: 7,  spent: 18400, joined: "2024-02-10" },
  { id: 2, name: "Rahul Mehta",    email: "rahul@email.com",   phone: "91234 56780", city: "Delhi",     orders: 3,  spent:  5200, joined: "2024-05-22" },
  { id: 3, name: "Anjali Singh",   email: "anjali@email.com",  phone: "87654 32109", city: "Bangalore", orders: 11, spent: 34600, joined: "2023-11-14" },
  { id: 4, name: "Vikram Joshi",   email: "vikram@email.com",  phone: "76543 21098", city: "Pune",      orders: 2,  spent:  4400, joined: "2025-01-08" },
  { id: 5, name: "Sneha Patel",    email: "sneha@email.com",   phone: "65432 10987", city: "Surat",     orders: 5,  spent: 12800, joined: "2024-07-30" },
  { id: 6, name: "Arjun Nair",     email: "arjun@email.com",   phone: "54321 09876", city: "Chennai",   orders: 4,  spent:  9100, joined: "2024-09-18" },
  { id: 7, name: "Kavya Reddy",    email: "kavya@email.com",   phone: "43210 98765", city: "Hyderabad", orders: 8,  spent: 22300, joined: "2024-03-05" },
  { id: 8, name: "Manish Gupta",   email: "manish@email.com",  phone: "32109 87654", city: "Jaipur",    orders: 1,  spent:   900, joined: "2025-06-11" },
];

const AdminCustomers = () => {
  const [search, setSearch] = useState("");

  const customers = useMemo(() => {
    if (!search.trim()) return MOCK_CUSTOMERS;
    const q = search.toLowerCase();
    return MOCK_CUSTOMERS.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  }, [search]);

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

      <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 16px rgba(192,57,92,.07)", border: `1px solid ${BORDER}` }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".83rem" }}>
            <thead>
              <tr style={{ background: "#FFE8EF" }}>
                {["Customer","Email","Phone","City","Orders","Total Spent","Joined","Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: MID, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: MID }}>No customers found.</td></tr>
              )}
              {customers.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#FFFBFD" }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${R},${RL})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: ".75rem", flexShrink: 0 }}>
                        {c.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                      </div>
                      <span style={{ fontWeight: 600, color: DARK, whiteSpace: "nowrap" }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", color: MID }}>{c.email}</td>
                  <td style={{ padding: "12px 14px", color: MID }}>{c.phone}</td>
                  <td style={{ padding: "12px 14px", color: DARK }}>{c.city}</td>
                  <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 700, color: DARK }}>{c.orders}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: R }}>₹{c.spent?.toLocaleString()}</td>
                  <td style={{ padding: "12px 14px", color: MID, fontSize: ".75rem" }}>
                    {c.joined ? new Date(c.joined).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—"}
                  </td>
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
