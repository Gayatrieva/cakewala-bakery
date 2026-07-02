// ─── FloatingPetals Component ─────────────────────────────────────────────────
// Decorative animated flower petals floating across the hero section background.
// Uses the CSS `.petal` class (defined in styles.js) with randomised position/delay/speed.

const PETALS = ["🌸", "🌷", "🌺", "🌼", "✿", "❀", "🌹", "💐"];

const FloatingPetals = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
    {Array.from({ length: 16 }).map((_, i) => (
      <span
        key={i}
        className="petal"
        style={{
          left:              `${Math.random() * 100}%`,
          animationDelay:    `${Math.random() * 12}s`,
          animationDuration: `${10 + Math.random() * 8}s`,
          fontSize:          `${0.7 + Math.random() * 0.8}rem`,
          opacity:           0.6 + Math.random() * 0.4,
        }}
      >
        {PETALS[i % PETALS.length]}
      </span>
    ))}
  </div>
);

export default FloatingPetals;
