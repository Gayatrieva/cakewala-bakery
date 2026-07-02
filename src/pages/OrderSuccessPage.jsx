// ─── OrderSuccessPage ─────────────────────────────────────────────────────────
// Confirmation screen shown after a successful WhatsApp order submission.
// Props:
//   navigate – navigate(pageKey) function

import { R, MID } from "../constants/tokens";

const OrderSuccessPage = ({ navigate }) => (
  <div style={{ textAlign: "center", padding: "80px 20px", maxWidth: 560, margin: "0 auto" }}>
    <div className="animate-bounce-in" style={{ fontSize: 80, marginBottom: 16 }}>🎂</div>
    <h1 className="font-display" style={{ fontSize: "2.2rem", fontWeight: 700, color: R, marginBottom: 12 }}>Order Placed!</h1>
    <p style={{ color: MID, lineHeight: 1.7, marginBottom: 8 }}>
      Thank you! Your order has been sent to our WhatsApp. Our team will confirm it within 30 minutes.
    </p>
    <p style={{ color: MID, fontSize: ".9rem", marginBottom: 32 }}>
      You'll receive delivery updates directly on WhatsApp. 🎉
    </p>
    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
      <button className="btn-rose" onClick={() => navigate("home")}
        style={{ padding: "12px 28px", borderRadius: 12, fontWeight: 600 }}>
        Back to Home
      </button>
      <button className="btn-outline" onClick={() => navigate("cakes")}
        style={{ padding: "12px 28px", borderRadius: 12, fontWeight: 600 }}>
        Order More Cakes
      </button>
    </div>
  </div>
);

export default OrderSuccessPage;
