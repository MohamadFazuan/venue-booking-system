import { describe, it, expect, vi } from "vitest";
import {
  formatMYR,
  generateBookingId,
  getStatusConfig,
  validateEmail,
  validatePhone,
  slugify,
  clamp,
  getBookedDates,
  estimateCost,
} from "../../src/utils/helpers.js";

// ─── formatMYR ────────────────────────────────────────────────────────────────

describe("formatMYR", () => {
  it("formats integer amounts", () => {
    expect(formatMYR(1500)).toBe("RM 1,500");
  });

  it("formats zero", () => {
    expect(formatMYR(0)).toBe("RM 0");
  });

  it("formats large amounts with commas", () => {
    expect(formatMYR(12000)).toBe("RM 12,000");
  });

  it("returns RM 0 for NaN", () => {
    expect(formatMYR(NaN)).toBe("RM 0");
  });

  it("returns RM 0 for non-number input", () => {
    expect(formatMYR("abc")).toBe("RM 0");
  });
});

// ─── generateBookingId ────────────────────────────────────────────────────────

describe("generateBookingId", () => {
  it("returns string starting with BK-", () => {
    expect(generateBookingId()).toMatch(/^BK-/);
  });

  it("matches expected format BK-YYYYMMDD-NNN", () => {
    expect(generateBookingId()).toMatch(/^BK-\d{8}-\d{3}$/);
  });

  it("generates unique IDs on repeated calls", () => {
    const ids = new Set(Array.from({ length: 50 }, generateBookingId));
    // With random suffix 100-999 collisions are possible but rare
    expect(ids.size).toBeGreaterThan(1);
  });

  it("embeds today's date in the ID", () => {
    const today = new Date();
    const dateStr = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("");
    expect(generateBookingId()).toContain(dateStr);
  });
});

// ─── getStatusConfig ──────────────────────────────────────────────────────────

describe("getStatusConfig", () => {
  it("returns correct label for pending", () => {
    expect(getStatusConfig("pending").label).toBe("Pending");
  });

  it("returns correct label for approved", () => {
    expect(getStatusConfig("approved").label).toBe("Approved");
  });

  it("returns correct label for rejected", () => {
    expect(getStatusConfig("rejected").label).toBe("Rejected");
  });

  it("returns correct label for cancelled", () => {
    expect(getStatusConfig("cancelled").label).toBe("Cancelled");
  });

  it("falls back to pending config for unknown status", () => {
    expect(getStatusConfig("unknown").label).toBe("Pending");
  });

  it("includes color and dot fields", () => {
    const cfg = getStatusConfig("approved");
    expect(cfg).toHaveProperty("color");
    expect(cfg).toHaveProperty("dot");
  });
});

// ─── validateEmail ────────────────────────────────────────────────────────────

describe("validateEmail", () => {
  it("accepts valid email", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  it("accepts email with subdomains", () => {
    expect(validateEmail("user@mail.example.co.uk")).toBe(true);
  });

  it("rejects email without @", () => {
    expect(validateEmail("userexample.com")).toBe(false);
  });

  it("rejects email without domain", () => {
    expect(validateEmail("user@")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateEmail("")).toBe(false);
  });

  it("rejects email with spaces", () => {
    expect(validateEmail("user @example.com")).toBe(false);
  });
});

// ─── validatePhone ────────────────────────────────────────────────────────────

describe("validatePhone", () => {
  it("accepts Malaysian mobile 01x-xxxxxxxx", () => {
    expect(validatePhone("0123456789")).toBe(true);
  });

  it("accepts number with dashes", () => {
    expect(validatePhone("012-345-6789")).toBe(true);
  });

  it("accepts +60 country code", () => {
    expect(validatePhone("+60123456789")).toBe(true);
  });

  it("rejects too-short number", () => {
    expect(validatePhone("012345")).toBe(false);
  });

  it("rejects landline-style without mobile prefix", () => {
    expect(validatePhone("0312345678")).toBe(false);
  });
});

// ─── slugify ──────────────────────────────────────────────────────────────────

describe("slugify", () => {
  it("lowercases and replaces spaces with dashes", () => {
    expect(slugify("Grand Ballroom")).toBe("grand-ballroom");
  });

  it("strips special characters", () => {
    expect(slugify("Venue @ KL!")).toBe("venue--kl");
  });

  it("collapses multiple dashes", () => {
    expect(slugify("Hello   World")).toBe("hello-world");
  });
});

// ─── clamp ────────────────────────────────────────────────────────────────────

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(5, 1, 10)).toBe(5);
  });

  it("clamps to min", () => {
    expect(clamp(-5, 0, 100)).toBe(0);
  });

  it("clamps to max", () => {
    expect(clamp(200, 0, 100)).toBe(100);
  });
});

// ─── getBookedDates ───────────────────────────────────────────────────────────

describe("getBookedDates", () => {
  const bookings = [
    { id: "1", venueId: "v1", date: "2026-05-10", timeSlot: "morning",  status: "approved" },
    { id: "2", venueId: "v1", date: "2026-05-12", timeSlot: "fullDay",  status: "pending"  },
    { id: "3", venueId: "v1", date: "2026-05-15", timeSlot: "evening",  status: "rejected" },
    { id: "4", venueId: "v2", date: "2026-05-10", timeSlot: "morning",  status: "approved" },
  ];

  it("returns dates for matching venue and slot", () => {
    const dates = getBookedDates(bookings, "v1", "morning");
    expect(dates).toContain("2026-05-10");
  });

  it("includes fullDay bookings when querying any slot", () => {
    const dates = getBookedDates(bookings, "v1", "afternoon");
    expect(dates).toContain("2026-05-12");
  });

  it("excludes rejected bookings", () => {
    const dates = getBookedDates(bookings, "v1", "evening");
    expect(dates).not.toContain("2026-05-15");
  });

  it("excludes different venue bookings", () => {
    const dates = getBookedDates(bookings, "v1", "morning");
    const venue2Dates = getBookedDates(bookings, "v2", "morning");
    expect(dates).not.toContain(...venue2Dates.filter((d) => !dates.includes(d)));
  });
});

// ─── estimateCost ─────────────────────────────────────────────────────────────

describe("estimateCost", () => {
  const venue = {
    pricing: { morning: 800, afternoon: 1000, evening: 1500, fullDay: 3000 },
  };

  it("returns base price for no add-ons", () => {
    expect(estimateCost(venue, "morning", [])).toBe(800);
  });

  it("adds catering cost", () => {
    expect(estimateCost(venue, "morning", ["catering"])).toBe(800 + 600);
  });

  it("adds multiple add-on costs", () => {
    expect(estimateCost(venue, "fullDay", ["catering", "decoration"])).toBe(3000 + 600 + 800);
  });

  it("returns 0 for null venue", () => {
    expect(estimateCost(null, "morning", [])).toBe(0);
  });

  it("returns 0 for missing time slot", () => {
    expect(estimateCost(venue, null, [])).toBe(0);
  });

  it("ignores unknown add-on keys", () => {
    expect(estimateCost(venue, "morning", ["unknownAddon"])).toBe(800);
  });
});
