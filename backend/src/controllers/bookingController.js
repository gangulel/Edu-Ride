import Booking from "../models/Booking.js";
import Route from "../models/Route.js";
import Child from "../models/Child.js";
import User from "../models/User.js";
import { parsePagination } from "../utils/validation.js";

// POST /api/bookings — Parent: create booking request
export const createBooking = async (req, res) => {
  if (req.user.role !== "parent") {
    return res.status(403).json({ error: "Only parents can create bookings" });
  }

  const { driver, child, route, pickupAddress, dropoffAddress, monthlyFee, startDate, specialInstructions } = req.body;

  const [driverUser, childRecord] = await Promise.all([
    User.findOne({ _id: driver, role: "driver", status: "active" }).select("_id"),
    Child.findOne({ _id: child, parent: req.user._id }).select("_id"),
  ]);

  if (!driverUser) {
    return res.status(400).json({ error: "Driver must exist and be active" });
  }

  if (!childRecord) {
    return res.status(400).json({ error: "Child must belong to the logged-in parent" });
  }

  if (new Date(startDate).getTime() <= Date.now()) {
    return res.status(400).json({ error: "startDate must be in the future" });
  }

  const existingActiveBooking = await Booking.findOne({
    parent: req.user._id,
    driver,
    child,
    status: { $in: ["pending", "accepted"] },
  }).select("_id");

  if (existingActiveBooking) {
    return res.status(409).json({ error: "An active booking already exists for this parent, child, and driver" });
  }

  if (route) {
    const routeDoc = await Route.findOne({ _id: route, driver }).select("_id");
    if (!routeDoc) {
      return res.status(400).json({ error: "Selected route does not belong to this driver" });
    }
  }

  const booking = await Booking.create({
    parent: req.user._id,
    driver,
    child,
    route: route || null,
    pickupAddress: pickupAddress.trim(),
    dropoffAddress: dropoffAddress || null,
    monthlyFee,
    startDate,
    specialInstructions: specialInstructions || "",
  });

  const populated = await Booking.findById(booking._id)
    .populate("parent", "fullName email phone")
    .populate("driver", "fullName email phone")
    .populate("child", "fullName grade school")
    .populate("route", "name school");

  res.status(201).json({ message: "Booking request created", booking: populated });
};

// GET /api/bookings — Role-filtered listing
export const getBookings = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const pagination = parsePagination(page, limit);

  const filter = {};
  if (req.user.role === "parent") {
    filter.parent = req.user._id;
  } else if (req.user.role === "driver") {
    filter.driver = req.user._id;
  }
  // Admin sees all

  if (status) filter.status = status;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate("parent", "fullName email phone")
      .populate("driver", "fullName email phone")
      .populate("child", "fullName grade school specialNotes")
      .populate("route", "name school")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Booking.countDocuments(filter),
  ]);

  res.json({
    bookings,
    pagination: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      pages: Math.ceil(total / pagination.limit),
    },
  });
};

// GET /api/bookings/:id — Get booking details
export const getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("parent", "fullName email phone")
    .populate("driver", "fullName email phone")
    .populate("child", "fullName grade school specialNotes")
    .populate("route", "name school stops");

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  // Only participants or admin can view
  const isParticipant =
    booking.parent._id.toString() === req.user._id.toString() ||
    booking.driver._id.toString() === req.user._id.toString();

  if (!isParticipant && req.user.role !== "admin") {
    return res.status(403).json({ error: "Insufficient permissions" });
  }

  res.json({ booking });
};

// PUT /api/bookings/:id/accept — Driver: accept booking
export const acceptBooking = async (req, res) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({ error: "Only drivers can accept bookings" });
  }

  const booking = await Booking.findOne({
    _id: req.params.id,
    driver: req.user._id,
    status: "pending",
  });

  if (!booking) {
    return res.status(404).json({ error: "Pending booking not found" });
  }

  booking.status = "accepted";
  await booking.save();

  // Increment route student count if route is linked
  if (booking.route) {
    await Route.findByIdAndUpdate(booking.route, { $inc: { studentCount: 1 } });
  }

  const populated = await Booking.findById(booking._id)
    .populate("parent", "fullName email phone")
    .populate("child", "fullName grade school");

  res.json({ message: "Booking accepted", booking: populated });
};

// PUT /api/bookings/:id/reject — Driver: reject booking
export const rejectBooking = async (req, res) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({ error: "Only drivers can reject bookings" });
  }

  const booking = await Booking.findOne({
    _id: req.params.id,
    driver: req.user._id,
    status: "pending",
  });

  if (!booking) {
    return res.status(404).json({ error: "Pending booking not found" });
  }

  booking.status = "rejected";
  booking.rejectionReason = req.body.reason || null;
  await booking.save();

  res.json({ message: "Booking rejected", booking });
};

// PUT /api/bookings/:id/cancel — Parent: cancel booking
export const cancelBooking = async (req, res) => {
  if (req.user.role !== "parent") {
    return res.status(403).json({ error: "Only parents can cancel bookings" });
  }

  const booking = await Booking.findOne({
    _id: req.params.id,
    parent: req.user._id,
    status: { $in: ["pending", "accepted"] },
  });

  if (!booking) {
    return res.status(404).json({ error: "Booking not found or cannot be cancelled" });
  }

  // Decrement route student count if was accepted and had a route
  if (booking.status === "accepted" && booking.route) {
    await Route.findByIdAndUpdate(booking.route, { $inc: { studentCount: -1 } });
  }

  booking.status = "cancelled";
  await booking.save();

  res.json({ message: "Booking cancelled", booking });
};
