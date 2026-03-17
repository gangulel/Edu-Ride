import Trip from "../models/Trip.js";
import Booking from "../models/Booking.js";
import Route from "../models/Route.js";
import User from "../models/User.js";

// POST /api/trips — Driver: start a trip
export const startTrip = async (req, res) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({ error: "Only drivers can start trips" });
  }

  const { route: routeId, type } = req.body;

  if (!routeId) {
    return res.status(400).json({ error: "route is required" });
  }

  // Verify route belongs to this driver
  const route = await Route.findOne({ _id: routeId, driver: req.user._id });
  if (!route) {
    return res.status(404).json({ error: "Route not found or not owned by you" });
  }

  // Check for existing active trip
  const activeTrip = await Trip.findOne({ driver: req.user._id, status: "in-progress" });
  if (activeTrip) {
    return res.status(400).json({ error: "You already have an active trip", tripId: activeTrip._id });
  }

  // Build student list from accepted bookings for this route
  const bookings = await Booking.find({
    driver: req.user._id,
    route: routeId,
    status: "accepted",
  }).populate("child", "fullName specialNotes").populate("parent", "phone");

  const students = bookings.map((booking) => ({
    child: booking.child._id,
    name: booking.child.fullName,
    pickupAddress: booking.pickupAddress,
    pickupTime: null,
    parentPhone: booking.parent?.phone || "",
    status: "waiting",
  }));

  const trip = await Trip.create({
    driver: req.user._id,
    route: routeId,
    type: type || "morning",
    status: "in-progress",
    students,
    startedAt: new Date(),
  });

  res.status(201).json({ message: "Trip started", trip });
};

// GET /api/trips/active — Get active trip
export const getActiveTrip = async (req, res) => {
  let filter = { status: "in-progress" };

  if (req.user.role === "driver") {
    filter.driver = req.user._id;
  } else if (req.user.role === "parent") {
    // Parent: find trips where their child is enrolled
    const bookings = await Booking.find({ parent: req.user._id, status: "accepted" });
    const driverIds = [...new Set(bookings.map((b) => b.driver.toString()))];
    filter.driver = { $in: driverIds };
  }

  const trip = await Trip.findOne(filter)
    .populate("route", "name school stops")
    .populate("driver", "fullName phone profilePhoto")
    .sort({ startedAt: -1 });

  if (!trip) {
    return res.status(404).json({ error: "No active trip found" });
  }

  res.json({ trip });
};

// PUT /api/trips/:id/student/:studentId — Driver: update student status
export const updateStudentStatus = async (req, res) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({ error: "Only drivers can update student status" });
  }

  const { status } = req.body;
  if (!status || !["waiting", "picked-up", "dropped-off", "absent"].includes(status)) {
    return res.status(400).json({ error: "Valid status is required: waiting, picked-up, dropped-off, absent" });
  }

  const trip = await Trip.findOne({ _id: req.params.id, driver: req.user._id, status: "in-progress" });
  if (!trip) {
    return res.status(404).json({ error: "Active trip not found" });
  }

  const student = trip.students.id(req.params.studentId);
  if (!student) {
    return res.status(404).json({ error: "Student not found in trip" });
  }

  student.status = status;
  if (status === "picked-up") {
    student.pickedUpAt = new Date();
  } else if (status === "dropped-off") {
    student.droppedOffAt = new Date();
  }

  await trip.save();
  res.json({ message: "Student status updated", trip });
};

// PUT /api/trips/:id/complete — Driver: complete trip
export const completeTrip = async (req, res) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({ error: "Only drivers can complete trips" });
  }

  const trip = await Trip.findOne({ _id: req.params.id, driver: req.user._id, status: "in-progress" });
  if (!trip) {
    return res.status(404).json({ error: "Active trip not found" });
  }

  trip.status = "completed";
  trip.completedAt = new Date();

  // Calculate duration in minutes
  if (trip.startedAt) {
    trip.duration = Math.round((trip.completedAt - trip.startedAt) / 60000);
  }

  if (req.body.distance) {
    trip.distance = req.body.distance;
  }

  await trip.save();

  // Update driver's total trips count
  await User.findByIdAndUpdate(req.user._id, { $inc: { totalTrips: 1 } });

  res.json({ message: "Trip completed", trip });
};

// GET /api/trips/history — Trip history
export const getTripHistory = async (req, res) => {
  const { page = 1, limit = 20, type } = req.query;

  const filter = { status: "completed" };

  if (req.user.role === "driver") {
    filter.driver = req.user._id;
  } else if (req.user.role === "parent") {
    // Parent: find completed trips that included their children
    const bookings = await Booking.find({ parent: req.user._id, status: "accepted" });
    const driverIds = [...new Set(bookings.map((b) => b.driver.toString()))];
    filter.driver = { $in: driverIds };
  }

  if (type) filter.type = type;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [trips, total] = await Promise.all([
    Trip.find(filter)
      .populate("route", "name school")
      .populate("driver", "fullName profilePhoto")
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Trip.countDocuments(filter),
  ]);

  res.json({
    trips,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
};
