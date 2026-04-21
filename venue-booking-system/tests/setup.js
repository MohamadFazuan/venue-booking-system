import "@testing-library/jest-dom";
import { vi } from "vitest";

const MOCK_VENUES = [
  { id: "v1", name: "Grand Ballroom", type: "Banquet Hall", capacity: 500, dimensions: "3,200 sq ft", address: "Level 5, Connexion@Nexus, Bangsar South, KL", description: "Grand venue.", amenities: ["WiFi", "Parking", "Catering", "AV Equipment", "Air Conditioning", "Stage"], pricing: { morning: 3500, afternoon: 4000, evening: 6500, fullDay: 12000 }, rating: 4.8, reviews: 124, active: true, featured: true, images: ["https://picsum.photos/seed/b1/800/500"], houseRules: [], tags: ["Wedding"], popularity: 98 },
  { id: "v2", name: "Conference Suite A", type: "Conference Room", capacity: 50, dimensions: "800 sq ft", address: "Level 12, Menara KL", description: "Conference room.", amenities: ["WiFi", "AV Equipment", "Air Conditioning", "Catering"], pricing: { morning: 800, afternoon: 800, evening: 600, fullDay: 2000 }, rating: 4.6, reviews: 87, active: true, featured: true, images: ["https://picsum.photos/seed/c1/800/500"], houseRules: [], tags: ["Corporate"], popularity: 75 },
  { id: "v3", name: "Rooftop Terrace", type: "Rooftop", capacity: 150, dimensions: "2,000 sq ft", address: "Roof Level, Westin KL", description: "Rooftop venue.", amenities: ["WiFi", "Parking", "AV Equipment", "DJ/Sound"], pricing: { morning: 2000, afternoon: 2500, evening: 5000, fullDay: 8500 }, rating: 4.9, reviews: 63, active: true, featured: true, images: ["https://picsum.photos/seed/r1/800/500"], houseRules: [], tags: ["Cocktail"], popularity: 91 },
  { id: "v4", name: "Garden Pavilion", type: "Outdoor Garden", capacity: 200, dimensions: "5,000 sq ft", address: "Taman Botani Perdana, KL", description: "Garden venue.", amenities: ["Parking", "Catering", "Stage"], pricing: { morning: 2500, afternoon: 2500, evening: 4000, fullDay: 7500 }, rating: 4.7, reviews: 95, active: true, featured: false, images: ["https://picsum.photos/seed/g1/800/500"], houseRules: [], tags: ["Wedding"], popularity: 82 },
  { id: "v5", name: "Auditorium Hall", type: "Auditorium", capacity: 300, dimensions: "4,500 sq ft", address: "PICC, Putrajaya", description: "Auditorium venue.", amenities: ["WiFi", "Parking", "AV Equipment", "Air Conditioning", "Stage", "Catering"], pricing: { morning: 4000, afternoon: 4000, evening: 5500, fullDay: 12000 }, rating: 4.5, reviews: 112, active: true, featured: false, images: ["https://picsum.photos/seed/a1/800/500"], houseRules: [], tags: ["Seminar"], popularity: 86 },
  { id: "v6", name: "Executive Boardroom", type: "Conference Room", capacity: 20, dimensions: "450 sq ft", address: "Level 38, Menara TM, KL", description: "Boardroom.", amenities: ["WiFi", "AV Equipment", "Air Conditioning", "Catering"], pricing: { morning: 500, afternoon: 500, evening: 400, fullDay: 1200 }, rating: 4.7, reviews: 41, active: true, featured: false, images: ["https://picsum.photos/seed/br1/800/500"], houseRules: [], tags: ["Board Meeting"], popularity: 60 },
];

const MOCK_BOOKINGS = [
  { id: "b1", bookingRef: "BK-20260403-002", venueName: "Conference Suite A", date: "2026-05-15", timeSlot: "morning", eventType: "Corporate", guestCount: 40, clientName: "Kevin Lim", clientEmail: "kevin.lim@techcorp.my", clientPhone: "0198765432", organization: "TechCorp", addOns: [], specialRequests: "", status: "pending", adminNotes: "", estimatedCost: 800 },
  { id: "b2", bookingRef: "BK-20260401-001", venueName: "Grand Ballroom", date: "2026-05-10", timeSlot: "fullDay", eventType: "Wedding", guestCount: 380, clientName: "Ahmad Siti", clientEmail: "ahmad@gmail.com", clientPhone: "0123456789", organization: "", addOns: [], specialRequests: "", status: "approved", adminNotes: "", estimatedCost: 12000 },
];

// Mock Parse API — return realistic data instantly so the loading state resolves
vi.mock("@/lib/api.js", () => ({
  fetchVenues: vi.fn().mockResolvedValue(MOCK_VENUES),
  fetchBookings: vi.fn().mockResolvedValue(MOCK_BOOKINGS),
  fetchReviews: vi.fn().mockResolvedValue([]),
  createBooking: vi.fn().mockResolvedValue({}),
  updateBooking: vi.fn().mockResolvedValue(undefined),
  updateVenue: vi.fn().mockResolvedValue(undefined),
  deleteVenue: vi.fn().mockResolvedValue(undefined),
}));

// Suppress Parse "use parse/node" warning in tests
vi.mock("@/lib/parse.js", () => ({ default: {} }));

// Suppress console.error noise from React in test output
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning:") || args[0].includes("ReactDOM.render"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});
afterAll(() => { console.error = originalError; });

// Mock window.scrollTo (not implemented in jsdom)
Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
