import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "../lib/db.js";
import User from "../models/User.js";
import Child from "../models/Child.js";
import Vehicle from "../models/Vehicle.js";
import Route from "../models/Route.js";
import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";
import AdminContent from "../models/AdminContent.js";

dotenv.config();

const now = new Date();
const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

// ── name pools ──────────────────────────────────────────────────────────────
const maleFirst = [
  "Kasun", "Nuwan", "Chaminda", "Saman", "Priyantha", "Roshan", "Dimuth",
  "Lahiru", "Asanka", "Tharaka", "Chathura", "Harsha", "Sachith", "Malith",
  "Ravindu", "Dulaj", "Isuru", "Rukshan", "Dilan", "Nalin", "Thilina",
  "Janaka", "Chanaka", "Upul", "Mahesh",
];
const femaleFirst = [
  "Sanduni", "Dilini", "Nimalka", "Chathurika", "Imalka", "Sudhari",
  "Thilini", "Gayani", "Hasini", "Nadeesha", "Piyumi", "Anusha", "Hiruni",
  "Kumari", "Sachini", "Dilka", "Ruwini", "Kavindi", "Ishari", "Dulani",
];
const childFirst = [
  "Ayesh", "Mihin", "Sehara", "Dineth", "Kavya", "Yasith", "Thenuki",
  "Binath", "Amaya", "Ruveen", "Ishan", "Hasala", "Senudi", "Pahan",
  "Nethmini", "Dasun", "Chamath", "Sithmi", "Ranul", "Thisari",
];
const lastNames = [
  "Perera", "Fernando", "Silva", "Bandara", "Rajapaksa", "Wijesinghe",
  "Jayasinghe", "Gunawardena", "Dissanayake", "Wickramasinghe", "Senanayake",
  "Kulasekara", "Jayawardena", "Fonseka", "Karunaratne", "Amarasinghe",
  "Weerasinghe", "Pathirana", "Mendis", "Ranasinghe", "Kumara", "Liyanage",
  "Gamage", "Madushan", "Herath",
];

