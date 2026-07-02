// ─── Stars Component ──────────────────────────────────────────────────────────
// Renders 5 stars with filled/empty based on rating value.

const Stars = ({ rating, size = 14 }) => (
  <span className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <span key={i} className="star-fill" style={{ fontSize: size, opacity: i <= Math.round(rating) ? 1 : 0.25 }}>★</span>
    ))}
  </span>
);

export default Stars;
