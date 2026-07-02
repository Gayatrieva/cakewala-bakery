// ─── AboutPage ────────────────────────────────────────────────────────────────
// Brand story page with:
//   - Story section (text + bakery image side-by-side)
//   - Key stats grid (cakes delivered, rating, years, freshness)
//   - Team member cards

import { R, RL, GOLD, DARK, MID, BORDER } from "../constants/tokens";
import SectionTitle from "../components/SectionTitle";

const AboutPage = () => (
  <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px" }}>

    {/* ── Story section ── */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", marginBottom: 80 }}>
      <div className="animate-fade-up">
        <p style={{ color: GOLD, fontSize: ".8rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>Our Story</p>
        <h1 className="font-display" style={{ fontSize: "2.6rem", fontWeight: 700, color: DARK, lineHeight: 1.2, marginBottom: 20 }}>
          Baked with <span style={{ color: R, fontStyle: "italic" }}>Love</span> Since 2018
        </h1>
        <p style={{ color: MID, lineHeight: 1.8, marginBottom: 16 }}>
          Sweet Delights Bakery was born in a tiny Mumbai kitchen in 2018, when founder Kavya Sharma began baking custom cakes for her daughter's school friends. Word spread — and by 2020, Sweet Delights had its first studio, a team of five passionate bakers, and a six-month waitlist for wedding cakes.
        </p>
        <p style={{ color: MID, lineHeight: 1.8, marginBottom: 24 }}>
          Today we craft over 300 cakes per month, but our philosophy hasn't changed: every cake is made fresh to order, with ingredients you can trust, and decorated with the care of a small family business.
        </p>

        {/* Stat tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            ["15,000+", "Cakes delivered"],
            ["4.9/5",   "Average rating"],
            ["7",       "Years of craftsmanship"],
            ["100%",    "Fresh, no preservatives"],
          ].map(([n, l]) => (
            <div key={l} style={{ background: "#FFE8EF", borderRadius: 14, padding: "16px 20px" }}>
              <p className="font-display" style={{ fontWeight: 800, fontSize: "1.6rem", color: R }}>{n}</p>
              <p style={{ color: MID, fontSize: ".82rem" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bakery photo */}
      <div className="animate-fade-up" style={{ animationDelay: ".15s" }}>
        <div className="img-zoom-wrap" style={{ borderRadius: 24, height: 460 }}>
          <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=85" alt="Bakery" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    </div>

    {/* ── Team section ── */}
    <SectionTitle eyebrow="Meet the Bakers" title="The People Behind the Magic" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 24 }}>
      {[
        { name: "Kavya Sharma", role: "Founder & Head Baker",     emoji: "👩‍🍳" },
        { name: "Rohan Mehta",  role: "Cake Artist & Sculptor",   emoji: "🎨" },
        { name: "Pooja Iyer",   role: "Pastry Chef",              emoji: "🧁" },
        { name: "Aditya Roy",   role: "Delivery & Logistics",     emoji: "🚚" },
      ].map(({ name, role, emoji }) => (
        <div key={name} style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", textAlign: "center", boxShadow: "0 4px 20px rgba(192,57,92,.07)", border: `1px solid ${BORDER}` }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg,${R},${RL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 14px" }}>
            {emoji}
          </div>
          <p style={{ fontWeight: 700, color: DARK, marginBottom: 4 }}>{name}</p>
          <p style={{ fontSize: ".8rem", color: MID }}>{role}</p>
        </div>
      ))}
    </div>
  </div>
);

export default AboutPage;
