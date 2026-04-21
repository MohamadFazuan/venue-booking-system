
import { useState, useEffect, useContext, createContext, useMemo, useCallback, useReducer } from "react";
import {
  fetchVenues,
  fetchBookings,
  fetchReviews,
  updateBooking as updateBookingApi,
  updateVenue as updateVenueApi,
  deleteVenue as deleteVenueApi,
} from "@/lib/api.js";
import {
  Home, Building2, Calendar, Users, Settings, LogOut,
  Menu, X, Bell, Search, ChevronRight, ChevronDown, ChevronLeft,
  Star, MapPin, Clock, DollarSign, CheckCircle, XCircle,
  AlertCircle, Plus, Filter, Grid3X3, List, BarChart2,
  TrendingUp, Eye, Edit, Trash2, BookOpen, ArrowLeft,
  Phone, Mail, User, Building, Wifi, Car, Utensils,
  Mic, Camera, Wind, Music, Copy, Download, Check,
  CalendarDays, Layout, PieChart, RefreshCw, Shield,
  ChevronUp, Tag, Info, Heart, Share2, Maximize2,
  LayoutGrid, Sliders, SortAsc, Award, Zap, Coffee
} from "lucide-react";

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const AMENITY_ICONS = {
  WiFi: Wifi,
  Parking: Car,
  Catering: Utensils,
  "AV Equipment": Mic,
  "Air Conditioning": Wind,
  Stage: Layout,
  Photography: Camera,
  "DJ/Sound": Music,
};

