import { Router } from "express";
import { createBooking, getBookings, getBookingById, acceptBooking, rejectBooking, cancelBooking } from "../controllers/bookingController.js";

const router = Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/:id", getBookingById);
router.put("/:id/accept", acceptBooking);
router.put("/:id/reject", rejectBooking);
router.put("/:id/cancel", cancelBooking);

export default router;
