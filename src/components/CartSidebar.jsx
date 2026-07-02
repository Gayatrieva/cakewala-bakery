// ─── CartSidebar Component ────────────────────────────────────────────────────
// Sliding right-side cart drawer.
// Shows cart items with quantity controls, pricing, and checkout button.
// Free delivery indicator for orders >= ₹1,499.
//
// Props:
//   cart          – array of cart items
//   updateQty     – (cartId, newQty) → void
//   removeFromCart– (cartId) → void
//   setCartOpen   – setter to close sidebar
//   navigate      – navigate(pageKey) function

import { X, Minus, Plus, Trash2 } from "lucide-react";
import { R, RP, GOLD, DARK, MID, BORDER } from "../constants/tokens";

const CartSidebar = ({ cart, updateQty, removeFromCart, setCartOpen, navigate }) => {
  const total       = cart.reduce((s, i) => s + i.selectedPrice * i.qty, 0);
  const count       = cart.reduce((s, i) => s + i.qty, 0);
  const deliveryFee = total >= 1499 ? 0 : 99;

  return (
    <>
      {/* Backdrop */}
      <div onClick={() => setCartOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(42,18,21,.4)", zIndex: 200 }} />

      {/* Drawer */}
      <div className="sidebar-enter" style={{
        position: "fixed", top: 0, right: 0, height: "100%", width: "100%", maxWidth: 420,
        background: "#fff", zIndex: 201, display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(42,18,21,.15)", borderRadius: "20px 0 0 20px",
      }}>

        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 700, color: DARK }}>Your Cart</h3>
            <p style={{ fontSize: ".8rem", color: MID }}>{count} item{count !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: RP, border: "none", cursor: "pointer", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={18} color={R} />
          </button>
        </div>

        {/* Items list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60 }}>
              <div style={{ fontSize: 48 }}>🛒</div>
              <p style={{ color: MID, marginTop: 12 }}>Your cart is empty</p>
              <button className="btn-rose" onClick={() => { setCartOpen(false); navigate("cakes"); }}
                style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, fontSize: ".9rem" }}>
                Browse Cakes
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {cart.map(item => (
                <div key={item.cartId} style={{ display: "flex", gap: 12, padding: "12px", background: RP, borderRadius: 12 }}>
                  <img src={item.img} alt={item.name} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: ".9rem", color: DARK, marginBottom: 2 }}>{item.name}</p>
                    <p style={{ fontSize: ".75rem", color: MID }}>{item.selectedWeight} · {item.selectedFlavor}</p>
                    {item.customMsg && (
                      <p style={{ fontSize: ".7rem", color: GOLD, marginTop: 2 }}>✉ "{item.customMsg.slice(0, 30)}..."</p>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                      {/* Qty controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button className="qty-btn" onClick={() => updateQty(item.cartId, item.qty - 1)}><Minus size={12} /></button>
                        <span style={{ fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.cartId, item.qty + 1)}><Plus size={12} /></button>
                      </div>
                      {/* Price + delete */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, color: R }}>₹{(item.selectedPrice * item.qty).toLocaleString()}</span>
                        <button onClick={() => removeFromCart(item.cartId)} style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: totals + checkout */}
        {cart.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: `1px solid ${BORDER}` }}>
            <div style={{ marginBottom: 12 }}>
              {[
                ["Subtotal", `₹${total.toLocaleString()}`],
                ["Delivery", deliveryFee === 0 ? "FREE 🎉" : `₹${deliveryFee}`],
                ["Total",    `₹${(total + deliveryFee).toLocaleString()}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: MID, fontSize: ".85rem" }}>{k}</span>
                  <span style={{ fontWeight: k === "Total" ? 700 : 400, color: k === "Total" ? R : DARK, fontSize: k === "Total" ? "1rem" : ".85rem" }}>{v}</span>
                </div>
              ))}
            </div>
            {total < 1499 && (
              <p style={{ fontSize: ".72rem", color: GOLD, marginBottom: 10, textAlign: "center" }}>
                Add ₹{(1499 - total).toLocaleString()} more for FREE delivery!
              </p>
            )}
            <button className="btn-rose" onClick={() => { setCartOpen(false); navigate("checkout"); }}
              style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: "1rem", fontWeight: 600 }}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
