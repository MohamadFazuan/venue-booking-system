#!/usr/bin/env node
/**
 * Seed Back4App (Parse) with Anjung mock data.
 *
 * Usage:
 *   VITE_PARSE_APP_ID=xxx VITE_PARSE_JS_KEY=yyy node scripts/seed-parse.js
 *
 * Or with .env loaded (Node 20.6+):
 *   node --env-file=.env scripts/seed-parse.js
 *
 * Run once. Re-running will duplicate records.
 */

const APP_ID = process.env.VITE_PARSE_APP_ID;
const JS_KEY = process.env.VITE_PARSE_JS_KEY;
const SERVER = "https://parseapi.back4app.com/1/classes";

if (!APP_ID || !JS_KEY) {
  console.error("❌  Set VITE_PARSE_APP_ID and VITE_PARSE_JS_KEY first.");
  process.exit(1);
}

const HEADERS = {
  "X-Parse-Application-Id": APP_ID,
  "X-Parse-Javascript-Key": JS_KEY,
  "Content-Type": "application/json",
};

async function post(className, body) {
  const res = await fetch(`${SERVER}/${className}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${className}: ${JSON.stringify(data)}`);
  return data;
}

// ─── DATA ────────────────────────────────────

const VENUES = [
  {
    name: "Grand Ballroom",
    type: "Banquet Hall",
    capacity: 500,
    dimensions: "3,200 sq ft",
    address: "Level 5, Connexion@Nexus, Bangsar South, Kuala Lumpur",
    description: "An opulent ballroom adorned with crystal chandeliers and marble flooring, ideal for grand weddings and gala dinners. Features a private bridal suite, dedicated catering kitchen, and a sweeping stage with professional lighting rig.",
    amenities: ["WiFi", "Parking", "Catering", "AV Equipment", "Air Conditioning", "Stage"],
    pricing: { morning: 3500, afternoon: 4000, evening: 6500, fullDay: 12000 },
    rating: 4.8,
    reviews: 124,
    active: true,
    featured: true,
    images: [
      "https://picsum.photos/seed/ballroom1/800/500",
      "https://picsum.photos/seed/ballroom2/800/500",
      "https://picsum.photos/seed/ballroom3/800/500",
    ],
    houseRules: [
      "No outside food or beverages without prior arrangement",
      "Music must cease by 12:00 AM",
      "Maximum capacity must not be exceeded",
      "Decorations must be removed within 2 hours post-event",
    ],
    tags: ["Wedding", "Gala", "Corporate Dinner"],
    popularity: 98,
  },
  {
    name: "Conference Suite A",
    type: "Conference Room",
    capacity: 50,
    dimensions: "800 sq ft",
    address: "Level 12, Menara Kuala Lumpur, Jalan Punchak, KL City Centre",
    description: "A sleek, modern conference suite equipped with enterprise-grade AV technology, high-speed fibre WiFi, and ergonomic seating. Perfect for board meetings, product launches, and intensive workshops.",
    amenities: ["WiFi", "AV Equipment", "Air Conditioning", "Catering"],
    pricing: { morning: 800, afternoon: 800, evening: 600, fullDay: 2000 },
    rating: 4.6,
    reviews: 87,
    active: true,
    featured: true,
    images: [
      "https://picsum.photos/seed/conf1/800/500",
      "https://picsum.photos/seed/conf2/800/500",
    ],
    houseRules: [
      "No food or drinks near AV equipment",
      "Venue must be left in original configuration",
      "Smoking strictly prohibited",
    ],
    tags: ["Corporate", "Meeting", "Workshop"],
    popularity: 75,
  },
  {
    name: "Rooftop Terrace",
    type: "Rooftop",
    capacity: 150,
    dimensions: "2,000 sq ft",
    address: "Roof Level, The Westin Kuala Lumpur, Jalan Bukit Bintang",
    description: "A stunning open-air terrace perched 30 floors above the city, offering panoramic views of the KL skyline. Ideal for cocktail receptions, product launches, and intimate celebrations under the stars.",
    amenities: ["WiFi", "Parking", "AV Equipment", "DJ/Sound"],
    pricing: { morning: 2000, afternoon: 2500, evening: 5000, fullDay: 8500 },
    rating: 4.9,
    reviews: 63,
    active: true,
    featured: true,
    images: [
      "https://picsum.photos/seed/rooftop1/800/500",
      "https://picsum.photos/seed/rooftop2/800/500",
      "https://picsum.photos/seed/rooftop3/800/500",
    ],
    houseRules: [
      "Event subject to weather conditions — indoor backup available",
      "Maximum occupancy 150 persons at all times",
      "Noise ordinance applies after 10:30 PM",
    ],
    tags: ["Cocktail", "Launch", "Celebration"],
    popularity: 91,
  },
  {
    name: "Garden Pavilion",
    type: "Outdoor Garden",
    capacity: 200,
    dimensions: "5,000 sq ft",
    address: "Dewan Perdana, Taman Botani Perdana, Kuala Lumpur",
    description: "A lush, tropical garden venue nestled within a heritage botanical garden. Features a traditional Malay pavilion, manicured lawns, and natural floral backdrops — perfect for garden weddings and cultural ceremonies.",
    amenities: ["Parking", "Catering", "Stage"],
    pricing: { morning: 2500, afternoon: 2500, evening: 4000, fullDay: 7500 },
    rating: 4.7,
    reviews: 95,
    active: true,
    featured: false,
    images: [
      "https://picsum.photos/seed/garden1/800/500",
      "https://picsum.photos/seed/garden2/800/500",
    ],
    houseRules: [
      "No vehicles on garden grounds",
      "Open fires and candles prohibited",
      "Event must end by 10:00 PM",
      "Respect natural flora — no decorative stakes in lawns",
    ],
    tags: ["Wedding", "Ceremony", "Cultural"],
    popularity: 82,
  },
  {
    name: "Auditorium Hall",
    type: "Auditorium",
    capacity: 300,
    dimensions: "4,500 sq ft",
    address: "Pusat Konvensyen Antarabangsa Putrajaya (PICC), Putrajaya",
    description: "A world-class auditorium with tiered stadium seating, Dolby-certified acoustics, and a fully equipped backstage. Hosts international seminars, concerts, theatrical performances, and graduation ceremonies.",
    amenities: ["WiFi", "Parking", "AV Equipment", "Air Conditioning", "Stage", "Catering"],
    pricing: { morning: 4000, afternoon: 4000, evening: 5500, fullDay: 12000 },
    rating: 4.5,
    reviews: 112,
    active: true,
    featured: false,
    images: [
      "https://picsum.photos/seed/auditorium1/800/500",
      "https://picsum.photos/seed/auditorium2/800/500",
    ],
    houseRules: [
      "Professional sound engineer required for amplified events",
      "Backstage access restricted to authorized personnel",
      "No food or beverages in the main hall",
    ],
    tags: ["Seminar", "Concert", "Graduation"],
    popularity: 86,
  },
  {
    name: "Executive Boardroom",
    type: "Conference Room",
    capacity: 20,
    dimensions: "450 sq ft",
    address: "Level 38, Menara TM, Jalan Pantai Baharu, Kuala Lumpur",
    description: "An intimate, premium boardroom designed for high-stakes executive meetings and confidential negotiations. Features encrypted video conferencing, a digital smart board, and butler service on request.",
    amenities: ["WiFi", "AV Equipment", "Air Conditioning", "Catering"],
    pricing: { morning: 500, afternoon: 500, evening: 400, fullDay: 1200 },
    rating: 4.7,
    reviews: 41,
    active: true,
    featured: false,
    images: [
      "https://picsum.photos/seed/boardroom1/800/500",
      "https://picsum.photos/seed/boardroom2/800/500",
    ],
    houseRules: [
      "NDAs available on request — ask front desk",
      "No recording without mutual written consent",
      "Catering orders must be placed 24 hours in advance",
    ],
    tags: ["Board Meeting", "VIP", "Confidential"],
    popularity: 60,
  },
];

