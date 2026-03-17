import Child from "../models/Child.js";

// GET /api/children — List parent's children
export const getChildren = async (req, res) => {
  const children = await Child.find({ parent: req.user._id }).sort({ createdAt: -1 });
  res.json({ children });
};

// POST /api/children — Add a child
export const addChild = async (req, res) => {
  const { fullName, grade, school, age, specialNotes } = req.body;

  if (!fullName || !grade || !school) {
    return res.status(400).json({ error: "fullName, grade, and school are required" });
  }

  const child = await Child.create({
    parent: req.user._id,
    fullName,
    grade,
    school,
    age: age || null,
    specialNotes: specialNotes || "",
  });

  res.status(201).json({ message: "Child added", child });
};

// PUT /api/children/:id — Update child
export const updateChild = async (req, res) => {
  const child = await Child.findOne({ _id: req.params.id, parent: req.user._id });
  if (!child) {
    return res.status(404).json({ error: "Child not found" });
  }

  const allowedFields = ["fullName", "grade", "school", "age", "specialNotes"];
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      child[field] = req.body[field];
    }
  }

  await child.save();

  res.json({ message: "Child updated", child });
};

// DELETE /api/children/:id — Remove child
export const removeChild = async (req, res) => {
  const child = await Child.findOneAndDelete({ _id: req.params.id, parent: req.user._id });
  if (!child) {
    return res.status(404).json({ error: "Child not found" });
  }

  res.json({ message: "Child removed" });
};
