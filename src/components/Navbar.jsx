// ─── Navbar Component ─────────────────────────────────────────────────────────
// Sticky top navigation bar with:
//  - Logo + brand name
//  - Desktop links (Home, Our Cakes, Custom Cake, About, Contact)
//  - Cart icon with badge count
//  - Admin shortcut button (shown when adminLoggedIn)
//  - Mobile hamburger menu
//
// Props:
//   page         – current active page key
//   navigate     – navigate(pageKey) function
//   cartCount    – number of items in cart
//   cartOpen     – boolean cart sidebar open state
//   setCartOpen  – setter for cartOpen
//   adminLoggedIn– boolean

import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { R, RL, RP, GOLD, CREAM, DARK, MID, BORDER } from "../constants/tokens";

const Navbar = ({ page, navigate, cartCount, cartOpen, setCartOpen, adminLoggedIn }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Home",        key: "home"        },
    { label: "Our Cakes",   key: "cakes"       },
    { label: "Custom Cake", key: "custom-cake" },
    { label: "About",       key: "about"       },
    { label: "Contact",     key: "contact"     },
  ];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100, transition: "all .3s",
      background: scrolled ? "rgba(254,248,242,.96)" : CREAM,
      backdropFilter: scrolled ? "blur(12px)" : "none",
      boxShadow: scrolled ? "0 2px 24px rgba(192,57,92,.08)" : "none",
      borderBottom: `1px solid ${scrolled ? BORDER : "transparent"}`,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

        {/* Logo */}
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${R},${RL})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 22 }}>🎂</span>
          </div>
          <div style={{ textAlign: "left" }}>
            <div className="font-display" style={{ fontSize: "1.1rem", fontWeight: 700, color: R, lineHeight: 1.1 }}>Sweet Delights</div>
            <div style={{ fontSize: ".65rem", color: GOLD, letterSpacing: ".15em", fontWeight: 600, textTransform: "uppercase" }}>Bakery</div>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <div className="hide-mobile" style={{ display: "flex", gap: 32 }}>
          {links.map(l => (
            <button key={l.key} className={`nav-link ${page === l.key ? "active" : ""}`} onClick={() => navigate(l.key)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: ".9rem", fontWeight: 500, color: page === l.key ? R : DARK, transition: "color .2s" }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Right actions: Admin button, Cart icon, Mobile menu */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {adminLoggedIn && (
            <button onClick={() => navigate("admin")} className="btn-outline" style={{ padding: "6px 16px", borderRadius: 8, fontSize: ".8rem" }}>
              Admin
            </button>
          )}
          <button onClick={() => setCartOpen(!cartOpen)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 8 }}>
            <ShoppingCart size={22} color={page === "cart" ? R : DARK} />
            {cartCount > 0 && (
              <span className="animate-bounce-in" style={{
                position: "absolute", top: 0, right: 0, background: R, color: "#fff",
                borderRadius: "50%", width: 18, height: 18, fontSize: ".65rem",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
              }}>{cartCount}</span>
            )}
          </button>
          {/* Mobile hamburger */}
          <button className="show-mobile" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            {mobileOpen ? <X size={22} color={DARK} /> : <Menu size={22} color={DARK} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="show-mobile animate-fade-up" style={{
          background: "#fff", borderTop: `1px solid ${BORDER}`,
          padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4,
        }}>
          {links.map(l => (
            <button key={l.key} onClick={() => { navigate(l.key); setMobileOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "10px 0",
                fontSize: ".95rem", fontWeight: page === l.key ? 600 : 400, color: page === l.key ? R : DARK, borderBottom: `1px solid ${BORDER}` }}>
              {l.label}
            </button>
          ))}
          {adminLoggedIn && (
            <button onClick={() => { navigate("admin"); setMobileOpen(false); }}
              style={{ background: RP, color: R, border: "none", cursor: "pointer", padding: "10px 0", fontWeight: 600, textAlign: "left", borderRadius: 8, marginTop: 4 }}>
              Admin Dashboard →
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
