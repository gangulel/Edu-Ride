import User from "../models/User.js";

// Get all users with optional filtering
export const getAllUsers = async (req, res) => {
  try {
    const { userType, status } = req.query;
    
    let filter = {};
    if (userType) filter.userType = userType;
    if (status) filter.status = status;

    const users = await User.find(filter)
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({ 
      success: true, 
      count: users.length,
      users 
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching users" 
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      user 
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching user" 
    });
  }
};

// Update user status (approve/suspend)
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'pending', 'suspended'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status value" 
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "User status updated successfully",
      user 
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating user status" 
    });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow password updates through this endpoint
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "User updated successfully",
      user 
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating user" 
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "User deleted successfully" 
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while deleting user" 
    });
  }
};

// Get statistics
export const getUserStats = async (req, res) => {
  try {
    const { userType } = req.query;

    const filter = userType ? { userType } : {};

    const total = await User.countDocuments(filter);
    const active = await User.countDocuments({ ...filter, status: 'active' });
    const pending = await User.countDocuments({ ...filter, status: 'pending' });
    const suspended = await User.countDocuments({ ...filter, status: 'suspended' });

    res.status(200).json({ 
      success: true, 
      stats: {
        total,
        active,
        pending,
        suspended
      }
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching statistics" 
    });
  }
};
