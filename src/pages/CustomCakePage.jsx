// ─── CustomCakePage ───────────────────────────────────────────────────────────
// Custom cake order inquiry form with:
//   - Personal info (name, phone, email, occasion)
//   - Cake specs (shape, size, flavour, tiers, budget)
//   - Preferred delivery date + design notes
//   - WhatsApp submission (opens pre-filled message)
//   - Success screen after submission
//
// Props:
//   navigate – navigate(pageKey) function

import { useState } from "react";
import { Minus, Plus, MessageCircle, Camera } from "lucide-react";
import { R, GOLD, DARK, MID, BORDER, WHATSAPP_NUM } from "../constants/tokens";

const CustomCakePage = ({ navigate }) => {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", shape: "round", size: "1kg",
    tiers: 1, flavor: "Vanilla", occasion: "Birthday", budget: "", message: "", date: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const buildWA = () => [
    `🎂 *Custom Cake Request – Sweet Delights Bakery*`,
    `Name: ${form.name} (${form.phone})`,
    `Shape: ${form.shape} | Size: ${form.size} | Tiers: ${form.tiers}`,
    `Flavour: ${form.flavor} | Occasion: ${form.occasion}`,
    form.budget  ? `Budget: ${form.budget}`           : "",
    form.date    ? `Delivery Date: ${form.date}`       : "",
    form.message ? `Details: ${form.message}`          : "",
  ].filter(Boolean).join("\n");

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(buildWA())}`, "_blank");
    setSubmitted(true);
  };

  // Small reusable sub-components scoped to this file
  const Label = ({ children }) => (
    <label style={{ fontWeight: 600, color: DARK, fontSize: ".9rem", marginBottom: 6, display: "block" }}>{children}</label>
  );
  const Input = ({ field, ...props }) => (
    <input value={form[field]} onChange={e => upd(field, e.target.value)} {...props}
      style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".9rem", color: DARK, marginBottom: 16 }} />
  );

  // Success screen
  if (submitted) {
    return (
      <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
        <div className="animate-bounce-in" style={{ fontSize: 72 }}>🎉</div>
        <h2 className="font-display" style={{ fontSize: "2rem", fontWeight: 700, color: R, margin: "16px 0 8px" }}>Request Sent!</h2>
        <p style={{ color: MID, lineHeight: 1.7 }}>Your custom cake inquiry has been sent to our WhatsApp. Our cake artist will respond within 2 hours!</p>
        <button className="btn-rose" onClick={() => navigate("home")} style={{ marginTop: 28, padding: "12px 32px", borderRadius: 12, fontWeight: 600 }}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 20px" }}>
      <div className="animate-fade-up">
        <p style={{ color: GOLD, fontSize: ".8rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Dream it, we'll bake it</p>
        <h1 className="font-display" style={{ fontSize: "2.4rem", fontWeight: 700, color: DARK, marginBottom: 8 }}>Design Your Custom Cake</h1>
        <p style={{ color: MID, marginBottom: 40 }}>Fill in the details below and we'll reach out on WhatsApp to discuss your vision.</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 24, padding: "36px 40px", boxShadow: "0 8px 32px rgba(192,57,92,.08)", border: `1px solid ${BORDER}` }}>

        {/* Personal info row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div><Label>Your Name *</Label><Input field="name" placeholder="Priya Sharma" /></div>
          <div><Label>Phone Number *</Label><Input field="phone" placeholder="+91 98765 43210" /></div>
          <div><Label>Email</Label><Input field="email" placeholder="priya@email.com" /></div>
          <div>
            <Label>Occasion</Label>
            <select value={form.occasion} onChange={e => upd("occasion", e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".9rem", marginBottom: 16, color: DARK }}>
              {["Birthday", "Wedding", "Anniversary", "Baby Shower", "Corporate", "Other"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <hr className="lace-divider" style={{ margin: "8px 0 24px" }} />
        <p className="font-display" style={{ fontWeight: 700, color: DARK, fontSize: "1.1rem", marginBottom: 20 }}>Cake Specifications</p>

        {/* Shape */}
        <Label>Shape</Label>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          {["Round", "Square", "Heart", "Hexagon", "Tier"].map(s => (
            <button key={s} onClick={() => upd("shape", s.toLowerCase())}
              style={{ padding: "8px 20px", borderRadius: 10, border: `2px solid ${form.shape === s.toLowerCase() ? R : BORDER}`, background: form.shape === s.toLowerCase() ? "#FFE8EF" : "#fff", color: form.shape === s.toLowerCase() ? R : DARK, fontWeight: 600, fontSize: ".85rem", cursor: "pointer", transition: "all .2s" }}>
              {s}
            </button>
          ))}
        </div>

        {/* Size */}
        <Label>Size</Label>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          {["0.5kg", "1kg", "1.5kg", "2kg", "3kg", "Custom"].map(s => (
            <button key={s} onClick={() => upd("size", s)}
              style={{ padding: "8px 18px", borderRadius: 10, border: `2px solid ${form.size === s ? R : BORDER}`, background: form.size === s ? "#FFE8EF" : "#fff", color: form.size === s ? R : DARK, fontWeight: 600, fontSize: ".85rem", cursor: "pointer", transition: "all .2s" }}>
              {s}
            </button>
          ))}
        </div>

        {/* Flavour */}
        <Label>Flavour</Label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          {["Vanilla", "Chocolate", "Red Velvet", "Strawberry", "Lemon", "Caramel", "Hazelnut"].map(f => (
            <button key={f} onClick={() => upd("flavor", f)}
              style={{ padding: "7px 16px", borderRadius: 10, border: `2px solid ${form.flavor === f ? R : BORDER}`, background: form.flavor === f ? "#FFE8EF" : "#fff", color: form.flavor === f ? R : DARK, fontWeight: 500, fontSize: ".82rem", cursor: "pointer", transition: "all .2s" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Tiers + Budget */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <Label>Number of Tiers</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <button className="qty-btn" onClick={() => upd("tiers", Math.max(1, form.tiers - 1))}><Minus size={14} /></button>
              <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{form.tiers}</span>
              <button className="qty-btn" onClick={() => upd("tiers", Math.min(5, form.tiers + 1))}><Plus size={14} /></button>
            </div>
          </div>
          <div>
            <Label>Budget (approx)</Label>
            <select value={form.budget} onChange={e => upd("budget", e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".9rem", marginBottom: 16, color: DARK }}>
              <option value="">Select range</option>
              <option>Under ₹2,000</option>
              <option>₹2,000 – ₹5,000</option>
              <option>₹5,000 – ₹10,000</option>
              <option>Above ₹10,000</option>
            </select>
          </div>
        </div>

        <Label>Preferred Delivery Date</Label>
        <Input field="date" type="date" />

        <Label>Design Details & Special Requests</Label>
        <textarea value={form.message} onChange={e => upd("message", e.target.value)} rows={4}
          placeholder="Describe your dream cake — colours, theme, figurines, photo print, inscription, dietary needs…"
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".9rem", color: DARK, resize: "vertical", marginBottom: 16, fontFamily: "inherit" }} />

        {/* Reference photo hint */}
        <div style={{ padding: "14px 18px", background: "#FFE8EF", borderRadius: 12, marginBottom: 24, display: "flex", gap: 10 }}>
          <Camera size={18} color={R} style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: ".82rem", color: MID, lineHeight: 1.5 }}>Have a reference image? Send it directly on WhatsApp after submitting this form — our cake artist will discuss it with you.</p>
        </div>

        <button className="btn-rose" onClick={handleSubmit}
          style={{ width: "100%", padding: "15px", borderRadius: 12, fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <MessageCircle size={20} /> Send Inquiry via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default CustomCakePage;
