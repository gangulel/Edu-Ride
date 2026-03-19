import Vehicle from "../models/Vehicle.js";

// GET /api/vehicles
export const getVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({ driver: req.user._id }).sort({ createdAt: -1 });
  res.json({ vehicles });
};

// POST /api/vehicles
export const addVehicle = async (req, res) => {
  const { make, model, year, color, licensePlate, vin, vehicleType, capacity, registrationExpiry, insuranceProvider, insurancePolicy, insuranceExpiry, isAC } = req.body;

  const vehicle = await Vehicle.create({
    driver: req.user._id,
    make: make.trim(),
    model: model.trim(),
    year: year.trim(),
    color: color || null,
    licensePlate: licensePlate.trim().toUpperCase(),
    vin: vin || null,
    vehicleType: vehicleType || "van",
    capacity,
    registrationExpiry: registrationExpiry || null,
    insuranceProvider: insuranceProvider || null,
    insurancePolicy: insurancePolicy || null,
    insuranceExpiry: insuranceExpiry || null,
    isAC: isAC || false,
  });

  res.status(201).json({ message: "Vehicle added", vehicle });
};

// PUT /api/vehicles/:id
export const updateVehicle = async (req, res) => {
  const vehicle = await Vehicle.findOne({ _id: req.params.id, driver: req.user._id });
  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  const allowedFields = ["make", "model", "year", "color", "licensePlate", "vin", "vehicleType", "capacity", "registrationExpiry", "insuranceProvider", "insurancePolicy", "insuranceExpiry", "isAC"];
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      if (field === "licensePlate" && req.body[field]) {
        vehicle[field] = req.body[field].trim().toUpperCase();
      } else if ((field === "make" || field === "model" || field === "year") && req.body[field]) {
        vehicle[field] = req.body[field].trim();
      } else {
        vehicle[field] = req.body[field];
      }
    }
  }

  await vehicle.save();
  res.json({ message: "Vehicle updated", vehicle });
};

// DELETE /api/vehicles/:id
export const removeVehicle = async (req, res) => {
  const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, driver: req.user._id });
  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  res.json({ message: "Vehicle removed" });
};
