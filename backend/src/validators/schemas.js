import { z } from "zod";
import {
  EMAIL_REGEX,
  LICENSE_PLATE_REGEX,
  PHONE_REGEX,
  TIME_24H_REGEX,
  VIN_REGEX,
  isValidObjectIdString,
} from "../utils/validation.js";

const roleSchema = z.enum(["parent", "driver", "admin"]);
const userStatusSchema = z.enum(["active", "pending", "suspended"]);
const bookingStatusSchema = z.enum(["pending", "accepted", "rejected", "cancelled", "expired"]);
const tripTypeSchema = z.enum(["morning", "afternoon"]);
const studentStatusSchema = z.enum(["waiting", "picked-up", "dropped-off", "absent"]);
const routeStatusSchema = z.enum(["active", "inactive"]);
const vehicleTypeSchema = z.enum(["van", "bus", "mini-bus", "sedan"]);
const childGradeSchema = z.enum(["Pre-K", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]);

const nonEmptyText = (fieldName, min = 1, max = 120) =>
  z
    .string({ required_error: `${fieldName} is required` })
    .trim()
    .min(min, `${fieldName} must be at least ${min} characters`)
    .max(max, `${fieldName} must be at most ${max} characters`);

const objectIdSchema = z
  .string()
  .trim()
  .refine((value) => isValidObjectIdString(value), "Invalid ObjectId");

const boolFromAny = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return value;
}, z.boolean());

const numberFromAny = (schema) =>
  z.preprocess((value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") return Number(value);
    return value;
  }, schema);

const optionalDate = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return null;
  return new Date(value);
}, z.date().nullable());

const requiredDate = z.preprocess((value) => new Date(value), z.date());

const paginationQuery = z
  .object({
    page: numberFromAny(z.number().int().min(1).max(10000)).optional(),
    limit: numberFromAny(z.number().int().min(1).max(1000)).optional(),
  })
  .partial();

export const authRegisterSchema = z
  .object({
    fullName: nonEmptyText("fullName", 2, 80),
    email: z.string().trim().toLowerCase().regex(EMAIL_REGEX, "Invalid email format"),
    phone: z.string().trim().regex(PHONE_REGEX, "Phone must be 7-15 digits and can include leading +"),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
    role: z.enum(["parent", "driver"]),
  })
  .strict();

export const authLoginSchema = z
  .object({
    email: z.string().trim().toLowerCase().regex(EMAIL_REGEX, "Invalid email format"),
    password: z.string().min(1, "Password is required").max(128),
  })
  .strict();

export const switchRoleSchema = z
  .object({
    targetRole: z.enum(["parent", "driver"]),
  })
  .strict();

export const adminLoginSchema = z
  .object({
    email: z.string().trim().toLowerCase().regex(EMAIL_REGEX, "Invalid email format"),
    password: z.string().min(8).max(128),
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: z.string().trim().toLowerCase().regex(EMAIL_REGEX, "Invalid email format"),
  })
  .strict();

export const googleAuthSchema = z
  .object({
    idToken: nonEmptyText("idToken", 20, 4096),
    role: z.enum(["parent", "driver"]).optional(),
  })
  .strict();

export const idParamSchema = z
  .object({
    id: objectIdSchema,
  })
  .strict();

export const userListQuerySchema = paginationQuery
  .extend({
    role: roleSchema.optional(),
    status: userStatusSchema.optional(),
    search: z.string().trim().max(120).optional(),
  })
  .strict();

