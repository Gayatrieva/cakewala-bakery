// ─── Navbar Component ─────────────────────────────────────────────────────────
// Sticky top navigation bar — fully mobile-friendly:
//  - Logo + brand name (smaller on mobile)
//  - Desktop links (hidden on mobile)
//  - Cart icon with badge count
//  - Hamburger menu button (mobile only)
//  - Full-screen slide-down mobile menu with smooth animation
//
// Props:
//   page         – current active page key
//   navigate     – navigate(pageKey) function
//   cartCount    – number of items in cart
//   cartOpen     – boolean cart sidebar open state
//   setCartOpen  – setter for cartOpen
//   adminLoggedIn– boolean

import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, ChevronRight } from "lucide-react";
import { R, RL, RP, GOLD, CREAM, DARK, MID, BORDER } from "../constants/tokens";

const Navbar = ({ page, navigate, cartCount, cartOpen, setCartOpen, adminLoggedIn }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const links = [
    { label: "Home",        key: "home",        emoji: "🏠" },
    { label: "Our Cakes",   key: "cakes",       emoji: "🎂" },
    { label: "Custom Cake", key: "custom-cake", emoji: "✨" },
    { label: "About",       key: "about",       emoji: "💕" },
    { label: "Contact",     key: "contact",     emoji: "📩" },
  ];

  const goTo = (key) => {
    navigate(key);
    setMobileOpen(false);
  };

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, transition: "all .3s",
        background: scrolled ? "rgba(254,248,242,.97)" : CREAM,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        boxShadow: scrolled ? "0 2px 24px rgba(192,57,92,.1)" : "none",
        borderBottom: `1px solid ${scrolled ? BORDER : "transparent"}`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* Logo */}
          <button onClick={() => goTo("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${R},${RL})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 20 }}>🎂</span>
            </div>
            <div style={{ textAlign: "left" }}>
              <div className="font-display" style={{ fontSize: "1rem", fontWeight: 700, color: R, lineHeight: 1.1 }}>Sweet Delights</div>
              <div style={{ fontSize: ".6rem", color: GOLD, letterSpacing: ".15em", fontWeight: 600, textTransform: "uppercase" }}>Bakery</div>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hide-mobile" style={{ display: "flex", gap: 28 }}>
            {links.map(l => (
              <button key={l.key} className={`nav-link ${page === l.key ? "active" : ""}`} onClick={() => goTo(l.key)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: ".9rem", fontWeight: 500, color: page === l.key ? R : DARK, transition: "color .2s" }}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Right: Admin button, Cart icon, Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {adminLoggedIn && (
              <button onClick={() => goTo("admin")} className="btn-outline hide-mobile" style={{ padding: "5px 14px", borderRadius: 8, fontSize: ".78rem" }}>
                Admin
              </button>
            )}

            {/* Cart button */}
            <button onClick={() => setCartOpen(!cartOpen)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 10, transition: "background .2s" }}
              onMouseEnter={e => e.currentTarget.style.background = RP}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <ShoppingCart size={22} color={page === "cart" ? R : DARK} />
              {cartCount > 0 && (
                <span className="animate-bounce-in" style={{
                  position: "absolute", top: 2, right: 2, background: R, color: "#fff",
                  borderRadius: "50%", width: 18, height: 18, fontSize: ".62rem",
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                }}>{cartCount > 9 ? "9+" : cartCount}</span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="show-mobile"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              style={{
                background: mobileOpen ? "#FFE8EF" : "none",
                border: "none", cursor: "pointer", padding: 8, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .2s", width: 40, height: 40,
              }}>
              {mobileOpen ? <X size={22} color={R} /> : <Menu size={22} color={DARK} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Full-screen mobile menu overlay ── */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99, top: 64,
          background: "rgba(254,248,242,.98)",
          backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column",
          animation: "fade-up .25s ease both",
          overflowY: "auto",
        }}>
          {/* Nav links */}
          <div style={{ flex: 1, padding: "16px 20px" }}>
            {links.map((l, i) => (
              <button key={l.key} onClick={() => goTo(l.key)}
                style={{
                  width: "100%", background: page === l.key ? "#FFE8EF" : "none",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 18px", borderRadius: 14, marginBottom: 8,
                  textAlign: "left", transition: "all .2s",
                  animation: `fade-up .3s ease ${i * 0.05}s both`,
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: "1.4rem", width: 36, textAlign: "center" }}>{l.emoji}</span>
                  <span style={{ fontSize: "1.05rem", fontWeight: page === l.key ? 700 : 500, color: page === l.key ? R : DARK }}>
                    {l.label}
                  </span>
                </div>
                <ChevronRight size={18} color={page === l.key ? R : MID} />
              </button>
            ))}

            {adminLoggedIn && (
              <button onClick={() => goTo("admin")}
                style={{ width: "100%", background: "#FFE8EF", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderRadius: 14, marginBottom: 8, textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: "1.4rem", width: 36, textAlign: "center" }}>🛠️</span>
                  <span style={{ fontSize: "1.05rem", fontWeight: 600, color: R }}>Admin Dashboard</span>
                </div>
                <ChevronRight size={18} color={R} />
              </button>
            )}
          </div>

          {/* Bottom CTA strip */}
          <div style={{ padding: "20px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 12 }}>
            <button onClick={() => goTo("cakes")} className="btn-rose"
              style={{ flex: 1, padding: "14px", borderRadius: 14, fontWeight: 700, fontSize: "1rem" }}>
              🎂 Shop Cakes
            </button>
            <button onClick={() => goTo("custom-cake")} className="btn-outline"
              style={{ flex: 1, padding: "14px", borderRadius: 14, fontWeight: 700, fontSize: "1rem" }}>
              ✨ Custom Order
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
