// ─── HomePage ─────────────────────────────────────────────────────────────────
// The main landing page with:
//   - Hero section (floating petals, trust signals, hero image)
//   - Marquee trust strip
//   - Featured cakes horizontal scroll
//   - Category cards grid
//   - Why Choose Us feature cards
//   - Testimonials carousel with auto-advance
//   - FAQ accordion
//   - CTA banner
//
// Props:
//   navigate   – navigate(pageKey, extra?) function
//   addToCart  – (cake, weight, price, flavor) → void
//   setCartOpen– setter to open cart sidebar

import { useState, useEffect } from "react";
import {
  ArrowRight, Sparkles, Award, Clock, Truck, ChevronRight, ChevronDown, MessageCircle
} from "lucide-react";
import { R, RL, RP, GOLD, CREAM, DARK, MID, BORDER, WHATSAPP_NUM } from "../constants/tokens";
import { CAKES, CATEGORIES } from "../constants/data";
import { api } from "../api/client";
import FloatingPetals from "../components/FloatingPetals";
import SectionTitle from "../components/SectionTitle";
import Stars from "../components/Stars";
import Badge from "../components/Badge";

const HomePage = ({ navigate, addToCart, setCartOpen }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [faqOpen, setFaqOpen] = useState(null);
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({ name: "", city: "", rating: 5, text: "" });
  const [feedbackDone,  setFeedbackDone]  = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  // Fetch approved testimonials on mount
  useEffect(() => {
    api.getTestimonials().then(setApprovedTestimonials).catch(() => {});
  }, []);

  // Auto-rotate testimonials every 4.5 seconds
  useEffect(() => {
    if (!approvedTestimonials.length) return;
    const t = setInterval(() => setCurrentTestimonial(c => (c + 1) % approvedTestimonials.length), 4500);
    return () => clearInterval(t);
  }, [approvedTestimonials.length]);

  const submitFeedback = async () => {
    if (!feedbackForm.name.trim()) { setFeedbackError("Please enter your name."); return; }
    if (!feedbackForm.text.trim()) { setFeedbackError("Please write a short review."); return; }
    setFeedbackError("");
    try {
      await api.submitTestimonial(feedbackForm);
      setFeedbackDone(true);
      setFeedbackForm({ name: "", city: "", rating: 5, text: "" });
    } catch (e) {
      setFeedbackError(e.message || "Failed to submit. Please try again.");
    }
  };

  const faqs = [
    { q: "How early should I place my order?",       a: "We recommend ordering at least 2–3 days in advance. For custom and wedding cakes, please order 7–10 days ahead for best results." },
    { q: "Do you deliver across the city?",           a: "Yes! We deliver across the entire city. Orders above ₹1,499 enjoy free delivery. A ₹99 delivery charge applies on smaller orders." },
    { q: "Can I customise the flavour and design?",   a: "Absolutely! All our cakes can be customised in flavour, size, and inscription. For intricate designs, please use our Custom Cake page." },
    { q: "Do you offer eggless cakes?",               a: "Yes, all our cakes are available in eggless variants at no extra charge. Just mention it while ordering." },
    { q: "How do I track my order?",                  a: "Once your order is confirmed, our admin team will send you updates via WhatsApp. You'll know every step — from baking to delivery." },
  ];

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{ position: "relative", background: `linear-gradient(135deg,${CREAM} 0%,#FFF0F5 50%,#FEF0E7 100%)`, minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <FloatingPetals />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", position: "relative", zIndex: 2, width: "100%" }}>

          {/* Hero text */}
          <div className="animate-fade-up">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${GOLD}18`, border: `1px solid ${GOLD}40`, borderRadius: 999, padding: "6px 16px", marginBottom: 20 }}>
              <span style={{ color: GOLD, fontSize: ".75rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>✦ Est. 2018 · Artisan Bakery</span>
            </div>
            <h1 className="font-display" style={{ fontSize: "clamp(2.4rem,5vw,3.8rem)", fontWeight: 700, color: DARK, lineHeight: 1.15, marginBottom: 20 }}>
              Cakes Baked with<br />
              <span style={{ color: R, fontStyle: "italic" }}>Love & Artistry</span>
            </h1>
            <p style={{ fontSize: "1.05rem", color: MID, lineHeight: 1.7, maxWidth: 480, marginBottom: 32 }}>
              Every celebration deserves a cake that's as beautiful as the moment. Hand-crafted to order, delivered fresh to your door.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button className="btn-rose" onClick={() => navigate("cakes")} style={{ padding: "14px 32px", borderRadius: 12, fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                Shop Cakes <ArrowRight size={18} />
              </button>
              <button className="btn-outline" onClick={() => navigate("custom-cake")} style={{ padding: "14px 32px", borderRadius: 12, fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={18} /> Custom Order
              </button>
            </div>
            {/* Trust signals */}
            <div style={{ display: "flex", gap: 24, marginTop: 36, flexWrap: "wrap" }}>
              {[["⭐", "4.9/5", "1,200+ Reviews"], ["🎂", "15,000+", "Cakes Delivered"], ["🚚", "Free", "On orders ₹1,499+"]].map(([ic, val, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1.2rem" }}>{ic}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: DARK, fontSize: ".9rem" }}>{val}</div>
                    <div style={{ color: MID, fontSize: ".7rem" }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image with floating mini-badges */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
            <div style={{ width: 380, height: 380, borderRadius: "50%", background: `linear-gradient(135deg,${RP} 0%,#FFF0F5 100%)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 16px ${RP}, 0 0 0 32px ${RP}88`, overflow: "hidden", position: "relative" }}>
              <img className="hero-img" src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=85" alt="Hero Cake" style={{ width: "90%", height: "90%", objectFit: "cover", borderRadius: "50%" }} />
            </div>
            {[
              { top: -10, right: 30,  emoji: "🌸", label: "Fresh Daily",     bg: "#FFF0F5" },
              { bottom: 20, left: -20, emoji: "🎁", label: "Gift Packaging",  bg: "#FEF3E7" },
              { top: 100, left: -30,   emoji: "⚡", label: "Same-day orders", bg: "#F0FDF4" },
            ].map(({ top, right, bottom, left, emoji, label, bg }) => (
              <div key={label} className="animate-fade-in" style={{ position: "absolute", top, right, bottom, left, background: bg, borderRadius: 12, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(192,57,92,.12)", border: `1px solid ${BORDER}`, fontSize: ".8rem", fontWeight: 600, color: DARK, whiteSpace: "nowrap" }}>
                <span>{emoji}</span> {label}
              </div>
            ))}
          </div>
        </div>
        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", opacity: .5 }}>
          <ChevronDown size={20} color={MID} style={{ animation: "float-petal 2s ease-in-out infinite alternate" }} />
        </div>
      </section>

      {/* ── MARQUEE TRUST STRIP ───────────────────────────────── */}
      <div style={{ background: R, padding: "10px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 48, animation: "scroll-x 18s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
          {[...Array(3)].map((_, j) =>
            ["🎂 100% Fresh Ingredients", "🚚 City-Wide Delivery", "✨ Custom Designs", "💕 Eggless Options", "⭐ 4.9/5 Rating", "🎁 Premium Packaging"].map(t => (
              <span key={`${j}-${t}`} style={{ color: "#fff", fontSize: ".8rem", fontWeight: 600, letterSpacing: ".05em" }}>{t} &nbsp;✦&nbsp;</span>
            ))
          )}
        </div>
      </div>

      {/* ── FEATURED CAKES ──────────────────────────────────── */}
      <section style={{ padding: "80px 20px", maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle eyebrow="Handcrafted Favourites" title="Most-Loved Cakes" sub="From everyday treats to once-in-a-lifetime centrepieces — made fresh for you." />
        <div className="scrollbar-hide" style={{ display: "flex", gap: 24, overflowX: "auto", paddingBottom: 16, cursor: "grab" }}>
          {CAKES.slice(0, 7).map((cake, i) => (
            <div key={cake.id} className="cake-card animate-fade-up" style={{ minWidth: 240, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(192,57,92,.08)", border: `1px solid ${BORDER}`, animationDelay: `${i * 0.08}s`, cursor: "pointer", flexShrink: 0 }}
              onClick={() => navigate("cake-detail", { cake })}>
              <div className="img-zoom-wrap" style={{ height: 200, borderRadius: 0, position: "relative" }}>
                <img src={cake.img} alt={cake.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {cake.badge && <div style={{ position: "absolute", top: 12, left: 12 }}><Badge type={cake.badge} /></div>}
                <button onClick={e => { e.stopPropagation(); addToCart(cake, cake.weights[1].w, cake.weights[1].p, cake.flavors[0]); }}
                  className="btn-rose" style={{ position: "absolute", bottom: 12, right: 12, borderRadius: 10, padding: "7px 14px", fontSize: ".78rem", fontWeight: 600 }}>
                  + Add
                </button>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <p style={{ fontWeight: 600, fontSize: ".95rem", color: DARK, marginBottom: 4 }}>{cake.name}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Stars rating={cake.rating} size={12} />
                    <span style={{ fontSize: ".72rem", color: MID }}>({cake.reviews})</span>
                  </div>
                  <span style={{ fontWeight: 700, color: R }}>from ₹{cake.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button className="btn-rose" onClick={() => navigate("cakes")} style={{ padding: "12px 32px", borderRadius: 12, fontSize: ".95rem", fontWeight: 600 }}>
            View All Cakes →
          </button>
        </div>
      </section>

      <hr className="lace-divider" style={{ maxWidth: 1200, margin: "0 auto" }} />

      {/* ── CATEGORIES ────────────────────────────────────────── */}
      <section style={{ padding: "80px 20px", background: `linear-gradient(180deg,${CREAM} 0%,#FFF5F8 100%)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionTitle eyebrow="Browse by Occasion" title="What's the Celebration?" sub="Each category crafted for a special moment in your life." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 20 }}>
            {CATEGORIES.map((cat, i) => (
              <div key={cat.id} className="cat-card animate-fade-up" style={{ animationDelay: `${i * 0.07}s`, borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(192,57,92,.07)", border: `1px solid ${BORDER}`, cursor: "pointer" }}
                onClick={() => navigate("cakes", { category: cat.id })}>
                <div style={{ height: 140, overflow: "hidden", position: "relative" }}>
                  <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(42,18,21,.5) 0%,transparent 60%)" }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 14 }}>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: ".9rem", textShadow: "0 2px 6px rgba(0,0,0,.4)" }}>{cat.label}</p>
                  </div>
                </div>
                <div style={{ padding: "10px 14px", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.4rem" }}>{cat.emoji}</span>
                  <ChevronRight size={16} color={R} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="lace-divider" style={{ maxWidth: 1200, margin: "0 auto" }} />

      {/* ── WHY CHOOSE US ─────────────────────────────────────── */}
      <section style={{ padding: "80px 20px", maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle eyebrow="Our Promise" title="Why Sweet Delights?" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
          {[
            { icon: <Award size={28} color={R} />,    title: "Premium Ingredients",  text: "Only the finest Belgian chocolate, fresh cream, and seasonal fruits — no compromises." },
            { icon: <Clock size={28} color={R} />,    title: "Baked Fresh to Order", text: "Never frozen, never mass-produced. Your cake is baked fresh within 24–48 hours of delivery." },
            { icon: <Truck size={28} color={R} />,    title: "On-Time Delivery",     text: "We know timing matters. Your cake arrives chilled and perfectly presented, right on schedule." },
            { icon: <Sparkles size={28} color={R} />, title: "Artisan Decoration",   text: "Hand-piped florals, edible gold, fondant sculptures — our bakers are true artists." },
          ].map(({ icon, title, text }, i) => (
            <div key={title} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s`, background: "#fff", borderRadius: 20, padding: 28, textAlign: "center", boxShadow: "0 4px 20px rgba(192,57,92,.07)", border: `1px solid ${BORDER}` }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: RP, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{icon}</div>
              <h3 className="font-display" style={{ fontWeight: 700, marginBottom: 8, color: DARK }}>{title}</h3>
              <p style={{ fontSize: ".85rem", color: MID, lineHeight: 1.6 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section style={{ padding: "80px 20px", background: `linear-gradient(135deg,${RP} 0%,#FFF0F5 100%)` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionTitle eyebrow="Love Letters" title="What Our Customers Say" />
          <div style={{ position: "relative" }}>
            <div style={{ background: "#fff", borderRadius: 24, padding: "40px 48px", boxShadow: "0 12px 48px rgba(192,57,92,.12)", position: "relative", minHeight: 200 }}>
              <div style={{ fontSize: 64, color: `${R}20`, position: "absolute", top: 16, left: 24, fontFamily: "Georgia", lineHeight: 1 }}>"</div>
              <div className="animate-fade-in" key={currentTestimonial}>
                <Stars rating={approvedTestimonials[currentTestimonial % Math.max(approvedTestimonials.length,1)]?.rating ?? 5} size={18} />
                <p className="font-display" style={{ fontSize: "1.15rem", fontStyle: "italic", color: DARK, lineHeight: 1.7, margin: "16px 0 20px" }}>
                  "{approvedTestimonials[currentTestimonial % Math.max(approvedTestimonials.length,1)]?.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${R},${RL})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: ".85rem" }}>
                    {approvedTestimonials[currentTestimonial % Math.max(approvedTestimonials.length,1)]?.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: DARK }}>{approvedTestimonials[currentTestimonial % Math.max(approvedTestimonials.length,1)]?.name}</p>
                    <p style={{ fontSize: ".78rem", color: MID }}>{approvedTestimonials[currentTestimonial % Math.max(approvedTestimonials.length,1)]?.city} · {approvedTestimonials[currentTestimonial % Math.max(approvedTestimonials.length,1)]?.date}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Dot indicators */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
              {approvedTestimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrentTestimonial(i)}
                  style={{ width: i === currentTestimonial ? 24 : 8, height: 8, borderRadius: 4, background: i === currentTestimonial ? R : BORDER, border: "none", cursor: "pointer", transition: "all .3s" }} />
              ))}
            </div>
          </div>

          {/* ── Customer Feedback Form ── */}
          <div style={{ marginTop: 56 }}>
            <SectionTitle eyebrow="Share Your Experience" title="Leave a Review" sub="Your feedback helps us bake better and serve you sweeter! 🍰" />

            {feedbackDone ? (
              // Thank-you card
              <div className="animate-bounce-in" style={{
                background: "#fff", borderRadius: 24, padding: "40px 32px", textAlign: "center",
                boxShadow: "0 12px 40px rgba(192,57,92,.12)", border: `1px solid ${BORDER}`,
              }}>
                <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>🎉</div>
                <h3 className="font-display" style={{ fontWeight: 700, color: DARK, fontSize: "1.3rem", marginBottom: 8 }}>Thank you for your kind words!</h3>
                <p style={{ color: MID, fontSize: ".9rem", lineHeight: 1.6, marginBottom: 24 }}>
                  Your review has been submitted and will appear on our site once approved by our team.
                </p>
                <button className="btn-rose" onClick={() => setFeedbackDone(false)}
                  style={{ padding: "10px 28px", borderRadius: 12, fontWeight: 600, fontSize: ".9rem" }}>
                  Submit Another Review
                </button>
              </div>
            ) : (
              // Feedback form
              <div style={{
                background: "#fff", borderRadius: 24, padding: "36px 40px",
                boxShadow: "0 12px 40px rgba(192,57,92,.10)", border: `1px solid ${BORDER}`,
              }}>
                {/* Row: Name + City */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
                  {[["name","Your Name *","text"],["city","Your City","text"]].map(([field, label, type]) => (
                    <div key={field}>
                      <label style={{ fontWeight: 600, color: DARK, fontSize: ".85rem", display: "block", marginBottom: 6 }}>{label}</label>
                      <input
                        type={type}
                        placeholder={field === "name" ? "e.g. Priya Sharma" : "e.g. Mumbai"}
                        value={feedbackForm[field]}
                        onChange={e => setFeedbackForm(f => ({ ...f, [field]: e.target.value }))}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".88rem", color: DARK, boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                </div>

                {/* Star rating picker */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontWeight: 600, color: DARK, fontSize: ".85rem", display: "block", marginBottom: 8 }}>Your Rating *</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackForm(f => ({ ...f, rating: star }))}
                        style={{
                          background: "none", border: "none", cursor: "pointer", padding: 2,
                          fontSize: "1.8rem", lineHeight: 1, transition: "transform .15s",
                          color: star <= feedbackForm.rating ? "#F59E0B" : "#E5E7EB",
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                      >
                        ★
                      </button>
                    ))}
                    <span style={{ alignSelf: "center", marginLeft: 8, color: GOLD, fontWeight: 700, fontSize: ".9rem" }}>
                      {["Poor","Fair","Good","Great","Excellent!"][feedbackForm.rating - 1]}
                    </span>
                  </div>
                </div>

                {/* Review text */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 600, color: DARK, fontSize: ".85rem", display: "block", marginBottom: 6 }}>Your Review *</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your experience with our cakes..."
                    value={feedbackForm.text}
                    onChange={e => setFeedbackForm(f => ({ ...f, text: e.target.value }))}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".9rem", fontFamily: "inherit", color: DARK, resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>

                {feedbackError && (
                  <p style={{ color: "#EF4444", fontSize: ".82rem", marginBottom: 12, fontWeight: 600 }}>⚠ {feedbackError}</p>
                )}

                <button className="btn-rose" onClick={submitFeedback}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: ".95rem" }}>
                  ✨ Submit My Review
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section style={{ padding: "80px 20px", maxWidth: 800, margin: "0 auto" }}>
        <SectionTitle eyebrow="Questions" title="Frequently Asked" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: `1px solid ${faqOpen === i ? R : BORDER}`, overflow: "hidden", transition: "all .3s" }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                style={{ width: "100%", background: "none", border: "none", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontWeight: 600, color: DARK, fontSize: ".95rem" }}>{faq.q}</span>
                <ChevronDown size={20} color={R} style={{ transform: faqOpen === i ? "rotate(180deg)" : "none", transition: "transform .3s" }} />
              </button>
              {faqOpen === i && (
                <div className="animate-fade-up" style={{ padding: "0 24px 18px", color: MID, fontSize: ".9rem", lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section style={{ padding: "60px 20px", background: `linear-gradient(135deg,${R} 0%,${RL} 100%)`, textAlign: "center" }}>
        <div className="animate-fade-up" style={{ maxWidth: 600, margin: "0 auto" }}>
          <p style={{ color: "rgba(255,255,255,.8)", fontSize: ".85rem", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>✦ Planning Something Special? ✦</p>
          <h2 className="font-display" style={{ color: "#fff", fontSize: "2rem", fontWeight: 700, marginBottom: 16 }}>Let's Create Your Dream Cake Together</h2>
          <p style={{ color: "rgba(255,255,255,.85)", marginBottom: 28, lineHeight: 1.6 }}>From bespoke wedding cakes to whimsical birthday creations — our bakers bring your vision to life.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("custom-cake")}
              style={{ background: "#fff", color: R, border: "none", cursor: "pointer", padding: "13px 28px", borderRadius: 12, fontWeight: 700, fontSize: ".95rem", transition: "all .25s" }}
              onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; }} onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}>
              Design My Cake ✨
            </button>
            <a href={`https://wa.me/${WHATSAPP_NUM}`} target="_blank" rel="noopener noreferrer"
              style={{ background: "rgba(255,255,255,.15)", color: "#fff", border: "2px solid rgba(255,255,255,.5)", padding: "13px 28px", borderRadius: 12, fontWeight: 600, fontSize: ".95rem", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