export const updateUserSchema = z
  .object({
    fullName: nonEmptyText("fullName", 2, 80).optional(),
    phone: z.string().trim().regex(PHONE_REGEX, "Phone must be 7-15 digits and can include leading +").optional(),
    profilePhoto: z.string().trim().url("profilePhoto must be a valid URL").nullable().optional(),
    experience: nonEmptyText("experience", 1, 120).optional(),
    areasServed: z.array(nonEmptyText("areasServed item", 1, 120)).max(20).optional(),
    school: nonEmptyText("school", 2, 120).optional(),
    monthlyFee: numberFromAny(z.number().min(1).max(100000)).optional(),
    isAC: boolFromAny.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one field must be provided for update");

export const updateUserStatusSchema = z
  .object({
    status: userStatusSchema.optional(),
    isVerified: boolFromAny.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one status field must be provided");

export const createBookingSchema = z
  .object({
    driver: objectIdSchema,
    child: objectIdSchema,
    route: objectIdSchema.optional().nullable(),
    pickupAddress: nonEmptyText("pickupAddress", 5, 200),
    dropoffAddress: z.string().trim().max(200).nullable().optional(),
    monthlyFee: numberFromAny(z.number().min(1).max(100000)),
    startDate: requiredDate,
    specialInstructions: z.string().trim().max(500).optional(),
  })
  .strict();

export const bookingListQuerySchema = paginationQuery
  .extend({
    status: bookingStatusSchema.optional(),
  })
  .strict();

export const bookingRejectSchema = z
  .object({
    reason: z.string().trim().max(300).optional(),
  })
  .strict();

export const listRoutesQuerySchema = paginationQuery
  .extend({
    school: z.string().trim().max(120).optional(),
    status: routeStatusSchema.optional(),
    driver: objectIdSchema.optional(),
    search: z.string().trim().max(120).optional(),
  })
  .strict();

const stopSchema = z
  .object({
    location: nonEmptyText("location", 2, 180),
    pickupTime: z.string().trim().regex(TIME_24H_REGEX, "pickupTime must use HH:MM format"),
    dropoffTime: z.string().trim().regex(TIME_24H_REGEX, "dropoffTime must use HH:MM format").nullable().optional(),
    latitude: numberFromAny(z.number().min(-90).max(90)).nullable().optional(),
    longitude: numberFromAny(z.number().min(-180).max(180)).nullable().optional(),
    order: numberFromAny(z.number().int().min(0).max(1000)).optional(),
  })
  .strict();

const daysOfOperationSchema = z.array(z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]))
  .max(7)
  .optional();

export const createRouteSchema = z
  .object({
    name: nonEmptyText("name", 2, 120),
    school: nonEmptyText("school", 2, 120),
    vehicle: objectIdSchema.nullable().optional(),
    schoolArrival: z.string().trim().regex(TIME_24H_REGEX, "schoolArrival must use HH:MM format").nullable().optional(),
    schoolDeparture: z.string().trim().regex(TIME_24H_REGEX, "schoolDeparture must use HH:MM format").nullable().optional(),
    stops: z.array(stopSchema).max(100).optional(),
    daysOfOperation: daysOfOperationSchema,
  })
  .strict();

export const updateRouteSchema = z
  .object({
    name: nonEmptyText("name", 2, 120).optional(),
    school: nonEmptyText("school", 2, 120).optional(),
    vehicle: objectIdSchema.nullable().optional(),
    schoolArrival: z.string().trim().regex(TIME_24H_REGEX, "schoolArrival must use HH:MM format").nullable().optional(),
    schoolDeparture: z.string().trim().regex(TIME_24H_REGEX, "schoolDeparture must use HH:MM format").nullable().optional(),
    daysOfOperation: daysOfOperationSchema,
    status: routeStatusSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one field must be provided for update");

export const routeStopSchema = stopSchema.omit({ order: true });

export const updateStopSchema = stopSchema
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one stop field must be provided");

export const stopParamsSchema = z
  .object({
    id: objectIdSchema,
    stopId: objectIdSchema,
  })
  .strict();

export const createVehicleSchema = z
  .object({
    make: nonEmptyText("make", 2, 80),
    model: nonEmptyText("model", 1, 80),
    year: z
      .string()
      .trim()
      .regex(/^\d{4}$/, "year must be a 4-digit year")
      .refine((value) => {
        const y = Number(value);
        const current = new Date().getFullYear() + 1;
        return y >= 1980 && y <= current;
      }, "year must be between 1980 and next year"),
    color: z.string().trim().max(40).nullable().optional(),
    licensePlate: z.string().trim().toUpperCase().regex(LICENSE_PLATE_REGEX, "licensePlate format is invalid"),
    vin: z.string().trim().toUpperCase().regex(VIN_REGEX, "vin format is invalid").nullable().optional(),
    vehicleType: vehicleTypeSchema.optional(),
    capacity: numberFromAny(z.number().int().min(1).max(100)),
    registrationExpiry: optionalDate.optional(),
    insuranceProvider: z.string().trim().max(120).nullable().optional(),
    insurancePolicy: z.string().trim().max(80).nullable().optional(),
    insuranceExpiry: optionalDate.optional(),
    isAC: boolFromAny.optional(),
  })
  .strict();

export const updateVehicleSchema = createVehicleSchema
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one vehicle field must be provided");

export const startTripSchema = z
  .object({
    route: objectIdSchema,
    type: tripTypeSchema.optional(),
  })
  .strict();

export const updateStudentStatusSchema = z
  .object({
    status: studentStatusSchema,
  })
  .strict();

export const completeTripSchema = z
  .object({
    distance: numberFromAny(z.number().min(0).max(10000)).optional(),
  })
  .strict();

export const tripHistoryQuerySchema = paginationQuery
  .extend({
    type: tripTypeSchema.optional(),
  })
  .strict();

export const tripStudentParamsSchema = z
  .object({
    id: objectIdSchema,
    studentId: objectIdSchema,
  })
  .strict();

export const createChildSchema = z
  .object({
    fullName: nonEmptyText("fullName", 2, 80),
    grade: childGradeSchema,
    school: nonEmptyText("school", 2, 120),
    age: numberFromAny(z.number().int().min(3).max(25)).nullable().optional(),
    specialNotes: z.string().trim().max(500).optional(),
  })
  .strict();

export const updateChildSchema = createChildSchema
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one child field must be provided");
