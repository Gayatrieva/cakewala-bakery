// ─── ContactPage ──────────────────────────────────────────────────────────────
// Contact page with:
//   - Contact info cards (phone, email, address, hours)
//   - WhatsApp CTA button
//   - Message form (name, email, phone, subject, message)
//   - Submits via WhatsApp deep-link
//   - Success state after sending
//
// Props: none (uses WHATSAPP_NUM from tokens)

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { R, GOLD, DARK, MID, BORDER, WHATSAPP_NUM } from "../constants/tokens";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSend = () => {
    if (!form.name || !form.message) return;
    const msg = `Hi Sweet Delights!\n\nName: ${form.name}\nPhone: ${form.phone}\nSubject: ${form.subject}\n\n${form.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px" }}>

      {/* Page heading */}
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <p style={{ color: GOLD, fontSize: ".8rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Get in Touch</p>
        <h1 className="font-display" style={{ fontSize: "2.4rem", fontWeight: 700, color: DARK }}>We'd Love to Hear from You</h1>
      </div>

      <div className="checkout-grid" style={{ gap: 48 }}>

        {/* Left: Contact info */}
        <div>
          {[
            { icon: <Mail   size={20} color={R} />, title: "Email Us",         lines: ["hello@sweetdelights.in", "We reply within 4 hours"] },
            { icon: <MapPin size={20} color={R} />, title: "Visit Us",          lines: ["42 Rose Garden Lane", "Bandra West, Mumbai 400050"] },
            { icon: <Clock  size={20} color={R} />, title: "Opening Hours",     lines: ["Mon–Sat: 9am – 9pm", "Sunday: 10am – 6pm"] },
          ].map(({ icon, title, lines }) => (
            <div key={title} style={{ display: "flex", gap: 16, marginBottom: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FFE8EF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: DARK, marginBottom: 4 }}>{title}</p>
                {lines.map(l => <p key={l} style={{ color: MID, fontSize: ".88rem" }}>{l}</p>)}
              </div>
            </div>
          ))}

          {/* WhatsApp CTA */}
          <a href={`https://wa.me/${WHATSAPP_NUM}`} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px 28px", borderRadius: 14, background: "#25D366", color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: ".95rem", marginTop: 12 }}>
            <MessageCircle size={20} /> Chat on WhatsApp
          </a>
        </div>

        {/* Right: Message form */}
        <div style={{ background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 4px 24px rgba(192,57,92,.08)", border: `1px solid ${BORDER}` }}>
          {sent ? (
            // Success state
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 48 }}>✅</div>
              <p className="font-display" style={{ fontWeight: 700, color: R, fontSize: "1.3rem", marginTop: 12 }}>Message sent!</p>
              <p style={{ color: MID, marginTop: 8 }}>Your message was sent via WhatsApp. We'll reply shortly!</p>
              <button className="btn-rose" onClick={() => setSent(false)} style={{ marginTop: 20, padding: "10px 24px", borderRadius: 10 }}>Send Another</button>
            </div>
          ) : (
            <>
              <p className="font-display" style={{ fontWeight: 700, fontSize: "1.2rem", color: DARK, marginBottom: 20 }}>Send a Message</p>

              {/* Input fields */}
              {[
                ["name",    "Your Name *",      "text",  true],
                ["email",   "Email Address",    "email", false],
                ["phone",   "Phone Number",     "tel",   false],
                ["subject", "Subject",          "text",  false],
              ].map(([field, placeholder, type, req]) => (
                <div key={field} style={{ marginBottom: 14 }}>
                  <input value={form[field]} onChange={e => upd(field, e.target.value)}
                    placeholder={placeholder} type={type}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".9rem", color: DARK }} />
                </div>
              ))}

              {/* Message textarea */}
              <textarea value={form.message} onChange={e => upd("message", e.target.value)}
                placeholder="Your message *" rows={4}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${BORDER}`, fontSize: ".9rem", color: DARK, resize: "vertical", fontFamily: "inherit", marginBottom: 16 }} />

              <button className="btn-rose" onClick={handleSend} style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: "1rem", fontWeight: 700 }}>
                Send Message <Send size={18} style={{ verticalAlign: "middle", marginLeft: 6 }} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