const REVIEWS = [
  { venueRef: "Grand Ballroom", author: "Siti Rahayu", rating: 5, date: "2026-03-15", comment: "Absolutely breathtaking venue. Our wedding guests were blown away by the chandeliers and service. Highly recommend!" },
  { venueRef: "Grand Ballroom", author: "Ahmad Faizal", rating: 5, date: "2026-02-28", comment: "Hosted our annual gala here. Staff was professional, food was excellent, and the stage setup was perfect." },
  { venueRef: "Grand Ballroom", author: "Priya Nair", rating: 4, date: "2026-01-10", comment: "Great venue overall. Parking can get a bit tight during peak hours but the interior is stunning." },
  { venueRef: "Conference Suite A", author: "Kevin Lim", rating: 5, date: "2026-03-20", comment: "Excellent AV setup. Our product launch went off without a hitch. Will book again." },
  { venueRef: "Conference Suite A", author: "Nurul Ain", rating: 4, date: "2026-02-05", comment: "Clean, professional space. WiFi was blazing fast. Could use better coffee options." },
  { venueRef: "Rooftop Terrace", author: "James Wong", rating: 5, date: "2026-03-25", comment: "The KL skyline view at night is unreal. Our clients loved it. Premium experience." },
  { venueRef: "Rooftop Terrace", author: "Hafizah Musa", rating: 5, date: "2026-03-01", comment: "Perfect for a cocktail event. Magical atmosphere as the sun set over the city." },
  { venueRef: "Garden Pavilion", author: "Raj Kumar", rating: 5, date: "2026-02-20", comment: "The garden setting was exactly what we wanted for a traditional nikah ceremony. Beautiful." },
  { venueRef: "Garden Pavilion", author: "Melissa Tan", rating: 4, date: "2026-01-30", comment: "Lovely outdoor venue. Weather was a concern but team had a backup plan. Appreciated the responsiveness." },
  { venueRef: "Auditorium Hall", author: "Dr. Azman Hashim", rating: 4, date: "2026-03-10", comment: "Good acoustics for our international conference. Seating was comfortable for a 3-hour session." },
  { venueRef: "Executive Boardroom", author: "Cecilia Ho", rating: 5, date: "2026-03-18", comment: "Exactly what we needed for a sensitive M&A negotiation. Discreet, professional, world-class facilities." },
];

