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

const upsertAdminContent = async () => {
  await AdminContent.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        ratings: {
          driverRatings: [
            { id: 1, driver: "Kasun Bandara", route: "Route A", rating: 4.8, reviews: 234, lowRated: 8, flagged: 2, avgMonth: 4.7 },
            { id: 2, driver: "Sanduni Wijesinghe", route: "Route B", rating: 4.9, reviews: 312, lowRated: 3, flagged: 0, avgMonth: 4.9 },
            { id: 3, driver: "Nuwan Rajapaksa", route: "Route C", rating: 3.2, reviews: 145, lowRated: 45, flagged: 12, avgMonth: 3.5 },
          ],
          recentReviews: [
            { id: 1, parent: "Nimalka Perera", driver: "Kasun Bandara", rating: 5, comment: "Always on time and very friendly!", date: "2026-03-12", flagged: false },
            { id: 2, parent: "Dilini Fernando", driver: "Nuwan Rajapaksa", rating: 2, comment: "Consistently late and unprofessional.", date: "2026-03-10", flagged: true },
          ],
          routePerformance: [
            { route: "Route A", avgRating: 4.8, reviews: 234 },
            { route: "Route B", avgRating: 4.9, reviews: 312 },
            { route: "Route C", avgRating: 3.2, reviews: 145 },
          ],
        },
        reports: {
          userGrowthData: [
            { month: "Jan", parents: 980, drivers: 298 },
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
            { driver: "Kasun B.", rating: 4.8, trips: 234, onTime: 96 },
            { driver: "Nuwan R.", rating: 3.2, trips: 145, onTime: 78 },
          ],
        },
        complaints: [
          { id: "COMP-001", user: "Nimalka Perera", type: "parent", category: "Late Pickup", priority: "high", status: "open", date: "2026-03-12", assignedTo: "Admin Team" },
          { id: "COMP-002", user: "Kasun Bandara", type: "driver", category: "Route Issue", priority: "medium", status: "in-progress", date: "2026-03-11", assignedTo: "Sunil Admin" },
          { id: "COMP-003", user: "Dilini Fernando", type: "parent", category: "Safety Concern", priority: "high", status: "open", date: "2026-03-10", assignedTo: "Unassigned" },
        ],
        audit: {
          loginHistory: [
            { id: 1, user: "admin@eduride.lk", role: "Super Admin", action: "Login", ip: "192.168.1.10", location: "Colombo, LK", timestamp: "2026-03-14 09:15:23", status: "success" },
            { id: 2, user: "unknown@email.com", role: "Unknown", action: "Failed Login", ip: "45.123.67.89", location: "Unknown", timestamp: "2026-03-14 07:30:11", status: "failed" },
          ],
          adminActions: [
            { id: 1, admin: "Sunil Admin", action: "Suspended Driver", target: "Nuwan Rajapaksa", details: "Low rating suspension", timestamp: "2026-03-14 10:30:00", severity: "high" },
            { id: 2, admin: "Amali Admin", action: "Updated Payment Settings", target: "Commission Rate", details: "Changed from 4% to 5%", timestamp: "2026-03-14 09:15:00", severity: "medium" },
          ],
          suspiciousActivity: [
            { id: 1, type: "Multiple Failed Logins", description: "5 failed login attempts from IP 45.123.67.89", severity: "high", timestamp: "2026-03-14 07:30:11", status: "investigating" },
          ],
        },
        communication: {
          notifications: [
            { id: 1, title: "System Maintenance", recipient: "All Users", type: "announcement", date: "2026-03-12", status: "sent" },
            { id: 2, title: "Route A Delay", recipient: "Route A Parents", type: "alert", date: "2026-03-11", status: "sent" },
          ],
          templates: [
            { id: 1, name: "Weather Alert", category: "Emergency", lastUsed: "2026-03-01" },
            { id: 2, name: "Payment Reminder", category: "Payment", lastUsed: "2026-03-10" },
          ],
        },
        settings: {
          features: [
            { id: 1, name: "Real-time Tracking", description: "Enable GPS tracking for buses", enabled: true },
            { id: 2, name: "Payment Reminders", description: "Automated payment reminder notifications", enabled: true },
            { id: 3, name: "Emergency Alerts", description: "Emergency broadcast system", enabled: true },
            { id: 4, name: "Driver Chat", description: "In-app messaging between parents and drivers", enabled: false },
            { id: 5, name: "Route Optimization", description: "AI-powered route suggestions", enabled: true },
            { id: 6, name: "Maintenance Alerts", description: "Vehicle maintenance reminders", enabled: false },
          ],
        },
        content: {
          termsContent:
            "Terms and Conditions\n\nLast Updated: March 18, 2026\n\n1. Acceptance of Terms\nBy accessing and using this bus tracking service, you agree to these terms.",
          privacyContent:
            "Privacy Policy\n\nLast Updated: March 18, 2026\n\n1. Information We Collect\nWe collect account, payment, and route-tracking details to provide the service.",
          faqs: [
            { id: 1, question: "How do I register as a parent?", answer: "Use the mobile app registration form and verify your account.", category: "Getting Started" },
            { id: 2, question: "How do I track my child bus?", answer: "Open the app and view real-time location from the parent dashboard.", category: "Tracking" },
          ],
        },
      },
    },
    { upsert: true, new: true }
  );
};

