// ─── CakeDetailPage ───────────────────────────────────────────────────────────
// Individual cake product detail page with:
//   - Breadcrumb navigation
//   - Image gallery (main + 3 thumbnails)
//   - Weight / Flavour selector buttons
//   - Custom message input
//   - Qty control + total price
//   - Add to Cart + WhatsApp order buttons
//   - Delivery info banner
//   - Related cakes grid
//
// Props:
//   cake       – the full CAKES data object
//   navigate   – navigate(pageKey, extra?) function
//   addToCart  – (cake, weight, price, flavor, qty, customMsg) → void
//   setCartOpen– setter to open cart sidebar

import { useState } from "react";
import { ChevronRight, Minus, Plus, Truck, MessageCircle } from "lucide-react";
import { R, GOLD, DARK, MID, BORDER, WHATSAPP_NUM } from "../constants/tokens";
import { CAKES } from "../constants/data";
import Stars from "../components/Stars";
import Badge from "../components/Badge";
import SectionTitle from "../components/SectionTitle";

const CakeDetailPage = ({ cake, navigate, addToCart, setCartOpen }) => {
  const [selWeight, setSelWeight] = useState(cake.weights[1]);
  const [selFlavor, setSelFlavor] = useState(cake.flavors[0]);
  const [qty,       setQty]       = useState(1);
  const [customMsg, setCustomMsg] = useState("");
  const [added,     setAdded]     = useState(false);

  const handleAdd = () => {
    addToCart(cake, selWeight.w, selWeight.p, selFlavor, qty, customMsg);
    setAdded(true);
    setTimeout(() => { setAdded(false); setCartOpen(true); }, 600);
  };

  const related = CAKES.filter(c => c.id !== cake.id && c.category === cake.category).slice(0, 3);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 20px" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 32, color: MID, fontSize: ".82rem" }}>
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: MID }}>Home</button>
        <ChevronRight size={14} color={MID} />
        <button onClick={() => navigate("cakes")} style={{ background: "none", border: "none", cursor: "pointer", color: MID }}>Cakes</button>
        <ChevronRight size={14} color={MID} />
        <span style={{ color: R }}>{cake.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

        {/* Left: Image gallery */}
        <div className="animate-fade-up">
          <div className="img-zoom-wrap" style={{ borderRadius: 24, overflow: "hidden", height: 420, position: "relative" }}>
            <img src={cake.img} alt={cake.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {cake.badge && <div style={{ position: "absolute", top: 16, left: 16 }}><Badge type={cake.badge} /></div>}
          </div>
          {/* Thumbnail row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 12 }}>
            {[cake.img, cake.img, cake.img].map((img, i) => (
              <div key={i} className="img-zoom-wrap" style={{ height: 90, borderRadius: 12 }}>
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .8 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Options panel */}
        <div className="animate-fade-up" style={{ animationDelay: ".1s" }}>
          {/* Badges row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {cake.badge && <Badge type={cake.badge} />}
            <span style={{ fontSize: ".72rem", background: "#F0FDF4", color: "#065F46", padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>✓ Eggless available</span>
          </div>

          <h1 className="font-display" style={{ fontSize: "2rem", fontWeight: 700, color: DARK, marginBottom: 8 }}>{cake.name}</h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Stars rating={cake.rating} size={16} />
            <span style={{ fontWeight: 700, color: DARK }}>{cake.rating}</span>
            <span style={{ color: MID, fontSize: ".85rem" }}>({cake.reviews} reviews)</span>
          </div>

          <p style={{ color: MID, lineHeight: 1.75, marginBottom: 24, fontSize: ".95rem" }}>{cake.desc}</p>

          {/* Weight selector */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontWeight: 600, color: DARK, marginBottom: 10 }}>Select Weight</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {cake.weights.map(w => (
                <button key={w.w} onClick={() => setSelWeight(w)}
                  style={{ padding: "8px 20px", borderRadius: 10, border: `2px solid ${selWeight.w === w.w ? R : BORDER}`, background: selWeight.w === w.w ? "#FFE8EF" : "#fff", color: selWeight.w === w.w ? R : DARK, fontWeight: 600, fontSize: ".85rem", cursor: "pointer", transition: "all .2s" }}>
                  {w.w} — <span style={{ color: R }}>₹{w.p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Flavour selector */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontWeight: 600, color: DARK, marginBottom: 10 }}>Select Flavour</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {cake.flavors.map(f => (
                <button key={f} onClick={() => setSelFlavor(f)}
                  style={{ padding: "8px 16px", borderRadius: 10, border: `2px solid ${selFlavor === f ? R : BORDER}`, background: selFlavor === f ? "#FFE8EF" : "#fff", color: selFlavor === f ? R : DARK, fontWeight: 600, fontSize: ".85rem", cursor: "pointer", transition: "all .2s" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Custom message */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontWeight: 600, color: DARK, marginBottom: 8 }}>Message on Cake <span style={{ fontWeight: 400, color: MID }}>(optional)</span></p>
            <input value={customMsg} onChange={e => setCustomMsg(e.target.value)} placeholder='e.g. "Happy Birthday Priya! 🎂"' maxLength={40}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".9rem", color: DARK }} />
            <p style={{ fontSize: ".72rem", color: MID, marginTop: 4 }}>{customMsg.length}/40 characters</p>
          </div>

          {/* Qty + price */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#FFE8EF", borderRadius: 12, padding: "8px 16px" }}>
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={14} /></button>
              <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center", fontSize: "1.05rem" }}>{qty}</span>
              <button className="qty-btn" onClick={() => setQty(qty + 1)}><Plus size={14} /></button>
            </div>
            <div>
              <p style={{ color: MID, fontSize: ".78rem" }}>Total</p>
              <p style={{ fontWeight: 800, color: R, fontSize: "1.4rem" }}>₹{(selWeight.p * qty).toLocaleString()}</p>
            </div>
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button className={`btn-rose ${added ? "animate-pop" : ""}`} onClick={handleAdd}
              style={{ flex: 2, padding: "14px", borderRadius: 12, fontSize: "1rem", fontWeight: 700 }}>
              {added ? "✓ Added to Cart!" : "Add to Cart 🛒"}
            </button>
            <a href={`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(`Hi! I'd like to order "${cake.name}" (${selWeight.w}, ${selFlavor}). Please confirm availability. 🎂`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, background: "#25D366", color: "#fff", borderRadius: 12, fontSize: ".85rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>

          {/* Delivery info */}
          <div style={{ marginTop: 20, padding: "14px 18px", background: "#F0FDF4", borderRadius: 12, border: "1px solid #86EFAC", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Truck size={18} color="#065F46" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 600, color: "#065F46", fontSize: ".85rem" }}>Free delivery on orders above ₹1,499</p>
              <p style={{ color: "#047857", fontSize: ".78rem" }}>Same-day delivery available for orders placed before 11 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related cakes */}
      {related.length > 0 && (
        <div style={{ marginTop: 64 }}>
          <SectionTitle eyebrow="You Might Also Like" title="Related Cakes" center={false} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 24 }}>
            {related.map(c => (
              <div key={c.id} className="cake-card" style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(192,57,92,.08)", border: `1px solid ${BORDER}`, cursor: "pointer" }}
                onClick={() => navigate("cake-detail", { cake: c })}>
                <div style={{ height: 180 }}><img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                <div style={{ padding: "14px 16px" }}>
                  <p style={{ fontWeight: 600, color: DARK }}>{c.name}</p>
                  <p style={{ color: R, fontWeight: 700, marginTop: 4 }}>from ₹{c.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CakeDetailPage;
