import Payment from "../models/Payment.js";
import PaymentMethod from "../models/PaymentMethod.js";
import Subscription from "../models/Subscription.js";
import Earning from "../models/Earning.js";
import { notify } from "../services/notificationService.js";

// GET /api/payments  — parent's payment history (driver scope handled via
// the dedicated /api/earnings routes).
export const listPayments = async (req, res) => {
  const filter = { parent: req.user._id };
  if (req.query.subscription) filter.subscription = req.query.subscription;
  if (req.query.status) filter.status = req.query.status;

  const payments = await Payment.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json({ payments });
};

// POST /api/payments — Records a payment. In Phase 1 the gateway is mocked:
// we look up the requested card, build a "Visa •••• 4242"-style method
// string, mark the row "completed", and roll the amount into the driver's
// monthly earnings if a subscription is attached.
export const createPayment = async (req, res) => {
  const { subscription: subscriptionId, paymentMethod, amount, description, currency } = req.body;

  let methodString = "Card";
  let card = null;
  if (paymentMethod) {
    card = await PaymentMethod.findOne({ _id: paymentMethod, parent: req.user._id });
    if (!card) return res.status(404).json({ error: "Payment method not found" });
    methodString = `${card.brand} •••• ${card.last4}`;
  }

  let sub = null;
  if (subscriptionId) {
    sub = await Subscription.findOne({ _id: subscriptionId, parent: req.user._id });
    if (!sub) return res.status(404).json({ error: "Subscription not found" });
  }

  const payment = await Payment.create({
    parent: req.user._id,
    driver: sub?.driver || null,
    subscription: sub?._id || null,
    paymentMethod: card?._id || null,
    amount,
    currency: currency || sub?.currency || "LKR",
    method: methodString,
    description: description || (sub ? "Monthly subscription" : "One-time payment"),
    status: "completed",
  });

  // Push next billing date forward by 30 days when this was a subscription
  // payment so the parent's dashboard reflects renewal.
  if (sub) {
    const next = sub.nextBillingDate ? new Date(sub.nextBillingDate) : new Date();
    next.setDate(next.getDate() + 30);
    sub.nextBillingDate = next;
    await sub.save();

    // Roll into the driver's monthly earnings row.
    const month = new Date().toISOString().slice(0, 7);
    const commissionRate = 0.1;
    const commission = Math.round(amount * commissionRate);
    await Earning.findOneAndUpdate(
      { driver: sub.driver, month },
      {
        $inc: {
          grossAmount: amount,
          commission,
          netAmount: amount - commission,
          rideCount: 0,
        },
        $setOnInsert: { driver: sub.driver, month },
      },
      { upsert: true, new: true }
    );

    // Notify both parties.
    notify(sub.parent, {
      type: "payment",
      title: "Payment received",
      body: `Your payment of ${payment.currency} ${amount.toLocaleString()} was successful.`,
      data: { paymentId: payment._id },
    }).catch(() => {});
    if (sub.driver) {
      notify(sub.driver, {
        type: "payment",
        title: "Subscription paid",
        body: `${payment.currency} ${amount.toLocaleString()} added to this month's earnings.`,
        data: { paymentId: payment._id },
      }).catch(() => {});
    }
  }

  res.status(201).json({ payment });
};

// GET /api/payments/:id
export const getPayment = async (req, res) => {
  const payment = await Payment.findOne({
    _id: req.params.id,
    $or: [{ parent: req.user._id }, { driver: req.user._id }],
  });
  if (!payment) return res.status(404).json({ error: "Payment not found" });
  res.json({ payment });
};
