// ─── AdminLayout ──────────────────────────────────────────────────────────────
// Shared layout wrapper for all admin panel pages.
// Includes:
//   - Collapsible left sidebar with nav items
//   - Sticky top bar with page title + admin avatar
//   - Content area (children)
//
// Props:
//   children    – admin page content
//   adminPage   – current admin sub-page key
//   setAdminPage– setter to switch sub-pages
//   onLogout    – callback to log out and return to home
//   navigate    – navigate(pageKey) function

import { useState } from "react";
import { Menu, Home, LogOut, BarChart2, Package, Users, Cake, Sparkles } from "lucide-react";
import { R, RL, GOLD, DARK, MID, BORDER } from "../constants/tokens";

const AdminLayout = ({ children, adminPage, setAdminPage, onLogout, navigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { key: "dashboard",       label: "Dashboard",        icon: <BarChart2 size={18} /> },
    { key: "orders",          label: "Orders",           icon: <Package   size={18} /> },
    { key: "products",        label: "Cakes",            icon: <Cake      size={18} /> },
    { key: "customers",       label: "Customers",        icon: <Users     size={18} /> },
    { key: "custom-requests", label: "Custom Requests",  icon: <Sparkles  size={18} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#FAF5F7", display: "flex" }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: sidebarOpen ? 240 : 72, flexShrink: 0,
        background: "#fff", borderRight: `1px solid ${BORDER}`,
        transition: "width .3s", display: "flex", flexDirection: "column",
        padding: "20px 12px", position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        {/* Brand logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${R},${RL})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🎂</div>
          {sidebarOpen && (
            <div>
              <div className="font-display" style={{ fontWeight: 700, color: R, fontSize: ".95rem", lineHeight: 1 }}>Sweet Delights</div>
              <div style={{ fontSize: ".65rem", color: GOLD, letterSpacing: ".1em" }}>ADMIN</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        {navItems.map(item => (
          <button key={item.key} className={`admin-nav-item ${adminPage === item.key ? "active" : ""}`}
            onClick={() => setAdminPage(item.key)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "none", cursor: "pointer", background: "none", width: "100%", textAlign: "left", marginBottom: 4, color: adminPage === item.key ? R : MID, fontWeight: adminPage === item.key ? 600 : 400 }}>
            <span style={{ flexShrink: 0, color: adminPage === item.key ? R : MID }}>{item.icon}</span>
            {sidebarOpen && <span style={{ fontSize: ".9rem" }}>{item.label}</span>}
          </button>
        ))}

        {/* Bottom actions */}
        <div style={{ marginTop: "auto" }}>
          <button onClick={() => navigate("home")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "none", cursor: "pointer", background: "none", width: "100%", color: MID, marginBottom: 4 }}>
            <Home size={18} />{sidebarOpen && <span style={{ fontSize: ".9rem" }}>View Site</span>}
          </button>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "none", cursor: "pointer", background: "none", width: "100%", color: "#EF4444" }}>
            <LogOut size={18} />{sidebarOpen && <span style={{ fontSize: ".9rem" }}>Logout</span>}
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflowX: "hidden" }}>
        {/* Top bar */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Sidebar toggle */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "#FFE8EF", border: "none", cursor: "pointer", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Menu size={16} color={R} />
            </button>
            <h2 style={{ fontWeight: 700, color: DARK, fontSize: "1.1rem", textTransform: "capitalize" }}>
              {adminPage.replace("-", " ")}
            </h2>
          </div>
          {/* Admin avatar pill */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFE8EF", borderRadius: 999, padding: "6px 14px" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${R},${RL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700 }}>AD</div>
            <span style={{ fontSize: ".82rem", fontWeight: 600, color: DARK }}>Admin</span>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: "28px" }}>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
