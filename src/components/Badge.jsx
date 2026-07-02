// ─── Badge Component ──────────────────────────────────────────────────────────
// Shows a coloured pill badge for "bestseller", "featured", or "new" products.

const Badge = ({ type }) => {
  const map = {
    bestseller: ["#C0395C", "#FFE8EF", "🏆 Bestseller"],
    featured:   ["#C4945A", "#FEF3E7", "⭐ Featured"],
    new:        ["#059669", "#ECFDF5", "✨ New"],
  };
  if (!map[type]) return null;
  const [color, bg, label] = map[type];
  return <span className="tag-badge" style={{ background: bg, color }}>{label}</span>;
};

export default Badge;
