// ─── AdminProducts ────────────────────────────────────────────────────────────
// Cake catalogue management with:
//   - Grid of cake cards with Edit and Delete buttons
//   - Add New Cake button
//   - Modal form for adding or editing a cake (name, price, description, category, badge)

import { useState } from "react";
import { Plus, Edit, Trash, X } from "lucide-react";
import { R, DARK, MID, BORDER } from "../constants/tokens";
import { CAKES, CATEGORIES } from "../constants/data";
import Stars from "../components/Stars";
import Badge from "../components/Badge";

const AdminProducts = () => {
  const [products, setProducts] = useState(CAKES);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);  // id of cake being edited, or null for new
  const [form, setForm] = useState({ name: "", category: "birthday", price: "", desc: "", badge: "" });

  const openAdd  = () => { setForm({ name: "", category: "birthday", price: "", desc: "", badge: "" }); setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ name: p.name, category: p.category, price: String(p.price), desc: p.desc, badge: p.badge }); setEditing(p.id); setShowForm(true); };

  const save = () => {
    if (editing) {
      // Update existing cake
      setProducts(ps => ps.map(p => p.id === editing ? { ...p, ...form, price: Number(form.price) } : p));
    } else {
      // Add new cake with placeholder image/rating/reviews/flavors/weights
      setProducts(ps => [...ps, {
        id: Date.now(), ...form, price: Number(form.price),
        img: CAKES[0].img, rating: 5, reviews: 0,
        flavors: ["Vanilla"],
        weights: [{ w: "1kg", p: Number(form.price) }],
      }]);
    }
    setShowForm(false);
  };

  const del = (id) => setProducts(ps => ps.filter(p => p.id !== id));

  return (
    <div>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ color: MID, fontSize: ".88rem" }}>{products.length} cakes in catalogue</p>
        <button className="btn-rose" onClick={openAdd} style={{ padding: "10px 24px", borderRadius: 12, fontWeight: 600, fontSize: ".88rem", display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={16} /> Add New Cake
        </button>
      </div>

      {/* Product grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
        {products.map(p => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 16px rgba(192,57,92,.07)", border: `1px solid ${BORDER}` }}>
            <div style={{ height: 160, position: "relative" }}>
              <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {p.badge && <div style={{ position: "absolute", top: 10, left: 10 }}><Badge type={p.badge} /></div>}
              {/* Action buttons */}
              <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6 }}>
                <button onClick={() => openEdit(p)} style={{ background: "rgba(255,255,255,.9)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Edit size={14} color={MID} />
                </button>
                <button onClick={() => del(p.id)} style={{ background: "rgba(254,226,226,.95)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Trash size={14} color="#EF4444" />
                </button>
              </div>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <p style={{ fontWeight: 700, color: DARK, marginBottom: 4 }}>{p.name}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: ".75rem", background: "#FFE8EF", color: R, padding: "2px 8px", borderRadius: 999, fontWeight: 600, textTransform: "capitalize" }}>{p.category}</span>
                <span style={{ fontWeight: 700, color: R }}>from ₹{p.price}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <Stars rating={p.rating} size={11} />
                <span style={{ fontSize: ".7rem", color: MID }}>({p.reviews})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="modal-box" style={{ padding: 32 }}>
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 className="font-display" style={{ fontWeight: 700, color: DARK, fontSize: "1.2rem" }}>{editing ? "Edit Cake" : "Add New Cake"}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "#FFE8EF", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={16} color={R} />
              </button>
            </div>

            {/* Text fields */}
            {[["name", "Cake Name"], ["price", "Base Price (₹)"], ["desc", "Short Description"]].map(([field, label]) => (
              <div key={field} style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, color: DARK, fontSize: ".88rem", display: "block", marginBottom: 6 }}>{label}</label>
                {field === "desc" ? (
                  <textarea value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} rows={3}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".88rem", fontFamily: "inherit", color: DARK }} />
                ) : (
                  <input value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} type={field === "price" ? "number" : "text"}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".88rem", color: DARK }} />
                )}
              </div>
            ))}

            {/* Category dropdown */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 600, color: DARK, fontSize: ".88rem", display: "block", marginBottom: 6 }}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".88rem", color: DARK }}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            {/* Badge dropdown */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 600, color: DARK, fontSize: ".88rem", display: "block", marginBottom: 6 }}>Badge</label>
              <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".88rem", color: DARK }}>
                <option value="">None</option>
                <option value="bestseller">Bestseller</option>
                <option value="featured">Featured</option>
                <option value="new">New</option>
              </select>
            </div>

            {/* Modal actions */}
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-outline" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "12px", borderRadius: 10, fontWeight: 600 }}>Cancel</button>
              <button className="btn-rose"    onClick={save}                     style={{ flex: 2, padding: "12px", borderRadius: 10, fontWeight: 600 }}>{editing ? "Save Changes" : "Add Cake"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
