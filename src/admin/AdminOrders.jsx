// ─── AdminOrders ─────────────────────────────────────────────────────────────
// Orders management table with:
//   - Status filter tabs (all / pending / accepted / preparing / out_for_delivery / delivered / cancelled)
//   - Full orders table with inline status dropdown to update each order
//   - Status badge display per row

import { useState } from "react";
import { R, DARK, MID, BORDER } from "../constants/tokens";
import { ADMIN_ORDERS } from "../constants/data";
import StatusBadge from "../components/StatusBadge";

const AdminOrders = () => {
  const [orders, setOrders] = useState(ADMIN_ORDERS);
  const [filter, setFilter] = useState("all");

  // Update a single order's status
  const updateStatus = (id, status) =>
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const FILTER_OPTIONS = ["all", "pending", "accepted", "preparing", "out_for_delivery", "delivered", "cancelled"];
  const STATUS_OPTIONS  = ["pending", "accepted", "preparing", "out_for_delivery", "delivered", "rejected", "cancelled"];

  return (
    <div>
      {/* ── Filter tabs ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTER_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "7px 18px", borderRadius: 999, border: `1.5px solid ${filter === s ? R : BORDER}`, background: filter === s ? R : "#fff", color: filter === s ? "#fff" : DARK, fontWeight: 600, fontSize: ".78rem", cursor: "pointer", textTransform: "capitalize" }}>
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* ── Orders table ── */}
      <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 16px rgba(192,57,92,.07)", border: `1px solid ${BORDER}` }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".83rem" }}>
            <thead>
              <tr style={{ background: "#FFE8EF" }}>
                {["Order ID", "Customer", "Phone", "Cake", "Total", "Delivery", "Status", "Update Status"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: MID, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "#fff" : "#FFFBFD" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: R, whiteSpace: "nowrap" }}>{o.id}</td>
                  <td style={{ padding: "12px 14px", color: DARK, whiteSpace: "nowrap" }}>{o.customer}</td>
                  <td style={{ padding: "12px 14px", color: MID }}>{o.phone}</td>
                  <td style={{ padding: "12px 14px", color: DARK, whiteSpace: "nowrap" }}>{o.cake}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: DARK }}>₹{o.total.toLocaleString()}</td>
                  <td style={{ padding: "12px 14px", color: MID, whiteSpace: "nowrap", fontSize: ".75rem" }}>{o.delivery}</td>
                  <td style={{ padding: "12px 14px" }}><StatusBadge status={o.status} /></td>
                  {/* Inline status changer */}
                  <td style={{ padding: "12px 14px" }}>
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                      style={{ padding: "5px 10px", borderRadius: 8, border: `1.5px solid ${BORDER}`, fontSize: ".75rem", color: DARK, cursor: "pointer", background: "#fff" }}>
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
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