const schools = [
  "Royal College",
  "Visakha Vidyalaya",
  "Ananda College",
  "Devi Balika Vidyalaya",
  "D.S. Senanayake College",
  "Gothami Balika Vidyalaya",
  "Nalanda College",
  "Musaeus College",
];
const grades = ["Pre-K", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const areas = [
  "Colombo", "Nugegoda", "Maharagama", "Kirulapone", "Nawala", "Rajagiriya",
  "Kotte", "Battaramulla", "Malabe", "Kaduwela", "Kadawatha", "Kelaniya",
  "Wattala", "Dehiwala", "Mount Lavinia",
];
const vehicleTypes = [
  { make: "Toyota",     model: "Hiace",    type: "van",      capacity: 14 },
  { make: "Nissan",     model: "Civilian", type: "bus",      capacity: 25 },
  { make: "Toyota",     model: "Coaster",  type: "mini-bus", capacity: 30 },
  { make: "Isuzu",      model: "Elf",      type: "mini-bus", capacity: 20 },
  { make: "Mitsubishi", model: "Rosa",     type: "bus",      capacity: 28 },
];
const vehicleColors = ["White", "Silver", "Blue", "Yellow", "Orange", "Beige", "Cream"];
const insuranceProviders = [
  "Sri Lanka Insurance",
  "Ceylinco Insurance",
  "AIA Insurance",
  "Janashakthi Insurance",
  "HNB General Insurance",
  "Union Assurance",
];
// Returns a Date offset by ±months from today (negative = past)
const monthsFromNow = (n) => {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return d;
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pad  = (n, len = 3) => String(n).padStart(len, "0");
const hhmm = (h, m) => `${pad(h, 2)}:${pad(m % 60, 2)}`;

// ── admin content (unchanged) ────────────────────────────────────────────────
const upsertAdminContent = async () => {
  await AdminContent.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        ratings: {
          driverRatings: [
            { id: 1, driver: "Kasun Bandara",       route: "Route A", rating: 4.8, reviews: 234, lowRated: 8,  flagged: 2,  avgMonth: 4.7 },
            { id: 2, driver: "Sanduni Wijesinghe",  route: "Route B", rating: 4.9, reviews: 312, lowRated: 3,  flagged: 0,  avgMonth: 4.9 },
            { id: 3, driver: "Nuwan Rajapaksa",     route: "Route C", rating: 3.2, reviews: 145, lowRated: 45, flagged: 12, avgMonth: 3.5 },
          ],
          recentReviews: [
            { id: 1, parent: "Nimalka Perera",  driver: "Kasun Bandara",      rating: 5, comment: "Always on time and very friendly!", date: "2026-03-12", flagged: false },
            { id: 2, parent: "Dilini Fernando", driver: "Nuwan Rajapaksa",     rating: 2, comment: "Consistently late and unprofessional.", date: "2026-03-10", flagged: true },
          ],
          routePerformance: [
            { route: "Route A", avgRating: 4.8, reviews: 234 },
            { route: "Route B", avgRating: 4.9, reviews: 312 },
            { route: "Route C", avgRating: 3.2, reviews: 145 },
          ],
        },
        reports: {
          userGrowthData: [
            { month: "Jan", parents: 980,  drivers: 298 },
            { month: "Feb", parents: 1045, drivers: 315 },
            { month: "Mar", parents: 1098, drivers: 329 },
            { month: "Apr", parents: 1156, drivers: 345 },
            { month: "May", parents: 1189, drivers: 363 },
            { month: "Jun", parents: 1254, drivers: 381 },
          ],
          routeUtilizationData: [
            { route: "Route A", utilization: 93, capacity: 30, students: 28 },
            { route: "Route B", utilization: 97, capacity: 35, students: 34 },
            { route: "Route C", utilization: 73, capacity: 30, students: 22 },
          ],
          paymentTrendData: [
            { month: "Jan", revenue: 45000, transactions: 4500, avgPerTransaction: 10 },
            { month: "Feb", revenue: 52000, transactions: 5200, avgPerTransaction: 10 },
            { month: "Mar", revenue: 48000, transactions: 4800, avgPerTransaction: 10 },
            { month: "Apr", revenue: 61000, transactions: 6100, avgPerTransaction: 10 },
          ],
          driverPerformanceData: [
            { driver: "Sanduni W.", rating: 4.9, trips: 312, onTime: 98 },
            { driver: "Kasun B.",   rating: 4.8, trips: 234, onTime: 96 },
            { driver: "Nuwan R.",   rating: 3.2, trips: 145, onTime: 78 },
          ],
        },
        complaints: [
          { id: "COMP-001", user: "Nimalka Perera",  type: "parent", category: "Late Pickup",    priority: "high",   status: "open",        date: "2026-03-12", assignedTo: "Admin Team"  },
          { id: "COMP-002", user: "Kasun Bandara",   type: "driver", category: "Route Issue",    priority: "medium", status: "in-progress", date: "2026-03-11", assignedTo: "Sunil Admin" },
          { id: "COMP-003", user: "Dilini Fernando", type: "parent", category: "Safety Concern", priority: "high",   status: "open",        date: "2026-03-10", assignedTo: "Unassigned"  },
        ],
        audit: {
          loginHistory: [
            { id: 1, user: "admin@eduride.lk",   role: "Super Admin", action: "Login",        ip: "192.168.1.10", location: "Colombo, LK", timestamp: "2026-03-14 09:15:23", status: "success" },
            { id: 2, user: "unknown@email.com",  role: "Unknown",     action: "Failed Login", ip: "45.123.67.89", location: "Unknown",     timestamp: "2026-03-14 07:30:11", status: "failed"  },
          ],
          adminActions: [
            { id: 1, admin: "Sunil Admin", action: "Suspended Driver",        target: "Nuwan Rajapaksa", details: "Low rating suspension",      timestamp: "2026-03-14 10:30:00", severity: "high"   },
            { id: 2, admin: "Amali Admin", action: "Updated Payment Settings", target: "Commission Rate",  details: "Changed from 4% to 5%",      timestamp: "2026-03-14 09:15:00", severity: "medium" },
          ],
          suspiciousActivity: [
            { id: 1, type: "Multiple Failed Logins", description: "5 failed login attempts from IP 45.123.67.89", severity: "high", timestamp: "2026-03-14 07:30:11", status: "investigating" },
          ],
        },
        communication: {
          notifications: [
            { id: 1, title: "System Maintenance", recipient: "All Users",        type: "announcement", date: "2026-03-12", status: "sent" },
            { id: 2, title: "Route A Delay",       recipient: "Route A Parents",  type: "alert",        date: "2026-03-11", status: "sent" },
          ],
          templates: [
            { id: 1, name: "Weather Alert",     category: "Emergency", lastUsed: "2026-03-01" },
            { id: 2, name: "Payment Reminder",  category: "Payment",   lastUsed: "2026-03-10" },
          ],
        },
        settings: {
          features: [
            { id: 1, name: "Real-time Tracking",    description: "Enable GPS tracking for buses",                       enabled: true  },
            { id: 2, name: "Payment Reminders",      description: "Automated payment reminder notifications",            enabled: true  },
            { id: 3, name: "Emergency Alerts",       description: "Emergency broadcast system",                          enabled: true  },
            { id: 4, name: "Driver Chat",            description: "In-app messaging between parents and drivers",        enabled: false },
            { id: 5, name: "Route Optimization",     description: "AI-powered route suggestions",                        enabled: true  },
            { id: 6, name: "Maintenance Alerts",     description: "Vehicle maintenance reminders",                       enabled: false },
          ],
        },
        content: {
          termsContent:
            "Terms and Conditions\n\nLast Updated: March 18, 2026\n\n1. Acceptance of Terms\nBy accessing and using this bus tracking service, you agree to these terms.",
          privacyContent:
            "Privacy Policy\n\nLast Updated: March 18, 2026\n\n1. Information We Collect\nWe collect account, payment, and route-tracking details to provide the service.",
          faqs: [
            { id: 1, question: "How do I register as a parent?",    answer: "Use the mobile app registration form and verify your account.",             category: "Getting Started" },
            { id: 2, question: "How do I track my child bus?",      answer: "Open the app and view real-time location from the parent dashboard.",        category: "Tracking" },
          ],
        },
      },
    },
    { upsert: true, new: true }
  );
};

