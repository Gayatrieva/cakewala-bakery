// ─── Footer Component ─────────────────────────────────────────────────────────
// Site footer with:
//  - Brand info + social icons
//  - Quick links navigation column
//  - Category links column
//  - Contact info + WhatsApp CTA
//  - Copyright + hidden admin login trigger
//
// Props:
//   navigate – navigate(pageKey) function

import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook } from "lucide-react";
import { R, RL, GOLD, DARK, MID, BORDER, WHATSAPP_NUM } from "../constants/tokens";
import { CATEGORIES } from "../constants/data";

const Footer = ({ navigate }) => (
  <footer style={{ background: `linear-gradient(135deg,${DARK} 0%,#3D1422 100%)`, color: "rgba(255,255,255,.75)", padding: "60px 20px 20px" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Top grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", gap: 40, marginBottom: 48 }}>

        {/* Brand column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${R},${RL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎂</div>
            <div>
              <div className="font-display" style={{ fontWeight: 700, color: "#fff", fontSize: "1.1rem" }}>Sweet Delights</div>
              <div style={{ fontSize: ".65rem", color: GOLD, letterSpacing: ".12em" }}>BAKERY</div>
            </div>
          </div>
          <p style={{ fontSize: ".85rem", lineHeight: 1.7, marginBottom: 20, color: "rgba(255,255,255,.65)" }}>
            Artisan cakes crafted fresh to order. Every celebration deserves something extraordinary.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            {[Instagram, Facebook].map((Icon, i) => (
              <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.7)", textDecoration: "none" }}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links + Categories columns */}
        {[
          { title: "Quick Links", items: ["Home", "Our Cakes", "Custom Cake", "About Us", "Contact"].map((l, i) => ({ label: l, key: ["home", "cakes", "custom-cake", "about", "contact"][i] })) },
          { title: "Categories",  items: CATEGORIES.slice(0, 5).map(c => ({ label: c.label, key: "cakes" })) },
        ].map(col => (
          <div key={col.title}>
            <p style={{ fontWeight: 700, color: "#fff", marginBottom: 16, fontSize: ".9rem" }}>{col.title}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.items.map(item => (
                <button key={item.label} onClick={() => navigate(item.key)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.65)", fontSize: ".85rem", textAlign: "left", padding: 0, transition: "color .2s" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.65)"}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Contact column */}
        <div>
          <p style={{ fontWeight: 700, color: "#fff", marginBottom: 16, fontSize: ".9rem" }}>Get in Touch</p>
          {[
            [Phone,  "+91 98765 43210"],
            [Mail,   "hello@sweetdelights.in"],
            [MapPin, "42 Rose Garden Lane, Mumbai"],
          ].map(([Icon, text]) => (
            <div key={text} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
              <Icon size={15} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: ".82rem", color: "rgba(255,255,255,.65)", lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
          <a href={`https://wa.me/${WHATSAPP_NUM}`} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "#fff", padding: "9px 20px", borderRadius: 10, fontSize: ".82rem", fontWeight: 600, textDecoration: "none", marginTop: 8 }}>
            <MessageCircle size={16} /> Order on WhatsApp
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: ".78rem", color: "rgba(255,255,255,.45)" }}>© 2025 Sweet Delights Bakery. All rights reserved.</p>
        <button onClick={() => navigate("admin-login")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.45)", fontSize: ".78rem" }}>
          Admin Login
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
