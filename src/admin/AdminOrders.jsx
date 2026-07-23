// ─── AdminOrders ─────────────────────────────────────────────────────────────
// Manages orders in local state (no backend needed).
// Status changes are reflected immediately in the UI.

import { useState } from "react";
import { R, DARK, MID, BORDER } from "../constants/tokens";
import StatusBadge from "../components/StatusBadge";

const FILTER_OPTIONS = ["all","pending","accepted","preparing","out_for_delivery","delivered","cancelled"];
const STATUS_OPTIONS  = ["pending","accepted","preparing","out_for_delivery","delivered","rejected","cancelled"];

const MOCK_ORDERS = [
  { id: "#SD-1048", customer_name: "Priya Sharma",   phone: "98765 43210", items: [{ name: "Chocolate Truffle", qty: 1 }], total: 3200, delivery_date: "23 Jul", delivery_slot: "10am–1pm",  status: "preparing",        payment: "UPI" },
  { id: "#SD-1047", customer_name: "Rahul Mehta",    phone: "91234 56780", items: [{ name: "Vanilla Dream",     qty: 2 }], total: 1800, delivery_date: "23 Jul", delivery_slot: "2pm–5pm",   status: "accepted",         payment: "COD" },
  { id: "#SD-1046", customer_name: "Anjali Singh",   phone: "87654 32109", items: [{ name: "Wedding Tier",      qty: 1 }], total: 5400, delivery_date: "22 Jul", delivery_slot: "10am–1pm",  status: "delivered",        payment: "UPI" },
  { id: "#SD-1045", customer_name: "Vikram Joshi",   phone: "76543 21098", items: [{ name: "Photo Cake",        qty: 1 }], total: 2200, delivery_date: "22 Jul", delivery_slot: "5pm–8pm",   status: "out_for_delivery", payment: "COD" },
  { id: "#SD-1044", customer_name: "Sneha Patel",    phone: "65432 10987", items: [{ name: "Strawberry Bliss",  qty: 1 }], total: 4600, delivery_date: "21 Jul", delivery_slot: "2pm–5pm",   status: "delivered",        payment: "UPI" },
  { id: "#SD-1043", customer_name: "Arjun Nair",     phone: "54321 09876", items: [{ name: "Black Forest",      qty: 1 }], total: 1400, delivery_date: "21 Jul", delivery_slot: "10am–1pm",  status: "pending",          payment: "COD" },
  { id: "#SD-1042", customer_name: "Kavya Reddy",    phone: "43210 98765", items: [{ name: "Custom Cake",       qty: 1 }], total: 6800, delivery_date: "20 Jul", delivery_slot: "5pm–8pm",   status: "pending",          payment: "UPI" },
  { id: "#SD-1041", customer_name: "Manish Gupta",   phone: "32109 87654", items: [{ name: "Cupcake Box ×6",   qty: 1 }], total:  900, delivery_date: "20 Jul", delivery_slot: "2pm–5pm",   status: "cancelled",        payment: "COD" },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const updateStatus = (id, status) => {
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTER_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "7px 18px", borderRadius: 999, border: `1.5px solid ${filter === s ? R : BORDER}`, background: filter === s ? R : "#fff", color: filter === s ? "#fff" : DARK, fontWeight: 600, fontSize: ".78rem", cursor: "pointer", textTransform: "capitalize" }}>
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 16px rgba(192,57,92,.07)", border: `1px solid ${BORDER}` }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".83rem" }}>
            <thead>
              <tr style={{ background: "#FFE8EF" }}>
                {["Order ID","Customer","Phone","Items","Total","Delivery","Status","Update Status"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: MID, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: MID }}>No orders found.</td></tr>
              )}
              {filtered.map((o, i) => (
                <tr key={o.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#FFFBFD" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: R, whiteSpace: "nowrap" }}>{o.id}</td>
                  <td style={{ padding: "12px 14px", color: DARK, whiteSpace: "nowrap" }}>{o.customer_name}</td>
                  <td style={{ padding: "12px 14px", color: MID }}>{o.phone}</td>
                  <td style={{ padding: "12px 14px", color: DARK, whiteSpace: "nowrap", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {(o.items || []).map(it => `${it.name} ×${it.qty}`).join(", ")}
                  </td>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: DARK }}>₹{o.total?.toLocaleString()}</td>
                  <td style={{ padding: "12px 14px", color: MID, whiteSpace: "nowrap", fontSize: ".75rem" }}>{o.delivery_date} {o.delivery_slot}</td>
                  <td style={{ padding: "12px 14px" }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding: "12px 14px" }}>
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                      style={{ padding: "5px 10px", borderRadius: 8, border: `1.5px solid ${BORDER}`, fontSize: ".75rem", color: DARK, cursor: "pointer", background: "#fff" }}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
                    </select>
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

export default AdminOrders;
