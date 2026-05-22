// Schemas for the new Phase 1 modules (payment, subscription, chat, review,
// notification, earning). Kept out of the main schemas.js so that file
// doesn't bloat further — both files re-export through the same
// validators/ namespace, so callers can import either source.

import { z } from "zod";
import { isValidObjectIdString } from "../utils/validation.js";

const objectIdSchema = z
  .string()
  .trim()
  .refine((v) => isValidObjectIdString(v), "Invalid ObjectId");

const boolFromAny = z.preprocess((v) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    if (v.toLowerCase() === "true") return true;
    if (v.toLowerCase() === "false") return false;
  }
  return v;
}, z.boolean());

// ───── Payment methods ─────

export const createPaymentMethodSchema = z
  .object({
    brand: z.enum(["Visa", "Mastercard", "Amex", "Discover", "Other"]).optional(),
    last4: z.string().regex(/^\d{4}$/, "last4 must be 4 digits"),
    expiryMonth: z.number().int().min(1).max(12),
    expiryYear: z.number().int().min(24).max(99),
    holder: z.string().trim().min(2).max(80),
    isDefault: boolFromAny.optional(),
  })
  .strict();

export const updatePaymentMethodSchema = z
  .object({
    isDefault: boolFromAny.optional(),
    holder: z.string().trim().min(2).max(80).optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, "Provide at least one field");

// ───── Payments ─────

export const createPaymentSchema = z
  .object({
    subscription: objectIdSchema.optional(),
    paymentMethod: objectIdSchema.optional(),
    amount: z.number().min(0),
    currency: z.string().trim().min(2).max(8).optional(),
    description: z.string().trim().max(200).optional(),
  })
  .strict();

// ───── Subscriptions ─────

export const createSubscriptionSchema = z
  .object({
    driver: objectIdSchema,
    child: objectIdSchema,
    booking: objectIdSchema.optional(),
    route: objectIdSchema.optional(),
    monthlyFee: z.number().min(0),
    currency: z.string().trim().min(2).max(8).optional(),
    pickupLocation: z.string().trim().min(3).max(200),
    dropoffLocation: z.string().trim().min(3).max(200),
    pickupTime: z.string().trim().max(20).optional(),
    dropTime: z.string().trim().max(20).optional(),
    startDate: z.preprocess((v) => (v ? new Date(v) : v), z.date()).optional(),
  })
  .strict();

export const updateSubscriptionSchema = z
  .object({
    status: z.enum(["active", "paused", "cancelled", "expired"]).optional(),
    pickupTime: z.string().trim().max(20).optional(),
    dropTime: z.string().trim().max(20).optional(),
    pickupLocation: z.string().trim().min(3).max(200).optional(),
    dropoffLocation: z.string().trim().min(3).max(200).optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, "Provide at least one field");

// ───── Reviews ─────

export const createReviewSchema = z
  .object({
    driver: objectIdSchema,
    rating: z.number().int().min(1).max(5),
    comment: z.string().trim().max(1000).optional(),
    subscription: objectIdSchema.optional(),
    booking: objectIdSchema.optional(),
  })
  .strict();

// ───── Conversations / messages ─────

export const createConversationSchema = z
  .object({
    counterpart: objectIdSchema,
  })
  .strict();

export const sendMessageSchema = z
  .object({
    text: z.string().trim().min(1, "Message cannot be empty").max(2000),
  })
  .strict();

// ───── Notifications ─────

export const createNotificationSchema = z
  .object({
    user: objectIdSchema,
    type: z.enum(["info", "ride", "payment", "message", "success", "warning", "system"]).optional(),
    title: z.string().trim().min(1).max(160),
    body: z.string().trim().min(1).max(1000),
    data: z.record(z.any()).optional(),
  })
  .strict();
