import { Router } from "express";
import { createBooking, getBookings, getBookingById, acceptBooking, rejectBooking, cancelBooking } from "../controllers/bookingController.js";
import { validate } from "../middleware/validate.js";
import { bookingListQuerySchema, bookingRejectSchema, createBookingSchema, idParamSchema } from "../validators/schemas.js";

const router = Router();

router.post("/", validate({ body: createBookingSchema }), createBooking);
router.get("/", validate({ query: bookingListQuerySchema }), getBookings);
router.get("/:id", validate({ params: idParamSchema }), getBookingById);
router.put("/:id/accept", validate({ params: idParamSchema }), acceptBooking);
router.put("/:id/reject", validate({ params: idParamSchema, body: bookingRejectSchema }), rejectBooking);
router.put("/:id/cancel", validate({ params: idParamSchema }), cancelBooking);

export default router;
