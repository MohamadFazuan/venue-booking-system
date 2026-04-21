/**
 * Pure utility functions — extracted for testability.
 * All functions are side-effect free.
 */

export function formatMYR(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "RM 0";
  return `RM ${amount.toLocaleString("en-MY")}`;
}

export function generateBookingId() {
  const d = new Date();
  const dateStr = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("");
  const rand = Math.floor(Math.random() * 900 + 100);
  return `BK-${dateStr}-${rand}`;
}

export function getStatusConfig(status) {
  const map = {
    pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700",   dot: "bg-amber-400"  },
    approved:  { label: "Approved",  color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
    rejected:  { label: "Rejected",  color: "bg-red-100 text-red-700",       dot: "bg-red-400"    },
    cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500",     dot: "bg-gray-400"   },
  };
  return map[status] ?? map.pending;
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

export function validatePhone(phone) {
  // Malaysian mobile: 01x-xxxxxxx(x) or with country code
  return /^(\+?60|0)1[0-9]{8,9}$/.test(phone.replace(/[\s-]/g, ""));
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Returns dates already booked for a given venueId + timeSlot combo.
 * Used by the calendar to disable unavailable dates.
 */
export function getBookedDates(bookings, venueId, timeSlot) {
  return bookings
    .filter(
      (b) =>
        b.venueId === venueId &&
        b.status !== "rejected" &&
        b.status !== "cancelled" &&
        (b.timeSlot === timeSlot || b.timeSlot === "fullDay" || timeSlot === "fullDay")
    )
    .map((b) => b.date);
}

export function estimateCost(venue, timeSlot, addOns = []) {
  if (!venue || !timeSlot) return 0;
  const ADDON_PRICES = {
    catering: 600,
    decoration: 800,
    djSound: 500,
    photography: 1200,
    valetParking: 400,
  };
  const base = venue.pricing?.[timeSlot] ?? 0;
  const extras = addOns.reduce((sum, key) => sum + (ADDON_PRICES[key] ?? 0), 0);
  return base + extras;
}
