// ─── WhatsAppBtn Component ────────────────────────────────────────────────────
// Fixed floating WhatsApp button (bottom-right).
// When cart items + orderInfo are provided, it pre-fills a full order message.
// Props:
//   cart      – array of cart items (optional)
//   orderInfo – { date, slot, name, phone, address } (optional)

import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUM } from "../constants/tokens";

const WhatsAppBtn = ({ cart = [], orderInfo = null }) => {
  const buildMsg = () => {
    if (orderInfo) {
      const items = cart
        .map(i => `• ${i.name} (${i.selectedWeight}, ${i.selectedFlavor}) ×${i.qty} — ₹${(i.selectedPrice * i.qty).toLocaleString()}`)
        .join("\n");
      const total = cart.reduce((s, i) => s + i.selectedPrice * i.qty, 0);
      return `🎂 *New Order — Sweet Delights Bakery*\n\n${items}\n\n*Total: ₹${total.toLocaleString()}*\n*Delivery: ${orderInfo.date} (${orderInfo.slot})*\n*Name: ${orderInfo.name}*\n*Phone: ${orderInfo.phone}*\n*Address: ${orderInfo.address}*`;
    }
    return `Hi Sweet Delights! I'd like to place an order. 🎂`;
  };

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(buildMsg())}`}
      target="_blank"
      rel="noopener noreferrer"
      className="pulse-wa"
      style={{
        position: "fixed", bottom: 28, right: 28, zIndex: 999,
        width: 60, height: 60, borderRadius: "50%",
        background: "linear-gradient(135deg,#25D366,#128C7E)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", boxShadow: "0 6px 24px rgba(37,211,102,.45)",
        textDecoration: "none", transition: "transform .2s",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      title="Chat on WhatsApp"
    >
      <MessageCircle size={28} fill="#fff" />
    </a>
  );
};

export default WhatsAppBtn;
