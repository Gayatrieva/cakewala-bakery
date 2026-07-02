// ─── StatusBadge Component ────────────────────────────────────────────────────
// Shows a coloured pill badge for order statuses used in the admin panel.
// Statuses: pending | accepted | preparing | out_for_delivery | delivered | cancelled | rejected

const StatusBadge = ({ status }) => {
  const map = {
    pending:           ["#92400E", "#FEF3C7", "⏳ Pending"],
    accepted:          ["#1E40AF", "#DBEAFE", "✓ Accepted"],
    preparing:         ["#7C3AED", "#EDE9FE", "🍰 Preparing"],
    out_for_delivery:  ["#0F766E", "#CCFBF1", "🛵 Out for Delivery"],
    delivered:         ["#065F46", "#D1FAE5", "✅ Delivered"],
    cancelled:         ["#991B1B", "#FEE2E2", "✕ Cancelled"],
    rejected:          ["#7F1D1D", "#FEE2E2", "✕ Rejected"],
    // custom request statuses
    new:               ["#1E40AF", "#DBEAFE", "🆕 New"],
    reviewing:         ["#7C3AED", "#EDE9FE", "🔍 Reviewing"],
    quoted:            ["#065F46", "#D1FAE5", "💬 Quoted"],
  };
  const [color, bg, label] = map[status] || ["#6B7280", "#F3F4F6", status];
  return <span className="status-badge" style={{ background: bg, color }}>{label}</span>;
};

export default StatusBadge;
