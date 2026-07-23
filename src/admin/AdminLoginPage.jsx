// ─── AdminLoginPage ───────────────────────────────────────────────────────────
// Admin login screen. Validates credentials locally (no backend required).
//
// Props:
//   onLogin – callback fired on successful login

import { useState } from "react";
import { R, RL, GOLD, DARK, MID, BORDER } from "../constants/tokens";
import { setToken } from "../api/client";

const ADMIN_EMAIL    = "admin@sweetdelights.in";
const ADMIN_PASSWORD = "admin123";

const AdminLoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("admin@sweetdelights.in");
  const [pass,  setPass]  = useState("admin123");
  const [err,   setErr]   = useState("");
  const [loading, setLoading] = useState(false);

  const login = () => {
    setErr("");
    setLoading(true);
    // Small delay for UX feedback
    setTimeout(() => {
      if (email.trim() === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
        setToken("local-admin-token");
        onLogin();
      } else {
        setErr("Invalid email or password.");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg,#FEF8F2 0%,#FFF0F5 100%)`, padding: 20 }}>
      <div className="animate-bounce-in" style={{ background: "#fff", borderRadius: 24, padding: "48px 40px", maxWidth: 420, width: "100%", boxShadow: "0 16px 48px rgba(192,57,92,.15)", border: `1px solid ${BORDER}` }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg,${R},${RL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🎂</div>
          <h2 className="font-display" style={{ fontWeight: 700, fontSize: "1.5rem", color: DARK }}>Admin Login</h2>
          <p style={{ color: MID, fontSize: ".85rem", marginTop: 4 }}>Sweet Delights Bakery</p>
        </div>

        {/* Error */}
        {err && <p style={{ background: "#FEE2E2", color: "#991B1B", borderRadius: 10, padding: "10px 14px", fontSize: ".82rem", marginBottom: 16 }}>{err}</p>}

        {/* Fields */}
        {[["Email", email, setEmail, "email"], ["Password", pass, setPass, "password"]].map(([label, val, setter, type]) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: 600, color: DARK, fontSize: ".88rem", display: "block", marginBottom: 6 }}>{label}</label>
            <input value={val} onChange={e => setter(e.target.value)} type={type}
              onKeyDown={e => e.key === "Enter" && login()}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".9rem", color: DARK }} />
          </div>
        ))}

        <button className="btn-rose" onClick={login} disabled={loading}
          style={{ width: "100%", marginTop: 8, padding: "14px", borderRadius: 12, fontSize: "1rem", fontWeight: 700, opacity: loading ? .7 : 1 }}>
          {loading ? "Logging in…" : "Login to Dashboard"}
        </button>
        <p style={{ textAlign: "center", color: MID, fontSize: ".75rem", marginTop: 16 }}>
          Default: admin@sweetdelights.in / admin123
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