const VENUES = [
  {
    id: "v1",
    name: "Grand Ballroom",
    type: "Banquet Hall",
    capacity: 500,
    dimensions: "3,200 sq ft",
    address: "Level 5, Connexion@Nexus, Bangsar South, Kuala Lumpur",
    description:
      "An opulent ballroom adorned with crystal chandeliers and marble flooring, ideal for grand weddings and gala dinners. Features a private bridal suite, dedicated catering kitchen, and a sweeping stage with professional lighting rig.",
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
    id: "v2",
    name: "Conference Suite A",
    type: "Conference Room",
    capacity: 50,
    dimensions: "800 sq ft",
    address: "Level 12, Menara Kuala Lumpur, Jalan Punchak, KL City Centre",
    description:
      "A sleek, modern conference suite equipped with enterprise-grade AV technology, high-speed fibre WiFi, and ergonomic seating. Perfect for board meetings, product launches, and intensive workshops.",
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
    id: "v3",
    name: "Rooftop Terrace",
    type: "Rooftop",
    capacity: 150,
    dimensions: "2,000 sq ft",
    address: "Roof Level, The Westin Kuala Lumpur, Jalan Bukit Bintang",
    description:
      "A stunning open-air terrace perched 30 floors above the city, offering panoramic views of the KL skyline. Ideal for cocktail receptions, product launches, and intimate celebrations under the stars.",
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
    id: "v4",
    name: "Garden Pavilion",
    type: "Outdoor Garden",
    capacity: 200,
    dimensions: "5,000 sq ft",
    address: "Dewan Perdana, Taman Botani Perdana, Kuala Lumpur",
    description:
      "A lush, tropical garden venue nestled within a heritage botanical garden. Features a traditional Malay pavilion, manicured lawns, and natural floral backdrops — perfect for garden weddings and cultural ceremonies.",
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
    id: "v5",
    name: "Auditorium Hall",
    type: "Auditorium",
    capacity: 300,
    dimensions: "4,500 sq ft",
    address: "Pusat Konvensyen Antarabangsa Putrajaya (PICC), Putrajaya",
    description:
      "A world-class auditorium with tiered stadium seating, Dolby-certified acoustics, and a fully equipped backstage. Hosts international seminars, concerts, theatrical performances, and graduation ceremonies.",
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
    id: "v6",
    name: "Executive Boardroom",
    type: "Conference Room",
    capacity: 20,
    dimensions: "450 sq ft",
    address: "Level 38, Menara TM, Jalan Pantai Baharu, Kuala Lumpur",
    description:
      "An intimate, premium boardroom designed for high-stakes executive meetings and confidential negotiations. Features encrypted video conferencing, a digital smart board, and butler service on request.",
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

const MOCK_REVIEWS = [
  { id: "r1", venueId: "v1", author: "Siti Rahayu", rating: 5, date: "2026-03-15", comment: "Absolutely breathtaking venue. Our wedding guests were blown away by the chandeliers and service. Highly recommend!" },
  { id: "r2", venueId: "v1", author: "Ahmad Faizal", rating: 5, date: "2026-02-28", comment: "Hosted our annual gala here. Staff was professional, food was excellent, and the stage setup was perfect." },
  { id: "r3", venueId: "v1", author: "Priya Nair", rating: 4, date: "2026-01-10", comment: "Great venue overall. Parking can get a bit tight during peak hours but the interior is stunning." },
  { id: "r4", venueId: "v2", author: "Kevin Lim", rating: 5, date: "2026-03-20", comment: "Excellent AV setup. Our product launch went off without a hitch. Will book again." },
  { id: "r5", venueId: "v2", author: "Nurul Ain", rating: 4, date: "2026-02-05", comment: "Clean, professional space. WiFi was blazing fast. Could use better coffee options." },
  { id: "r6", venueId: "v3", author: "James Wong", rating: 5, date: "2026-03-25", comment: "The KL skyline view at night is unreal. Our clients loved it. Premium experience." },
  { id: "r7", venueId: "v3", author: "Hafizah Musa", rating: 5, date: "2026-03-01", comment: "Perfect for a cocktail event. Magical atmosphere as the sun set over the city." },
  { id: "r8", venueId: "v4", author: "Raj Kumar", rating: 5, date: "2026-02-20", comment: "The garden setting was exactly what we wanted for a traditional nikah ceremony. Beautiful." },
  { id: "r9", venueId: "v4", author: "Melissa Tan", rating: 4, date: "2026-01-30", comment: "Lovely outdoor venue. Weather was a concern but team had a backup plan. Appreciated the responsiveness." },
  { id: "r10", venueId: "v5", author: "Dr. Azman Hashim", rating: 4, date: "2026-03-10", comment: "Good acoustics for our international conference. Seating was comfortable for a 3-hour session." },
  { id: "r11", venueId: "v6", author: "Cecilia Ho", rating: 5, date: "2026-03-18", comment: "Exactly what we needed for a sensitive M&A negotiation. Discreet, professional, world-class facilities." },
];

const INITIAL_BOOKINGS = [
  {
    id: "BK-20260401-001",
    venueId: "v1",
    venueName: "Grand Ballroom",
    date: "2026-05-10",
    timeSlot: "fullDay",
    eventType: "Wedding",
    guestCount: 380,
    clientName: "Ahmad & Siti Rahayu",
    clientEmail: "ahmad.siti@gmail.com",
    clientPhone: "0123456789",
    organization: "",
    addOns: ["catering", "decoration", "photography"],
    specialRequests: "Please arrange halal catering. Bride requires a private preparation room.",
    status: "approved",
    adminNotes: "VIP booking — personally handled by manager.",
    createdAt: "2026-04-01T09:00:00",
    estimatedCost: 12000 + 2500 + 1200 + 1800,
  },
  {
    id: "BK-20260403-002",
    venueId: "v2",
    venueName: "Conference Suite A",
    date: "2026-05-15",
    timeSlot: "morning",
    eventType: "Corporate",
    guestCount: 40,
    clientName: "Kevin Lim",
    clientEmail: "kevin.lim@techcorp.my",
    clientPhone: "0198765432",
    organization: "TechCorp Malaysia",
    addOns: ["catering"],
    specialRequests: "Need whiteboard markers and flipchart paper.",
    status: "pending",
    adminNotes: "",
    createdAt: "2026-04-03T14:22:00",
    estimatedCost: 800 + 300,
  },
  {
    id: "BK-20260404-003",
    venueId: "v3",
    venueName: "Rooftop Terrace",
    date: "2026-05-20",
    timeSlot: "evening",
    eventType: "Corporate",
    guestCount: 120,
    clientName: "James Wong",
    clientEmail: "james.w@innovate.com",
    clientPhone: "0112233445",
    organization: "Innovate Holdings",
    addOns: ["djSound", "decoration"],
    specialRequests: "Company logo to be projected on the city skyline if possible.",
    status: "approved",
    adminNotes: "Confirmed. Projection not feasible — advised client.",
    createdAt: "2026-04-04T10:15:00",
    estimatedCost: 5000 + 800 + 500,
  },
  {
    id: "BK-20260405-004",
    venueId: "v4",
    venueName: "Garden Pavilion",
    date: "2026-05-25",
    timeSlot: "afternoon",
    eventType: "Wedding",
    guestCount: 180,
    clientName: "Raj & Melissa Kumar",
    clientEmail: "rajmelissa@gmail.com",
    clientPhone: "0167654321",
    organization: "",
    addOns: ["catering", "decoration", "photography", "valetParking"],
    specialRequests: "Traditional Hindu ceremony — priest needs a ceremonial fire setup area.",
    status: "pending",
    adminNotes: "",
    createdAt: "2026-04-05T08:45:00",
    estimatedCost: 2500 + 2500 + 1200 + 1800 + 600,
  },
  {
    id: "BK-20260406-005",
    venueId: "v5",
    venueName: "Auditorium Hall",
    date: "2026-05-12",
    timeSlot: "fullDay",
    eventType: "Seminar",
    guestCount: 280,
    clientName: "Dr. Azman Hashim",
    clientEmail: "azman.h@univ.edu.my",
    clientPhone: "0134455667",
    organization: "Universiti Malaya",
    addOns: ["catering", "djSound"],
    specialRequests: "Simultaneous translation booths required for 2 languages.",
    status: "approved",
    adminNotes: "Translation booth rental arranged with 3rd party vendor.",
    createdAt: "2026-04-06T11:30:00",
    estimatedCost: 12000 + 2000 + 800,
  },
  {
    id: "BK-20260408-006",
    venueId: "v6",
    venueName: "Executive Boardroom",
    date: "2026-05-08",
    timeSlot: "morning",
    eventType: "Corporate",
    guestCount: 15,
    clientName: "Cecilia Ho",
    clientEmail: "cecilia.ho@capitalmgmt.my",
    clientPhone: "0178899001",
    organization: "Capital Management Sdn Bhd",
    addOns: ["catering"],
    specialRequests: "NDA required. No photography.",
    status: "approved",
    adminNotes: "NDA signed and filed.",
    createdAt: "2026-04-08T09:00:00",
    estimatedCost: 500 + 300,
  },
  {
    id: "BK-20260409-007",
    venueId: "v1",
    venueName: "Grand Ballroom",
    date: "2026-06-01",
    timeSlot: "evening",
    eventType: "Birthday",
    guestCount: 200,
    clientName: "Nurul Ain binti Zulkifli",
    clientEmail: "nurulain@gmail.com",
    clientPhone: "0112345678",
    organization: "",
    addOns: ["catering", "decoration", "djSound"],
    specialRequests: "Surprise party — please do not contact the guest of honour directly.",
    status: "rejected",
    adminNotes: "Date unavailable — double-booked. Client advised to rebook.",
    createdAt: "2026-04-09T16:00:00",
    estimatedCost: 6500 + 2000 + 800,
  },
  {
    id: "BK-20260410-008",
    venueId: "v3",
    venueName: "Rooftop Terrace",
    date: "2026-06-10",
    timeSlot: "evening",
    eventType: "Other",
    guestCount: 90,
    clientName: "Priya Nair",
    clientEmail: "priya.nair@brand.co",
    clientPhone: "0196543210",
    organization: "Priya Brand Co.",
    addOns: ["photography"],
    specialRequests: "Fashion show runway setup — need 8m x 1.5m catwalk along terrace edge.",
    status: "pending",
    adminNotes: "",
    createdAt: "2026-04-10T13:20:00",
    estimatedCost: 5000 + 1200,
  },
  {
    id: "BK-20260411-009",
    venueId: "v2",
    venueName: "Conference Suite A",
    date: "2026-05-22",
    timeSlot: "fullDay",
    eventType: "Seminar",
    guestCount: 48,
    clientName: "Hafizah Musa",
    clientEmail: "hafizah@hrd.gov.my",
    clientPhone: "0145566778",
    organization: "HRD Corp",
    addOns: ["catering"],
    specialRequests: "Need 5 breakout tables. Halal-certified lunch required.",
    status: "approved",
    adminNotes: "",
    createdAt: "2026-04-11T10:00:00",
    estimatedCost: 2000 + 600,
  },
  {
    id: "BK-20260412-010",
    venueId: "v4",
    venueName: "Garden Pavilion",
    date: "2026-06-15",
    timeSlot: "morning",
    eventType: "Other",
    guestCount: 160,
    clientName: "Melissa Tan",
    clientEmail: "melissa.tan@school.edu.my",
    clientPhone: "0139988776",
    organization: "SRJK(C) Sentul",
    addOns: ["catering"],
    specialRequests: "Annual Sports Day — need additional outdoor seating and shade tents.",
    status: "pending",
    adminNotes: "",
    createdAt: "2026-04-12T08:15:00",
    estimatedCost: 2500 + 600,
  },
];

const ADDON_PRICES = {
  catering: { label: "Catering", price: 600 },
  decoration: { label: "Decoration & Florals", price: 800 },
  djSound: { label: "DJ / Sound System", price: 500 },
  photography: { label: "Photography Package", price: 1200 },
  valetParking: { label: "Valet Parking", price: 400 },
};

const TIME_SLOTS = {
  morning: { label: "Morning", time: "8:00 AM – 12:00 PM" },
  afternoon: { label: "Afternoon", time: "12:00 PM – 5:00 PM" },
  evening: { label: "Evening", time: "5:00 PM – 11:00 PM" },
  fullDay: { label: "Full Day", time: "8:00 AM – 11:00 PM" },
};

const EVENT_TYPES = ["Wedding", "Corporate", "Birthday", "Seminar", "Exhibition", "Other"];

const VENUE_TYPES = ["Banquet Hall", "Conference Room", "Rooftop", "Outdoor Garden", "Auditorium"];

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

const AppContext = createContext(null);

function appReducer(state, action) {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, view: action.view, viewData: action.data || null };
    case "LOGIN":
      return { ...state, isAdmin: true };
    case "LOGOUT":
      return { ...state, isAdmin: false, view: "home" };
    case "ADD_BOOKING":
      return { ...state, bookings: [action.booking, ...state.bookings] };
    case "UPDATE_BOOKING":
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.id ? { ...b, ...action.updates } : b
        ),
      };
    case "ADD_VENUE":
      return { ...state, venues: [...state.venues, action.venue] };
    case "UPDATE_VENUE":
      return {
        ...state,
        venues: state.venues.map((v) =>
          v.id === action.id ? { ...v, ...action.updates } : v
        ),
      };
    case "DELETE_VENUE":
      return { ...state, venues: state.venues.filter((v) => v.id !== action.id) };
    case "ADD_TOAST":
      return { ...state, toasts: [...state.toasts, action.toast] };
    case "REMOVE_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case "INIT_DATA":
      return { ...state, venues: action.venues, bookings: action.bookings, reviews: action.reviews };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

