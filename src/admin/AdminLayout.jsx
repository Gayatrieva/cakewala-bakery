// ─── AdminLayout ──────────────────────────────────────────────────────────────
// Shared layout wrapper for all admin panel pages.
// Fully mobile-responsive: sidebar collapses on mobile behind an overlay.
//
// Props:
//   children    – admin page content
//   adminPage   – current admin sub-page key
//   setAdminPage– setter to switch sub-pages
//   onLogout    – callback to log out and return to home
//   navigate    – navigate(pageKey) function

import { useState, useEffect } from "react";
import { Menu, X, Home, LogOut, BarChart2, Package, Users, Cake, Sparkles, MessageSquare } from "lucide-react";
import { R, RL, GOLD, DARK, MID, BORDER } from "../constants/tokens";

const AdminLayout = ({ children, adminPage, setAdminPage, onLogout, navigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile,    setIsMobile]    = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fn = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", fn);
    fn();
    return () => window.removeEventListener("resize", fn);
  }, []);

  const navItems = [
    { key: "dashboard",       label: "Dashboard",        icon: <BarChart2      size={18} /> },
    { key: "orders",          label: "Orders",           icon: <Package        size={18} /> },
    { key: "products",        label: "Cakes",            icon: <Cake           size={18} /> },
    { key: "customers",       label: "Customers",        icon: <Users          size={18} /> },
    { key: "custom-requests", label: "Custom Requests",  icon: <Sparkles       size={18} /> },
    { key: "testimonials",    label: "Testimonials",     icon: <MessageSquare  size={18} /> },
  ];

  const handleNav = (key) => {
    setAdminPage(key);
    if (isMobile) setSidebarOpen(false);
  };

  const sidebarWidth = isMobile ? "80vw" : (sidebarOpen ? 240 : 72);

  return (
    <div style={{ minHeight: "100vh", background: "#FAF5F7", display: "flex" }}>

      {/* ── Mobile overlay backdrop ── */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(42,18,21,.45)", zIndex: 199 }} />
      )}

      {/* ── Sidebar ── */}
      <div style={{
        width: sidebarWidth,
        maxWidth: isMobile ? "280px" : undefined,
        flexShrink: 0,
        background: "#fff", borderRight: `1px solid ${BORDER}`,
        transition: "width .3s, transform .3s",
        display: "flex", flexDirection: "column",
        padding: "20px 12px",
        position: isMobile ? "fixed" : "sticky",
        top: 0, left: 0,
        height: "100vh", overflowY: "auto",
        zIndex: 200,
        transform: isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
        boxShadow: isMobile && sidebarOpen ? "4px 0 24px rgba(42,18,21,.15)" : "none",
      }}>
        {/* Brand logo + close on mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 28, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${R},${RL})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🎂</div>
            {(sidebarOpen || isMobile) && (
              <div>
                <div className="font-display" style={{ fontWeight: 700, color: R, fontSize: ".95rem", lineHeight: 1 }}>Sweet Delights</div>
                <div style={{ fontSize: ".65rem", color: GOLD, letterSpacing: ".1em" }}>ADMIN</div>
              </div>
            )}
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: "#FFE8EF", border: "none", cursor: "pointer", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={16} color={R} />
            </button>
          )}
        </div>

        {/* Nav items */}
        {navItems.map(item => (
          <button key={item.key} className={`admin-nav-item ${adminPage === item.key ? "active" : ""}`}
            onClick={() => handleNav(item.key)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", border: "none", cursor: "pointer", background: "none", width: "100%", textAlign: "left", marginBottom: 4, color: adminPage === item.key ? R : MID, fontWeight: adminPage === item.key ? 600 : 400, borderRadius: 10 }}>
            <span style={{ flexShrink: 0, color: adminPage === item.key ? R : MID }}>{item.icon}</span>
            {(sidebarOpen || isMobile) && <span style={{ fontSize: ".9rem" }}>{item.label}</span>}
          </button>
        ))}

        {/* Bottom actions */}
        <div style={{ marginTop: "auto" }}>
          <button onClick={() => navigate("home")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", border: "none", cursor: "pointer", background: "none", width: "100%", color: MID, marginBottom: 4, borderRadius: 10 }}>
            <Home size={18} />{(sidebarOpen || isMobile) && <span style={{ fontSize: ".9rem" }}>View Site</span>}
          </button>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", border: "none", cursor: "pointer", background: "none", width: "100%", color: "#EF4444", borderRadius: 10 }}>
            <LogOut size={18} />{(sidebarOpen || isMobile) && <span style={{ fontSize: ".9rem" }}>Logout</span>}
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflowX: "hidden", marginLeft: isMobile ? 0 : undefined }}>
        {/* Top bar */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Sidebar toggle */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "#FFE8EF", border: "none", cursor: "pointer", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Menu size={16} color={R} />
            </button>
            <h2 style={{ fontWeight: 700, color: DARK, fontSize: "1rem", textTransform: "capitalize" }}>
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
        <div style={{ padding: "20px 16px" }}>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
