import express from "express";
import { 
  getAllUsers, 
  getUserById, 
  updateUserStatus, 
  updateUser, 
  deleteUser,
  getUserStats 
} from "../controllers/userController.js";

const router = express.Router();

// GET /api/users - Get all users (with optional filters: ?userType=driver&status=active)
router.get("/", getAllUsers);

// GET /api/users/stats - Get user statistics
router.get("/stats", getUserStats);

// GET /api/users/:id - Get user by ID
router.get("/:id", getUserById);

// PATCH /api/users/:id/status - Update user status
router.patch("/:id/status", updateUserStatus);

// PUT /api/users/:id - Update user details
router.put("/:id", updateUser);

// DELETE /api/users/:id - Delete user
router.delete("/:id", deleteUser);

export default router;
