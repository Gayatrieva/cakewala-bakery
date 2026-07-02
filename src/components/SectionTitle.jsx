// ─── SectionTitle Component ───────────────────────────────────────────────────
// Reusable section heading with optional eyebrow text, subtitle, and gold divider.
// Props: eyebrow, title, sub, center (default true)

import { GOLD, DARK, MID } from "../constants/tokens";

const SectionTitle = ({ eyebrow, title, sub, center = true }) => (
  <div className={`mb-10 ${center ? "text-center" : ""}`}>
    {eyebrow && (
      <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: GOLD }}>
        {eyebrow}
      </p>
    )}
    <h2 className="section-title text-3xl md:text-4xl font-bold mb-3" style={{ color: DARK }}>
      {title}
    </h2>
    {sub && (
      <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: MID }}>
        {sub}
      </p>
    )}
    <div className="lace-divider mt-5" style={{ maxWidth: center ? 120 : 80 }} />
  </div>
);

export default SectionTitle;