const seedCoreData = async () => {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    console.log("Core user data already exists. Skipping core entity seed.");
    return;
  }

  const adminId = new mongoose.Types.ObjectId();
  const driver1Id = new mongoose.Types.ObjectId();
  const driver2Id = new mongoose.Types.ObjectId();
  const parent1Id = new mongoose.Types.ObjectId();
  const parent2Id = new mongoose.Types.ObjectId();

  await User.insertMany([
    {
      _id: adminId,
      firebaseUid: "seed-admin-uid",
      email: "admin@eduride.local",
      fullName: "Seed Admin",
      phone: "+94770000001",
      role: "admin",
      status: "active",
      isVerified: true,
    },
    {
      _id: driver1Id,
      firebaseUid: "seed-driver-uid-1",
      email: "kasun.driver@eduride.local",
      fullName: "Kasun Bandara",
      phone: "+94770000002",
      role: "driver",
      status: "active",
      isVerified: true,
      rating: 4.8,
      reviewCount: 234,
      totalTrips: 312,
      school: "Royal College",
      monthlyFee: 25000,
    },
    {
      _id: driver2Id,
      firebaseUid: "seed-driver-uid-2",
      email: "sanduni.driver@eduride.local",
      fullName: "Sanduni Wijesinghe",
      phone: "+94770000003",
      role: "driver",
      status: "active",
      isVerified: true,
      rating: 4.9,
      reviewCount: 312,
      totalTrips: 410,
      school: "Visakha Vidyalaya",
      monthlyFee: 26000,
    },
    {
      _id: parent1Id,
      firebaseUid: "seed-parent-uid-1",
      email: "nimalka.parent@eduride.local",
      fullName: "Nimalka Perera",
      phone: "+94770000004",
      role: "parent",
      status: "active",
    },
    {
      _id: parent2Id,
      firebaseUid: "seed-parent-uid-2",
      email: "dilini.parent@eduride.local",
      fullName: "Dilini Fernando",
      phone: "+94770000005",
      role: "parent",
      status: "active",
    },
  ]);

  const [child1, child2] = await Child.insertMany([
    { parent: parent1Id, fullName: "Ayesh Perera", grade: "Grade 4", school: "Royal College", age: 9 },
    { parent: parent2Id, fullName: "Mihin Fernando", grade: "Grade 5", school: "Visakha Vidyalaya", age: 10 },
  ]);

  const [vehicle1, vehicle2] = await Vehicle.insertMany([
    {
      driver: driver1Id,
      make: "Toyota",
      model: "Hiace",
      year: "2021",
      licensePlate: "CAA-1001",
      capacity: 14,
      vehicleType: "van",
      isAC: true,
    },
    {
      driver: driver2Id,
      make: "Nissan",
      model: "Civilian",
      year: "2020",
      licensePlate: "CAB-2002",
      capacity: 25,
      vehicleType: "bus",
      isAC: true,
    },
  ]);

  const [route1, route2] = await Route.insertMany([
    {
      driver: driver1Id,
      vehicle: vehicle1._id,
      name: "Route A",
      school: "Royal College",
      schoolArrival: "07:20",
      schoolDeparture: "13:45",
      stops: [
        { location: "Nugegoda", pickupTime: "06:25", dropoffTime: "14:20", order: 0 },
        { location: "Kirulapone", pickupTime: "06:40", dropoffTime: "14:05", order: 1 },
      ],
      daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      status: "active",
      studentCount: 1,
    },
    {
      driver: driver2Id,
      vehicle: vehicle2._id,
      name: "Route B",
      school: "Visakha Vidyalaya",
      schoolArrival: "07:30",
      schoolDeparture: "14:00",
      stops: [
        { location: "Maharagama", pickupTime: "06:15", dropoffTime: "14:30", order: 0 },
        { location: "Nawala", pickupTime: "06:50", dropoffTime: "14:10", order: 1 },
      ],
      daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      status: "active",
      studentCount: 1,
    },
  ]);

  await Booking.insertMany([
    {
      parent: parent1Id,
      driver: driver1Id,
      child: child1._id,
      route: route1._id,
      pickupAddress: "Nugegoda",
      dropoffAddress: "Royal College",
      monthlyFee: 25000,
      startDate: daysAgo(30),
      status: "accepted",
    },
    {
      parent: parent2Id,
      driver: driver2Id,
      child: child2._id,
      route: route2._id,
      pickupAddress: "Maharagama",
      dropoffAddress: "Visakha Vidyalaya",
      monthlyFee: 26000,
      startDate: daysAgo(14),
      status: "pending",
    },
  ]);

  await Trip.insertMany([
    {
      driver: driver1Id,
      route: route1._id,
      type: "morning",
      status: "completed",
      students: [
        {
          child: child1._id,
          name: "Ayesh Perera",
          pickupAddress: "Nugegoda",
          pickupTime: "06:25",
          parentPhone: "+94770000004",
          status: "dropped-off",
          pickedUpAt: daysAgo(1),
          droppedOffAt: daysAgo(1),
        },
      ],
      startedAt: daysAgo(1),
      completedAt: daysAgo(1),
      distance: 18,
      duration: 55,
    },
  ]);

  console.log("Core dummy data inserted into users, children, vehicles, routes, bookings, and trips.");
};

const run = async () => {
  try {
    await connectDB();
    await seedCoreData();
    await upsertAdminContent();
    console.log("Admin content dummy data seeded/upserted successfully.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

run();
