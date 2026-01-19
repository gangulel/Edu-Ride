import User from "../models/User.js";

// Register a new user (driver, parent, or student)
export const register = async (req, res) => {
  try {
    const { name, email, mobile, password, userType } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !password || !userType) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists" 
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      mobile,
      password, // In production, hash this password using bcrypt
      userType,
      status: userType === 'driver' ? 'pending' : 'active', // Drivers need admin approval
    });

    await newUser.save();

    // Don't send password in response
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      userType: newUser.userType,
      status: newUser.status
    };

    res.status(201).json({ 
      success: true, 
      message: "User registered successfully",
      user: userResponse
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during registration" 
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Check password (in production, use bcrypt.compare)
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Check if user is suspended
    if (user.status === 'suspended') {
      return res.status(403).json({ 
        success: false, 
        message: "Your account has been suspended. Please contact support." 
      });
    }

    // Don't send password in response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      userType: user.userType,
      status: user.status,
      vehicle: user.vehicle,
      route: user.route,
      rating: user.rating,
      trips: user.trips,
      children: user.children,
      complaints: user.complaints
    };

    res.status(200).json({ 
      success: true, 
      message: "Login successful",
      user: userResponse
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during login" 
    });
  }
};
