import Route from "../models/Route.js";
import { escapeRegex, parsePagination } from "../utils/validation.js";

// GET /api/routes — Public: list/search routes
export const listRoutes = async (req, res) => {
  const { school, status, driver, search, page = 1, limit = 20 } = req.query;
  const pagination = parsePagination(page, limit);

  const filter = {};
  if (school) filter.school = { $regex: escapeRegex(school), $options: "i" };
  if (status) filter.status = status;
  if (driver) filter.driver = driver;
  if (search) {
    const safeSearch = escapeRegex(search);
    filter.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { school: { $regex: safeSearch, $options: "i" } },
      { "stops.location": { $regex: safeSearch, $options: "i" } },
    ];
  }

  const [routes, total] = await Promise.all([
    Route.find(filter)
      .populate("driver", "fullName email phone rating reviewCount monthlyFee isVerified profilePhoto areasServed isAC")
      .populate("vehicle", "make model vehicleType capacity licensePlate isAC")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Route.countDocuments(filter),
  ]);

  res.json({
    routes,
    pagination: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      pages: Math.ceil(total / pagination.limit),
    },
  });
};

// POST /api/routes — Driver: create route
export const createRoute = async (req, res) => {
  const { name, school, vehicle, schoolArrival, schoolDeparture, stops, daysOfOperation } = req.body;

  if (!name || !school) {
    return res.status(400).json({ error: "name and school are required" });
  }

  const route = await Route.create({
    driver: req.user._id,
    vehicle: vehicle || null,
    name,
    school,
    schoolArrival: schoolArrival || null,
    schoolDeparture: schoolDeparture || null,
    stops: stops || [],
    daysOfOperation: daysOfOperation || [],
  });

  res.status(201).json({ message: "Route created", route });
};

// GET /api/routes/:id — Public: get route details
export const getRouteById = async (req, res) => {
  const route = await Route.findById(req.params.id)
    .populate("driver", "fullName email phone rating reviewCount monthlyFee isVerified profilePhoto areasServed experience school isAC")
    .populate("vehicle", "make model year color vehicleType capacity licensePlate isAC");

  if (!route) {
    return res.status(404).json({ error: "Route not found" });
  }

  res.json({ route });
};

// PUT /api/routes/:id — Driver: update own route
export const updateRoute = async (req, res) => {
  const route = await Route.findOne({ _id: req.params.id, driver: req.user._id });
  if (!route) {
    return res.status(404).json({ error: "Route not found or not owned by you" });
  }

  const allowedFields = ["name", "school", "vehicle", "schoolArrival", "schoolDeparture", "daysOfOperation", "status"];
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      route[field] = req.body[field];
    }
  }

  await route.save();
  res.json({ message: "Route updated", route });
};

// DELETE /api/routes/:id — Driver (own) or admin
export const deleteRoute = async (req, res) => {
  const filter = { _id: req.params.id };
  if (req.user.role !== "admin") {
    filter.driver = req.user._id;
  }

  const route = await Route.findOneAndDelete(filter);
  if (!route) {
    return res.status(404).json({ error: "Route not found" });
  }

  res.json({ message: "Route deleted" });
};

// POST /api/routes/:id/stops — Driver: add stop
export const addStop = async (req, res) => {
  const route = await Route.findOne({ _id: req.params.id, driver: req.user._id });
  if (!route) {
    return res.status(404).json({ error: "Route not found or not owned by you" });
  }

  const { location, pickupTime, dropoffTime, latitude, longitude } = req.body;
  if (!location || !pickupTime) {
    return res.status(400).json({ error: "location and pickupTime are required" });
  }

  const order = route.stops.length;
  route.stops.push({
    location,
    pickupTime,
    dropoffTime: dropoffTime || null,
    latitude: latitude || null,
    longitude: longitude || null,
    order,
  });

  await route.save();
  res.status(201).json({ message: "Stop added", route });
};

// PUT /api/routes/:id/stops/:stopId — Driver: update stop
export const updateStop = async (req, res) => {
  const route = await Route.findOne({ _id: req.params.id, driver: req.user._id });
  if (!route) {
    return res.status(404).json({ error: "Route not found or not owned by you" });
  }

  const stop = route.stops.id(req.params.stopId);
  if (!stop) {
    return res.status(404).json({ error: "Stop not found" });
  }

  const allowedFields = ["location", "pickupTime", "dropoffTime", "latitude", "longitude", "order"];
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      stop[field] = req.body[field];
    }
  }

  await route.save();
  res.json({ message: "Stop updated", route });
};

// DELETE /api/routes/:id/stops/:stopId — Driver: remove stop
export const removeStop = async (req, res) => {
  const route = await Route.findOne({ _id: req.params.id, driver: req.user._id });
  if (!route) {
    return res.status(404).json({ error: "Route not found or not owned by you" });
  }

  const stop = route.stops.id(req.params.stopId);
  if (!stop) {
    return res.status(404).json({ error: "Stop not found" });
  }

  stop.deleteOne();
  await route.save();
  res.json({ message: "Stop removed", route });
};
