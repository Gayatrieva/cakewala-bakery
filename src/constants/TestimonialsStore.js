// ─── TestimonialsStore ────────────────────────────────────────────────────────
// A lightweight shared store (no external state library needed).
// Both the customer-facing feedback form and the admin Testimonials page
// read/write from this singleton so submissions appear instantly in the panel.

import { TESTIMONIALS } from "./data";

// Internal state: seed with the existing approved testimonials
let _approved  = TESTIMONIALS.map(t => ({ ...t, status: "approved" }));
let _pending   = [];                           // newly submitted, awaiting review
let _listeners = [];

const notify = () => _listeners.forEach(fn => fn());

export const TestimonialsStore = {
  // ── Reads ──────────────────────────────────────────────────────────────────
  getApproved:  () => _approved,
  getPending:   () => _pending,
  getAll:       () => [..._approved, ..._pending],

  // ── Subscribe (re-renders) ─────────────────────────────────────────────────
  subscribe: (fn) => {
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter(l => l !== fn); };
  },

  // ── Actions ────────────────────────────────────────────────────────────────
  submit(data) {
    const entry = {
      id:     Date.now(),
      name:   data.name,
      city:   data.city || "India",
      rating: data.rating,
      text:   data.text,
      avatar: data.name.slice(0, 2).toUpperCase(),
      date:   "just now",
      status: "pending",
    };
    _pending = [entry, ..._pending];
    notify();
  },

  approve(id) {
    const t = _pending.find(p => p.id === id);
    if (!t) return;
    _pending   = _pending.filter(p => p.id !== id);
    _approved  = [{ ...t, status: "approved" }, ..._approved];
    notify();
  },

  reject(id) {
    _pending = _pending.filter(p => p.id !== id);
    notify();
  },

  deleteApproved(id) {
    _approved = _approved.filter(a => a.id !== id);
    notify();
  },
};
