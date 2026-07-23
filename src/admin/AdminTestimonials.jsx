// ─── AdminTestimonials ────────────────────────────────────────────────────────
// Reads/writes from TestimonialsStore (shared singleton) — no backend needed.
// Approve / Reject pending reviews. Delete approved ones.

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Trash2, MessageSquare, Clock } from "lucide-react";
import { R, RL, DARK, MID, BORDER, GOLD } from "../constants/tokens";
import Stars from "../components/Stars";
import { TestimonialsStore } from "../constants/TestimonialsStore";

const AdminTestimonials = () => {
  const [all, setAll] = useState(() => TestimonialsStore.getAll());
  const [tab, setTab] = useState("pending");

  // Keep in sync with store (submissions from customer side appear live)
  useEffect(() => TestimonialsStore.subscribe(() => setAll(TestimonialsStore.getAll())), []);

  const pending  = all.filter(t => t.status === "pending");
  const approved = all.filter(t => t.status === "approved");
  const list     = tab === "pending" ? pending : approved;

  const approve = (id) => { TestimonialsStore.approve(id);        setAll(TestimonialsStore.getAll()); };
  const reject  = (id) => { TestimonialsStore.reject(id);         setAll(TestimonialsStore.getAll()); };
  const del     = (id) => { TestimonialsStore.deleteApproved(id); setAll(TestimonialsStore.getAll()); };

  const tabStyle = active => ({
    padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600,
    fontSize: ".88rem", transition: "all .2s",
    background: active ? R : "#fff",
    color:      active ? "#fff" : MID,
    boxShadow:  active ? "0 4px 12px rgba(192,57,92,.25)" : "none",
  });

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Reviews",   value: all.length,      icon: <MessageSquare size={20} color={R} />,       bg: "#FFE8EF" },
          { label: "Awaiting Review", value: pending.length,  icon: <Clock         size={20} color={GOLD} />,    bg: `${GOLD}18` },
          { label: "Approved Live",   value: approved.length, icon: <CheckCircle   size={20} color="#22C55E" />, bg: "#DCFCE7" },
        ].map(({ label, value, icon, bg }) => (
          <div key={label} style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
            <div>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, color: DARK, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: ".75rem", color: MID, marginTop: 2 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button style={tabStyle(tab === "pending")} onClick={() => setTab("pending")}>
          Pending {pending.length > 0 && <span style={{ background: "#fff", color: R, borderRadius: 999, padding: "1px 7px", fontSize: ".75rem", fontWeight: 700, marginLeft: 4 }}>{pending.length}</span>}
        </button>
        <button style={tabStyle(tab === "approved")} onClick={() => setTab("approved")}>
          Approved ({approved.length})
        </button>
      </div>

      {!list.length && (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 18, border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>{tab === "pending" ? "🎉" : "💬"}</div>
          <p style={{ fontWeight: 700, color: DARK, marginBottom: 6 }}>
            {tab === "pending" ? "No pending reviews — you're all caught up!" : "No approved reviews yet."}
          </p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {list.map(t => (
          <div key={t.id} style={{ background: "#fff", borderRadius: 18, padding: "22px 26px", border: `1px solid ${tab === "pending" ? `${GOLD}60` : BORDER}`, boxShadow: "0 4px 16px rgba(192,57,92,.06)", display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${R},${RL})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: ".9rem" }}>
              {t.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, color: DARK }}>{t.name}</span>
                <span style={{ fontSize: ".75rem", color: MID }}>{t.city}</span>
                <span style={{ fontSize: ".72rem", color: "#bbb" }}>· {t.created_at ? new Date(t.created_at).toLocaleDateString("en-IN") : t.date || "—"}</span>
                {tab === "pending" && <span style={{ fontSize: ".7rem", fontWeight: 700, background: `${GOLD}20`, color: GOLD, padding: "2px 8px", borderRadius: 999 }}>PENDING</span>}
              </div>
              <Stars rating={t.rating} size={13} />
              <p style={{ marginTop: 8, color: MID, fontSize: ".9rem", lineHeight: 1.6, fontStyle: "italic" }}>"{t.text}"</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
              {tab === "pending" ? (
                <>
                  <button title="Approve" onClick={() => approve(t.id)} style={{ background: "#DCFCE7", border: "none", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <CheckCircle size={18} color="#22C55E" />
                  </button>
                  <button title="Reject"  onClick={() => reject(t.id)}  style={{ background: "#FEE2E2", border: "none", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <XCircle size={18} color="#EF4444" />
                  </button>
                </>
              ) : (
                <button title="Delete" onClick={() => del(t.id)} style={{ background: "#FEE2E2", border: "none", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Trash2 size={16} color="#EF4444" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;
