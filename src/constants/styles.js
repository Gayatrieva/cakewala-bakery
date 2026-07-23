// ─── GLOBAL CSS ────────────────────────────────────────────────────────────────
// All keyframe animations and utility CSS classes used throughout the app.
// Injected as a <style> tag in the App root.

import { R, RL, RP, GOLD, CREAM, DARK, MID, BORDER } from "./tokens";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  body { background: ${CREAM}; font-family: 'Inter', sans-serif; color: ${DARK}; }
  .font-display { font-family: 'Playfair Display', Georgia, serif; }

  /* ── Keyframes ── */
  @keyframes float-petal {
    0%   { transform: translateY(-10px) rotate(0deg) translateX(0); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.8; }
    100% { transform: translateY(110vh) rotate(720deg) translateX(80px); opacity: 0; }
  }
  @keyframes fade-up        { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fade-in        { from { opacity:0; } to { opacity:1; } }
  @keyframes slide-in-right { from { transform:translateX(100%); } to { transform:translateX(0); } }
  @keyframes slide-in-left  { from { transform:translateX(-100%); } to { transform:translateX(0); } }
  @keyframes pop            { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
  @keyframes shimmer        { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes spin-slow      { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  @keyframes pulse-wa       { 0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.4)} 70%{box-shadow:0 0 0 16px rgba(37,211,102,0)} }
  @keyframes bounce-in      { 0%{transform:scale(0)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
  @keyframes scroll-x       { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes hero-float     { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-18px) rotate(2deg)} }

  /* ── Utility classes ── */
  .petal            { position:absolute; pointer-events:none; animation:float-petal linear infinite; user-select:none; font-size:1.1rem; }
  .animate-fade-up  { animation:fade-up .7s ease both; }
  .animate-fade-in  { animation:fade-in .6s ease both; }
  .animate-pop      { animation:pop .4s ease; }
  .animate-bounce-in{ animation:bounce-in .5s cubic-bezier(.36,.07,.19,.97) both; }
  .hero-img         { animation:hero-float 5s ease-in-out infinite; }

  /* ── Card transitions ── */
  .cake-card        { transition:all .3s cubic-bezier(.34,1.56,.64,1); }
  .cake-card:hover  { transform:translateY(-10px) scale(1.02); box-shadow:0 24px 48px rgba(192,57,92,.18); }
  .cat-card         { transition:all .3s ease; cursor:pointer; }
  .cat-card:hover   { transform:translateY(-6px); }

  /* ── Buttons ── */
  .btn-rose         { background:${R}; color:#fff; border:none; cursor:pointer; transition:all .25s; }
  .btn-rose:hover   { background:${RL}; transform:translateY(-2px); box-shadow:0 8px 20px rgba(192,57,92,.35); }
  .btn-outline      { background:transparent; border:2px solid ${R}; color:${R}; cursor:pointer; transition:all .25s; }
  .btn-outline:hover{ background:${R}; color:#fff; }

  /* ── Sidebars & Admin ── */
  .sidebar-enter      { animation:slide-in-right .35s cubic-bezier(.4,0,.2,1) both; }
  .admin-sidebar-enter{ animation:slide-in-left .3s ease both; }
  .pulse-wa           { animation:pulse-wa 2s infinite; }
  .shimmer-card       { background:linear-gradient(90deg,#f5e6ea 25%,#ffe8ef 50%,#f5e6ea 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; }

  /* ── Nav ── */
  .nav-link         { position:relative; }
  .nav-link::after  { content:''; position:absolute; bottom:-4px; left:0; width:0; height:2px; background:${R}; transition:width .3s; }
  .nav-link:hover::after,.nav-link.active::after { width:100%; }

  /* ── Responsive visibility helpers ── */
  /* Desktop-only: hide on mobile (≤768px) */
  .hide-mobile { display:flex; }
  /* Mobile hamburger: hidden by default, shown on mobile */
  .show-mobile { display:none; }
  @media(max-width:768px) {
    .hide-mobile { display:none !important; }
    .show-mobile { display:flex !important; }
  }

  /* ── Misc UI ── */
  .section-title    { font-family:'Playfair Display',serif; }
  .lace-divider     { border:none; height:2px; background:linear-gradient(90deg,transparent,${GOLD},transparent); margin:0; }
  .img-zoom-wrap    { overflow:hidden; border-radius:16px; }
  .img-zoom-wrap img{ transition:transform .5s ease; }
  .img-zoom-wrap:hover img{ transform:scale(1.07); }
  .tag-badge        { font-size:.65rem; font-weight:700; letter-spacing:.08em; padding:2px 8px; border-radius:999px; }
  .star-fill        { color:#F59E0B; }
  .scrollbar-hide   { -ms-overflow-style:none; scrollbar-width:none; }
  .scrollbar-hide::-webkit-scrollbar { display:none; }
  .qty-btn          { width:32px; height:32px; border-radius:50%; border:1.5px solid ${BORDER}; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; }
  .qty-btn:hover    { border-color:${R}; color:${R}; }
  input:focus,textarea:focus,select:focus { outline:none; border-color:${R} !important; box-shadow:0 0 0 3px rgba(192,57,92,.1); }

  /* ── Admin panel ── */
  .admin-nav-item   { transition:all .2s; border-radius:10px; }
  .admin-nav-item:hover,.admin-nav-item.active { background:${RP}; color:${R}; }
  .status-badge     { font-size:.7rem; font-weight:600; padding:3px 10px; border-radius:999px; }

  /* ── Modal ── */
  .modal-overlay    { position:fixed; inset:0; background:rgba(42,18,21,.45); z-index:1000; display:flex; align-items:center; justify-content:center; padding:16px; animation:fade-in .2s ease; }
  .modal-box        { background:#fff; border-radius:20px; max-height:90vh; overflow-y:auto; width:100%; max-width:500px; animation:bounce-in .4s ease; }

  /* ── Mobile-first responsive layout ── */

  /* Hero grid: 2-col → 1-col */
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
  }
  /* Cake detail: 2-col → 1-col */
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: start;
  }
  /* Checkout: form + sidebar → stacked */
  .checkout-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 32px;
    align-items: start;
  }
  /* Checkout inner name/phone row */
  .checkout-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  /* Footer 4-col grid */
  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 40px;
    margin-bottom: 48px;
  }
  /* Feedback form name+city */
  .feedback-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 18px;
  }
  /* Admin sidebar layout */
  .admin-layout {
    display: flex;
    min-height: 100vh;
  }
  .admin-sidebar {
    width: 240px;
    flex-shrink: 0;
  }
  .admin-content {
    flex: 1;
    min-width: 0;
  }

  /* Hero image circle responsive */
  .hero-image-wrap {
    width: 380px;
    height: 380px;
  }

  /* ── Tablet (≤900px) ── */
  @media(max-width:900px) {
    .checkout-grid { grid-template-columns: 1fr; }
    .hero-image-wrap { width: 300px; height: 300px; }
  }

  /* ── Mobile (≤768px) ── */
  @media(max-width:768px) {
    .hero-grid {
      grid-template-columns: 1fr;
      gap: 32px;
      text-align: center;
      padding: 40px 16px !important;
    }
    .hero-grid > div:last-child { display: flex; justify-content: center; }
    .hero-image-wrap { width: 260px; height: 260px; box-shadow: 0 0 0 12px rgba(192,57,92,.08), 0 0 0 24px rgba(192,57,92,.04) !important; }

    .detail-grid { grid-template-columns: 1fr; gap: 24px; }

    .checkout-grid { grid-template-columns: 1fr; }
    .checkout-row-2 { grid-template-columns: 1fr; }
    .checkout-row-2 > div { padding-left: 0 !important; padding-right: 0 !important; }

    .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }

    .feedback-row { grid-template-columns: 1fr; }

    .admin-layout { flex-direction: column; }
    .admin-sidebar { width: 100%; }

    /* Section padding reduction */
    section { padding-top: 48px !important; padding-bottom: 48px !important; }

    /* CTA buttons stack */
    .cta-btns { flex-direction: column; align-items: stretch; }
    .cta-btns a, .cta-btns button { text-align: center; justify-content: center; }

    /* Testimonial card padding */
    .testimonial-card { padding: 24px 20px !important; }

    /* Payment method cards */
    .payment-methods { flex-direction: column !important; }
  }

  /* ── Small mobile (≤480px) ── */
  @media(max-width:480px) {
    .footer-grid { grid-template-columns: 1fr; }
    .hero-image-wrap { width: 220px; height: 220px; }

    /* Navbar */
    nav > div { padding: 0 12px !important; height: 60px !important; }

    /* Cake detail CTA row */
    .detail-cta { flex-direction: column; }
    .detail-cta a { width: 100%; text-align: center; justify-content: center; padding: 14px !important; }

    /* Checkout form summary comes first on mobile */
    .checkout-summary-first { order: -1; }

    /* Trust signals wrap */
    .trust-signals { gap: 14px !important; }

    /* Hero headline */
    .hero-headline { font-size: clamp(1.8rem, 8vw, 2.4rem) !important; }
  }
`;

export default CSS;
