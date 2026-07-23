// ─── AdminProducts ────────────────────────────────────────────────────────────
// Cake catalogue management using local state seeded from CAKES data.
// Add/Edit/Delete all work in-memory — no backend needed.

import { useState } from "react";
import { Plus, Edit, Trash, X, ImagePlus, Link } from "lucide-react";
import { R, DARK, MID, BORDER } from "../constants/tokens";
import Stars from "../components/Stars";
import Badge from "../components/Badge";
import { CAKES } from "../constants/data";

const CATEGORIES_LIST = [
  { id: "birthday",    label: "Birthday Cakes" },
  { id: "wedding",     label: "Wedding Cakes" },
  { id: "anniversary", label: "Anniversary" },
  { id: "photo",       label: "Photo Cakes" },
  { id: "cupcake",     label: "Cupcakes" },
  { id: "custom",      label: "Custom Cakes" },
];

const EMPTY_FORM = { name: "", category: "birthday", price: "", desc: "", badge: "", img: "", imgMode: "url" };

const AdminProducts = () => {
  const [products,   setProducts]   = useState(CAKES);
  const [showForm,   setShowForm]   = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [imgPreview, setImgPreview] = useState("");
  const [saving,     setSaving]     = useState(false);

  const openAdd  = () => { setForm(EMPTY_FORM); setImgPreview(""); setEditing(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, category: p.category, price: String(p.price), desc: p.desc || p.description || "", badge: p.badge || "", img: p.img || "", imgMode: "url" });
    setImgPreview(p.img || "");
    setEditing(p.id);
    setShowForm(true);
  };

  const save = () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    setTimeout(() => {
      const entry = {
        id:       editing ?? Date.now(),
        name:     form.name,
        category: form.category,
        price:    Number(form.price),
        desc:     form.desc,
        badge:    form.badge,
        img:      imgPreview || form.img || "https://images.unsplash.com/photo-1488477304112-4944851de03d?w=600&q=80",
        rating:   editing ? products.find(p => p.id === editing)?.rating ?? 4.8 : 4.8,
        reviews:  editing ? products.find(p => p.id === editing)?.reviews ?? 0 : 0,
        flavors:  ["Vanilla"],
        weights:  [{ w: "1kg", p: Number(form.price) }],
      };
      if (editing) {
        setProducts(ps => ps.map(p => p.id === editing ? entry : p));
      } else {
        setProducts(ps => [...ps, entry]);
      }
      setShowForm(false);
      setSaving(false);
    }, 400);
  };

  const del = (id) => {
    if (!window.confirm("Delete this cake?")) return;
    setProducts(ps => ps.filter(p => p.id !== id));
  };

  return (
    <div>
      {/* Header */}
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

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="modal-box" style={{ padding: 32, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 className="font-display" style={{ fontWeight: 700, color: DARK, fontSize: "1.2rem" }}>{editing ? "Edit Cake" : "Add New Cake"}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "#FFE8EF", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={16} color={R} />
              </button>
            </div>

            {/* Text fields */}
            {[["name","Cake Name"],["price","Base Price (₹)"],["desc","Short Description"]].map(([field, label]) => (
              <div key={field} style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, color: DARK, fontSize: ".88rem", display: "block", marginBottom: 6 }}>{label}</label>
                {field === "desc" ? (
                  <textarea value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} rows={3}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".88rem", fontFamily: "inherit", color: DARK, boxSizing: "border-box" }} />
                ) : (
                  <input value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} type={field === "price" ? "number" : "text"}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".88rem", color: DARK, boxSizing: "border-box" }} />
                )}
              </div>
            ))}

            {/* Image URL */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 600, color: DARK, fontSize: ".88rem", display: "block", marginBottom: 8 }}>
                <Link size={13} style={{ display: "inline", marginRight: 5 }} />Cake Image URL
              </label>
              <input type="url" placeholder="https://example.com/cake.jpg" value={form.img}
                onChange={e => { setForm(f => ({ ...f, img: e.target.value })); setImgPreview(e.target.value); }}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".88rem", color: DARK, boxSizing: "border-box" }} />
              {imgPreview && (
                <div style={{ marginTop: 12, position: "relative" }}>
                  <img src={imgPreview} alt="Preview" onError={() => setImgPreview("")}
                    style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 10, border: `1.5px solid ${BORDER}` }} />
                  <button type="button" onClick={() => { setImgPreview(""); setForm(f => ({ ...f, img: "" })); }}
                    style={{ position: "absolute", top: 6, right: 6, background: "rgba(255,255,255,.9)", border: "none", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <X size={13} color={R} />
                  </button>
                </div>
              )}
            </div>

            {/* Category */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 600, color: DARK, fontSize: ".88rem", display: "block", marginBottom: 6 }}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".88rem", color: DARK }}>
                {CATEGORIES_LIST.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            {/* Badge */}
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

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-outline" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "12px", borderRadius: 10, fontWeight: 600 }}>Cancel</button>
              <button className="btn-rose" onClick={save} disabled={saving} style={{ flex: 2, padding: "12px", borderRadius: 10, fontWeight: 600, opacity: saving ? .7 : 1 }}>
                {saving ? "Saving…" : (editing ? "Save Changes" : "Add Cake")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
