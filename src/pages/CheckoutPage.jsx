// ─── CheckoutPage ─────────────────────────────────────────────────────────────
// Multi-field checkout form with:
//   - Customer details (name, phone, email, address, city, pincode)
//   - Delivery date + time slot
//   - Order notes
//   - Payment method selection (COD / WhatsApp Pay)
//   - Order summary sidebar (sticky)
//   - WhatsApp order submission on Place Order
//
// Props:
//   cart     – array of cart items
//   navigate – navigate(pageKey) function
//   clearCart– () → void  (empties cart after order)

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { R, DARK, MID, BORDER, WHATSAPP_NUM } from "../constants/tokens";
import { api } from "../api/client";

const CheckoutPage = ({ cart, navigate, clearCart }) => {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", city: "", pincode: "",
    date: "", slot: "10–12pm", notes: "", payment: "cod",
  });
  const [errors, setErrors] = useState({});

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const subtotal = cart.reduce((s, i) => s + i.selectedPrice * i.qty, 0);
  const delivery = subtotal >= 1499 ? 0 : 99;
  const total    = subtotal + delivery;

  const validate = () => {
    const e = {};
    if (!form.name)                      e.name    = "Name required";
    if (!form.phone || form.phone.length < 10) e.phone = "Valid phone required";
    if (!form.address)                   e.address = "Address required";
    if (!form.date)                      e.date    = "Delivery date required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOrder = async () => {
    if (!validate()) return;
    // 1. Save order to backend DB
    try {
      await api.placeOrder({
        customer_name: form.name,
        phone:         form.phone,
        email:         form.email,
        address:       form.address,
        city:          form.city,
        pincode:       form.pincode,
        items: cart.map(i => ({ name: i.name, weight: i.selectedWeight, flavor: i.selectedFlavor, qty: i.qty, price: i.selectedPrice })),
        subtotal,
        delivery_fee: delivery,
        total,
        payment:       form.payment,
        delivery_date: form.date,
        delivery_slot: form.slot,
        notes:         form.notes,
      });
    } catch (e) {
      console.warn("Backend save failed (order still sent via WhatsApp):", e.message);
    }
    // 2. Open WhatsApp (always, even if API fails)
    const items = cart.map(i =>
      `• ${i.name} (${i.selectedWeight}, ${i.selectedFlavor}) ×${i.qty}${i.customMsg ? ` | Msg: "${i.customMsg}"` : ""} — ₹${(i.selectedPrice * i.qty).toLocaleString()}`
    ).join("\n");
    const msg = `🎂 *Order – Sweet Delights Bakery*\n\n${items}\n\n*Subtotal: ₹${subtotal.toLocaleString()}*\n*Delivery: ${delivery === 0 ? "FREE" : "₹" + delivery}*\n*Total: ₹${total.toLocaleString()}*\n*Payment: ${form.payment === "cod" ? "Cash on Delivery" : "Online Payment"}*\n\n*Customer Details*\nName: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}, ${form.city} – ${form.pincode}\nDelivery: ${form.date} (${form.slot})\n${form.notes ? `Notes: ${form.notes}` : ""}`;
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`, "_blank");
    clearCart();
    navigate("order-success");
  };

  // Reusable field component scoped to this file
  const F = ({ label, field, req, ...p }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontWeight: 600, color: DARK, fontSize: ".88rem", marginBottom: 6, display: "block" }}>
        {label}{req && <span style={{ color: R }}> *</span>}
      </label>
      <input value={form[field]} onChange={e => upd(field, e.target.value)} {...p}
        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${errors[field] ? R : BORDER}`, fontSize: ".9rem", color: DARK }} />
      {errors[field] && <p style={{ color: R, fontSize: ".75rem", marginTop: 3 }}>{errors[field]}</p>}
    </div>
  );

  // Empty cart guard
  if (cart.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 48 }}>🛒</div>
      <p style={{ color: MID, marginTop: 12 }}>Your cart is empty.</p>
      <button className="btn-rose" onClick={() => navigate("cakes")} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10 }}>Shop Cakes</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px" }}>
      <h1 className="font-display" style={{ fontSize: "2rem", fontWeight: 700, color: DARK, marginBottom: 32 }}>Checkout</h1>

      <div className="checkout-grid">

        {/* Left: Customer details form */}
        <div style={{ background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 4px 24px rgba(192,57,92,.08)", border: `1px solid ${BORDER}` }}>
          <p className="font-display" style={{ fontWeight: 700, fontSize: "1.15rem", color: DARK, marginBottom: 20 }}>Your Details</p>

          <div className="checkout-row-2" style={{ gap: 0 }}>
            <div style={{ paddingRight: 10 }}><F label="Full Name" field="name" placeholder="Priya Sharma" req /></div>
            <div style={{ paddingLeft:  10 }}><F label="Phone"     field="phone" placeholder="9876543210" req /></div>
          </div>
          <F label="Email" field="email" placeholder="priya@email.com" type="email" />
          <F label="Delivery Address" field="address" placeholder="House / Flat No, Street, Area" req />
          <div className="checkout-row-2" style={{ gap: 0 }}>
            <div style={{ paddingRight: 10 }}><F label="City"    field="city"    placeholder="Mumbai" /></div>
            <div style={{ paddingLeft:  10 }}><F label="Pincode" field="pincode" placeholder="400001" /></div>
          </div>

          {/* Date + Slot */}
          <div className="checkout-row-2" style={{ gap: 0 }}>
            <div style={{ paddingRight: 10 }}>
              <label style={{ fontWeight: 600, color: DARK, fontSize: ".88rem", marginBottom: 6, display: "block" }}>Delivery Date <span style={{ color: R }}>*</span></label>
              <input type="date" value={form.date} onChange={e => upd("date", e.target.value)} min={new Date().toISOString().split("T")[0]}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${errors.date ? R : BORDER}`, fontSize: ".9rem", color: DARK, marginBottom: errors.date ? 4 : 16 }} />
              {errors.date && <p style={{ color: R, fontSize: ".75rem", marginBottom: 12 }}>{errors.date}</p>}
            </div>
            <div style={{ paddingLeft: 10 }}>
              <label style={{ fontWeight: 600, color: DARK, fontSize: ".88rem", marginBottom: 6, display: "block" }}>Time Slot</label>
              <select value={form.slot} onChange={e => upd("slot", e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".9rem", marginBottom: 16, color: DARK }}>
                {["10–12pm", "12–2pm", "2–4pm", "4–6pm", "6–8pm"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 600, color: DARK, fontSize: ".88rem", marginBottom: 6, display: "block" }}>Order Notes (optional)</label>
            <textarea value={form.notes} onChange={e => upd("notes", e.target.value)} rows={2} placeholder="Special instructions, gate code, landmark…"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".9rem", color: DARK, resize: "none", fontFamily: "inherit" }} />
          </div>

          {/* Payment method */}
          <p className="font-display" style={{ fontWeight: 700, fontSize: "1.1rem", color: DARK, marginBottom: 14 }}>Payment Method</p>
          <div className="payment-methods" style={{ display: "flex", gap: 14 }}>
            {[
              ["cod",       "💵 Cash on Delivery", "Pay when your cake arrives"],
              ["whatsapp",  "💳 Pay via WhatsApp",  "We'll send payment link"],
            ].map(([val, label, sub]) => (
              <div key={val} onClick={() => upd("payment", val)}
                style={{ flex: 1, padding: "16px 20px", borderRadius: 14, border: `2px solid ${form.payment === val ? R : BORDER}`, background: form.payment === val ? "#FFE8EF" : "#fff", cursor: "pointer", transition: "all .2s" }}>
                <p style={{ fontWeight: 700, color: form.payment === val ? R : DARK, fontSize: ".9rem" }}>{label}</p>
                <p style={{ fontSize: ".75rem", color: MID, marginTop: 4 }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order summary (sticky) */}
        <div className="checkout-summary-first" style={{ background: "#fff", borderRadius: 24, padding: 28, boxShadow: "0 4px 24px rgba(192,57,92,.08)", border: `1px solid ${BORDER}`, position: "sticky", top: 90 }}>
          <p className="font-display" style={{ fontWeight: 700, fontSize: "1.1rem", color: DARK, marginBottom: 16 }}>Order Summary</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {cart.map(i => (
              <div key={i.cartId} style={{ display: "flex", gap: 10, padding: "10px", background: "#FFE8EF", borderRadius: 10 }}>
                <img src={i.img} alt={i.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: ".82rem", color: DARK }}>{i.name}</p>
                  <p style={{ fontSize: ".72rem", color: MID }}>{i.selectedWeight} · {i.selectedFlavor} ×{i.qty}</p>
                </div>
                <p style={{ fontWeight: 700, color: R, fontSize: ".88rem" }}>₹{(i.selectedPrice * i.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <hr style={{ border: "none", borderTop: `1px solid ${BORDER}`, marginBottom: 14 }} />
          {[["Subtotal", `₹${subtotal.toLocaleString()}`], ["Delivery", delivery === 0 ? "FREE 🎉" : `₹${delivery}`], ["Total", `₹${total.toLocaleString()}`]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: MID, fontSize: ".88rem" }}>{k}</span>
              <span style={{ fontWeight: k === "Total" ? 800 : 500, color: k === "Total" ? R : DARK, fontSize: k === "Total" ? "1.1rem" : ".88rem" }}>{v}</span>
            </div>
          ))}
          <button className="btn-rose" onClick={handleOrder}
            style={{ width: "100%", marginTop: 18, padding: "15px", borderRadius: 12, fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <MessageCircle size={18} /> Place Order via WhatsApp
          </button>
          <p style={{ fontSize: ".72rem", color: MID, textAlign: "center", marginTop: 10 }}>Your order details will open in WhatsApp for confirmation.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
