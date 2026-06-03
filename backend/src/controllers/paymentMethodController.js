import PaymentMethod from "../models/PaymentMethod.js";

// GET /api/payment-methods
export const listPaymentMethods = async (req, res) => {
  const list = await PaymentMethod.find({ parent: req.user._id }).sort({
    isDefault: -1,
    createdAt: -1,
  });
  res.json({ paymentMethods: list });
};

// POST /api/payment-methods
export const createPaymentMethod = async (req, res) => {
  const body = req.body;

  // If the new card is the default, unset all others first.
  if (body.isDefault) {
    await PaymentMethod.updateMany({ parent: req.user._id }, { isDefault: false });
  }

  const method = await PaymentMethod.create({
    ...body,
    parent: req.user._id,
    isDefault: body.isDefault ?? false,
  });

  // If this is the first card for the parent, force it to default.
  const total = await PaymentMethod.countDocuments({ parent: req.user._id });
  if (total === 1) {
    method.isDefault = true;
    await method.save();
  }

  res.status(201).json({ paymentMethod: method });
};

// PUT /api/payment-methods/:id
export const updatePaymentMethod = async (req, res) => {
  const method = await PaymentMethod.findOne({ _id: req.params.id, parent: req.user._id });
  if (!method) return res.status(404).json({ error: "Payment method not found" });

  if (req.body.isDefault === true) {
    await PaymentMethod.updateMany(
      { parent: req.user._id, _id: { $ne: method._id } },
      { isDefault: false }
    );
  }

  Object.assign(method, req.body);
  await method.save();
  res.json({ paymentMethod: method });
};

// DELETE /api/payment-methods/:id
export const removePaymentMethod = async (req, res) => {
  const method = await PaymentMethod.findOneAndDelete({
    _id: req.params.id,
    parent: req.user._id,
  });
  if (!method) return res.status(404).json({ error: "Payment method not found" });

  // If we removed the default, promote whichever card is now most recent.
  if (method.isDefault) {
    const fallback = await PaymentMethod.findOne({ parent: req.user._id }).sort({ createdAt: -1 });
    if (fallback) {
      fallback.isDefault = true;
      await fallback.save();
    }
  }
  res.json({ ok: true });
};
