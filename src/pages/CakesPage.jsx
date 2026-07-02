// ─── CakesPage ────────────────────────────────────────────────────────────────
// Browse all cakes with:
//   - Search input
//   - Sort dropdown (popular/rating/price)
//   - Category filter tabs
//   - Responsive cake card grid
//
// Props:
//   navigate     – navigate(pageKey, extra?) function
//   addToCart    – not used directly here (cards link to detail page)
//   initCategory – pre-selected category id (from navigate extra)

import { useState } from "react";
import { Search, Heart } from "lucide-react";
import { R, GOLD, DARK, MID, BORDER } from "../constants/tokens";
import { CAKES, CATEGORIES } from "../constants/data";
import Stars from "../components/Stars";
import Badge from "../components/Badge";

const CakesPage = ({ navigate, addToCart, initCategory }) => {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState(initCategory || "all");
  const [sort,     setSort]     = useState("popular");

  const filtered = CAKES
    .filter(c => category === "all" || c.category === category)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === "price-asc"  ? a.price - b.price :
      sort === "price-desc" ? b.price - a.price :
      sort === "rating"     ? b.rating - a.rating :
      b.reviews - a.reviews   // default: most popular
    );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 20px" }}>

      {/* Page header */}
      <div className="animate-fade-up" style={{ marginBottom: 40 }}>
        <p style={{ color: GOLD, fontSize: ".8rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Our Collection</p>
        <h1 className="font-display" style={{ fontSize: "2.4rem", fontWeight: 700, color: DARK, marginBottom: 8 }}>All Cakes</h1>
        <p style={{ color: MID }}>Handcrafted fresh for every occasion</p>
      </div>

      {/* Search + Sort bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={16} color={MID} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cakes..."
            style={{ width: "100%", paddingLeft: 42, paddingRight: 16, height: 44, borderRadius: 12, border: `1.5px solid ${BORDER}`, fontSize: ".9rem", background: "#fff", color: DARK }} />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: "0 16px", height: 44, borderRadius: 12, border: `1.5px solid ${BORDER}`, fontSize: ".9rem", background: "#fff", color: DARK, minWidth: 160 }}>
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Category filter tabs */}
      <div className="scrollbar-hide" style={{ display: "flex", gap: 10, marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
        {[{ id: "all", label: "All Cakes", emoji: "🎂" }, ...CATEGORIES].map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)}
            style={{ padding: "8px 20px", borderRadius: 999, border: `1.5px solid ${category === cat.id ? R : BORDER}`, background: category === cat.id ? R : "#fff", color: category === cat.id ? "#fff" : DARK, fontWeight: 600, fontSize: ".82rem", cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ color: MID, fontSize: ".85rem", marginBottom: 20 }}>{filtered.length} cake{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Cake grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 24 }}>
        {filtered.map((cake, i) => (
          <div key={cake.id} className="cake-card animate-fade-up" style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(192,57,92,.08)", border: `1px solid ${BORDER}`, animationDelay: `${i * 0.05}s` }}>
            <div className="img-zoom-wrap" style={{ height: 210, position: "relative", borderRadius: 0 }}
              onClick={() => navigate("cake-detail", { cake })}>
              <img src={cake.img} alt={cake.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {cake.badge && <Badge type={cake.badge} />}
              </div>
              {/* Wishlist button */}
              <button onClick={e => { e.stopPropagation(); }}
                style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,.85)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Heart size={16} color={R} />
              </button>
            </div>
            <div style={{ padding: "16px 18px" }}>
              <p style={{ fontWeight: 700, color: DARK, fontSize: "1rem", marginBottom: 4 }}>{cake.name}</p>
              <p style={{ fontSize: ".78rem", color: MID, marginBottom: 10, lineHeight: 1.4 }}>{cake.desc.slice(0, 70)}...</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <Stars rating={cake.rating} size={12} />
                <span style={{ fontSize: ".72rem", color: MID }}>({cake.reviews})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: R, fontSize: "1.05rem" }}>from ₹{cake.price}</span>
                <button className="btn-rose" onClick={() => navigate("cake-detail", { cake })}
                  style={{ padding: "7px 18px", borderRadius: 10, fontSize: ".82rem", fontWeight: 600 }}>
                  Order →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: 48 }}>🔍</div>
          <p style={{ color: MID, marginTop: 12 }}>No cakes found. Try a different search.</p>
        </div>
      )}
    </div>
  );
};

export default CakesPage;
