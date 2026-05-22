/**
 * Seed script — populates the database with realistic sample data.
 *
 * Usage:
 *   npm run seed:dummy           # skip if data already exists
 *   npm run seed:dummy -- --force  # wipe and reseed
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { connectDB } from "../lib/db.js";
import User from "../models/User.js";
import Child from "../models/Child.js";
import Vehicle from "../models/Vehicle.js";
import Route from "../models/Route.js";
import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";
import Review from "../models/Review.js";
import AdminContent from "../models/AdminContent.js";

const daysAgo   = (n) => new Date(Date.now() - n * 86_400_000);
const daysAhead = (n) => new Date(Date.now() + n * 86_400_000);
const minsAgo   = (n) => new Date(Date.now() - n * 60_000);
const after     = (base, mins) => new Date(base.getTime() + mins * 60_000);

// ─── Users ───────────────────────────────────────────────────────────────────
async function seedUsers(hash) {
  const drivers = await User.insertMany([
    {
      email: "kasun.bandara@eduride.test",
      fullName: "Kasun Bandara",
      phone: "+94771000001",
      role: "driver",
      status: "active",
      passwordHash: hash,
      rating: 4.8,
      reviewCount: 234,
      totalTrips: 312,
      isVerified: true,
      experience: "8 years school transport experience",
      areasServed: ["Nugegoda", "Kirulapone", "Colombo 5"],
      school: "Royal College",
      monthlyFee: 25000,
      isAC: true,
      createdAt: daysAgo(180),
    },
    {
      email: "sanduni.wijesinghe@eduride.test",
      fullName: "Sanduni Wijesinghe",
      phone: "+94771000002",
      role: "driver",
      status: "active",
      passwordHash: hash,
      rating: 4.9,
      reviewCount: 312,
      totalTrips: 410,
      isVerified: true,
      experience: "10 years school transport experience",
      areasServed: ["Maharagama", "Nawala", "Rajagiriya"],
      school: "Visakha Vidyalaya",
      monthlyFee: 26000,
      isAC: true,
      createdAt: daysAgo(200),
    },
    {
      email: "nuwan.rajapaksa@eduride.test",
      fullName: "Nuwan Rajapaksa",
      phone: "+94771000003",
      role: "driver",
      status: "active",
      passwordHash: hash,
      rating: 3.8,
      reviewCount: 45,
      totalTrips: 67,
      isVerified: false,
      experience: "2 years school transport experience",
      areasServed: ["Borella", "Maradana", "Dematagoda"],
      school: "Nalanda College",
      monthlyFee: 20000,
      isAC: false,
      createdAt: daysAgo(30),
    },
    {
      email: "chamara.silva@eduride.test",
      fullName: "Chamara Silva",
      phone: "+94771000004",
      role: "driver",
      status: "pending",
      passwordHash: hash,
      rating: 0,
      reviewCount: 0,
      totalTrips: 0,
      isVerified: false,
      experience: "1 year school transport experience",
      areasServed: ["Colombo 4", "Pamankade"],
      school: "Ladies' College",
      monthlyFee: 22000,
      isAC: true,
      createdAt: daysAgo(10),
    },
    {
      email: "dilshan.mendis@eduride.test",
      fullName: "Dilshan Mendis",
      phone: "+94771000005",
      role: "driver",
      status: "pending",
      passwordHash: hash,
      rating: 0,
      reviewCount: 0,
      totalTrips: 0,
      isVerified: false,
      experience: "New driver",
      areasServed: ["Kandy"],
      school: "Dharmaraja College",
      monthlyFee: 18000,
      isAC: false,
      createdAt: daysAgo(5),
    },
  ]);

  const parents = await User.insertMany([
    {
      email: "nimalka.perera@eduride.test",
      fullName: "Nimalka Perera",
      phone: "+94772000001",
      role: "parent",
      status: "active",
      passwordHash: hash,
      createdAt: daysAgo(150),
    },
    {
      email: "dilini.fernando@eduride.test",
      fullName: "Dilini Fernando",
      phone: "+94772000002",
      role: "parent",
      status: "active",
      passwordHash: hash,
      createdAt: daysAgo(120),
    },
    {
      email: "ravi.jayasinghe@eduride.test",
      fullName: "Ravi Jayasinghe",
      phone: "+94772000003",
      role: "parent",
      status: "active",
      passwordHash: hash,
      createdAt: daysAgo(90),
    },
    {
      email: "amali.wickramasinghe@eduride.test",
      fullName: "Amali Wickramasinghe",
      phone: "+94772000004",
      role: "parent",
      status: "active",
      passwordHash: hash,
      createdAt: daysAgo(60),
    },
    {
      email: "thilina.senaratne@eduride.test",
      fullName: "Thilina Senaratne",
      phone: "+94772000005",
      role: "parent",
      status: "active",
      passwordHash: hash,
      createdAt: daysAgo(20),
    },
  ]);

  return { drivers, parents };
}

// ─── Vehicles ────────────────────────────────────────────────────────────────
async function seedVehicles(drivers) {
  return Vehicle.insertMany([
    {
      driver: drivers[0]._id,
      make: "Toyota", model: "HiAce", year: "2021", color: "White",
      licensePlate: "WP-CAB-1001", vehicleType: "van", capacity: 14, isAC: true,
      registrationExpiry: daysAhead(200),
      insuranceProvider: "Allianz Lanka", insurancePolicy: "AL-2024-00001",
      insuranceExpiry: daysAhead(200),
    },
    {
      driver: drivers[1]._id,
      make: "Nissan", model: "Civilian", year: "2020", color: "Yellow",
      licensePlate: "WP-BUS-2002", vehicleType: "bus", capacity: 25, isAC: true,
      registrationExpiry: daysAhead(150),
      insuranceProvider: "AIA Insurance", insurancePolicy: "AIA-2024-00002",
      insuranceExpiry: daysAhead(150),
    },
    {
      driver: drivers[2]._id,
      make: "Toyota", model: "Coaster", year: "2019", color: "Blue",
      licensePlate: "WP-VAN-3003", vehicleType: "mini-bus", capacity: 20, isAC: false,
      registrationExpiry: daysAhead(80),
      insuranceProvider: "Ceylinco Insurance", insurancePolicy: "CEY-2024-00003",
      insuranceExpiry: daysAhead(80),
    },
    {
      driver: drivers[3]._id,
      make: "Toyota", model: "KDH", year: "2022", color: "Silver",
      licensePlate: "WP-CAR-4004", vehicleType: "van", capacity: 12, isAC: true,
      registrationExpiry: daysAhead(300),
      insuranceProvider: "Allianz Lanka", insurancePolicy: "AL-2024-00004",
      insuranceExpiry: daysAhead(300),
    },
    {
      driver: drivers[4]._id,
      make: "Mitsubishi", model: "Rosa", year: "2018", color: "Orange",
      licensePlate: "CP-BUS-5005", vehicleType: "mini-bus", capacity: 22, isAC: false,
      registrationExpiry: daysAhead(40),
      insuranceProvider: "Ceylinco Insurance", insurancePolicy: "CEY-2024-00005",
      insuranceExpiry: daysAhead(40),
    },
  ]);
}

// ─── Routes ──────────────────────────────────────────────────────────────────
async function seedRoutes(drivers, vehicles) {
  return Route.insertMany([
    {
      driver: drivers[0]._id, vehicle: vehicles[0]._id,
      name: "Route A – Royal College Morning",
      school: "Royal College",
      schoolArrival: "07:20", schoolDeparture: "13:45",
      daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      status: "active", studentCount: 8,
      stops: [
        { order: 0, location: "Nugegoda Junction",   pickupTime: "06:25", dropoffTime: "14:20", latitude: 6.8721, longitude: 79.8894 },
        { order: 1, location: "Kirulapone Bridge",   pickupTime: "06:40", dropoffTime: "14:05", latitude: 6.8806, longitude: 79.8803 },
        { order: 2, location: "Thimbirigasyaya Rd",  pickupTime: "06:55", dropoffTime: "13:55", latitude: 6.8951, longitude: 79.8660 },
      ],
    },
    {
      driver: drivers[1]._id, vehicle: vehicles[1]._id,
      name: "Route B – Visakha Morning",
      school: "Visakha Vidyalaya",
      schoolArrival: "07:30", schoolDeparture: "14:00",
      daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      status: "active", studentCount: 12,
      stops: [
        { order: 0, location: "Maharagama Town",  pickupTime: "06:15", dropoffTime: "14:30", latitude: 6.8456, longitude: 79.9271 },
        { order: 1, location: "Nawala Junction",  pickupTime: "06:50", dropoffTime: "14:10", latitude: 6.8885, longitude: 79.8908 },
        { order: 2, location: "Rajagiriya",       pickupTime: "07:05", dropoffTime: "14:00", latitude: 6.9051, longitude: 79.8962 },
      ],
    },
    {
      driver: drivers[2]._id, vehicle: vehicles[2]._id,
      name: "Route C – Nalanda Morning",
      school: "Nalanda College",
      schoolArrival: "07:30", schoolDeparture: "13:45",
      daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      status: "active", studentCount: 5,
      stops: [
        { order: 0, location: "Borella Junction",    pickupTime: "06:50", dropoffTime: "14:10", latitude: 6.9157, longitude: 79.8741 },
        { order: 1, location: "Maradana Fly-over",   pickupTime: "07:00", dropoffTime: "13:55", latitude: 6.9231, longitude: 79.8720 },
        { order: 2, location: "Dematagoda",          pickupTime: "07:10", dropoffTime: "13:50", latitude: 6.9240, longitude: 79.8805 },
      ],
    },
    {
      driver: drivers[3]._id, vehicle: vehicles[3]._id,
      name: "Route D – Ladies College",
      school: "Ladies' College",
      schoolArrival: "07:30", schoolDeparture: "13:00",
      daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      status: "inactive", studentCount: 0,
      stops: [
        { order: 0, location: "Pamankade",      pickupTime: "07:00", latitude: 6.8799, longitude: 79.8658 },
        { order: 1, location: "Bambalapitiya",  pickupTime: "07:15", latitude: 6.8863, longitude: 79.8607 },
      ],
    },
    {
      driver: drivers[4]._id, vehicle: vehicles[4]._id,
      name: "Route E – Dharmaraja",
      school: "Dharmaraja College",
      schoolArrival: "07:30", schoolDeparture: "13:30",
      daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      status: "inactive", studentCount: 0,
      stops: [
        { order: 0, location: "Kandy Town",       pickupTime: "07:00", latitude: 7.2906, longitude: 80.6337 },
        { order: 1, location: "Peradeniya Road",  pickupTime: "07:15", latitude: 7.2674, longitude: 80.5967 },
      ],
    },
  ]);
}

// ─── Children ────────────────────────────────────────────────────────────────
async function seedChildren(parents) {
  return Child.insertMany([
    { parent: parents[0]._id, fullName: "Ayesh Perera",          grade: "4",   school: "Royal College",       age: 9,  createdAt: daysAgo(140) },
    { parent: parents[0]._id, fullName: "Dinuki Perera",          grade: "7",   school: "Royal College",       age: 13, createdAt: daysAgo(140) },
    { parent: parents[1]._id, fullName: "Mihin Fernando",         grade: "5",   school: "Visakha Vidyalaya",   age: 11, createdAt: daysAgo(110) },
    { parent: parents[1]._id, fullName: "Kaveesha Fernando",      grade: "2",   school: "Visakha Vidyalaya",   age: 8,  createdAt: daysAgo(110) },
    { parent: parents[2]._id, fullName: "Yasith Jayasinghe",      grade: "6",   school: "Nalanda College",     age: 12, createdAt: daysAgo(80)  },
    { parent: parents[2]._id, fullName: "Bhathiya Jayasinghe",    grade: "3",   school: "Nalanda College",     age: 9,  createdAt: daysAgo(80)  },
    { parent: parents[3]._id, fullName: "Senuri Wickramasinghe",  grade: "KG",  school: "Bishop's College",    age: 5,  createdAt: daysAgo(55)  },
    { parent: parents[3]._id, fullName: "Hasara Wickramasinghe",  grade: "1",   school: "Bishop's College",    age: 6,  createdAt: daysAgo(55)  },
    { parent: parents[4]._id, fullName: "Gimhan Senaratne",       grade: "8",   school: "Dharmaraja College",  age: 14, createdAt: daysAgo(18)  },
    { parent: parents[4]._id, fullName: "Malindu Senaratne",      grade: "4",   school: "Dharmaraja College",  age: 9,  createdAt: daysAgo(18)  },
  ]);
}

// ─── Bookings ────────────────────────────────────────────────────────────────
async function seedBookings(parents, drivers, children, routes) {
  return Booking.insertMany([
    { parent: parents[0]._id, driver: drivers[0]._id, child: children[0]._id, route: routes[0]._id, pickupAddress: "42 Nugegoda Rd, Colombo 05",         dropoffAddress: "Royal College, Reid Ave, Colombo 07",    monthlyFee: 25000, startDate: daysAgo(60),  status: "accepted",  createdAt: daysAgo(65) },
    { parent: parents[0]._id, driver: drivers[0]._id, child: children[1]._id, route: routes[0]._id, pickupAddress: "42 Nugegoda Rd, Colombo 05",         dropoffAddress: "Royal College, Reid Ave, Colombo 07",    monthlyFee: 25000, startDate: daysAgo(60),  status: "accepted",  createdAt: daysAgo(65) },
    { parent: parents[1]._id, driver: drivers[1]._id, child: children[2]._id, route: routes[1]._id, pickupAddress: "18 Maharagama High Level Rd",        dropoffAddress: "Visakha Vidyalaya, Wijerama Mawatha",    monthlyFee: 26000, startDate: daysAgo(50),  status: "accepted",  createdAt: daysAgo(55) },
    { parent: parents[1]._id, driver: drivers[1]._id, child: children[3]._id, route: routes[1]._id, pickupAddress: "18 Maharagama High Level Rd",        dropoffAddress: "Visakha Vidyalaya, Wijerama Mawatha",    monthlyFee: 26000, startDate: daysAgo(50),  status: "accepted",  createdAt: daysAgo(55) },
    { parent: parents[2]._id, driver: drivers[2]._id, child: children[4]._id, route: routes[2]._id, pickupAddress: "55 Borella Rd, Colombo 08",          dropoffAddress: "Nalanda College, Maradana, Colombo 10",  monthlyFee: 20000, startDate: daysAgo(40),  status: "accepted",  createdAt: daysAgo(45) },
    { parent: parents[2]._id, driver: drivers[0]._id, child: children[5]._id, route: routes[0]._id, pickupAddress: "55 Borella Rd, Colombo 08",          dropoffAddress: "Royal College, Reid Ave, Colombo 07",    monthlyFee: 25000, startDate: daysAhead(7), status: "pending",   createdAt: daysAgo(3)  },
    { parent: parents[3]._id, driver: drivers[0]._id, child: children[6]._id,                       pickupAddress: "11 Pamankade Rd, Colombo 06",        dropoffAddress: "Bishop's College, Colombo 03",           monthlyFee: 25000, startDate: daysAhead(5), status: "pending",   createdAt: daysAgo(2)  },
    { parent: parents[3]._id, driver: drivers[1]._id, child: children[7]._id,                       pickupAddress: "11 Pamankade Rd, Colombo 06",        dropoffAddress: "Bishop's College, Colombo 03",           monthlyFee: 26000, startDate: daysAhead(5), status: "pending",   createdAt: daysAgo(2)  },
    { parent: parents[4]._id, driver: drivers[2]._id, child: children[8]._id,                       pickupAddress: "23 Kandy Rd, Kandy",                 dropoffAddress: "Dharmaraja College, Kandy",              monthlyFee: 20000, startDate: daysAgo(25),  status: "rejected",  rejectionReason: "Route is full for this term.", createdAt: daysAgo(28) },
    { parent: parents[4]._id, driver: drivers[0]._id, child: children[9]._id,                       pickupAddress: "23 Kandy Rd, Kandy",                 dropoffAddress: "Royal College, Reid Ave, Colombo 07",    monthlyFee: 25000, startDate: daysAgo(20),  status: "cancelled", createdAt: daysAgo(22) },
  ]);
}

// ─── Trips ───────────────────────────────────────────────────────────────────
async function seedTrips(drivers, routes, children, parents) {
  const t1Start = daysAgo(2);
  const t2Start = daysAgo(1);
  const t3Start = daysAgo(1);

  return Trip.insertMany([
    {
      driver: drivers[0]._id, route: routes[0]._id, type: "morning", status: "completed",
      startedAt: t1Start, completedAt: after(t1Start, 90), distance: 14.5, duration: 90,
      students: [
        { child: children[0]._id, name: "Ayesh Perera",  pickupAddress: "42 Nugegoda Rd", pickupTime: "06:25", parentPhone: "+94772000001", status: "dropped-off", pickedUpAt: t1Start, droppedOffAt: after(t1Start, 55) },
        { child: children[1]._id, name: "Dinuki Perera", pickupAddress: "42 Nugegoda Rd", pickupTime: "06:25", parentPhone: "+94772000001", status: "dropped-off", pickedUpAt: t1Start, droppedOffAt: after(t1Start, 55) },
      ],
    },
    {
      driver: drivers[0]._id, route: routes[0]._id, type: "morning", status: "completed",
      startedAt: t2Start, completedAt: after(t2Start, 85), distance: 14.2, duration: 85,
      students: [
        { child: children[0]._id, name: "Ayesh Perera",  pickupAddress: "42 Nugegoda Rd", pickupTime: "06:25", parentPhone: "+94772000001", status: "dropped-off", pickedUpAt: t2Start, droppedOffAt: after(t2Start, 52) },
        { child: children[1]._id, name: "Dinuki Perera", pickupAddress: "42 Nugegoda Rd", pickupTime: "06:25", parentPhone: "+94772000001", status: "dropped-off", pickedUpAt: t2Start, droppedOffAt: after(t2Start, 52) },
      ],
    },
    {
      driver: drivers[1]._id, route: routes[1]._id, type: "morning", status: "completed",
      startedAt: t3Start, completedAt: after(t3Start, 80), distance: 18.3, duration: 80,
      students: [
        { child: children[2]._id, name: "Mihin Fernando",    pickupAddress: "18 Maharagama High Level Rd", pickupTime: "06:15", parentPhone: "+94772000002", status: "dropped-off", pickedUpAt: t3Start, droppedOffAt: after(t3Start, 60) },
        { child: children[3]._id, name: "Kaveesha Fernando", pickupAddress: "18 Maharagama High Level Rd", pickupTime: "06:15", parentPhone: "+94772000002", status: "dropped-off", pickedUpAt: t3Start, droppedOffAt: after(t3Start, 60) },
      ],
    },
    {
      driver: drivers[2]._id, route: routes[2]._id, type: "morning", status: "in-progress",
      startedAt: minsAgo(30),
      students: [
        { child: children[4]._id, name: "Yasith Jayasinghe",   pickupAddress: "55 Borella Rd", pickupTime: "06:50", parentPhone: "+94772000003", status: "picked-up", pickedUpAt: minsAgo(25) },
        { child: children[5]._id, name: "Bhathiya Jayasinghe", pickupAddress: "55 Borella Rd", pickupTime: "06:50", parentPhone: "+94772000003", status: "waiting" },
      ],
    },
    {
      driver: drivers[1]._id, route: routes[1]._id, type: "afternoon", status: "not-started",
      students: [
        { child: children[2]._id, name: "Mihin Fernando",    pickupAddress: "Visakha Vidyalaya, Wijerama Mawatha", pickupTime: "14:00", parentPhone: "+94772000002", status: "waiting" },
        { child: children[3]._id, name: "Kaveesha Fernando", pickupAddress: "Visakha Vidyalaya, Wijerama Mawatha", pickupTime: "14:00", parentPhone: "+94772000002", status: "waiting" },
      ],
    },
  ]);
}

// ─── Reviews (insertMany skips post-save hook; driver ratings set manually) ──
async function seedReviews(drivers, parents, bookings) {
  await Review.insertMany([
    { driver: drivers[0]._id, parent: parents[0]._id, booking: bookings[0]._id, rating: 5, comment: "Kasun is always punctual and very professional. My children love him!", createdAt: daysAgo(30) },
    { driver: drivers[0]._id, parent: parents[0]._id, booking: bookings[1]._id, rating: 5, comment: "Excellent service. Keeps parents updated about any delays.",            createdAt: daysAgo(25) },
    { driver: drivers[1]._id, parent: parents[1]._id, booking: bookings[2]._id, rating: 5, comment: "Sanduni is wonderful! The kids arrive home safe every day.",            createdAt: daysAgo(28) },
    { driver: drivers[1]._id, parent: parents[1]._id, booking: bookings[3]._id, rating: 5, comment: "Very professional and trustworthy. Highly recommended!",                createdAt: daysAgo(20) },
    { driver: drivers[2]._id, parent: parents[2]._id, booking: bookings[4]._id, rating: 4, comment: "Nuwan is generally reliable but sometimes a bit late in traffic.",      createdAt: daysAgo(15) },
  ]);
}

// ─── Admin content (upsert — never wiped) ────────────────────────────────────
async function upsertAdminContent() {
  await AdminContent.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        ratings: {
          driverRatings: [
            { id: 1, driver: "Kasun Bandara",      route: "Route A", rating: 4.8, reviews: 234, lowRated: 8,  flagged: 2,  avgMonth: 4.7 },
            { id: 2, driver: "Sanduni Wijesinghe", route: "Route B", rating: 4.9, reviews: 312, lowRated: 3,  flagged: 0,  avgMonth: 4.9 },
            { id: 3, driver: "Nuwan Rajapaksa",    route: "Route C", rating: 3.8, reviews: 45,  lowRated: 18, flagged: 5,  avgMonth: 3.9 },
          ],
          recentReviews: [
            { id: 1, parent: "Nimalka Perera",  driver: "Kasun Bandara",      rating: 5, comment: "Always on time and very friendly!", date: "2026-05-12", flagged: false },
            { id: 2, parent: "Dilini Fernando", driver: "Nuwan Rajapaksa",    rating: 2, comment: "Consistently late and unprofessional.", date: "2026-05-10", flagged: true },
          ],
          routePerformance: [
            { route: "Route A", avgRating: 4.8, reviews: 234 },
            { route: "Route B", avgRating: 4.9, reviews: 312 },
            { route: "Route C", avgRating: 3.8, reviews: 45  },
          ],
        },
        reports: {
          userGrowthData: [
            { month: "Dec", parents: 920,  drivers: 278 },
            { month: "Jan", parents: 980,  drivers: 298 },
            { month: "Feb", parents: 1045, drivers: 315 },
            { month: "Mar", parents: 1098, drivers: 329 },
            { month: "Apr", parents: 1156, drivers: 345 },
            { month: "May", parents: 1189, drivers: 363 },
          ],
          routeUtilizationData: [
            { route: "Route A", utilization: 93, capacity: 14, students: 13 },
            { route: "Route B", utilization: 96, capacity: 25, students: 24 },
            { route: "Route C", utilization: 75, capacity: 20, students: 15 },
          ],
          paymentTrendData: [
            { month: "Feb", revenue: 1820000, transactions: 70,  avgPerTransaction: 26000 },
            { month: "Mar", revenue: 1950000, transactions: 75,  avgPerTransaction: 26000 },
            { month: "Apr", revenue: 2080000, transactions: 80,  avgPerTransaction: 26000 },
            { month: "May", revenue: 2340000, transactions: 90,  avgPerTransaction: 26000 },
          ],
          driverPerformanceData: [
            { driver: "Sanduni W.", rating: 4.9, trips: 410, onTime: 98 },
            { driver: "Kasun B.",   rating: 4.8, trips: 312, onTime: 96 },
            { driver: "Nuwan R.",   rating: 3.8, trips: 67,  onTime: 78 },
          ],
        },
        complaints: [
          { id: "COMP-001", user: "Nimalka Perera",  type: "parent", category: "Late Pickup",    priority: "high",   status: "open",        date: "2026-05-12", assignedTo: "Admin Team" },
          { id: "COMP-002", user: "Kasun Bandara",   type: "driver", category: "Route Issue",    priority: "medium", status: "in-progress", date: "2026-05-11", assignedTo: "Sunil Admin" },
          { id: "COMP-003", user: "Dilini Fernando", type: "parent", category: "Safety Concern", priority: "high",   status: "open",        date: "2026-05-10", assignedTo: "Unassigned" },
        ],
        audit: {
          loginHistory: [
            { id: 1, user: "admin@edu-ride.test",  role: "Admin", action: "Login",       ip: "192.168.1.10", location: "Colombo, LK", timestamp: "2026-05-22 09:15:23", status: "success" },
            { id: 2, user: "unknown@hacker.io",    role: "Unknown", action: "Failed Login", ip: "45.123.67.89", location: "Unknown",     timestamp: "2026-05-22 07:30:11", status: "failed"  },
          ],
          adminActions: [
            { id: 1, admin: "Edu-Ride Admin", action: "Suspended Driver",         target: "Nuwan Rajapaksa", details: "Pending verification review", timestamp: "2026-05-20 10:30:00", severity: "high"   },
            { id: 2, admin: "Edu-Ride Admin", action: "Updated Commission Rate",  target: "Platform Settings",  details: "Changed from 4% to 5%",   timestamp: "2026-05-19 09:15:00", severity: "medium" },
          ],
          suspiciousActivity: [
            { id: 1, type: "Multiple Failed Logins", description: "5 failed login attempts from IP 45.123.67.89", severity: "high", timestamp: "2026-05-22 07:30:11", status: "investigating" },
          ],
        },
        communication: {
          notifications: [
            { id: 1, title: "System Maintenance Tonight",    recipient: "All Users",        type: "announcement", date: "2026-05-20", status: "sent" },
            { id: 2, title: "Route A Delay – Heavy Traffic", recipient: "Route A Parents",  type: "alert",        date: "2026-05-19", status: "sent" },
          ],
          templates: [
            { id: 1, name: "Weather Alert",     category: "Emergency", lastUsed: "2026-05-01" },
            { id: 2, name: "Payment Reminder",  category: "Payment",   lastUsed: "2026-05-10" },
            { id: 3, name: "Route Change",      category: "Operations",lastUsed: "2026-04-28" },
          ],
        },
        settings: {
          features: [
            { id: 1, name: "Real-time Tracking",   description: "Enable GPS tracking for vehicles", enabled: true  },
            { id: 2, name: "Payment Reminders",    description: "Automated payment reminder notifications", enabled: true  },
            { id: 3, name: "Emergency Alerts",     description: "Emergency broadcast system", enabled: true  },
            { id: 4, name: "Driver Chat",          description: "In-app messaging between parents and drivers", enabled: false },
            { id: 5, name: "Route Optimization",   description: "AI-powered route suggestions", enabled: true  },
            { id: 6, name: "Maintenance Alerts",   description: "Vehicle maintenance reminders", enabled: false },
          ],
        },
        content: {
          termsContent:  "Terms and Conditions\n\nLast Updated: May 22, 2026\n\n1. Acceptance of Terms\nBy using this service you agree to these terms.\n\n2. Use of Service\nEdu-Ride connects parents with school transport drivers.",
          privacyContent: "Privacy Policy\n\nLast Updated: May 22, 2026\n\n1. Information We Collect\nWe collect account, payment, and route data to provide the service.",
          faqs: [
            { id: 1, question: "How do I register as a parent?",    answer: "Use the mobile app registration form and verify your account.",              category: "Getting Started" },
            { id: 2, question: "How do I track my child's vehicle?", answer: "Open the app and tap 'Track' on the parent dashboard for real-time location.", category: "Tracking"        },
            { id: 3, question: "How are payments handled?",         answer: "Monthly fees are agreed between parent and driver at booking time.",           category: "Payments"        },
          ],
        },
      },
    },
    { upsert: true, new: true }
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  try {
    await connectDB();

    const force = process.argv.includes("--force");

    if (!force) {
      const count = await User.countDocuments();
      if (count > 0) {
        console.log(`Database already has ${count} users. Pass --force to wipe and reseed.`);
        await upsertAdminContent();
        console.log("Admin content updated.");
        await mongoose.disconnect();
        process.exit(0);
      }
    } else {
      console.log("--force: clearing existing data...");
      await Promise.all([
        User.deleteMany({}),
        Child.deleteMany({}),
        Vehicle.deleteMany({}),
        Route.deleteMany({}),
        Booking.deleteMany({}),
        Trip.deleteMany({}),
        Review.deleteMany({}),
      ]);
      console.log("Collections cleared.");
    }

    console.log("Hashing seed password...");
    const hash = await bcrypt.hash("Password123!", 10);

    console.log("Seeding users...");
    const { drivers, parents } = await seedUsers(hash);

    console.log("Seeding vehicles...");
    const vehicles = await seedVehicles(drivers);

    console.log("Seeding routes...");
    const routes = await seedRoutes(drivers, vehicles);

    console.log("Seeding children...");
    const children = await seedChildren(parents);

    console.log("Seeding bookings...");
    const bookings = await seedBookings(parents, drivers, children, routes);

    console.log("Seeding trips...");
    await seedTrips(drivers, routes, children, parents);

    console.log("Seeding reviews...");
    await seedReviews(drivers, parents, bookings);

    console.log("Upserting admin content...");
    await upsertAdminContent();

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Seed complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Drivers   5  (3 active, 2 pending)
  Parents   5  (all active)
  Vehicles  5
  Children  10 (2 per parent)
  Routes    5  (3 active, 2 inactive)
  Bookings  10 (5 accepted, 3 pending, 1 rejected, 1 cancelled)
  Trips     5  (3 completed, 1 in-progress, 1 not-started)
  Reviews   5

  Password for all accounts: Password123!
  Example:  kasun.bandara@eduride.test / Password123!
            nimalka.perera@eduride.test / Password123!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

run();
