// ─── AdminDashboard ───────────────────────────────────────────────────────────
// Overview dashboard with:
//   - 4 KPI stat cards (total orders, revenue, pending, delivered)
//   - Weekly Revenue & Orders bar chart (recharts)
//   - Sales by Category donut chart (recharts)
//   - Recent orders table (last 5)

import { Package, TrendingUp, Clock, CheckCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { R, GOLD, DARK, MID, BORDER } from "../constants/tokens";
import { ADMIN_ORDERS, SALES_DATA, PIE_DATA } from "../constants/data";
import StatusBadge from "../components/StatusBadge";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Orders", value: "134",   sub: "+12 today",        icon: <Package     size={22} />, color: R },
    { label: "Revenue",      value: "₹1.8L",  sub: "+₹12,400 today",  icon: <TrendingUp  size={22} />, color: "#059669" },
    { label: "Pending",      value: "5",      sub: "Needs attention",  icon: <Clock       size={22} />, color: "#D97706" },
    { label: "Delivered",    value: "118",    sub: "This month",       icon: <CheckCircle size={22} />, color: "#7C3AED" },
  ];

  return (
    <div>
      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={s.label} className="animate-fade-up" style={{ animationDelay: `${i * 0.07}s`, background: "#fff", borderRadius: 18, padding: "22px 24px", boxShadow: "0 4px 16px rgba(192,57,92,.07)", border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
            {/* Decorative circle */}
            <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "50%", background: `${s.color}10`, transform: "translate(20px,-20px)" }} />
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, color: s.color }}>{s.icon}</div>
            <p style={{ fontSize: "1.8rem", fontWeight: 800, color: DARK, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontWeight: 600, color: MID, fontSize: ".82rem", marginTop: 4 }}>{s.label}</p>
            <p style={{ fontSize: ".72rem", color: "#059669", marginTop: 4 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Bar chart: Weekly Revenue & Orders */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "24px", boxShadow: "0 4px 16px rgba(192,57,92,.07)", border: `1px solid ${BORDER}` }}>
          <p style={{ fontWeight: 700, color: DARK, marginBottom: 20 }}>Weekly Revenue & Orders</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0D5DF" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: MID }} />
              <YAxis tick={{ fontSize: 11, fill: MID }} yAxisId="left"  orientation="left" />
              <YAxis tick={{ fontSize: 11, fill: MID }} yAxisId="right" orientation="right" />
              <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${BORDER}`, fontSize: 12 }} />
              <Bar yAxisId="left"  dataKey="revenue" fill={R}    radius={[6,6,0,0]} name="Revenue (₹)" />
              <Bar yAxisId="right" dataKey="orders"  fill={GOLD} radius={[6,6,0,0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart: Sales by Category */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "24px", boxShadow: "0 4px 16px rgba(192,57,92,.07)", border: `1px solid ${BORDER}` }}>
          <p style={{ fontWeight: 700, color: DARK, marginBottom: 20 }}>Sales by Category</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${BORDER}`, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 8 }}>
            {PIE_DATA.map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".72rem" }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                <span style={{ color: MID, flex: 1 }}>{p.name}</span>
                <span style={{ fontWeight: 600, color: DARK }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Orders table ── */}
      <div style={{ background: "#fff", borderRadius: 18, padding: "24px", boxShadow: "0 4px 16px rgba(192,57,92,.07)", border: `1px solid ${BORDER}` }}>
        <p style={{ fontWeight: 700, color: DARK, marginBottom: 16 }}>Recent Orders</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".82rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {["Order ID", "Customer", "Cake", "Total", "Delivery", "Status", "Payment"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: MID, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ADMIN_ORDERS.slice(0, 5).map(o => (
                <tr key={o.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: R }}>{o.id}</td>
                  <td style={{ padding: "10px 12px", color: DARK, whiteSpace: "nowrap" }}>{o.customer}</td>
                  <td style={{ padding: "10px 12px", color: MID, whiteSpace: "nowrap" }}>{o.cake}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: DARK }}>₹{o.total.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", color: MID, whiteSpace: "nowrap", fontSize: ".75rem" }}>{o.delivery}</td>
                  <td style={{ padding: "10px 12px" }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ fontSize: ".72rem", background: o.payment === "COD" ? "#FEF3C7" : "#DBEAFE", color: o.payment === "COD" ? "#92400E" : "#1E40AF", padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>
                      {o.payment}
                    </span>
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

export default AdminDashboard;