const BOOKINGS = [
  { bookingRef: "BK-20260401-001", venueName: "Grand Ballroom", date: "2026-05-10", timeSlot: "fullDay", eventType: "Wedding", guestCount: 380, clientName: "Ahmad & Siti Rahayu", clientEmail: "ahmad.siti@gmail.com", clientPhone: "0123456789", organization: "", addOns: ["catering", "decoration", "photography"], specialRequests: "Please arrange halal catering. Bride requires a private preparation room.", status: "approved", adminNotes: "VIP booking — personally handled by manager.", estimatedCost: 17500 },
  { bookingRef: "BK-20260403-002", venueName: "Conference Suite A", date: "2026-05-15", timeSlot: "morning", eventType: "Corporate", guestCount: 40, clientName: "Kevin Lim", clientEmail: "kevin.lim@techcorp.my", clientPhone: "0198765432", organization: "TechCorp Malaysia", addOns: ["catering"], specialRequests: "Need whiteboard markers and flipchart paper.", status: "pending", adminNotes: "", estimatedCost: 1100 },
  { bookingRef: "BK-20260404-003", venueName: "Rooftop Terrace", date: "2026-05-20", timeSlot: "evening", eventType: "Corporate", guestCount: 120, clientName: "James Wong", clientEmail: "james.w@innovate.com", clientPhone: "0112233445", organization: "Innovate Holdings", addOns: ["djSound", "decoration"], specialRequests: "Company logo to be projected on the city skyline if possible.", status: "approved", adminNotes: "Confirmed. Projection not feasible — advised client.", estimatedCost: 6300 },
  { bookingRef: "BK-20260405-004", venueName: "Garden Pavilion", date: "2026-05-25", timeSlot: "afternoon", eventType: "Wedding", guestCount: 180, clientName: "Raj & Melissa Kumar", clientEmail: "rajmelissa@gmail.com", clientPhone: "0167654321", organization: "", addOns: ["catering", "decoration", "photography", "valetParking"], specialRequests: "Traditional Hindu ceremony — priest needs a ceremonial fire setup area.", status: "pending", adminNotes: "", estimatedCost: 8600 },
  { bookingRef: "BK-20260406-005", venueName: "Auditorium Hall", date: "2026-05-12", timeSlot: "fullDay", eventType: "Seminar", guestCount: 280, clientName: "Dr. Azman Hashim", clientEmail: "azman.h@univ.edu.my", clientPhone: "0134455667", organization: "Universiti Malaya", addOns: ["catering", "djSound"], specialRequests: "Simultaneous translation booths required for 2 languages.", status: "approved", adminNotes: "Translation booth rental arranged with 3rd party vendor.", estimatedCost: 14800 },
  { bookingRef: "BK-20260408-006", venueName: "Executive Boardroom", date: "2026-05-08", timeSlot: "morning", eventType: "Corporate", guestCount: 15, clientName: "Cecilia Ho", clientEmail: "cecilia.ho@capitalmgmt.my", clientPhone: "0178899001", organization: "Capital Management Sdn Bhd", addOns: ["catering"], specialRequests: "NDA required. No photography.", status: "approved", adminNotes: "NDA signed and filed.", estimatedCost: 800 },
  { bookingRef: "BK-20260409-007", venueName: "Grand Ballroom", date: "2026-06-01", timeSlot: "evening", eventType: "Birthday", guestCount: 200, clientName: "Nurul Ain binti Zulkifli", clientEmail: "nurulain@gmail.com", clientPhone: "0112345678", organization: "", addOns: ["catering", "decoration", "djSound"], specialRequests: "Surprise party — please do not contact the guest of honour directly.", status: "rejected", adminNotes: "Date unavailable — double-booked. Client advised to rebook.", estimatedCost: 9300 },
  { bookingRef: "BK-20260410-008", venueName: "Rooftop Terrace", date: "2026-06-10", timeSlot: "evening", eventType: "Other", guestCount: 90, clientName: "Priya Nair", clientEmail: "priya.nair@brand.co", clientPhone: "0196543210", organization: "Priya Brand Co.", addOns: ["photography"], specialRequests: "Fashion show runway setup — need 8m x 1.5m catwalk along terrace edge.", status: "pending", adminNotes: "", estimatedCost: 6200 },
  { bookingRef: "BK-20260411-009", venueName: "Conference Suite A", date: "2026-05-22", timeSlot: "fullDay", eventType: "Seminar", guestCount: 48, clientName: "Hafizah Musa", clientEmail: "hafizah@hrd.gov.my", clientPhone: "0145566778", organization: "HRD Corp", addOns: ["catering"], specialRequests: "Need 5 breakout tables. Halal-certified lunch required.", status: "approved", adminNotes: "", estimatedCost: 2600 },
  { bookingRef: "BK-20260412-010", venueName: "Garden Pavilion", date: "2026-06-15", timeSlot: "morning", eventType: "Other", guestCount: 160, clientName: "Melissa Tan", clientEmail: "melissa.tan@school.edu.my", clientPhone: "0139988776", organization: "SRJK(C) Sentul", addOns: ["catering"], specialRequests: "Annual Sports Day — need additional outdoor seating and shade tents.", status: "pending", adminNotes: "", estimatedCost: 3100 },
];

// ─── SEED ─────────────────────────────────────

async function seed() {
  console.log("🌱  Seeding Anjung database...\n");

  // 1. Venues
  console.log("📍  Venues:");
  const venueMap = {};
  for (const v of VENUES) {
    const result = await post("Venue", v);
    venueMap[v.name] = result.objectId;
    console.log(`   ✓  ${v.name}`);
  }

  // 2. Reviews (link venueId)
  console.log("\n⭐  Reviews:");
  for (const r of REVIEWS) {
    const venueId = venueMap[r.venueRef];
    if (!venueId) { console.warn(`   ⚠  No venue for review: ${r.venueRef}`); continue; }
    const { venueRef: _, ...rest } = r;
    await post("Review", { ...rest, venueId });
    console.log(`   ✓  ${r.author} → ${r.venueRef}`);
  }

  // 3. Bookings
  console.log("\n📅  Bookings:");
  for (const b of BOOKINGS) {
    await post("Booking", { ...b, createdAt: new Date().toISOString() });
    console.log(`   ✓  ${b.bookingRef} – ${b.clientName}`);
  }

  console.log("\n✅  Seed complete.");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