// ── bulk seed: 1 admin · 100 drivers · 100 parents · 200 children ───────────
const seedCoreData = async () => {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    console.log("Users already exist — skipping core seed. Drop the collections first to re-seed.");
    return;
  }

  // 1. Admin
  const adminId = new mongoose.Types.ObjectId();
  await User.create({
    _id: adminId,
    firebaseUid: "seed-admin-uid",
    email: "admin@eduride.local",
    fullName: "Seed Admin",
    phone: "+94770000001",
    role: "admin",
    status: "active",
    isVerified: true,
  });
  console.log("✓ Admin created");

  // 2. Drivers (100)
  const driverIds = [];
  const driverDocs = [];
  for (let i = 1; i <= 100; i++) {
    const id = new mongoose.Types.ObjectId();
    driverIds.push(id);
    const isFemale = i % 3 === 0;
    const firstName = isFemale ? pick(femaleFirst) : pick(maleFirst);
    const school = schools[(i - 1) % schools.length];
    driverDocs.push({
      _id: id,
      firebaseUid: `seed-driver-uid-${pad(i)}`,
      email: `driver${pad(i)}@eduride.local`,
      fullName: `${firstName} ${pick(lastNames)}`,
      phone: `+9477100${pad(i)}`,
      role: "driver",
      status: i <= 90 ? "active" : "pending",
      isVerified: i <= 85,
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      reviewCount: Math.floor(50 + Math.random() * 300),
      totalTrips: Math.floor(80 + Math.random() * 500),
      school,
      monthlyFee: Math.floor(20000 + Math.random() * 15000),
      areasServed: [pick(areas), pick(areas)],
      isAC: i % 2 === 0,
    });
  }
  await User.insertMany(driverDocs);
  console.log("✓ 100 drivers created");

  // 3. Parents (100)
  const parentIds = [];
  const parentDocs = [];
  for (let i = 1; i <= 100; i++) {
    const id = new mongoose.Types.ObjectId();
    parentIds.push(id);
    const isFemale = i % 2 === 0;
    const firstName = isFemale ? pick(femaleFirst) : pick(maleFirst);
    parentDocs.push({
      _id: id,
      firebaseUid: `seed-parent-uid-${pad(i)}`,
      email: `parent${pad(i)}@eduride.local`,
      fullName: `${firstName} ${pick(lastNames)}`,
      phone: `+9477200${pad(i)}`,
      role: "parent",
      status: "active",
    });
  }
  await User.insertMany(parentDocs);
  console.log("✓ 100 parents created");

  // 4. Children (200 — 2 per parent)
  const childDocs = [];
  for (let i = 0; i < 100; i++) {
    const school = schools[i % schools.length];
    for (let j = 0; j < 2; j++) {
      const idx = i * 2 + j;
      const grade = grades[idx % grades.length];
      const age = Math.min(5 + grades.indexOf(grade), 18);
      childDocs.push({
        parent: parentIds[i],
        fullName: `${childFirst[idx % childFirst.length]} ${pick(lastNames)}`,
        grade,
        school,
        age,
      });
    }
  }
  await Child.insertMany(childDocs);
  console.log("✓ 200 children created");

  // 5. Vehicles (100 — 1 per driver)
  const vehicleIds = [];
  const vehicleDocs = [];
  for (let i = 0; i < 100; i++) {
    const id = new mongoose.Types.ObjectId();
    vehicleIds.push(id);
    const vt = vehicleTypes[i % vehicleTypes.length];
    // Spread expiry dates: some expired, some expiring soon, most valid
    // Registration: bucket 0-9 expired, 10-19 within 30 days, rest 1-18 months ahead
    let regExpiry;
    if (i < 10)       regExpiry = monthsFromNow(-1 - (i % 3));        // expired
    else if (i < 20)  regExpiry = monthsFromNow(0);                    // within 30 days (today-ish)
    else              regExpiry = monthsFromNow(3 + (i % 18));         // valid
    // Insurance: similar spread, offset by 7 to mix differently
    let insExpiry;
    const ii = (i + 7) % 100;
    if (ii < 8)       insExpiry = monthsFromNow(-1 - (ii % 4));
    else if (ii < 16) insExpiry = monthsFromNow(0);
    else              insExpiry = monthsFromNow(2 + (ii % 12));

    const provider = pick(insuranceProviders);
    vehicleDocs.push({
      _id: id,
      driver: driverIds[i],
      make: vt.make,
      model: vt.model,
      year: String(2018 + (i % 7)),
      color: vehicleColors[i % vehicleColors.length],
      licensePlate: `SDB-${pad(i + 1)}`,
      capacity: vt.capacity,
      vehicleType: vt.type,
      isAC: i % 2 === 0,
      registrationExpiry: regExpiry,
      insuranceProvider: provider,
      insurancePolicy: `POL-${pad(i + 1, 4)}-${2025 + (i % 3)}`,
      insuranceExpiry: insExpiry,
    });
  }
  await Vehicle.insertMany(vehicleDocs);
  console.log("✓ 100 vehicles created");

  // 6. Routes (100 — 1 per driver)
  const routeDocs = [];
  for (let i = 0; i < 100; i++) {
    const school = schools[i % schools.length];
    const area1 = areas[i % areas.length];
    const area2 = areas[(i + 4) % areas.length];
    routeDocs.push({
      driver: driverIds[i],
      vehicle: vehicleIds[i],
      name: `Route ${pad(i + 1)}`,
      school,
      schoolArrival:   hhmm(7, 15 + (i % 30)),
      schoolDeparture: hhmm(13, 30 + (i % 30)),
      stops: [
        { location: area1, pickupTime: hhmm(6, i * 7),      dropoffTime: hhmm(14, i * 5),      order: 0 },
        { location: area2, pickupTime: hhmm(6, i * 7 + 15), dropoffTime: hhmm(14, i * 5 + 15), order: 1 },
      ],
      daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      status: "active",
      studentCount: 2,
    });
  }
  await Route.insertMany(routeDocs);
  console.log("✓ 100 routes created");

  console.log("\nSeed complete: 1 admin · 100 drivers · 100 parents · 200 children · 100 vehicles · 100 routes");
};

// ── entry point ──────────────────────────────────────────────────────────────
const run = async () => {
  try {
    await connectDB();
    await seedCoreData();
    await upsertAdminContent();
    console.log("✓ Admin content upserted");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

run();