const initialState = {
  view: "home",
  viewData: null,
  isAdmin: false,
  venues: [],
  bookings: [],
  reviews: [],
  toasts: [],
  loading: true,
};

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const navigate = useCallback((view, data = null) => {
    dispatch({ type: "SET_VIEW", view, data });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now().toString();
    dispatch({ type: "ADD_TOAST", toast: { id, message, type } });
    setTimeout(() => dispatch({ type: "REMOVE_TOAST", id }), 4000);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [venues, bookings, reviews] = await Promise.all([
          fetchVenues(),
          fetchBookings(),
          fetchReviews(),
        ]);
        dispatch({ type: "INIT_DATA", venues, bookings, reviews });
      } catch {
        // Fall back to mock data so the app is always functional
        dispatch({ type: "INIT_DATA", venues: VENUES, bookings: INITIAL_BOOKINGS, reviews: MOCK_REVIEWS });
        addToast("Using demo data (database offline).", "warning");
      } finally {
        dispatch({ type: "SET_LOADING", loading: false });
      }
    }
    loadData();
  }, [addToast]);

  const value = useMemo(
    () => ({ state, dispatch, navigate, addToast }),
    [state, dispatch, navigate, addToast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useApp() {
  return useContext(AppContext);
}

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────

function formatMYR(amount) {
  return `RM ${amount.toLocaleString("en-MY")}`;
}

function generateBookingId() {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 900 + 100);
  return `BK-${dateStr}-${rand}`;
}

function getStatusConfig(status) {
  const map = {
    pending: { label: "Pending", color: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
    approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-700", dot: "bg-red-400" },
    cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
  };
  return map[status] || map.pending;
}

function StarRating({ rating, size = "sm" }) {
  const sz = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sz} ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────

function ToastContainer() {
  const { state, dispatch } = useApp();
  const icons = { success: CheckCircle, error: XCircle, warning: AlertCircle, info: Info };
  const colors = {
    success: "bg-emerald-600",
    error: "bg-red-600",
    warning: "bg-amber-500",
    info: "bg-emerald-700",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {state.toasts.map((t) => {
        const Icon = icons[t.type] || CheckCircle;
        return (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-2xl pointer-events-auto min-w-[280px] max-w-sm ${colors[t.type] || colors.success} animate-slide-in`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium flex-1">{t.message}</span>
            <button
              onClick={() => dispatch({ type: "REMOVE_TOAST", id: t.id })}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// PUBLIC NAVBAR
// ─────────────────────────────────────────────

function PublicNav() {
  const { state, navigate } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Browse Venues", view: "venues" },
    { label: "My Bookings", view: "my-bookings" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-700 to-teal-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Building2 className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              Anjung<span className="text-amber-500">.</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <button
                key={l.view}
                onClick={() => navigate(l.view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  state.view === l.view
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("admin-login")}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
            <button
              onClick={() => navigate("venues")}
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition-colors shadow-sm"
            >
              Book Now
            </button>
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <button
              key={l.view}
              onClick={() => { navigate(l.view); setMobileOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => { navigate("admin-login"); setMobileOpen(false); }}
            className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Admin Login
          </button>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────
// ADMIN SIDEBAR
// ─────────────────────────────────────────────

const ADMIN_NAV = [
  { view: "admin-dashboard", label: "Dashboard", icon: LayoutGrid },
  { view: "admin-bookings", label: "Bookings", icon: BookOpen },
  { view: "admin-calendar", label: "Calendar", icon: CalendarDays },
  { view: "admin-venues", label: "Venues", icon: Building2 },
];

function AdminLayout({ children }) {
  const { state, dispatch, navigate } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingCount = state.bookings.filter((b) => b.status === "pending").length;

  function handleLogout() {
    dispatch({ type: "LOGOUT" });
    navigate("home");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-emerald-800/30">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        {sidebarOpen && (
          <div>
            <div className="font-bold text-white text-sm">Anjung</div>
            <div className="text-emerald-200 text-xs">Admin Portal</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {ADMIN_NAV.map(({ view, label, icon: Icon }) => (
          <button
            key={view}
            onClick={() => { navigate(view); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              state.view === view
                ? "bg-white/20 text-white shadow-inner"
                : "text-emerald-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="w-4.5 h-4.5 flex-shrink-0" />
            {sidebarOpen && (
              <span className="flex-1 text-left">{label}</span>
            )}
            {sidebarOpen && view === "admin-bookings" && pendingCount > 0 && (
              <span className="bg-amber-400 text-amber-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-emerald-800/30 space-y-1">
        <button
          onClick={() => navigate("home")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-100 hover:bg-white/10 hover:text-white transition-all"
        >
          <Home className="w-4.5 h-4.5 flex-shrink-0" />
          {sidebarOpen && <span>Public Site</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-100 hover:bg-red-500/20 hover:text-red-200 transition-all"
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-gradient-to-b from-emerald-900 to-emerald-950 transition-all duration-300 ${
          sidebarOpen ? "w-56" : "w-16"
        } flex-shrink-0`}
      >
        <SidebarContent />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-full bg-emerald-900 text-white p-1 rounded-r-lg hidden lg:block"
          style={{ marginLeft: sidebarOpen ? "224px" : "64px" }}
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-gradient-to-b from-emerald-900 to-emerald-950 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {ADMIN_NAV.find((n) => n.view === state.view)?.label || "Admin"}
              </h1>
              <p className="text-xs text-gray-500">Anjung Management Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <button
                onClick={() => navigate("admin-bookings")}
                className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-50"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />
              </button>
            )}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-gray-800">Admin</div>
                <div className="text-xs text-gray-500">admin@anjung.my</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE SHELLS
// ─────────────────────────────────────────────

function ComingSoonShell({ title, description, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-emerald-700" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-sm">{description}</p>
      <div className="mt-6 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
        Phase coming soon
      </div>
    </div>
  );
}

// ─── HOME PAGE ───────────────────────────────

function HomePage() {
  const { state, navigate } = useApp();
  const [search, setSearch] = useState("");

  const featuredVenues = state.venues.filter((v) => v.featured && v.active);
  const stats = [
    { label: "Venues Available", value: state.venues.filter((v) => v.active).length, icon: Building2 },
    { label: "Events Hosted", value: "1,200+", icon: Calendar },
    { label: "Happy Clients", value: "980+", icon: Users },
    { label: "Cities Covered", value: "3", icon: MapPin },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.4),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-emerald-100 mb-6 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Premier Event Venues Across Malaysia</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Find the Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-amber-300">
                Venue for Every
              </span>
              Occasion
            </h1>
            <p className="text-emerald-100 text-lg leading-relaxed mb-8 max-w-xl">
              From intimate boardrooms to grand ballrooms — browse, book, and manage event spaces across Kuala Lumpur and Putrajaya in minutes.
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur p-2 rounded-2xl border border-white/20">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-3">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by venue name, type, or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && navigate("venues", { search })}
                  className="flex-1 text-gray-900 placeholder-gray-400 text-sm outline-none bg-transparent"
                />
              </div>
              <button
                onClick={() => navigate("venues", { search })}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 font-bold text-sm hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg"
              >
                Search Venues
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {["Wedding Hall", "Conference Room", "Rooftop Terrace", "Garden"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate("venues", { search: tag })}
                  className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-emerald-100 hover:bg-white/20 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative floating card */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 w-64 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-400/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-teal-200" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Top Rated</div>
                <div className="text-emerald-200 text-xs">Rooftop Terrace</div>
              </div>
            </div>
            <StarRating rating={4.9} size="sm" />
            <div className="text-emerald-100 text-xs mt-2">63 reviews · Bukit Bintang</div>
            <div className="mt-3 text-amber-300 font-bold text-sm">From RM 2,000 / slot</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured venues */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              Featured
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Top-Rated Venues</h2>
          </div>
          <button
            onClick={() => navigate("venues")}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-600 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-white">
            <h3 className="text-2xl lg:text-3xl font-extrabold mb-2">Ready to Book Your Venue?</h3>
            <p className="text-emerald-100">Instant booking confirmation. No hidden fees. Cancel 48h before for full refund.</p>
          </div>
          <button
            onClick={() => navigate("venues")}
            className="px-8 py-4 bg-white rounded-xl text-emerald-800 font-bold hover:bg-emerald-50 transition-colors shadow-lg whitespace-nowrap flex-shrink-0"
          >
            Browse All Venues
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-700 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold text-sm">Anjung</span>
          </div>
          <p className="text-sm">© 2026 Anjung. Malaysia's Premier Event Spaces.</p>
        </div>
      </footer>
    </div>
  );
}

// ─── VENUE CARD ──────────────────────────────

function VenueCard({ venue }) {
  const { navigate } = useApp();

  return (
    <button
      onClick={() => navigate("venue-detail", { venueId: venue.id })}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left w-full"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={venue.images[0]}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-sm">
            {venue.type}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-gray-800">{venue.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-emerald-700 transition-colors">
          {venue.name}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{venue.address.split(",")[1]?.trim() || venue.address}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Users className="w-3.5 h-3.5" />
            <span>Up to {venue.capacity.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">From</div>
            <div className="text-sm font-bold text-emerald-700">
              {formatMYR(Math.min(...Object.values(venue.pricing)))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {venue.amenities.slice(0, 3).map((a) => (
            <span
              key={a}
              className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-600"
            >
              {a}
            </span>
          ))}
          {venue.amenities.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-400">
              +{venue.amenities.length - 3} more
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── VENUE LIST ITEM (list view) ─────────────

function VenueListItem({ venue }) {
  const { navigate } = useApp();
  return (
    <button
      onClick={() => navigate("venue-detail", { venueId: venue.id })}
      className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex text-left group"
    >
      <div className="w-44 sm:w-56 flex-shrink-0 relative bg-gray-100">
        <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-sm">
            {venue.type}
          </span>
        </div>
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition-colors">{venue.name}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-gray-800">{venue.rating}</span>
              <span className="text-xs text-gray-400">({venue.reviews})</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{venue.address}</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{venue.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {venue.amenities.slice(0, 4).map((a) => (
              <span key={a} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-600">{a}</span>
            ))}
            {venue.amenities.length > 4 && (
              <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-400">
                +{venue.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Users className="w-4 h-4" />
            <span>Up to {venue.capacity.toLocaleString()} guests</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">From</div>
            <div className="font-bold text-emerald-700">{formatMYR(Math.min(...Object.values(venue.pricing)))}</div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── VENUES PAGE ─────────────────────────────

function VenuesPage() {
  const { state, navigate } = useApp();
  const [search, setSearch] = useState(state.viewData?.search || "");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [capacityFilter, setCapacityFilter] = useState("any");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const capacityOptions = [
    { value: "any", label: "Any size" },
    { value: "0-50", label: "Up to 50" },
    { value: "51-150", label: "51 – 150" },
    { value: "151-300", label: "151 – 300" },
    { value: "301+", label: "300+" },
  ];

  const allAmenities = useMemo(
    () => [...new Set(state.venues.flatMap((v) => v.amenities))].sort(),
    [state.venues]
  );

  const filtered = useMemo(() => {
    let venues = state.venues.filter((v) => v.active);

    if (search.trim()) {
      const q = search.toLowerCase();
      venues = venues.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.type.toLowerCase().includes(q) ||
          v.address.toLowerCase().includes(q) ||
          v.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedTypes.length > 0) {
      venues = venues.filter((v) => selectedTypes.includes(v.type));
    }

    if (capacityFilter !== "any") {
      const [min, max] =
        capacityFilter === "301+"
          ? [301, Infinity]
          : capacityFilter.split("-").map(Number);
      venues = venues.filter((v) => v.capacity >= min && v.capacity <= (max || Infinity));
    }

    if (selectedAmenities.length > 0) {
      venues = venues.filter((v) =>
        selectedAmenities.every((a) => v.amenities.includes(a))
      );
    }

    return [...venues].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return Math.min(...Object.values(a.pricing)) - Math.min(...Object.values(b.pricing));
        case "price-desc":
          return Math.min(...Object.values(b.pricing)) - Math.min(...Object.values(a.pricing));
        case "rating":
          return b.rating - a.rating;
        case "capacity":
          return b.capacity - a.capacity;
        default:
          return b.popularity - a.popularity;
      }
    });
  }, [state.venues, search, selectedTypes, capacityFilter, selectedAmenities, sortBy]);

  const activeFilterCount =
    selectedTypes.length +
    selectedAmenities.length +
    (capacityFilter !== "any" ? 1 : 0);

  function clearFilters() {
    setSelectedTypes([]);
    setCapacityFilter("any");
    setSelectedAmenities([]);
    setSearch("");
  }

  function toggleType(type) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function toggleAmenity(amenity) {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate("home")} className="hover:text-emerald-700">Home</button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Browse Venues</span>
      </div>

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">All Venues</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {filtered.length} of {state.venues.filter((v) => v.active).length} venues in KL &amp; Putrajaya
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
          >
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="capacity">Largest Capacity</option>
          </select>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-emerald-100 text-emerald-700" : "text-gray-400 hover:text-gray-600"}`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-emerald-100 text-emerald-700" : "text-gray-400 hover:text-gray-600"}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar filters */}
        <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search venues..."
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Venue Type</h3>
            <div className="space-y-2">
              {VENUE_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-700 focus:ring-emerald-600"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Capacity</h3>
            <div className="space-y-2">
              {capacityOptions.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="radio"
                    name="capacity"
                    value={opt.value}
                    checked={capacityFilter === opt.value}
                    onChange={() => setCapacityFilter(opt.value)}
                    className="w-4 h-4 border-gray-300 text-emerald-700 focus:ring-emerald-600"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Amenities</h3>
            <div className="space-y-2">
              {allAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-700 focus:ring-emerald-600"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear filters ({activeFilterCount})
            </button>
          )}
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile: search + filter toggle */}
          <div className="lg:hidden flex gap-2 mb-4">
            <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search venues..."
                className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 whitespace-nowrap"
            >
              <Sliders className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-emerald-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile filter panel */}
          {filtersOpen && (
            <div className="lg:hidden bg-white border border-gray-200 rounded-2xl p-4 mb-4 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Venue Type</h3>
                <div className="flex flex-wrap gap-2">
                  {VENUE_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedTypes.includes(type)
                          ? "bg-emerald-700 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Capacity</h3>
                <div className="flex flex-wrap gap-2">
                  {capacityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setCapacityFilter(opt.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        capacityFilter === opt.value
                          ? "bg-emerald-700 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-sm text-emerald-700 hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-12 h-12 text-gray-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No venues found</h3>
              <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filters.</p>
              <button onClick={clearFilters} className="text-sm text-emerald-700 hover:underline">
                Clear all filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((venue) => <VenueListItem key={venue.id} venue={venue} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── VENUE DETAIL PAGE ───────────────────────

function VenueDetailPage() {
  const { state, navigate } = useApp();
  const venue = state.venues.find((v) => v.id === state.viewData?.venueId);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  if (!venue) return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Venue not found.</p>
        <button onClick={() => navigate("venues")} className="mt-4 text-emerald-700 hover:underline text-sm">
          Back to venues
        </button>
      </div>
    </div>
  );

  const venueReviews = state.reviews.filter((r) => r.venueId === venue.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("venues")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Venues
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left / main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 bg-gray-100 group">
              <img
                src={venue.images[activeImg]}
                alt={venue.name}
                className="w-full h-full object-cover transition-opacity duration-200"
              />
              {venue.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((p) => (p - 1 + venue.images.length) % venue.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setActiveImg((p) => (p + 1) % venue.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {venue.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`h-2 rounded-full transition-all ${i === activeImg ? "bg-white w-5" : "bg-white/60 w-2"}`}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-all">
                  <Heart className="w-4 h-4 text-gray-700" />
                </button>
                <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-all">
                  <Share2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
            {venue.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {venue.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeImg ? "border-emerald-600" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title + meta */}
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900">{venue.name}</h1>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-sm font-medium">{venue.type}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4" />{venue.address}</div>
              <div className="flex items-center gap-1"><Users className="w-4 h-4" />Up to {venue.capacity.toLocaleString()} guests</div>
              <div className="flex items-center gap-1"><Maximize2 className="w-4 h-4" />{venue.dimensions}</div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={venue.rating} size="md" />
              <span className="font-bold text-gray-900">{venue.rating}</span>
              <span className="text-gray-400 text-sm">({venue.reviews} reviews)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {venue.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-1 border-b border-gray-100 mb-5 overflow-x-auto">
              {["overview", "amenities", "reviews", "rules"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "border-emerald-700 text-emerald-700"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "reviews" ? `Reviews (${venueReviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <p className="text-gray-600 leading-relaxed">{venue.description}</p>
            )}

            {activeTab === "amenities" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {venue.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a] || CheckCircle;
                  return (
                    <div key={a} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-emerald-700" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{a}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {venueReviews.length === 0 ? (
                  <p className="text-gray-400 text-sm py-6 text-center">No reviews yet.</p>
                ) : (
                  venueReviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-emerald-700">{review.author.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{review.author}</div>
                            <div className="text-xs text-gray-400">{review.date}</div>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "rules" && (
              <ul className="space-y-3">
                {venue.houseRules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                    </div>
                    <span className="text-sm text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right / booking card */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Pricing</h3>
            <div className="space-y-3 mb-6">
              {Object.entries(venue.pricing).map(([slot, price]) => (
                <div key={slot} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{TIME_SLOTS[slot].label}</div>
                    <div className="text-xs text-gray-500">{TIME_SLOTS[slot].time}</div>
                  </div>
                  <div className="font-bold text-emerald-700">{formatMYR(price)}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("booking", { venueId: venue.id })}
              className="w-full py-3.5 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors shadow-sm"
            >
              Check Availability &amp; Book
            </button>
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Free cancellation up to 48 hours before</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BOOKING FLOW SHELL ──────────────────────

function BookingPage() {
  return (
    <ComingSoonShell
      title="Booking Flow"
      description="Multi-step booking: date selection, event details, contact info, and confirmation. Coming in Phase 4."
      icon={Calendar}
    />
  );
}

// ─── MY BOOKINGS SHELL ───────────────────────

function MyBookingsPage() {
  return (
    <ComingSoonShell
      title="My Bookings"
      description="Track your booking status from Pending → Approved → Confirmed. Coming in Phase 5."
      icon={BookOpen}
    />
  );
}

// ─── ADMIN LOGIN ─────────────────────────────

function AdminLoginPage() {
  const { dispatch, navigate, addToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (email === "admin@venue.com" && password === "admin123") {
      setLoading(true);
      setTimeout(() => {
        dispatch({ type: "LOGIN" });
        navigate("admin-dashboard");
        addToast("Welcome back, Admin!", "success");
      }, 600);
    } else {
      setError("Invalid credentials. Try admin@venue.com / admin123");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Anjung Management Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@venue.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              required
            />
          </div>
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <button
          onClick={() => navigate("home")}
          className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 text-center"
        >
          ← Back to Public Site
        </button>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD SHELL ───────────────────

function AdminDashboard() {
  const { state } = useApp();
  const total = state.bookings.length;
  const pending = state.bookings.filter((b) => b.status === "pending").length;
  const approved = state.bookings.filter((b) => b.status === "approved").length;
  const rejected = state.bookings.filter((b) => b.status === "rejected").length;
  const revenue = state.bookings
    .filter((b) => b.status === "approved")
    .reduce((sum, b) => sum + (b.estimatedCost || 0), 0);

  const statCards = [
    { label: "Total Bookings", value: total, icon: BookOpen, color: "blue", change: "+3 this week" },
    { label: "Pending Review", value: pending, icon: Clock, color: "amber", change: "Needs action" },
    { label: "Approved", value: approved, icon: CheckCircle, color: "emerald", change: "Confirmed" },
    { label: "Est. Revenue", value: formatMYR(revenue), icon: TrendingUp, color: "teal", change: "Approved only" },
  ];

  const colorMap = {
    blue: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    teal: "bg-teal-50 text-teal-600",
  };

  const recentBookings = [...state.bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
            <div className="text-xs text-gray-400 mt-1">{change}</div>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Bookings</h2>
          <span className="text-xs text-gray-400">Last 5</span>
        </div>
        <div className="divide-y divide-gray-50">
          {recentBookings.map((b) => {
            const cfg = getStatusConfig(b.status);
            return (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50">
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-gray-900 truncate">{b.clientName}</div>
                  <div className="text-xs text-gray-500">{b.id} · {b.venueName}</div>
                </div>
                <div className="text-xs text-gray-500 hidden sm:block">{b.date}</div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.color}`}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN BOOKINGS SHELL ────────────────────

function AdminBookingsPage() {
  const { state, dispatch, addToast } = useApp();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = state.bookings.filter((b) => {
    const matchStatus = filter === "all" || b.status === filter;
    const q = search.toLowerCase();
    const ref = (b.bookingRef || b.id || "").toLowerCase();
    const matchSearch = !q || b.clientName.toLowerCase().includes(q) || ref.includes(q);
    return matchStatus && matchSearch;
  });

  async function updateStatus(id, status) {
    try {
      await updateBookingApi(id, { status });
    } catch { /* optimistic — update locally regardless */ }
    dispatch({ type: "UPDATE_BOOKING", id, updates: { status } });
    addToast(`Booking ${status}.`, status === "approved" ? "success" : "error");
  }

  const filters = ["all", "pending", "approved", "rejected", "cancelled"];

  return (
    <div className="space-y-4">
      {/* Filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client name or reference..."
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === f ? "bg-emerald-700 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Reference", "Client", "Venue", "Date", "Slot", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                    No bookings found
                  </td>
                </tr>
              )}
              {filtered.map((b) => {
                const cfg = getStatusConfig(b.status);
                return (
                  <tr key={b.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-emerald-700 font-semibold">{b.bookingRef || b.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{b.clientName}</div>
                      <div className="text-xs text-gray-400">{b.clientEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{b.venueName}</td>
                    <td className="px-4 py-3 text-gray-700">{b.date}</td>
                    <td className="px-4 py-3 text-gray-700 capitalize">{b.timeSlot}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {b.status === "pending" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStatus(b.id, "approved")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(b.id, "rejected")}
                            className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN CALENDAR SHELL ────────────────────

function AdminCalendarPage() {
  return (
    <ComingSoonShell
      title="Booking Calendar"
      description="Monthly calendar view with color-coded bookings per venue and status. Coming in Phase 6."
      icon={CalendarDays}
    />
  );
}

// ─── ADMIN VENUES SHELL ──────────────────────

function AdminVenuesPage() {
  const { state, dispatch, addToast } = useApp();

  async function toggleActive(id, current) {
    try { await updateVenueApi(id, { active: !current }); } catch { /* optimistic */ }
    dispatch({ type: "UPDATE_VENUE", id, updates: { active: !current } });
    addToast(`Venue ${!current ? "activated" : "deactivated"}.`, "success");
  }

  async function handleDelete(id) {
    try { await deleteVenueApi(id); } catch { /* optimistic */ }
    dispatch({ type: "DELETE_VENUE", id });
    addToast("Venue removed.", "info");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">All Venues ({state.venues.length})</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-sm font-semibold hover:bg-emerald-800 transition-colors">
          <Plus className="w-4 h-4" /> Add Venue
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {state.venues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="relative h-32 bg-gray-100">
              <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold ${venue.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                {venue.active ? "Active" : "Inactive"}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-0.5">{venue.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{venue.type} · {venue.capacity} pax</p>
              <div className="flex items-center gap-2">
                <button className="flex-1 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => toggleActive(venue.id, venue.active)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${
                    venue.active
                      ? "border border-amber-200 text-amber-600 hover:bg-amber-50"
                      : "border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {venue.active ? <><Eye className="w-3.5 h-3.5" /> Hide</> : <><CheckCircle className="w-3.5 h-3.5" /> Show</>}
                </button>
                <button
                  onClick={() => handleDelete(venue.id)}
                  className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────

function Router() {
  const { state, navigate } = useApp();

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-950">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Building2 className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-white font-bold text-2xl tracking-tight mb-1">
            Anjung
          </h1>
          <p className="text-emerald-400 text-sm mb-4">Malaysia's Premier Event Spaces</p>
          <RefreshCw className="w-5 h-5 text-emerald-500 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Guard admin routes
  const adminViews = ["admin-dashboard", "admin-bookings", "admin-calendar", "admin-venues"];
  if (adminViews.includes(state.view) && !state.isAdmin) {
    return <AdminLoginPage />;
  }

  if (adminViews.includes(state.view)) {
    return (
      <AdminLayout>
        {state.view === "admin-dashboard" && <AdminDashboard />}
        {state.view === "admin-bookings" && <AdminBookingsPage />}
        {state.view === "admin-calendar" && <AdminCalendarPage />}
        {state.view === "admin-venues" && <AdminVenuesPage />}
      </AdminLayout>
    );
  }

  const publicViews = {
    home: <HomePage />,
    venues: <VenuesPage />,
    "venue-detail": <VenueDetailPage />,
    booking: <BookingPage />,
    "my-bookings": <MyBookingsPage />,
    "admin-login": <AdminLoginPage />,
  };

  return (
    <div>
      {state.view !== "admin-login" && <PublicNav />}
      {publicViews[state.view] || <HomePage />}
    </div>
  );
}

// ─────────────────────────────────────────────
// STYLES (inject animation)
// ─────────────────────────────────────────────

const globalStyles = `
  @keyframes slide-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-in { animation: slide-in 0.2s ease-out both; }
`;

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────

export default function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <AppProvider>
        <Router />
        <ToastContainer />
      </AppProvider>
    </>
  );
}
